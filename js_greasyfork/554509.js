    // ==UserScript==
    // @name         韩漫下载器
    // @namespace    http://tampermonkey.net/
    // @version      3.8.4
    // @description  批量下载manhwaclub网站上的漫画图片
    // @author       JIU
    // @match        https://manhwaclub.net/manga/*/*
    // @match        https://manhwaclub.net/
    // @match        https://manga18.club/manhwa/*
    // @match        https://manga18.club/
    // @match        https://mangadna.com/manga/*/*
    // @match        https://mangadna.com/
    // @match        https://mangaforfree.net/manga/*/*
    // @match        https://mangaforfree.net/
    // @match        https://mangaforfree.com/manga/*/*
    // @match        https://mangaforfree.com/
    // @match        https://manhwabuddy.com/manhwa/*/*
    // @match        https://manhwabuddy.com/
    // @grant        GM_download
    // @grant        GM_xmlhttpRequest
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @require      https://cdn.jsdelivr.net/npm/compromise@14.10.0/builds/compromise.min.js
    // @connect      manhwaclub.net
    // @connect      manga18.club
    // @connect      mangadna.com
    // @connect      mangaforfree.net
    // @connect      mangaforfree.com
    // @connect      manhwabuddy.com
    // @connect      *
// @downloadURL https://update.greasyfork.org/scripts/554509/%E9%9F%A9%E6%BC%AB%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554509/%E9%9F%A9%E6%BC%AB%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        console.log('========================================');
        console.log('🚀 韩漫下载器脚本已加载');
        console.log('版本: 1.8.4');
        console.log('当前URL:', window.location.href);
        console.log('========================================');

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
        let preferRawVersion = false; // 是否优先下载 raw 版（用户选择）
        let normalVersionBtn = null; // 英文版按钮
        let rawVersionBtn = null; // Raw版按钮
        let useZipDownload = false; // 自动下载时是否使用打包下载
        let noZipBtn = null; // 不打包按钮
        let zipModeBtn = null; // 打包按钮
        let mangaLibrary = null; // 漫画库数据
        let downloadHistory = null; // 下载历史记录

        // 支持的站点配置
        const SUPPORTED_SITES = [
            { name: 'manhwaclub', baseUrl: 'https://manhwaclub.net/manga/', pathType: 'manga' },
            { name: 'manga18', baseUrl: 'https://manga18.club/manhwa/', pathType: 'manhwa' },
            { name: 'mangadna', baseUrl: 'https://mangadna.com/manga/', pathType: 'manga' },
            { name: 'mangaforfree', baseUrl: 'https://mangaforfree.net/manga/', pathType: 'manga' },
            { name: 'mangaforfree-com', baseUrl: 'https://mangaforfree.com/manga/', pathType: 'manga' },
            { name: 'manhwabuddy', baseUrl: 'https://manhwabuddy.com/manhwa/', pathType: 'manhwa' }
        ];

        // 创建悬浮球（可拖拽，自动吸附到右边）
        function createFloatBall() {
            console.log('🎯 createFloatBall() 被调用');

            // 检查悬浮球是否已存在（兼容普通ID和mangadna的随机ID）
            if (document.getElementById('float-ball') || document.querySelector('[data-manga-downloader="true"]') || floatBall) {
                console.log('⚠️ 悬浮球已存在，跳过创建');
                return;
            }

            console.log('✓ 开始创建悬浮球...');

            // 针对 mangadna.com 使用特殊方法避免被 AdGuard 屏蔽
            const isMangadna = window.location.hostname.includes('mangadna.com');

            if (isMangadna) {
                console.log('🛡️ 检测到 mangadna.com，使用反屏蔽模式');
            }

            // 先注入强制显示的CSS样式
            const styleId = isMangadna ? 'manga-dl-style-' + Date.now() : 'float-ball-force-style';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;

                if (isMangadna) {
                    // 使用随机类名和属性选择器，避免被识别
                    const randomClass = 'mdl-' + Math.random().toString(36).substr(2, 9);
                    style.textContent = `
                        .${randomClass}, [data-manga-downloader="true"] {
                            position: fixed !important;
                            display: flex !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            pointer-events: auto !important;
                            z-index: 2147483647 !important;
                        }
                    `;
                    // 保存随机类名供后续使用
                    window._mangaDownloaderClass = randomClass;
                } else {
                    style.textContent = `
                        #float-ball {
                            position: fixed !important;
                            display: flex !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            pointer-events: auto !important;
                            z-index: 2147483647 !important;
                        }
                    `;
                }

                (document.head || document.documentElement).appendChild(style);
                console.log('✓ CSS样式已注入');
            }

            floatBall = document.createElement('div');

            if (isMangadna) {
                // 使用随机 ID 和自定义属性，避免被 AdGuard 识别
                floatBall.id = 'manga-dl-' + Math.random().toString(36).substr(2, 9);
                floatBall.className = window._mangaDownloaderClass || '';
                floatBall.setAttribute('data-manga-downloader', 'true');
                floatBall.setAttribute('role', 'button');
                floatBall.setAttribute('aria-label', 'Download Manager');
            } else {
                floatBall.id = 'float-ball';
            }

            floatBall.innerHTML = '📥';
            console.log('✓ 悬浮球元素已创建');

            // 恢复保存的位置
            const savedPosition = GM_getValue('floatBallPosition', null);
            let initialBottom = 30;
            let initialRight = 30;

            if (savedPosition) {
                initialBottom = savedPosition.bottom || 30;
                initialRight = savedPosition.right || 30;

                // 修正异常位置（如果超出屏幕范围）
                const maxBottom = window.innerHeight - 50;
                const maxRight = window.innerWidth - 50;

                if (initialBottom > maxBottom || initialBottom < 0) {
                    console.warn('⚠️ 保存的 bottom 位置异常:', initialBottom, '重置为 30');
                    initialBottom = 30;
                }
                if (initialRight > maxRight || initialRight < 0) {
                    console.warn('⚠️ 保存的 right 位置异常:', initialRight, '重置为 30');
                    initialRight = 30;
                }
            }

            console.log('悬浮球初始位置 - bottom:', initialBottom, 'right:', initialRight);

            // 悬浮球尺寸（适合手机端，更小）
            floatBall.style.cssText = `
                position: fixed !important;
                bottom: ${initialBottom}px !important;
                right: ${initialRight}px !important;
                width: 40px !important;
                height: 40px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                border-radius: 50% !important;
                cursor: move !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 18px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                z-index: 2147483647 !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                user-select: none !important;
                touch-action: none !important;
                visibility: visible !important;
                opacity: 1 !important;
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
            console.log('✅ 悬浮球已添加到页面');
            console.log('悬浮球元素:', floatBall);
            console.log('悬浮球是否在DOM中:', document.body.contains(floatBall));

            // 延迟检查显示状态
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(floatBall);
                console.log('悬浮球计算样式:');
                console.log('  display:', computedStyle.display);
                console.log('  visibility:', computedStyle.visibility);
                console.log('  opacity:', computedStyle.opacity);
                console.log('  z-index:', computedStyle.zIndex);
                console.log('  position:', computedStyle.position);
                console.log('  bottom:', computedStyle.bottom);
                console.log('  right:', computedStyle.right);
            }, 100);

            // 针对 mangadna.com 的增强反屏蔽保护
            if (window.location.hostname.includes('mangadna.com')) {
                console.log('🛡️ 启动 mangadna.com 增强反屏蔽保护');

                // 使用 MutationObserver 监控样式和属性变化
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            const computedStyle = window.getComputedStyle(floatBall);
                            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
                                console.warn('⚠️ 检测到悬浮球被隐藏，立即恢复显示');
                                floatBall.style.setProperty('display', 'flex', 'important');
                                floatBall.style.setProperty('visibility', 'visible', 'important');
                                floatBall.style.setProperty('opacity', '1', 'important');
                            }
                        }
                    });
                });

                observer.observe(floatBall, {
                    attributes: true,
                    attributeFilter: ['style', 'class', 'hidden']
                });

                // 高频定时检查（每200ms）
                setInterval(() => {
                    if (!document.body.contains(floatBall)) {
                        console.warn('⚠️ 悬浮球被从DOM中移除，重新添加');
                        document.body.appendChild(floatBall);
                    }

                    const computedStyle = window.getComputedStyle(floatBall);
                    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
                        console.warn('⚠️ 定时检查：悬浮球被隐藏，强制恢复');
                        floatBall.style.setProperty('display', 'flex', 'important');
                        floatBall.style.setProperty('visibility', 'visible', 'important');
                        floatBall.style.setProperty('opacity', '1', 'important');

                        // 移除可能被添加的隐藏属性
                        floatBall.removeAttribute('hidden');
                        floatBall.removeAttribute('aria-hidden');
                    }
                }, 200);

                // 监控 DOM 变化，防止被移除
                const bodyObserver = new MutationObserver(() => {
                    if (!document.body.contains(floatBall)) {
                        console.warn('⚠️ DOM变化检测：悬浮球丢失，重新添加');
                        document.body.appendChild(floatBall);
                    }
                });

                bodyObserver.observe(document.body, {
                    childList: true,
                    subtree: false
                });

                console.log('✅ 增强反屏蔽保护已启动');
            }
        }

        // 计算面板应该显示的位置和方向（避免遮挡悬浮球）
        function calculatePanelPosition() {
            if (!floatBall) return null;

            const rect = floatBall.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const panelWidth = 110;  // 更小宽度，适合手机端
            const panelHeight = 195; // 调整高度以适应新增的多本同下按钮
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
            console.log('🔄 togglePanel 被调用');
            console.log('buttonContainer:', buttonContainer);

            if (!buttonContainer) {
                console.log('⚠️ buttonContainer 不存在，创建UI');
                createDownloadUI();
            }

            isPanelVisible = !isPanelVisible;
            console.log('isPanelVisible:', isPanelVisible);

            if (isPanelVisible) {
                // 计算面板位置和箭头方向
                const result = calculatePanelPosition();
                console.log('面板位置计算结果:', result);

                if (result) {
                    applyPanelPosition(result.position, result.arrowDirection);
                }

                buttonContainer.style.display = 'block';
                console.log('✓ 面板已设置为 display: block');
                console.log('面板实际 display:', window.getComputedStyle(buttonContainer).display);
                console.log('面板位置:', {
                    left: buttonContainer.style.left,
                    right: buttonContainer.style.right,
                    top: buttonContainer.style.top,
                    bottom: buttonContainer.style.bottom
                });

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
            downloadButton.onclick = function() {
                // 根据用户选择的下载模式决定下载方式
                const currentZipMode = GM_getValue('useZipDownload', false);
                console.log('========== 手动下载调试 ==========');
                console.log(`GM_getValue('useZipDownload'): ${currentZipMode}`);
                console.log(`useZipDownload 变量: ${useZipDownload}`);
                console.log(`下载模式: ${currentZipMode ? '打包下载' : '普通下载'}`);

                if (currentZipMode) {
                    // 检测防盗链网站
                    const hostname = window.location.hostname;
                    const antiHotlinkSites = [
                        // 暂无防盗链网站
                    ];
                    const hasAntiHotlink = antiHotlinkSites.some(site => hostname.includes(site));

                    if (hasAntiHotlink) {
                        console.warn(`⚠️ 检测到防盗链网站: ${hostname}，自动降级为普通下载`);
                        batchDownload();
                    } else {
                        zipDownload();
                    }
                } else {
                    batchDownload();
                }
            };
            downloadButton.disabled = true;

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
                showHelpDialog();
            };

            // 显示帮助对话框
            function showHelpDialog() {
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 9999999; display: flex; align-items: center; justify-content: center; overflow: auto;';
                overlay.onclick = (e) => {
                    if (e.target === overlay) document.body.removeChild(overlay);
                };

                const dialog = document.createElement('div');
                dialog.style.cssText = 'background: white; border-radius: 12px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-width: 500px; width: 95%; max-height: 85vh; overflow-y: auto;';

                dialog.innerHTML = '<h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">📖 韩漫下载器 使用说明</h2>' +
                    '<div style="font-size: 13px; line-height: 1.8; color: #444;">' +
                    '<p style="background: #e3f2fd; padding: 10px; border-radius: 6px; margin-bottom: 15px;"><strong>💡 支持网站：</strong>manhwaclub.net、manga18.club、mangadna.com、mangaforfree.net/com、manhwabuddy.com</p>' +

                    '<h3 style="color: #4CAF50; margin: 15px 0 10px 0; font-size: 14px;">🎯 基础下载流程</h3>' +
                    '<ol style="margin: 0; padding-left: 20px;">' +
                    '<li><strong>滚动加载</strong> - 先将漫画页面拉到底部，确保所有图片加载完成</li>' +
                    '<li><strong>点击扫描</strong> - 点击「🔍 扫描」按钮扫描页面图片</li>' +
                    '<li><strong>点击下载</strong> - 点击「⬇️ 下载」开始批量下载</li>' +
                    '<li><strong>下一章</strong> - 下载完成后刷新页面或跳转下一章继续</li>' +
                    '</ol>' +

                    '<h3 style="color: #2196F3; margin: 15px 0 10px 0; font-size: 14px;">⚙️ 功能按钮说明</h3>' +
                    '<ul style="margin: 0; padding-left: 20px;">' +
                    '<li><strong>章节号 + 跳转</strong> - 输入章节号，跳转到指定章节</li>' +
                    '<li><strong>📖英文 / 📜Raw</strong> - 选择图片版本（英文版或Raw原版）</li>' +
                    '<li><strong>📄不打包 / 📦打包</strong> - 选择下载模式<br>• 不打包：逐张下载图片，文件名格式「序号-漫画名-章节_原名」<br>• 打包：下载完成后打包成ZIP文件</li>' +
                    '<li><strong>🚀 自动下载</strong> - 开启后自动扫描并下载当前章节，完成后跳转下一章</li>' +
                    '</ul>' +

                    '<h3 style="color: #9C27B0; margin: 15px 0 10px 0; font-size: 14px;">📚 漫画库功能</h3>' +
                    '<ul style="margin: 0; padding-left: 20px;">' +
                    '<li><strong>🔎 搜索</strong> - 搜索漫画库中的漫画，快速跳转到指定章节</li>' +
                    '<li><strong>⭐ 收藏</strong> - 将当前漫画添加到漫画库<br>• 新建中文漫画：创建新漫画条目<br>• 新建分组：创建分组并添加漫画<br>• 添加到已有：为已有漫画添加英文别名</li>' +
                    '<li><strong>📚 漫画库</strong> - 管理收藏的漫画<br>• 支持分组管理<br>• 一个中文名可对应多个英文名<br>• 点击英文名可快速跳转到各网站<br>• 支持导入/导出漫画库数据</li>' +
                    '</ul>' +

                    '<h3 style="color: #FF9800; margin: 15px 0 10px 0; font-size: 14px;">💡 使用技巧</h3>' +
                    '<ul style="margin: 0; padding-left: 20px;">' +
                    '<li>建议关闭浏览器「每次下载都询问保存位置」的设置</li>' +
                    '<li>点击悬浮球可展开/收起控制面板</li>' +
                    '<li>脚本会自动记住你的版本和下载模式偏好</li>' +
                    '<li>遇到防盗链网站会自动切换到普通下载模式</li>' +
                    '</ul>' +

                    '<p style="background: #fff3e0; padding: 10px; border-radius: 6px; margin-top: 15px; font-size: 12px;"><strong>⚠️ 注意：</strong>电脑端体验更佳。如遇下载失败，请尝试刷新页面或切换下载模式。</p>' +
                    '</div>' +

                    '<button id="help-close-btn" style="width: 100%; padding: 12px; margin-top: 15px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">知道了</button>';

                overlay.appendChild(dialog);
                document.body.appendChild(overlay);

                dialog.querySelector('#help-close-btn').onclick = () => {
                    document.body.removeChild(overlay);
                };
            }

            // 章节输入框
            const chapterInputContainer = document.createElement('div');
            chapterInputContainer.style.cssText = `
                width: 100%;
                margin-bottom: 3px;
                display: flex;
                gap: 3px;
            `;

            const chapterInput = document.createElement('input');
            chapterInput.id = 'chapter-input';
            chapterInput.type = 'number';
            chapterInput.placeholder = '章节号';
            chapterInput.style.cssText = `
                width: 60%;
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 11px;
                text-align: center;
            `;

            const goButton = document.createElement('button');
            goButton.textContent = '跳转';
            goButton.style.cssText = `
                width: 38%;
                padding: 6px;
                background: #00BCD4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            `;
            goButton.onclick = function() {
                const targetChapter = parseInt(chapterInput.value);
                if (!targetChapter || targetChapter < 1) {
                    alert('请输入有效的章节号');
                    return;
                }

                // 显示下载模式选择
                showDownloadModeDialog(targetChapter);
            };

            chapterInputContainer.appendChild(chapterInput);
            chapterInputContainer.appendChild(goButton);

            // 版本选择按钮容器
            const versionSelectContainer = document.createElement('div');
            versionSelectContainer.style.cssText = `
                width: 100%;
                margin-bottom: 3px;
                display: flex;
                gap: 3px;
            `;

            // 英文版按钮
            normalVersionBtn = document.createElement('button');
            normalVersionBtn.textContent = '📖英文';
            normalVersionBtn.style.cssText = `
                flex: 1;
                padding: 6px 2px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                opacity: 1;
                transition: opacity 0.2s ease;
            `;
            normalVersionBtn.onclick = function() {
                preferRawVersion = false;
                GM_setValue('preferRawVersion', false);
                updateVersionButtons();
                console.log('📌 用户选择：优先英文版');
            };

            // Raw版按钮
            rawVersionBtn = document.createElement('button');
            rawVersionBtn.textContent = '📜Raw';
            rawVersionBtn.style.cssText = `
                flex: 1;
                padding: 6px 2px;
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                opacity: 0.4;
                transition: opacity 0.2s ease;
            `;
            rawVersionBtn.onclick = function() {
                preferRawVersion = true;
                GM_setValue('preferRawVersion', true);
                updateVersionButtons();
                console.log('📌 用户选择：优先 Raw 版');
            };

            versionSelectContainer.appendChild(normalVersionBtn);
            versionSelectContainer.appendChild(rawVersionBtn);

            // 下载模式选择按钮容器（不打包/打包）
            const downloadModeContainer = document.createElement('div');
            downloadModeContainer.style.cssText = `
                width: 100%;
                margin-bottom: 3px;
                display: flex;
                gap: 3px;
            `;

            // 不打包按钮
            noZipBtn = document.createElement('button');
            noZipBtn.textContent = '📄不打包';
            noZipBtn.style.cssText = `
                flex: 1;
                padding: 6px 2px;
                background: #607D8B;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                opacity: 1;
                transition: opacity 0.2s ease;
            `;
            noZipBtn.onclick = function() {
                useZipDownload = false;
                GM_setValue('useZipDownload', false);
                updateDownloadModeButtons();
                console.log('📌 用户选择：不打包下载');
            };

            // 打包按钮
            zipModeBtn = document.createElement('button');
            zipModeBtn.textContent = '📦打包';
            zipModeBtn.style.cssText = `
                flex: 1;
                padding: 6px 2px;
                background: #795548;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                opacity: 0.4;
                transition: opacity 0.2s ease;
            `;
            zipModeBtn.onclick = function() {
                useZipDownload = true;
                GM_setValue('useZipDownload', true);
                updateDownloadModeButtons();
                console.log('📌 用户选择：打包下载');
            };

            downloadModeContainer.appendChild(noZipBtn);
            downloadModeContainer.appendChild(zipModeBtn);

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

            // 搜索按钮
            const searchButton = document.createElement('button');
            searchButton.textContent = '🔎 搜索';
            searchButton.style.cssText = `
                width: 100%;
                padding: 8px;
                background: #00BCD4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
            `;
            searchButton.onclick = showSearchDialog;

            // 收藏按钮
            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = '⭐ 收藏';
            favoriteButton.style.cssText = `
                width: 100%;
                padding: 8px;
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
            `;
            favoriteButton.onclick = showFavoriteDialog;

            // 漫画库按钮
            const libraryButton = document.createElement('button');
            libraryButton.textContent = '📚 漫画库';
            libraryButton.style.cssText = `
                width: 100%;
                padding: 8px;
                background: #E91E63;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
            `;
            libraryButton.onclick = showMangaLibraryDialog;

            // 不添加title，只添加其他元素
            buttonContainer.appendChild(countDisplay);
            buttonContainer.appendChild(scanButton);
            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(chapterInputContainer);
            buttonContainer.appendChild(versionSelectContainer);
            buttonContainer.appendChild(downloadModeContainer);
            buttonContainer.appendChild(autoDownloadButton);
            buttonContainer.appendChild(searchButton);
            buttonContainer.appendChild(favoriteButton);
            buttonContainer.appendChild(libraryButton);
            buttonContainer.appendChild(helpButton);
            document.body.appendChild(buttonContainer);

            // 初始化版本按钮状态
            updateVersionButtons();

            // 初始化下载模式按钮状态
            updateDownloadModeButtons();

            // 初始状态：面板隐藏
            isPanelVisible = false;
            buttonContainer.style.display = 'none';
        }

        // 从URL中提取漫画名
        function extractMangaName() {
            try {
                // 使用pathname而不是href，避免hash影响
                const pathname = window.location.pathname;
                console.log('extractMangaName - 当前pathname:', pathname);

                // 支持多种URL格式：
                // manhwaclub.net: /manga/漫画名/chapter-10/
                // manga18.club: /manhwa/漫画名/chapter-10/ 或 /manhwa/漫画名/10/
                // mangadna.com: /manga/漫画名/chapter-10/
                // mangaforfree.net: /manga/漫画名/chapter-10/
                // mangaforfree.com: /manga/漫画名/chapter-10/

                // 先尝试匹配章节页格式（包含 chapter-X、chap-X 或 capitulo-X）
                let match = pathname.match(/\/(manga|manhwa|webtoon)\/([^\/]+)\/(chapter|chap|capitulo)-/);
                if (match && match[2]) {
                    const mangaName = decodeURIComponent(match[2]);
                    console.log('extractMangaName - 从章节页提取到漫画名:', mangaName);
                    return mangaName;
                }

                // manga18.club 特殊处理：匹配纯数字格式 /manhwa/漫画名/40
                const isManga18 = window.location.hostname.includes('manga18.club');
                if (isManga18) {
                    match = pathname.match(/\/(manga|manhwa|webtoon)\/([^\/]+)\/(\d+)\/?$/);
                    if (match && match[2]) {
                        const mangaName = decodeURIComponent(match[2]);
                        console.log('extractMangaName - 从纯数字格式提取到漫画名:', mangaName);
                        return mangaName;
                    }
                }

                // 如果不是章节页，尝试匹配详情页格式（只有漫画名）
                match = pathname.match(/\/(manga|manhwa|webtoon)\/([^\/]+)\/?$/);
                if (match && match[2]) {
                    const mangaName = decodeURIComponent(match[2]);
                    // 不要移除 -raw 后缀，因为有些漫画名本身就包含 -raw
                    console.log('extractMangaName - 从详情页提取到漫画名:', mangaName);
                    return mangaName;
                }

                console.log('extractMangaName - 未能匹配到漫画名，pathname:', pathname);
                return null;
            } catch (e) {
                console.error('extractMangaName - 提取失败:', e);
                return null;
            }
        }

        // 将URL格式的漫画名转换为格式化的标题
        // 使用 compromise.js 进行词性判断
        function formatMangaTitle(urlName) {
            if (!urlName) return null;

            // 小写功能词列表（已禁用，全部首字母大写）
            const lowercaseWords = [];

            // 特殊缩写映射
            const specialAbbreviations = {
                'milf': 'MILF',
                'milfs': 'MILFs'
            };

            // 缩写词映射（不是所有格，而是缩写）
            const contractions = {
                // be 动词缩写
                'im': "I'm",          // I am
                'youre': "you're",    // you are
                'hes': "he's",        // he is
                'shes': "she's",      // she is
                'its': "it's",        // it is
                'were': "we're",      // we are
                'theyre': "they're",  // they are
                // is/has 缩写
                'thats': "that's",    // that is
                'whats': "what's",    // what is
                'heres': "here's",    // here is
                'theres': "there's",  // there is
                'wheres': "where's",  // where is
                'hows': "how's",      // how is
                'whos': "who's",      // who is
                'whys': "why's",      // why is
                'whens': "when's",    // when is
                // let 缩写
                'lets': "let's",      // let us
                // not 缩写
                'dont': "don't",      // do not
                'doesnt': "doesn't",  // does not
                'didnt': "didn't",    // did not
                'cant': "can't",      // cannot
                'couldnt': "couldn't", // could not
                'wouldnt': "wouldn't", // would not
                'shouldnt': "shouldn't", // should not
                'wont': "won't",      // will not
                'isnt': "isn't",      // is not
                'arent': "aren't",    // are not
                'wasnt': "wasn't",    // was not
                'werent': "weren't",  // were not
                'hasnt': "hasn't",    // has not
                'havent': "haven't",  // have not
                'hadnt': "hadn't",    // had not
                'mustnt': "mustn't",  // must not
                'neednt': "needn't",  // need not
                'aint': "ain't",      // am not / is not
                // have 缩写
                'ive': "I've",        // I have
                'youve': "you've",    // you have
                'weve': "we've",      // we have
                'theyve': "they've",  // they have
                'couldve': "could've", // could have
                'wouldve': "would've", // would have
                'shouldve': "should've", // should have
                'mightve': "might've", // might have
                'mustve': "must've",  // must have
                // will 缩写
                'ill': "I'll",        // I will
                'youll': "you'll",    // you will
                'hell': "he'll",      // he will
                'shell': "she'll",    // she will
                'itll': "it'll",      // it will
                'well': "we'll",      // we will (注意：well 也是一个独立单词)
                'theyll': "they'll",  // they will
                'thatll': "that'll",  // that will
                'whatll': "what'll",  // what will
                // would 缩写
                'id': "I'd",          // I would
                'youd': "you'd",      // you would
                'hed': "he'd",        // he would
                'shed': "she'd",      // she would
                'wed': "we'd",        // we would
                'theyd': "they'd",    // they would
                // 其他
                'oclock': "o'clock",  // of the clock
                'yall': "y'all",      // you all
            };

            // 第一步：移除结尾的 -raw 后缀（如 rooftop-sex-king-raw -> rooftop-sex-king）
            let baseName = urlName.replace(/-raw$/i, '');

            // 第二步：移除结尾的话数/集数后缀
            // 匹配: -数字, -数字字母, -字母数字 (2-3位短后缀)
            baseName = baseName.replace(/-(\d+|[a-z]\d+|\d+[a-z])$/i, '');

            // 第三步：移除开头的编号前缀
            // 匹配: a001-, b123-, 001-, 01a-, 11-, 1- 等格式（字母+数字 或 纯数字）
            baseName = baseName.replace(/^([a-z]?\d+[a-z]?)-/i, '');

            // 第四步：按 - 分割成单词
            let words = baseName.split('-');

            // 第五步：使用 compromise.js 判断词性并处理所有格
            // 检查 nlp 是否可用
            const nlpAvailable = typeof nlp !== 'undefined';

            if (nlpAvailable) {
                for (let i = 0; i < words.length - 1; i++) {
                    const word = words[i].toLowerCase();

                    // 跳过缩写词（如 lets -> let's）
                    if (contractions[word]) {
                        continue;
                    }

                    // 检查是否是 "public-servants" 这样的复合词所有格
                    if (i < words.length - 2 && word === 'public' && words[i + 1].toLowerCase() === 'servants') {
                        words[i] = 'public';
                        words[i + 1] = "servant's";
                        i++;
                        continue;
                    }

                    // 检查是否以 s 结尾且可能是所有格
                    // 特殊结尾词列表（这些词以 s 结尾但不是所有格，是复数或特殊词）
                    const specialEndingWords = [
                        // 常见复数名词（不是所有格）
                        'tales', 'games', 'times', 'lives', 'eyes', 'guys', 'boys', 'girls',
                        'days', 'ways', 'keys', 'toys', 'joys', 'rays', 'bays',
                        'arms', 'legs', 'hands', 'heads', 'hearts', 'parts', 'arts',
                        'words', 'worlds', 'lords', 'swords', 'records', 'rewards',
                        'friends', 'legends', 'islands', 'lands', 'bands', 'hands',
                        'kings', 'rings', 'things', 'wings', 'strings', 'springs',
                        'dreams', 'teams', 'streams', 'realms',
                        'stars', 'wars', 'bars', 'cars', 'scars',
                        'gods', 'odds', 'kids', 'bids',
                        'sins', 'twins', 'wins', 'pins', 'bins',
                        'pets', 'bets', 'sets', 'jets', 'nets',
                        'cups', 'ups', 'pups',
                        'laws', 'claws', 'jaws', 'flaws', 'draws',
                        'news', 'views', 'clues', 'blues',
                        'heroes', 'zeros', 'echoes',
                        'series', 'species', 'movies', 'zombies', 'cookies', 'bodies',
                        'babies', 'ladies', 'studies', 'stories', 'memories', 'theories',
                        'abilities', 'possibilities', 'responsibilities',
                        // -ss 结尾
                        'class', 'glass', 'grass', 'mass', 'pass', 'bass', 'kiss', 'miss',
                        'bliss', 'cross', 'loss', 'boss', 'dress', 'stress', 'press', 'mess',
                        'less', 'bless', 'success', 'access', 'process', 'progress', 'address',
                        'business', 'witness', 'fitness', 'illness', 'darkness', 'happiness',
                        // -us 结尾
                        'focus', 'bonus', 'status', 'genius', 'radius', 'virus', 'campus',
                        'circus', 'census', 'nexus', 'bus', 'us', 'plus', 'thus', 'versus',
                        // -is 结尾
                        'analysis', 'basis', 'crisis', 'thesis', 'genesis', 'diagnosis',
                        'hypothesis', 'synthesis', 'emphasis', 'oasis', 'axis', 'is', 'his', 'this',
                        // -as 结尾
                        'atlas', 'canvas', 'texas', 'christmas', 'as', 'was', 'has',
                        // -os 结尾
                        'chaos', 'cosmos', 'pathos', 'ethos', 'logos'
                    ];

                    let root = null;
                    if (word.endsWith('sss')) {
                        // bosss -> boss (三个s的特殊情况，如 bosss-daughter)
                        root = word.slice(0, -1);
                    } else if (specialEndingWords.includes(word)) {
                        // 跳过特殊结尾词
                        continue;
                    } else if (word.endsWith('ies') && word.length >= 5) {
                        // hotties -> hottie
                        root = word.slice(0, -1);
                    } else if (word.endsWith('s') && word.length >= 3) {
                        // sons -> son
                        root = word.slice(0, -1);
                    }

                    if (root && root.length >= 2) {
                        // 使用 compromise 判断词根的词性
                        const doc = nlp(root);
                        const rootIsNoun = doc.nouns().length > 0 || doc.match('#Noun').length > 0;
                        const rootIsVerb = doc.verbs().length > 0 || doc.match('#Verb').length > 0;

                        // 如果词根是名词且不是动词，则转换为所有格
                        // 这样可以正确处理：
                        // - everyone (名词) -> everyone's ✓
                        // - fuck (动词) -> 不转换 ✓
                        if (rootIsNoun && !rootIsVerb) {
                            words[i] = root + "'s";
                        }
                    }
                }
            } else {
                // 如果 nlp 不可用，使用简单的白名单模式
                console.warn('compromise.js 未加载，使用简单模式');
                const possessiveRoots = [
                    'boss', 'chairman', 'village', 'servant', 'hottie', 'son',
                    'daughter', 'mother', 'father', 'sister', 'brother',
                    'wife', 'husband', 'king', 'queen', 'master', 'teacher'
                ];

                for (let i = 0; i < words.length - 1; i++) {
                    const word = words[i].toLowerCase();

                    if (i < words.length - 2 && word === 'public' && words[i + 1].toLowerCase() === 'servants') {
                        words[i] = 'public';
                        words[i + 1] = "servant's";
                        i++;
                        continue;
                    }

                    let root = null;
                    if (word.endsWith('sss')) {
                        root = word.slice(0, -1);
                    } else if (word.endsWith('ies') && word.length >= 5) {
                        root = word.slice(0, -1);
                    } else if (word.endsWith('s') && !word.endsWith('ss') && word.length >= 3) {
                        root = word.slice(0, -1);
                    }

                    if (root && possessiveRoots.includes(root)) {
                        words[i] = root + "'s";
                    }
                }
            }

            // 第四步：格式化每个单词的大小写
            const formattedWords = words.map((word, index) => {
                const lowerWord = word.toLowerCase();

                // 检查特殊缩写（如 MILF）
                if (specialAbbreviations[lowerWord]) {
                    return specialAbbreviations[lowerWord];
                }

                // 检查缩写词（如 let's, don't）
                if (contractions[lowerWord]) {
                    const contraction = contractions[lowerWord];
                    // 首字母大写（标题格式）
                    return contraction.charAt(0).toUpperCase() + contraction.slice(1);
                }

                // 检查是否包含所有格
                if (word.includes("'s")) {
                    const parts = word.split("'s");
                    return capitalizeFirst(parts[0]) + "'s";
                }

                if (index === 0) {
                    return capitalizeFirst(word);
                }

                if (lowercaseWords.includes(lowerWord)) {
                    return lowerWord;
                }

                return capitalizeFirst(word);
            });

            return formattedWords.join(' ');
        }

        // 首字母大写辅助函数
        function capitalizeFirst(word) {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }

        // 从URL中提取章节号
        function extractChapterNumber() {
            try {
                // 使用pathname而不是href，避免hash影响
                const pathname = window.location.pathname;
                console.log('extractChapterNumber - 当前pathname:', pathname);

                // URL格式通常是: /manga/漫画名/chapter-10/ 或 /manga/漫画名/chap-10/ 或 /manga/漫画名/capitulo-10/
                const match = pathname.match(/(chapter|chap|capitulo)[_-]?(\d+)/i);
                if (match && match[2]) {
                    console.log('extractChapterNumber - 提取到章节号:', match[2]);
                    return match[2];
                }
                // 如果匹配失败，尝试从路径中提取最后一个数字
                const pathParts = pathname.split('/');
                for (let i = pathParts.length - 1; i >= 0; i--) {
                    const numMatch = pathParts[i].match(/^(\d+)$/);
                    if (numMatch && numMatch[1]) {
                        console.log('extractChapterNumber - 从路径提取到章节号:', numMatch[1]);
                        return numMatch[1];
                    }
                }
                console.log('extractChapterNumber - 未能提取到章节号');
                return null;
            } catch (e) {
                console.error('提取章节号失败:', e);
                return null;
            }
        }

        // 自动滚动到页面底部，触发懒加载
        async function autoScrollToBottom() {
            return new Promise((resolve) => {
                const scrollStep = 3000; // 每次滚动3000px
                const scrollDelay = 15; // 每次间隔15ms
                let currentPosition = 0;
                const totalHeight = document.documentElement.scrollHeight;

                console.log(`页面总高度: ${totalHeight}px`);

                const scrollInterval = setInterval(() => {
                    currentPosition += scrollStep;
                    window.scrollTo(0, currentPosition);

                    const newHeight = document.documentElement.scrollHeight;

                    if (currentPosition >= newHeight - window.innerHeight) {
                        clearInterval(scrollInterval);
                        console.log(`✓ 已滚动到底部 (${currentPosition}px)`);

                        setTimeout(() => {
                            window.scrollTo(0, 0);
                            console.log('✓ 已滚回顶部');
                            resolve();
                        }, 150);
                    }
                }, scrollDelay);
            });
        }

        // 扫描页面上的所有图片（增强版：多次扫描确保完整性）
        async function scanImages() {
            // 防止重复扫描
            if (isScanning) {
                alert('正在扫描中，请稍候...');
                return;
            }

            isScanning = true;

            // ==================== 统一滚动策略（所有站点）====================
            // 很多漫画网站使用"懒加载"技术：图片只有滚动到可见区域才会加载
            // 而且即使滚动完成，图片也不会立即加载，而是有固定延迟
            // 所以采用统一策略：滚动到底部 → 回到顶部 → 等待2秒
            console.log('🔄 开始统一滚动策略...');

            // 第一步：滚动到页面最底部，触发图片加载
            const maxHeight = document.documentElement.scrollHeight;
            window.scrollTo(0, maxHeight);
            console.log('✓ 已滚动到底部');

            // 等待 100 毫秒
            await new Promise(resolve => setTimeout(resolve, 100));

            // 第二步：滚回到顶部
            window.scrollTo(0, 0);
            console.log('✓ 已回到顶部');

            // 第三步：等待 2 秒让图片完全加载出来
            console.log('⏳ 等待2秒让图片加载...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('✅ 等待完成，开始扫描图片');
            // ==================== 统一滚动策略结束 ====================

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

            // 执行2次扫描，每次间隔1.5秒，确保捕获延迟加载的图片
            const scanRounds = 2;
            for (let round = 1; round <= scanRounds; round++) {
                console.log(`\n=== 第 ${round}/${scanRounds} 轮扫描 ===`);

                if (scanButton) {
                    scanButton.textContent = `⏳ 扫描中 ${round}/${scanRounds}...`;
                }

                // 扫描所有img标签
                const images = document.querySelectorAll('img');
                let newFoundCount = 0;

                images.forEach(img => {
                    // 检查图片是否可见（放宽条件）
                    const style = window.getComputedStyle(img);
                    const isVisible = style.display !== 'none' &&
                                    style.visibility !== 'hidden' &&
                                    img.offsetWidth > 0 &&
                                    img.offsetHeight > 0;

                    if (!isVisible) {
                        return;
                    }

                    // 获取图片源（多种方式尝试）
                    let src = img.src || img.dataset.src || img.dataset.lazySrc || img.getAttribute('data-original') || '';
                    if (!src || !src.startsWith('http')) {
                        return;
                    }

                    // 移除URL参数
                    src = src.split('?')[0];

                    // 先检查格式：必须是有效的图片格式
                    if (!isValidImageFormat(src) || !isPureNumberJpg(src)) {
                        return;
                    }

                    // 避免重复
                    if (urlSet.has(src)) {
                        return;
                    }

                    // 获取实际图片尺寸（优先使用naturalWidth/Height）
                    const width = img.naturalWidth || img.offsetWidth || 0;
                    const height = img.naturalHeight || img.offsetHeight || 0;
                    const filename = extractFilename(src);

                    // ==================== logo 过滤（通用）====================
                    // 过滤网站 logo 图片：宽高比约为 590:77 (约7.66)
                    // 这是 manhwaclub.net 等网站的 logo 特征
                    if (width > 0 && height > 0) {
                        const aspectRatio = width / height;  // 计算宽高比

                        // 如果宽高比在 7.5 到 7.8 之间，判定为 logo
                        if (aspectRatio >= 7.5 && aspectRatio <= 7.8) {
                            console.log(`跳过logo图片: ${filename} (${width}x${height}, 比例: ${aspectRatio.toFixed(2)})`);
                            return;
                        }

                        // 过滤小图：只有当尺寸明确小于100x100时才跳过
                        // 这些可能是缩略图、图标等，不是漫画内容
                        if (width < 100 && height < 100) {
                            console.log(`跳过小图: ${filename} (${width}x${height})`);
                            return;
                        }
                    }
                    // ==================== logo 过滤结束 ====================

                    // ==================== manga18.club logo 过滤 ====================
                    // manga18.club 网站有一个特殊的 logo 图片叫 "1.jpg"
                    // 这个图片虽然符合有效图片的格式，但它不是漫画内容，而是网站 logo
                    // 所以需要单独过滤掉，避免下载到 logo
                    const isManga18 = window.location.hostname.includes('manga18.club');
                    if (isManga18 && filename === '1.jpg') {
                        console.log(`跳过 manga18.club logo: ${filename} (${width}x${height})`);
                        return;
                    }
                    // ==================== manga18.club logo 过滤结束 ====================

                    // 添加到列表
                    urlSet.add(src);
                    imageUrls.push({
                        url: src,
                        filename: filename
                    });
                    newFoundCount++;
                    console.log(`✓ [第${round}轮] 找到新图片: ${filename} (${width}x${height})`);
                });

                console.log(`第 ${round} 轮扫描完成，本轮新发现 ${newFoundCount} 张图片，累计 ${imageUrls.length} 张`);

                // 如果不是最后一轮，等待1.5秒后继续（给图片更多加载时间）
                if (round < scanRounds) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            // 输出调试信息
            console.log(`\n=== 扫描总结 ===`);
            console.log(`共找到 ${imageUrls.length} 张有效图片`);
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

            // 检查图片编号连续性
            let missingNumbers = [];
            if (imageUrls.length > 1) {
                const numbers = imageUrls.map(item => {
                    const filename = item.filename;
                    const match = filename.match(/^(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                }).filter(n => n > 0 && n < 10000);  // 只检查合理范围内的编号（排除超长数字文件名）

                if (numbers.length > 1) {
                    const minNum = Math.min(...numbers);
                    const maxNum = Math.max(...numbers);
                    // 只在范围合理时检查连续性（避免超大数组）
                    if (maxNum - minNum < 1000) {
                        for (let i = minNum; i <= maxNum; i++) {
                            if (!numbers.includes(i)) {
                                missingNumbers.push(i);
                            }
                        }
                    }
                }
            }

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
                scanButton.textContent = '🔍 扫描';
                scanButton.style.cursor = 'pointer';
                scanButton.style.opacity = '1';
            }

            isScanning = false;

            // 显示扫描结果，包含完整性检查
            let alertMessage = `✅ 扫描完成！\n\n共发现 ${imageUrls.length} 张有效图片\n（已执行${scanRounds}轮扫描确保完整性）\n\n`;

            if (missingNumbers.length > 0 && missingNumbers.length <= 10) {
                alertMessage += `⚠️ 警告：检测到可能缺失的图片编号：\n${missingNumbers.join(', ')}\n\n建议：\n1. 滚动页面到底部确保所有图片已加载\n2. 再次点击扫描按钮\n3. 或手动检查是否真的缺失`;
            } else if (missingNumbers.length > 10) {
                alertMessage += `⚠️ 警告：检测到 ${missingNumbers.length} 个可能缺失的图片编号\n\n建议：\n1. 滚动页面到底部确保所有图片已加载\n2. 再次点击扫描按钮`;
            } else {
                alertMessage += `✓ 图片编号连续，看起来完整`;
            }

            console.log(`扫描完成！发现 ${imageUrls.length} 张有效图片（有效格式，尺寸≥400x400）`);
            if (missingNumbers.length > 0) {
                console.log(`⚠️ 可能缺失的编号: ${missingNumbers.join(', ')}`);
            }
            alert(alertMessage);
        }

        // 检查图片URL是否是有效格式
        function isValidImageFormat(src) {
            // manga18.club 支持 webp 格式
            const isManga18 = window.location.hostname.includes('manga18.club');
            if (isManga18) {
                return src.match(/\.(jpg|jpeg|webp)(\?|$)/i);
            }
            // manhwaclub.net 支持 png 格式
            const isManhwaclub = window.location.hostname.includes('manhwaclub.net');
            if (isManhwaclub) {
                return src.match(/\.(jpg|jpeg|png)(\?|$)/i);
            }
            return src.match(/\.(jpg|jpeg)(\?|$)/i);
        }

        // 检查文件名是否是有效格式
        function isPureNumberJpg(filename) {
            if (!filename) return false;
            // 移除URL参数
            const cleanName = filename.split('?')[0];
            // 提取文件名（去掉路径）
            const nameOnly = cleanName.split('/').pop();

            // manga18.club 特殊处理：支持有序数字命名的 webp（如 01.webp, 02.webp）
            const isManga18 = window.location.hostname.includes('manga18.club');
            if (isManga18) {
                // 匹配纯数字.webp 格式（如 01.webp, 02.webp, 1.webp）
                // 但排除 cover_thumb_2.webp（主页封面）
                const webpPattern = /^(\d+)\.webp$/i;
                if (webpPattern.test(nameOnly)) {
                    return true;
                }
            }

            // manhwaclub.net 特殊处理：支持 数字-数字.png 格式（如 01-1.png, 02-1.png）
            const isManhwaclub = window.location.hostname.includes('manhwaclub.net');
            if (isManhwaclub) {
                // 匹配 数字-数字.png 格式
                const pngPattern = /^(\d+)-(\d+)\.png$/i;
                if (pngPattern.test(nameOnly)) {
                    return true;
                }
            }

            // 匹配十九种格式：
            // 1. 纯数字.jpg/jpeg：如 1.jpg, 23.jpg
            // 2. 数字_result数字.jpg/jpeg：如 01_result01.jpg, 1_result1.jpg
            // 3. 数字_result.jpg/jpeg：如 1_result.jpg, 23_result.jpg
            // 4. 数字-数字_result数字.jpg/jpeg：如 1-2_result2.jpg, 10-20_result20.jpg
            // 5. 数字-e数字.jpg/jpeg：如 1-e2.jpg, 10-e20.jpg
            // 6. 数字-数字.jpg/jpeg：如 1-2.jpg, 10-20.jpg
            // 7. 数字-数字字母组合_result数字.jpg/jpeg：如 1-c6f95_result95.jpg, 1-8f51a_result51.jpg
            // 8. 数字-数字-result数字.jpg/jpeg：如 2-83602-result83602.jpg
            // 9. 数字-数字字母组合.jpg/jpeg：如 1-f55b5.jpg
            // 10. 数字-单个字母加多个数字_result.jpg/jpeg：如 1-e6257_result.jpg
            // 11. 数字-多个字母加多个数字_result.jpg/jpeg：如 1-abc123_result.jpg
            // 12. 数字-多个字母加单个数字_result.jpg/jpeg：如 1-xyz9_result.jpg
            // 13. 数字-数字字母混合_result.jpg/jpeg：如 1-25c87_result.jpg, 2-25c87_result.jpg
            // 14. 数字-数字_result.jpg/jpeg：如 01-1_result.jpg, 02-1_result.jpg
            // 15. 数字-字母数字字母混合_result.jpg/jpeg：如 1-7b6ed_result.jpg, 2-7b6ed_result.jpg
            // 16. 数字_result-数字_result数字.jpg/jpeg：如 11_result-1_result1.jpg, 15_result-1_result1.jpg
            // 17. 数字_数字_result-(括号内容).jpg/jpeg：如 082_82_result-(FILEminimizer).jpg
            // 18. 数字_数字_result.jpg/jpeg：如 082_82_result.jpg
            // 19. 数字-数字-数字_result数字.jpg/jpeg：如 1-0-0_result0.jpg, 10-1-0_result0.jpg
            const pattern1 = /^(\d+)\.(jpg|jpeg)$/i;  // 纯数字格式
            const pattern2 = /^(\d+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字_result数字格式
            const pattern3 = /^(\d+)_result\.(jpg|jpeg)$/i;  // 数字_result格式
            const pattern4 = /^(\d+)-(\d+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字_result数字格式
            const pattern5 = /^(\d+)-e(\d+)\.(jpg|jpeg)$/i;  // 数字-e数字格式
            const pattern6 = /^(\d+)-(\d+)\.(jpg|jpeg)$/i;  // 数字-数字格式
            const pattern7 = /^(\d+)-([a-f0-9]+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字字母组合_result数字格式
            const pattern8 = /^(\d+)-(\d+)-result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字-result数字格式
            const pattern9 = /^(\d+)-([a-f0-9]+)\.(jpg|jpeg)$/i;  // 数字-数字字母组合格式
            const pattern10 = /^(\d+)-([a-z]\d+)_result\.(jpg|jpeg)$/i;  // 数字-单个字母加多个数字_result格式
            const pattern11 = /^(\d+)-([a-z]+\d+)_result\.(jpg|jpeg)$/i;  // 数字-多个字母加多个数字_result格式
            const pattern12 = /^(\d+)-([a-z]+\d)_result\.(jpg|jpeg)$/i;  // 数字-多个字母加单个数字_result格式
            const pattern13 = /^(\d+)-(\d+[a-z]\d+)_result\.(jpg|jpeg)$/i;  // 数字-数字字母混合_result格式
            const pattern14 = /^(\d+)-(\d+)_result\.(jpg|jpeg)$/i;  // 数字-数字_result格式
            const pattern15 = /^(\d+)-([a-z0-9]+[a-z][a-z0-9]*)_result\.(jpg|jpeg)$/i;  // 数字-字母数字字母混合_result格式（通用）
            const pattern16 = /^(\d+)_result-(\d+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字_result-数字_result数字格式
            const pattern17 = /^(\d+)_(\d+)_result-\([^)]+\)\.(jpg|jpeg)$/i;  // 数字_数字_result-(括号内容)格式
            const pattern18 = /^(\d+)_(\d+)_result\.(jpg|jpeg)$/i;  // 数字_数字_result格式
            const pattern19 = /^(\d+)-(\d+)-(\d+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字-数字_result数字格式

            return pattern1.test(nameOnly) || pattern2.test(nameOnly) || pattern3.test(nameOnly) || pattern4.test(nameOnly) || pattern5.test(nameOnly) || pattern6.test(nameOnly) || pattern7.test(nameOnly) || pattern8.test(nameOnly) || pattern9.test(nameOnly) || pattern10.test(nameOnly) || pattern11.test(nameOnly) || pattern12.test(nameOnly) || pattern13.test(nameOnly) || pattern14.test(nameOnly) || pattern15.test(nameOnly) || pattern16.test(nameOnly) || pattern17.test(nameOnly) || pattern18.test(nameOnly) || pattern19.test(nameOnly);
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

                    // 构建文件名格式：序号-漫画名-第X话_原文件名
                    const formattedName = mangaName ? (formatMangaTitle(mangaName) || mangaName) : '';
                    const chapterPart = chapterNumber ? `-第${chapterNumber}话` : '';

                    if (item.filename) {
                        // 格式：序号-漫画名-第X话_原文件名
                        if (formattedName) {
                            finalFilename = `${indexStr}-${formattedName}${chapterPart}_${item.filename}`;
                        } else {
                            finalFilename = `${indexStr}${chapterPart}_${item.filename}`;
                        }
                    } else {
                        // 生成新文件名
                        const ext = item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
                        const extension = ext ? ext[1].toLowerCase() : 'jpg';
                        if (formattedName) {
                            finalFilename = `${indexStr}-${formattedName}${chapterPart}_image.${extension}`;
                        } else {
                            finalFilename = `${indexStr}${chapterPart}_image.${extension}`;
                        }
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
            downloadButton.textContent = '⬇️ 下载';
            downloadButton.style.background = '#4CAF50';

            alert(`开始下载 ${successCount} 张图片！\n\n浏览器将自动下载，请检查下载文件夹。`);
            console.log(`批量下载触发完成！成功: ${successCount}, 失败: ${failCount}`);
        }

        // 动态加载 JSZip 库
        function loadJSZip() {
            return new Promise((resolve, reject) => {
                if (typeof JSZip !== 'undefined') {
                    resolve(JSZip);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
                script.onload = () => {
                    console.log('JSZip 加载成功');
                    resolve(window.JSZip);
                };
                script.onerror = () => {
                    reject(new Error('JSZip 加载失败'));
                };
                document.head.appendChild(script);
            });
        }

        // 打包下载（ZIP格式）
        async function zipDownload() {
            if (imageUrls.length === 0) {
                alert('没有可下载的图片！请先扫描图片。');
                return;
            }

            const zipBtn = document.getElementById('zip-download-btn');

            // 动态加载 JSZip
            if (typeof JSZip === 'undefined') {
                if (zipBtn) {
                    zipBtn.textContent = '📦 加载中...';
                }
                try {
                    await loadJSZip();
                } catch (e) {
                    alert('JSZip 库加载失败，无法使用打包下载功能。\n\n请检查网络连接后重试，或使用普通下载。');
                    console.error('JSZip 加载失败:', e);
                    if (zipBtn) {
                        zipBtn.textContent = '📦 打包下载';
                    }
                    return;
                }
            }

            if (zipBtn) {
                zipBtn.disabled = true;
                zipBtn.textContent = '📦 打包中 0%';
                zipBtn.style.background = '#ff9800';
            }

            try {
                console.log('创建 JSZip 实例...');
                const zip = new JSZip();
                console.log('JSZip 实例创建成功');
                let successCount = 0;
                let failCount = 0;
                const total = imageUrls.length;

                // 重新提取漫画名和章节号（确保获取到最新值）
                const rawMangaName = extractMangaName();
                const currentChapterNumber = extractChapterNumber();
                // 格式化漫画名
                const currentMangaName = formatMangaTitle(rawMangaName);
                console.log('ZIP文件名 - 原始漫画名:', rawMangaName);
                console.log('ZIP文件名 - 格式化后:', currentMangaName);
                console.log('ZIP文件名 - 章节号:', currentChapterNumber);

                // 构建ZIP文件名：漫画名_第X话.zip
                let zipFilename = '';
                if (currentMangaName) {
                    zipFilename += currentMangaName;
                }
                if (currentChapterNumber) {
                    zipFilename += `_第${currentChapterNumber}话`;
                }
                if (!zipFilename) {
                    zipFilename = 'manga_download';
                }
                zipFilename += '.zip';

                console.log(`开始打包下载 ${total} 张图片...`);

                // 逐个下载图片并添加到ZIP
                for (let i = 0; i < imageUrls.length; i++) {
                    const item = imageUrls[i];
                    const progress = Math.round((i / total) * 100);

                    if (zipBtn) {
                        zipBtn.textContent = `📦 打包中 ${progress}%`;
                    }

                    try {
                        // 构建文件名
                        const indexStr = String(i + 1).padStart(4, '0');
                        let finalFilename;

                        if (item.filename) {
                            finalFilename = `${indexStr}_${item.filename}`;
                        } else {
                            const ext = item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
                            const extension = ext ? ext[1].toLowerCase() : 'jpg';
                            finalFilename = `${indexStr}_image.${extension}`;
                        }

                        // 下载图片数据
                        const imageData = await fetchImageAsArrayBuffer(item.url);
                        if (imageData) {
                            zip.file(finalFilename, imageData);
                            successCount++;
                            console.log(`✓ [${i + 1}/${total}] ${finalFilename}`);
                        } else {
                            failCount++;
                            console.error(`✗ [${i + 1}/${total}] 下载失败: ${item.url}`);
                        }
                    } catch (error) {
                        failCount++;
                        console.error(`✗ [${i + 1}/${total}] 错误:`, error);
                    }
                }

                if (zipBtn) {
                    zipBtn.textContent = '📦 生成ZIP...';
                }

                // 生成ZIP文件
                console.log('正在生成ZIP文件...');
                console.log('ZIP 对象中的文件数:', Object.keys(zip.files).length);

                // 使用 then 回调而不是 await，解决 Promise 兼容性问题
                const finalSuccessCount = successCount;
                const finalFailCount = failCount;
                const finalZipFilename = zipFilename;
                const finalZipBtn = zipBtn;

                zip.generateAsync({ type: 'blob', compression: 'STORE' })
                    .then(function(content) {
                        console.log('ZIP 生成成功，大小:', content.size, 'bytes');

                        // 下载ZIP文件
                        const blobUrl = URL.createObjectURL(content);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = finalZipFilename;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

                        console.log('打包完成！成功:', finalSuccessCount, '失败:', finalFailCount);
                        alert('✅ 打包完成！\n\n成功: ' + finalSuccessCount + ' 张\n失败: ' + finalFailCount + ' 张\n\n文件名: ' + finalZipFilename);

                        if (finalZipBtn) {
                            finalZipBtn.disabled = false;
                            finalZipBtn.textContent = '📦 打包下载';
                            finalZipBtn.style.background = '#9C27B0';
                        }
                    })
                    .catch(function(zipError) {
                        console.error('ZIP 生成失败:', zipError);
                        alert('ZIP 生成失败: ' + zipError.message);
                        if (finalZipBtn) {
                            finalZipBtn.disabled = false;
                            finalZipBtn.textContent = '📦 打包下载';
                            finalZipBtn.style.background = '#9C27B0';
                        }
                    });

                return; // 提前返回，后续由 then 处理

            } catch (error) {
                console.error('打包下载失败:', error);
                alert('打包下载失败: ' + error.message);
            } finally {
                if (zipBtn) {
                    zipBtn.disabled = false;
                    zipBtn.textContent = '📦 打包下载';
                    zipBtn.style.background = '#9C27B0';
                }
            }
        }

        // 异步版本的打包下载（用于自动下载，不弹出alert）
        async function zipDownloadAsync() {
            if (imageUrls.length === 0) {
                console.log('没有可下载的图片！');
                return;
            }

            console.log('开始打包下载（异步版本）...');

            // 动态加载 JSZip
            if (typeof JSZip === 'undefined') {
                console.log('JSZip 未加载，开始加载...');
                try {
                    await loadJSZip();
                    console.log('JSZip 加载成功');
                } catch (e) {
                    console.error('JSZip 加载失败:', e);
                    console.log('降级为普通下载模式');
                    await batchDownloadAsync();
                    return;
                }
            }

            try {
                const zip = new JSZip();
                let successCount = 0;
                let failCount = 0;
                const total = imageUrls.length;

                // 使用全局变量或重新提取
                const rawMangaName = mangaName || extractMangaName();
                const currentChapterNumber = chapterNumber || extractChapterNumber();
                // 格式化漫画名
                const currentMangaName = formatMangaTitle(rawMangaName);
                console.log('ZIP文件名 - 原始漫画名:', rawMangaName);
                console.log('ZIP文件名 - 格式化后:', currentMangaName);
                console.log('ZIP文件名 - 章节号:', currentChapterNumber);

                // 构建ZIP文件名
                let zipFilename = '';
                if (currentMangaName) {
                    zipFilename += currentMangaName;
                }
                if (currentChapterNumber) {
                    zipFilename += `_第${currentChapterNumber}话`;
                }
                if (!zipFilename) {
                    zipFilename = 'manga_download';
                }
                zipFilename += '.zip';

                console.log(`开始打包下载 ${total} 张图片...`);

                // 逐个下载图片并添加到ZIP
                for (let i = 0; i < imageUrls.length; i++) {
                    const item = imageUrls[i];

                    try {
                        const indexStr = String(i + 1).padStart(4, '0');
                        let finalFilename;

                        if (item.filename) {
                            finalFilename = `${indexStr}_${item.filename}`;
                        } else {
                            const ext = item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
                            const extension = ext ? ext[1].toLowerCase() : 'jpg';
                            finalFilename = `${indexStr}_image.${extension}`;
                        }

                        const imageData = await fetchImageAsArrayBuffer(item.url);
                        if (imageData) {
                            zip.file(finalFilename, imageData);
                            successCount++;
                            console.log(`✓ [${i + 1}/${total}] ${finalFilename}`);
                        } else {
                            failCount++;
                            console.error(`✗ [${i + 1}/${total}] 下载失败: ${item.url}`);
                        }
                    } catch (error) {
                        failCount++;
                        console.error(`✗ [${i + 1}/${total}] 错误:`, error);
                    }
                }

                // 生成ZIP文件
                console.log('正在生成ZIP文件...');
                const content = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
                console.log('ZIP 生成成功，大小:', content.size, 'bytes');

                // 下载ZIP文件
                const blobUrl = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = zipFilename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

                console.log('打包完成！成功:', successCount, '失败:', failCount);

            } catch (error) {
                console.error('打包下载失败:', error);
            }
        }

        // 获取图片数据（返回ArrayBuffer）
        function fetchImageAsArrayBuffer(url) {
            return new Promise((resolve) => {
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        onload: function(response) {
                            if (response.status === 200 && response.response) {
                                resolve(response.response);
                            } else {
                                resolve(null);
                            }
                        },
                        onerror: function() {
                            resolve(null);
                        },
                        ontimeout: function() {
                            resolve(null);
                        }
                    });
                } else {
                    // 降级使用fetch
                    fetch(url)
                        .then(res => res.arrayBuffer())
                        .then(data => resolve(data))
                        .catch(() => resolve(null));
                }
            });
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
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📝 构建英文版章节URL');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                // 使用 origin + pathname 来避免包含hash部分
                const currentUrl = window.location.origin + window.location.pathname;
                const urlParts = currentUrl.split('/');

                console.log('当前完整URL:', currentUrl);
                console.log('目标章节号:', nextChapterNum);

                // 遍历URL路径，找到章节部分并替换
                for (let i = urlParts.length - 1; i >= 0; i--) {
                    // 移除hash部分（如果有）
                    const cleanPart = urlParts[i].split('#')[0];

                    // 匹配 chapter-数字 或 chap-数字 格式
                    if (cleanPart.match(/^(chapter|chap)[_-]?(\d+)/i)) {
                        // 匹配到章节部分，提取前缀和数字
                        const match = cleanPart.match(/^(chapter|chap)[_-]?(\d+)/i);
                        if (match) {
                            const prefix = match[1];  // chapter 或 chap
                            const currentChapter = match[2];  // 当前章节号

                            console.log('✓ 找到章节部分(chapter格式):', cleanPart);
                            console.log('  - 前缀:', prefix);
                            console.log('  - 当前章节:', currentChapter);
                            console.log('  - 目标章节:', nextChapterNum);

                            // 使用相同的前缀构建新URL
                            urlParts[i] = `${prefix}-${nextChapterNum}`;
                            const result = urlParts.join('/');

                            console.log('✅ 构建成功!');
                            console.log('新URL:', result);
                            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                            return result;
                        }
                    }

                    // manga18.club 特殊处理：匹配纯数字格式（如 /40）
                    // 纯数字格式只在URL最后一部分，且前面是漫画名
                    if (i === urlParts.length - 1 && cleanPart.match(/^\d+$/)) {
                        const isManga18 = window.location.hostname.includes('manga18.club');
                        if (isManga18) {
                            console.log('✓ 找到章节部分(纯数字格式):', cleanPart);
                            console.log('  - 当前章节:', cleanPart);
                            console.log('  - 目标章节:', nextChapterNum);

                            // manga18.club: 优先使用 chapter-X 格式（因为更通用）
                            urlParts[i] = `chapter-${nextChapterNum}`;
                            const result = urlParts.join('/');

                            console.log('✅ 构建成功! (纯数字->chapter格式)');
                            console.log('新URL:', result);
                            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                            return result;
                        }
                    }
                }

                console.log('❌ 未找到章节部分');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                return null;
            } catch (e) {
                console.error('❌ 构建下一章URL失败:', e);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                return null;
            }
        }

        // 构建raw章节的URL
        function buildRawChapterUrl(nextChapterNum) {
            try {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📝 构建RAW章节URL');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                // 使用 origin + pathname 来避免包含hash部分
                const currentUrl = window.location.origin + window.location.pathname;
                const urlParts = currentUrl.split('/');

                console.log('当前完整URL:', currentUrl);
                console.log('目标章节号:', nextChapterNum);

                // 遍历URL路径，找到章节部分并替换
                for (let i = urlParts.length - 1; i >= 0; i--) {
                    // 移除hash部分（如果有）
                    const cleanPart = urlParts[i].split('#')[0];

                    // 匹配 chapter-数字 或 chap-数字 格式
                    if (cleanPart.match(/^(chapter|chap)[_-]?(\d+)/i)) {
                        // 匹配到章节部分，提取前缀和数字
                        const match = cleanPart.match(/^(chapter|chap)[_-]?(\d+)/i);
                        if (match) {
                            const prefix = match[1];  // chapter 或 chap
                            const currentChapter = match[2];  // 当前章节号

                            console.log('✓ 找到章节部分(chapter格式):', cleanPart);
                            console.log('  - 前缀:', prefix);
                            console.log('  - 当前章节:', currentChapter);
                            console.log('  - 目标章节:', nextChapterNum);

                            // 通用处理：检查漫画名是否已包含-raw
                            // 适用于 manga18.club、manhwabuddy.com 等将 raw 版和英文版分开的站点
                            // 这些站点的 raw 版漫画名已包含 -raw（如 brothel-raw），章节部分不需要再加 -raw
                            const mangaNamePart = urlParts.find(part => part.includes('-raw') && !part.match(/^(chapter|chap)/i));
                            if (mangaNamePart) {
                                // 漫画名已包含-raw，章节部分不加-raw
                                urlParts[i] = `${prefix}-${nextChapterNum}`;
                                console.log('  - 漫画名已含-raw，章节不加-raw');
                            } else {
                                // 漫画名不含-raw，章节部分加-raw
                                urlParts[i] = `${prefix}-${nextChapterNum}-raw`;
                            }
                            const result = urlParts.join('/');

                            console.log('✅ 构建成功!');
                            console.log('新URL:', result);
                            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                            return result;
                        }
                    }

                    // 特殊处理：匹配纯数字格式（如 /40），目前主要用于 manga18.club
                    if (i === urlParts.length - 1 && cleanPart.match(/^\d+$/)) {
                        console.log('✓ 找到章节部分(纯数字格式):', cleanPart);
                        console.log('  - 当前章节:', cleanPart);
                        console.log('  - 目标章节:', nextChapterNum);

                        // 检查漫画名是否已包含-raw
                        const mangaNamePart = urlParts.find(part => part.includes('-raw') && !part.match(/^\d+$/));
                        if (mangaNamePart) {
                            // 漫画名已包含-raw，使用 chapter-X 格式（不加-raw）
                            urlParts[i] = `chapter-${nextChapterNum}`;
                            console.log('  - 漫画名已含-raw，使用chapter格式');
                        } else {
                            // 漫画名不含-raw，使用 chapter-X-raw 格式
                            urlParts[i] = `chapter-${nextChapterNum}-raw`;
                        }
                        const result = urlParts.join('/');

                        console.log('✅ 构建成功! (纯数字->chapter格式)');
                        console.log('新URL:', result);
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        return result;
                    }
                }

                console.log('❌ 未找到章节部分');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                return null;
            } catch (e) {
                console.error('❌ 构建raw章节URL失败:', e);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
                        const responseText = response.responseText || '';

                        // 首先检查 HTTP 状态码
                        if (response.status < 200 || response.status >= 400) {
                            console.log(`章节不存在 - HTTP状态码错误: ${response.status}`);
                            resolve(false);
                            return;
                        }

                        // 检查是否含有bg-search.jpg（错误页面的标志）
                        if (responseText.includes('bg-search.jpg')) {
                            console.log(`章节不存在 - 包含bg-search.jpg（错误页面）`);
                            resolve(false);
                            return;
                        }

                        // 检查有效图片数量
                        const imageUrlPattern = /https?:\/\/[^"'\s]+\.(jpg|jpeg)(\?[^"'\s]*)?/gi;
                        const imageMatches = responseText.match(imageUrlPattern);

                        if (!imageMatches) {
                            console.log(`章节不存在 - 未找到任何图片`);
                            resolve(false);
                            return;
                        }

                        // 过滤出符合 isPureNumberJpg 格式的有效图片
                        let validImageCount = 0;
                        const validImages = [];
                        const invalidImages = [];

                        imageMatches.forEach(imgUrl => {
                            const cleanUrl = imgUrl.split('?')[0];
                            const filename = cleanUrl.split('/').pop();

                            if (isPureNumberJpg(cleanUrl)) {
                                validImageCount++;
                                validImages.push(filename);
                            } else {
                                invalidImages.push(filename);
                            }
                        });

                        // 至少2张有效图片才认为是有效章节
                        const hasValidImages = validImageCount >= 2;

                        console.log(`章节内容检查 - URL: ${url}`);
                        console.log(`总图片数: ${imageMatches.length}, 有效图片数: ${validImageCount}, 是否有效: ${hasValidImages}`);

                        if (validImages.length > 0) {
                            console.log(`有效图片示例 (前5个):`, validImages.slice(0, 5));
                        }
                        if (invalidImages.length > 0) {
                            console.log(`无效图片示例 (前5个):`, invalidImages.slice(0, 5));
                        }

                        const exists = hasValidImages;
                        console.log(`章节${exists ? '存在 ✓' : '不存在 ✗'}: ${url}`);
                        resolve(exists);
                    },
                    onerror: function(error) {
                        console.log(`章节不存在(网络错误): ${url}`, error);
                        resolve(false);
                    },
                    ontimeout: function() {
                        console.log(`章节不存在(超时): ${url}`);
                        resolve(false);
                    }
                });
            });
        }

        // 自动下载流程
        async function processAutoDownload() {
            console.log('开始自动下载流程...');

            // 检查是否有任务ID（多本下载任务）- 不再从URL hash读取，而是从GM存储读取
            let taskId = null;
            let taskData = null;

            // 方法1：通过当前章节查找任务
            const currentMangaName = extractMangaName();
            const currentChapter = extractChapterNumber();
            if (currentMangaName && currentChapter) {
                const taskKey = `autoDownload_${currentMangaName}_${currentChapter}`;
                taskData = GM_getValue(taskKey, null);
                if (taskData) {
                    taskId = taskKey;
                    console.log('检测到任务ID（通过章节查找）:', taskId);
                    console.log('任务数据:', taskData);
                }
            }

            // 方法2：如果方法1没找到，尝试从全局任务中获取
            if (!taskData) {
                const globalTask = GM_getValue('currentAutoDownloadTask', null);
                if (globalTask && globalTask.mangaName === currentMangaName) {
                    taskId = globalTask.taskId;
                    taskData = GM_getValue(taskId, null);
                    if (taskData) {
                        console.log('检测到任务ID（通过全局任务）:', taskId);
                        console.log('任务数据:', taskData);
                    }
                }
            }

            // ==================== 检查当前章节是否需要跳转到优先版本 ====================
            // 如果用户选择了 raw 版，但当前在英文版页面，应该先跳转到 raw 版
            // 反之亦然
            const currentUrl = window.location.href;
            const isCurrentRaw = currentUrl.includes('-raw');
            const primaryType = preferRawVersion ? 'raw' : '英文';

            console.log(`📌 用户选择：优先下载 ${primaryType} 版`);
            console.log(`当前页面是否为 raw 版: ${isCurrentRaw}`);

            // 检查是否需要跳转
            if (preferRawVersion && !isCurrentRaw) {
                // 用户选择了 raw 版，但当前在英文版页面
                console.log('⚠️ 用户选择 raw 版，但当前在英文版页面，检查是否有对应的 raw 版...');
                const rawUrl = buildRawChapterUrl(currentChapter);
                if (rawUrl) {
                    const rawExists = await checkChapterExists(rawUrl);
                    if (rawExists) {
                        console.log(`✓ 找到对应的 raw 版，跳转到: ${rawUrl}`);
                        // 保存任务数据和自动下载状态
                        if (currentMangaName) {
                            const nextTaskKey = `autoDownload_${currentMangaName}_${currentChapter}`;
                            GM_setValue(nextTaskKey, {
                                autoDownload: true,
                                mangaName: currentMangaName,
                                startChapter: currentChapter,
                                taskId: nextTaskKey
                            });
                            GM_setValue('currentAutoDownloadTask', {
                                mangaName: currentMangaName,
                                taskId: nextTaskKey
                            });
                            // 保存自动下载状态，确保跳转后能继续
                            GM_setValue('isAutoDownloading', true);
                            // 设置跳转时间戳，用于判断是否是正常跳转
                            GM_setValue('navigationTimestamp', Date.now());
                        }
                        window.location.href = rawUrl;
                        return; // 跳转后会重新执行自动下载流程
                    } else {
                        // 没有对应的 raw 版，停止自动下载并提示用户
                        console.log('✗ 没有对应的 raw 版，停止自动下载');
                        stopAutoDownload();
                        alert(`❌ 第 ${currentChapter} 章没有 Raw 版\n\n当前页面是英文版，但您选择了下载 Raw 版。\n\n请切换到英文版下载，或选择其他章节。`);
                        return;
                    }
                }
            } else if (!preferRawVersion && isCurrentRaw) {
                // 用户选择了英文版，但当前在 raw 版页面
                console.log('⚠️ 用户选择英文版，但当前在 raw 版页面，检查是否有对应的英文版...');
                const normalUrl = buildNextChapterUrl(currentChapter);
                if (normalUrl) {
                    const normalExists = await checkChapterExists(normalUrl);
                    if (normalExists) {
                        console.log(`✓ 找到对应的英文版，跳转到: ${normalUrl}`);
                        // 保存任务数据和自动下载状态
                        if (currentMangaName) {
                            const nextTaskKey = `autoDownload_${currentMangaName}_${currentChapter}`;
                            GM_setValue(nextTaskKey, {
                                autoDownload: true,
                                mangaName: currentMangaName,
                                startChapter: currentChapter,
                                taskId: nextTaskKey
                            });
                            GM_setValue('currentAutoDownloadTask', {
                                mangaName: currentMangaName,
                                taskId: nextTaskKey
                            });
                            // 保存自动下载状态，确保跳转后能继续
                            GM_setValue('isAutoDownloading', true);
                            // 设置跳转时间戳，用于判断是否是正常跳转
                            GM_setValue('navigationTimestamp', Date.now());
                        }
                        window.location.href = normalUrl;
                        return; // 跳转后会重新执行自动下载流程
                    } else {
                        // 没有对应的英文版，停止自动下载并提示用户
                        console.log('✗ 没有对应的英文版，停止自动下载');
                        stopAutoDownload();
                        alert(`❌ 第 ${currentChapter} 章没有英文版\n\n当前页面是 Raw 版，但您选择了下载英文版。\n\n请切换到 Raw 版下载，或选择其他章节。`);
                        return;
                    }
                }
            } else {
                console.log('✓ 当前页面版本与用户选择一致，无需跳转');
            }
            // ==================== 检查当前章节版本结束 ====================

            // 1. 扫描当前章节的图片
            console.log('正在扫描图片...');
            try {
                await scanImagesAsync();
            } catch (error) {
                // 如果检测到 404 页面，立即停止
                if (error.message === '404_PAGE_DETECTED') {
                    console.log('检测到 404 页面，终止自动下载流程');
                    return;
                }
                throw error; // 其他错误继续抛出
            }

            // 2. 下载当前章节的图片
            if (imageUrls.length > 0) {
                console.log(`开始下载 ${imageUrls.length} 张图片...`);

                // 重新从存储中读取下载模式（确保最新状态）
                const currentZipMode = GM_getValue('useZipDownload', false);
                useZipDownload = currentZipMode;

                console.log('========== 自动下载模式调试 ==========');
                console.log(`GM_getValue('useZipDownload'): ${currentZipMode}`);
                console.log(`useZipDownload 变量: ${useZipDownload}`);
                console.log(`下载模式: ${currentZipMode ? '打包下载' : '不打包下载'}`);

                // 检测防盗链网站
                const hostname = window.location.hostname;
                const antiHotlinkSites = [
                    // 暂无防盗链网站
                ];
                const hasAntiHotlink = antiHotlinkSites.some(site => hostname.includes(site));
                console.log(`当前网站: ${hostname}`);
                console.log(`是否防盗链网站: ${hasAntiHotlink}`);

                if (currentZipMode && !hasAntiHotlink) {
                    // 打包下载模式
                    console.log('🎯 执行打包下载');
                    await zipDownloadAsync();
                } else if (currentZipMode && hasAntiHotlink) {
                    console.warn(`⚠️ 检测到防盗链网站: ${hostname}，自动降级为普通下载`);
                    await batchDownloadAsync();
                } else {
                    // 不打包下载模式（逐张下载）
                    console.log('🎯 执行普通下载');
                    await batchDownloadAsync();
                }

                // 记录下载进度
                const currentUrl = window.location.href;
                const isCurrentRaw = currentUrl.includes('-raw');
                if (currentMangaName && currentChapter) {
                    recordDownloadProgress(currentMangaName, currentChapter, isCurrentRaw);
                }

                // 等待下载完成（减少等待时间）
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // 3. 寻找下一个章节
            const currentChapterNum = chapterNumber;
            let nextChapterNum = getNextChapterNumber(currentChapterNum);

            console.log('');
            console.log('╔════════════════════════════════════════╗');
            console.log('║      🔄 准备跳转到下一章              ║');
            console.log('╚════════════════════════════════════════╝');
            console.log('当前URL:', window.location.href);
            console.log('当前章节号:', currentChapterNum);
            console.log('下一章节号:', nextChapterNum);
            console.log('════════════════════════════════════════');

            // 智能选择下一章节（根据用户选择决定优先版本）
            const secondaryType = preferRawVersion ? '英文' : 'raw';
            console.log(`📌 用户选择：优先下载 ${primaryType} 版`);

            while (nextChapterNum) {
                // 构建两个版本的 URL
                const normalUrl = buildNextChapterUrl(nextChapterNum);
                const rawUrl = buildRawChapterUrl(nextChapterNum);
                // 根据用户选择决定优先检查哪个版本
                const primaryUrl = preferRawVersion ? rawUrl : normalUrl;
                const secondaryUrl = preferRawVersion ? normalUrl : rawUrl;

                console.log(`构建的URL - 英文版: ${normalUrl}, raw版: ${rawUrl}`);
                console.log(`优先检查: ${primaryType}版 (${primaryUrl})`)

                // ==================== manga18.club 特殊处理 ====================
                // 判断当前是否在 manga18.club 网站
                const isManga18 = window.location.hostname.includes('manga18.club');

                if (isManga18) {
                    // manga18.club 的特殊策略：
                    // 1. 直接跳转到 chapter-X 格式
                    // 2. 如果跳转到主页（章节不存在），会在扫描时检测到并尝试纯数字格式
                    // 3. 如果纯数字格式也跳转到主页，说明下载完毕

                    console.log('╔════════════════════════════════════════╗');
                    console.log('║   🚀 manga18.club 直接跳转模式        ║');
                    console.log('╚════════════════════════════════════════╝');
                    console.log('当前章节:', currentChapterNum);
                    console.log('下一章节:', nextChapterNum);

                    // 根据用户选择决定跳转URL
                    const jumpUrl = preferRawVersion ? rawUrl : normalUrl;
                    console.log('跳转URL:', jumpUrl);
                    console.log('说明: 直接跳转，如果章节不存在会重定向到主页');
                    console.log('════════════════════════════════════════');

                    // 保存下一章的任务信息，以便跳转后继续自动下载
                    if (taskData && currentMangaName) {
                        // 生成下一章的任务标识
                        const nextTaskKey = `autoDownload_${currentMangaName}_${nextChapterNum}`;

                        // 保存任务数据到浏览器存储
                        GM_setValue(nextTaskKey, {
                            autoDownload: true,              // 标记为自动下载任务
                            mangaName: currentMangaName,     // 漫画名称
                            startChapter: nextChapterNum,    // 起始章节号
                            taskId: nextTaskKey,             // 任务ID
                            urlFormat: 'chapter',            // 记录当前尝试的URL格式
                            chapterFormatUrl: jumpUrl        // 保存chapter-X格式的完整URL，用于构建纯数字格式
                        });

                        // 更新全局任务标记
                        GM_setValue('currentAutoDownloadTask', {
                            mangaName: currentMangaName,
                            taskId: nextTaskKey
                        });

                        console.log(`为下一章创建任务数据: ${nextTaskKey}`);
                        console.log(`保存chapter格式URL: ${jumpUrl}`);
                    }

                    // 专门为 manga18.club 保存重试信息（独立于任务数据，不会被清除）
                    // 这样即使跳转到主页后任务数据被清除，也能正确重试纯数字格式
                    GM_setValue('manga18_pending_retry', {
                        chapterFormatUrl: jumpUrl,
                        urlFormat: 'chapter',
                        mangaName: currentMangaName || extractMangaName(),
                        chapterNum: nextChapterNum
                    });
                    console.log(`保存manga18重试信息: ${jumpUrl}`);

                    // 直接跳转到下一章
                    console.log('');
                    console.log('⏩ 正在跳转到:', jumpUrl);
                    console.log('════════════════════════════════════════');
                    GM_setValue('navigationTimestamp', Date.now());
                    window.location.href = jumpUrl;
                    return;
                }
                // ==================== manga18.club 特殊处理结束 ====================

                // ==================== 通用版本检测逻辑（根据用户选择）====================
                if (primaryUrl) {
                    console.log(`检查章节 ${nextChapterNum}...`);

                    // 检查优先版本是否存在
                    console.log(`等待检查${primaryType}版是否存在: ${primaryUrl}`);
                    const primaryExists = await checkChapterExists(primaryUrl);
                    console.log(`${primaryType}版检查结果: ${primaryExists ? '存在 ✓' : '不存在 ✗'}`);

                    if (primaryExists) {
                        // 找到优先版本
                        console.log(`✓ 找到${primaryType}版第 ${nextChapterNum} 章`);
                        if (taskData && currentMangaName) {
                            const nextTaskKey = `autoDownload_${currentMangaName}_${nextChapterNum}`;
                            GM_setValue(nextTaskKey, {
                                autoDownload: true,
                                mangaName: currentMangaName,
                                startChapter: nextChapterNum,
                                taskId: nextTaskKey
                            });
                            GM_setValue('currentAutoDownloadTask', {
                                mangaName: currentMangaName,
                                taskId: nextTaskKey
                            });
                            console.log(`为下一章创建任务数据: ${nextTaskKey}`);
                        }
                        GM_setValue('navigationTimestamp', Date.now());
                        window.location.href = primaryUrl;
                        return;
                    } else {
                        // 优先版本不存在，直接停止（不切换到备选版本）
                        console.log(`${primaryType}版不存在，用户选择的是${primaryType}版，停止自动下载`);
                        console.log(`不会自动切换到${secondaryType}版`);
                        if (taskId) {
                            GM_setValue(taskId, null);
                        }
                        GM_setValue('currentAutoDownloadTask', null);
                        stopAutoDownload();
                        alert(`✅ 所有${primaryType}版章节已下载完成！\n\n第 ${nextChapterNum} 章没有${primaryType}版。`);
                        return;
                    }
                } else {
                    // 无法构建优先版本URL，尝试备选版本
                    console.log(`无法构建章节 ${nextChapterNum} 的${primaryType}版URL，尝试${secondaryType}版...`);

                    if (secondaryUrl) {
                        const secondaryExists = await checkChapterExists(secondaryUrl);

                        if (secondaryExists) {
                            console.log(`✓ 找到${secondaryType}版: ${secondaryUrl}`);
                            if (taskData && currentMangaName) {
                                const nextTaskKey = `autoDownload_${currentMangaName}_${nextChapterNum}`;
                                GM_setValue(nextTaskKey, {
                                    autoDownload: true,
                                    mangaName: currentMangaName,
                                    startChapter: nextChapterNum,
                                    taskId: nextTaskKey
                                });
                                GM_setValue('currentAutoDownloadTask', {
                                    mangaName: currentMangaName,
                                    taskId: nextTaskKey
                                });
                                console.log(`为下一章创建任务数据: ${nextTaskKey}`);
                            }
                            GM_setValue('navigationTimestamp', Date.now());
                            window.location.href = secondaryUrl;
                            return;
                        } else {
                            console.log(`✗ 第 ${nextChapterNum} 章${secondaryType}版也不存在，停止自动下载`);
                            if (taskId) {
                                GM_setValue(taskId, null);
                            }
                            GM_setValue('currentAutoDownloadTask', null);
                            stopAutoDownload();
                            alert('✅ 所有章节已下载完成！\n\n已到达最后一章。');
                            return;
                        }
                    } else {
                        console.log('无法构建下一章的URL，停止自动下载');
                        if (taskId) {
                            GM_setValue(taskId, null);
                        }
                        GM_setValue('currentAutoDownloadTask', null);
                        stopAutoDownload();
                        alert('✅ 所有章节已下载完成！\n\n已到达最后一章。');
                        return;
                    }
                }
                // ==================== 通用版本检测逻辑结束 ====================
            }

            // 如果找不到下一章，停止自动下载
            console.log('找不到下一章，停止自动下载');
            // 清除任务数据
            if (taskId) {
                GM_setValue(taskId, null);
            }
            stopAutoDownload();
            alert('所有章节已下载完成！');
        }

        // 异步版本的扫描函数
        async function scanImagesAsync() {
            // 防止重复扫描
            if (isScanning) {
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

            // ==================== 主页检测（优先检测，避免无效操作）====================
            // 某些网站（manga18.club）在章节不存在时会重定向到主页
            // 所以需要检测当前页面是否是主页，如果是就停止自动下载
            const needsHomePageCheck =
                window.location.hostname.includes('manga18.club');

            if (needsHomePageCheck) {
                console.log('╔════════════════════════════════════════╗');
                console.log('║      🔍 主页检测（防止无效下载）      ║');
                console.log('╚════════════════════════════════════════╝');
                console.log('当前URL:', window.location.href);
                console.log('当前路径:', window.location.pathname);

                // 等待 500ms 让页面元素加载完成
                console.log('⏳ 等待500ms让页面元素加载...');
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('✓ 等待完成，开始检测');

                // 检测方法1：检查 URL 是否是主页地址
                const isHomePage =
                    window.location.href === 'https://manga18.club/' ||
                    window.location.href === 'https://manga18.club' ||
                    window.location.pathname === '/';  // 路径是根路径

                console.log('');
                console.log('【检测方法1】URL检测');
                console.log('  结果:', isHomePage ? '✓ 是主页' : '✗ 不是主页');

                // 检测方法2：检查是否有大量封面图片（主页的典型特征）
                // 主页会显示很多漫画的封面，而章节页只有漫画内容图片
                const coverThumbs = document.querySelectorAll('img[src*="cover_thumb"], img[src*="cover-thumb"], img[src*="cover_thumb_2"]');
                const hasManyCovers = coverThumbs.length > 10;  // 超过10个封面图就判定为主页

                console.log('');
                console.log('【检测方法2】封面图检测');
                console.log('  封面图数量:', coverThumbs.length);
                console.log('  判定阈值: > 10');
                console.log('  结果:', hasManyCovers ? '✓ 是主页（封面图过多）' : '✗ 不是主页');

                // 检测方法3：检查是否有 cover_thumb_2.webp（主页封面特征）
                // manga18.club 的主页封面文件名都是 cover_thumb_2.webp
                // 出现 3 次及以上则判断为主页
                const allWebpImages = document.querySelectorAll('img[src$=".webp"]');
                const coverThumb2Count = Array.from(allWebpImages).filter(img =>
                    img.src.includes('cover_thumb_2.webp')
                ).length;
                const hasWebpCovers = coverThumb2Count >= 3;  // 3个及以上 cover_thumb_2.webp 判定为主页

                console.log('');
                console.log('【检测方法3】主页封面webp检测');
                console.log('  cover_thumb_2.webp数量:', coverThumb2Count);
                console.log('  判定阈值: >= 3');
                console.log('  结果:', hasWebpCovers ? '✓ 是主页（主页封面过多）' : '✗ 不是主页');

                // 检测方法4：检查是否有 404 相关的标记
                const all404Images = document.querySelectorAll('img[src*="404.png"], img[src*="404.jpg"]');
                const has404Text = document.body.textContent.includes('404') ||
                                document.body.textContent.includes('not found') ||
                                document.body.textContent.includes('Page not found');
                const hasVeryFewImages = document.querySelectorAll('img').length < 3;

                console.log('');
                console.log('【检测方法4】404特征检测');
                console.log('  有404图片:', all404Images.length > 0);
                console.log('  有404文字:', has404Text);
                console.log('  图片很少:', hasVeryFewImages, `(总共${document.querySelectorAll('img').length}张)`);
                console.log('  结果:', (has404Text && hasVeryFewImages) ? '✓ 是404页面' : '✗ 不是404页面');

                // 综合判断：满足任一条件就认为是主页或404页面
                const is404Page = all404Images.length > 0 ||   // 有404图片
                                isHomePage ||                   // URL是主页
                                hasManyCovers ||                // 有大量封面图
                                hasWebpCovers ||                // 有大量webp图片
                                (has404Text && hasVeryFewImages); // 有404文字且图片很少

                console.log('');
                console.log('════════════════════════════════════════');
                console.log('【综合判断】');
                console.log('  满足以下任一条件即判定为主页/404:');
                console.log('  1. URL是主页:', isHomePage);
                console.log('  2. 封面图过多:', hasManyCovers, `(${coverThumbs.length}个)`);
                console.log('  3. 主页封面webp过多:', hasWebpCovers, `(${coverThumb2Count}个cover_thumb_2.webp)`);
                console.log('  4. 有404图片:', all404Images.length > 0);
                console.log('  5. 404文字+图片少:', has404Text && hasVeryFewImages);
                console.log('');
                console.log('  最终结果:', is404Page ? '🛑 是主页/404' : '✓ 是有效章节页');
                console.log('════════════════════════════════════════');

                if (is404Page) {
                    // 检测到主页或404
                    console.log('');
                    console.log('╔════════════════════════════════════════╗');
                    console.log('║   检测到主页/404，检查备用URL      ║');
                    console.log('╚════════════════════════════════════════╝');
                    console.log('当前URL:', window.location.href);

                    // manga18.club 特殊处理：尝试纯数字格式的URL
                    // 从保存的任务数据中获取信息（因为跳转到主页后URL信息丢失）
                    const currentTaskInfo = GM_getValue('currentAutoDownloadTask', null);
                    // 同时检查 manga18_pending_retry，这是专门为 manga18.club 保存的重试信息
                    const manga18PendingRetry = GM_getValue('manga18_pending_retry', null);

                    console.log('任务信息:', currentTaskInfo);
                    console.log('manga18重试信息:', manga18PendingRetry);
                    console.log('isAutoDownloading:', isAutoDownloading);

                    // 优先使用 manga18_pending_retry（专门为 manga18.club 保存的重试信息）
                    if (manga18PendingRetry && manga18PendingRetry.chapterFormatUrl && manga18PendingRetry.urlFormat === 'chapter') {
                        console.log('════════════════════════════════════════');
                        console.log('🔄 使用manga18重试信息，chapter-X格式跳转到主页，尝试纯数字格式...');
                        console.log('保存的chapter格式URL:', manga18PendingRetry.chapterFormatUrl);

                        const chapterUrl = manga18PendingRetry.chapterFormatUrl;
                        // 正则匹配 chapter-数字 或 chapter-数字-raw，替换为纯数字（保留可能的-raw后缀）
                        // 例如: /chapter-40 -> /40
                        // 例如: /chapter-40-raw -> /40-raw (但manga18.club的raw版漫画名已包含-raw，章节不需要-raw)
                        // 所以对于manga18.club，直接去掉chapter-前缀和可能的-raw后缀
                        const numberFormatUrl = chapterUrl.replace(/\/chapter-(\d+)(-raw)?(\/?)$/, '/$1$3');

                        console.log('原chapter格式URL:', chapterUrl);
                        console.log('纯数字格式URL:', numberFormatUrl);

                        // 更新重试信息，标记为已尝试纯数字格式
                        GM_setValue('manga18_pending_retry', {
                            ...manga18PendingRetry,
                            urlFormat: 'number',
                            numberFormatUrl: numberFormatUrl
                        });

                        console.log('⏩ 正在跳转到纯数字格式URL（不弹警告）...');
                        console.log('════════════════════════════════════════');

                        GM_setValue('navigationTimestamp', Date.now());
                        window.location.href = numberFormatUrl;
                        throw new Error('404_PAGE_DETECTED');
                    }

                    // 备用方案：使用 currentAutoDownloadTask
                    if (isAutoDownloading && currentTaskInfo && currentTaskInfo.taskId) {
                        const taskData = GM_getValue(currentTaskInfo.taskId, null);
                        console.log('任务数据:', taskData);

                        // 检查是否是 chapter-X 格式跳转到主页，且还没尝试过纯数字格式
                        if (taskData && taskData.urlFormat === 'chapter' && taskData.chapterFormatUrl) {
                            console.log('════════════════════════════════════════');
                            console.log('🔄 chapter-X 格式跳转到主页，尝试纯数字格式...');
                            console.log('保存的chapter格式URL:', taskData.chapterFormatUrl);

                            // 从保存的 chapter-X 格式 URL 构建纯数字格式 URL
                            // 例如: https://manga18.club/manhwa/wireless-onahole-raw/chapter-60
                            //   ->  https://manga18.club/manhwa/wireless-onahole-raw/60
                            const chapterUrl = taskData.chapterFormatUrl;

                            // 使用正则替换 chapter-数字 为 纯数字（处理可能的-raw后缀）
                            const numberFormatUrl = chapterUrl.replace(/\/chapter-(\d+)(-raw)?(\/?)$/, '/$1$3');

                            console.log('原chapter格式URL:', chapterUrl);
                            console.log('纯数字格式URL:', numberFormatUrl);

                            // 更新任务数据，标记为已尝试纯数字格式
                            taskData.urlFormat = 'number';
                            taskData.numberFormatUrl = numberFormatUrl;
                            GM_setValue(currentTaskInfo.taskId, taskData);

                            console.log('⏩ 正在跳转到纯数字格式URL（不弹警告）...');
                            console.log('════════════════════════════════════════');

                            GM_setValue('navigationTimestamp', Date.now());
                            window.location.href = numberFormatUrl;
                            throw new Error('404_PAGE_DETECTED');
                        }
                    }

                    // 清除 manga18 重试信息（已经尝试过纯数字格式或不需要重试）
                    GM_setValue('manga18_pending_retry', null);

                    // 如果已经是纯数字格式或不满足条件，说明真的下载完了
                    console.log('════════════════════════════════════════');
                    console.log('🛑 确认下载完成，停止自动下载');

                    isScanning = false;

                    // 恢复扫描按钮状态
                    if (scanButton) {
                        scanButton.disabled = false;
                        scanButton.textContent = '🔍 扫描';
                    }

                    // 如果是自动下载模式，停止并提示
                    if (isAutoDownloading) {
                        stopAutoDownload();

                        // 清除所有任务数据
                        const currentMangaName = extractMangaName();
                        const currentChapter = extractChapterNumber();
                        if (currentMangaName && currentChapter) {
                            const taskKey = `autoDownload_${currentMangaName}_${currentChapter}`;
                            GM_setValue(taskKey, null);
                        }
                        GM_setValue('currentAutoDownloadTask', null);

                        alert('✅ 所有章节已下载完成！\n\n检测到 404 页面或主页，已到达最后一章。');
                    }

                    // 抛出一个特殊错误，让 processAutoDownload 停止执行
                    throw new Error('404_PAGE_DETECTED');
                }
            }
            // ==================== 主页检测结束 ====================

            // ==================== 统一滚动策略（所有站点）====================
            // 很多漫画网站使用"懒加载"技术：图片只有滚动到可见区域才会加载
            // 而且即使滚动完成，图片也不会立即加载，而是有固定延迟
            // 所以采用统一策略：滚动到底部 → 回到顶部 → 等待2秒
            console.log('🔄 开始统一滚动策略...');

            // 第一步：滚动到页面最底部，触发图片加载
            const maxHeight = document.documentElement.scrollHeight;
            window.scrollTo(0, maxHeight);
            console.log('✓ 已滚动到底部');

            // 等待 100 毫秒
            await new Promise(resolve => setTimeout(resolve, 100));

            // 第二步：滚回到顶部
            window.scrollTo(0, 0);
            console.log('✓ 已回到顶部');

            // 第三步：等待 2 秒让图片完全加载出来
            console.log('⏳ 等待2秒让图片加载...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('✅ 等待完成，开始扫描图片');
            // ==================== 统一滚动策略结束 ====================

            // 更新扫描按钮状态
            if (scanButton) {
                scanButton.disabled = true;
                scanButton.textContent = '⏳ 扫描中...';
            }

            imageUrls = [];
            const urlSet = new Set();

            // 执行2次扫描，每次间隔1.5秒，确保捕获延迟加载的图片
            const scanRounds = 2;
            for (let round = 1; round <= scanRounds; round++) {
                console.log(`\n=== 第 ${round}/${scanRounds} 轮扫描 ===`);

                if (scanButton) {
                    scanButton.textContent = `⏳ 扫描中 ${round}/${scanRounds}...`;
                }

                // 扫描所有img标签
                const images = document.querySelectorAll('img');
                let newFoundCount = 0;

                images.forEach(img => {
                    // 检查图片是否可见（放宽条件）
                    const style = window.getComputedStyle(img);
                    const isVisible = style.display !== 'none' &&
                                    style.visibility !== 'hidden' &&
                                    img.offsetWidth > 0 &&
                                    img.offsetHeight > 0;

                    if (!isVisible) {
                        return;
                    }

                    // 获取图片源（多种方式尝试）
                    let src = img.src || img.dataset.src || img.dataset.lazySrc || img.getAttribute('data-original') || '';
                    if (!src || !src.startsWith('http')) {
                        return;
                    }

                    // 移除URL参数
                    src = src.split('?')[0];

                    // 先检查格式：必须是有效的图片格式
                    if (!isValidImageFormat(src) || !isPureNumberJpg(src)) {
                        return;
                    }

                    // 避免重复
                    if (urlSet.has(src)) {
                        return;
                    }

                    // 获取实际图片尺寸（优先使用naturalWidth/Height）
                    const width = img.naturalWidth || img.offsetWidth || 0;
                    const height = img.naturalHeight || img.offsetHeight || 0;
                    const filename = extractFilename(src);

                    // ==================== logo 过滤（通用）====================
                    // 过滤网站 logo 图片：宽高比约为 590:77 (约7.66)
                    // 这是 manhwaclub.net 等网站的 logo 特征
                    if (width > 0 && height > 0) {
                        const aspectRatio = width / height;  // 计算宽高比

                        // 如果宽高比在 7.5 到 7.8 之间，判定为 logo
                        if (aspectRatio >= 7.5 && aspectRatio <= 7.8) {
                            console.log(`跳过logo图片: ${filename} (${width}x${height}, 比例: ${aspectRatio.toFixed(2)})`);
                            return;
                        }

                        // 过滤小图：只有当尺寸明确小于100x100时才跳过
                        // 这些可能是缩略图、图标等，不是漫画内容
                        if (width < 100 && height < 100) {
                            console.log(`跳过小图: ${filename} (${width}x${height})`);
                            return;
                        }
                    }
                    // ==================== logo 过滤结束 ====================

                    // ==================== manga18.club logo 过滤 ====================
                    // manga18.club 网站有一个特殊的 logo 图片叫 "1.jpg"
                    // 这个图片虽然符合有效图片的格式，但它不是漫画内容，而是网站 logo
                    // 所以需要单独过滤掉，避免下载到 logo
                    const isManga18 = window.location.hostname.includes('manga18.club');
                    if (isManga18 && filename === '1.jpg') {
                        console.log(`跳过 manga18.club logo: ${filename} (${width}x${height})`);
                        return;
                    }
                    // ==================== manga18.club logo 过滤结束 ====================

                    // 添加到列表
                    urlSet.add(src);
                    imageUrls.push({
                        url: src,
                        filename: filename
                    });
                    newFoundCount++;
                    console.log(`✓ [第${round}轮] 找到新图片: ${filename} (${width}x${height})`);
                });

                console.log(`第 ${round} 轮扫描完成，本轮新发现 ${newFoundCount} 张图片，累计 ${imageUrls.length} 张`);

                // 如果不是最后一轮，等待1.5秒后继续（给图片更多加载时间）
                if (round < scanRounds) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

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
            console.log(`自动扫描完成！发现 ${imageUrls.length} 张有效图片`);
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

                    // 构建文件名格式：序号-漫画名-第X话_原文件名
                    const formattedName = mangaName ? (formatMangaTitle(mangaName) || mangaName) : '';
                    const chapterPart = chapterNumber ? `-第${chapterNumber}话` : '';

                    if (item.filename) {
                        // 格式：序号-漫画名-第X话_原文件名
                        if (formattedName) {
                            finalFilename = `${indexStr}-${formattedName}${chapterPart}_${item.filename}`;
                        } else {
                            finalFilename = `${indexStr}${chapterPart}_${item.filename}`;
                        }
                    } else {
                        const ext = item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
                        const extension = ext ? ext[1].toLowerCase() : 'jpg';
                        if (formattedName) {
                            finalFilename = `${indexStr}-${formattedName}${chapterPart}_image.${extension}`;
                        } else {
                            finalFilename = `${indexStr}${chapterPart}_image.${extension}`;
                        }
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

        // 更新版本选择按钮的状态
        function updateVersionButtons() {
            if (!normalVersionBtn || !rawVersionBtn) return;

            if (preferRawVersion) {
                // 选择了 Raw 版
                rawVersionBtn.style.opacity = '1';
                rawVersionBtn.style.boxShadow = '0 0 5px rgba(255, 152, 0, 0.5)';
                normalVersionBtn.style.opacity = '0.4';
                normalVersionBtn.style.boxShadow = 'none';
            } else {
                // 选择了英文版
                normalVersionBtn.style.opacity = '1';
                normalVersionBtn.style.boxShadow = '0 0 5px rgba(33, 150, 243, 0.5)';
                rawVersionBtn.style.opacity = '0.4';
                rawVersionBtn.style.boxShadow = 'none';
            }
        }

        // 更新下载模式按钮的状态
        function updateDownloadModeButtons() {
            if (!noZipBtn || !zipModeBtn) return;

            if (useZipDownload) {
                // 选择了打包
                zipModeBtn.style.opacity = '1';
                zipModeBtn.style.boxShadow = '0 0 5px rgba(121, 85, 72, 0.5)';
                noZipBtn.style.opacity = '0.4';
                noZipBtn.style.boxShadow = 'none';
            } else {
                // 选择了不打包
                noZipBtn.style.opacity = '1';
                noZipBtn.style.boxShadow = '0 0 5px rgba(96, 125, 139, 0.5)';
                zipModeBtn.style.opacity = '0.4';
                zipModeBtn.style.boxShadow = 'none';
            }
        }

        // 切换自动下载状态
        function toggleAutoDownload() {
            if (!isAutoDownloading) {
                // 开始自动下载（去除提示窗口，直接启动）
                startAutoDownload();
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

        // 显示下载模式选择对话框
        function showDownloadModeDialog(targetChapter) {
            // 创建对话框背景
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 300px;
                width: 90%;
            `;

            // 标题
            const title = document.createElement('h3');
            title.textContent = `即将跳转到第 ${targetChapter} 章`;
            title.style.cssText = `
                margin: 0 0 10px 0;
                color: #333;
                font-size: 18px;
                text-align: center;
            `;

            // 提示文字
            const hint = document.createElement('p');
            hint.textContent = '请选择你的操作';
            hint.style.cssText = `
                margin: 0 0 5px 0;
                color: #666;
                font-size: 14px;
                text-align: center;
            `;

            // 小字提示
            const warningHint = document.createElement('p');
            warningHint.textContent = '跳转花个几秒是正常的';
            warningHint.style.cssText = `
                margin: 0 0 15px 0;
                color: #999;
                font-size: 11px;
                text-align: center;
            `;

            // 按钮容器
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;

            // 阅读该章节按钮
            const readButton = document.createElement('button');
            readButton.textContent = '📖 阅读该章节';
            readButton.style.cssText = `
                padding: 12px;
                background: #9C27B0;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            readButton.onclick = function() {
                document.body.removeChild(overlay);
                goToChapterReadOnly(targetChapter);
            };

            // 下载该章节按钮
            const singleButton = document.createElement('button');
            singleButton.textContent = '⬇️ 下载该章节';
            singleButton.style.cssText = `
                padding: 12px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            singleButton.onclick = function() {
                document.body.removeChild(overlay);
                goToChapter(targetChapter, false);
            };

            // 取消按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                padding: 12px;
                background: #9e9e9e;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            `;
            cancelButton.onclick = function() {
                document.body.removeChild(overlay);
            };

            // 组装对话框
            buttonGroup.appendChild(readButton);
            buttonGroup.appendChild(singleButton);
            buttonGroup.appendChild(cancelButton);

            dialog.appendChild(title);
            dialog.appendChild(warningHint);
            dialog.appendChild(hint);
            dialog.appendChild(buttonGroup);

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 点击背景关闭
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        }

        // 跳转到指定章节（仅阅读，不下载）
        async function goToChapterReadOnly(targetChapter) {
            const currentMangaName = extractMangaName();
            if (!currentMangaName) {
                alert('无法识别漫画名称\n\n当前URL: ' + window.location.href);
                return;
            }

            const baseUrl = window.location.origin;
            const pathname = window.location.pathname;

            let pathPrefix = '/manga/';
            if (pathname.includes('/manhwa/')) {
                pathPrefix = '/manhwa/';
            } else if (pathname.includes('/webtoon/')) {
                pathPrefix = '/webtoon/';
            }

            try {
                const normalUrl = baseUrl + pathPrefix + currentMangaName + '/chapter-' + targetChapter;
                const rawUrl = baseUrl + pathPrefix + currentMangaName + '/chapter-' + targetChapter + '-raw';

                const primaryUrl = preferRawVersion ? rawUrl : normalUrl;
                const secondaryUrl = preferRawVersion ? normalUrl : rawUrl;

                const primaryExists = await checkChapterExists(primaryUrl);

                let finalUrl = null;
                if (primaryExists) {
                    finalUrl = primaryUrl;
                } else {
                    const secondaryExists = await checkChapterExists(secondaryUrl);
                    if (secondaryExists) {
                        finalUrl = secondaryUrl;
                    }
                }

                if (finalUrl) {
                    window.location.href = finalUrl;
                } else {
                    alert(`❌ 第 ${targetChapter} 章不存在\n\n请检查章节号是否正确。`);
                }
            } catch (error) {
                console.error('跳转失败:', error);
                alert('跳转失败，请重试');
            }
        }

        // 跳转到指定章节并下载
        async function goToChapter(targetChapter, autoDownloadRemaining) {
            // 提取当前URL的漫画名
            const currentMangaName = extractMangaName();
            if (!currentMangaName) {
                alert('无法识别漫画名称\n\n当前URL: ' + window.location.href);
                return;
            }

            const baseUrl = window.location.origin;
            const pathname = window.location.pathname;

            // 根据当前网站确定路径格式
            let pathPrefix = '/manga/';
            if (pathname.includes('/manhwa/')) {
                pathPrefix = '/manhwa/';
            } else if (pathname.includes('/webtoon/')) {
                pathPrefix = '/webtoon/';
            }

            console.log(`========================================`);
            console.log(`准备跳转到第 ${targetChapter} 章`);
            console.log(`当前URL: ${window.location.href}`);
            console.log(`漫画名: ${currentMangaName}`);
            console.log(`路径前缀: ${pathPrefix}`);
            console.log(`自动下载后续章节: ${autoDownloadRemaining}`);
            console.log(`========================================`);

            try {
                const normalUrl = baseUrl + pathPrefix + currentMangaName + '/chapter-' + targetChapter;
                const rawUrl = baseUrl + pathPrefix + currentMangaName + '/chapter-' + targetChapter + '-raw';

                // 根据用户选择决定优先版本
                const primaryUrl = preferRawVersion ? rawUrl : normalUrl;
                const secondaryUrl = preferRawVersion ? normalUrl : rawUrl;
                const primaryType = preferRawVersion ? 'raw' : '英文';
                const secondaryType = preferRawVersion ? '英文' : 'raw';

                console.log(`📌 用户选择：优先检查 ${primaryType} 版`);
                console.log(`检查${primaryType}版: ${primaryUrl}`);
                const primaryExists = await checkChapterExists(primaryUrl);
                console.log(`${primaryType}版检查结果: ${primaryExists ? '存在✓' : '不存在✗'}`);

                let finalUrl = null;

                if (primaryExists) {
                    // 找到优先版本
                    console.log(`✓ 找到${primaryType}版第 ${targetChapter} 章`);
                    finalUrl = primaryUrl;
                } else {
                    // 优先版本不存在，尝试备选版本
                    console.log(`${primaryType}版不存在，检查 ${secondaryType} 版: ${secondaryUrl}`);
                    const secondaryExists = await checkChapterExists(secondaryUrl);
                    console.log(`${secondaryType} 版检查结果: ${secondaryExists ? '存在✓' : '不存在✗'}`);

                    if (secondaryExists) {
                        // 找到备选版本
                        console.log(`✓ 找到 ${secondaryType} 版第 ${targetChapter} 章`);
                        finalUrl = secondaryUrl;
                    } else {
                        // 两个版本都不存在
                        console.log(`✗ 第 ${targetChapter} 章不存在（${primaryType}版和 ${secondaryType} 版都没有）`);

                        alert(`第 ${targetChapter} 章不存在！\n\n已检查：\n• ${normalUrl}\n• ${rawUrl}\n\n都没有找到有效章节（少于2张有效图片）。\n\n请检查章节号是否正确。`);
                        return;
                    }
                }

                // 找到有效章节，准备跳转
                console.log(`========================================`);
                console.log(`准备跳转到: ${finalUrl}`);
                console.log(`========================================`);

                if (autoDownloadRemaining) {
                    // 如果是批量下载模式，启用自动下载
                    GM_setValue('isAutoDownloading', true);
                    GM_setValue('targetChapter', targetChapter);
                    console.log(`✓ 已启用自动下载模式`);
                } else {
                    // 单章节下载模式，设置标记让页面加载后自动下载
                    GM_setValue('singleChapterDownload', true);
                    console.log(`✓ 已设置单章节下载标记`);
                }

                // 跳转到找到的章节
                window.location.href = finalUrl;
            } catch (error) {
                console.error('跳转过程出错:', error);
                alert(`跳转失败！\n\n错误信息: ${error.message}\n\n请查看控制台了解详情。`);
            }
        }

        // ==================== 漫画库功能 ====================

        // 初始化漫画库数据
        // 新数据结构: 分组 → 中文漫画名 → 英文漫画名（多个）
        function initMangaLibrary() {
            mangaLibrary = GM_getValue('mangaLibrary_v2', { groups: [], mangas: [] });
            // 确保数据结构完整
            if (!mangaLibrary.groups) mangaLibrary.groups = [];
            if (!mangaLibrary.mangas) mangaLibrary.mangas = [];
            // 确保每个漫画都有 englishNames 数组
            mangaLibrary.mangas.forEach(manga => {
                if (!manga.englishNames) manga.englishNames = [];
            });
        }

        // 保存漫画库数据
        function saveMangaLibrary() {
            GM_setValue('mangaLibrary_v2', mangaLibrary);
        }

        // 初始化下载历史
        function initDownloadHistory() {
            downloadHistory = GM_getValue('downloadHistory', {});
        }

        // 保存下载历史
        function saveDownloadHistory() {
            GM_setValue('downloadHistory', downloadHistory);
        }

        // 记录下载进度（漫画名 -> {chapter, isRaw, date}）
        function recordDownloadProgress(mangaName, chapter, isRaw) {
            initDownloadHistory();
            const slug = mangaName.toLowerCase().replace(/\s+/g, '-');
            downloadHistory[slug] = {
                chapter: chapter,
                isRaw: isRaw,
                date: new Date().toLocaleString('zh-CN')
            };
            saveDownloadHistory();
            console.log(`📝 记录下载进度: ${mangaName} 第${chapter}章 (${isRaw ? 'Raw版' : '英文版'})`);
        }

        // 获取下载进度
        function getDownloadProgress(englishName) {
            initDownloadHistory();
            const slug = englishName.toLowerCase().replace(/\s+/g, '-');
            return downloadHistory[slug] || null;
        }

        // 根据英文名生成各站点URL
        function generateMangaUrls(englishName) {
            const slug = englishName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return SUPPORTED_SITES.map(site => ({
                name: site.name,
                url: site.baseUrl + slug + '/'
            }));
        }

        // 显示漫画库对话框
        function showMangaLibraryDialog() {
            initMangaLibrary();

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: auto;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                max-width: 450px;
                width: 95%;
            `;

            // 标题栏
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            `;

            const title = document.createElement('h2');
            title.textContent = '📚 漫画库';
            title.style.cssText = `margin: 0; color: #333; font-size: 18px;`;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
            `;
            closeBtn.onclick = () => document.body.removeChild(overlay);

            header.appendChild(title);
            header.appendChild(closeBtn);

            // 操作按钮区
            const actionBar = document.createElement('div');
            actionBar.style.cssText = `
                display: flex;
                gap: 8px;
                margin-bottom: 15px;
            `;

            const addGroupBtn = document.createElement('button');
            addGroupBtn.textContent = '➕ 新建分组';
            addGroupBtn.style.cssText = `
                flex: 1;
                padding: 8px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            addGroupBtn.onclick = () => showAddGroupDialog(overlay, dialog, contentArea);

            const addMangaBtn = document.createElement('button');
            addMangaBtn.textContent = '➕ 添加中文漫画名';
            addMangaBtn.style.cssText = `
                flex: 1;
                padding: 8px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            addMangaBtn.onclick = () => showAddMangaDialog(overlay, dialog, contentArea);

            actionBar.appendChild(addGroupBtn);
            actionBar.appendChild(addMangaBtn);

            // 内容区域（固定高度，可滚动）
            const contentArea = document.createElement('div');
            contentArea.id = 'manga-library-content';
            contentArea.style.cssText = `
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #eee;
                border-radius: 6px;
                padding: 5px;
            `;
            renderLibraryContent(contentArea);

            // 导入导出按钮区
            const importExportBar = document.createElement('div');
            importExportBar.style.cssText = `
                display: flex;
                gap: 8px;
                margin-top: 10px;
            `;

            const exportBtn = document.createElement('button');
            exportBtn.textContent = '📤 导出';
            exportBtn.style.cssText = `
                flex: 1;
                padding: 8px;
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            exportBtn.onclick = () => exportMangaLibrary();

            const importBtn = document.createElement('button');
            importBtn.textContent = '📥 导入';
            importBtn.style.cssText = `
                flex: 1;
                padding: 8px;
                background: #9C27B0;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            importBtn.onclick = () => importMangaLibrary(contentArea);

            importExportBar.appendChild(exportBtn);
            importExportBar.appendChild(importBtn);

            dialog.appendChild(header);
            dialog.appendChild(actionBar);
            dialog.appendChild(contentArea);
            dialog.appendChild(importExportBar);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) document.body.removeChild(overlay);
            });
        }

        // 导出漫画库
        function exportMangaLibrary() {
            const data = JSON.stringify(mangaLibrary, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `manga-library-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // 导入漫画库
        function importMangaLibrary(contentArea) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        // 验证数据结构
                        if (!data.groups || !data.mangas) {
                            alert('❌ 无效的漫画库文件格式');
                            return;
                        }

                        if (confirm(`确定导入吗？\n\n将导入 ${data.groups.length} 个分组，${data.mangas.length} 部漫画。\n\n⚠️ 这将覆盖当前的漫画库数据！`)) {
                            mangaLibrary = data;
                            saveMangaLibrary();
                            renderLibraryContent(contentArea);
                            alert('✅ 导入成功！');
                        }
                    } catch (err) {
                        alert('❌ 导入失败：文件格式错误\n\n' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        // 渲染漫画库内容
        function renderLibraryContent(container) {
            container.innerHTML = '';

            if (mangaLibrary.groups.length === 0 && mangaLibrary.mangas.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: #999; padding: 30px;">
                        <p>📭 漫画库为空</p>
                        <p style="font-size: 12px;">点击上方按钮添加分组或漫画</p>
                    </div>
                `;
                return;
            }

            // 渲染分组
            mangaLibrary.groups.forEach(group => {
                const groupDiv = createGroupElement(group, container);
                container.appendChild(groupDiv);
            });

            // 渲染未分组的漫画
            const ungroupedMangas = mangaLibrary.mangas.filter(m => !m.groupId);
            if (ungroupedMangas.length > 0) {
                const ungroupedDiv = document.createElement('div');
                ungroupedDiv.style.cssText = `margin-top: 10px;`;

                const ungroupedTitle = document.createElement('div');
                ungroupedTitle.textContent = '📁 未分组';
                ungroupedTitle.style.cssText = `
                    font-weight: bold;
                    color: #666;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                `;
                ungroupedDiv.appendChild(ungroupedTitle);

                ungroupedMangas.forEach(manga => {
                    ungroupedDiv.appendChild(createMangaElement(manga, container));
                });
                container.appendChild(ungroupedDiv);
            }
        }

        // 创建分组元素
        function createGroupElement(group, contentArea) {
            const groupDiv = document.createElement('div');
            groupDiv.style.cssText = `
                margin-bottom: 10px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            `;

            // 分组标题栏
            const groupHeader = document.createElement('div');
            groupHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #f5f5f5;
                cursor: pointer;
            `;

            const groupTitle = document.createElement('span');
            groupTitle.textContent = `📁 ${group.name}`;
            groupTitle.style.cssText = `font-weight: bold; color: #333;`;

            const groupActions = document.createElement('div');
            groupActions.style.cssText = `display: flex; gap: 5px;`;

            const deleteGroupBtn = document.createElement('button');
            deleteGroupBtn.textContent = '🗑️';
            deleteGroupBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
            `;
            deleteGroupBtn.onclick = (e) => {
                e.stopPropagation();
                const mangaCount = mangaLibrary.mangas.filter(m => m.groupId === group.id).length;
                if (confirm(`确定删除分组「${group.name}」吗？\n\n⚠️ 分组内的 ${mangaCount} 部漫画也将被删除！`)) {
                    // 删除分组内的所有漫画
                    mangaLibrary.mangas = mangaLibrary.mangas.filter(m => m.groupId !== group.id);
                    mangaLibrary.groups = mangaLibrary.groups.filter(g => g.id !== group.id);
                    saveMangaLibrary();
                    renderLibraryContent(contentArea);
                }
            };

            groupActions.appendChild(deleteGroupBtn);
            groupHeader.appendChild(groupTitle);
            groupHeader.appendChild(groupActions);

            // 分组内容（默认收起）
            const groupContent = document.createElement('div');
            groupContent.style.cssText = `padding: 5px 10px; display: none;`;

            const groupMangas = mangaLibrary.mangas.filter(m => m.groupId === group.id);
            if (groupMangas.length === 0) {
                groupContent.innerHTML = `<p style="color: #999; font-size: 12px; text-align: center;">暂无漫画</p>`;
            } else {
                groupMangas.forEach(manga => {
                    groupContent.appendChild(createMangaElement(manga, contentArea));
                });
            }

            // 点击标题栏展开/收起
            groupHeader.onclick = () => {
                const isExpanding = groupContent.style.display === 'none';
                groupContent.style.display = isExpanding ? 'block' : 'none';

                // 当分组收起时，重置所有漫画的链接区域为收起状态
                if (!isExpanding) {
                    const linksAreas = groupContent.querySelectorAll('.manga-links-area');
                    const expandBtns = groupContent.querySelectorAll('.manga-expand-btn');
                    linksAreas.forEach(area => area.style.display = 'none');
                    expandBtns.forEach(btn => btn.textContent = '📝');
                }
            };

            // 检查是否需要自动展开分组（添加英文名后）
            if (group._shouldExpand) {
                groupContent.style.display = 'block';
                delete group._shouldExpand;  // 清除标记
            }

            groupDiv.appendChild(groupHeader);
            groupDiv.appendChild(groupContent);
            return groupDiv;
        }

        // 创建漫画元素（新三层结构：中文名 → 英文名列表）
        function createMangaElement(manga, contentArea) {
            const mangaDiv = document.createElement('div');
            mangaDiv.style.cssText = `
                padding: 10px;
                margin: 5px 0;
                background: #fafafa;
                border-radius: 6px;
                border: 1px solid #eee;
            `;

            // 漫画标题行（中文名）
            const titleRow = document.createElement('div');
            titleRow.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            `;

            const titleInfo = document.createElement('div');
            titleInfo.style.cssText = `flex: 1;`;

            const chineseTitle = document.createElement('div');
            chineseTitle.textContent = manga.chineseName || '未命名';
            chineseTitle.style.cssText = `font-weight: bold; color: #333; font-size: 13px;`;

            titleInfo.appendChild(chineseTitle);

            // 操作按钮
            const mangaActions = document.createElement('div');
            mangaActions.style.cssText = `display: flex; gap: 5px;`;

            const addEnglishBtn = document.createElement('button');
            addEnglishBtn.textContent = '➕';
            addEnglishBtn.title = '添加英文名';
            addEnglishBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
            `;
            addEnglishBtn.onclick = (e) => {
                e.stopPropagation();
                showAddEnglishNameDialog(manga, contentArea);
            };

            const expandBtn = document.createElement('button');
            expandBtn.textContent = '📝';
            expandBtn.title = '展开英文名';
            expandBtn.className = 'manga-expand-btn';
            expandBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
            `;

            const deleteMangaBtn = document.createElement('button');
            deleteMangaBtn.textContent = '🗑️';
            deleteMangaBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
            `;
            deleteMangaBtn.onclick = () => {
                mangaLibrary.mangas = mangaLibrary.mangas.filter(m => m.id !== manga.id);
                saveMangaLibrary();
                renderLibraryContent(contentArea);
            };

            mangaActions.appendChild(addEnglishBtn);
            mangaActions.appendChild(expandBtn);
            mangaActions.appendChild(deleteMangaBtn);

            titleRow.appendChild(titleInfo);
            titleRow.appendChild(mangaActions);

            // 英文名列表区域（默认隐藏）
            const englishNamesArea = document.createElement('div');
            englishNamesArea.className = 'manga-links-area';
            englishNamesArea.style.cssText = `
                display: none;
                margin-top: 8px;
                padding-left: 10px;
                border-left: 2px solid #e0e0e0;
            `;

            // 确保 englishNames 数组存在
            if (!manga.englishNames) manga.englishNames = [];

            // 渲染英文名列表
            const renderEnglishNames = () => {
                englishNamesArea.innerHTML = '';

                if (manga.englishNames.length === 0) {
                    englishNamesArea.innerHTML = `<p style="color: #999; font-size: 11px;">暂无英文名，点击 ➕ 添加</p>`;
                    return;
                }

                manga.englishNames.forEach(engName => {
                    const engDiv = createEnglishNameElement(manga, engName, contentArea, renderEnglishNames);
                    englishNamesArea.appendChild(engDiv);
                });
            };

            renderEnglishNames();

            // 展开/收起英文名列表
            expandBtn.onclick = () => {
                const isExpanded = englishNamesArea.style.display !== 'none';
                englishNamesArea.style.display = isExpanded ? 'none' : 'block';
                expandBtn.textContent = isExpanded ? '📝' : '📖';
            };

            // 检查是否需要自动展开（添加英文名后）
            if (manga._shouldExpand) {
                englishNamesArea.style.display = 'block';
                expandBtn.textContent = '📖';
                delete manga._shouldExpand;  // 清除标记
            }

            mangaDiv.appendChild(titleRow);
            mangaDiv.appendChild(englishNamesArea);
            return mangaDiv;
        }

        // 创建英文名元素（子级）
        function createEnglishNameElement(manga, engName, contentArea, refreshCallback) {
            // 兼容旧数据格式（字符串）和新格式（对象）
            if (typeof engName === 'string') {
                engName = { id: Date.now().toString(), name: engName, hiddenSites: [] };
            }

            const engDiv = document.createElement('div');
            engDiv.style.cssText = `
                padding: 8px;
                margin: 5px 0;
                background: white;
                border-radius: 4px;
                border: 1px solid #eee;
            `;

            // 英文名标题行
            const engTitleRow = document.createElement('div');
            engTitleRow.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            const engTitleInfo = document.createElement('div');
            engTitleInfo.style.cssText = `flex: 1;`;

            const engTitle = document.createElement('div');
            engTitle.textContent = engName.name;
            engTitle.style.cssText = `font-size: 12px; color: #555;`;

            // 检查下载进度
            const progress = getDownloadProgress(engName.name);
            if (progress) {
                const progressDiv = document.createElement('div');
                progressDiv.textContent = `📖 第${progress.chapter}章 (${progress.isRaw ? 'Raw' : '英文'})`;
                progressDiv.style.cssText = `
                    color: #4CAF50;
                    font-size: 9px;
                    margin-top: 2px;
                `;
                engTitleInfo.appendChild(engTitle);
                engTitleInfo.appendChild(progressDiv);
            } else {
                engTitleInfo.appendChild(engTitle);
            }

            // 英文名操作按钮
            const engActions = document.createElement('div');
            engActions.style.cssText = `display: flex; gap: 3px;`;

            // 确保 hiddenSites 存在
            if (!engName.hiddenSites) engName.hiddenSites = [];

            const urls = generateMangaUrls(engName.name);
            const hiddenCount = engName.hiddenSites.length;

            // 已隐藏链接按钮
            const hiddenLinksBtn = document.createElement('button');
            hiddenLinksBtn.textContent = hiddenCount > 0 ? `📦${hiddenCount}` : '📦';
            hiddenLinksBtn.title = '已隐藏的链接';
            hiddenLinksBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 12px;
                display: ${hiddenCount > 0 ? 'inline' : 'none'};
            `;
            hiddenLinksBtn.onclick = (e) => {
                e.stopPropagation();
                showHiddenLinksPopup(engName, urls, () => {
                    saveMangaLibrary();
                    refreshCallback();
                });
            };

            const expandLinksBtn = document.createElement('button');
            expandLinksBtn.textContent = '🔗';
            expandLinksBtn.title = '展开链接';
            expandLinksBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 12px;
            `;

            const deleteEngBtn = document.createElement('button');
            deleteEngBtn.textContent = '✕';
            deleteEngBtn.title = '删除此英文名';
            deleteEngBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 12px;
                color: #999;
            `;
            deleteEngBtn.onclick = () => {
                manga.englishNames = manga.englishNames.filter(e => e.id !== engName.id);
                saveMangaLibrary();
                refreshCallback();
            };

            engActions.appendChild(hiddenLinksBtn);
            engActions.appendChild(expandLinksBtn);
            engActions.appendChild(deleteEngBtn);

            engTitleRow.appendChild(engTitleInfo);
            engTitleRow.appendChild(engActions);

            // 链接区域
            const linksArea = document.createElement('div');
            linksArea.style.cssText = `
                display: none;
                margin-top: 6px;
                padding-top: 6px;
                border-top: 1px dashed #eee;
            `;

            // 渲染链接
            const renderLinks = () => {
                linksArea.innerHTML = '';
                const visibleSites = urls.filter(site => !engName.hiddenSites.includes(site.name));

                visibleSites.forEach(site => {
                    const linkDiv = document.createElement('div');
                    linkDiv.style.cssText = `
                        display: flex;
                        align-items: center;
                        margin: 3px 0;
                    `;

                    const siteName = document.createElement('span');
                    siteName.textContent = site.name;
                    siteName.style.cssText = `width: 75px; font-size: 10px; color: #666;`;

                    const linkBtn = document.createElement('a');
                    linkBtn.textContent = '跳转→';
                    linkBtn.href = site.url;
                    linkBtn.target = '_blank';
                    linkBtn.style.cssText = `
                        font-size: 10px;
                        color: #2196F3;
                        text-decoration: none;
                        padding: 1px 6px;
                        background: #e3f2fd;
                        border-radius: 3px;
                        margin-right: 4px;
                    `;

                    const hideBtn = document.createElement('button');
                    hideBtn.textContent = '✕';
                    hideBtn.style.cssText = `
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 10px;
                        color: #ccc;
                    `;
                    hideBtn.onclick = () => {
                        engName.hiddenSites.push(site.name);
                        saveMangaLibrary();
                        renderLinks();  // 只刷新链接列表，不重新渲染整个元素
                    };

                    linkDiv.appendChild(siteName);
                    linkDiv.appendChild(linkBtn);
                    linkDiv.appendChild(hideBtn);
                    linksArea.appendChild(linkDiv);
                });

                // 更新隐藏按钮
                const newHiddenCount = engName.hiddenSites.length;
                hiddenLinksBtn.textContent = newHiddenCount > 0 ? `📦${newHiddenCount}` : '📦';
                hiddenLinksBtn.style.display = newHiddenCount > 0 ? 'inline' : 'none';
            };

            renderLinks();

            // 展开/收起链接
            expandLinksBtn.onclick = () => {
                const isExpanded = linksArea.style.display !== 'none';
                linksArea.style.display = isExpanded ? 'none' : 'block';
                expandLinksBtn.textContent = isExpanded ? '🔗' : '🔽';
            };

            engDiv.appendChild(engTitleRow);
            engDiv.appendChild(linksArea);
            return engDiv;
        }

        // 显示添加英文名对话框
        function showAddEnglishNameDialog(manga, contentArea) {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000000;
                width: 280px;
            `;

            dialog.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 16px;">➕ 添加英文名</h3>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">为「${manga.chineseName}」添加英文名</p>
                <input type="text" id="new-english-name" placeholder="英文漫画名" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                ">
                <div style="display: flex; gap: 10px;">
                    <button id="cancel-eng-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #9e9e9e;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">取消</button>
                    <button id="save-eng-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">保存</button>
                </div>
            `;

            document.body.appendChild(dialog);

            dialog.querySelector('#cancel-eng-btn').onclick = () => document.body.removeChild(dialog);
            dialog.querySelector('#save-eng-btn').onclick = () => {
                const name = dialog.querySelector('#new-english-name').value.trim();
                if (!name) {
                    alert('请输入英文漫画名');
                    return;
                }
                manga.englishNames.push({
                    id: Date.now().toString(),
                    name: name,
                    hiddenSites: []
                });
                // 标记该漫画需要展开英文名列表
                manga._shouldExpand = true;
                // 标记该漫画所属的分组也需要展开
                if (manga.groupId) {
                    const group = mangaLibrary.groups.find(g => g.id === manga.groupId);
                    if (group) group._shouldExpand = true;
                }
                saveMangaLibrary();
                renderLibraryContent(contentArea);
                document.body.removeChild(dialog);
            };
        }

        // 显示已隐藏链接的弹窗
        function showHiddenLinksPopup(manga, urls, renderLinksCallback) {
            const hiddenSites = urls.filter(site => manga.hiddenSites.includes(site.name));
            if (hiddenSites.length === 0) return;

            const popup = document.createElement('div');
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000000;
                min-width: 200px;
                max-width: 300px;
            `;

            const title = document.createElement('div');
            title.textContent = '📦 已隐藏的链接';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 10px;
                padding-bottom: 8px;
                border-bottom: 1px solid #eee;
            `;
            popup.appendChild(title);

            const list = document.createElement('div');
            hiddenSites.forEach(site => {
                const item = document.createElement('div');
                item.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                    border-bottom: 1px dashed #eee;
                `;

                const siteName = document.createElement('span');
                siteName.textContent = site.name;
                siteName.style.cssText = `font-size: 12px; color: #666;`;

                const restoreBtn = document.createElement('button');
                restoreBtn.textContent = '➕ 恢复';
                restoreBtn.style.cssText = `
                    font-size: 11px;
                    color: #4CAF50;
                    background: #e8f5e9;
                    border: none;
                    border-radius: 3px;
                    padding: 4px 10px;
                    cursor: pointer;
                `;
                restoreBtn.onclick = () => {
                    manga.hiddenSites = manga.hiddenSites.filter(s => s !== site.name);
                    saveMangaLibrary();
                    renderLinksCallback();
                    // 如果没有隐藏链接了，关闭弹窗
                    if (manga.hiddenSites.length === 0) {
                        document.body.removeChild(popup);
                    } else {
                        // 刷新弹窗内容
                        document.body.removeChild(popup);
                        showHiddenLinksPopup(manga, urls, renderLinksCallback);
                    }
                };

                item.appendChild(siteName);
                item.appendChild(restoreBtn);
                list.appendChild(item);
            });
            popup.appendChild(list);

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            closeBtn.style.cssText = `
                width: 100%;
                margin-top: 10px;
                padding: 8px;
                background: #9e9e9e;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            closeBtn.onclick = () => document.body.removeChild(popup);
            popup.appendChild(closeBtn);

            document.body.appendChild(popup);
        }

        // 显示添加分组对话框
        function showAddGroupDialog(overlay, parentDialog, contentArea) {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000000;
                width: 280px;
            `;

            dialog.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 16px;">➕ 新建分组</h3>
                <input type="text" id="new-group-name" placeholder="分组名称" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                ">
                <div style="display: flex; gap: 10px;">
                    <button id="cancel-group-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #9e9e9e;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">取消</button>
                    <button id="save-group-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">保存</button>
                </div>
            `;

            document.body.appendChild(dialog);

            dialog.querySelector('#cancel-group-btn').onclick = () => document.body.removeChild(dialog);
            dialog.querySelector('#save-group-btn').onclick = () => {
                const name = dialog.querySelector('#new-group-name').value.trim();
                if (!name) {
                    alert('请输入分组名称');
                    return;
                }
                mangaLibrary.groups.push({
                    id: Date.now().toString(),
                    name: name
                });
                saveMangaLibrary();
                renderLibraryContent(contentArea);
                document.body.removeChild(dialog);
            };
        }

        // 显示添加漫画对话框（新版：只输入中文名）
        function showAddMangaDialog(overlay, parentDialog, contentArea) {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000000;
                width: 300px;
            `;

            // 构建分组选项
            let groupOptions = '<option value="">未分组</option>';
            mangaLibrary.groups.forEach(g => {
                groupOptions += `<option value="${g.id}">${g.name}</option>`;
            });

            dialog.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 16px;">➕ 添加漫画</h3>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">输入中文漫画名，之后可添加多个英文名</p>
                <input type="text" id="manga-chinese-name" placeholder="中文漫画名 (必填)" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                ">
                <select id="manga-group" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                ">${groupOptions}</select>
                <div style="display: flex; gap: 10px;">
                    <button id="cancel-manga-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #9e9e9e;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">取消</button>
                    <button id="save-manga-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">保存</button>
                </div>
            `;

            document.body.appendChild(dialog);

            dialog.querySelector('#cancel-manga-btn').onclick = () => document.body.removeChild(dialog);
            dialog.querySelector('#save-manga-btn').onclick = () => {
                const chineseName = dialog.querySelector('#manga-chinese-name').value.trim();
                const groupId = dialog.querySelector('#manga-group').value || null;

                if (!chineseName) {
                    alert('请输入中文漫画名');
                    return;
                }

                mangaLibrary.mangas.push({
                    id: Date.now().toString(),
                    chineseName: chineseName,
                    groupId: groupId,
                    englishNames: []  // 新结构：英文名数组
                });
                saveMangaLibrary();
                renderLibraryContent(contentArea);
                document.body.removeChild(dialog);
            };
        }

        // ==================== 漫画库功能结束 ====================

        // ==================== 收藏功能 ====================

        // 显示收藏对话框
        function showFavoriteDialog() {
            initMangaLibrary();

            // 获取当前漫画名并格式化
            const rawMangaName = extractMangaName();
            if (!rawMangaName) {
                alert('❌ 无法从当前页面获取漫画名\n\n请确保你在漫画阅读页面');
                return;
            }
            const formattedName = formatMangaTitle(rawMangaName) || rawMangaName;

            // 创建对话框背景
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            overlay.onclick = (e) => {
                if (e.target === overlay) document.body.removeChild(overlay);
            };

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                width: 400px;
                max-height: 80vh;
                overflow-y: auto;
            `;

            // 构建分组选项
            let groupOptions = '<option value="">未分组</option>';
            mangaLibrary.groups.forEach(g => {
                groupOptions += `<option value="${g.id}">${g.name}</option>`;
            });

            // 构建已有漫画列表
            let existingMangaOptions = '';
            mangaLibrary.mangas.forEach(m => {
                const groupName = mangaLibrary.groups.find(g => g.id === m.groupId)?.name || '未分组';
                existingMangaOptions += `<option value="${m.id}">[${groupName}] ${m.chineseName}</option>`;
            });

            dialog.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">⭐ 收藏漫画</h3>

                <div style="background: #f5f5f5; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">当前漫画（英文名）：</p>
                    <p style="margin: 0; font-size: 14px; color: #333; font-weight: bold;">${formattedName}</p>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="fav-new-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🆕 新建中文漫画</button>
                    <button id="fav-new-group-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #9C27B0;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">� 添新建分组</button>
                    <button id="fav-existing-btn" style="
                        flex: 1;
                        padding: 10px;
                        background: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">📎 添加到已有中文漫画</button>
                </div>

                <!-- 新建漫画区域 -->
                <div id="fav-new-area" style="display: none; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">新建漫画</h4>
                    <input type="text" id="fav-chinese-name" placeholder="中文漫画名 (必填)" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        box-sizing: border-box;
                        margin-bottom: 10px;
                    ">
                    <select id="fav-group" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        box-sizing: border-box;
                        margin-bottom: 10px;
                    ">${groupOptions}</select>
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">英文漫画名（自动填入）：</p>
                    <input type="text" id="fav-english-name" value="${formattedName}" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        box-sizing: border-box;
                        margin-bottom: 10px;
                        background: #f9f9f9;
                    ">
                    <button id="fav-save-new-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">✅ 保存</button>
                </div>

                <!-- 新建分组区域 -->
                <div id="fav-new-group-area" style="display: none; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">📁 新建分组并添加漫画</h4>
                    <input type="text" id="fav-new-group-name" placeholder="分组名称 (必填)" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        box-sizing: border-box;
                        margin-bottom: 10px;
                    ">
                    <input type="text" id="fav-group-chinese-name" placeholder="中文漫画名 (必填)" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        box-sizing: border-box;
                        margin-bottom: 10px;
                    ">
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">英文漫画名（自动填入）：</p>
                    <input type="text" id="fav-group-english-name" value="${formattedName}" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        box-sizing: border-box;
                        margin-bottom: 10px;
                        background: #f9f9f9;
                    ">
                    <button id="fav-save-group-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: #9C27B0;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">✅ 创建分组并保存</button>
                </div>

                <!-- 添加到已有区域 -->
                <div id="fav-existing-area" style="display: none; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">添加到已有漫画</h4>
                    ${mangaLibrary.mangas.length > 0 ? `
                        <select id="fav-existing-manga" style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            font-size: 14px;
                            box-sizing: border-box;
                            margin-bottom: 10px;
                        ">${existingMangaOptions}</select>
                        <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">将添加的英文名：</p>
                        <input type="text" id="fav-add-english-name" value="${formattedName}" style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            font-size: 14px;
                            box-sizing: border-box;
                            margin-bottom: 10px;
                            background: #f9f9f9;
                        ">
                        <button id="fav-save-existing-btn" style="
                            width: 100%;
                            padding: 10px;
                            background: #2196F3;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">✅ 添加英文名</button>
                    ` : `
                        <p style="text-align: center; color: #999;">暂无已有漫画，请先新建</p>
                    `}
                </div>

                <button id="fav-close-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #9e9e9e;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">关闭</button>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 绑定事件
            const newArea = dialog.querySelector('#fav-new-area');
            const existingArea = dialog.querySelector('#fav-existing-area');
            const newGroupArea = dialog.querySelector('#fav-new-group-area');
            const newBtn = dialog.querySelector('#fav-new-btn');
            const existingBtn = dialog.querySelector('#fav-existing-btn');
            const newGroupBtn = dialog.querySelector('#fav-new-group-btn');

            const resetBtnStyles = () => {
                newBtn.style.background = '#4CAF50';
                existingBtn.style.background = '#2196F3';
                newGroupBtn.style.background = '#9C27B0';
                newArea.style.display = 'none';
                existingArea.style.display = 'none';
                newGroupArea.style.display = 'none';
            };

            newBtn.onclick = () => {
                resetBtnStyles();
                newArea.style.display = 'block';
                newBtn.style.background = '#388E3C';
            };

            newGroupBtn.onclick = () => {
                resetBtnStyles();
                newGroupArea.style.display = 'block';
                newGroupBtn.style.background = '#7B1FA2';
            };

            existingBtn.onclick = () => {
                resetBtnStyles();
                existingArea.style.display = 'block';
                existingBtn.style.background = '#1976D2';
            };

            // 保存新建漫画
            dialog.querySelector('#fav-save-new-btn').onclick = () => {
                const chineseName = dialog.querySelector('#fav-chinese-name').value.trim();
                const groupId = dialog.querySelector('#fav-group').value || null;
                const englishName = dialog.querySelector('#fav-english-name').value.trim();

                if (!chineseName) {
                    alert('请输入中文漫画名');
                    return;
                }

                mangaLibrary.mangas.push({
                    id: Date.now().toString(),
                    chineseName: chineseName,
                    groupId: groupId,
                    englishNames: englishName ? [{
                        id: Date.now().toString(),
                        name: englishName,
                        hiddenSites: []
                    }] : []
                });
                saveMangaLibrary();

                alert(`✅ 收藏成功！\n\n中文名：${chineseName}\n英文名：${englishName}`);
                document.body.removeChild(overlay);
            };

            // 保存新建分组
            dialog.querySelector('#fav-save-group-btn').onclick = () => {
                const groupName = dialog.querySelector('#fav-new-group-name').value.trim();
                const chineseName = dialog.querySelector('#fav-group-chinese-name').value.trim();
                const englishName = dialog.querySelector('#fav-group-english-name').value.trim();

                if (!groupName) {
                    alert('请输入分组名称');
                    return;
                }
                if (!chineseName) {
                    alert('请输入中文漫画名');
                    return;
                }

                // 检查分组名是否已存在
                if (mangaLibrary.groups.some(g => g.name === groupName)) {
                    alert('⚠️ 该分组名已存在');
                    return;
                }

                // 创建新分组
                const newGroupId = Date.now().toString();
                mangaLibrary.groups.push({
                    id: newGroupId,
                    name: groupName
                });

                // 创建新漫画并关联到新分组
                mangaLibrary.mangas.push({
                    id: (Date.now() + 1).toString(),
                    chineseName: chineseName,
                    groupId: newGroupId,
                    englishNames: englishName ? [{
                        id: (Date.now() + 2).toString(),
                        name: englishName,
                        hiddenSites: []
                    }] : []
                });
                saveMangaLibrary();

                alert(`✅ 创建成功！\n\n分组：${groupName}\n中文名：${chineseName}\n英文名：${englishName}`);
                document.body.removeChild(overlay);
            };

            // 添加到已有漫画
            const saveExistingBtn = dialog.querySelector('#fav-save-existing-btn');
            if (saveExistingBtn) {
                saveExistingBtn.onclick = () => {
                    const mangaId = dialog.querySelector('#fav-existing-manga').value;
                    const englishName = dialog.querySelector('#fav-add-english-name').value.trim();

                    if (!englishName) {
                        alert('英文名不能为空');
                        return;
                    }

                    const manga = mangaLibrary.mangas.find(m => m.id === mangaId);
                    if (manga) {
                        if (!manga.englishNames) manga.englishNames = [];
                        // 检查是否已存在（兼容字符串和对象格式）
                        const exists = manga.englishNames.some(e =>
                            (typeof e === 'string' ? e : e.name) === englishName
                        );
                        if (exists) {
                            alert('⚠️ 该英文名已存在');
                            return;
                        }
                        manga.englishNames.push({
                            id: Date.now().toString(),
                            name: englishName,
                            hiddenSites: []
                        });
                        saveMangaLibrary();

                        alert(`✅ 添加成功！\n\n已将「${englishName}」添加到「${manga.chineseName}」`);
                        document.body.removeChild(overlay);
                    }
                };
            }

            // 关闭按钮
            dialog.querySelector('#fav-close-btn').onclick = () => {
                document.body.removeChild(overlay);
            };
        }

        // ==================== 收藏功能结束 ====================

        // 显示搜索对话框
        function showSearchDialog() {
            // 创建对话框背景
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
            `;

            // 标题
            const title = document.createElement('h2');
            title.textContent = '🔎 多站点搜索';
            title.style.cssText = `
                margin: 0 0 15px 0;
                color: #333;
                font-size: 20px;
                text-align: center;
            `;

            // 漫画名输入
            const mangaLabel = document.createElement('label');
            mangaLabel.textContent = '漫画名：';
            mangaLabel.style.cssText = `
                display: block;
                margin-bottom: 5px;
                color: #666;
                font-size: 14px;
            `;

            const mangaInput = document.createElement('input');
            mangaInput.type = 'text';
            mangaInput.placeholder = '例如：Glorious Homecoming 或 glorious-homecoming';
            mangaInput.style.cssText = `
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                color: #333;
                background: #fff;
            `;

            // 章节号输入
            const chapterLabel = document.createElement('label');
            chapterLabel.textContent = '章节号：';
            chapterLabel.style.cssText = `
                display: block;
                margin-bottom: 5px;
                color: #666;
                font-size: 14px;
            `;

            const chapterInput = document.createElement('input');
            chapterInput.type = 'number';
            chapterInput.placeholder = '例如：282';
            chapterInput.style.cssText = `
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                color: #333;
                background: #fff;
            `;

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                margin-top: 20px;
            `;

            // 搜索按钮
            const searchBtn = document.createElement('button');
            searchBtn.textContent = '🔍 搜索';
            searchBtn.style.cssText = `
                flex: 1;
                padding: 12px;
                background: #00BCD4;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            searchBtn.onclick = () => {
                let mangaName = mangaInput.value.trim();
                const chapter = parseInt(chapterInput.value);

                if (!mangaName) {
                    alert('请输入漫画名');
                    return;
                }
                if (!chapter || chapter < 1) {
                    alert('请输入有效的章节号');
                    return;
                }

                // 将漫画名转换为 URL 格式
                // 例如："Glorious Homecoming" -> "glorious-homecoming"
                mangaName = mangaName
                    .toLowerCase()                    // 转小写
                    .replace(/[^\w\s-]/g, '')        // 移除特殊字符（保留字母、数字、空格、连字符）
                    .replace(/\s+/g, '-')            // 空格替换为连字符
                    .replace(/-+/g, '-')             // 多个连字符合并为一个
                    .replace(/^-+|-+$/g, '');        // 移除首尾的连字符

                console.log('原始输入:', mangaInput.value);
                console.log('转换后的漫画名:', mangaName);

                if (!mangaName) {
                    alert('漫画名格式不正确');
                    return;
                }

                // 执行搜索
                performMultiSiteSearch(mangaName, chapter);
                document.body.removeChild(overlay);
            };

            // 取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';
            cancelBtn.style.cssText = `
                flex: 1;
                padding: 12px;
                background: #999;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            `;
            cancelBtn.onclick = () => {
                document.body.removeChild(overlay);
            };

            // 组装对话框
            buttonContainer.appendChild(searchBtn);
            buttonContainer.appendChild(cancelBtn);

            dialog.appendChild(title);
            dialog.appendChild(mangaLabel);
            dialog.appendChild(mangaInput);
            dialog.appendChild(chapterLabel);
            dialog.appendChild(chapterInput);
            dialog.appendChild(buttonContainer);

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 点击背景关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });

            // 自动聚焦
            mangaInput.focus();
        }

        // 执行多站点搜索
        function performMultiSiteSearch(mangaName, chapter) {
            // 支持的网站配置
            const sites = [
                {
                    name: 'manhwaclub.net',
                    baseUrl: 'https://manhwaclub.net',
                    pathTemplate: '/manga/{manga}/chapter-{chapter}'
                },
                {
                    name: 'manga18.club',
                    baseUrl: 'https://manga18.club',
                    pathTemplate: '/manhwa/{manga}/chapter-{chapter}'
                },
                {
                    name: 'mangadna.com',
                    baseUrl: 'https://mangadna.com',
                    pathTemplate: '/manga/{manga}/chapter-{chapter}'
                },
                {
                    name: 'mangaforfree.net',
                    baseUrl: 'https://mangaforfree.net',
                    pathTemplate: '/manga/{manga}/chapter-{chapter}/'
                },
                {
                    name: 'mangaforfree.com',
                    baseUrl: 'https://mangaforfree.com',
                    pathTemplate: '/manga/{manga}/chapter-{chapter}/'
                },
                {
                    name: 'manhwabuddy.com',
                    baseUrl: 'https://manhwabuddy.com',
                    pathTemplate: '/manhwa/{manga}/chapter-{chapter}/'
                }
            ];

            console.log(`========================================`);
            console.log(`🔍 开始多站点搜索`);
            console.log(`漫画名: ${mangaName}`);
            console.log(`章节: ${chapter}`);
            console.log(`========================================`);

            // 生成所有 URL
            const urls = sites.map(site => {
                const url = site.baseUrl + site.pathTemplate
                    .replace('{manga}', mangaName)
                    .replace('{chapter}', chapter);
                console.log(`${site.name}: ${url}`);
                return { name: site.name, url: url };
            });

            // 显示 URL 列表对话框
            showUrlListDialog(urls);
        }

        // 显示 URL 列表对话框
        function showUrlListDialog(urls) {
            // 创建对话框背景
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            `;

            // 标题
            const title = document.createElement('h2');
            title.textContent = '🔗 搜索结果 - 点击打开即可跳转';
            title.style.cssText = `
                margin: 0 0 10px 0;
                color: #333;
                font-size: 18px;
                text-align: center;
            `;

            // 提示文字
            const hint = document.createElement('p');
            hint.innerHTML = '<small style="color: #999;">提示：不同网站同一漫画的名称可能不同，404很正常。<br>如果显示"链接错误"，说明该网站暂时无法访问。</small>';
            hint.style.cssText = `
                margin: 0 0 15px 0;
                text-align: center;
                font-size: 12px;
                line-height: 1.5;
            `;

            // URL 列表
            const urlList = document.createElement('div');
            urlList.style.cssText = `
                margin-bottom: 15px;
            `;

            urls.forEach((item, index) => {
                const urlItem = document.createElement('a');
                urlItem.href = item.url;
                urlItem.target = '_blank';
                urlItem.style.cssText = `
                    display: block;
                    margin-bottom: 10px;
                    padding: 12px;
                    background: #f5f5f5;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    text-decoration: none;
                    color: #333;
                    transition: background 0.2s;
                `;
                urlItem.onmouseover = function() {
                    this.style.background = '#e0e0e0';
                };
                urlItem.onmouseout = function() {
                    this.style.background = '#f5f5f5';
                };

                const siteName = document.createElement('div');
                siteName.textContent = `${index + 1}. ${item.name}`;
                siteName.style.cssText = `
                    font-weight: bold;
                    color: #00BCD4;
                    margin-bottom: 5px;
                    font-size: 14px;
                `;

                const urlText = document.createElement('div');
                urlText.textContent = item.url;
                urlText.style.cssText = `
                    font-size: 11px;
                    color: #999;
                    font-family: monospace;
                    word-break: break-all;
                `;

                urlItem.appendChild(siteName);
                urlItem.appendChild(urlText);
                urlList.appendChild(urlItem);
            });

            // 说明文字
            const notice = document.createElement('div');
            notice.innerHTML = `
                <small style="color: #999; font-size: 12px; line-height: 1.5;">
                    💡 提示：<br>
                    • 不同网站的同一漫画，漫画名可能不同，所以 404 很正常<br>
                    • 如果显示"链接错误"，可能是该网站暂时无法访问<br>
                    • 建议多尝试几个网站
                </small>
            `;
            notice.style.cssText = `
                margin-bottom: 15px;
                padding: 10px;
                background: #fff3cd;
                border-radius: 6px;
                border: 1px solid #ffc107;
            `;

            // 关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            closeBtn.style.cssText = `
                width: 100%;
                padding: 12px;
                background: #999;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            `;
            closeBtn.onclick = () => {
                document.body.removeChild(overlay);
            };

            // 组装对话框
            dialog.appendChild(title);
            dialog.appendChild(hint);
            dialog.appendChild(urlList);
            dialog.appendChild(closeBtn);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 点击背景关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        }

        // 显示多本同下对话框
        function showMultiDownloadDialog() {
            // 创建对话框背景
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow-y: auto;
            `;

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            `;

            // 标题
            const title = document.createElement('h2');
            title.textContent = '📚 多本漫画同时下载';
            title.style.cssText = `
                margin: 0 0 15px 0;
                color: #333;
                font-size: 20px;
                text-align: center;
            `;

            // 说明文字
            const description = document.createElement('p');
            description.innerHTML = '为每部漫画填写信息，系统将自动创建多个标签页并行下载：<br><small style="color: #999;">提示：漫画名可输入任意格式，会自动转换为URL格式</small>';
            description.style.cssText = `
                margin: 0 0 15px 0;
                color: #666;
                font-size: 13px;
                line-height: 1.5;
            `;

            // 任务列表容器
            const taskListContainer = document.createElement('div');
            taskListContainer.id = 'multi-task-list';
            taskListContainer.style.cssText = `
                margin-bottom: 15px;
            `;

            // 添加第一个任务表单
            const firstTask = createTaskForm(1);
            taskListContainer.appendChild(firstTask);

            // 添加任务按钮
            const addTaskButton = document.createElement('button');
            addTaskButton.textContent = '➕ 添加漫画';
            addTaskButton.style.cssText = `
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;

            let taskCount = 1;
            addTaskButton.onclick = function() {
                taskCount++;
                const newTask = createTaskForm(taskCount);
                taskListContainer.appendChild(newTask);
            };

            // 按钮容器
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = `
                display: flex;
                gap: 10px;
            `;

            // 开始下载按钮
            const startButton = document.createElement('button');
            startButton.textContent = '🚀 开始下载';
            startButton.style.cssText = `
                flex: 1;
                padding: 12px;
                background: #FF5722;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 15px;
                font-weight: bold;
            `;
            startButton.onclick = function() {
                const tasks = collectTasks();
                if (tasks.length === 0) {
                    alert('请至少添加一个有效的下载任务！');
                    return;
                }

                document.body.removeChild(overlay);
                startMultiDownload(tasks);
            };

            // 取消按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                flex: 1;
                padding: 12px;
                background: #9E9E9E;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 15px;
            `;
            cancelButton.onclick = function() {
                document.body.removeChild(overlay);
            };

            buttonGroup.appendChild(startButton);
            buttonGroup.appendChild(cancelButton);

            // 组装对话框
            dialog.appendChild(title);
            dialog.appendChild(description);
            dialog.appendChild(taskListContainer);
            dialog.appendChild(addTaskButton);
            dialog.appendChild(buttonGroup);

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 点击背景关闭
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        }

        // 创建单个任务表单
        function createTaskForm(index) {
            const taskForm = document.createElement('div');
            taskForm.className = 'task-form';
            taskForm.style.cssText = `
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                position: relative;
            `;

            // 任务标题
            const taskTitle = document.createElement('div');
            taskTitle.textContent = `漫画 ${index}`;
            taskTitle.style.cssText = `
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                font-size: 14px;
            `;

            // 漫画名输入
            const mangaNameLabel = document.createElement('label');
            mangaNameLabel.textContent = '漫画名：';
            mangaNameLabel.style.cssText = `
                display: block;
                margin-bottom: 5px;
                font-size: 13px;
                color: #666;
            `;

            const mangaNameInput = document.createElement('input');
            mangaNameInput.type = 'text';
            mangaNameInput.placeholder = '例如: Solo Leveling 或 solo-leveling';
            mangaNameInput.className = 'manga-name-input';
            mangaNameInput.style.cssText = `
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                margin-bottom: 10px;
                box-sizing: border-box;
            `;

            // 起始章节标签
            const startChapterLabel = document.createElement('label');
            startChapterLabel.textContent = '起始章节：';
            startChapterLabel.style.cssText = `
                display: block;
                margin-bottom: 5px;
                font-size: 13px;
                color: #666;
            `;

            // 起始章节输入框
            const startChapterInput = document.createElement('input');
            startChapterInput.type = 'number';
            startChapterInput.placeholder = '例如: 44';
            startChapterInput.className = 'start-chapter-input';
            startChapterInput.min = '1';
            startChapterInput.style.cssText = `
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                margin-bottom: 10px;
                box-sizing: border-box;
            `;

            // 说明文字
            const hintText = document.createElement('div');
            hintText.textContent = '将自动从该章节开始下载到最后';
            hintText.style.cssText = `
                font-size: 11px;
                color: #999;
                margin-bottom: 10px;
            `;

            // 删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                cursor: pointer;
                font-size: 14px;
            `;
            deleteButton.onclick = function() {
                taskForm.remove();
            };

            // 组装表单
            taskForm.appendChild(taskTitle);
            taskForm.appendChild(deleteButton);
            taskForm.appendChild(mangaNameLabel);
            taskForm.appendChild(mangaNameInput);
            taskForm.appendChild(startChapterLabel);
            taskForm.appendChild(startChapterInput);
            taskForm.appendChild(hintText);

            return taskForm;
        }

        // 收集所有任务数据
        function collectTasks() {
            const tasks = [];
            const taskForms = document.querySelectorAll('.task-form');

            taskForms.forEach((form, index) => {
                const mangaName = form.querySelector('.manga-name-input').value.trim();
                const startChapter = parseInt(form.querySelector('.start-chapter-input').value);

                // 验证数据
                if (!mangaName) {
                    return; // 跳过空任务
                }

                if (!startChapter || startChapter < 1) {
                    alert(`漫画 ${index + 1}: 请输入有效的起始章节号`);
                    return;
                }

                tasks.push({
                    mangaName: mangaName,
                    startChapter: startChapter
                });
            });

            return tasks;
        }

        // 标准化漫画名为URL格式
        function normalizeMangaName(name) {
            // 去除首尾空格
            let normalized = name.trim();

            // 转换为小写
            normalized = normalized.toLowerCase();

            // 移除撇号、引号等需要直接删除的特殊字符（不转为横杠）
            normalized = normalized.replace(/['''"""]/g, '');

            // 将多个空格替换为单个空格
            normalized = normalized.replace(/\s+/g, ' ');

            // 将空格替换为横杠
            normalized = normalized.replace(/\s/g, '-');

            // 移除其他特殊字符，只保留字母、数字、横杠
            normalized = normalized.replace(/[^a-z0-9-]/g, '');

            // 将多个连续横杠替换为单个横杠
            normalized = normalized.replace(/-+/g, '-');

            // 去除首尾横杠
            normalized = normalized.replace(/^-+|-+$/g, '');

            console.log(`漫画名标准化: "${name}" -> "${normalized}"`);
            return normalized;
        }

        // 获取漫画的真实URL（带数字后缀）
        async function getRealMangaUrl(mangaName) {
            return new Promise((resolve) => {
                const detailPageUrl = `${window.location.origin}/manga/${mangaName}/`;
                console.log(`获取真实URL - 访问详情页: ${detailPageUrl}`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: detailPageUrl,
                    timeout: 10000,
                    onload: function(response) {
                        // 从响应的最终URL获取真实的漫画名（包含数字后缀）
                        const finalUrl = response.finalUrl || detailPageUrl;
                        console.log(`获取真实URL - 最终URL: ${finalUrl}`);

                        // 提取真实的漫画名（包含-数字后缀）
                        const match = finalUrl.match(/\/manga\/([^\/]+)\/?$/);
                        if (match && match[1]) {
                            const realMangaName = match[1];
                            console.log(`获取真实URL - 真实漫画名: ${realMangaName}`);
                            resolve(realMangaName);
                        } else {
                            console.log(`获取真实URL - 未能提取，使用原名称`);
                            resolve(mangaName);
                        }
                    },
                    onerror: function(error) {
                        console.error(`获取真实URL失败: ${detailPageUrl}`, error);
                        resolve(mangaName); // 失败时使用原名称
                    },
                    ontimeout: function() {
                        console.error(`获取真实URL超时: ${detailPageUrl}`);
                        resolve(mangaName); // 超时时使用原名称
                    }
                });
            });
        }

        // 开始多本漫画同时下载
        async function startMultiDownload(tasks) {
            console.log('========================================');
            console.log(`开始多本同时下载，共 ${tasks.length} 个任务`);
            console.log('========================================');

            const baseUrl = window.location.origin;

            // 先获取所有漫画的真实URL并立即打开标签页
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];

                // 标准化漫画名
                const normalizedMangaName = normalizeMangaName(task.mangaName);
                console.log(`\n[${i + 1}/${tasks.length}] 处理: ${normalizedMangaName}`);

                // 获取真实的漫画名（带数字后缀）
                const realMangaName = await getRealMangaUrl(normalizedMangaName);
                console.log(`[${i + 1}/${tasks.length}] 真实漫画名: ${realMangaName}`);

                // 检查起始章节是否存在（先尝试英文版，再尝试raw版）
                let finalUrl = `${baseUrl}/manga/${realMangaName}/chapter-${task.startChapter}`;
                let chapterExists = await checkChapterExists(finalUrl);

                if (!chapterExists) {
                    console.log(`[${i + 1}/${tasks.length}] 英文版第${task.startChapter}章不存在，尝试raw版...`);
                    finalUrl = `${baseUrl}/manga/${realMangaName}/chapter-${task.startChapter}-raw`;
                    chapterExists = await checkChapterExists(finalUrl);

                    if (!chapterExists) {
                        console.error(`[${i + 1}/${tasks.length}] ❌ 第${task.startChapter}章不存在（英文版和raw版都没有），跳过此任务`);
                        alert(`漫画《${task.mangaName}》的第${task.startChapter}章不存在，已跳过。`);
                        continue; // 跳过此任务
                    }

                    console.log(`[${i + 1}/${tasks.length}] ✓ 找到raw版第${task.startChapter}章`);
                } else {
                    console.log(`[${i + 1}/${tasks.length}] ✓ 找到英文版第${task.startChapter}章`);
                }

                // 保存任务信息到GM存储（使用漫画名+章节号作为key，不使用hash）
                const taskKey = `autoDownload_${realMangaName}_${task.startChapter}`;
                const taskData = {
                    autoDownload: true,
                    mangaName: realMangaName,
                    startChapter: task.startChapter,
                    taskId: taskKey,
                    url: finalUrl  // 保存URL以便验证
                };

                // 保存到GM存储（使用漫画名+章节号作为key）
                GM_setValue(taskKey, taskData);
                console.log(`[${i + 1}/${tasks.length}] 保存任务数据:`, taskData);
                console.log(`[${i + 1}/${tasks.length}] 任务Key: ${taskKey}`);
                console.log(`[${i + 1}/${tasks.length}] 目标URL: ${finalUrl}`);

                // 同时保存一个全局标记，用于快速识别
                GM_setValue('pendingAutoDownload', {
                    mangaName: realMangaName,
                    chapter: task.startChapter,
                    taskKey: taskKey,
                    timestamp: Date.now()
                });

                // 构建干净的URL（不添加任何hash或参数）
                console.log(`[${i + 1}/${tasks.length}] 打开标签页: ${finalUrl}`);

                // 立即打开新标签页（使用干净的URL）
                window.open(finalUrl, '_blank');

                // 等待一下再处理下一个，避免请求过快和浏览器阻止
                if (i < tasks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            console.log('========================================');
            console.log(`✅ 已完成任务创建`);
            console.log('提示：请勿关闭标签页直到下载完成');
            console.log('========================================');
        }

        // 页面加载完成后初始化
        function init() {
            console.log('========================================');
            console.log('脚本初始化开始');
            console.log('当前URL:', window.location.href);
            console.log('========================================');

            // 检查跳转标记（带时间戳）
            // 如果是正常跳转（5秒内），保留自动下载状态
            // 如果不是正常跳转（超过5秒或没有标记），清除自动下载状态
            const navigationTimestamp = GM_getValue('navigationTimestamp', 0);
            const now = Date.now();
            const isRecentNavigation = navigationTimestamp > 0 && (now - navigationTimestamp) < 5000; // 5秒内

            // 清除跳转时间戳
            GM_setValue('navigationTimestamp', 0);

            if (isRecentNavigation) {
                // 是正常跳转，恢复自动下载状态
                isAutoDownloading = GM_getValue('isAutoDownloading', false);
                console.log('✓ 检测到正常跳转（' + (now - navigationTimestamp) + 'ms前），保留自动下载状态');
            } else {
                // 不是正常跳转（用户手动打开页面或关闭后重新打开）
                // 清除所有自动下载相关状态
                const wasAutoDownloading = GM_getValue('isAutoDownloading', false);
                if (wasAutoDownloading) {
                    console.log('⚠️ 非正常跳转，清除自动下载状态');
                    GM_setValue('isAutoDownloading', false);
                    // 清除任务数据
                    const currentTask = GM_getValue('currentAutoDownloadTask', null);
                    if (currentTask && currentTask.taskId) {
                        GM_setValue(currentTask.taskId, null);
                    }
                    GM_setValue('currentAutoDownloadTask', null);
                }
                isAutoDownloading = false;
            }

            // 恢复用户的版本偏好设置
            preferRawVersion = GM_getValue('preferRawVersion', false);
            console.log(`📌 版本偏好: ${preferRawVersion ? '优先 Raw 版' : '优先英文版'}`);

            // 恢复用户的下载模式偏好设置
            useZipDownload = GM_getValue('useZipDownload', false);
            console.log(`📌 下载模式: ${useZipDownload ? '打包下载' : '不打包下载'}`);

            // 检查是否有单章节下载标记
            const singleChapterDownload = GM_getValue('singleChapterDownload', false);
            if (singleChapterDownload) {
                GM_setValue('singleChapterDownload', false); // 清除标记
                console.log('✓ 检测到单章节下载标记，将自动开始下载');
            }

            // 定义初始化函数
            const initUI = async () => {
                createFloatBall(); // 先创建悬浮球
                createDownloadUI(); // 然后创建面板（但默认隐藏）

                // 等待一段时间确保页面完全加载（减少等待时间）
                await new Promise(resolve => setTimeout(resolve, 500));

                // 如果是单章节下载模式，自动执行扫描和下载
                if (singleChapterDownload) {
                    console.log('🚀 开始单章节自动下载...');
                    // 显示面板
                    if (buttonContainer) {
                        buttonContainer.style.display = 'block';
                        isPanelVisible = true;
                    }
                    // 等待页面稳定
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // 自动扫描图片
                    console.log('开始扫描图片...');
                    await scanImagesAsync();
                    // 等待扫描完成
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // 开始下载
                    if (imageUrls.length > 0) {
                        console.log(`✓ 扫描到 ${imageUrls.length} 张图片，开始下载`);
                        downloadButton.click();
                    } else {
                        console.log('⚠️ 未扫描到图片');
                        alert('未扫描到图片，请手动滚动页面加载图片后再试');
                    }
                    return; // 单章节下载完成后不继续执行后续逻辑
                }

                // 智能查找任务：多次尝试，因为页面可能还没完全加载
                const findTask = () => {
                    // 通过当前页面的漫画名和章节号来查找任务（不使用URL hash）
                    const currentMangaName = extractMangaName();
                    const currentChapter = extractChapterNumber();
                    console.log('当前漫画名:', currentMangaName);
                    console.log('当前章节号:', currentChapter);

                    let taskData = null;
                let taskId = null;

                    // 方法1：检查是否有待处理的任务标记
                    const pendingTask = GM_getValue('pendingAutoDownload', null);
                    if (pendingTask) {
                        console.log('检测到待处理任务标记:', pendingTask);
                        // 如果URL匹配或者是同一部漫画的指定章节
                        if (currentMangaName && currentChapter) {
                            if (pendingTask.mangaName === currentMangaName && pendingTask.chapter === parseInt(currentChapter)) {
                                taskId = pendingTask.taskKey;
                                taskData = GM_getValue(taskId, null);
                                if (taskData) {
                                    console.log('✓ 通过待处理任务标记找到任务:', taskId);
                                    // 清除待处理标记
                                    GM_setValue('pendingAutoDownload', null);
                                    return { taskData, taskId };
                                }
                            }
                        }
                    }

                    // 方法2：如果能够提取到漫画名和章节号，尝试从GM存储中查找对应的任务
                    if (currentMangaName && currentChapter) {
                        const taskKey = `autoDownload_${currentMangaName}_${currentChapter}`;
                        taskData = GM_getValue(taskKey, null);
                        if (taskData) {
                            taskId = taskKey;
                            console.log('✓ 通过漫画名+章节号检测到任务:', taskKey);
                    console.log('从存储中读取任务数据:', taskData);
                            return { taskData, taskId };
                        } else {
                            console.log('未找到对应的任务数据，taskKey:', taskKey);
                        }
                    }

                    // 方法3：尝试模糊匹配（仅漫画名匹配）
                    if (currentMangaName && pendingTask && pendingTask.mangaName === currentMangaName) {
                        console.log('尝试模糊匹配...');
                        // 尝试当前章节
                        if (currentChapter) {
                            const taskKey = `autoDownload_${currentMangaName}_${currentChapter}`;
                            taskData = GM_getValue(taskKey, null);
                            if (taskData) {
                                taskId = taskKey;
                                console.log('✓ 通过模糊匹配找到任务:', taskKey);
                                return { taskData, taskId };
                            }
                        }
                    }

                    return { taskData: null, taskId: null };
                };

                // 尝试查找任务（最多重试5次，每次间隔500ms）
                let taskResult = findTask();
                let retryCount = 0;
                const maxRetries = 5;

                while (!taskResult.taskData && retryCount < maxRetries) {
                    console.log(`任务查找失败，${500}ms后重试... (${retryCount + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    taskResult = findTask();
                    retryCount++;
                }

                const { taskData, taskId } = taskResult;

                // 输出查找结果
                if (!taskData) {
                    console.log('========================================');
                    console.log('❌ 未找到任务数据');
                    console.log('当前URL:', window.location.href);
                    console.log('尝试查找的漫画名:', extractMangaName());
                    console.log('尝试查找的章节号:', extractChapterNumber());
                    console.log('所有GM存储的键（用于调试）:');
                    // 列出所有可能的任务键（仅用于调试）
                    if (extractMangaName() && extractChapterNumber()) {
                        const possibleKey = `autoDownload_${extractMangaName()}_${extractChapterNumber()}`;
                        console.log('期望的任务键:', possibleKey);
                    }
                    const pendingTask = GM_getValue('pendingAutoDownload', null);
                    console.log('待处理任务标记:', pendingTask);
                    console.log('========================================');
                }

                // 如果有任务数据，启动自动下载
                if (taskData && taskId && taskData.autoDownload) {
                        console.log('========================================');
                        console.log('✓ 检测到多本下载任务（存储）');
                        console.log('任务信息:', taskData);
                        console.log('========================================');

                    // 智能启动自动下载：使用更短的延迟并添加重试机制
                    const startAutoDownloadWithRetry = (retryCount = 0) => {
                        const maxRetries = 5;
                        const delay = Math.min(500 + retryCount * 500, 2000); // 从500ms开始，最多2秒

                        setTimeout(() => {
                            console.log('========================================');
                            console.log(`🚀 开始执行自动下载流程 (尝试 ${retryCount + 1}/${maxRetries + 1})`);
                            console.log('当前isAutoDownloading状态:', isAutoDownloading);
                            console.log('========================================');

                            // 检查UI是否准备好
                            if (!autoDownloadButton && retryCount < maxRetries) {
                                console.log(`⚠ UI未准备好，${delay}ms后重试...`);
                                startAutoDownloadWithRetry(retryCount + 1);
                                return;
                            }

                            // 设置自动下载状态（如果还没设置的话）
                            if (!isAutoDownloading) {
                                isAutoDownloading = true;
                                GM_setValue('isAutoDownloading', true);
                                console.log('✓ 设置 isAutoDownloading = true');
                            } else {
                                console.log('✓ isAutoDownloading 已经是 true，继续执行下载');
                            }

                            // 更新按钮状态
                            if (autoDownloadButton) {
                                autoDownloadButton.textContent = '⏸️ 停止自动';
                                autoDownloadButton.style.background = '#f44336';
                                console.log('✓ 已更新自动下载按钮状态');
                            } else {
                                console.log('⚠ 自动下载按钮未找到，但继续执行');
                            }

                            // 确保面板保持打开状态
                            if (!isPanelVisible && buttonContainer) {
                                console.log('面板未打开，正在打开...');
                                togglePanel();
                                console.log('✓ 已打开下载面板');
                            } else {
                                console.log('✓ 面板已经打开');
                            }

                            // 禁用外部点击关闭
                            document.removeEventListener('click', closePanelOnOutsideClick, true);
                            console.log('✓ 已禁用外部点击关闭');

                            // 立即开始自动下载流程
                            console.log('========================================');
                            console.log('⏰ 准备调用 processAutoDownload()');
                            console.log('========================================');

                            // 确保processAutoDownload能够被调用
                            try {
                                processAutoDownload();
                                console.log('✓ processAutoDownload() 已调用');
                            } catch (error) {
                                console.error('❌ processAutoDownload() 调用失败:', error);
                                // 如果失败且还有重试次数，继续重试
                                if (retryCount < maxRetries) {
                                    console.log(`⚠ 调用失败，${delay}ms后重试...`);
                                    startAutoDownloadWithRetry(retryCount + 1);
                                }
                            }
                        }, delay);
                    };

                    // 立即开始第一次尝试（延迟500ms）
                    startAutoDownloadWithRetry(0);

                    // 注意：不要立即清除任务数据，保留它以便在跳转到下一章时继续使用
                    // 任务数据会在 processAutoDownload() 中所有章节下载完成后清除
                    // 同时，需要将任务信息保存到一个全局key中，以便下一章识别
                    GM_setValue('currentAutoDownloadTask', {
                        mangaName: taskData.mangaName,
                        taskId: taskId
                    });
                }
                // 检查是否需要继续自动下载
                else if (isAutoDownloading) {
                    console.log('✓ 检测到自动下载任务');
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

                    // 继续自动下载流程（减少等待时间）
                    setTimeout(() => {
                        processAutoDownload();
                    }, 1000);
                } else {
                    console.log('没有待处理的下载任务');
                }
            };

            // 清除旧的位置数据（防止位置异常）
            const savedPos = GM_getValue('floatBallPosition', null);
            if (savedPos && (savedPos.bottom > window.innerHeight - 50 || savedPos.bottom < 0)) {
                console.log('⚠️ 检测到异常的悬浮球位置数据，清除');
                GM_setValue('floatBallPosition', null);
            }

            // 立即创建UI，不等待任务检查
            console.log('🚀 立即创建悬浮球和UI...');
            try {
                createFloatBall();
                createDownloadUI();
                console.log('✅ UI创建完成');
            } catch (error) {
                console.error('❌ UI创建失败:', error);
            }

            // 等待页面加载后再检查任务
            if (document.readyState === 'loading') {
                console.log('页面正在加载，等待DOMContentLoaded...');
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(initUI, 500);
                });
            } else {
                console.log('页面已加载完成，延迟检查任务');
                setTimeout(initUI, 500);
            }
        }

        // 处理多本下载任务
        async function handleMultiDownloadTask(task, taskKey) {
            console.log(`========================================`);
            console.log(`开始处理多本下载任务`);
            console.log(`漫画名: ${task.mangaName}`);
            console.log(`起始章节: ${task.startChapter}`);
            console.log(`结束章节: ${task.endChapter || '下载到最后'}`);
            console.log(`========================================`);

            try {
                // 确保面板打开
                if (!isPanelVisible && buttonContainer) {
                    console.log('打开下载面板...');
                    togglePanel();
                }

                // 禁用外部点击关闭
                document.removeEventListener('click', closePanelOnOutsideClick, true);

                // 等待页面完全加载
                console.log('等待页面加载完成...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 自动扫描图片
                console.log('开始扫描图片...');
                await scanImagesAsync();

                if (imageUrls.length === 0) {
                    console.error('未找到任何图片！');
                    alert(`《${task.mangaName}》第${extractChapterNumber()}章未找到图片，请检查页面是否正确加载。`);
                    GM_setValue(taskKey, null);
                    return;
                }

                console.log(`扫描完成，找到 ${imageUrls.length} 张图片`);
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 自动下载
                console.log('开始批量下载...');
                await batchDownloadAsync();
                console.log('下载完成！');

                await new Promise(resolve => setTimeout(resolve, 2000));

                // 获取当前章节号
                const currentChapter = extractChapterNumber();
                console.log(`当前章节: ${currentChapter}`);

                // 判断是否需要继续下载下一章
                let shouldContinue = false;

                if (task.downloadToEnd) {
                    console.log('设置为下载到最后，继续下一章...');
                    shouldContinue = true;
                } else if (task.endChapter && currentChapter < task.endChapter) {
                    console.log(`当前章节 ${currentChapter} < 结束章节 ${task.endChapter}，继续下一章...`);
                    shouldContinue = true;
                } else {
                    console.log('已达到结束章节或未设置继续下载');
                }

                if (shouldContinue) {
                    // 尝试下载下一章
                    const nextChapter = currentChapter + 1;
                    const baseUrl = window.location.origin;

                    console.log(`检查第 ${nextChapter} 章...`);

                    // 首先尝试英文版本
                    const normalUrl = `${baseUrl}/manga/${task.mangaName}/chapter-${nextChapter}`;
                    console.log(`尝试英文版本: ${normalUrl}`);
                    const normalExists = await checkChapterExists(normalUrl);

                    if (normalExists) {
                        console.log(`✓ 找到第 ${nextChapter} 章（英文版），准备跳转...`);
                        GM_setValue('navigationTimestamp', Date.now());
                        window.location.href = normalUrl;
                        return;
                    }

                    // 如果英文版不存在，尝试raw版本
                    const rawUrl = `${baseUrl}/manga/${task.mangaName}/chapter-${nextChapter}-raw`;
                    console.log(`尝试raw版本: ${rawUrl}`);
                    const rawExists = await checkChapterExists(rawUrl);

                    if (rawExists) {
                        console.log(`✓ 找到第 ${nextChapter} 章（raw版），准备跳转...`);
                        GM_setValue('navigationTimestamp', Date.now());
                        window.location.href = rawUrl;
                        return;
                    }

                    console.log(`✗ 第 ${nextChapter} 章不存在，任务完成`);
                }

                // 如果不需要继续或找不到下一章，清除任务并提示完成
                console.log(`========================================`);
                console.log(`《${task.mangaName}》全部下载完成！`);
                console.log(`========================================`);
                GM_setValue(taskKey, null); // 清除任务
                alert(`✅ 《${task.mangaName}》下载完成！\n\n您可以关闭此标签页。`);

            } catch (error) {
                console.error('下载过程出错:', error);
                alert(`下载《${task.mangaName}》时出错: ${error.message}\n\n请查看控制台了解详情。`);
                GM_setValue(taskKey, null);
            }
        }

        // 处理从URL参数传递的多本下载任务
        async function handleMultiDownloadTaskFromURL(task) {
            console.log(`========================================`);
            console.log(`开始处理多本下载任务（URL参数）`);
            console.log(`漫画名: ${task.mangaName}`);
            console.log(`起始章节: ${task.startChapter}`);
            console.log(`结束章节: ${task.endChapter || '下载到最后'}`);
            console.log(`========================================`);

            try {
                // 确保面板打开
                if (!isPanelVisible && buttonContainer) {
                    console.log('打开下载面板...');
                    togglePanel();
                }

                // 禁用外部点击关闭
                document.removeEventListener('click', closePanelOnOutsideClick, true);

                // 等待页面完全加载
                console.log('等待页面加载完成...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 自动扫描图片
                console.log('开始扫描图片...');
                await scanImagesAsync();

                if (imageUrls.length === 0) {
                    console.error('未找到任何图片！');
                    alert(`《${task.mangaName}》第${extractChapterNumber()}章未找到图片，请检查页面是否正确加载。`);
                    return;
                }

                console.log(`扫描完成，找到 ${imageUrls.length} 张图片`);
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 自动下载
                console.log('开始批量下载...');
                await batchDownloadAsync();
                console.log('下载完成！');

                await new Promise(resolve => setTimeout(resolve, 2000));

                // 获取当前章节号
                const currentChapter = extractChapterNumber();
                console.log(`当前章节: ${currentChapter}`);

                // 判断是否需要继续下载下一章
                let shouldContinue = false;

                if (task.downloadToEnd) {
                    console.log('设置为下载到最后，继续下一章...');
                    shouldContinue = true;
                } else if (task.endChapter && currentChapter < task.endChapter) {
                    console.log(`当前章节 ${currentChapter} < 结束章节 ${task.endChapter}，继续下一章...`);
                    shouldContinue = true;
                } else {
                    console.log('已达到结束章节或未设置继续下载');
                }

                if (shouldContinue) {
                    // 尝试下载下一章
                    const nextChapter = currentChapter + 1;
                    const baseUrl = window.location.origin;

                    console.log(`========================================`);
                    console.log(`准备下载下一章`);
                    console.log(`当前章节: ${currentChapter}`);
                    console.log(`下一章: ${nextChapter}`);
                    console.log(`任务配置 - downloadToEnd: ${task.downloadToEnd}, endChapter: ${task.endChapter}`);
                    console.log(`========================================`);

                    // 首先尝试英文版本
                    const normalUrl = `${baseUrl}/manga/${task.mangaName}/chapter-${nextChapter}`;
                    console.log(`[检查章节] 尝试英文版本: ${normalUrl}`);
                    const normalExists = await checkChapterExists(normalUrl);
                    console.log(`[检查章节] 英文版本检查结果: ${normalExists ? '存在✓' : '不存在✗'}`);

                    if (normalExists) {
                        console.log(`✓ 找到第 ${nextChapter} 章（英文版），准备跳转...`);
                        // 更新任务数据（更新startChapter为下一章）
                        const nextTaskData = {
                            autoDownload: true,
                            startChapter: nextChapter,
                            endChapter: task.endChapter,
                            downloadToEnd: task.downloadToEnd,
                            realMangaName: task.mangaName,
                            taskId: task.taskId
                        };
                        GM_setValue(task.taskId, nextTaskData);
                        console.log(`[跳转] 更新任务数据:`, nextTaskData);

                        // 跳转到下一章（使用hash传递taskId）
                        const jumpUrl = `${normalUrl}#autoDownload=${task.taskId}`;
                        console.log(`[跳转] 目标URL: ${jumpUrl}`);
                        GM_setValue('navigationTimestamp', Date.now());
                        window.location.href = jumpUrl;
                        return;
                    }

                    // 如果英文版不存在，尝试raw版本
                    const rawUrl = `${baseUrl}/manga/${task.mangaName}/chapter-${nextChapter}-raw`;
                    console.log(`[检查章节] 尝试raw版本: ${rawUrl}`);
                    const rawExists = await checkChapterExists(rawUrl);
                    console.log(`[检查章节] raw版本检查结果: ${rawExists ? '存在✓' : '不存在✗'}`);

                    if (rawExists) {
                        console.log(`✓ 找到第 ${nextChapter} 章（raw版），准备跳转...`);
                        // 更新任务数据（更新startChapter为下一章）
                        const nextTaskData = {
                            autoDownload: true,
                            startChapter: nextChapter,
                            endChapter: task.endChapter,
                            downloadToEnd: task.downloadToEnd,
                            realMangaName: task.mangaName,
                            taskId: task.taskId
                        };
                        GM_setValue(task.taskId, nextTaskData);
                        console.log(`[跳转] 更新任务数据:`, nextTaskData);

                        // 跳转到下一章（使用hash传递taskId）
                        const jumpUrl = `${rawUrl}#autoDownload=${task.taskId}`;
                        console.log(`[跳转] 目标URL: ${jumpUrl}`);
                        GM_setValue('navigationTimestamp', Date.now());
                        window.location.href = jumpUrl;
                        return;
                    }

                    console.log(`========================================`);
                    console.log(`✗ 第 ${nextChapter} 章不存在（英文版和raw版都没有）`);
                    console.log(`任务完成！`);
                    console.log(`========================================`);
                } else {
                    console.log(`========================================`);
                    console.log(`不需要继续下载下一章`);
                    console.log(`原因: downloadToEnd=${task.downloadToEnd}, currentChapter=${currentChapter}, endChapter=${task.endChapter}`);
                    console.log(`========================================`);
                }

                // 如果不需要继续或找不到下一章，提示完成
                console.log(`========================================`);
                console.log(`《${task.mangaName}》全部下载完成！`);
                console.log(`========================================`);
                alert(`✅ 《${task.mangaName}》下载完成！\n\n您可以关闭此标签页。`);

            } catch (error) {
                console.error('下载过程出错:', error);
                alert(`下载《${task.mangaName}》时出错: ${error.message}\n\n请查看控制台了解详情。`);
            }
        }

        // 启动
        init();
    })();


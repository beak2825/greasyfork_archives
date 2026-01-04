// ==UserScript==
// @name         鼠标悬停图片自动放大预览
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  一款好用的网页图片放大工具，鼠标悬停即可自动放大图片，支持自定义配置，适配所有网页～
// @author       益达哥哥
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553648/%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E6%94%BE%E5%A4%A7%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/553648/%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E6%94%BE%E5%A4%A7%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // 图片放大功能模块
    // ================================
    const imageZoomModule = (function() {
        const defaultConfig = {
            delay: 500,
            scale: 3,
            maxWidth: 1200,
            maxHeight: 980,
            minScale: 1.4,
            portraitRatio: 1.3,
            wrapperZIndex: 1,
            zoomZIndex: 9999,
            transition: 'all 0.3s ease',
            scrollSpeed: 50,
            smallImgThreshold: 280,
            smallImgWidth: 500,
            smallImgHeight: 430,
            avoidClickConflict: true
        };

        const states = new WeakMap();
        let isEnabled = true;
        let isMinimized = false;
        let originalPos = null;
        let config = { ...defaultConfig };
        const currentDomain = getDomain();
        let currentZoomContainer = null;
        let toggleButton = null;
        let excludedHomepages = [];

        const fullBtnWidth = 80;
        const fullBtnHeight = 32;
        const miniBtnDiameter = 32;
        const miniBtnRadius = miniBtnDiameter / 2;
        const exposeRatio = 0.15;

        function getDomain() {
            try { return new URL(window.location.href).hostname; }
            catch (e) { return window.location.hostname; }
        }

        function getCurrentHomepage() {
            const url = new URL(window.location.href);
            return `${url.protocol}//${url.hostname}/`;
        }

        function isHomepageExcluded() {
            const currentHomepage = getCurrentHomepage();
            return excludedHomepages.includes(currentHomepage);
        }

        function loadExcludedHomepages() {
            const saved = GM_getValue(`image_zoom_excluded_homepages_${currentDomain}`, []);
            excludedHomepages = Array.isArray(saved) ? saved : [];
        }

        function saveExcludedHomepages() {
            GM_setValue(`image_zoom_excluded_homepages_${currentDomain}`, excludedHomepages);
        }

        function toggleCurrentHomepageExclusion() {
            const currentHomepage = getCurrentHomepage();
            const index = excludedHomepages.indexOf(currentHomepage);

            if (index > -1) {
                excludedHomepages.splice(index, 1);
                showToast('已启用当前主页的图片放大功能');
            } else {
                excludedHomepages.push(currentHomepage);
                showToast('已禁用当前主页的图片放大功能');

                if (isHomepage() && isEnabled) {
                    cleanup();
                }
            }
            saveExcludedHomepages();
            updateExclusionButtonState();
            updateButtonState();
        }

        function isHomepage() {
            const path = window.location.pathname;
            return path === '/' || path === '/index.html' || path === '/index.php' || path === '';
        }

        function showToast(message) {
            let toast = document.getElementById('image-zoom-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'image-zoom-toast';
                toast.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 6px;
                    z-index: 100000;
                    font-size: 14px;
                    font-family: Arial, sans-serif;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                `;
                document.body.appendChild(toast);
            }

            toast.textContent = message;
            toast.style.opacity = '1';

            setTimeout(() => {
                toast.style.opacity = '0';
            }, 2000);
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function validateConfig(config) {
            const validated = { ...config };
            validated.delay = Math.max(0, Math.min(2000, validated.delay));
            validated.scale = Math.max(1, Math.min(10, validated.scale));
            validated.maxWidth = Math.max(100, Math.min(5000, validated.maxWidth));
            validated.maxHeight = Math.max(100, Math.min(5000, validated.maxHeight));
            validated.minScale = Math.max(1, Math.min(5, validated.minScale));
            validated.portraitRatio = Math.max(1, Math.min(5, validated.portraitRatio));
            validated.scrollSpeed = Math.max(1, Math.min(100, validated.scrollSpeed));
            validated.smallImgThreshold = Math.max(50, Math.min(1000, validated.smallImgThreshold));
            validated.smallImgWidth = Math.max(100, Math.min(2000, validated.smallImgWidth));
            validated.smallImgHeight = Math.max(100, Math.min(2000, validated.smallImgHeight));
            return validated;
        }

        function loadConfig() {
            const savedConfig = GM_getValue(`image_zoom_config_${currentDomain}`);
            if (savedConfig) {
                const validatedConfig = validateConfig(savedConfig);
                config = { ...defaultConfig, ...validatedConfig };
            }
        }

        function saveConfig() {
            GM_setValue(`image_zoom_config_${currentDomain}`, config);
        }

        function loadState() {
            const savedState = GM_getValue(`image_zoom_enabled_${currentDomain}`);
            isEnabled = savedState !== false;

            if (isHomepage() && isHomepageExcluded()) {
                isEnabled = false;
            }
        }

        function injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .image-zoom-wrapper * {
                    box-sizing: border-box;
                }
                .image-zoom-container img {
                    object-fit: contain;
                }
                #image-zoom-toggle {
                    all: initial;
                    font-family: Arial, sans-serif;
                }
                .image-zoom-hover {
                    cursor: zoom-in !important;
                }
                /* 链接容器悬停样式 */
                a.image-zoom-hover, .cover-container.image-zoom-hover, .card.image-zoom-hover {
                    cursor: zoom-in !important;
                }
                /* 确保stretched-link不影响鼠标样式 */
                a.stretched-link.image-zoom-hover {
                    cursor: zoom-in !important;
                }
            `;
            document.head.appendChild(style);
        }

        function createToggleButton() {
            const button = document.createElement('div');
            button.id = 'image-zoom-toggle';
            button.className = 'zoom-btn';

            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: ${fullBtnWidth}px;
                height: ${fullBtnHeight}px;
                border-radius: ${fullBtnHeight/2}px;
                background-color: #4CAF50;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 12px;
                cursor: pointer;
                z-index: 99999;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.5s ease;
                font-weight: bold;
                font-size: 12px;
                opacity: 0.2;
                overflow: visible;
                user-select: none;
            `;

            const textSpan = document.createElement('span');
            textSpan.className = 'btn-text';
            textSpan.textContent = '图片放大：开';
            textSpan.style.transition = 'opacity 0.3s ease';

            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'btn-arrow';
            arrowSpan.textContent = '▶';
            arrowSpan.style.cssText = `
                margin-left: 5px;
                font-size: 14px;
                transition: transform 0.3s ease;
            `;

            button.appendChild(textSpan);
            button.appendChild(arrowSpan);
            button.title = '左键：切换功能 / 右键：打开设置 / 点击箭头：吸附边缘';

            const savedPos = GM_getValue(`image_zoom_button_pos_${currentDomain}`);
            if (savedPos) {
                button.style.top = savedPos.top;
                button.style.left = savedPos.left;
                button.style.bottom = "auto";
                button.style.right = "auto";
            }

            button.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
            });
            button.addEventListener('mouseleave', () => {
                button.style.opacity = isMinimized ? '0.5' : '0.2';
            });

            button.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-arrow') || e.target.parentNode.classList.contains('btn-arrow')) {
                    e.stopPropagation();
                    if (isMinimized) restoreButton();
                    else minimizeButton();
                    return;
                }

                if (e.button !== 0) return;
                toggleEnabled();
            });

            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleConfigPanel();
            });

            makeDraggable(button);

            document.body.appendChild(button);
            updateButtonState();
            return button;
        }

        function minimizeButton() {
            if (isMinimized) return;

            originalPos = {
                top: toggleButton.style.top,
                left: toggleButton.style.left,
                bottom: toggleButton.style.bottom,
                right: toggleButton.style.right,
                width: toggleButton.style.width,
                height: toggleButton.style.height
            };

            const rect = toggleButton.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const distances = {
                right: viewportWidth - rect.right,
                left: rect.left
            };
            const nearestEdge = Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0];

            toggleButton.style.top = 'auto';
            toggleButton.style.left = 'auto';
            toggleButton.style.bottom = 'auto';
            toggleButton.style.right = 'auto';
            toggleButton.style.width = `${miniBtnDiameter}px`;
            toggleButton.style.height = `${miniBtnDiameter}px`;
            toggleButton.style.borderRadius = '50%';
            toggleButton.querySelector('.btn-text').style.opacity = '0';

            const arrowSpan = toggleButton.querySelector('.btn-arrow');
            const exposeWidth = miniBtnDiameter * exposeRatio;
            arrowSpan.style.cssText = `
                margin: 0;
                font-size: 12px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            `;

            if (nearestEdge === 'left') {
                arrowSpan.textContent = '▶';
                arrowSpan.style.left = `${miniBtnDiameter * (1 - exposeRatio) + exposeWidth * 0.5}px`;
            } else {
                arrowSpan.textContent = '◀';
                arrowSpan.style.left = `${exposeWidth * 0.5}px`;
            }

            const centerY = rect.top + rect.height/2;
            const hiddenOffset = miniBtnDiameter * (1 - exposeRatio);

            if (nearestEdge === 'left') {
                toggleButton.style.left = `-${hiddenOffset}px`;
                toggleButton.style.top = `${centerY - miniBtnRadius}px`;
            } else {
                toggleButton.style.right = `-${hiddenOffset}px`;
                toggleButton.style.top = `${centerY - miniBtnRadius}px`;
            }

            toggleButton.style.opacity = '0.5';
            isMinimized = true;
        }

        function restoreButton() {
            if (!isMinimized || !originalPos) return;

            toggleButton.style.width = originalPos.width;
            toggleButton.style.height = originalPos.height;
            toggleButton.style.borderRadius = `${fullBtnHeight/2}px`;
            toggleButton.querySelector('.btn-text').style.opacity = '1';

            const arrowSpan = toggleButton.querySelector('.btn-arrow');
            arrowSpan.style.cssText = `
                margin-left: 5px;
                font-size: 14px;
                transition: transform 0.3s ease;
                position: static;
                transform: none;
            `;

            const originalLeft = parseFloat(originalPos.left) || 0;
            const viewportHalf = window.innerWidth / 2;
            arrowSpan.textContent = originalLeft < viewportHalf ? '◀' : '▶';

            toggleButton.style.top = originalPos.top;
            toggleButton.style.left = originalPos.left;
            toggleButton.style.bottom = originalPos.bottom;
            toggleButton.style.right = originalPos.right;

            toggleButton.style.opacity = '0.2';
            isMinimized = false;
        }

        function toggleEnabled() {
            isEnabled = !isEnabled;
            GM_setValue(`image_zoom_enabled_${currentDomain}`, isEnabled);
            updateButtonState();

            if (isEnabled) {
                initImages();
            } else {
                cleanup();
            }
        }

        function cleanup() {
            if (currentZoomContainer) {
                currentZoomContainer.remove();
                currentZoomContainer = null;
            }

            document.querySelectorAll('.image-zoom-container').forEach(el => el.remove());
            document.querySelectorAll('.image-zoom-wrapper').forEach(wrapper => {
                const parent = wrapper.parentNode;
                while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, wrapper);
                parent.removeChild(wrapper);
            });

            document.querySelectorAll('img.image-zoom-processed').forEach(img => {
                const state = states.get(img);
                if (state) {
                    if (state.timer) clearTimeout(state.timer);
                    // 清理所有容器
                    if (state.containers) {
                        state.containers.forEach(ctn => {
                            ctn.classList.remove('image-zoom-hover');
                            ctn.removeAttribute('data-zoom-proxy');
                            ctn.removeAttribute('data-stretch-fixed');
                        });
                    }
                }
                img.classList.remove('image-zoom-processed');
                img.classList.remove('image-zoom-hover');
                states.delete(img);
            });
        }

        function updateButtonState() {
            if (!toggleButton) return;
            const textSpan = toggleButton.querySelector('.btn-text');

            if (isHomepage() && isHomepageExcluded()) {
                textSpan.textContent = '主页已排除';
                toggleButton.style.backgroundColor = '#ff9800';
            } else {
                textSpan.textContent = isEnabled ? '图片放大：开' : '图片放大：关';
                toggleButton.style.backgroundColor = isEnabled ? '#4CAF50' : '#f44336';
            }
        }

        function makeDraggable(element) {
            let isDragging = false;

            element.onmousedown = (e) => {
                if (isMinimized) {
                    restoreButton();
                    return;
                }
                if (e.button !== 0) return;
                e.preventDefault();
                isDragging = true;
                document.addEventListener('mousemove', dragMove);
                document.addEventListener('mouseup', dragEnd);
            };

            function dragMove(e) {
                if (!isDragging) return;
                e.preventDefault();
                const buttonHalfWidth = element.offsetWidth / 2;
                const buttonHalfHeight = element.offsetHeight / 2;
                const left = e.clientX - buttonHalfWidth;
                const top = e.clientY - buttonHalfHeight;
                element.style.top = `${top}px`;
                element.style.left = `${left}px`;
                element.style.bottom = "auto";
                element.style.right = "auto";

                const arrowSpan = element.querySelector('.btn-arrow');
                const viewportHalf = window.innerWidth / 2;
                arrowSpan.textContent = left < viewportHalf ? '◀' : '▶';
            }

            function dragEnd() {
                if (!isDragging) return;
                isDragging = false;
                GM_setValue(`image_zoom_button_pos_${currentDomain}`, {
                    top: element.style.top,
                    left: element.style.left
                });
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('mouseup', dragEnd);
            }
        }

        function updateExclusionButtonState() {
            const exclusionBtn = document.getElementById('homepage-exclusion-btn');
            const exclusionStatus = document.getElementById('exclusion-status');

            if (exclusionBtn && exclusionStatus) {
                const isExcluded = isHomepageExcluded();
                exclusionBtn.textContent = isExcluded ? '启用主页功能' : '禁用主页功能';
                exclusionBtn.style.backgroundColor = isExcluded ? '#4CAF50' : '#ff9800';
                exclusionStatus.textContent = isExcluded ? '当前主页已禁用图片放大' : '当前主页已启用图片放大';
                exclusionStatus.style.color = isExcluded ? '#ff9800' : '#4CAF50';
            }
        }

        // 检查图片是否有点击功能
        function checkImageClickBehavior(img) {
            // 检查常见的点击放大属性
            const commonSelectors = [
                '[onclick*="zoom"]',
                '[onclick*="lightbox"]',
                '[onclick*="gallery"]',
                '[onclick*="preview"]',
                '[data-action*="zoom"]',
                '[data-lightbox]',
                '[data-gallery]',
                '[data-fancybox]',
                '.zoomable',
                '.lightbox',
                '.gallery-item',
                '.fancybox',
                '.stretched-link'
            ];

            // 检查图片本身属性
            for (const selector of commonSelectors) {
                if (img.matches(selector)) {
                    return true;
                }
            }

            // 检查父元素是否有相关类名
            let parent = img.parentElement;
            while (parent && parent !== document.body) {
                const parentClass = parent.className || '';
                const parentId = parent.id || '';
                if (parentClass.includes('zoom') ||
                    parentClass.includes('lightbox') ||
                    parentClass.includes('gallery') ||
                    parentClass.includes('fancybox') ||
                    parentClass.includes('stretched-link') ||
                    parentId.includes('zoom') ||
                    parentId.includes('lightbox') ||
                    parentId.includes('gallery') ||
                    parentId.includes('fancybox')) {
                    return true;
                }
                parent = parent.parentElement;
            }

            return false;
        }

        // 检查图片是否处于灯箱模式（点击放大后的状态）
        function isImageInLightboxMode(img) {
            // 检查常见的灯箱模式特征
            const commonLightboxSelectors = [
                '.lightbox-open',
                '.fancybox-open',
                '.modal-open',
                '.zoom-overlay-open'
            ];

            // 检查body或html元素是否有灯箱相关类名
            for (const selector of commonLightboxSelectors) {
                if (document.body.classList.contains(selector.replace('.', '')) ||
                    document.documentElement.classList.contains(selector.replace('.', ''))) {
                    return true;
                }
            }

            return false;
        }

        // 精确的图片验证函数 - 只识别真正的图片元素
        function isValidImage(img) {
            if (!img || !img.parentNode) return false;

            // 1. 必须是真正的img元素
            if (img.tagName !== 'IMG') return false;

            // 2. 检查图片是否真正可见
            const style = window.getComputedStyle(img);
            if (style.display === 'none' ||
                style.visibility === 'hidden' ||
                parseFloat(style.opacity) === 0 ||
                img.offsetParent === null) {
                return false; // 跳过隐藏的图片
            }

            // 3. 检查图片是否有有效的src
            const src = img.src || img.currentSrc;
            if (!src || src.trim() === '' || src.startsWith('data:') || src.includes('placeholder')) {
                return false; // 跳过无效或占位符图片
            }

            // 4. 排除背景图片伪装成的img元素
            if (style.backgroundImage && style.backgroundImage !== 'none') {
                return false;
            }

            // 5. 检查图片是否已经加载完成
            if (!img.complete || img.naturalWidth === 0) {
                return false;
            }

            // 6. 检查图片尺寸 - 只排除明显是装饰性的小图标
            const rect = img.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) {
                return false; // 跳过非常小的图标
            }

            return true;
        }

        function createConfigPanel() {
            const panel = document.createElement('div');
            panel.id = 'image-zoom-config';
            panel.style.cssText = `
                position: fixed;
                bottom: 70px;
                right: 20px;
                width: 320px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                padding: 15px;
                z-index: 99998;
                display: none;
                font-family: Arial, sans-serif;
                max-height: 80vh;
                overflow-y: auto;
            `;

            const title = document.createElement('h3');
            title.textContent = '图片放大设置';
            title.style.cssText = 'margin: 0 0 15px; padding-bottom: 8px; border-bottom: 1px solid #eee;';
            panel.appendChild(title);

            // 主页排除功能区域
            const exclusionSection = document.createElement('div');
            exclusionSection.style.cssText = `
                margin: 15px 0;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #ff9800;
            `;

            const exclusionTitle = document.createElement('h4');
            exclusionTitle.textContent = '如果此主页面图片不显示可以尝试禁用';
            exclusionTitle.style.cssText = 'margin: 0 0 8px; color: #333;';
            exclusionSection.appendChild(exclusionTitle);

            const exclusionDesc = document.createElement('p');
            exclusionDesc.textContent = '在当前网站主页禁用图片放大功能，不影响其他的子页面';
            exclusionDesc.style.cssText = 'margin: 0 0 10px; font-size: 12px; color: #666;';
            exclusionSection.appendChild(exclusionDesc);

            const exclusionStatus = document.createElement('div');
            exclusionStatus.id = 'exclusion-status';
            exclusionStatus.style.cssText = 'margin: 8px 0; font-size: 13px; font-weight: bold;';
            exclusionSection.appendChild(exclusionStatus);

            const exclusionBtn = document.createElement('button');
            exclusionBtn.id = 'homepage-exclusion-btn';
            exclusionBtn.style.cssText = `
                width: 100%;
                padding: 8px;
                background: #ff9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            `;
            exclusionBtn.addEventListener('click', toggleCurrentHomepageExclusion);
            exclusionSection.appendChild(exclusionBtn);

            const exclusionListTitle = document.createElement('h5');
            exclusionListTitle.textContent = '已排除的主页:';
            exclusionListTitle.style.cssText = 'margin: 15px 0 8px; color: #333;';
            exclusionSection.appendChild(exclusionListTitle);

            const exclusionList = document.createElement('div');
            exclusionList.id = 'exclusion-list';
            exclusionList.style.cssText = 'max-height: 120px; overflow-y: auto; font-size: 12px;';
            exclusionSection.appendChild(exclusionList);

            panel.appendChild(exclusionSection);

            function updateExclusionList() {
                exclusionList.innerHTML = '';
                if (excludedHomepages.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.textContent = '暂无排除的主页';
                    emptyMsg.style.cssText = 'color: #999; font-style: italic; padding: 5px;';
                    exclusionList.appendChild(emptyMsg);
                } else {
                    excludedHomepages.forEach(homepage => {
                        const item = document.createElement('div');
                        item.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 4px 8px;
                            margin: 2px 0;
                            background: white;
                            border-radius: 3px;
                            border: 1px solid #eee;
                        `;

                        const urlSpan = document.createElement('span');
                        urlSpan.textContent = homepage;
                        urlSpan.style.cssText = 'flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = '移除';
                        removeBtn.style.cssText = `
                            background: #f44336;
                            color: white;
                            border: none;
                            border-radius: 3px;
                            padding: 2px 6px;
                            font-size: 11px;
                            cursor: pointer;
                            margin-left: 8px;
                        `;
                        removeBtn.addEventListener('click', () => {
                            const index = excludedHomepages.indexOf(homepage);
                            if (index > -1) {
                                excludedHomepages.splice(index, 1);
                                saveExcludedHomepages();
                                updateExclusionList();
                                updateExclusionButtonState();
                                updateButtonState();
                                showToast('已移除主页排除');
                            }
                        });

                        item.appendChild(urlSpan);
                        item.appendChild(removeBtn);
                        exclusionList.appendChild(item);
                    });
                }
            }

            // 添加避免冲突选项
            const avoidConflictItem = document.createElement('div');
            avoidConflictItem.style.marginBottom = '12px';

            const avoidConflictLabel = document.createElement('label');
            avoidConflictLabel.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px; font-size: 14px; cursor: pointer;';

            const avoidConflictCheckbox = document.createElement('input');
            avoidConflictCheckbox.type = 'checkbox';
            avoidConflictCheckbox.checked = config.avoidClickConflict;
            avoidConflictCheckbox.style.cssText = 'margin-right: 8px;';

            avoidConflictCheckbox.addEventListener('change', () => {
                config.avoidClickConflict = avoidConflictCheckbox.checked;
                saveConfig();
                // 重新初始化图片处理
                if (isEnabled) {
                    cleanup();
                    initImages();
                }
            });

            const avoidConflictText = document.createElement('span');
            avoidConflictText.textContent = '避免与点击放大功能冲突';

            avoidConflictLabel.appendChild(avoidConflictCheckbox);
            avoidConflictLabel.appendChild(avoidConflictText);
            avoidConflictItem.appendChild(avoidConflictLabel);

            const avoidConflictDesc = document.createElement('div');
            avoidConflictDesc.textContent = '开启后会自动检测网站的点击放大功能，避免冲突';
            avoidConflictDesc.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
            avoidConflictItem.appendChild(avoidConflictDesc);

            panel.appendChild(avoidConflictItem);

            function addConfigInput(label, key, type = 'number', min, max, step) {
                const item = document.createElement('div');
                item.style.marginBottom = '12px';

                const itemLabel = document.createElement('label');
                itemLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 14px;';
                itemLabel.textContent = label;
                item.appendChild(itemLabel);

                const input = document.createElement('input');
                input.type = type;
                input.value = config[key];
                input.min = min;
                input.max = max;
                input.step = step;
                input.style.cssText = 'width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;';

                input.addEventListener('input', () => {
                    let value = type === 'number' ? parseFloat(input.value) : input.value;
                    if (isNaN(value)) value = defaultConfig[key];
                    config[key] = value;
                    saveConfig();
                });
                item.appendChild(input);
                panel.appendChild(item);
            }

            addConfigInput('悬停延迟(毫秒)', 'delay', 'number', 0, 2000, 100);
            addConfigInput('大图放大倍数', 'scale', 'number', 1, 5, 0.1);
            addConfigInput('大图最小倍数', 'minScale', 'number', 1, 3, 0.1);
            addConfigInput('大图最大宽度(像素)', 'maxWidth', 'number', 300, 3000, 100);
            addConfigInput('大图最大高度(像素)', 'maxHeight', 'number', 300, 3000, 100);
            addConfigInput('竖屏判定比例', 'portraitRatio', 'number', 1, 3, 0.1);
            addConfigInput('滚轮移动速度(像素)', 'scrollSpeed', 'number', 5, 50, 1);
            addConfigInput('小图判定阈值(像素)', 'smallImgThreshold', 'number', 100, 500, 10);
            addConfigInput('小图强制宽度(像素)', 'smallImgWidth', 'number', 300, 1000, 10);
            addConfigInput('小图强制高度(像素)', 'smallImgHeight', 'number', 300, 1000, 10);
            addConfigInput('包装层层级', 'wrapperZIndex', 'number', 0, 100, 1);

            // 添加B站音量控制开关
            const bilibiliVolumeSection = document.createElement('div');
            bilibiliVolumeSection.style.cssText = `
                margin: 20px 0 15px 0;
                padding: 12px;
                background: #f0f8ff;
                border-radius: 6px;
                border-left: 4px solid #2196F3;
            `;

            const bilibiliTitle = document.createElement('h4');
            bilibiliTitle.textContent = 'B站音量控制';
            bilibiliTitle.style.cssText = 'margin: 0 0 8px; color: #333;';
            bilibiliVolumeSection.appendChild(bilibiliTitle);

            const bilibiliDesc = document.createElement('p');
            bilibiliDesc.textContent = '在B站视频区域使用滚轮调节音量，按M键静音';
            bilibiliDesc.style.cssText = 'margin: 0 0 10px; font-size: 12px; color: #666;';
            bilibiliVolumeSection.appendChild(bilibiliDesc);

            const bilibiliLabel = document.createElement('label');
            bilibiliLabel.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px; font-size: 14px; cursor: pointer;';

            const bilibiliCheckbox = document.createElement('input');
            bilibiliCheckbox.type = 'checkbox';
            bilibiliCheckbox.checked = bilibiliVolumeModule.isEnabled;
            bilibiliCheckbox.style.cssText = 'margin-right: 8px;';

            bilibiliCheckbox.addEventListener('change', () => {
                bilibiliVolumeModule.setEnabled(bilibiliCheckbox.checked);
            });

            const bilibiliText = document.createElement('span');
            bilibiliText.textContent = '启用B站音量控制';

            bilibiliLabel.appendChild(bilibiliCheckbox);
            bilibiliLabel.appendChild(bilibiliText);
            bilibiliVolumeSection.appendChild(bilibiliLabel);

            panel.appendChild(bilibiliVolumeSection);

            const resetBtn = document.createElement('button');
            resetBtn.textContent = '恢复默认设置';
            resetBtn.style.cssText = `
                width: 100%;
                padding: 8px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            `;
            resetBtn.addEventListener('click', () => {
                if (confirm('确定要恢复默认设置吗？')) {
                    config = { ...defaultConfig };
                    saveConfig();
                    // 重新加载面板
                    const newPanel = createConfigPanel();
                    if (panel.parentNode) {
                        panel.parentNode.replaceChild(newPanel, panel);
                    }
                }
            });
            panel.appendChild(resetBtn);

            document.body.appendChild(panel);

            // 初始化排除列表状态
            updateExclusionList();
            updateExclusionButtonState();

            return panel;
        }

        function toggleConfigPanel() {
            const panel = document.getElementById('image-zoom-config');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                if (panel.style.display === 'block') {
                    updateExclusionList();
                    updateExclusionButtonState();
                }
            }
        }

        function handleWheelMove(e) {
            if (currentZoomContainer && isEnabled) {
                e.preventDefault();
            }
            debounceMove(e);
        }

        const debounceMove = debounce(function(e) {
            if (!currentZoomContainer || !isEnabled) return;
            const zoomedImg = currentZoomContainer.querySelector('img');
            if (!zoomedImg) return;
            const moveDistance = e.deltaY > 0 ? -config.scrollSpeed : config.scrollSpeed;
            const currentMarginTop = parseFloat(zoomedImg.style.marginTop) || 0;
            zoomedImg.style.marginTop = (currentMarginTop + moveDistance) + 'px';
        }, 16);

        function handleResize() {
            if (isMinimized) {
                minimizeButton();
            }
        }

        function addKeyboardSupport() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const panel = document.getElementById('image-zoom-config');
                    if (panel && panel.style.display !== 'none') {
                        panel.style.display = 'none';
                    }
                }

                if (e.altKey && e.key === 'z') {
                    e.preventDefault();
                    toggleEnabled();
                }
            });
        }

        function createZoomedImage(img, hasClickFunctionality = false) {
            if (!isEnabled) return null;

            try {
                const rect = img.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return null;

                const isSmallImg = rect.width < config.smallImgThreshold || rect.height < config.smallImgThreshold;
                const isPortrait = rect.height / rect.width > config.portraitRatio;
                let scale, zoomedImgStyle;

                if (isSmallImg) {
                    scale = isPortrait ? config.smallImgHeight / rect.height : config.smallImgWidth / rect.width;
                    zoomedImgStyle = `
                        width: ${rect.width * scale}px;
                        height: ${rect.height * scale}px;
                        transform: scale(0.95);
                        transition: ${config.transition};
                        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                        margin-top: 0;
                    `;
                } else {
                    if (isPortrait) {
                        const heightScale = config.maxHeight / rect.height;
                        scale = Math.min(config.scale, heightScale, Math.max(config.minScale, 1.2));
                    } else {
                        const widthScale = config.maxWidth / rect.width;
                        const heightScale = config.maxHeight / rect.height;
                        scale = Math.min(config.scale, widthScale, heightScale, Math.max(config.minScale, 1));
                    }
                    const maxHeight = isPortrait ? config.maxHeight + 200 : config.maxHeight;
                    zoomedImgStyle = `
                        max-width: ${config.maxWidth}px;
                        max-height: ${maxHeight}px;
                        width: auto;
                        height: auto;
                        transform: scale(0.95);
                        transition: ${config.transition};
                        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                        margin-top: 0;
                    `;
                }

                const zoomContainer = document.createElement('div');
                zoomContainer.className = 'image-zoom-container';

                // 对于有点击功能的图片，我们调整z-index，避免干扰点击功能
                const zoomZIndex = hasClickFunctionality ? config.zoomZIndex - 1 : config.zoomZIndex;

                zoomContainer.style.cssText = `
                    position: fixed;
                    z-index: ${zoomZIndex};
                    opacity: 0;
                    transition: ${config.transition};
                    pointer-events: none;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    box-sizing: border-box;
                    background-color: rgba(0,0,0,0.1);
                `;

                const zoomedImg = document.createElement('img');
                zoomedImg.src = img.src || img.currentSrc;
                zoomedImg.alt = img.alt;
                zoomedImg.style.cssText = zoomedImgStyle;
                zoomContainer.appendChild(zoomedImg);
                document.body.appendChild(zoomContainer);

                if (currentZoomContainer) currentZoomContainer.remove();
                currentZoomContainer = zoomContainer;

                setTimeout(() => {
                    zoomContainer.style.opacity = '1';
                    zoomedImg.style.transform = `scale(${scale})`;
                }, 10);

                return zoomContainer;
            } catch (error) {
                console.warn('创建放大图失败:', error);
                return null;
            }
        }

        function showZoom(img) {
            if (!isEnabled) return;

            // 如果启用了避免冲突且图片正在显示点击放大效果，则不显示悬停放大
            if (config.avoidClickConflict && isImageInLightboxMode(img)) return;

            const state = states.get(img);
            if (!state || state.isZoomed) return;

            // 对于有点击功能的图片，我们使用不同的显示策略
            const zoomContainer = createZoomedImage(img, state.hasClickFunctionality);
            if (!zoomContainer) return;

            states.set(img, { ...state, isZoomed: true, zoomContainer });
        }

        function hideZoom(img) {
            const state = states.get(img);
            if (!state || !state.isZoomed || !state.zoomContainer) return;
            const zoomedImg = state.zoomContainer.querySelector('img');
            if (zoomedImg) zoomedImg.style.transform = 'scale(0.95)';
            state.zoomContainer.style.opacity = '0';
            setTimeout(() => {
                if (state.zoomContainer && state.zoomContainer.parentNode) {
                    state.zoomContainer.parentNode.removeChild(state.zoomContainer);
                }
                if (currentZoomContainer === state.zoomContainer) currentZoomContainer = null;
                states.set(img, { ...state, isZoomed: false, zoomContainer: null, timer: null });
            }, 300);
        }

        // 专门处理stretched-link的事件代理
        function handleStretchedLink(img) {
            // 找到当前卡片中对应的stretched-link
            const card = img.closest('.card');
            if (!card) return;

            const link = card.querySelector('a.stretched-link');
            if (!link || link.dataset.stretchFixed) return;

            // 标记已处理，避免重复绑定
            link.dataset.stretchFixed = '1';

            // 鼠标进入事件代理
            link.addEventListener('mouseenter', () => {
                if (img.classList.contains('image-zoom-processed')) {
                    img.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                }
            });

            // 鼠标离开事件代理
            link.addEventListener('mouseleave', () => {
                if (img.classList.contains('image-zoom-processed')) {
                    img.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                }
            });
        }

        // 处理图片和容器的事件代理
        function processImage(img) {
            if (!isEnabled) return;

            try {
                if (!img || !img.parentNode) return;

                // ========== 精确的图片验证 ==========
                if (!isValidImage(img)) {
                    return; // 跳过不符合条件的元素
                }
                // ========== 验证结束 ==========

                // 查找所有可能的容器层级（从图片到顶层可点击区域）
                let containers = [];
                let current = img.parentNode;
                while (current && current !== document.body) {
                    containers.push(current);
                    // 停止条件：遇到链接、卡片容器或布局容器
                    if (current.tagName === 'A' ||
                        current.classList.contains('card') ||
                        current.classList.contains('col') ||
                        current.classList.contains('card-img-container')) {
                        break;
                    }
                    current = current.parentNode;
                }

                // 优先选择最外层的可交互容器
                const container = containers.length > 0 ? containers[containers.length - 1] : img.parentNode;

                // 检测点击功能（包含stretched-link类的链接默认视为可点击）
                const hasClickFunctionality = config.avoidClickConflict
                    ? (checkImageClickBehavior(img) ||
                       container.tagName === 'A' ||
                       container.classList.contains('stretched-link'))
                    : false;

                if (img.classList.contains('image-zoom-processed')) {
                    return;
                }

                img.classList.add('image-zoom-processed');

                // 为容器添加悬停样式
                if (!hasClickFunctionality) {
                    img.classList.add('image-zoom-hover');
                    // 只为直接父容器添加悬停样式，避免影响表格单元格等
                    if (img.parentNode && img.parentNode !== document.body) {
                        img.parentNode.classList.add('image-zoom-hover');
                    }
                }

                // 处理stretched-link链接
                handleStretchedLink(img);

                // 只为直接父容器添加事件代理（避免表格单元格等误触发）
                const directParent = img.parentNode;
                if (directParent && directParent !== document.body) {
                    if (!directParent.dataset.zoomProxy) {
                        directParent.dataset.zoomProxy = "true";

                        // 鼠标进入事件代理 - 只在鼠标在图片区域内时触发
                        directParent.addEventListener('mouseenter', (e) => {
                            const rect = img.getBoundingClientRect();
                            // 检查鼠标是否在图片区域内
                            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                                img.dispatchEvent(new MouseEvent('mouseenter', {
                                    bubbles: true,
                                    cancelable: true
                                }));
                            }
                        });

                        // 鼠标离开事件代理
                        directParent.addEventListener('mouseleave', (e) => {
                            if (!directParent.contains(e.relatedTarget)) {
                                img.dispatchEvent(new MouseEvent('mouseleave', {
                                    bubbles: true,
                                    cancelable: true
                                }));
                            }
                        });
                    }
                }

                let timer = null;
                let isZoomed = false;
                let zoomContainer = null;

                const handleMouseEnter = (e) => {
                    if (!isEnabled) return;
                    if (isZoomed) return;

                    if (config.avoidClickConflict && isImageInLightboxMode(img)) return;

                    if (timer) clearTimeout(timer);
                    timer = setTimeout(() => {
                        if (!isZoomed) {
                            zoomContainer = createZoomedImage(img, hasClickFunctionality);
                            if (zoomContainer) {
                                isZoomed = true;
                            }
                        }
                    }, config.delay);
                };

                const handleMouseLeave = (e) => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    if (isZoomed && zoomContainer) {
                        const zoomedImg = zoomContainer.querySelector('img');
                        if (zoomedImg) zoomedImg.style.transform = 'scale(0.95)';
                        zoomContainer.style.opacity = '0';
                        setTimeout(() => {
                            if (zoomContainer && zoomContainer.parentNode) {
                                zoomContainer.parentNode.removeChild(zoomContainer);
                            }
                            if (currentZoomContainer === zoomContainer) currentZoomContainer = null;
                            isZoomed = false;
                            zoomContainer = null;
                        }, 300);
                    }
                };

                // 为图片本身添加事件监听
                img.addEventListener('mouseenter', handleMouseEnter);
                img.addEventListener('mouseleave', handleMouseLeave);

                // 点击事件处理
                const handleClick = (e) => {
                    if (isZoomed && zoomContainer) {
                        hideZoom(img);
                    }
                };

                img.addEventListener('click', handleClick, true);

                // 保存状态
                states.set(img, {
                    isZoomed,
                    timer,
                    zoomContainer,
                    hasClickFunctionality,
                    containers: [directParent]  // 只保存直接父容器
                });

            } catch (error) {
                console.warn('图片处理失败:', error);
            }
        }

        // 添加观察器来检测灯箱状态变化
        function setupLightboxObserver() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' &&
                        (mutation.target === document.body || mutation.target === document.documentElement)) {
                        // 当body或html的类名变化时，检查是否进入了灯箱模式
                        if (isImageInLightboxMode(null)) {
                            // 如果进入了灯箱模式，隐藏所有悬停放大
                            document.querySelectorAll('.image-zoom-container').forEach(container => {
                                container.style.opacity = '0';
                                setTimeout(() => {
                                    if (container.parentNode) {
                                        container.parentNode.removeChild(container);
                                    }
                                }, 300);
                            });
                            currentZoomContainer = null;

                            // 更新所有图片的状态
                            document.querySelectorAll('img.image-zoom-processed').forEach(img => {
                                const state = states.get(img);
                                if (state) {
                                    states.set(img, { ...state, isZoomed: false, zoomContainer: null });
                                }
                            });
                        }
                    }
                });
            });

            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        }

        function initImages() {
            if (isHomepage() && isHomepageExcluded()) {
                return;
            }

            document.querySelectorAll('img:not(.image-zoom-processed)').forEach(img => {
                processImage(img);
            });

            // 额外处理所有stretched-link
            document.querySelectorAll('a.stretched-link').forEach(link => {
                const img = link.closest('.card')?.querySelector('img.image-zoom-processed');
                if (img && !link.dataset.stretchFixed) {
                    handleStretchedLink(img);
                }
            });
        }

        function startObserver() {
            const observer = new MutationObserver(mutations => {
                if (!isEnabled) return;
                if (isHomepage() && isHomepageExcluded()) return;

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG' && !node.classList.contains('image-zoom-processed')) {
                                processImage(node);
                            }
                            // 如果新增的是链接且包含图片
                            else if (node.tagName === 'A' && node.classList.contains('stretched-link')) {
                                const img = node.closest('.card')?.querySelector('img.image-zoom-processed');
                                if (img) handleStretchedLink(img);
                            }
                            else if (node.tagName === 'A' && node.querySelector('img')) {
                                const img = node.querySelector('img');
                                if (img && !img.classList.contains('image-zoom-processed')) {
                                    processImage(img);
                                }
                            }
                            else if (node.querySelectorAll) {
                                node.querySelectorAll('img:not(.image-zoom-processed)').forEach(img => {
                                    processImage(img);
                                });
                                // 检查新增元素内的链接
                                node.querySelectorAll('a.stretched-link').forEach(link => {
                                    const img = link.closest('.card')?.querySelector('img.image-zoom-processed');
                                    if (img) handleStretchedLink(img);
                                });
                            }
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        function init() {
            loadConfig();
            loadExcludedHomepages();
            loadState();
            injectStyles();
            toggleButton = createToggleButton();
            createConfigPanel();
            document.addEventListener('wheel', handleWheelMove, { passive: false });
            addKeyboardSupport();
            window.addEventListener('resize', debounce(handleResize, 250));
            setupLightboxObserver();
            if (isEnabled) initImages();
            startObserver();
        }

        return {
            init,
            cleanup
        };
    })();

    // ================================
    // B站音量控制模块
    // ================================
    const bilibiliVolumeModule = (function() {
        let isEnabled = GM_getValue('bilibili_volume_enabled', true);
        let toast = null;
        let currentFullscreenElement = null;

        function isInFullscreenMode() {
            // 检测原生全屏
            const fullscreenElement = document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement;
            if (fullscreenElement) {
                currentFullscreenElement = fullscreenElement;
                return true;
            }

            // 检测B站网页全屏
            if (document.body.classList.contains('player-mode-webfullscreen')) {
                currentFullscreenElement = document.body;
                return true;
            }

            // 检测B站播放器全屏状态
            const player = document.querySelector('.bpx-player-container');
            if (player && player.classList.contains('state-fullscreen')) {
                currentFullscreenElement = player;
                return true;
            }

            currentFullscreenElement = null;
            return false;
        }

        function findVideoElement() {
            // 在全屏元素中查找视频
            if (currentFullscreenElement) {
                const video = currentFullscreenElement.querySelector('video');
                if (video) return video;
            }

            // 在B站播放器中查找
            const selectors = [
                '.bpx-player-video-area video',
                '.bilibili-player-video video',
                '.bpx-player-container video',
                '#bilibiliPlayer video',
                '.b-player video',
                'video'
            ];

            for (const selector of selectors) {
                const video = document.querySelector(selector);
                if (video) return video;
            }

            return null;
        }

        // 获取音量图标SVG
        function getVolumeIcon(volume) {
            if (volume === 0) {
                return `<svg width="28" height="28" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M64 362.67v298.67h198.33L512 911V113L262.33 362.67H64zM736 512c0-43.56-11.28-83.22-33.83-119-22.56-35.78-52.5-63-89.83-81.67v399c37.33-17.11 67.28-43.55 89.83-79.33C724.72 595.22 736 555.56 736 512zM612.33 75.67v102.67c71.56 21.78 130.67 63.39 177.33 124.83 46.67 61.44 70 131.06 70 208.83 0 77.78-23.33 147.39-70 208.83C743 782.28 683.89 823.89 612.33 845.66v102.67C677.67 932.78 736.78 904 789.67 862s94.5-93.33 124.83-154S960 582 960 512s-15.17-135.33-45.5-196c-30.34-60.67-71.94-112-124.83-154s-112-70.78-177.34-86.33z" fill="currentColor"></path></svg>`;
            } else {
                return `<svg width="28" height="28" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M64 362.67v298.67h198.33L512 911V113L262.33 362.67H64zM736 512c0-43.56-11.28-83.22-33.83-119-22.56-35.78-52.5-63-89.83-81.67v399c37.33-17.11 67.28-43.55 89.83-79.33C724.72 595.22 736 555.56 736 512zM612.33 75.67v102.67c71.56 21.78 130.67 63.39 177.33 124.83 46.67 61.44 70 131.06 70 208.83 0 77.78-23.33 147.39-70 208.83C743 782.28 683.89 823.89 612.33 845.66v102.67C677.67 932.78 736.78 904 789.67 862s94.5-93.33 124.83-154S960 582 960 512s-15.17-135.33-45.5-196c-30.34-60.67-71.94-112-124.83-154s-112-70.78-177.34-86.33z" fill="currentColor"></path></svg>`;
            }
        }

        function showVolumeToast(volume) {
            // 确保toast存在
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'bilibili-volume-toast';
                toast.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 255, 255, 0.9);
                    color: #333;
                    padding: 8px 16px;
                    border-radius: 8px;
                    z-index: 2147483647;
                    font-size: 26px;
                    font-weight: 300;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    border: 1px solid rgba(0,0,0,0.1);
                    min-width: 90px;
                    text-align: center;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                `;
            }

            // 确定父元素
            let parentElement = document.body;
            if (currentFullscreenElement) {
                parentElement = currentFullscreenElement;
            }

            // 确保toast在正确的父元素中
            if (!toast.parentNode || toast.parentNode !== parentElement) {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                parentElement.appendChild(toast);
            }

            // 设置内容
            const percentage = Math.round(volume * 100);
            let displayText;

            if (volume === 0) {
                displayText = '静音';
            } else {
                displayText = percentage + '%';
            }

            // 使用SVG图标
            const iconSVG = getVolumeIcon(volume);
            toast.innerHTML = iconSVG + `<span>${displayText}</span>`;
            toast.style.opacity = '1';

            // 清除之前的定时器
            if (toast.timeoutId) {
                clearTimeout(toast.timeoutId);
            }

            // 2秒后隐藏
            toast.timeoutId = setTimeout(() => {
                if (toast) {
                    toast.style.opacity = '0';
                }
            }, 2000);
        }

        function handleWheel(e) {
            if (!isEnabled) return;

            // 只在全屏模式下处理滚轮事件
            if (!isInFullscreenMode()) {
                return; // 非全屏，让页面正常滚动
            }

            const video = findVideoElement();
            if (!video) return;

            // 阻止事件传播，避免影响页面滚动
            e.stopPropagation();
            e.preventDefault();

            // 每次调整2%音量
            const delta = e.deltaY > 0 ? -0.02 : 0.02;
            const newVolume = Math.max(0, Math.min(1, video.volume + delta));

            video.volume = newVolume;
            video.muted = false; // 调节音量时取消静音

            showVolumeToast(newVolume);
        }

        function handleKeydown(e) {
            if (!isEnabled) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const video = findVideoElement();
            if (!video) return;

            // M键在任何模式下都可以静音
            if (e.code === 'KeyM' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                video.muted = !video.muted;
                showVolumeToast(video.muted ? 0 : video.volume);
            }

            // 上下箭头只在全屏模式下调节音量，每次调整5%
            if ((e.code === 'ArrowUp' || e.code === 'ArrowDown') && isInFullscreenMode()) {
                e.preventDefault();
                e.stopPropagation();
                const delta = e.code === 'ArrowUp' ? 0.05 : -0.05;
                const newVolume = Math.max(0, Math.min(1, video.volume + delta));
                video.volume = newVolume;
                video.muted = false;
                showVolumeToast(newVolume);
            }
        }

        // 监听全屏变化
        function setupFullscreenListener() {
            const events = [
                'fullscreenchange',
                'webkitfullscreenchange',
                'mozfullscreenchange',
                'MSFullscreenChange'
            ];

            events.forEach(event => {
                document.addEventListener(event, () => {
                    isInFullscreenMode(); // 更新全屏状态
                });
            });

            // 监听B站网页全屏的类变化
            const observer = new MutationObserver(() => {
                isInFullscreenMode(); // 更新全屏状态
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        function setEnabled(enabled) {
            isEnabled = enabled;
            GM_setValue('bilibili_volume_enabled', enabled);

            if (enabled) {
                window.addEventListener('wheel', handleWheel, { capture: true, passive: false });
                window.addEventListener('keydown', handleKeydown, { capture: true });
                setupFullscreenListener();
            } else {
                window.removeEventListener('wheel', handleWheel, { capture: true });
                window.removeEventListener('keydown', handleKeydown, { capture: true });
            }
        }

        function init() {
            if (!window.location.hostname.includes('bilibili.com')) {
                return;
            }

            // 初始化全屏状态
            isInFullscreenMode();

            if (isEnabled) {
                window.addEventListener('wheel', handleWheel, { capture: true, passive: false });
                window.addEventListener('keydown', handleKeydown, { capture: true });
                setupFullscreenListener();
            }
        }

        return {
            init,
            setEnabled,
            get isEnabled() { return isEnabled; }
        };
    })();

    // ================================
    // 主初始化函数
    // ================================
    function mainInit() {
        imageZoomModule.init();
        bilibiliVolumeModule.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mainInit);
    } else {
        mainInit();
    }
})();
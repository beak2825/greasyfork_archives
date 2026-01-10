// ==UserScript==
// @name         缩略图改原图_rebuild
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  优化图片查看体验
// @author       ichiinn
// @license      MIT
// @match        http://*/*.jpg*
// @match        http://*/*.png*
// @match        http://*/*.gif*
// @match        http://*/*.webp*
// @match        https://*/*.jpg*
// @match        https://*/*.png*
// @match        https://*/*.gif*
// @match        https://*/*.webp*
// @match        file:///*/*.jpg*
// @match        file:///*/*.png*
// @match        file:///*/*.gif*
// @match        file:///*/*.webp*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562137/%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%94%B9%E5%8E%9F%E5%9B%BE_rebuild.user.js
// @updateURL https://update.greasyfork.org/scripts/562137/%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%94%B9%E5%8E%9F%E5%9B%BE_rebuild.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置区域 ==========
    const CONFIG = {
        // 缩放配置
        zoom: {
            min: 5,        // 最小缩放比例（%）
            max: 1500,     // 最大缩放比例（%）
            wheelStep: 25, // 滚轮一次滚动倍率（%）
            default: 100   // 默认缩放比例（%）
        },
        // 旋转配置
        rotation: {
            min: -360,     // 最小旋转角度
            max: 360,      // 最大旋转角度
            step: 1,       // 旋转步长
            default: 0     // 默认旋转角度
        }
    };

    // 裁剪url
    function cutUrl(){
        let url = window.location.href
        let parts = url.split('@')
        if(parts.length >= 2) window.location.href = parts[0]
    }

    // 创建统一风格的按钮
    function createControlButton(text, color) {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.style.cssText = `
          position: relative;
          z-index: 9999;
          padding: 10px 15px;
          background: ${color};
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 10px;
          display: block;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;

        // 添加悬停动效
        btn.addEventListener('mouseover',()=> {btn.style.transform = 'scale(1.05)'})
        btn.addEventListener('mouseout',()=> {btn.style.transform = 'none'})
        return btn;
    }

    // 获取或初始化图片状态
    function getImageState(img) {
        return {
            rotate: parseInt(img.dataset.rotate) || 0,
            flipX: img.dataset.flipX === 'true' || false,
            flipY: img.dataset.flipY === 'true' || false,
            scale: parseFloat(img.dataset.scale) || 1,
            translateX: parseFloat(img.dataset.translateX) || 0,
            translateY: parseFloat(img.dataset.translateY) || 0
        };
    }

    // 应用图片变换
    function applyTransformation(img) {
        const state = getImageState(img);

        // 检查是否需要复位位置
        if (state.scale <= 1) {
            img.dataset.translateX = 0;
            img.dataset.translateY = 0;
            state.translateX = 0;
            state.translateY = 0;
        }

        // 构建变换字符串（注意变换顺序）
        const transforms = [];
        if (state.rotate !== 0) transforms.push(`rotate(${state.rotate}deg)`);
        if (state.flipX) transforms.push(`scaleX(-1)`);
        if (state.flipY) transforms.push(`scaleY(-1)`);
        transforms.push(`scale(${state.scale})`);
        transforms.push(`translate(${state.translateX}px, ${state.translateY}px)`);

        img.style.transform = transforms.join(' ');
    }

    // 按钮功能定义
    const buttonConfigs = [
        {
            text: '↻ 顺时针',
            color: '#2196F3',
            action: (img, updateRotationDisplay) => {
                const state = getImageState(img);
                state.rotate = (state.rotate + 90) % 360;
                img.dataset.rotate = state.rotate;
                updateRotationDisplay(state.rotate);
            }
        },
        {
            text: '↺ 逆时针',
            color: '#4CAF50',
            action: (img, updateRotationDisplay) => {
                const state = getImageState(img);
                state.rotate = (state.rotate - 90 + 360) % 360;
                img.dataset.rotate = state.rotate;
                updateRotationDisplay(state.rotate);
            }
        },
        {
            text: '↔ 水平翻转',
            color: '#FF9800',
            action: (img) => {
                img.dataset.flipX = !(img.dataset.flipX === 'true');
                img.dataset.flipY = img.dataset.flipX === 'true' ? 'false' : img.dataset.flipY;
            }
        },
        {
            text: '↕ 垂直翻转',
            color: '#9C27B0',
            action: (img) => {
                img.dataset.flipY = !(img.dataset.flipY === 'true');
                img.dataset.flipX = img.dataset.flipY === 'true' ? 'false' : img.dataset.flipX;
            }
        }
    ];

    // 创建收纳盒
    function createToolbox() {
        const toolbox = document.createElement('div');
        toolbox.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 9999;
            font-size: 12px;
        `;

        // 收纳状态UI - 完全独立的UI
        const compactUI = document.createElement('div');
        compactUI.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 4px;
            padding: 4px 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            user-select: none;
            height: 24px;
        `;

        const icon = document.createElement('span');
        icon.textContent = '📐';
        icon.style.cssText = `
            font-size: 14px;
        `;

        const zoomCompact = document.createElement('span');
        zoomCompact.textContent = '100%';
        zoomCompact.style.cssText = `
            cursor: ns-resize;
            padding: 2px 4px;
            border-radius: 2px;
            background: rgba(0,0,0,0.05);
            transition: background 0.2s;
            min-width: 32px;
            text-align: center;
            font-size: 11px;
        `;

        const rotationCompact = document.createElement('span');
        rotationCompact.textContent = '0°';
        rotationCompact.style.cssText = `
            cursor: ew-resize;
            padding: 2px 4px;
            border-radius: 2px;
            background: rgba(0,0,0,0.05);
            transition: background 0.2s;
            min-width: 28px;
            text-align: center;
            font-size: 11px;
        `;

        compactUI.appendChild(icon);
        compactUI.appendChild(zoomCompact);
        compactUI.appendChild(rotationCompact);

        // 展开状态UI - 完全独立的UI
        const expandedUI = document.createElement('div');
        expandedUI.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 10px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            min-width: 180px;
        `;

        // 在展开UI顶部添加紧凑显示栏
        const expandedCompactBar = document.createElement('div');
        expandedCompactBar.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            padding: 4px 6px;
            cursor: pointer;
            user-select: none;
            height: 24px;
            margin-bottom: 10px;
        `;

        const expandedIcon = document.createElement('span');
        expandedIcon.textContent = '📐';
        expandedIcon.style.cssText = `
            font-size: 14px;
            cursor: pointer;
        `;

        const expandedZoomCompact = document.createElement('span');
        expandedZoomCompact.textContent = '100%';
        expandedZoomCompact.style.cssText = `
            cursor: ns-resize;
            padding: 2px 4px;
            border-radius: 2px;
            background: rgba(0,0,0,0.05);
            transition: background 0.2s;
            min-width: 32px;
            text-align: center;
            font-size: 11px;
        `;

        const expandedRotationCompact = document.createElement('span');
        expandedRotationCompact.textContent = '0°';
        expandedRotationCompact.style.cssText = `
            cursor: ew-resize;
            padding: 2px 4px;
            border-radius: 2px;
            background: rgba(0,0,0,0.05);
            transition: background 0.2s;
            min-width: 28px;
            text-align: center;
            font-size: 11px;
        `;

        expandedCompactBar.appendChild(expandedIcon);
        expandedCompactBar.appendChild(expandedZoomCompact);
        expandedCompactBar.appendChild(expandedRotationCompact);

        // 缩放控制
        const zoomContainer = document.createElement('div');
        zoomContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const zoomLabel = document.createElement('span');
        zoomLabel.textContent = '缩放:';
        zoomLabel.style.cssText = `
            font-size: 12px;
            color: #666;
            min-width: 35px;
        `;

        const zoomSlider = document.createElement('input');
        zoomSlider.type = 'range';
        zoomSlider.min = CONFIG.zoom.min;
        zoomSlider.max = CONFIG.zoom.max;
        zoomSlider.value = CONFIG.zoom.default;
        zoomSlider.step = 1;
        zoomSlider.style.cssText = `
            flex: 1;
            height: 4px;
            border-radius: 2px;
            background: #ddd;
            outline: none;
            margin: 0;
        `;

        // 缩放数值输入框（替换原span）
        const zoomInput = document.createElement('input');
        zoomInput.type = 'text';
        zoomInput.value = '100';
        zoomInput.style.cssText = `
            font-size: 12px;
            color: #666;
            width: 40px;
            text-align: right;
            padding: 2px 4px;
            border: 1px solid #ddd;
            border-radius: 3px;
        `;
        // 添加单位显示
        const zoomUnit = document.createElement('span');
        zoomUnit.textContent = '%';
        zoomUnit.style.cssText = 'font-size: 12px; color: #666; margin-left: 2px;';

        zoomContainer.appendChild(zoomLabel);
        zoomContainer.appendChild(zoomSlider);
        zoomContainer.appendChild(zoomInput);
        zoomContainer.appendChild(zoomUnit);

        // 旋转控制
        const rotationContainer = document.createElement('div');
        rotationContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const rotationLabel = document.createElement('span');
        rotationLabel.textContent = '旋转:';
        rotationLabel.style.cssText = `
            font-size: 12px;
            color: #666;
            min-width: 35px;
        `;

        const rotationSlider = document.createElement('input');
        rotationSlider.type = 'range';
        rotationSlider.min = CONFIG.rotation.min;
        rotationSlider.max = CONFIG.rotation.max;
        rotationSlider.value = CONFIG.rotation.default;
        rotationSlider.step = CONFIG.rotation.step;
        rotationSlider.style.cssText = `
            flex: 1;
            height: 4px;
            border-radius: 2px;
            background: #ddd;
            outline: none;
            margin: 0;
        `;

        // 旋转数值输入框（替换原span）
        const rotationInput = document.createElement('input');
        rotationInput.type = 'text';
        rotationInput.value = '0';
        rotationInput.style.cssText = `
            font-size: 12px;
            color: #666;
            width: 40px;
            text-align: right;
            padding: 2px 4px;
            border: 1px solid #ddd;
            border-radius: 3px;
        `;
        // 添加单位显示
        const rotationUnit = document.createElement('span');
        rotationUnit.textContent = '°';
        rotationUnit.style.cssText = 'font-size: 12px; color: #666; margin-left: 2px;';

        rotationContainer.appendChild(rotationLabel);
        rotationContainer.appendChild(rotationSlider);
        rotationContainer.appendChild(rotationInput);
        rotationContainer.appendChild(rotationUnit);

        // 功能按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-top: 5px;
        `;

        // 数值验证与限制函数
        const clampValue = (value, min, max) => {
            return Math.min(Math.max(parseFloat(value) || 0, min), max);
        };

        // 创建所有功能按钮
        const updateRotationDisplay = (value) => {
            const clamped = clampValue(value, CONFIG.rotation.min, CONFIG.rotation.max);
            rotationSlider.value = clamped;
            rotationInput.value = Math.round(clamped); // 输入框显示整数
            rotationCompact.textContent = `${Math.round(clamped)}°`;
            expandedRotationCompact.textContent = `${Math.round(clamped)}°`;

            // 更新图片状态
            const img = document.querySelector('img');
            if (img) {
                img.dataset.rotate = clamped;
                applyTransformation(img);
            }
        };

        const updateZoomDisplay = (value) => {
            const clamped = clampValue(value, CONFIG.zoom.min, CONFIG.zoom.max);
            zoomSlider.value = clamped;
            zoomInput.value = Math.round(clamped); // 输入框显示整数
            zoomCompact.textContent = `${Math.round(clamped)}%`;
            expandedZoomCompact.textContent = `${Math.round(clamped)}%`;

            // 更新图片状态
            const img = document.querySelector('img');
            if (img) {
                img.dataset.scale = clamped / 100;
                applyTransformation(img);
            }
        };

        // 缩放输入框事件处理
        const handleZoomInput = () => {
            // 移除所有非数字字符（允许负号和小数点）
            const cleanValue = zoomInput.value.replace(/[^\d.-]/g, '');
            updateZoomDisplay(cleanValue);
        };

        zoomInput.addEventListener('keydown', (e) => {
            // 回车键确认输入
            if (e.key === 'Enter') {
                handleZoomInput();
                zoomInput.blur(); // 失去焦点
            }
            // ESC键重置
            if (e.key === 'Escape') {
                zoomInput.value = zoomSlider.value;
                zoomInput.blur();
            }
        });
        zoomInput.addEventListener('blur', handleZoomInput);

        // 旋转输入框事件处理
        const handleRotationInput = () => {
            // 移除所有非数字字符（允许负号和小数点）
            const cleanValue = rotationInput.value.replace(/[^\d.-]/g, '');
            updateRotationDisplay(cleanValue);
        };

        rotationInput.addEventListener('keydown', (e) => {
            // 回车键确认输入
            if (e.key === 'Enter') {
                handleRotationInput();
                rotationInput.blur(); // 失去焦点
            }
            // ESC键重置
            if (e.key === 'Escape') {
                rotationInput.value = rotationSlider.value;
                rotationInput.blur();
            }
        });
        rotationInput.addEventListener('blur', handleRotationInput);

        buttonConfigs.forEach(config => {
            const btn = createControlButton(config.text, config.color);
            btn.style.marginBottom = '0';
            btn.style.padding = '6px 8px';
            btn.style.fontSize = '10px';

            btn.addEventListener('click', () => {
                const img = document.querySelector('img');
                if (!img) return;

                config.action(img, updateRotationDisplay);
                applyTransformation(img);
            });
            buttonsContainer.appendChild(btn);
        });

        // 滑块事件
        zoomSlider.addEventListener('input', (e) => {
            updateZoomDisplay(e.target.value);
        });

        rotationSlider.addEventListener('input', (e) => {
            updateRotationDisplay(e.target.value);
        });

        expandedUI.appendChild(expandedCompactBar);
        expandedUI.appendChild(zoomContainer);
        expandedUI.appendChild(rotationContainer);
        expandedUI.appendChild(buttonsContainer);

        toolbox.appendChild(compactUI);
        toolbox.appendChild(expandedUI);

        // 展开/收起功能
        let isExpanded = false;

        const toggleExpanded = () => {
            isExpanded = !isExpanded;
            if (isExpanded) {
                compactUI.style.display = 'none';
                expandedUI.style.display = 'flex';
            } else {
                compactUI.style.display = 'flex';
                expandedUI.style.display = 'none';
            }
        };

        compactUI.addEventListener('click', (e) => {
            // 只有点击图标区域才触发展开/收起
            if (e.target === icon) {
                toggleExpanded();
            }
        });

        expandedIcon.addEventListener('click', () => {
            toggleExpanded();
        });

        // 紧凑显示区域的拖拽调整功能
        let isDraggingCompact = false;
        let dragStartValue = 0;
        let dragStartX = 0;
        let dragType = ''; // 'zoom' or 'rotation'

        const startDrag = (e, type) => {
            e.preventDefault();
            e.stopPropagation();
            isDraggingCompact = true;
            dragType = type;
            dragStartX = e.clientX || e.touches[0].clientX;

            const img = document.querySelector('img');
            if (img) {
                const state = getImageState(img);
                dragStartValue = type === 'zoom' ? state.scale * 100 : state.rotate;
            }

            document.addEventListener('mousemove', handleCompactDrag);
            document.addEventListener('mouseup', stopCompactDrag);
            document.addEventListener('touchmove', handleCompactDrag, { passive: false });
            document.addEventListener('touchend', stopCompactDrag);
        };

        const handleCompactDrag = (e) => {
            if (!isDraggingCompact) return;

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (!clientX) return;

            const deltaX = clientX - dragStartX;
            let newValue;

            if (dragType === 'zoom') {
                newValue = Math.min(Math.max(dragStartValue + deltaX * 0.5, CONFIG.zoom.min), CONFIG.zoom.max);
                updateZoomDisplay(newValue);
            } else {
                newValue = Math.min(Math.max(dragStartValue + deltaX, CONFIG.rotation.min), CONFIG.rotation.max);
                updateRotationDisplay(newValue);
            }
        };

        const stopCompactDrag = () => {
            isDraggingCompact = false;
            document.removeEventListener('mousemove', handleCompactDrag);
            document.removeEventListener('mouseup', stopCompactDrag);
            document.removeEventListener('touchmove', handleCompactDrag);
            document.removeEventListener('touchend', stopCompactDrag);
        };

        // 双击重置功能
        const resetValue = (type) => {
            if (type === 'zoom') {
                updateZoomDisplay(CONFIG.zoom.default);
            } else {
                updateRotationDisplay(CONFIG.rotation.default);
            }
        };

        // 为紧凑UI和展开UI的紧凑栏都添加事件
        [zoomCompact, expandedZoomCompact].forEach(element => {
            element.addEventListener('mousedown', (e) => startDrag(e, 'zoom'));
            element.addEventListener('touchstart', (e) => startDrag(e, 'zoom'));
            element.addEventListener('dblclick', () => resetValue('zoom'));
        });

        [rotationCompact, expandedRotationCompact].forEach(element => {
            element.addEventListener('mousedown', (e) => startDrag(e, 'rotation'));
            element.addEventListener('touchstart', (e) => startDrag(e, 'rotation'));
            element.addEventListener('dblclick', () => resetValue('rotation'));
        });

        // 悬停效果
        [zoomCompact, rotationCompact, expandedZoomCompact, expandedRotationCompact].forEach(element => {
            element.addEventListener('mouseover', () => {
                element.style.background = 'rgba(0,0,0,0.1)';
            });
            element.addEventListener('mouseout', () => {
                element.style.background = 'rgba(0,0,0,0.05)';
            });
        });

        // 存储引用
        toolbox.updateRotationDisplay = updateRotationDisplay;
        toolbox.updateZoomDisplay = updateZoomDisplay;
        toolbox.zoomSlider = zoomSlider;
        toolbox.rotationSlider = rotationSlider;

        return toolbox;
    }

    // 完全禁用浏览器默认的图片行为
    function disableImageDefaultBehavior(img) {
        // 阻止图片的所有点击行为（保留，禁用单击放大）
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target === img) {
                e.stopImmediatePropagation();
            }
            return false;
        }, true);

        // 阻止图片的拖拽行为（保留，避免误拖拽图片）
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        }, true);

        // 阻止双击选择文本（保留，优化体验）
        img.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        }, true);

        // 阻止双击默认行为（保留，禁用双击放大）
        img.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        // 覆盖默认鼠标样式，移除放大镜图标（保留，避免误导）
        img.style.cursor = 'default';
    }

    // 初始化拖拽功能 - 考虑缩放倍率、旋转和翻转
    // 初始化拖拽功能 - 考虑缩放倍率、旋转和翻转（已修复Edge右键手势问题）
    function initDrag(img) {
        let isDragging = false;
        let startX, startY;
        let initialTranslateX, initialTranslateY;

        // 创建覆盖整个页面的透明层用于拖拽
        const dragOverlay = document.createElement('div');
        dragOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9998;
        cursor: grab;
        display: none;
    `;

        // 只在图片被缩放时启用覆盖层功能
        function updateOverlayState() {
            const state = getImageState(img);
            if (state.scale > 1) {
                dragOverlay.style.display = 'block';
                dragOverlay.style.pointerEvents = 'auto';
                dragOverlay.style.cursor = 'grab';
            } else {
                dragOverlay.style.display = 'none';
                dragOverlay.style.pointerEvents = 'none';
            }
        }

        // 初始状态
        updateOverlayState();

        // 在应用变换时更新覆盖层状态
        const originalApplyTransformation = applyTransformation;
        applyTransformation = function(img) {
            originalApplyTransformation(img);
            updateOverlayState();
        };

        document.body.appendChild(dragOverlay);

        // 计算旋转和翻转后的移动矢量
        function calculateTransformedMovement(deltaX, deltaY, state) {
            // 将角度转换为弧度
            const angle = state.rotate * Math.PI / 180;

            // 计算旋转矩阵
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            // 应用旋转（考虑旋转方向）
            let transformedX = deltaX * cosA + deltaY * sinA;
            let transformedY = -deltaX * sinA + deltaY * cosA;

            // 应用翻转
            if (state.flipX) transformedX = -transformedX;
            if (state.flipY) transformedY = -transformedY;

            return { x: transformedX, y: transformedY };
        }

        const startDrag = (e) => {
            // 【仅响应左键（e.button === 0 是左键），排除右键触发】
            if (e.button !== 0) return;

            const state = getImageState(img);
            if (state.scale > 1) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialTranslateX = state.translateX;
                initialTranslateY = state.translateY;
                dragOverlay.style.cursor = 'grabbing';
                img.style.cursor = 'grabbing';
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const state = getImageState(img);
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 考虑旋转和翻转的移动矢量
            const transformed = calculateTransformedMovement(deltaX, deltaY, state);

            // 考虑缩放倍率 - 缩放越大，移动速度越慢
            const scaleFactor = 1 / state.scale;

            img.dataset.translateX = initialTranslateX + transformed.x * scaleFactor;
            img.dataset.translateY = initialTranslateY + transformed.y * scaleFactor;
            applyTransformation(img);

            e.preventDefault();
            e.stopPropagation();
        };

        const stopDrag = () => {
            // 【强制重置拖拽状态，避免浏览器手势导致的残留】
            if (isDragging) {
                isDragging = false;
                dragOverlay.style.cursor = 'grab';
                img.style.cursor = 'grab';
            }
        };

        // 图片和覆盖层都可以触发拖拽（仅左键有效）
        img.addEventListener('mousedown', startDrag);
        dragOverlay.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', handleMouseMove);
        // 多个事件入口确保状态重置
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('mouseleave', stopDrag);
        // 【右键松开时也强制重置（应对Edge手势取消场景）】
        document.addEventListener('contextmenu', stopDrag);

        // 触摸屏支持（不影响鼠标逻辑）
        let touchStartX, touchStartY;
        let initialTouchTranslateX, initialTouchTranslateY;

        const startTouchDrag = (e) => {
            if (e.touches.length === 1) {
                const state = getImageState(img);
                if (state.scale > 1) {
                    isDragging = true;
                    const touch = e.touches[0];
                    touchStartX = touch.clientX;
                    touchStartY = touch.clientY;
                    initialTouchTranslateX = state.translateX;
                    initialTouchTranslateY = state.translateY;
                    e.preventDefault();
                }
            }
        };

        const handleTouchMove = (e) => {
            if (!isDragging || e.touches.length !== 1) return;

            const touch = e.touches[0];
            const state = getImageState(img);
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            // 考虑旋转和翻转的移动矢量
            const transformed = calculateTransformedMovement(deltaX, deltaY, state);

            // 考虑缩放倍率 - 缩放越大，移动速度越慢
            const scaleFactor = 1 / state.scale;

            img.dataset.translateX = initialTouchTranslateX + transformed.x * scaleFactor;
            img.dataset.translateY = initialTouchTranslateY + transformed.y * scaleFactor;
            applyTransformation(img);

            e.preventDefault();
        };

        img.addEventListener('touchstart', startTouchDrag);
        dragOverlay.addEventListener('touchstart', startTouchDrag);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    // 初始化滚轮缩放 - 在整个页面生效
    function initWheelZoom(img, updateZoomDisplay) {
        const handleWheel = (e) => {
            const state = getImageState(img);

            e.preventDefault();
            e.stopPropagation();

            const delta = e.deltaY > 0 ? -CONFIG.zoom.wheelStep : CONFIG.zoom.wheelStep;
            const newScale = Math.min(Math.max(state.scale * 100 + delta, CONFIG.zoom.min), CONFIG.zoom.max);

            updateZoomDisplay(newScale);
        };

        // 在整个文档上监听滚轮事件
        document.addEventListener('wheel', handleWheel, { passive: false });
    }

    // 完全禁用页面滚动和默认行为
    function disablePageScroll() {
        // 禁用页面滚动
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // 阻止所有键盘事件
        document.addEventListener('keydown', (e) => {
            // 阻止空格键、方向键等导致的页面滚动
            if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });

        // 阻止触摸滚动
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // 阻止页面缩放
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });
        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }

    // 增强的浏览器默认图片查看器禁用
    function disableBrowserImageViewer() {
        // 在document级别捕获并阻止所有点击事件
        document.addEventListener('click', (e) => {
            // 检查事件目标是否是图片或者在图片上
            const img = e.target.closest('img');
            if (img) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        }, true);

        // 改变图片的鼠标样式，彻底移除放大镜图标
        document.addEventListener('mouseover', (e) => {
            const img = e.target.closest('img');
            if (img) {
                img.style.cursor = 'default';
            }
        }, true);
    }

    function init() {
        cutUrl();

        // 先禁用浏览器图片查看器功能
        disableBrowserImageViewer();

        const toolbox = createToolbox();
        document.body.appendChild(toolbox);

        // 初始化图片
        const img = document.querySelector('img');
        if (img) {
            img.style.cssText = `
                max-width: 100%;
                height: auto;
                object-fit: contain;
                margin: auto;
                display: block;
                cursor: default;
                //transition: transform 0.1s ease;
                transform-origin: center center;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                pointer-events: auto;
            `;

            // 初始化图片状态
            img.dataset.rotate = CONFIG.rotation.default.toString();
            img.dataset.flipX = 'false';
            img.dataset.flipY = 'false';
            img.dataset.scale = (CONFIG.zoom.default / 100).toString();
            img.dataset.translateX = '0';
            img.dataset.translateY = '0';

            // 禁用浏览器默认行为
            disableImageDefaultBehavior(img);

            // 初始化功能
            initDrag(img);
            initWheelZoom(img, toolbox.updateZoomDisplay);
        }

        // 禁用页面滚动
        disablePageScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         e621 图片智能缩放
// @namespace    Lecrp.com
// @version      2.1
// @description  自动将e621图片等比例放大缩小，支持配置参数，中键点击切换原图
// @author       jcjyids
// @match        https://e621.net/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @license      GPL-3.0-or-later
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554345/e621%20%E5%9B%BE%E7%89%87%E6%99%BA%E8%83%BD%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/554345/e621%20%E5%9B%BE%E7%89%87%E6%99%BA%E8%83%BD%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置默认值
    const DEFAULT_CONFIG = {
        enabled: true,
        maxScale: 3.0,                    // 最大缩放倍数 3.0 (300%)
        maxWidthPercent: 100,
        maxHeightPercent: 89,             // 最大高度百分比 89%
        margin: 0,                        // 边距 0像素
        originalUpscale: false,
        ultraTallAspectRatio: 3.0,        // 长图宽高比阈值 (1.5-10.0)
        ultraTallMaxWidthPercent: 50      // 长图最大宽度百分比 (10-100)
    };

    // 状态管理
    let state = {
        ...DEFAULT_CONFIG,
        currentEnabled: true
    };

    // 初始化配置
    function initConfig() {
        const savedEnabled = GM_getValue('e621_upscale_enabled', DEFAULT_CONFIG.enabled);
        const savedMaxScale = GM_getValue('e621_upscale_maxScale', DEFAULT_CONFIG.maxScale);
        const savedMaxWidthPercent = GM_getValue('e621_upscale_maxWidthPercent', DEFAULT_CONFIG.maxWidthPercent);
        const savedMaxHeightPercent = GM_getValue('e621_upscale_maxHeightPercent', DEFAULT_CONFIG.maxHeightPercent);
        const savedMargin = GM_getValue('e621_upscale_margin', DEFAULT_CONFIG.margin);
        const savedOriginalUpscale = GM_getValue('e621_upscale_originalUpscale', DEFAULT_CONFIG.originalUpscale);
        const savedUltraTallAspectRatio = GM_getValue('e621_upscale_ultraTallAspectRatio', DEFAULT_CONFIG.ultraTallAspectRatio);
        const savedUltraTallMaxWidthPercent = GM_getValue('e621_upscale_ultraTallMaxWidthPercent', DEFAULT_CONFIG.ultraTallMaxWidthPercent);

        state.enabled = savedEnabled;
        state.maxScale = savedMaxScale;
        state.maxWidthPercent = savedMaxWidthPercent;
        state.maxHeightPercent = savedMaxHeightPercent;
        state.margin = savedMargin;
        state.originalUpscale = savedOriginalUpscale;
        state.ultraTallAspectRatio = savedUltraTallAspectRatio;
        state.ultraTallMaxWidthPercent = savedUltraTallMaxWidthPercent;

        setTimeout(() => {
            const selector = document.getElementById('image-resize-selector');
            if (selector) {
                handleModeChange(selector.value);
            }
        }, 0);

    }

    // 保存配置到存储
    function saveConfig() {
        GM_setValue('e621_upscale_enabled', state.enabled);
        GM_setValue('e621_upscale_maxScale', state.maxScale);
        GM_setValue('e621_upscale_maxWidthPercent', state.maxWidthPercent);
        GM_setValue('e621_upscale_maxHeightPercent', state.maxHeightPercent);
        GM_setValue('e621_upscale_margin', state.margin);
        GM_setValue('e621_upscale_originalUpscale', state.originalUpscale);
        GM_setValue('e621_upscale_ultraTallAspectRatio', state.ultraTallAspectRatio);
        GM_setValue('e621_upscale_ultraTallMaxWidthPercent', state.ultraTallMaxWidthPercent);
    }

    // 创建CSS样式
    function addStyles() {
        const css = `
            .upscale-toggle-btn {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .upscale-toggle-btn.enabled {
                color: #4CAF50;
            }

            .upscale-toggle-btn.disabled {
                color: #f44336;
            }

            .upscale-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2b2b2b;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 15px;
                width: 320px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }

            .setting-item {
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid #444;
            }

            .setting-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }

            .setting-line {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }

            .setting-label {
                color: #ddd;
                font-size: 14px;
            }

            .setting-input {
                background: #1a1a1a;
                border: 1px solid #444;
                border-radius: 3px;
                color: #ddd;
                padding: 4px 8px;
                width: 50px;
            }

            .setting-input:focus {
                border-color: #6b8cff;
                outline: none;
            }

            .setting-input.invalid {
                border-color: #f44336;
            }

            .setting-description {
                color: #999;
                font-size: 12px;
                line-height: 1.3;
            }

            .setting-actions {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid #444;
            }

            .setting-btn {
                background: #444;
                border: none;
                border-radius: 3px;
                color: #ddd;
                cursor: pointer;
                padding: 6px 12px;
                font-size: 13px;
            }

            .setting-btn:hover {
                background: #555;
            }

            .setting-btn.primary {
                background: #4CAF50;
            }

            .setting-btn.primary:hover {
                background: #45a049;
            }

            .setting-input[type="checkbox"] {
            transform: scale(2);
            transform-origin: center top;
            margin-right: 8px;
            }

            .confirm-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20000;
            }

            .confirm-content {
                background: #2b2b2b;
                border-radius: 4px;
                padding: 20px;
                width: 300px;
                text-align: center;
            }

            .confirm-title {
                color: #ddd;
                font-size: 16px;
                margin-bottom: 10px;
            }

            .confirm-message {
                color: #aaa;
                font-size: 14px;
                margin-bottom: 20px;
            }

            .confirm-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
            }

            .hidden {
                display: none !important;
            }
        `;

        GM_addStyle(css);
    }

    // 创建切换按钮
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'st-button kinetic upscale-toggle-btn';
        toggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" name="fullscreen">
            <path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect width="10" height="8" x="7" y="8" rx="1"></rect>
            </svg>
        `;
        toggleBtn.title = '图片缩放开关';

        // 更新按钮状态
        function updateButtonState() {
            if (state.currentEnabled) {
                toggleBtn.classList.add('enabled');
                toggleBtn.classList.remove('disabled');
            } else {
                toggleBtn.classList.add('disabled');
                toggleBtn.classList.remove('enabled');
            }
        }

        // 切换状态
        toggleBtn.addEventListener('click', handleToggleClick);

        updateButtonState();

        // 插入到全屏按钮右侧
        const fullscreenDiv = document.querySelector('.ptbr-fullscreen');
        if (fullscreenDiv) {
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'ptbr-upscale-toggle';
            toggleDiv.appendChild(toggleBtn);
            fullscreenDiv.parentNode.insertBefore(toggleDiv, fullscreenDiv.nextSibling);
        }

        return toggleBtn;
    }

    // 修复原图模式缺少 fit-window 类的问题
    function fixOriginalModeClass() {
        try {
            const selector = document.getElementById('image-resize-selector');
            const media = getMediaElement();

            if (!selector || !media) {
                setTimeout(fixOriginalModeClass, 100); // 重试
                return;
            }

            const currentMode = selector.value;
            const isOriginalMode = currentMode === 'original';

            if (isOriginalMode) {
                if (state.currentEnabled) {
                    // 原图模式且缩放启用：确保有 fit-window 类
                    if (!media.element.classList.contains('fit-window')) {
                        media.element.classList.add('fit-window');
                    }
                } else {
                    // 原图模式且缩放禁用：确保没有 fit-window 类
                    if (media.element.classList.contains('fit-window')) {
                        media.element.classList.remove('fit-window');
                    }
                }
            }
            // 其他模式由网站自动管理，我们不干预
        } catch (error) {
            console.error('修复原图模式类时出错:', error);
        }
    }

    // 处理切换按钮点击
    function handleToggleClick() {
        const selector = document.getElementById('image-resize-selector');
        const currentMode = selector ? selector.value : '';
        const isAutoMode = ['original', 'fit', 'fitv'].includes(currentMode);

        if (isAutoMode) {
            // 自动模式下：临时切换，不保存
            state.currentEnabled = !state.currentEnabled;
        } else {
            // 其他模式下：切换并保存
            state.enabled = !state.enabled;
            state.currentEnabled = state.enabled;
            GM_setValue('e621_upscale_enabled', state.enabled);
        }

        // 更新按钮状态
        const toggleBtn = document.querySelector('.upscale-toggle-btn');
        if (toggleBtn) {
            if (state.currentEnabled) {
                toggleBtn.classList.add('enabled');
                toggleBtn.classList.remove('disabled');
            } else {
                toggleBtn.classList.add('disabled');
                toggleBtn.classList.remove('enabled');
            }
        }

        // 修复原图模式的类问题，然后应用缩放
        fixOriginalModeClass();
        applyScalingToMedia();
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'upscale-settings-panel hidden';

        // 最大缩放倍数
        const maxScaleItem = createSettingItem(
            '最大缩放倍数',
            'number',
            state.maxScale,
            { min: 0.5, max: 5.0, step: 0.1 },
            '允许的最大放大倍数 (0.5-5.0，3.0=300%)'
        );

        // 最大宽度百分比
        const maxWidthPercentItem = createSettingItem(
            '最大宽度百分比',
            'number',
            state.maxWidthPercent,
            { min: 10, max: 100, step: 5 },
            '相对于容器宽度的最大百分比 (10-100)'
        );

        // 最大高度百分比
        const maxHeightPercentItem = createSettingItem(
            '最大高度百分比',
            'number',
            state.maxHeightPercent,
            { min: 0, max: 100, step: 1 },
            '相对于视口高度的最大百分比 (0-100，0=不限制)'
        );

        // 边距设置
        const marginItem = createSettingItem(
            '左右边距',
            'number',
            state.margin,
            { min: 0, max: 100, step: 5 },
            '图片与容器边缘的间距 (像素)'
        );

        // 长图宽高比阈值
        const ultraTallAspectRatioItem = createSettingItem(
            '长图宽高比阈值',
            'number',
            state.ultraTallAspectRatio,
            { min: 1.5, max: 10.0, step: 0.1 },
            '高度超过宽度的此倍数时视为超长图片 (1.5-10.0)'
        );

        // 长图最大宽度
        const ultraTallMaxWidthPercentItem = createSettingItem(
            '长图最大宽度',
            'number',
            state.ultraTallMaxWidthPercent,
            { min: 10, max: 100, step: 5 },
            '超长图片的最大宽度占容器百分比 (10-100)'
        );

        // 原图缩放开关
        const originalUpscaleItem = createSettingItem(
            '原图缩放',
            'checkbox',
            state.originalUpscale,
            {},
            '勾选以在原始/适应模式下默认启用缩放'
        );

        // 操作按钮
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'setting-actions';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'setting-btn';
        resetBtn.textContent = '恢复默认';
        resetBtn.addEventListener('click', showResetConfirmDialog);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'setting-btn primary';
        saveBtn.textContent = '保存';
        saveBtn.addEventListener('click', saveSettings);

        actionsDiv.appendChild(resetBtn);
        actionsDiv.appendChild(saveBtn);

        // 组装面板
        panel.appendChild(maxScaleItem);
        panel.appendChild(maxWidthPercentItem);
        panel.appendChild(maxHeightPercentItem);
        panel.appendChild(marginItem);
        panel.appendChild(ultraTallAspectRatioItem);
        panel.appendChild(ultraTallMaxWidthPercentItem);
        panel.appendChild(originalUpscaleItem);
        panel.appendChild(actionsDiv);

        return panel;
    }

    // 创建单个设置项
    function createSettingItem(label, type, value, attributes, description) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'setting-item';

        const lineDiv = document.createElement('div');
        lineDiv.className = 'setting-line';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'setting-label';
        labelSpan.textContent = label;

        let input;
        if (type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = value;
            input.className = 'setting-input';
        } else {
            input = document.createElement('input');
            input.type = type;
            input.value = value;
            input.className = 'setting-input';

            // 设置属性
            Object.keys(attributes).forEach(attr => {
                input[attr] = attributes[attr];
            });

            // 添加输入验证
            input.addEventListener('input', function() {
                validateInput(this, attributes.min, attributes.max);
            });
        }

        lineDiv.appendChild(labelSpan);
        lineDiv.appendChild(input);
        itemDiv.appendChild(lineDiv);

        if (description) {
            const descDiv = document.createElement('div');
            descDiv.className = 'setting-description';
            descDiv.textContent = description;
            itemDiv.appendChild(descDiv);
        }

        return itemDiv;
    }

    // 输入验证
    function validateInput(input, min, max) {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < min || value > max) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    }

    // 显示重置确认对话框
    function showResetConfirmDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';

        const content = document.createElement('div');
        content.className = 'confirm-content';

        const title = document.createElement('div');
        title.className = 'confirm-title';
        title.textContent = '恢复默认设置';

        const message = document.createElement('div');
        message.className = 'confirm-message';
        message.textContent = '这将重置所有设置为默认值，是否继续？';

        const buttons = document.createElement('div');
        buttons.className = 'confirm-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'setting-btn';
        cancelBtn.textContent = '取消';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'setting-btn primary';
        confirmBtn.textContent = '确认';
        confirmBtn.addEventListener('click', () => {
            resetToDefaults();
            document.body.removeChild(dialog);
            // 关闭设置面板
            const panel = document.querySelector('.upscale-settings-panel');
            if (panel) {
                panel.classList.add('hidden');
            }
        });

        buttons.appendChild(cancelBtn);
        buttons.appendChild(confirmBtn);

        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(buttons);
        dialog.appendChild(content);

        document.body.appendChild(dialog);
    }

    // 重置为默认值
    function resetToDefaults() {
        state.enabled = DEFAULT_CONFIG.enabled;
        state.maxScale = DEFAULT_CONFIG.maxScale;
        state.maxWidthPercent = DEFAULT_CONFIG.maxWidthPercent;
        state.maxHeightPercent = DEFAULT_CONFIG.maxHeightPercent;
        state.margin = DEFAULT_CONFIG.margin;
        state.originalUpscale = DEFAULT_CONFIG.originalUpscale;
        state.ultraTallAspectRatio = DEFAULT_CONFIG.ultraTallAspectRatio;
        state.ultraTallMaxWidthPercent = DEFAULT_CONFIG.ultraTallMaxWidthPercent;

        saveConfig();

        // 更新UI
        updateSettingsPanel();
        applyScalingToMedia();
    }

    // 更新设置面板中的值
    function updateSettingsPanel() {
        const panel = document.querySelector('.upscale-settings-panel');
        if (!panel) return;

        const inputs = panel.querySelectorAll('.setting-input');
        inputs[0].value = state.maxScale; // 最大缩放倍数
        inputs[1].value = state.maxWidthPercent; // 最大宽度百分比
        inputs[2].value = state.maxHeightPercent; // 最大高度百分比
        inputs[3].value = state.margin; // 边距
        inputs[4].value = state.ultraTallAspectRatio; // 长图宽高比阈值
        inputs[5].value = state.ultraTallMaxWidthPercent; // 长图最大宽度
        inputs[6].checked = state.originalUpscale; // 原图缩放
    }

    // 保存设置
    function saveSettings() {
        const panel = document.querySelector('.upscale-settings-panel');
        if (!panel) return;

        const inputs = panel.querySelectorAll('.setting-input');

        // 检查是否有无效输入
        let hasInvalid = false;
        inputs.forEach(input => {
            if (input.type !== 'checkbox' && input.classList.contains('invalid')) {
                hasInvalid = true;
            }
        });

        if (hasInvalid) {
            alert('请修正无效的输入值');
            return;
        }

        // 更新状态
        state.maxScale = parseFloat(inputs[0].value);
        state.maxWidthPercent = parseFloat(inputs[1].value);
        state.maxHeightPercent = parseFloat(inputs[2].value);
        state.margin = parseFloat(inputs[3].value);
        state.ultraTallAspectRatio = parseFloat(inputs[4].value);
        state.ultraTallMaxWidthPercent = parseFloat(inputs[5].value);
        state.originalUpscale = inputs[6].checked;

        // 保存到存储
        saveConfig();

        // 应用更改
        applyScalingToMedia();

        // 关闭面板
        panel.classList.add('hidden');
    }

    // 获取媒体元素
    function getMediaElement() {
        // 等待容器加载
        const container = document.getElementById('image-and-nav');
        if (!container) return null;

        // 检测图片
        const img = container.querySelector('#image[src*=".jpg"], #image[src*=".png"], #image[src*=".gif"]');
        if (img) return { element: img, type: 'image' };

        // 检测视频
        const video = container.querySelector('#image[src*=".mp4"], video#image');
        if (video) return { element: video, type: 'video' };

        return null;
    }

    // 获取媒体原始尺寸
    function getMediaOriginalSize(mediaElement, mediaType) {
        if (mediaType === 'image') {
            // 对于图片，使用自然尺寸
            if (mediaElement.naturalWidth && mediaElement.naturalHeight) {
                return {
                    width: mediaElement.naturalWidth,
                    height: mediaElement.naturalHeight
                };
            }
        } else if (mediaType === 'video') {
            // 对于视频，使用视频尺寸或备用数据
            if (mediaElement.videoWidth && mediaElement.videoHeight) {
                return {
                    width: mediaElement.videoWidth,
                    height: mediaElement.videoHeight
                };
            }
        }

        // 备用方案：从data属性获取
        const container = document.getElementById('image-container');
        if (container) {
            const dataWidth = parseInt(container.getAttribute('data-width'));
            const dataHeight = parseInt(container.getAttribute('data-height'));
            if (!isNaN(dataWidth) && !isNaN(dataHeight)) {
                return { width: dataWidth, height: dataHeight };
            }
        }

        return null;
    }

    // 检测是否为超长图片（基于宽高比）
    function isUltraTallImage(originalWidth, originalHeight, mediaType) {
        // 视频和GIF不参与超长图片匹配
        if (mediaType !== 'image') return false;

        // 检查文件扩展名，排除GIF
        const container = document.getElementById('image-container');
        if (container) {
            const fileExt = container.getAttribute('data-file-ext');
            if (fileExt && fileExt.toLowerCase() === 'gif') return false;
        }

        // 新的判断标准：高度 > 宽度 × 宽高比阈值
        return originalHeight > (originalWidth * state.ultraTallAspectRatio);
    }

    // 计算超长图片缩放尺寸
    function calculateUltraTallScale(originalWidth, originalHeight) {
        const container = document.getElementById('image-and-nav');
        if (!container) return null;

        // 超长图片特殊逻辑：
        // 1. 忽略高度限制
        // 2. 使用长图专用宽度限制
        // 3. 仍然受最大缩放倍数限制

        const maxWidthPx = container.clientWidth * (state.ultraTallMaxWidthPercent / 100) - state.margin * 2;

        const widthScale = maxWidthPx / originalWidth;
        const finalScale = Math.min(widthScale, state.maxScale);

        return {
            width: Math.round(originalWidth * finalScale),
            height: Math.round(originalHeight * finalScale),
            scale: finalScale,
            isUltraTall: true,
            limitingFactor: finalScale === widthScale ? 'ultraTallWidth' : 'maxScale'
        };
    }

    // 计算普通图片缩放尺寸
    function calculateNormalScale(originalWidth, originalHeight) {
        const container = document.getElementById('image-and-nav');
        if (!container) return null;

        // 获取约束参数
        const maxScale = state.maxScale;
        const maxWidthPercent = state.maxWidthPercent / 100;
        const maxHeightPercent = state.maxHeightPercent / 100;
        const margin = state.margin;

        // 计算绝对限制值 - 高度没有边距
        const maxWidthPx = container.clientWidth * maxWidthPercent - margin * 2;
        const maxHeightPx = maxHeightPercent > 0 ? (window.innerHeight * maxHeightPercent) : Infinity;

        // 计算两种约束下的缩放比例
        const widthScale = maxWidthPx / originalWidth;
        const heightScale = maxHeightPx / originalHeight;

        // 判断图片是过小还是过大
        const isSmallImage = widthScale >= 1 && heightScale >= 1;

        let finalScale;
        let operationType;

        if (isSmallImage) {
            // 小图片：放大直到任意一边到达上限
            finalScale = Math.min(widthScale, heightScale, maxScale);
            operationType = 'upscale';
        } else {
            // 大图片：缩小确保两个方向都不超出视口
            finalScale = Math.min(widthScale, heightScale);
            operationType = 'downscale';
        }

        // 计算最终尺寸（取整到像素）
        const finalWidth = Math.round(originalWidth * finalScale);
        const finalHeight = Math.round(originalHeight * finalScale);

        // 确定限制因素
        let limitingFactor = 'maxScale';
        if (finalScale === widthScale) limitingFactor = 'width';
        else if (finalScale === heightScale) limitingFactor = 'height';

        return {
            width: finalWidth,
            height: finalHeight,
            scale: finalScale,
            limitingFactor: limitingFactor,
            operationType: operationType,
            isUltraTall: false
        };
    }

    // 计算智能缩放尺寸
    function calculateSmartScale(originalWidth, originalHeight, mediaType) {
        // 检查是否为超长图片
        if (isUltraTallImage(originalWidth, originalHeight, mediaType)) {
            return calculateUltraTallScale(originalWidth, originalHeight);
        } else {
            return calculateNormalScale(originalWidth, originalHeight);
        }
    }

    // 应用智能缩放到媒体元素
    function applyScalingToMedia() {
        // 先修复原图模式的类问题
        fixOriginalModeClass();

        const media = getMediaElement();
        if (!media) {
            // 如果媒体元素不存在，稍后重试
            setTimeout(applyScalingToMedia, 100);
            return;
        }

        const container = document.getElementById('image-and-nav');
        if (!container) {
            // 如果容器不存在，稍后重试
            setTimeout(applyScalingToMedia, 100);
            return;
        }

        // 检查是否应该应用缩放
        if (!state.currentEnabled) {
            // 重置样式
            media.element.style.width = '';
            media.element.style.height = '';
            media.element.style.maxWidth = '';
            media.element.style.maxHeight = '';
            media.element.style.margin = '';
            media.element.style.display = '';
            media.element.style.objectFit = '';
            return;
        }

        // 获取原始尺寸
        const originalSize = getMediaOriginalSize(media.element, media.type);
        if (!originalSize) {
            // 如果无法获取尺寸，稍后重试
            setTimeout(applyScalingToMedia, 100);
            return;
        }

        // 计算缩放尺寸
        const dimensions = calculateSmartScale(originalSize.width, originalSize.height, media.type);
        if (!dimensions) return;

        // 应用样式
        media.element.style.width = `${dimensions.width}px`;
        media.element.style.height = `${dimensions.height}px`;
        media.element.style.maxWidth = 'none';
        media.element.style.maxHeight = 'none';
        media.element.style.margin = 'auto';
        media.element.style.display = 'block';

        if (media.type === 'image') {
            media.element.style.objectFit = 'contain';
        }

        const operationType = dimensions.isUltraTall ? 'ultraTall' : dimensions.operationType;
    }

    // 处理模式变化
    function handleModeChange(selectorValue) {
        const isAutoMode = ['original', 'fit', 'fitv'].includes(selectorValue);

        if (isAutoMode) {
            // 自动模式：使用originalUpscale设置，不记忆手动状态
            state.currentEnabled = state.originalUpscale;
        } else {
            // 其他模式：使用记忆的enabled状态
            state.currentEnabled = state.enabled;
        }

        // 更新按钮状态
        const toggleBtn = document.querySelector('.upscale-toggle-btn');
        if (toggleBtn) {
            if (state.currentEnabled) {
                toggleBtn.classList.add('enabled');
                toggleBtn.classList.remove('disabled');
            } else {
                toggleBtn.classList.add('disabled');
                toggleBtn.classList.remove('enabled');
            }
        }

        // 修复原图模式的类问题，然后应用缩放
        fixOriginalModeClass();
        applyScalingToMedia();
    }

    // 监听网站选择器变化
    function setupSelectorListener() {
        const selector = document.getElementById('image-resize-selector');
        if (!selector) return;

        selector.addEventListener('change', function() {
            handleModeChange(this.value);
        });

        // 初始处理当前模式
        handleModeChange(selector.value);
    }

    // 添加中键显示原图
    function addMiddleClickReset() {
        document.addEventListener('mousedown', function(event) {
            // 检查是否为中键点击 (button === 1)
            if (event.button === 1) {
                const target = event.target;

                // 检查点击目标是否为图片或视频元素
                const isMediaElement = target.id === 'image' ||
                      target.tagName === 'IMG' ||
                      target.tagName === 'VIDEO';

                if (isMediaElement) {
                    // 阻止默认行为（如在新标签打开图片）
                    event.preventDefault();
                    event.stopPropagation();

                    // 重置选择器为原始尺寸
                    resetToOriginalSize();

                    return false;
                }
            }
        });
    }

    // 重置为原始尺寸
    function resetToOriginalSize() {
        const selector = document.getElementById('image-resize-selector');
        if (selector) {
            selector.value = 'original';
            // 触发change事件以确保相关处理函数被执行
            selector.dispatchEvent(new Event('change', { bubbles: true }));

            console.log('中键点击：已重置为原始尺寸模式');
        }
    }

    // 初始化
    function init() {
        //中键显示原图
        addMiddleClickReset();

        // 初始化配置
        initConfig();

        // 添加样式
        addStyles();

        // 创建UI组件
        createToggleButton();

        // 设置选择器监听
        setupSelectorListener();

        // 监听DOM变化，确保在媒体加载后应用缩放
        const observer = new MutationObserver(function(mutations) {
            let shouldApplyScaling = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否添加了图片容器或媒体元素
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id === 'image-and-nav' ||
                                node.querySelector && node.querySelector('#image-and-nav')) {
                                shouldApplyScaling = true;
                            }
                        }
                    });
                }
            });

            if (shouldApplyScaling) {
                setTimeout(applyScalingToMedia, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始应用缩放
        setTimeout(applyScalingToMedia, 500);

        // 监听窗口大小变化
        window.addEventListener('resize', debounce(applyScalingToMedia, 300));

        // 添加设置菜单项
        setTimeout(addSettingsMenuItem, 1000);
    }

    // 添加设置菜单项
    function addSettingsMenuItem() {
        const etcMenu = document.querySelector('.ptbr-etc-menu');
        if (!etcMenu) {
            // 如果菜单不存在，稍后重试
            setTimeout(addSettingsMenuItem, 500);
            return;
        }

        // 检查是否已存在
        if (etcMenu.querySelector('.upscale-settings-item')) return;

        const settingsItem = document.createElement('a');
        settingsItem.href = '#';
        settingsItem.className = 'st-button upscale-settings-item';
        settingsItem.textContent = '缩放设置';

        // 创建设置面板
        const settingsPanel = createSettingsPanel();
        document.body.appendChild(settingsPanel);

        // 切换面板显示
        settingsItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            settingsPanel.classList.toggle('hidden');

            // 更新面板中的值
            updateSettingsPanel();
        });

        etcMenu.appendChild(settingsItem);

        // 点击其他地方关闭面板
        document.addEventListener('click', function(e) {
            if (!settingsPanel.contains(e.target) && e.target !== settingsItem) {
                settingsPanel.classList.add('hidden');
            }
        });
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
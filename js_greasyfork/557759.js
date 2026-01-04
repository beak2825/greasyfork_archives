// ==UserScript==
// @name         DLsite 获取封面图
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  获取当前轮播图图片，提供裁剪、撤销、马赛克以及本地保存功能
// @author       Accard
// @match        https://www.dlsite.com/*/work/=/product_id/*
// @match        https://www.dlsite.com/*/announce/=/product_id/*
// @grant        GM_addStyle
// @license MIT licensed
// @downloadURL https://update.greasyfork.org/scripts/557759/DLsite%20%E8%8E%B7%E5%8F%96%E5%B0%81%E9%9D%A2%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/557759/DLsite%20%E8%8E%B7%E5%8F%96%E5%B0%81%E9%9D%A2%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CSS 样式 (原生 UI) ---
    GM_addStyle(`
        /* 按钮样式 */
        #cover-editor-btn { position: fixed; bottom: 140px; right: 20px; z-index: 9999; padding: 10px 15px; background: #e83e8c; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-family: sans-serif; }
        #cover-editor-btn:hover { background: #c21768; }

        /* 模态框 */
        #img-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: none; justify-content: center; align-items: center; }
        #img-modal-content { background: #2b2b2b; padding: 15px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.6); max-width: 95vw; max-height: 95vh; display: flex; flex-direction: column; color: #eee; }

        #img-editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px; }
        #img-editor-title { margin: 0; font-size: 16px; font-weight: bold; }
        #img-close-btn { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; line-height: 1; }
        #img-close-btn:hover { color: #fff; }

        /* 画布容器 */
        #canvas-container { flex-grow: 1; overflow: auto; display: flex; justify-content: center; align-items: center; background: #1a1a1a; border: 1px solid #444; position: relative; min-width: 400px; min-height: 300px; }
        #editor-canvas { display: block; box-shadow: 0 0 10px rgba(0,0,0,0.5); }

        /* 裁剪框 (原生 DOM 实现) */
        #crop-selection-box {
            position: absolute;
            border: 2px dashed #00ff00;
            background: rgba(0, 255, 0, 0.1);
            display: none;
            pointer-events: none; /* 让鼠标事件穿透到下层，由容器处理移动 */
            z-index: 10;
        }

        /* 工具栏 */
        #img-toolbar { margin-top: 10px; padding-top: 10px; border-top: 1px solid #444; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; align-items: center; }

        /* 控件组 */
        .control-group { display: flex; background: #333; padding: 4px; border-radius: 4px; gap: 4px; align-items: center; }
        .control-label { font-size: 12px; margin-left: 5px; color: #ccc; }

        /* 按钮通用 */
        .tool-btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; transition: all 0.2s; color: white; display: flex; align-items: center; gap: 4px; }

        /* 模式按钮 */
        .btn-mode { background: #444; color: #aaa; }
        .btn-mode.active { background: #e83e8c; color: white; }

        /* 功能按钮 */
        .btn-func { background: #007bff; }
        .btn-func:hover { background: #0056b3; }
        .btn-func:disabled { background: #555; cursor: not-allowed; opacity: 0.6; }

        .btn-danger { background: #dc3545; }
        .btn-danger:hover { background: #a71d2a; }

        .btn-save { background: #28a745; }
        .btn-save:hover { background: #1e7e34; }

        /* 滑块 */
        input[type=range] { vertical-align: middle; cursor: pointer; }
    `);

    // --- 2. HTML 结构 ---
    const mainBtn = document.createElement('button');
    mainBtn.id = 'cover-editor-btn';
    mainBtn.innerHTML = '🎨 获取编辑封面';
    document.body.appendChild(mainBtn);

    const modalHTML = `
        <div id="img-modal-overlay">
            <div id="img-modal-content">
                <div id="img-editor-header">
                    <span id="img-editor-title">图片处理</span>
                    <button id="img-close-btn" title="关闭">×</button>
                </div>

                <div id="canvas-container">
                    <canvas id="editor-canvas"></canvas>
                    <div id="crop-selection-box"></div>
                </div>

                <div id="img-toolbar">
                    <div class="control-group">
                        <button id="btn-mode-mosaic" class="tool-btn btn-mode active">🖌️ 马赛克</button>
                        <button id="btn-mode-crop" class="tool-btn btn-mode">✂️ 裁剪</button>
                    </div>

                    <div class="control-group" id="group-mosaic-params">
                        <span class="control-label">大小:</span>
                        <input type="range" id="mosaic-size" min="5" max="80" value="20" title="调整马赛克颗粒大小">
                    </div>

                    <div class="control-group">
                        <button id="btn-undo" class="tool-btn btn-func" disabled>↩️ 撤销</button>
                        <button id="btn-reset" class="tool-btn btn-danger">🗑️ 重置</button>
                    </div>

                    <div class="control-group" id="group-crop-actions" style="display:none;">
                         <span class="control-label" style="color:#ffd700;">请在图上拖拽框选</span>
                         <button id="btn-confirm-crop" class="tool-btn btn-save" style="display:none;">✅ 确认裁剪</button>
                    </div>

                    <button id="btn-save-local" class="tool-btn btn-save" style="margin-left:auto;">💾 保存 PNG</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // --- 3. 变量与初始化 ---
    const ui = {
        overlay: document.getElementById('img-modal-overlay'),
        closeBtn: document.getElementById('img-close-btn'),
        container: document.getElementById('canvas-container'),
        canvas: document.getElementById('editor-canvas'),
        cropBox: document.getElementById('crop-selection-box'),
        modeMosaic: document.getElementById('btn-mode-mosaic'),
        modeCrop: document.getElementById('btn-mode-crop'),
        undoBtn: document.getElementById('btn-undo'),
        resetBtn: document.getElementById('btn-reset'),
        saveBtn: document.getElementById('btn-save-local'),
        mosaicSizeInput: document.getElementById('mosaic-size'),
        groupMosaic: document.getElementById('group-mosaic-params'),
        groupCrop: document.getElementById('group-crop-actions'),
        confirmCropBtn: document.getElementById('btn-confirm-crop')
    };

    let ctx = ui.canvas.getContext('2d', { willReadFrequently: true });
    let currentMode = 'mosaic'; // 'mosaic' | 'crop'
    let isDrawing = false;
    let mosaicSize = 20;

    // 历史记录栈
    let historyStack = [];
    const MAX_HISTORY = 20;
    let originalImageState = null; // 用于重置

    // 裁剪相关变量
    let isSelecting = false;
    let startX, startY;
    let cropRect = { x:0, y:0, w:0, h:0 };

    // --- 4. 核心逻辑 ---

    // 启动编辑器
    async function openEditor() {
        // 获取图片 (逻辑不变)
        const activeImg = document.querySelector('li.slider_item.active img');
        if (!activeImg) { alert('未找到当前显示的图片！'); return; }
        const imgSrc = activeImg.srcset || activeImg.src;

        ui.overlay.style.display = 'flex';

        // 加载图片
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            // 设置 Canvas 尺寸
            ui.canvas.width = img.width;
            ui.canvas.height = img.height;
            // 限制一下最大显示尺寸，防止Canvas太大撑破屏幕，只影响CSS显示，不影响实际像素
            // ui.canvas.style.maxWidth = '100%';

            ctx.drawImage(img, 0, 0);

            // 初始化状态
            historyStack = [];
            saveState(); // 保存初始状态作为第一步
            originalImageState = ctx.getImageData(0, 0, ui.canvas.width, ui.canvas.height);
            updateUndoBtn();
            setMode('mosaic');
        };
        img.onerror = () => { alert("图片跨域加载失败，无法编辑。"); closeModal(); };
        img.src = imgSrc.startsWith('//') ? 'https:' + imgSrc : imgSrc;
    }

    function closeModal() {
        ui.overlay.style.display = 'none';
        ui.cropBox.style.display = 'none';
    }

    // 历史记录管理
    function saveState() {
        if (historyStack.length >= MAX_HISTORY) historyStack.shift();
        historyStack.push(ctx.getImageData(0, 0, ui.canvas.width, ui.canvas.height));
        updateUndoBtn();
    }

    function undo() {
        if (historyStack.length > 1) {
            historyStack.pop(); // 移除当前状态
            const prevState = historyStack[historyStack.length - 1];
            // 恢复尺寸 (裁剪可能改变了尺寸)
            ui.canvas.width = prevState.width;
            ui.canvas.height = prevState.height;
            ctx.putImageData(prevState, 0, 0);
            updateUndoBtn();
            // 如果在裁剪模式下撤销，隐藏裁剪框
            ui.cropBox.style.display = 'none';
            ui.confirmCropBtn.style.display = 'none';
        }
    }

    function resetImage() {
        if (confirm('确定要重置所有修改吗？')) {
            if (originalImageState) {
                ui.canvas.width = originalImageState.width;
                ui.canvas.height = originalImageState.height;
                ctx.putImageData(originalImageState, 0, 0);
                historyStack = [originalImageState]; // 重置历史栈
                updateUndoBtn();
                ui.cropBox.style.display = 'none';
            }
        }
    }

    function updateUndoBtn() {
        ui.undoBtn.disabled = historyStack.length <= 1;
        ui.undoBtn.innerHTML = `↩️ 撤销 (${historyStack.length - 1})`;
    }

    // 模式切换
    function setMode(mode) {
        currentMode = mode;
        if (mode === 'mosaic') {
            ui.modeMosaic.classList.add('active');
            ui.modeCrop.classList.remove('active');
            ui.canvas.style.cursor = 'crosshair'; // 涂抹光标
            ui.groupMosaic.style.display = 'flex';
            ui.groupCrop.style.display = 'none';
            ui.cropBox.style.display = 'none'; // 隐藏裁剪框
        } else {
            ui.modeCrop.classList.add('active');
            ui.modeMosaic.classList.remove('active');
            ui.canvas.style.cursor = 'default';
            ui.groupMosaic.style.display = 'none';
            ui.groupCrop.style.display = 'flex';
            ui.confirmCropBtn.style.display = 'none'; // 先隐藏确认按钮
        }
    }

    // --- 马赛克逻辑 ---
    function applyMosaic(x, y) {
        const size = mosaicSize;
        // 简单算法：计算当前方块的左上角
        // 坐标需要映射：鼠标(screen) -> Canvas(pixel)
        const rect = ui.canvas.getBoundingClientRect();
        const scaleX = ui.canvas.width / rect.width;
        const scaleY = ui.canvas.height / rect.height;

        const canvasX = (x - rect.left) * scaleX;
        const canvasY = (y - rect.top) * scaleY;

        // 核心：以鼠标为中心，size为边长的区域
        let startX = Math.floor(canvasX - size / 2);
        let startY = Math.floor(canvasY - size / 2);

        // 边界处理
        // 为了性能，我们不逐像素计算，而是只处理受影响的区域
        const imageData = ctx.getImageData(startX, startY, size, size);
        const data = imageData.data;

        // 计算平均色
        let r=0, g=0, b=0, count=0;
        for(let i=0; i<data.length; i+=4) {
            r += data[i]; g += data[i+1]; b += data[i+2]; count++;
        }
        r = Math.floor(r/count); g = Math.floor(g/count); b = Math.floor(b/count);

        // 填充
        for(let i=0; i<data.length; i+=4) {
            data[i] = r; data[i+1] = g; data[i+2] = b;
        }

        ctx.putImageData(imageData, startX, startY);
    }

    // --- 原生裁剪逻辑 ---
    function handleCropMouseDown(e) {
        if (e.target !== ui.canvas && e.target !== ui.cropBox) return;
        isSelecting = true;
        const rect = ui.container.getBoundingClientRect(); // 基于容器定位

        // 记录相对于容器的起始点
        startX = e.clientX - rect.left + ui.container.scrollLeft;
        startY = e.clientY - rect.top + ui.container.scrollTop;

        // 初始化框
        ui.cropBox.style.left = startX + 'px';
        ui.cropBox.style.top = startY + 'px';
        ui.cropBox.style.width = '0px';
        ui.cropBox.style.height = '0px';
        ui.cropBox.style.display = 'block';
        ui.confirmCropBtn.style.display = 'none';
    }

    function handleCropMouseMove(e) {
        if (!isSelecting) return;
        const rect = ui.container.getBoundingClientRect();
        const currentX = e.clientX - rect.left + ui.container.scrollLeft;
        const currentY = e.clientY - rect.top + ui.container.scrollTop;

        // 计算宽高和位置 (支持反向拖拽)
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        ui.cropBox.style.left = left + 'px';
        ui.cropBox.style.top = top + 'px';
        ui.cropBox.style.width = width + 'px';
        ui.cropBox.style.height = height + 'px';

        // 临时保存选区数据
        cropRect = { left, top, width, height };
    }

    function handleCropMouseUp() {
        if (!isSelecting) return;
        isSelecting = false;
        if (cropRect.width > 10 && cropRect.height > 10) {
            ui.confirmCropBtn.style.display = 'inline-block';
        } else {
            ui.cropBox.style.display = 'none'; // 太小了就取消
        }
    }

    function executeCrop() {
        // 坐标转换：DOM (容器坐标) -> Canvas (像素坐标)
        // 1. 获取 Canvas 在容器里的显示尺寸和偏移
        // 注意：Canvas 在容器里是居中的，或者有偏移
        const canvasRect = ui.canvas.getBoundingClientRect();
        const containerRect = ui.container.getBoundingClientRect();

        // Canvas 相对于容器左上角的偏移
        const canvasOffsetLeft = canvasRect.left - containerRect.left + ui.container.scrollLeft;
        const canvasOffsetTop = canvasRect.top - containerRect.top + ui.container.scrollTop;

        // 选区相对于 Canvas 显示区域的坐标
        let cropX_display = cropRect.left - canvasOffsetLeft;
        let cropY_display = cropRect.top - canvasOffsetTop;

        // 比例转换 (显示像素 -> 实际像素)
        const scaleX = ui.canvas.width / canvasRect.width;
        const scaleY = ui.canvas.height / canvasRect.height;

        const realX = cropX_display * scaleX;
        const realY = cropY_display * scaleY;
        const realW = cropRect.width * scaleX;
        const realH = cropRect.height * scaleY;

        // 验证边界
        if (realW <= 0 || realH <= 0) return;

        saveState(); // 裁剪前保存状态

        // 提取图像
        const croppedData = ctx.getImageData(realX, realY, realW, realH);

        // 调整 Canvas 大小
        ui.canvas.width = realW;
        ui.canvas.height = realH;
        ctx.putImageData(croppedData, 0, 0);

        // 清理 UI
        ui.cropBox.style.display = 'none';
        ui.confirmCropBtn.style.display = 'none';
        // 裁剪完切回马赛克模式，方便继续编辑
        // setMode('mosaic');
    }


    // --- 5. 事件绑定 ---

    // 鼠标通用事件 (分发)
    ui.container.addEventListener('mousedown', (e) => {
        if (currentMode === 'mosaic') {
            if (e.target === ui.canvas) {
                isDrawing = true;
                saveState(); // 开始画之前保存状态
                applyMosaic(e.clientX, e.clientY);
            }
        } else if (currentMode === 'crop') {
            handleCropMouseDown(e);
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (currentMode === 'mosaic' && isDrawing) {
            applyMosaic(e.clientX, e.clientY);
        } else if (currentMode === 'crop' && isSelecting) {
            handleCropMouseMove(e);
        }
    });

    window.addEventListener('mouseup', () => {
        isDrawing = false;
        handleCropMouseUp();
    });

    // 按钮事件
    mainBtn.onclick = openEditor;
    ui.closeBtn.onclick = closeModal;
    ui.overlay.onclick = (e) => { if (e.target === ui.overlay) closeModal(); };

    ui.modeMosaic.onclick = () => setMode('mosaic');
    ui.modeCrop.onclick = () => setMode('crop');

    ui.undoBtn.onclick = undo;
    ui.resetBtn.onclick = resetImage;
    ui.confirmCropBtn.onclick = executeCrop;

    ui.mosaicSizeInput.oninput = (e) => mosaicSize = parseInt(e.target.value);

    ui.saveBtn.onclick = () => {
        const rjMatch = window.location.href.match(/(RJ\d{6,8})/i);
        const filename = (rjMatch ? rjMatch[1] : 'dlsite_img') + '_edited.png';
        ui.canvas.toBlob(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
        });
    };

})();
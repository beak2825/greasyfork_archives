// ==UserScript==
// @name         网页画笔工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在任意网页上绘画，支持画笔大小调节、颜色选择、撤回和清除
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561727/%E7%BD%91%E9%A1%B5%E7%94%BB%E7%AC%94%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561727/%E7%BD%91%E9%A1%B5%E7%94%BB%E7%AC%94%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 状态变量
    let isDrawing = false;
    let isEnabled = false;
    let currentColor = '#ff0000';
    let brushSize = 5;
    let paths = []; // 存储所有绘画路径
    let currentPath = null;

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #draw-tool-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 200px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 15px;
            z-index: 999999;
            font-family: 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            user-select: none;
            cursor: move;
        }

        #draw-tool-panel .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        #draw-tool-panel .panel-title {
            color: white;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #draw-tool-panel .toggle-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
        }

        #draw-tool-panel .toggle-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        #draw-tool-panel .toggle-btn.active {
            background: #4CAF50;
        }

        #draw-tool-panel .section {
            margin-bottom: 15px;
        }

        #draw-tool-panel .section-label {
            color: rgba(255,255,255,0.9);
            font-size: 12px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }

        #draw-tool-panel .size-slider {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: rgba(255,255,255,0.3);
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
        }

        #draw-tool-panel .size-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        #draw-tool-panel .size-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            margin-top: 8px;
        }

        #draw-tool-panel .size-dot {
            border-radius: 50%;
            background: white;
            transition: all 0.2s;
        }

        #draw-tool-panel .color-section {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        #draw-tool-panel .color-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        }

        #draw-tool-panel .color-btn:hover {
            transform: scale(1.15);
        }

        #draw-tool-panel .color-btn.active {
            border-color: white;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.3);
        }

        #draw-tool-panel .color-picker-wrapper {
            position: relative;
            width: 28px;
            height: 28px;
        }

        #draw-tool-panel .color-picker {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            padding: 0;
            overflow: hidden;
        }

        #draw-tool-panel .action-buttons {
            display: flex;
            gap: 8px;
        }

        #draw-tool-panel .action-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        #draw-tool-panel .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        #draw-tool-panel .action-btn:active {
            transform: translateY(0);
        }

        #draw-tool-panel .undo-btn {
            background: #FFC107;
            color: #333;
        }

        #draw-tool-panel .clear-btn {
            background: #f44336;
            color: white;
        }

        #draw-tool-panel .minimize-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #draw-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999998;
            pointer-events: none;
        }

        #draw-canvas.active {
            pointer-events: auto;
            cursor: crosshair;
        }

        #draw-tool-panel.minimized {
            width: auto;
            padding: 10px 15px;
        }

        #draw-tool-panel.minimized .panel-content {
            display: none;
        }

        #draw-tool-panel .path-count {
            color: rgba(255,255,255,0.7);
            font-size: 11px;
            text-align: center;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    // 创建画布
    const canvas = document.createElement('canvas');
    canvas.id = 'draw-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // 调整画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        redrawAll();
    }

    // 创建控制面板
    const panel = document.createElement('div');
    panel.id = 'draw-tool-panel';
    panel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">
                🎨 画笔工具
            </div>
            <button class="toggle-btn" id="toggle-draw">开启</button>
        </div>
        <div class="panel-content">
            <div class="section">
                <div class="section-label">
                    <span>画笔大小</span>
                    <span id="size-value">5px</span>
                </div>
                <input type="range" class="size-slider" id="brush-size" min="1" max="50" value="5">
                <div class="size-preview">
                    <div class="size-dot" id="size-dot"></div>
                </div>
            </div>
            <div class="section">
                <div class="section-label">颜色选择</div>
                <div class="color-section">
                    <button class="color-btn active" data-color="#ff0000" style="background:#ff0000"></button>
                    <button class="color-btn" data-color="#ff9800" style="background:#ff9800"></button>
                    <button class="color-btn" data-color="#ffeb3b" style="background:#ffeb3b"></button>
                    <button class="color-btn" data-color="#4caf50" style="background:#4caf50"></button>
                    <button class="color-btn" data-color="#2196f3" style="background:#2196f3"></button>
                    <button class="color-btn" data-color="#9c27b0" style="background:#9c27b0"></button>
                    <button class="color-btn" data-color="#000000" style="background:#000000"></button>
                    <button class="color-btn" data-color="#ffffff" style="background:#ffffff; border: 1px solid #ccc"></button>
                    <div class="color-picker-wrapper">
                        <input type="color" class="color-picker" id="custom-color" value="#ff0000" title="自定义颜色">
                    </div>
                </div>
            </div>
            <div class="section action-buttons">
                <button class="action-btn undo-btn" id="undo-btn">
                    ↩️ 撤回
                </button>
                <button class="action-btn clear-btn" id="clear-btn">
                    🗑️ 清除
                </button>
            </div>
            <div class="path-count" id="path-count">已绘制: 0 笔</div>
        </div>
    `;
    document.body.appendChild(panel);

    // 获取元素
    const toggleBtn = document.getElementById('toggle-draw');
    const brushSizeSlider = document.getElementById('brush-size');
    const sizeValue = document.getElementById('size-value');
    const sizeDot = document.getElementById('size-dot');
    const colorBtns = panel.querySelectorAll('.color-btn');
    const customColor = document.getElementById('custom-color');
    const undoBtn = document.getElementById('undo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const pathCount = document.getElementById('path-count');

    // 更新大小预览
    function updateSizePreview() {
        sizeDot.style.width = brushSize + 'px';
        sizeDot.style.height = brushSize + 'px';
        sizeDot.style.background = currentColor;
        sizeValue.textContent = brushSize + 'px';
    }

    // 更新路径计数
    function updatePathCount() {
        pathCount.textContent = `已绘制: ${paths.length} 笔`;
    }

    // 重绘所有路径
    function redrawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            if (path.points.length < 2) return;
            ctx.beginPath();
            ctx.strokeStyle = path.color;
            ctx.lineWidth = path.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            ctx.stroke();
        });
    }

    // 开启/关闭绘画
    toggleBtn.addEventListener('click', () => {
        isEnabled = !isEnabled;
        toggleBtn.textContent = isEnabled ? '关闭' : '开启';
        toggleBtn.classList.toggle('active', isEnabled);
        canvas.classList.toggle('active', isEnabled);
    });

    // 画笔大小
    brushSizeSlider.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        updateSizePreview();
    });

    // 颜色选择
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color;
            updateSizePreview();
        });
    });

    // 自定义颜色
    customColor.addEventListener('input', (e) => {
        currentColor = e.target.value;
        colorBtns.forEach(b => b.classList.remove('active'));
        updateSizePreview();
    });

    // 撤回
    undoBtn.addEventListener('click', () => {
        if (paths.length > 0) {
            paths.pop();
            redrawAll();
            updatePathCount();
        }
    });

    // 清除
    clearBtn.addEventListener('click', () => {
        if (paths.length > 0 && confirm('确定要清除所有绘画吗？')) {
            paths = [];
            redrawAll();
            updatePathCount();
        }
    });

    // 绘画事件
    canvas.addEventListener('mousedown', (e) => {
        if (!isEnabled) return;
        isDrawing = true;
        currentPath = {
            color: currentColor,
            size: brushSize,
            points: [{ x: e.clientX, y: e.clientY }]
        };
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing || !isEnabled) return;
        currentPath.points.push({ x: e.clientX, y: e.clientY });

        // 实时绘制当前路径
        const points = currentPath.points;
        if (points.length >= 2) {
            ctx.beginPath();
            ctx.strokeStyle = currentPath.color;
            ctx.lineWidth = currentPath.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isDrawing && currentPath && currentPath.points.length > 1) {
            paths.push(currentPath);
            updatePathCount();
        }
        isDrawing = false;
        currentPath = null;
    });

    canvas.addEventListener('mouseleave', () => {
        if (isDrawing && currentPath && currentPath.points.length > 1) {
            paths.push(currentPath);
            updatePathCount();
        }
        isDrawing = false;
        currentPath = null;
    });

    // 触摸支持
    canvas.addEventListener('touchstart', (e) => {
        if (!isEnabled) return;
        e.preventDefault();
        const touch = e.touches[0];
        isDrawing = true;
        currentPath = {
            color: currentColor,
            size: brushSize,
            points: [{ x: touch.clientX, y: touch.clientY }]
        };
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing || !isEnabled) return;
        e.preventDefault();
        const touch = e.touches[0];
        currentPath.points.push({ x: touch.clientX, y: touch.clientY });

        const points = currentPath.points;
        if (points.length >= 2) {
            ctx.beginPath();
            ctx.strokeStyle = currentPath.color;
            ctx.lineWidth = currentPath.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.stroke();
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        if (isDrawing && currentPath && currentPath.points.length > 1) {
            paths.push(currentPath);
            updatePathCount();
        }
        isDrawing = false;
        currentPath = null;
    });

    // 面板拖动
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    panel.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        isDragging = true;
        dragOffset.x = e.clientX - panel.offsetLeft;
        dragOffset.y = e.clientY - panel.offsetTop;
        panel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let x = e.clientX - dragOffset.x;
        let y = e.clientY - dragOffset.y;

        // 边界限制
        x = Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - panel.offsetHeight));

        panel.style.left = x + 'px';
        panel.style.right = 'auto';
        panel.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = 'move';
    });

    // 窗口大小改变
    window.addEventListener('resize', resizeCanvas);

    // 快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl+Z 撤回
        if (e.ctrlKey && e.key === 'z') {
            if (paths.length > 0) {
                paths.pop();
                redrawAll();
                updatePathCount();
            }
        }
        // Escape 关闭绘画模式
        if (e.key === 'Escape' && isEnabled) {
            isEnabled = false;
            toggleBtn.textContent = '开启';
            toggleBtn.classList.remove('active');
            canvas.classList.remove('active');
        }
    });

    // 初始化
    resizeCanvas();
    updateSizePreview();
    updatePathCount();

    console.log('🎨 网页画笔工具已加载');
})();
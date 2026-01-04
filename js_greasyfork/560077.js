// ==UserScript==
// @name         Lolz Paint
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ручной paint
// @author       Forest
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560077/Lolz%20Paint.user.js
// @updateURL https://update.greasyfork.org/scripts/560077/Lolz%20Paint.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF', '#000000'];

    let history = [];
    let historyStep = -1;
    let currentTool = 'brush';
    let currentColor = '#FF0000';
    let currentLineWidth = 3;
    let isDrawing = false;
    let startX, startY;
    let snapshot;
    let activeTextObj = null;
    let currentBgType = 'color';
    let currentBgColor = '#FFFFFF';

    function createPaintModal() {
        history = []; historyStep = -1; activeTextObj = null;
        currentBgType = 'color'; currentBgColor = '#FFFFFF';

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 99999; display: flex;
            justify-content: center; align-items: center; flex-direction: column;
            user-select: none; font-family: 'Segoe UI', sans-serif;
        `;

        const editorBox = document.createElement('div');
        editorBox.style.cssText = `
            background: #222; padding: 10px; border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 10px;
            max-width: 98vw; max-height: 98vh; position: relative;
        `;

        const toolbar = document.createElement('div');
        toolbar.style.cssText = 'display: flex; gap: 10px; align-items: center; background: #333; padding: 8px; border-radius: 6px; flex-wrap: wrap;';

        const toolsData = [
            { id: 'brush', icon: '🖌️', title: 'Кисть' },
            { id: 'rect', icon: '⬜', title: 'Прямоугольник' },
            { id: 'arrow', icon: '↗️', title: 'Стрелка' },
            { id: 'text', icon: 'T', title: 'Текст' },
            { id: 'blur', icon: '💧', title: 'Блюр (цензура)' },
            { id: 'eraser', icon: '🧹', title: 'Ластик' }
        ];

        const toolsContainer = document.createElement('div');
        toolsContainer.style.display = 'flex';
        toolsContainer.style.gap = '5px';

        toolsData.forEach(tool => {
            const btn = document.createElement('button');
            btn.innerHTML = tool.icon;
            btn.title = tool.title;
            btn.style.cssText = `
                padding: 6px 10px; background: ${tool.id === 'brush' ? '#555' : '#333'};
                border: 1px solid #444; color: white; cursor: pointer; border-radius: 4px; font-size: 16px;
            `;
            btn.onclick = () => {
                applyText();
                currentTool = tool.id;
                Array.from(toolsContainer.children).forEach(b => b.style.background = '#333');
                btn.style.background = '#555';
            };
            toolsContainer.appendChild(btn);
        });

        const bgControls = document.createElement('div');
        bgControls.style.display = 'flex'; bgControls.style.gap = '5px'; bgControls.style.marginLeft = '10px'; bgControls.style.borderLeft = '1px solid #555'; bgControls.style.paddingLeft = '10px';

        const fillBtn = document.createElement('button');
        fillBtn.innerHTML = '🪣';
        fillBtn.title = 'Залить фон цветом';
        fillBtn.style.cssText = 'padding: 6px 10px; background: #333; border: 1px solid #444; color: white; cursor: pointer; border-radius: 4px; font-size: 16px;';
        fillBtn.onclick = () => {
            applyText();
            currentBgType = 'color'; currentBgColor = currentColor;
            fillCanvasBackground(); saveState();
        };

        const transparentBtn = document.createElement('button');
        transparentBtn.innerHTML = '🏁';
        transparentBtn.title = 'Прозрачный фон';
        transparentBtn.style.cssText = 'padding: 6px 10px; background: #333; border: 1px solid #444; color: white; cursor: pointer; border-radius: 4px; font-size: 16px;';
        transparentBtn.onclick = () => {
            applyText();
            currentBgType = 'transparent';
            fillCanvasBackground(); saveState();
        };
        bgControls.append(fillBtn, transparentBtn);

        const palette = document.createElement('div');
        palette.style.display = 'flex'; palette.style.gap = '4px'; palette.style.marginLeft = '10px'; palette.style.alignItems = 'center';
        COLORS.forEach(color => {
            const swatch = document.createElement('div');
            swatch.style.cssText = `width: 20px; height: 20px; background: ${color}; border-radius: 3px; cursor: pointer; border: 1px solid #555;`;
            if(color === currentColor) swatch.style.border = '2px solid white';
            swatch.onclick = () => {
                updateColor(color);
                Array.from(palette.querySelectorAll('.swatch')).forEach(c => c.style.border = '1px solid #555');
                swatch.style.border = '2px solid white';
            };
            swatch.className = 'swatch';
            palette.appendChild(swatch);
        });

        const colorInputLabel = document.createElement('label');
        colorInputLabel.innerHTML = '🌈';
        colorInputLabel.style.cssText = 'cursor: pointer; font-size: 20px; margin-left: 5px;';
        const colorInput = document.createElement('input');
        colorInput.type = 'color'; colorInput.value = currentColor;
        colorInput.style.cssText = 'width: 0; height: 0; visibility: hidden; position: absolute;';
        colorInputLabel.appendChild(colorInput);
        colorInput.oninput = (e) => {
             updateColor(e.target.value);
             Array.from(palette.querySelectorAll('.swatch')).forEach(c => c.style.border = '1px solid #555');
        };
        palette.appendChild(colorInputLabel);

        function updateColor(newColor) {
            currentColor = newColor;
            if(activeTextObj) activeTextObj.style.color = newColor;
        }

        const sizeInput = document.createElement('input');
        sizeInput.type = 'range'; sizeInput.min = 1; sizeInput.max = 40; sizeInput.value = currentLineWidth;
        sizeInput.style.width = '80px';
        sizeInput.oninput = (e) => {
            currentLineWidth = parseInt(e.target.value);
            if(activeTextObj) activeTextObj.style.fontSize = (currentLineWidth + 12) + 'px';
        };

        const undoBtn = document.createElement('button');
        undoBtn.innerHTML = '↩️'; undoBtn.onclick = undo;
        undoBtn.style.cssText = 'background:none; border:none; color:#ccc; cursor:pointer; font-size:18px; margin-left: auto;';

        toolbar.append(toolsContainer, bgControls, palette, sizeInput, undoBtn);

        const canvasWrapper = document.createElement('div');
        canvasWrapper.style.cssText = `
            position: relative; width: 800px; height: 500px;
            background-color: #eee;
            background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
            background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            overflow: hidden; border: 2px solid #444;
        `;

        const canvas = document.createElement('canvas');
        canvas.width = 800; canvas.height = 500;
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();

        const resizer = document.createElement('div');
        resizer.style.cssText = `width: 15px; height: 15px; background: linear-gradient(135deg, transparent 50%, #e91e63 50%); position: absolute; bottom: 0; right: 0; cursor: nwse-resize; z-index: 20;`;
        let isResizing = false;
        resizer.onmousedown = (e) => { isResizing = true; e.preventDefault(); applyText(); };
        window.addEventListener('mouseup', () => isResizing = false);
        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const rect = canvasWrapper.getBoundingClientRect();
            const newW = e.clientX - rect.left; const newH = e.clientY - rect.top;
            if (newW > 100 && newH > 100) resizeCanvas(newW, newH);
        });
        canvasWrapper.append(canvas, resizer);

        function fillCanvasBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (currentBgType === 'color') {
                ctx.fillStyle = currentBgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        function resizeCanvas(w, h, skipSave = false) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
            tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
            canvasWrapper.style.width = w + 'px'; canvasWrapper.style.height = h + 'px';
            canvas.width = w; canvas.height = h;
            if (currentBgType === 'color') {
                ctx.fillStyle = currentBgColor; ctx.fillRect(0, 0, w, h);
            } else { ctx.clearRect(0, 0, w, h); }
            ctx.drawImage(tempCanvas, 0, 0);
            if (!skipSave) saveState();
        }

        function pixelate(x, y, size) {
            const pixelSize = 6;
            const w = size * 2;
            const h = size * 2;
            const sx = x - size;
            const sy = y - size;
            try {
                const sampleW = Math.max(1, Math.floor(w / pixelSize));
                const sampleH = Math.max(1, Math.floor(h / pixelSize));
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(canvas, sx, sy, w, h, sx, sy, sampleW, sampleH);
                ctx.drawImage(canvas, sx, sy, sampleW, sampleH, sx, sy, w, h);
                ctx.imageSmoothingEnabled = true;
            } catch(e) {}
        }

        function createFloatingText(x, y) {
            applyText();
            const div = document.createElement('div');
            div.contentEditable = true; div.innerHTML = 'Текст';
            div.style.cssText = `position: absolute; left: ${x}px; top: ${y}px; color: ${currentColor}; font-size: ${currentLineWidth + 12}px; font-family: Arial; border: 1px dashed #000; padding: 2px; min-width: 20px; z-index: 15; cursor: move; outline: none; background: rgba(255,255,255,0.3);`;
            let isDraggingDiv = false; let divOffsetX, divOffsetY;
            div.onmousedown = (e) => {
                if(e.target !== div) return;
                isDraggingDiv = true; divOffsetX = e.offsetX; divOffsetY = e.offsetY;
            };
            modal.onmousemove = (e) => {
                if(isDraggingDiv) {
                    const rect = canvasWrapper.getBoundingClientRect();
                    div.style.left = (e.clientX - rect.left - divOffsetX) + 'px';
                    div.style.top = (e.clientY - rect.top - divOffsetY) + 'px';
                }
            };
            modal.onmouseup = () => isDraggingDiv = false;
            div.onkeydown = (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyText(); } };
            canvasWrapper.appendChild(div); activeTextObj = div; setTimeout(() => div.focus(), 0);
        }

        function applyText() {
            if (!activeTextObj) return;
            const rect = activeTextObj.getBoundingClientRect();
            const canvasRect = canvasWrapper.getBoundingClientRect();
            const x = rect.left - canvasRect.left; const y = rect.top - canvasRect.top;
            const fontSize = parseInt(activeTextObj.style.fontSize);
            ctx.font = `${fontSize}px Arial`; ctx.fillStyle = activeTextObj.style.color; ctx.textBaseline = 'top';
            ctx.fillText(activeTextObj.innerText, x, y + 2);
            activeTextObj.remove(); activeTextObj = null; saveState();
        }

        canvas.onmousedown = (e) => {
            if (activeTextObj && e.target !== activeTextObj) applyText();
            if (currentTool === 'text') {
                const rect = canvasWrapper.getBoundingClientRect();
                createFloatingText(e.clientX - rect.left, e.clientY - rect.top);
                return;
            }
            isDrawing = true;
            const rect = canvasWrapper.getBoundingClientRect();
            startX = e.clientX - rect.left; startY = e.clientY - rect.top;
            snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (currentTool === 'blur') {
                 pixelate(startX, startY, currentLineWidth * 2);
            } else {
                 ctx.beginPath(); ctx.moveTo(startX, startY);
            }
        };

        canvas.onmousemove = (e) => {
            if (!isDrawing) return;
            const rect = canvasWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;

            if (currentTool === 'blur') {
                pixelate(x, y, currentLineWidth * 2);
                return;
            }

            ctx.lineWidth = currentLineWidth; ctx.strokeStyle = (currentTool === 'eraser') ? (currentBgType === 'color' ? currentBgColor : 'rgba(0,0,0,1)') : currentColor;
            if (currentTool === 'eraser') ctx.globalCompositeOperation = 'destination-out';
            else ctx.globalCompositeOperation = 'source-over';

            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            if (currentTool === 'brush' || currentTool === 'eraser') { ctx.lineTo(x, y); ctx.stroke(); }
            else if (currentTool === 'rect') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.putImageData(snapshot, 0, 0); ctx.strokeRect(startX, startY, x - startX, y - startY);
            }
            else if (currentTool === 'arrow') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.putImageData(snapshot, 0, 0); drawArrow(ctx, startX, startY, x, y);
            }
            if (currentTool !== 'eraser') ctx.globalCompositeOperation = 'source-over';
        };
        canvas.onmouseup = () => { if (isDrawing) { isDrawing = false; saveState(); } ctx.beginPath(); ctx.globalCompositeOperation = 'source-over'; };

        function saveState() { historyStep++; if (historyStep < history.length) history.length = historyStep; history.push(canvas.toDataURL()); }
        function undo() { if (historyStep > 0) { historyStep--; restoreState(); } }
        function restoreState() { const img = new Image(); img.src = history[historyStep]; img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); }; }
        function drawArrow(ctx, fromx, fromy, tox, toy) {
            const headlen = 15 + currentLineWidth; const dx = tox - fromx, dy = toy - fromy, angle = Math.atan2(dy, dx);
            ctx.beginPath(); ctx.moveTo(fromx, fromy); ctx.lineTo(tox, toy);
            ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI/6), toy - headlen * Math.sin(angle - Math.PI/6));
            ctx.moveTo(tox, toy); ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI/6), toy - headlen * Math.sin(angle + Math.PI/6));
            ctx.stroke();
        }

        window.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.kind === 'file' && item.type.includes('image/')) {
                    applyText();
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            let w = img.width, h = img.height;
                            const maxW = window.innerWidth - 100, maxH = window.innerHeight - 200;
                            if (w > maxW) { h *= maxW/w; w = maxW; }
                            if (h > maxH) { w *= maxH/h; h = maxH; }
                            resizeCanvas(w, h, true);
                            ctx.drawImage(img, 0, 0, w, h);
                            saveState();
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(blob);
                }
            }
        });
        window.addEventListener('keydown', (e) => { if (e.ctrlKey && e.code === 'KeyZ') { e.preventDefault(); undo(); } });

        const bottomBar = document.createElement('div');
        bottomBar.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 5px;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.onclick = () => modal.remove();

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Скопировать изображение';
        copyBtn.style.cssText = 'background: #4CAF50; color: white; border: none; padding: 5px 15px; border-radius: 4px; font-weight: bold; cursor: pointer;';
        copyBtn.onclick = () => {
            applyText();
            canvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => {
                    alert('Изображение скопировано! \nТеперь нажми Ctrl+V в поле ответа.');
                    modal.remove();
                }).catch(err => {
                    alert('Ошибка доступа к буферу. Проверь настройки браузера.');
                });
            });
        };

        bottomBar.append(closeBtn, copyBtn);
        editorBox.append(toolbar, canvasWrapper, bottomBar);
        modal.appendChild(editorBox);
        document.body.appendChild(modal);
    }

    function addPaintButton() {
        const toolbars = document.querySelectorAll('.fr-toolbar, .redactor_toolbar, .bbCodeEditor-toolbar');
        toolbars.forEach(toolbar => {
            if (toolbar.querySelector('.lolz-paint-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'lolz-paint-btn';
            btn.innerHTML = '🎨'; btn.type = 'button'; btn.title = 'Paint';
            btn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:18px; padding:0 5px; transition:transform 0.2s;';
            btn.onclick = (e) => { e.preventDefault(); createPaintModal(); };
            toolbar.appendChild(btn);
        });
    }
    setInterval(addPaintButton, 1000);
})();
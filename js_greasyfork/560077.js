// ==UserScript==
// @name         Lolz Paint
// @namespace    http://tampermonkey.net/
// @version      1.1
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

    const CSS_STYLES = `
        .lz-paint-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 99999; display: flex;
            justify-content: center; align-items: center; flex-direction: column;
            user-select: none; font-family: 'Segoe UI', sans-serif;
        }
        .lz-editor-box {
            background: #222; padding: 10px; border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 10px;
            max-width: 98vw; max-height: 98vh; position: relative;
        }
        .lz-toolbar { display: flex; gap: 10px; align-items: center; background: #333; padding: 8px; border-radius: 6px; flex-wrap: wrap; }
        .lz-btn {
            padding: 6px 10px; background: #333; border: 1px solid #444; color: #ccc;
            cursor: pointer; border-radius: 4px; font-size: 14px; transition: 0.2s;
            display: flex; align-items: center; justify-content: center; min-width: 32px;
        }
        .lz-btn:hover { background: #444; color: #fff; }
        .lz-btn.active { background: #555; border-color: #666; color: #fff; }
        .lz-canvas-wrap {
            position: relative; width: 800px; height: 500px;
            background-color: #eee;
            background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
            background-size: 20px 20px;
            overflow: hidden; border: 2px solid #444;
        }
        .lz-swatch { width: 20px; height: 20px; border-radius: 3px; cursor: pointer; border: 1px solid #555; }
        .lz-paint-trigger {
            float: left; display: flex; align-items: center; justify-content: center;
            cursor: pointer !important; width: 30px; height: 30px;
            color: #a4a4a4;
            background: none; border: none; margin: 0 2px;
        }
        .lz-paint-trigger:hover { color: #fff; background: rgba(255,255,255,0.1); border-radius: 4px; }
        .lz-paint-trigger i { font-size: 14px; }
        .lz-bottom-bar { display: flex; justify-content: flex-end; gap: 10px; margin-top: 5px; }
        .lz-btn-green { background: #2d8a31; border: none; color: white; }
        .lz-btn-green:hover { background: #36a53b; }
    `;

    $('<style>').text(CSS_STYLES).appendTo('head');

    window.XenForo.LolzPaintBtn = function($element) {
        if ($element.find('.lz-paint-trigger').length) return;

        const $btn = $('<button type="button" class="lz-paint-trigger fr-command fr-btn Tooltip" title="Paint"><i class="fa fa-paint-brush"></i></button>');

        $btn.click(function(e) {
            e.preventDefault();
            new LolzPaintApp();
        });

        $element.append($btn);
        $element.xfActivate();
    };

    XenForo.register('.fr-toolbar, .bbCodeEditor-toolbar', 'XenForo.LolzPaintBtn');

    $(document).ready(function() {
        $('.fr-toolbar, .bbCodeEditor-toolbar').each(function() {
            XenForo.LolzPaintBtn($(this));
        });
    });

    class LolzPaintApp {
        constructor() {
            this.COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF', '#000000'];
            this.history = [];
            this.historyStep = -1;
            this.currentTool = 'brush';
            this.currentColor = '#FF0000';
            this.currentLineWidth = 3;
            this.isDrawing = false;
            this.currentBgType = 'color';
            this.currentBgColor = '#FFFFFF';
            this.activeTextObj = null;

            this.initUI();
        }

        initUI() {
            this.$modal = $('<div class="lz-paint-modal">');
            this.$box = $('<div class="lz-editor-box">');
            this.$toolbar = $('<div class="lz-toolbar">');
            this.$canvasWrap = $('<div class="lz-canvas-wrap">');
            this.$bottomBar = $('<div class="lz-bottom-bar">');

            this.canvas = document.createElement('canvas');
            this.canvas.width = 800;
            this.canvas.height = 500;
            this.canvas.style.display = 'block';
            this.ctx = this.canvas.getContext('2d');
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, 800, 500);

            this.$canvasWrap.append(this.canvas);
            this.initResizer();
            this.buildTools();
            this.buildPalette();
            this.buildControls();
            this.bindEvents();
            this.saveState();

            this.$box.append(this.$toolbar, this.$canvasWrap, this.$bottomBar);
            this.$modal.append(this.$box).appendTo('body');
        }

        buildTools() {
            const tools = [
                { id: 'brush', icon: '<i class="fa fa-paint-brush"></i>', title: 'Кисть' },
                { id: 'rect', icon: '<i class="fa fa-stop"></i>', title: 'Прямоугольник' },
                { id: 'arrow', icon: '<i class="fa fa-location-arrow"></i>', title: 'Стрелка' },
                { id: 'text', icon: '<i class="fa fa-font"></i>', title: 'Текст' },
                { id: 'blur', icon: '<i class="fa fa-tint"></i>', title: 'Блюр' },
                { id: 'eraser', icon: '<i class="fa fa-eraser"></i>', title: 'Ластик' }
            ];

            const $container = $('<div style="display:flex; gap:5px">');
            tools.forEach(t => {
                $('<button>', { class: 'lz-btn', html: t.icon, title: t.title })
                    .toggleClass('active', t.id === 'brush')
                    .click((e) => {
                        this.applyText();
                        this.currentTool = t.id;
                        this.$toolbar.find('.lz-btn').removeClass('active');
                        $(e.currentTarget).addClass('active');
                    })
                    .appendTo($container);
            });
            this.$toolbar.append($container);

            this.$toolbar.append('<div style="width:1px; height:20px; background:#555; margin:0 5px;"></div>');

            const bgBtns = [
                { icon: '<i class="fa fa-flask"></i>', title: 'Заливка цветом', type: 'color' },
                { icon: '<i class="fa fa-th-large"></i>', title: 'Прозрачный', type: 'transparent' }
            ];
            bgBtns.forEach(b => {
                 $('<button>', { class: 'lz-btn', html: b.icon, title: b.title }).click(() => {
                     this.applyText();
                     this.currentBgType = b.type;
                     if(b.type === 'color') this.currentBgColor = this.currentColor;
                     this.fillCanvasBackground();
                     this.saveState();
                 }).appendTo(this.$toolbar);
            });
        }

        buildPalette() {
            const $pal = $('<div style="display:flex; gap:4px; margin-left:10px; align-items:center;">');
            this.COLORS.forEach(c => {
                $('<div>', { class: 'lz-swatch' }).css('background', c)
                    .click((e) => {
                        this.updateColor(c);
                        $pal.find('.lz-swatch').css('border-color', '#555');
                        $(e.currentTarget).css('border-color', 'white');
                    }).appendTo($pal);
            });
            const $input = $('<input type="color">').val(this.currentColor).css({width:0, height:0, visibility:'hidden', position:'absolute'});
            $('<label>', { html: '🌈', style: 'cursor:pointer; font-size:20px; margin-left:5px;' })
                .append($input).appendTo($pal);
            $input.on('input', (e) => {
                 this.updateColor(e.target.value);
                 $pal.find('.lz-swatch').css('border-color', '#555');
            });
            this.$toolbar.append($pal);
        }

        buildControls() {
            $('<input>', { type: 'range', min: 1, max: 40, val: this.currentLineWidth })
                .css({width: '80px', margin: '0 10px'})
                .on('input', (e) => {
                    this.currentLineWidth = parseInt(e.target.value);
                    if(this.activeTextObj) this.activeTextObj.style.fontSize = (this.currentLineWidth + 12) + 'px';
                }).appendTo(this.$toolbar);

            $('<button>', { class: 'lz-btn', html: '<i class="fa fa-copyright"></i>', title: 'Добавить водяной знак' })
                .click(() => this.addWatermark())
                .appendTo(this.$toolbar);

            $('<button>', { class: 'lz-btn', html: '<i class="fa fa-reply"></i>', style: 'margin-left:auto' })
                .click(() => this.undo())
                .appendTo(this.$toolbar);

            $('<button>', { class: 'lz-btn', text: 'Закрыть' })
                .click(() => this.$modal.remove())
                .appendTo(this.$bottomBar);

            $('<button>', { class: 'lz-btn lz-btn-green', html: '<i class="fa fa-copy"></i> Скопировать' })
                .click(() => this.copyImage())
                .appendTo(this.$bottomBar);
        }

        updateColor(c) {
            this.currentColor = c;
            if(this.activeTextObj) this.activeTextObj.style.color = c;
        }

        fillCanvasBackground() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.currentBgType === 'color') {
                this.ctx.fillStyle = this.currentBgColor;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        bindEvents() {
            const $c = $(this.canvas);
            let startX, startY, snapshot;

            $c.mousedown((e) => {
                if (this.activeTextObj && e.target !== this.activeTextObj) this.applyText();
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                if (this.currentTool === 'text') {
                    this.createFloatingText(mouseX, mouseY);
                    return;
                }
                this.isDrawing = true;
                startX = mouseX; startY = mouseY;
                snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

                if (this.currentTool === 'blur') this.pixelate(startX, startY, this.currentLineWidth * 2);
                else {
                    this.ctx.beginPath();
                    this.ctx.moveTo(startX, startY);
                }
            });

            $(window).mousemove((e) => {
                if (!this.isDrawing) return;
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;

                if (this.currentTool === 'blur') {
                    this.pixelate(x, y, this.currentLineWidth * 2);
                    return;
                }
                this.ctx.lineWidth = this.currentLineWidth;
                this.ctx.strokeStyle = (this.currentTool === 'eraser') ? (this.currentBgType === 'color' ? this.currentBgColor : 'rgba(0,0,0,1)') : this.currentColor;
                this.ctx.globalCompositeOperation = (this.currentTool === 'eraser') ? 'destination-out' : 'source-over';
                this.ctx.lineCap = 'round'; this.ctx.lineJoin = 'round';

                if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
                    this.ctx.lineTo(x, y); this.ctx.stroke();
                } else if (this.currentTool === 'rect') {
                    this.ctx.globalCompositeOperation = 'source-over';
                    this.ctx.putImageData(snapshot, 0, 0); this.ctx.strokeRect(startX, startY, x - startX, y - startY);
                } else if (this.currentTool === 'arrow') {
                    this.ctx.globalCompositeOperation = 'source-over';
                    this.ctx.putImageData(snapshot, 0, 0); this.drawArrow(startX, startY, x, y);
                }
                if (this.currentTool !== 'eraser') this.ctx.globalCompositeOperation = 'source-over';
            });

            $(window).mouseup(() => {
                if (this.isDrawing) { this.isDrawing = false; this.saveState(); }
                this.ctx.beginPath();
            });
            $(window).on('keydown.lzpaint', (e) => {
                if (e.ctrlKey && e.code === 'KeyZ') { e.preventDefault(); this.undo(); }
            });
            $(window).on('paste.lzpaint', (e) => {
                const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                for (let item of items) {
                    if (item.kind === 'file' && item.type.includes('image/')) {
                        this.applyText();
                        const blob = item.getAsFile();
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                                let w = img.width, h = img.height;
                                const maxW = window.innerWidth - 100, maxH = window.innerHeight - 200;
                                if (w > maxW) { h *= maxW/w; w = maxW; }
                                if (h > maxH) { w *= maxH/h; h = maxH; }
                                this.resizeCanvas(w, h, true);
                                this.ctx.drawImage(img, 0, 0, w, h);
                                this.saveState();
                            };
                            img.src = event.target.result;
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            });
        }

        createFloatingText(x, y) {
            this.applyText();
            const div = document.createElement('div');
            div.contentEditable = true; div.innerHTML = 'Текст';
            div.style.cssText = `position: absolute; left: ${x}px; top: ${y}px; color: ${this.currentColor}; font-size: ${this.currentLineWidth + 12}px; font-family: Arial; border: 1px dashed #000; padding: 2px; min-width: 20px; z-index: 15; cursor: move; outline: none; background: rgba(255,255,255,0.3);`;

            this.$canvasWrap.append(div);
            this.activeTextObj = div;
            setTimeout(() => div.focus(), 0);

            let isDrag = false, offX, offY;
            div.onmousedown = (e) => { isDrag = true; offX = e.offsetX; offY = e.offsetY; };
            $(window).mousemove((e) => {
                if(isDrag) {
                    const r = this.$canvasWrap[0].getBoundingClientRect();
                    div.style.left = (e.clientX - r.left - offX) + 'px';
                    div.style.top = (e.clientY - r.top - offY) + 'px';
                }
            });
            $(window).mouseup(() => isDrag = false);
            div.onkeydown = (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.applyText(); } };
        }

        applyText() {
            if (!this.activeTextObj) return;
            const rect = this.activeTextObj.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            const x = rect.left - canvasRect.left; const y = rect.top - canvasRect.top;
            const fontSize = parseInt(this.activeTextObj.style.fontSize);
            this.ctx.font = `${fontSize}px Arial`; this.ctx.fillStyle = this.activeTextObj.style.color; this.ctx.textBaseline = 'top';
            this.ctx.fillText(this.activeTextObj.innerText, x, y + 2);
            this.activeTextObj.remove(); this.activeTextObj = null; this.saveState();
        }

        addWatermark() {
            this.applyText();
            this.ctx.save();
            const text = "Lolzteam";
            this.ctx.font = "bold 24px Arial";
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            this.ctx.lineWidth = 1;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const textW = this.ctx.measureText(text).width;
            this.ctx.fillText(text, w - textW - 20, h - 20);
            this.ctx.strokeText(text, w - textW - 20, h - 20);
            this.ctx.restore();
            this.saveState();
        }

        saveState() { this.historyStep++; if (this.historyStep < this.history.length) this.history.length = this.historyStep; this.history.push(this.canvas.toDataURL()); }
        undo() { if (this.historyStep > 0) { this.historyStep--; const img = new Image(); img.src = this.history[this.historyStep]; img.onload = () => { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); this.ctx.drawImage(img, 0, 0); }; } }

        pixelate(x, y, size) {
            const pixelSize = 6; const w = size*2; const h = size*2; const sx = x-size; const sy = y-size;
            try {
                const sampleW = Math.max(1, Math.floor(w/pixelSize)); const sampleH = Math.max(1, Math.floor(h/pixelSize));
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(this.canvas, sx, sy, w, h, sx, sy, sampleW, sampleH);
                this.ctx.drawImage(this.canvas, sx, sy, sampleW, sampleH, sx, sy, w, h);
                this.ctx.imageSmoothingEnabled = true;
            } catch(e){}
        }

        drawArrow(fromx, fromy, tox, toy) {
            const headlen = 15 + this.currentLineWidth; const dx = tox - fromx, dy = toy - fromy, angle = Math.atan2(dy, dx);
            this.ctx.beginPath(); this.ctx.moveTo(fromx, fromy); this.ctx.lineTo(tox, toy);
            this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI/6), toy - headlen * Math.sin(angle - Math.PI/6));
            this.ctx.moveTo(tox, toy); this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI/6), toy - headlen * Math.sin(angle + Math.PI/6));
            this.ctx.stroke();
        }

        initResizer() {
            const $resizer = $('<div>').css({
                width: '15px', height: '15px', background: 'linear-gradient(135deg, transparent 50%, #e91e63 50%)',
                position: 'absolute', bottom: 0, right: 0, cursor: 'nwse-resize', zIndex: 20
            }).appendTo(this.$canvasWrap);

            let isResizing = false;
            $resizer.mousedown((e) => { isResizing = true; e.preventDefault(); this.applyText(); });
            $(window).mouseup(() => isResizing = false);
            $(window).mousemove((e) => {
                if (!isResizing) return;
                const rect = this.$canvasWrap[0].getBoundingClientRect();
                const newW = e.clientX - rect.left; const newH = e.clientY - rect.top;
                if (newW > 100 && newH > 100) this.resizeCanvas(newW, newH);
            });
        }

        resizeCanvas(w, h, skipSave = false) {
             const tempCanvas = document.createElement('canvas');
             tempCanvas.width = this.canvas.width; tempCanvas.height = this.canvas.height;
             tempCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
             this.$canvasWrap.css({width: w + 'px', height: h + 'px'});
             this.canvas.width = w; this.canvas.height = h;
             if (this.currentBgType === 'color') { this.ctx.fillStyle = this.currentBgColor; this.ctx.fillRect(0, 0, w, h); }
             else { this.ctx.clearRect(0, 0, w, h); }
             this.ctx.drawImage(tempCanvas, 0, 0);
             if (!skipSave) this.saveState();
        }

        copyImage() {
            this.applyText();
            this.canvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => {
                    XenForo.alert('Изображение скопировано!<br>Нажми Ctrl+V в редакторе.', 'Успешно');
                    this.$modal.remove();
                }).catch(err => {
                    XenForo.alert('Ошибка доступа к буферу обмена.', 'Ошибка');
                });
            });
        }
    }
})();
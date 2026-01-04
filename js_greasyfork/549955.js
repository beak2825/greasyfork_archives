// ==UserScript==
// @name         なん愛ch お絵描き機能
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  なんIにお絵かき機能を追加するユーザースクリプトです。
// @author       You
// @match        https://openlive2ch.pages.dev/*
// @grant        GM.addStyle
// @grant        GM.addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549955/%E3%81%AA%E3%82%93%E6%84%9Bch%20%E3%81%8A%E7%B5%B5%E6%8F%8F%E3%81%8D%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/549955/%E3%81%AA%E3%82%93%E6%84%9Bch%20%E3%81%8A%E7%B5%B5%E6%8F%8F%E3%81%8D%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const [
        mdi,
        oekaki
    ] = await Promise.all([
        'https://cdn.jsdelivr.net/npm/@mdi/js@7.4.47/mdi.js',
        'https://cdn.jsdelivr.net/npm/@onjmin/oekaki/dist/index.min.mjs'
    ].map(v => import(v)));

    GM.addStyle(`
        .grid .upper-canvas {
            opacity: 0.4;
            background-image: linear-gradient(to right, gray 1px, transparent 1px),
                              linear-gradient(to bottom, gray 1px, transparent 1px);
            background-size: var(--grid-cell-size) var(--grid-cell-size);
        }
        .tool-options {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .size-display {
            width: 50px;
            text-align: center;
        }
        .slider-wrapper {
            flex-grow: 1;
        }
        .slider-input {
            width: 100%;
        }
        .palette {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #fff;
            cursor: pointer;
            padding: 0;
        }
        #oekaki-ui-wrapper {
            user-select: none;
        }
    `);

    const uploadImageBtn = document.getElementById('upload-image-btn');
    if (!uploadImageBtn) {
        console.error('#upload-image-btn not found.');
        return;
    }

    const parent = uploadImageBtn.parentElement;
    if (parent) {
        const oekakiButton = await GM.addElement(parent, 'button', {
            id: 'oekaki-btn',
            type: 'button',
            class: 'smallbtn',
            textContent: 'お絵描き'
        });

        const imagePreview = document.getElementById('image-preview');
        const imageThumbnail = document.getElementById('image-thumbnail');

        if (!imagePreview || !imageThumbnail) {
            console.error('#image-preview or #image-thumbnail not found.');
            return;
        }

        const oekakiUIWrapper = document.createElement('div');
        oekakiUIWrapper.id = 'oekaki-ui-wrapper';
        oekakiUIWrapper.style.display = 'none';
        oekakiUIWrapper.style.position = 'fixed';
        oekakiUIWrapper.style.top = '0';
        oekakiUIWrapper.style.left = '0';
        oekakiUIWrapper.style.width = '100vw';
        oekakiUIWrapper.style.height = '100vh';
        oekakiUIWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        oekakiUIWrapper.style.zIndex = '9999';
        oekakiUIWrapper.style.flexDirection = 'column';
        oekakiUIWrapper.style.justifyContent = 'center';
        oekakiUIWrapper.style.alignItems = 'center';
        oekakiUIWrapper.style.color = '#fff';
        document.body.appendChild(oekakiUIWrapper);

        const toolPanel = document.createElement('div');
        toolPanel.style.padding = '10px';
        toolPanel.style.backgroundColor = '#333';
        toolPanel.style.borderRadius = '5px';
        toolPanel.style.display = 'flex';
        toolPanel.style.flexWrap = 'wrap';
        toolPanel.style.gap = '10px';
        toolPanel.style.marginBottom = '10px';
        oekakiUIWrapper.appendChild(toolPanel);

        const toolOptionsPanel = document.createElement('div');
        toolOptionsPanel.className = 'tool-options';
        oekakiUIWrapper.appendChild(toolOptionsPanel);

        const layerPanel = document.createElement('div');
        layerPanel.style.padding = '10px';
        layerPanel.style.backgroundColor = '#333';
        layerPanel.style.borderRadius = '5px';
        layerPanel.style.position = 'absolute';
        layerPanel.style.top = '10px';
        layerPanel.style.right = '10px';
        layerPanel.style.zIndex = '10000';
        layerPanel.style.display = 'flex';
        layerPanel.style.flexDirection = 'column';
        layerPanel.style.gap = '5px';
        layerPanel.style.maxHeight = '80vh';
        layerPanel.style.overflowY = 'auto';
        oekakiUIWrapper.appendChild(layerPanel);

        const oekakiContainer = document.createElement('div');
        oekakiContainer.style.border = '1px solid white';
        oekakiContainer.style.boxSizing = 'content-box';
        oekakiUIWrapper.appendChild(oekakiContainer);

        let activeLayer = null;
        let oekakiInitialized = false;
        let width, height;
        let choicedTool = 'ペン'; // 初期値をペンに設定
        let isErasable = false;
        let isFlipped = false;
        let isGrid = false;
        let currentColor = '#000000';
        let brushSize = 16;
        let penSize = 4;
        let eraserSize = 16;
        let dotPenScale = 1;
        oekaki.color.value = currentColor;
        oekaki.penSize.value = penSize;
        oekaki.brushSize.value = brushSize;
        oekaki.eraserSize.value = eraserSize;

        const recentColors = ['#000000', '#FFFFFF'];
        const addRecentColors = () => {
            if (choicedTool === tools.translate.label) return;
            const idx = recentColors.indexOf(currentColor);
            if (idx === 0) return;
            if (idx !== -1) recentColors.splice(idx, 1);
            recentColors.unshift(currentColor);
            if (recentColors.length > 8) recentColors.pop();
        };

        const updateToolOptions = () => {
            toolOptionsPanel.innerHTML = '';
            const choiced = Object.values(tools).find(v => v.label === choicedTool);

            const colorPickerInput = document.createElement('input');
            colorPickerInput.type = 'color';
            colorPickerInput.value = currentColor;
            colorPickerInput.oninput = (e) => {
                currentColor = e.target.value;
                oekaki.color.value = currentColor;
            };
            toolOptionsPanel.appendChild(colorPickerInput);

            recentColors.forEach(color => {
                const colorBtn = document.createElement('button');
                colorBtn.className = 'palette';
                colorBtn.style.backgroundColor = color;
                colorBtn.onclick = () => {
                    currentColor = color;
                    oekaki.color.value = currentColor;
                    colorPickerInput.value = currentColor;
                };
                toolOptionsPanel.appendChild(colorBtn);
            });

            const sizeDisplay = document.createElement('span');
            sizeDisplay.className = 'size-display';
            toolOptionsPanel.appendChild(sizeDisplay);

            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'slider-wrapper';

            if (choicedTool === tools.brush.label) {
                sizeDisplay.textContent = `${brushSize}px`;
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '1';
                slider.max = '64';
                slider.value = brushSize;
                slider.className = 'slider-input';
                slider.oninput = (e) => {
                    brushSize = parseInt(e.target.value);
                    oekaki.brushSize.value = brushSize;
                    sizeDisplay.textContent = `${brushSize}px`;
                };
                sliderWrapper.appendChild(slider);
            } else if (isGrid) {
                sizeDisplay.textContent = `${dotPenScale}倍`;
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '1';
                slider.max = '8';
                slider.value = dotPenScale;
                slider.className = 'slider-input';
                slider.oninput = (e) => {
                    dotPenScale = parseInt(e.target.value);
                    oekaki.setDotSize(dotPenScale);
                    document.documentElement.style.setProperty("--grid-cell-size", `${oekaki.getDotSize()}px`);
                    sizeDisplay.textContent = `${dotPenScale}倍`;
                };
                sliderWrapper.appendChild(slider);
            } else if (choicedTool === tools.pen.label) {
                sizeDisplay.textContent = `${penSize}px`;
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '1';
                slider.max = '64';
                slider.value = penSize;
                slider.className = 'slider-input';
                slider.oninput = (e) => {
                    penSize = parseInt(e.target.value);
                    oekaki.penSize.value = penSize;
                    sizeDisplay.textContent = `${penSize}px`;
                };
                sliderWrapper.appendChild(slider);
            } else if (choicedTool === tools.eraser.label) {
                sizeDisplay.textContent = `${eraserSize}px`;
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '1';
                slider.max = '64';
                slider.value = eraserSize;
                slider.className = 'slider-input';
                slider.oninput = (e) => {
                    eraserSize = parseInt(e.target.value);
                    oekaki.eraserSize.value = eraserSize;
                    sizeDisplay.textContent = `${eraserSize}px`;
                };
                sliderWrapper.appendChild(slider);
            }

            if (choicedTool !== tools.dropper.label && choicedTool !== tools.fill.label) {
                toolOptionsPanel.appendChild(sliderWrapper);
            }
        };

        const updateThumbnail = () => {
            const dataURL = oekaki.render().toDataURL();
            if (dataURL) {
                imageThumbnail.src = dataURL;
                document.getElementById("image-status").innerText = "プレビュー";
            }
        };

        const updateLayerPanel = () => {
            layerPanel.innerHTML = '';
            const layers = oekaki.getLayers();
            layers.forEach((layer, index) => {
                const layerItem = document.createElement('div');
                layerItem.style.display = 'flex';
                layerItem.style.alignItems = 'center';
                layerItem.style.color = '#fff';
                layerItem.style.cursor = 'pointer';
                layerItem.style.padding = '5px';
                layerItem.style.backgroundColor = activeLayer === layer ? '#555' : 'transparent';
                layerItem.style.gap = '10px';

                // レイヤー名の表示
                const layerNameSpan = document.createElement('span');
                layerNameSpan.textContent = layer.name;
                layerNameSpan.onclick = () => {
                    activeLayer = layer;
                    updateLayerPanel();
                };
                layerItem.appendChild(layerNameSpan);

                // 表示/非表示ボタン
                const visibilityButton = document.createElement('button');
                visibilityButton.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border: 1px solid #555;
                    background-color: #444;
                    color: #fff;
                    cursor: pointer;
                    border-radius: 4px;
                    width: 40px;
                    height: 40px;
            　　`;
                visibilityButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${layer.visible ? mdi.mdiEye : mdi.mdiEyeOff}"/></svg>`;
                visibilityButton.onclick = (e) => {
                    e.stopPropagation();
                    layer.visible = !layer.visible;
                    updateThumbnail();
                    updateLayerPanel();
                };
                layerItem.appendChild(visibilityButton);

                // 削除ボタン
                const deleteButton = document.createElement('button');
                deleteButton.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border: 1px solid #555;
                    background-color: #444;
                    color: #fff;
                    cursor: pointer;
                    border-radius: 4px;
                    width: 40px;
                    height: 40px;
            　　`;
                deleteButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${mdi.mdiDelete}" /></svg>`;
                deleteButton.onclick = (e) => {
                    e.stopPropagation();
                    // レイヤー削除の確認ロジック
                    if (layer.locked || (layer.used && !confirm(`${layer.name}を削除しますか？`))) {
                        return;
                    }
                    activeLayer.delete();
                    const { above, below } = activeLayer;
                    if (above) activeLayer = above;
                    else if (below) activeLayer = below;
                    else {
                        // 全てのレイヤーが削除された場合の初期化
                        const newLayer = new oekaki.LayeredCanvas("レイヤー #1");
                        activeLayer = newLayer;
                    }
                    updateLayerPanel();
                    updateThumbnail();
                };
                layerItem.appendChild(deleteButton);

                layerPanel.appendChild(layerItem);
            });
            const addLayerButton = document.createElement('button');
            addLayerButton.textContent = 'レイヤー追加';
            addLayerButton.style.cssText = 'margin-top: 10px; padding: 5px; cursor: pointer;';
            addLayerButton.onclick = () => {
                const newLayer = new oekaki.LayeredCanvas();
                newLayer.name = `レイヤー #${newLayer.index + 1}`;
                activeLayer = newLayer;
                updateLayerPanel();
            };
            layerPanel.appendChild(addLayerButton);
        };

        const mdi2DataUrl = (mdi) => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="${mdi}" fill="black" stroke="white" stroke-width="1"/></svg>`;
            const base64 = btoa(svg);
            return `data:image/svg+xml;base64,${base64}`;
        };

        const createToolButton = (label, iconName, onClick) => {
            const button = document.createElement('button');
            button.title = label;
            button.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 8px;
                border: 1px solid #555;
                background-color: #444;
                color: #fff;
                cursor: pointer;
                border-radius: 4px;
                width: 40px;
                height: 40px;
            `;
            const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('width', '24');
            svgIcon.setAttribute('height', '24');
            svgIcon.setAttribute('viewBox', '0 0 24 24');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'currentColor');
            path.setAttribute('d', iconName);
            svgIcon.appendChild(path);
            button.appendChild(svgIcon);
            button.onclick = onClick;
            return button;
        };

        const updateToolButtons = () => {
            const buttons = toolPanel.querySelectorAll('button');
            buttons.forEach(button => {
                const buttonLabel = button.title;
                if (buttonLabel === choicedTool ||
                    (buttonLabel === '常に消しゴム' && isErasable) ||
                    (buttonLabel === '左右反転' && isFlipped) ||
                    (buttonLabel === 'グリッド線' && isGrid)) {
                    button.style.backgroundColor = '#6A1B9A';
                } else {
                    button.style.backgroundColor = '#444';
                }
            });
            updateToolOptions();
        };

        const tools = {
            brush: { label: "ブラシ", icon: mdi.mdiBrush },
            pen: { label: "ペン", icon: mdi.mdiPen },
            eraser: { label: "消しゴム", icon: mdi.mdiEraser },
            dropper: { label: "カラーピッカー", icon: mdi.mdiEyedropper },
            fill: { label: "塗りつぶし", icon: mdi.mdiFormatColorFill },
            translate: { label: "ハンドツール", icon: mdi.mdiHandBackRight },
            erasable: { label: "常に消しゴム", icon: mdi.mdiEraserVariant },
            flip: { label: "左右反転", icon: mdi.mdiFlipHorizontal },
            grid: { label: "グリッド線", icon: mdi.mdiGrid },
            undo: { label: "戻る", icon: mdi.mdiUndo },
            redo: { label: "進む", icon: mdi.mdiRedo },
            save: { label: "画像を保存", icon: mdi.mdiContentSaveOutline },
            clear: { label: "全消し", icon: mdi.mdiTrashCanOutline }
        };

        const notDrawing = (e) => {
            const target = e.target;
            return (
                !getSelection()?.isCollapsed ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            );
        };

        const handleKeyDown = async (e) => {
            if (notDrawing(e)) return;
            if (!e.ctrlKey) return;
            let key = e.key.toLowerCase();
            if (e.getModifierState("CapsLock")) {
                key = /[a-z]/.test(key) ? key.toUpperCase() : key.toLowerCase();
            }

            switch (key) {
                case "1": { e.preventDefault(); choicedTool = tools.brush.label; break; }
                case "2": { e.preventDefault(); choicedTool = tools.pen.label; break; }
                case "3": { e.preventDefault(); choicedTool = tools.eraser.label; break; }
                case "4": { e.preventDefault(); choicedTool = tools.dropper.label; break; }
                case "5": { e.preventDefault(); choicedTool = tools.fill.label; break; }
                case "6": { e.preventDefault(); choicedTool = tools.translate.label; break; }
                case "e": { e.preventDefault(); isErasable = !isErasable; updateToolButtons(); break; }
                case "f": { e.preventDefault(); isFlipped = !isFlipped; oekaki.flipped.value = isFlipped; updateToolButtons(); break; }
                case "g": { e.preventDefault(); isGrid = !isGrid; oekakiContainer.classList.toggle('grid', isGrid); updateToolButtons(); break; }
                case "z": { e.preventDefault(); if (e.shiftKey) { if (activeLayer) activeLayer.redo(); } else { if (activeLayer) activeLayer.undo(); } updateThumbnail(); break; }
                case "s": {
                    e.preventDefault();
                    const dataURL = oekaki.render().toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = dataURL;
                    link.download = "drawing.png";
                    link.click();
                    break;
                }
                case "c": {
                    e.preventDefault();
                    let visible = false;
                    const bgLayer = oekaki
                    .getLayers()
                    .find((v) => v.name.includes("背景"));
                    if (bgLayer) {
                        visible = bgLayer.visible;
                        bgLayer.visible = false;
                    }
                    const blob = await new Promise(resolve => oekaki.render().toBlob(resolve));
                    if (!blob) return;
                    if (bgLayer) {
                        bgLayer.visible = visible;
                    }
                    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                    break;
                }
            }
            updateToolButtons();
        };

        window.addEventListener('paste', async (e) => {
            if (!activeLayer?.editable) return;
            const imageItem = Array.from(e.clipboardData?.items || []).find(v => v.kind === "file" && v.type.startsWith("image/"));
            if (!imageItem) return;
            const blob = imageItem.getAsFile();
            if (!blob) return;
            const bitmap = await createImageBitmap(blob);
            activeLayer.paste(bitmap);
            activeLayer.trace();
            updateThumbnail();
        });

        const dropper = (x, y) => {
            if (!activeLayer) return;
            const result = oekaki.dropper(x, y);
            if (!result) return;
            const [r, g, b, a] = result;
            if (a > 0) {
                isErasable = false;
                const hex = `#${[r, g, b]
                .map((v) => v.toString(16).padStart(2, "0"))
                .join("")}`;
                currentColor = hex;
                oekaki.color.value = currentColor;
            } else {
                isErasable = true;
            }
            updateToolOptions();
        };

        const fill = async (x, y) => {
            if (!activeLayer) return;
            const rgb = currentColor
            .slice(1)
            .match(/.{2}/g)
            ?.map((v) => Number.parseInt(v, 16));
            if (rgb?.length !== 3) return;
            const [r, g, b] = rgb;
            const data = oekaki.floodFill(
                activeLayer.data,
                width,
                height,
                x,
                y,
                isErasable ? [0, 0, 0, 0] : [r, g, b, 255],
            );
            if (data) activeLayer.data = data;
        };

        const initOekaki = async () => {
            if (oekakiInitialized) return;
            oekakiInitialized = true;

            width = Math.min(window.innerWidth * 0.8, 800);
            height = Math.min(window.innerHeight * 0.8, 600);

            oekaki.init(oekakiContainer, width, height);
            const upperCanvas = oekaki.upperLayer.value.canvas;
            if (upperCanvas) {
                upperCanvas.classList.add("upper-canvas");
            }
            document.documentElement.style.setProperty("--grid-cell-size", `${oekaki.getDotSize()}px`);

            const bgLayer = new oekaki.LayeredCanvas("白背景");
            bgLayer.fill("#FFF");
            bgLayer.trace();

            const firstLayer = new oekaki.LayeredCanvas("レイヤー #2");
            activeLayer = firstLayer;

            updateLayerPanel();

            const separator = "separator";

            [
                tools.brush, tools.pen, tools.eraser, tools.dropper, tools.fill, tools.translate,
                separator,
                tools.erasable, tools.flip, tools.grid,
                separator,
                tools.undo, tools.redo, tools.save, tools.clear
            ].forEach(t => {
                if (t === separator) {
                    const separatorElement = document.createElement('div');
                    separatorElement.style.width = '1px';
                    separatorElement.style.height = '48px';
                    separatorElement.style.backgroundColor = '#555';
                    toolPanel.appendChild(separatorElement);
                    return;
                }
                const button = createToolButton(t.label, t.icon, async () => {
                    const toggleTools = [tools.erasable, tools.flip, tools.grid];
                    if (toggleTools.includes(t)) {
                        switch (t.label) {
                            case '常に消しゴム': isErasable = !isErasable; break;
                            case '左右反転': isFlipped = !isFlipped; oekaki.flipped.value = isFlipped; break;
                            case 'グリッド線':
                                isGrid = !isGrid;
                                oekakiContainer.classList.toggle('grid', isGrid);
                                if (isGrid) {
                                    dotPenScale = 4;
                                    oekaki.setDotSize(dotPenScale);
                                    document.documentElement.style.setProperty("--grid-cell-size", `${oekaki.getDotSize()}px`);
                                }
                                break;
                        }
                    } else if (t.label === '戻る') {
                        if (activeLayer) activeLayer.undo();
                        updateThumbnail();
                    } else if (t.label === '進む') {
                        if (activeLayer) activeLayer.redo();
                        updateThumbnail();
                    } else if (t.label === '画像を保存') {
                        const dataURL = oekaki.render().toDataURL("image/png");
                        const link = document.createElement("a");
                        link.href = dataURL;
                        link.download = "drawing.png";
                        link.click();
                    } else if (t.label === '全消し') {
                        if (activeLayer) activeLayer.clear();
                        updateThumbnail();
                    } else {
                        choicedTool = t.label;
                        const choiced = Object.values(tools).find(v => v.label === choicedTool);
                        const xy = choiced.label === tools.fill.label ? "21 19" : "3 21";
                        if (oekaki.upperLayer.value.canvas) {
                            oekaki.upperLayer.value.canvas.style.cursor = `url('${mdi2DataUrl(choiced.icon)}') ${xy}, auto`;
                        }
                    }
                    updateToolButtons();
                });
                toolPanel.appendChild(button);
            });

            const choiced = Object.values(tools).find(v => v.label === choicedTool);
            const xy = choiced.label === tools.fill.label ? "21 19" : "3 21";
            oekaki.upperLayer.value.canvas.style.cursor = `url('${mdi2DataUrl(choiced.icon)}') ${xy}, auto`;
            updateToolButtons();

            let prevX = null;
            let prevY = null;
            let dropping = false;

            oekaki.onDraw((x, y, buttons) => {
                if (!activeLayer?.editable) return;
                if (prevX === null) prevX = x;
                if (prevY === null) prevY = y;
                if (choicedTool === tools.dropper.label || (buttons & 2) !== 0) {
                    dropper(x, y);
                    dropping = true;
                } else {
                    if (choicedTool === tools.brush.label) {
                        activeLayer.drawLine(x, y, prevX, prevY);
                    } else if (choicedTool === tools.translate.label) {
                        if (isGrid) {
                            activeLayer.translateByDot(x - prevX, y - prevY);
                        } else {
                            activeLayer.translate(x - prevX, y - prevY);
                        }
                    } else {
                        const lerps = oekaki.lerp(x, y, prevX, prevY);
                        switch (choicedTool) {
                            case tools.pen.label:
                                for (const [lx, ly] of lerps) {
                                    const isEraseMode = isErasable;
                                    if (isGrid) {
                                        isEraseMode ? activeLayer.eraseByDot(lx, ly) : activeLayer.drawByDot(lx, ly);
                                    } else {
                                        isEraseMode ? activeLayer.erase(lx, ly) : activeLayer.draw(lx, ly);
                                    }
                                }
                                break;
                            case tools.eraser.label:
                                for (const [lx, ly] of lerps) {
                                    if (isGrid) {
                                        activeLayer.eraseByDot(lx, ly);
                                    } else {
                                        activeLayer.erase(lx, ly);
                                    }
                                }
                                break;
                        }
                    }
                }
                prevX = x;
                prevY = y;
            });

            const fin = () => {
                if (activeLayer?.modified()) {
                    activeLayer.trace();
                    addRecentColors();
                    updateToolOptions();
                    updateThumbnail();
                }
            };

            oekaki.onDrawn((x, y, buttons) => {
                prevX = null;
                prevY = null;
                if (!activeLayer?.editable) return;
                if (choicedTool === tools.fill.label && !dropping) fill(x, y);
                dropping = false;
                fin();
            });

            oekaki.upperLayer.value.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });

            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('paste', handleKeyDown);
        };

        oekakiButton.addEventListener('click', () => {
            imagePreview.style.display = 'block';
            oekakiUIWrapper.style.display = 'flex';
            initOekaki();
        });

        const closeButton = await GM.addElement(toolPanel, 'button', {
            textContent: '閉じる',
            style: 'padding: 5px 10px; cursor: pointer;'
        });
        closeButton.addEventListener('click', async () => {
            oekakiUIWrapper.style.display = 'none';
            const canvas = oekaki.render();
            const blob = await (new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/png');
            }));
            if (!blob) return;
            const file = new File([blob], "image.png", { type: blob.type });

            // DataTransferオブジェクトを利用してFileListを作成
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            // input要素にFileListを設定
            const fileInput = document.getElementById("image-upload");
            fileInput.files = dataTransfer.files;

            // changeイベントを発火させる
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        });
    }

})();
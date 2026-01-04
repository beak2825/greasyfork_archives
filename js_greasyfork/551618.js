// ==UserScript==
// @name         Pixel Overlay
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  хз удобно чтобы не смотреть на картинку сразу на полотне есть
// @author       .hilkach.
// @match        https://pixelbattles.ru/*
// @match        https://api.pixelbattles.ru/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551618/Pixel%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/551618/Pixel%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CANVAS_WIDTH = 1024;
    const CANVAS_HEIGHT = 768;

    const canvas = document.querySelector("#root > div > div.bZsByG_root > div.bZsByG_workbench > div.bZsByG_draggable > canvas");
    const container = document.querySelector("#root > div > div.bZsByG_root > div.bZsByG_workbench > div.bZsByG_draggable");
    if (!canvas || !container) return console.warn("хз канвас не найден или функции нет XD!");

    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = CANVAS_WIDTH;
    overlayCanvas.height = CANVAS_HEIGHT;
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.left = canvas.offsetLeft + "px";
    overlayCanvas.style.top = canvas.offsetTop + "px";
    overlayCanvas.style.pointerEvents = "none";
    overlayCanvas.style.zIndex = 9999;
    overlayCanvas.style.imageRendering = "pixelated";

    container.style.position = "relative";
    container.appendChild(overlayCanvas);

    const octx = overlayCanvas.getContext("2d");
    octx.imageSmoothingEnabled = false;

    let pixelSize = 1;
    let img = new Image();
    let offsetX = 0;
    let offsetY = 0;
    let opacity = 1.0;

 

    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.top = "10px";
    menu.style.right = "10px";
    menu.style.background = "rgba(0,0,0,0.85)";
    menu.style.color = "#fff";
    menu.style.padding = "0";
    menu.style.zIndex = 20000;
    menu.style.fontFamily = "sans-serif";
    menu.style.borderRadius = "8px";
    menu.style.width = "190px";
    menu.style.fontSize = "14px";
    menu.style.userSelect = "none";
    menu.style.boxShadow = "0 0 8px rgba(0,0,0,0.5)";

    menu.innerHTML = `
        <div id="menuHeader" style="
            background: #222;
            padding: 6px 10px;
            cursor: move;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            font-weight: bold;
            text-align: center;
        ">Pixel Overlay</div>
        <div style="padding: 10px;">
            <label>Пиксельный размер: <span id="pixelSizeVal">1</span></label><br>
            <input type="range" min="1" max="20" value="1" id="pixelRange" style="width:100%;"><br><br>

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 6px;
                margin-top: 4px;
                margin-bottom: 10px;
            ">
                <label style="display: flex; align-items: center; gap: 4px; flex: 1; white-space: nowrap;">
                    X: <input type="number" id="xCoord"
                        value="0"
                        style="width:60px; height:22px; padding:2px; text-align:center; font-size:13px; box-sizing:border-box;">
                </label>
                <label style="display: flex; align-items: center; gap: 4px; flex: 1; white-space: nowrap;">
                    Y: <input type="number" id="yCoord"
                        value="0"
                        style="width:60px; height:22px; padding:2px; text-align:center; font-size:13px; box-sizing:border-box;">
                </label>
            </div>

            <label>Прозрачность: <span id="opacityVal">100%</span></label><br>
            <input type="range" min="0" max="100" value="100" id="opacityRange" style="width:100%;"><br><br>

            <input type="file" id="imgFile" style="width:100%;">
        </div>
    `;
    document.body.appendChild(menu);



    document.getElementById("pixelRange").addEventListener("input", (e) => {
        pixelSize = parseInt(e.target.value);
        document.getElementById("pixelSizeVal").innerText = pixelSize;
        drawPixelImage();
    });

    document.getElementById("xCoord").addEventListener("change", (e) => {
        offsetX = parseInt(e.target.value);
        drawPixelImage();
    });
    document.getElementById("yCoord").addEventListener("change", (e) => {
        offsetY = parseInt(e.target.value);
        drawPixelImage();
    });

    document.getElementById("opacityRange").addEventListener("input", (e) => {
        opacity = e.target.value / 100;
        document.getElementById("opacityVal").innerText = `${e.target.value}%`;
        drawPixelImage();
    });

    document.getElementById("imgFile").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });

    img.onload = drawPixelImage;



    function drawPixelImage() {
        if (!img.complete) return;
        octx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tctx = tempCanvas.getContext("2d");
        tctx.imageSmoothingEnabled = false;
        tctx.drawImage(img, 0, 0);
        const data = tctx.getImageData(0, 0, img.width, img.height).data;

        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                const i = (y * img.width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3] * opacity;
                if (a === 0) continue;
                octx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
                octx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize);
            }
        }

        document.getElementById("xCoord").value = Math.round(offsetX);
        document.getElementById("yCoord").value = Math.round(offsetY);
    }



    let isDraggingOverlay = false, startX, startY;
    overlayCanvas.addEventListener("mousedown", (e) => {
        isDraggingOverlay = true;
        startX = e.clientX;
        startY = e.clientY;
    });
    window.addEventListener("mousemove", (e) => {
        if (!isDraggingOverlay) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        offsetX += dx;
        offsetY += dy;
        drawPixelImage();
    });
    window.addEventListener("mouseup", () => isDraggingOverlay = false);



    const menuHeader = document.getElementById("menuHeader");
    let isDraggingMenu = false, menuStartX, menuStartY, menuOffsetX, menuOffsetY;

    menuHeader.addEventListener("mousedown", (e) => {
        isDraggingMenu = true;
        menuStartX = e.clientX;
        menuStartY = e.clientY;
        const rect = menu.getBoundingClientRect();
        menuOffsetX = menuStartX - rect.left;
        menuOffsetY = menuStartY - rect.top;
        e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDraggingMenu) return;
        menu.style.left = (e.clientX - menuOffsetX) + "px";
        menu.style.top = (e.clientY - menuOffsetY) + "px";
        menu.style.right = "auto";
    });

    window.addEventListener("mouseup", () => isDraggingMenu = false);

})();

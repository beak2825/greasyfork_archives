// ==UserScript==
// @name         Pixeltracer -- PixelPlace Image Overlay Tool
// @namespace    https://pxphub.neocities.org/
// @version      0.20.0
// @description  A script that allows you to place templates over the canvas, it's easy to use and includes (almost) all fundamental features of a template tool.
// @author       Realwdpcker
// @license      MIT
// @match        https://pixelplace.io/*-*
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://pixelplace.io/js/jquery.min.js?v2=1
// @require      https://code.jquery.com/ui/1.14.1/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @resource     notyfCSS https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css
// @downloadURL https://update.greasyfork.org/scripts/548784/Pixeltracer%20--%20PixelPlace%20Image%20Overlay%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/548784/Pixeltracer%20--%20PixelPlace%20Image%20Overlay%20Tool.meta.js
// ==/UserScript==

/*
 * The icon used in this script is licensed under CC0 1.0 Universal (Public Domain).
 * See https://creativecommons.org/publicdomain/zero/1.0/ for more details.
 *
 * This script is distributed "as-is", without warranties.
 *
 * This code must not be sold, neither alone or as part of a bundle. If you paid for this script or received it as part of a bundle, please demand your money back immediately.
 * This code may also not be allowed to be processed through and/or modified with generative AI or generative tools AND/OR be modified without attribution to the original developer, if you so wish to, please contact the developer at @guildedbirdalt on Discord.
 */

(function() {
    'use strict';

    GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Inconsolata&family=Lexend:wght@100..900&family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');
    [material-icons] {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      display: inline-block;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    .pt-ui {
    width: 200px;
    height: auto;
    background-color: #222222;
    z-index: 1000;
    display: none;
    position: absolute;
    top: 170px;
    left: 65px;
    padding: 5px;
    border-radius: 5px;
    border: #ffffff 2px solid;
    }
    .pt-settings-ui {
    width: auto;
    height: auto;
    background-color: #222222;
    z-index: 1000;
    display: none;
    position: absolute;
    top: 170px;
    left: 270px;
    padding: 5px;
    border-radius: 5px;
    border: #ffffff 2px solid;
    color: white;
    flex-direction: column;
    }
    .pt-ui input[type=range]::-webkit-slider-runnable-track {
  background-color: transparent;
  border-radius: 5px;
  border: 1px solid #444444;
  }
  .opacity-container input[type=range] {
  margin: 0px !important;
  }
  .pt-ui input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  height: 10px;
  width: 10px;
  margin-top: 0.5px;
  transition: transform 0.1s ease-in-out;
    }
    .pt-ui input[type=range]::-webkit-slider-thumb:hover {
  transform: scale(1.75);
    }
    .x-header, .y-header, .scale-header, .opacity-header {
    font-size: 14px;
    color: white;
    font-family: Lexend, sans-serif;
    display: flex;
    align-items: center;
    column-gap: 2.5px;
    }
    .x-coordinate, .y-coordinate, .scale-input, .opacity-input {
    font-size: 14px;
    color: white;
    font-family: Mulish, sans-serif;
    }
    .x-coordinate, .y-coordinate, .scale-input {
    width: 70px;
    }
    .x-container, .y-container, .scale-container, .opacity-container {
    display: flex;
    column-gap: 2.5px;
    }
    .pt-label {
    font-size: 16px;
    color: white;
    font-family: Lexend, sans-serif;
    }
    .pt-version {
    font-size: 12px;
    color: #555555 !important;
    text-decoration: none;
    font-family: Lexend, sans-serif;
    }
    .pt-version:hover {
    color: #666666 !important;
    text-decoration: underline;
    }
    .hz-composite-divider {
    height: 2px;
    width: auto;
    z-index: 1001;
    position: relative;
    background: linear-gradient(90deg,rgba(83, 83, 83, 1) 0%, rgba(83, 83, 83, 1) 30%, rgba(83, 83, 83, 1) 70%, rgba(0, 0, 0, 0) 100%);
    margin: 3px 0px 3px 0px;
    }
    .vt-composite-divider {
    height: auto;
    width: 2px;
    z-index: 1001;
    position: relative;
    background: linear-gradient(180deg,rgba(0, 0, 0, 0) 0%, rgba(83, 83, 83, 1) 30%, rgba(83, 83, 83, 1) 70%, rgba(0, 0, 0, 0) 100%);
    margin: 0px 3px 0px 3px;
    }
    .header-container {
    display: flex;
    justify-content: space-between;
    }
    .action-buttons {
    display: flex;
    width: auto;
    gap: 5px;
    }
    .action-buttons > button {
    background-color: transparent !important;
    margin: 0px;
    padding: 0px;
    }
    .action-buttons > button:hover {
    background-color: transparent !important;
    filter: brightness(0.5);
    cursor: pointer;
}
.action-buttons > button:disabled,
.action-buttons > button[disabled] {
    filter: none !important;
    pointer-events: none !important;
    cursor: not-allowed !important;
    opacity: 0.5;
}
    .pt-overlay {
    position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
	z-index: 1000;
    }
    .tools-container {
    row-gap: 5px;
    display: flex;
    flex-direction: column;
    }
    .settings-btn, .minimize-ui-btn, .close-ui-btn {
    background-color: transparent !important;
    margin: 0px;
    padding: 0px;
    font-size: 14px;
    }
    .pt-settings-bg {
    display: none;
    width: 100vw;
    height: 100vh;
    background-color: #00000080;
    backdrop-filter: blur(2px);
    top: 0;
    position: absolute;
    }
    .file-reader {
    display: none;
    }
    .settings-container {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    font-size: 14px;
    color: white;
    font-family: Mulish, sans-serif;
    }
    .settings-container label, .hotkey-container label, .extra-container label, .hotkey-header-label {
    font-size: 14px;
    color: white;
    font-family: Mulish, sans-serif;
    }
    .hotkey-container label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-decoration: dotted;
    }
    .hotkey-container label:hover {
    cursor: url("data:image/png;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY2Nj/2NjY/9jY2P/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGNjY/9jY2P/Y2Nj/2NjY/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjY2P/Y2Nj/2NjY/9jY2P/Y2Nj/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY2Nj/2NjY/9jY2P/Y2Nj/2NjY/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGNjY/9jY2P/Y2Nj/2NjY/9jY2P/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6env+enp7/np6e/56env9jY2P/Y2Nj/2NjY/9jY2P/Y2Nj/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADMzMz//////////////////////56env9jY2P/Y2Nj/2NjY/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzMzM/7W1tf////8+////Pv///z7///8+/////56env9jY2P/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////+enp7/////Pv///z7///8+////Pv///z7///8+/////56env8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////56env////8+////Pv///z7///8+////Pv///z7/////np6e/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////np6e/////z7///8+////Pv///z7///8+////Pv////+enp7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////+enp7/////Pv///z7///8+////Pv///z7///8+/////56env8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////+enp7/////Pv///z7///8+////PrW1tf/MzMz/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////+enp7/np6e/56env+enp7/zMzM/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////////////////////////////////8f///+H////B////g////wf//+AP///AH///nj///z8///8/P///Pz///z8///+ef///wP///+H///8=") 0 0, auto;
    text-decoration: underline;
    }
    .extra-container label:hover {
    text-decoration: underline;
    cursor: pointer;
    }
    .hotkey-label {
    background: #333333;
    border: 1px solid #444444;
    border-radius: 4px;
    color: white;
    display: inline-block;
    font-family: Mulish, sans-serif;
    font-size: 11px;
    line-height: 1.5;
    margin: 0 .1em .1em .1em;
    padding: .1em .7em;
    text-indent: 0;
    cursor: default;
    text-transform: uppercase;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-shadow: inset -2px -2px 1px 0px rgba(0, 0, 0, 0.15);
}
.menu-container {
display: flex;
flex-direction: column;
}
.notyf__toast {
  transform-origin: center center;
  will-change: transform, opacity;
  position: relative;
  overflow: hidden;
  transform: none !important;
  cursor: pointer;
  max-width: none !important
}
.notyf__message {
  animation: none !important;
  transition: none !important;
  opacity: 1 !important;
  transform: none !important;
}
.notyf__toast--warning {
  background: orange !important;
}
.notyf.disabled {
  display: none !important;
}
.canvas-blending-switcher {
color: white;
font-family: Mulish, sans-serif;
}
.pt-settings-ui select option {
background-color: #222222;
font-family: Mulish, sans-serif;
}
    `);

    let img = new Image();
    let imgDataURL = null;
    let posX = 0, posY = 0, scale = 1, opacity = 0.5;
    let rotation = 0;

    const overlayElem = document.createElement("canvas");
    overlayElem.className = "pt-overlay"
    const settingsBG = document.createElement("div");
    settingsBG.className = "pt-settings-bg"
    const fileReader = $('<input type="file" accept="image/*" class="file-reader">')[0]
    const materialIcons = document.createElement('link');
    materialIcons.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    materialIcons.rel = 'stylesheet';
    const jQCss = document.createElement('link');
    jQCss.rel = 'stylesheet';
    jQCss.href = 'https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css';
    document.head.append(materialIcons, jQCss);
    const notyf = new Notyf({
        ripple: false,
        duration: 2000,
        maxVisibleNotifications: 1,
        position: { x: 'center', y: 'top' }
    });
    GM_addStyle(GM_getResourceText("notyfCSS"));
    let menuButtons = $('#menu-buttons')
    const openPTButton = $('<a href="#" title="Open Pixeltracer" id="open-pixeltracer-button" class="grey margin-top-button"><img src="https://i.imgur.com/tLWE5SR.png" alt="icon"></a>')

    const pixeltracerUI = document.createElement('div');
    pixeltracerUI.className = "pt-ui";
    pixeltracerUI.innerHTML = `
    <div class="header-container">
    <div class="header-content-container">
    <label class="pt-label">Pixeltracer</label>
    </div>
    <div class="ui-button-container">
    <button class="settings-btn" title="Minimize..." material-icons>settings</button>
    <button class="minimize-ui-btn" title="Minimize..." material-icons>minimize</button>
    <button class="close-ui-btn" title="Close..." material-icons>close</button>
    </div>
    </div>
    <div class="components-container">
    <div class="hz-composite-divider"></div>
    <div class="action-buttons">
    <button class="image-upload-btn" title="Open an image..." material-icons>upload</button>
    <button disabled class="remove-image-btn" title="Remove overlay..." material-icons>delete</button>
    <button disabled class="hide-overlay-btn" title="Hide overlay..." material-icons>visibility</button>
    <button disabled class="reset-overlay-btn" title="Reset overlay..." material-icons>cleaning_services</button>
    <button disabled class="flip-overlay-btn" title="Flip overlay..." material-icons>flip</button>
    <button disabled class="rotate-overlay-btn" title="Rotate overlay..." material-icons>rotate_90_degrees_cw</button>
    </div>
    <div class="tools-container">
    <div class="x-container">
    <label class="x-header">X: </label>
    <input class="x-coordinate" type="number" step="1" value="${posX}"></input>
    </div>
    <div class="y-container">
    <label class="y-header">Y: </label>
    <input class="y-coordinate" type="number" step="1" value="${posY}"></input>
    </div>
    <div class="scale-container">
    <label class="scale-header">Scale: </label>
    <input class="scale-input" type="number" step="0.01" value="${scale}"></input>
    </div>
    <div class="opacity-container">
    <label class="opacity-header">Opacity: </label>
    <input class="opacity-input" type="range" min="0" max="1" step="0.01" value="${opacity}"></input>
    </div>
    </div>
    </div>
    `

    const pixeltracerSettingsUI = document.createElement('div');
    pixeltracerSettingsUI.className = "pt-settings-ui";
    pixeltracerSettingsUI.innerHTML = `
    <div class="header-container">
    <div class="header-content-container">
    <label class="pt-label">Settings</label>
    </div>
    </div>
    <div class="hz-composite-divider"></div>
    </div>
    <div class="menu-container">
    <div class="settings-container">
    <label><input type="checkbox" class="notification-toggle" checked> Show notifications</label>
    <select class="canvas-blending-switcher">
    <option value="" disabled selected>Select blending mode...</option>
    <option value="normal">Normal</option>
    <option value="multiply">Multiply</option>
    <option value="screen">Screen</option>
    <option value="overlay">Overlay</option>
    <option value="darken">Darken</option>
    <option value="lighten">Lighten</option>
    <option value="color-dodge">Color Dodge</option>
    <option value="color-burn">Color Burn</option>
    <option value="hard-light">Hard Light</option>
    <option value="soft-light">Soft Light</option>
    <option value="difference">Difference</option>
    <option value="exclusion">Exclusion</option>
    <option value="hue">Hue</option>
    <option value="saturation">Saturation</option>
    <option value="color">Color</option>
    <option value="luminosity">Luminosity</option>
    </select>
    </div>
    <div class="header-container">
    <div class="header-content-container">
    <label class="pt-label">Hotkeys</label>
    </div>
    </div>
    <div class="hz-composite-divider"></div>
    </div>
    <div class="hotkey-container">
    <span class="hotkey-header-label">Hover over a hotkey to view the info.</span><br>
    <div class="hotkey-label">SHIFT</div><label title="SHIFT + Right click to jump the overlay to your mouse position.">+ Right Click</label><br>
    <div class="hotkey-label">SHIFT</div><label title="Hold SHIFT + W + Left click to drag the overlay around.">+ W + Left Click</label><br>
    <div class="hotkey-label">SHIFT</div><label title="SHIFT + Q to enable auto color picking.">+ Q</label><br>
    <div class="hotkey-label">CTRL</div><label title="SHIFT + Middle click to select the pixel color at your current mouse position.">+ Middle Click</label>
    </div>
    <div class="extra-container">
    <div class="hz-composite-divider"></div>
    <label class="pt-view-1">View script info</label><br>
    <label class="pt-view-2">PXP Hub Website</label><br>
    <label class="pt-view-3">PXP Hub Discord</label>
    </div>
    </div>
    </div>
    </div>`

    menuButtons.append(openPTButton)
    document.body.append(pixeltracerUI, settingsBG, pixeltracerSettingsUI, fileReader, pixeltracerUI);

    /* start of ui interface dragging */
    let uiOpened = false;
    const ptUI = $(".pt-ui")[0];
    const ptSettingsUI = $(".pt-settings-ui")[0];
    const newOpenPTButton = $("#open-pixeltracer-button")[0];

    $(".pt-ui, .pt-settings-ui").draggable({
        containment: "window",
        snap: ".pt-ui,.pt-settings-ui",
        snapMode: "outer",
        stack: ".pt-ui,.pt-settings-ui",
        snapTolerance: 5
    });
    /* end of ui interface dragging */

    newOpenPTButton.addEventListener('click', (e) => {
        uiOpened = !uiOpened;
        ptUI.style.display = uiOpened ? 'block' : 'none';
    });

    /* start of overlay placement handling */
    const xValue = ptUI.querySelector('.x-coordinate');
    const yValue = ptUI.querySelector('.y-coordinate');
    const scaleValue = ptUI.querySelector('.scale-input');
    const opacityValue = ptUI.querySelector('.opacity-input');
    xValue.addEventListener("input", () => {
        posX = parseFloat(xValue.value) || 0;
        drawOverlay();
    });
    yValue.addEventListener("input", () => {
        posY = parseFloat(yValue.value) || 0;
        drawOverlay();
    });
    scaleValue.addEventListener("input", () => {
        const value = parseFloat(scaleValue.value);
        scale = value <= 0 ? 1 : value;
        drawOverlay();
    });
    opacityValue.addEventListener("input", () => {
        overlayElem.style.opacity = parseFloat(opacityValue.value);
        drawOverlay();
    });
    /* end of overlay placement handling */

    function antiNotificationStack() {
        document.querySelectorAll('.notyf__toast').forEach(el => el.remove());
    }
    function convertHexToRGB(hex) {
        const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return regex ? [parseInt(regex[1], 16), parseInt(regex[2], 16), parseInt(regex[3], 16)] : null;
    }

    function getConvertedRGBs() {
        const pixelplacePaletteColors = [];
        document.querySelectorAll("#palette-buttons a").forEach(a => {
            const hexFinder = a.getAttribute("title");
            const startRGBConversion = convertHexToRGB(hexFinder);
            if (startRGBConversion) pixelplacePaletteColors.push(startRGBConversion);
        });
        return pixelplacePaletteColors;
    }

    function scaleToCanvas() {
        const originalCanvas = document.getElementById("canvas");
        if (!originalCanvas) return;
        overlayElem.width = originalCanvas.width;
        overlayElem.height = originalCanvas.height;
        overlayElem.style.width = `${originalCanvas.width}px`;
        overlayElem.style.height = `${originalCanvas.height}px`;
        overlayElem.style.imageRendering = "pixelated";
        const container = document.getElementById("painting-move");
        if (container && !container.contains(overlayElem)) {
            container.appendChild(overlayElem);
        }
    }

    function getNearestPaletteColor(r, g, b, palette) {
        let minDist = Infinity,
            best = [r, g, b];
        for (const [pr, pg, pb] of palette) {
            const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
            if (dist < minDist) {
                minDist = dist;
                best = [pr, pg, pb];
            }
        }
        return best;
    }
    let flipped = false;
    let rotated = false;
    function drawOverlay() {
        if (!imgDataURL || !img.complete || img.naturalWidth === 0) return;

        const ctx = overlayElem.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, overlayElem.width, overlayElem.height);

        const off = document.createElement("canvas");
        off.width = img.naturalWidth;
        off.height = img.naturalHeight;
        const offCtx = off.getContext("2d");
        offCtx.drawImage(img, 0, 0);

        let imageData = offCtx.getImageData(0, 0, off.width, off.height);
        const palette = getConvertedRGBs();

        const drawX = Math.round(posX);
        const drawY = Math.round(posY);
        const drawW = Math.round(off.width * scale);
        const drawH = Math.round(off.height * scale);
        ctx.save();
        ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
        ctx.rotate(rotation * Math.PI / 180);
        if (flipped) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            off,
            0, 0, off.width, off.height,
            -drawW / 2, -drawH / 2, drawW, drawH
        );
        ctx.restore();
    };
    img.onload = () => {
        scaleToCanvas()
        drawOverlay()
    }
    const closeUIButton = ptUI.querySelector(".close-ui-btn");
    closeUIButton.onclick = () => {
        pixeltracerUI.style.display = "none";
        uiOpened = false;
    }
    let minimized = false; let hidden = false; let opened = false; let notyfChecked = false; let notificationsEnabled = true;
    const components = ptUI.querySelector(".components-container");
    const minimizeUIButton = ptUI.querySelector(".minimize-ui-btn");
    minimizeUIButton.onclick = () => {
        minimized = !minimized;
        components.style.display = minimized ? 'none' : 'block';
    }
    const openImageButton = ptUI.querySelector(".image-upload-btn");
    openImageButton.onclick = () => fileReader.click();
    fileReader.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            removeImageButton.disabled = false;
            hideOverlayButton.disabled = false;
            resetOverlayButton.disabled = false;
            flipOverlayButton.disabled = false;
            rotateOverlayButton.disabled = false;
            imgDataURL = evt.target.result;
            img.src = imgDataURL;
            overlayElem.style.opacity = parseFloat(opacityValue.value);
        };
        reader.readAsDataURL(file);
    };

    const removeImageButton = ptUI.querySelector(".remove-image-btn");
    removeImageButton.onclick = () => {
        imgDataURL = "";
        img.src = "";
        removeImageButton.disabled = true;
        hideOverlayButton.disabled = true;
        resetOverlayButton.disabled = true;
        flipOverlayButton.disabled = true;
        rotateOverlayButton.disabled = true;
        overlayElem.getContext("2d").clearRect(0, 0, overlayElem.width, overlayElem.height);
        fileReader.value = "";
        antiNotificationStack();
        notyf.success(`Overlay removed successfully`);
    };
    const rotateOverlayButton = ptUI.querySelector(".rotate-overlay-btn");
    rotateOverlayButton.onclick = () => {
        rotation = (rotation + 90) % 360;
        drawOverlay();
    }
    const hideOverlayButton = ptUI.querySelector(".hide-overlay-btn");
    hideOverlayButton.onclick = () => {
        opened = !opened;
        hideOverlayButton.textContent = opened ? 'visibility_off' : 'visibility';
        overlayElem.style.display = opened ? 'none' : 'block';
        if (opened) {
            antiNotificationStack();
            notyf.open({
                type: 'warning', className: 'notyf__toast--warning', message: `Overlay hidden at coordinate: ${posX} & ${posY}`, icon: {
                    className: 'material-icons',
                    tagName: 'i',
                    text: 'warning'
                }});
        } else {
            antiNotificationStack();
            notyf.success(`Overlay shown at coordinate: ${posX} & ${posY}`);
        }
    };
    const settingsButton = ptUI.querySelector(".settings-btn");
    settingsButton.onclick = () => {
        hidden = !hidden;
        pixeltracerSettingsUI.style.display = hidden ? 'flex' : 'none';
    };
    const resetOverlayButton = ptUI.querySelector(".reset-overlay-btn");
    resetOverlayButton.onclick = () => {
        posX = 0;
        ptUI.querySelector('.x-coordinate').value = `${posX}`;
        posY = 0;
        ptUI.querySelector('.y-coordinate').value = `${posY}`;
        scale = 1;
        ptUI.querySelector('.scale-input').value = `${scale}`;
        overlayElem.style.opacity = "0.5";
        ptUI.querySelector('.opacity-input').value = `${opacity}`;
        rotation = 0;
        flipped = false;
        drawOverlay()
        antiNotificationStack();
        notyf.success(`Overlay reset successfully`);
    };
    const notificationsCheckbox = ptSettingsUI.querySelector(".notification-toggle");

    notificationsCheckbox.onclick = () => {
        notificationsEnabled = !notificationsEnabled;

        if (!notificationsEnabled) {
            document.querySelectorAll('.notyf__toast').forEach(el => el.remove());
            notyf.dismissAll();
        }
    };
    const flipOverlayButton = ptUI.querySelector(".flip-overlay-btn");
    flipOverlayButton.onclick = () => {
        flipped = !flipped;
        drawOverlay();
    }
    const bindNotyf = notyf.open.bind(notyf);
    notyf.open = function (options) {
        if (!notificationsEnabled) return null;
        return bindNotyf(options);
    };

    document.addEventListener('click', (e) => {
        if (!notificationsEnabled) return;

        const toast = e.target.closest('.notyf__toast');
        if (toast) {
            toast.remove();
        }
    });
    const viewScriptInfoLabel = ptSettingsUI.querySelector(".pt-view-1");
    const viewScriptWebsite = ptSettingsUI.querySelector(".pt-view-2");
    const viewScriptDiscord = ptSettingsUI.querySelector(".pt-view-3");
    viewScriptInfoLabel.onclick = () => {
        alert(`You are currently running version 0.20.0 of Pixeltracer`);
    };
    viewScriptWebsite.onclick = () => {
        if (!confirm("Visit the PXP Hub Website? This will redirect you off this page.")) return;
        window.open("https://pxphub.neocities.org/pixeltracer", "_blank");
    };
    viewScriptDiscord.onclick = () => {
        if (!confirm("Join the PXP Hub Community Discord? This will redirect you off this page.")) return;
        window.open("https://discord.gg/KgYavKWXSN", "_blank");
    };
    const overlayBlendingSelect = document.querySelector(".canvas-blending-switcher");
    overlayBlendingSelect.addEventListener("change", e => {
        overlayElem.style.mixBlendMode = e.target.value;
    });
    let colorPick = null;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let wPressed = false;
    let autoColorPick = false;
    // e button 0 is left click, e button 1 is middle click, e button 2 is right click
    // turned the color picking block into a global function so I don't have to copy and paste the block everytime
    function colorPickFunc(clickX, clickY) {
        let relX = Math.floor((clickX - posX) / scale);
        let relY = Math.floor((clickY - posY) / scale);

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const cx = w / 2;
        const cy = h / 2;

        if (rotation) {
            const rad = -rotation * Math.PI / 180;
            let dx = relX - cx;
            let dy = relY - cy;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            relX = Math.floor(dx * cos - dy * sin + cx);
            relY = Math.floor(dx * sin + dy * cos + cy);
        }

        if (flipped) {
            relX = w - 1 - relX;
        }

        const srcW = w;
        const srcH = h;
        if (relX < 0 || relY < 0 || relX >= srcW || relY >= srcH) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = srcW;
        tempCanvas.height = srcH;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(img, 0, 0);

        const data = tempCtx.getImageData(relX, relY, 1, 1).data;
        const [r, g, b, a] = data;
        if (a < 10) return;

        colorPick = { r, g, b };
    }
    function selectFoundColor() {
        if (!colorPick) return;

        const { r, g, b } = colorPick;
        const palette = getConvertedRGBs();
        const [nr, ng, nb] = getNearestPaletteColor(r, g, b, palette);

        document.querySelectorAll("#palette-buttons a").forEach(a => {
            const hex = a.getAttribute("title");
            const rgb = convertHexToRGB(hex);
            if (!rgb) return;
            const [pr, pg, pb] = rgb;
            if (pr === nr && pg === ng && pb === nb) {
                a.click();
            }
        });
    }
    document.addEventListener("keydown", e => {
        if (e.key?.toLowerCase() === "w") { wPressed = true };
        if (e.key?.toLowerCase() === "q" && e.shiftKey && !e.repeat) { autoColorPick = !autoColorPick; if (autoColorPick) { antiNotificationStack(); notyf.success('Auto click picking enabled');} else if (!autoColorPick) { antiNotificationStack(); notyf.open({
            type: 'warning',
            className: 'notyf__toast--warning',
            message: `Auto click picking disabled`,
            icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'warning'
            }
        });}
                                                                     };
    });
    document.addEventListener("keyup", e => {
        if (e.key?.toLowerCase() === "w") { wPressed = false };
    });
    let holdNotificationActive = false;
    document.addEventListener("keydown", e => {
        if (e.shiftKey && wPressed && overlayElem?.isConnected) {
            if (!holdNotificationActive) {
                antiNotificationStack();
                notyf.open({
                    type: 'warning',
                    className: 'notyf__toast--warning',
                    message: `Hold to drag mode enabled`,
                    icon: {
                        className: 'material-icons',
                        tagName: 'i',
                        text: 'warning'
                    }
                });
                holdNotificationActive = true;
            }
            const painting = document.querySelector("#painting");
            if (painting) painting.style.pointerEvents = "none";
        }
    });
    document.addEventListener("keyup", e => {
        if (holdNotificationActive) {
            const painting = document.querySelector("#painting");
            if (painting) painting.style.pointerEvents = "";
            antiNotificationStack();
            notyf.success('Hold to drag mode disabled');
            holdNotificationActive = false;
        }
    });
    document.addEventListener("mousedown", e => {
        if (!imgDataURL) return;

        const canvas = document.getElementsByClassName("pt-overlay")[0];
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;

        if (e.shiftKey && e.button === 2 && e.button !== 1) {
            posX = Math.round(clickX);
            posY = Math.round(clickY);
            drawOverlay();

            xValue.value = posX;
            yValue.value = posY;
        } else if (e.button === 1 && e.ctrlKey) {
            e.preventDefault();
            colorPickFunc(clickX, clickY);
        } else if (e.shiftKey && wPressed && e.button === 0) {
            isDragging = true;
            e.preventDefault();
            dragOffsetX = clickX - posX;
            dragOffsetY = clickY - posY;
        }
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;

        const canvas = document.getElementsByClassName("pt-overlay")[0];
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const moveX = (e.clientX - rect.left) * scaleX;
        const moveY = (e.clientY - rect.top) * scaleY;

        if (isDragging) {
            posX = Math.round(moveX - dragOffsetX);
            posY = Math.round(moveY - dragOffsetY);
            drawOverlay();

            xValue.value = posX;
            yValue.value = posY;
        }
    });
    let lastPickedColor = null;
    document.addEventListener("mousemove", e => {
        const canvas = document.getElementsByClassName("pt-overlay")[0];
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const moveX = (e.clientX - rect.left) * scaleX;
        const moveY = (e.clientY - rect.top) * scaleY;
        if (autoColorPick) {
            colorPickFunc(moveX, moveY);
        }
        if (colorPick) {
            const { r, g, b } = colorPick;
            if (!lastPickedColor || r !== lastPickedColor.r || g !== lastPickedColor.g || b !== lastPickedColor.b) {
                lastPickedColor = { r, g, b };
                selectFoundColor();
            }
        }
    });
    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
        }
        if (colorPick) {
            selectFoundColor()
            colorPick = null;
        }
    });
})();
// ==UserScript==
// @name         🖼️ Avatar Editor
// @namespace    http://tampermonkey.net/
// @version      8.8
// @description  Drag & drop image, move/scale, live Brightness/Contrast/Sharpen/Warm-Cool/Saturation/Rotate preview, optional rotate mode, export to camera roll.
// @match        https://*.popmundo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560883/%F0%9F%96%BC%EF%B8%8F%20Avatar%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/560883/%F0%9F%96%BC%EF%B8%8F%20Avatar%20Editor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener("load", () => {
    const avatar = document.querySelector(".avatar.pointer.idTrigger") || document.querySelector(".avatar");
    if (!avatar) return;

    avatar.removeAttribute("onclick");
    avatar.style.cursor = "default";
    avatar.style.position = "relative";
    avatar.style.overflow = "hidden";
    avatar.style.touchAction = "none";

    const img = document.createElement("img");
    img.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      max-width: none; max-height: none;
      user-select: none; cursor: move;
      touch-action: none;
    `;
    avatar.appendChild(img);

    let aspectRatio = 1;
    let isDragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
    let isTouchDragging = false, touchId = null;
    let rotateMode = false;
    let rotScale = 1;
    let rotOffsetX = 0;
    let rotOffsetY = 0;
    let previewCanvas, previewCtx;
    let zoomLevel = 1;
    let baseWidth = 0;
    let baseHeight = 0;

    // --- Mobile detection ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // --- Control panel ---
    const panel = document.createElement("div");

    if (isMobile) {
      // Mobile: Simple floating button that expands
      panel.style.cssText = `
        position: fixed;
        bottom: 15px;
        right: 15px;
        z-index: 9999;
      `;

      const miniButton = document.createElement("button");
      miniButton.textContent = "🎨";
      miniButton.style.cssText = `
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #88d3ce 0%, #6ec6ba 100%);
        border: 2px solid #5db4aa;
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      panel.appendChild(miniButton);

      // Mobile panel content (hidden initially)
      const mobilePanel = document.createElement("div");
      mobilePanel.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 15px;
        background: rgba(255, 255, 255, 0.98);
        padding: 12px 14px;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        border: 2px solid #88d3ce;
        width: 280px;
        max-height: 70vh;
        overflow-y: auto;
        display: none;
        backdrop-filter: blur(10px);
        z-index: 9998;
      `;

      mobilePanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #c1e7e3;">
          <span style="font-weight:bold; color:#2c5e5a; font-size:14px;">🎨 Avatar Editor</span>
          <button id="closeMobilePanel" style="background:#f08080; color:white; border:none; border-radius:4px; padding:2px 8px; font-size:12px;">✕</button>
        </div>

        <div style="margin-bottom:12px;">
          <button id="mobileUploadBtn" style="width:100%; padding:10px; background:linear-gradient(135deg, #88d3ce 0%, #6ec6ba 100%); color:white; border:none; border-radius:6px; font-size:14px; margin-bottom:6px;">📁 Upload Image</button>
          <button id="mobileCopyBtn" style="width:100%; padding:10px; background:linear-gradient(135deg, #9fd8cb 0%, #7dc9b9 100%); color:white; border:none; border-radius:6px; font-size:14px;">📋 Copy to Clipboard</button>
        </div>

        <div style="margin-bottom:6px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Brightness</span>
            <span id="brightValue" style="font-size:12px; color:#2c5e5a;">1.00</span>
          </div>
          <input type="range" id="brightSlider" min="0.5" max="1.5" step="0.01" value="1" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <div style="margin-bottom:6px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Contrast</span>
            <span id="contrastValue" style="font-size:12px; color:#2c5e5a;">1.00</span>
          </div>
          <input type="range" id="contrastSlider" min="0.5" max="2.0" step="0.01" value="1" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <div style="margin-bottom:6px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Sharpen</span>
            <span id="sharpValue" style="font-size:12px; color:#2c5e5a;">0</span>
          </div>
          <input type="range" id="sharpSlider" min="0" max="3" step="0.1" value="0" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <div style="margin-bottom:6px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Warm/Cool</span>
            <span id="warmValue" style="font-size:12px; color:#2c5e5a;">0</span>
          </div>
          <input type="range" id="warmSlider" min="-100" max="100" step="1" value="0" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <div style="margin-bottom:6px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Saturation</span>
            <span id="satValue" style="font-size:12px; color:#2c5e5a;">1.00</span>
          </div>
          <input type="range" id="satSlider" min="0" max="2" step="0.01" value="1" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <div style="margin-bottom:6px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Rotate</span>
            <span id="rotateValue" style="font-size:12px; color:#2c5e5a;">0°</span>
          </div>
          <input type="range" id="rotateSlider" min="0" max="360" step="1" value="0" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <div style="margin-bottom:12px; line-height: 1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="font-size:12px; color:#2c5e5a;">Zoom</span>
            <span id="zoomValue" style="font-size:12px; color:#2c5e5a;">100%</span>
          </div>
          <input type="range" id="zoomSlider" min="10" max="500" step="1" value="100" style="width:100%; height:20px; accent-color:#88d3ce; margin:0;">
        </div>

        <button id="rotateModeBtn" style="width:100%; padding:10px; background:#c1e7e3; color:#2c5e5a; border:1px solid #9fd8cb; border-radius:6px; font-size:14px; margin-bottom:10px;">🌀 Rotate OFF</button>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px;">
          <button id="exportBtn" style="padding:10px; background:linear-gradient(135deg, #9fd8cb 0%, #7dc9b9 100%); color:white; border:none; border-radius:6px; font-size:14px;">📸 Save to Photos</button>
          <button id="resetBtn" style="padding:10px; background:linear-gradient(135deg, #f4a7a7 0%, #f08080 100%); color:white; border:none; border-radius:6px; font-size:14px;">🔄 Reset</button>
        </div>

        <div style="font-size:11px; color:#5db4aa; text-align:center; padding-top:8px; border-top:1px solid #c1e7e3; line-height:1.2;">
          • Drag to move • Pinch to zoom •
        </div>
      `;

      panel.appendChild(mobilePanel);

      // Toggle mobile panel
      miniButton.addEventListener('click', () => {
        mobilePanel.style.display = mobilePanel.style.display === 'none' ? 'block' : 'none';
      });

      // Close button for mobile panel
      const closeMobilePanel = mobilePanel.querySelector('#closeMobilePanel');
      closeMobilePanel.addEventListener('click', () => {
        mobilePanel.style.display = 'none';
      });

    } else {
      // Desktop: Fixed panel with pastel colors - NO ZOOM SLIDER
      panel.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.95);
        padding: 10px 12px;
        border-radius: 10px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
        font-size: 11px;
        color: #2c5e5a;
        z-index: 9999;
        border: 1px solid #88d3ce;
        min-width: 220px;
        backdrop-filter: blur(5px);
      `;

      panel.innerHTML = `
        <div style="font-weight:bold; margin-bottom:8px; color:#2c5e5a;">🎨 Avatar Editor</div>
        <button id="copyClipboardBtn" style="width:100%; padding:6px; background:linear-gradient(135deg, #9fd8cb 0%, #7dc9b9 100%); color:white; border:none; border-radius:5px; margin-bottom:8px; font-size:11px;">📋 Copy to Clipboard</button>

        <div style="margin-bottom:4px; line-height: 1;">
          <div style="display:flex; justify-content:space-between;">
            <span>Brightness</span>
            <span id="brightValue">1.00</span>
          </div>
          <input type="range" id="brightSlider" min="0.5" max="1.5" step="0.01" value="1" style="width:100%; margin:2px 0;">
        </div>

        <div style="margin-bottom:4px; line-height: 1;">
          <div style="display:flex; justify-content:space-between;">
            <span>Contrast</span>
            <span id="contrastValue">1.00</span>
          </div>
          <input type="range" id="contrastSlider" min="0.5" max="2.0" step="0.01" value="1" style="width:100%; margin:2px 0;">
        </div>

        <div style="margin-bottom:4px; line-height: 1;">
          <div style="display:flex; justify-content:space-between;">
            <span>Sharpen</span>
            <span id="sharpValue">0</span>
          </div>
          <input type="range" id="sharpSlider" min="0" max="3" step="0.1" value="0" style="width:100%; margin:2px 0;">
        </div>

        <div style="margin-bottom:4px; line-height: 1;">
          <div style="display:flex; justify-content:space-between;">
            <span>Warm/Cool</span>
            <span id="warmValue">0</span>
          </div>
          <input type="range" id="warmSlider" min="-100" max="100" step="1" value="0" style="width:100%; margin:2px 0;">
        </div>

        <div style="margin-bottom:4px; line-height: 1;">
          <div style="display:flex; justify-content:space-between;">
            <span>Saturation</span>
            <span id="satValue">1.00</span>
          </div>
          <input type="range" id="satSlider" min="0" max="2" step="0.01" value="1" style="width:100%; margin:2px 0;">
        </div>

        <div style="margin-bottom:4px; line-height: 1;">
          <div style="display:flex; justify-content:space-between;">
            <span>Rotate</span>
            <span id="rotateValue">0°</span>
          </div>
          <input type="range" id="rotateSlider" min="0" max="360" step="1" value="0" style="width:100%; margin:2px 0;">
        </div>

        <button id="rotateModeBtn" style="width:100%; padding:6px; background:#c1e7e3; color:#2c5e5a; border:1px solid #9fd8cb; border-radius:5px; margin-bottom:8px; font-size:11px;">🌀 Rotate OFF</button>

        <div style="display:flex; gap:6px;">
          <button id="exportBtn" style="flex:1; padding:6px; background:linear-gradient(135deg, #9fd8cb 0%, #7dc9b9 100%); color:white; border:none; border-radius:5px; font-size:11px;">Export</button>
          <button id="resetBtn" style="flex:1; padding:6px; background:linear-gradient(135deg, #f4a7a7 0%, #f08080 100%); color:white; border:none; border-radius:5px; font-size:11px;">Reset</button>
        </div>
      `;
    }

    document.body.appendChild(panel);

    // File input for upload
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Upload functionality
    if (isMobile) {
      const mobileUploadBtn = panel.querySelector('#mobileUploadBtn') || panel.parentNode?.querySelector('#mobileUploadBtn');
      if (mobileUploadBtn) {
        mobileUploadBtn.addEventListener('click', () => fileInput.click());
      }

      const mobileCopyBtn = panel.querySelector('#mobileCopyBtn') || panel.parentNode?.querySelector('#mobileCopyBtn');
      if (mobileCopyBtn) {
        mobileCopyBtn.addEventListener('click', copyToClipboard);
      }
    } else {
      // Desktop drag & drop
      avatar.addEventListener("dragover", e => e.preventDefault());
      avatar.addEventListener("drop", e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = ev => loadImage(ev.target.result);
        reader.readAsDataURL(file);
      });

      // Desktop copy button
      const copyBtn = document.getElementById('copyClipboardBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
      }
    }

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = ev => loadImage(ev.target.result);
        reader.readAsDataURL(file);
      }
    });

    // Get slider elements
    const brightSlider = document.getElementById('brightSlider');
    const contrastSlider = document.getElementById('contrastSlider');
    const sharpSlider = document.getElementById('sharpSlider');
    const warmSlider = document.getElementById('warmSlider');
    const satSlider = document.getElementById('satSlider');
    const rotateSlider = document.getElementById('rotateSlider');
    const zoomSlider = document.getElementById('zoomSlider');
    const rotateModeBtn = document.getElementById('rotateModeBtn');
    const exportBtn = document.getElementById('exportBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Update value displays
    function updateValueDisplays() {
      const brightValue = document.getElementById('brightValue');
      const contrastValue = document.getElementById('contrastValue');
      const sharpValue = document.getElementById('sharpValue');
      const warmValue = document.getElementById('warmValue');
      const satValue = document.getElementById('satValue');
      const rotateValue = document.getElementById('rotateValue');
      const zoomValue = document.getElementById('zoomValue');

      if (brightValue && brightSlider) brightValue.textContent = parseFloat(brightSlider.value).toFixed(2);
      if (contrastValue && contrastSlider) contrastValue.textContent = parseFloat(contrastSlider.value).toFixed(2);
      if (sharpValue && sharpSlider) sharpValue.textContent = parseFloat(sharpSlider.value);
      if (warmValue && warmSlider) warmValue.textContent = parseFloat(warmSlider.value);
      if (satValue && satSlider) satValue.textContent = parseFloat(satSlider.value).toFixed(2);
      if (rotateValue && rotateSlider) rotateValue.textContent = parseFloat(rotateSlider.value) + '°';
      if (zoomValue && zoomSlider) zoomValue.textContent = parseFloat(zoomSlider.value) + '%';
    }

    // Rotate mode button
    if (rotateModeBtn) {
      rotateModeBtn.addEventListener("click", () => {
        rotateMode = !rotateMode;
        rotateModeBtn.textContent = rotateMode ? "🌀 Rotate Mode ON" : "🌀 Rotate OFF";
        rotateModeBtn.style.background = rotateMode
          ? "linear-gradient(135deg, #a6d8d3 0%, #88c9c1 100%)"
          : "#c1e7e3";
      });
    }

    // Initialize value displays
    updateValueDisplays();

    function loadImage(url) {
      img.onload = () => {
        aspectRatio = img.naturalWidth / img.naturalHeight;
        const boxW = avatar.clientWidth;
        const boxH = avatar.clientHeight;
        const boxRatio = boxW / boxH;

        let newW, newH;
        if (aspectRatio > boxRatio) {
          newH = boxH;
          newW = newH * aspectRatio;
        } else {
          newW = boxW;
          newH = newW / aspectRatio;
        }

        img.style.width = newW + "px";
        img.style.height = newH + "px";
        img.style.left = ((boxW - newW) / 2) + "px";
        img.style.top = ((boxH - newH) / 2) + "px";

        // Store base dimensions for zooming
        baseWidth = newW;
        baseHeight = newH;

        if (!previewCanvas) {
          previewCanvas = document.createElement("canvas");
          previewCanvas.width = boxW * 2;
          previewCanvas.height = boxH * 2;
          previewCanvas.style.width = boxW + "px";
          previewCanvas.style.height = boxH + "px";
          previewCanvas.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: ${boxW}px;
            height: ${boxH}px;
            pointer-events: none;
          `;
          avatar.appendChild(previewCanvas);
          previewCtx = previewCanvas.getContext("2d");
        }

        rotScale = 1;
        rotOffsetX = 0;
        rotOffsetY = 0;
        zoomLevel = 1;
        if (zoomSlider) zoomSlider.value = "100";

        updateFilters();
        updateValueDisplays();
        showNotification("✅ Image loaded!");
      };
      img.src = url;
    }

    // --- Drag & drop ---
    avatar.addEventListener("dragover", e => e.preventDefault());
    avatar.addEventListener("drop", e => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = ev => loadImage(ev.target.result);
      reader.readAsDataURL(file);
    });

    // --- Mouse dragging ---
    avatar.addEventListener("mousedown", e => {
      if (!img.src) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rotateMode ? rotOffsetX : (parseInt(img.style.left) || 0);
      startTop  = rotateMode ? rotOffsetY : (parseInt(img.style.top) || 0);
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      if (rotateMode) {
        rotOffsetX = startLeft + (e.clientX - startX);
        rotOffsetY = startTop + (e.clientY - startY);
        updateFilters();
      } else {
        let newLeft = startLeft + (e.clientX - startX);
        let newTop = startTop + (e.clientY - startY);
        const minLeft = avatar.clientWidth - img.offsetWidth;
        const minTop = avatar.clientHeight - img.offsetHeight;
        if (newLeft > 0) newLeft = 0;
        if (newTop > 0) newTop = 0;
        if (newLeft < minLeft) newLeft = minLeft;
        if (newTop < minTop) newTop = minTop;
        img.style.left = newLeft + "px";
        img.style.top = newTop + "px";
        updateFilters();
      }
      e.preventDefault();
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // --- Touch dragging for mobile ---
    avatar.addEventListener("touchstart", e => {
      if (!img.src) return;
      if (touchId !== null) return;

      const touch = e.touches[0];
      touchId = touch.identifier;
      isTouchDragging = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startLeft = rotateMode ? rotOffsetX : (parseInt(img.style.left) || 0);
      startTop  = rotateMode ? rotOffsetY : (parseInt(img.style.top) || 0);
      e.preventDefault();
    }, { passive: false });

    avatar.addEventListener("touchmove", e => {
      if (!isTouchDragging) return;

      const touch = Array.from(e.touches).find(t => t.identifier === touchId);
      if (!touch) return;

      if (rotateMode) {
        rotOffsetX = startLeft + (touch.clientX - startX);
        rotOffsetY = startTop + (touch.clientY - startY);
        updateFilters();
      } else {
        let newLeft = startLeft + (touch.clientX - startX);
        let newTop = startTop + (touch.clientY - startY);
        const minLeft = avatar.clientWidth - img.offsetWidth;
        const minTop = avatar.clientHeight - img.offsetHeight;
        if (newLeft > 0) newLeft = 0;
        if (newTop > 0) newTop = 0;
        if (newLeft < minLeft) newLeft = minLeft;
        if (newTop < minTop) newTop = minTop;
        img.style.left = newLeft + "px";
        img.style.top = newTop + "px";
        updateFilters();
      }
      e.preventDefault();
    }, { passive: false });

    avatar.addEventListener("touchend", e => {
      isTouchDragging = false;
      touchId = null;
    });


      // --- Wheel zoom with different speeds for desktop vs mobile ---
    avatar.addEventListener("wheel", e => {
      if (!img.src) return;
      e.preventDefault();

      // Different zoom speeds based on mode
      let factor;
      if (isMobile) {
        // Mobile: Gentle zoom (0.5% per wheel tick)
        factor = e.deltaY < 0 ? 1.005 : 0.995;
      } else {
        // Desktop: Different zoom speeds based on rotate mode
        if (rotateMode) {
          // In rotate mode, use faster zoom (5% per wheel tick)
          factor = e.deltaY < 0 ? 1.05 : 0.95;
        } else {
          // Normal desktop mode: Faster zoom (3% per wheel tick)
          factor = e.deltaY < 0 ? 1.03 : 0.97;
        }
      }

      // Apply zoom differently based on rotate mode
      if (rotateMode) {
        // In rotate mode, zoom affects rotScale
        rotScale *= factor;
        rotScale = Math.max(0.1, Math.min(5, rotScale));
      } else {
        // Normal mode: zoom affects image dimensions
        zoomLevel *= factor;
        zoomLevel = Math.max(0.1, Math.min(5, zoomLevel));
      }

      // Update zoom slider if it exists (mobile only)
      if (zoomSlider) {
        const sliderValue = rotateMode ? Math.round(rotScale * 100) : Math.round(zoomLevel * 100);
        zoomSlider.value = sliderValue;
        updateValueDisplays();
      }

      // Apply the zoom
      if (rotateMode) {
        updateFilters(); // Rotate mode updates filters directly
      } else {
        applyZoom(zoomLevel);
      }
      updateFilters();
    }, { passive: false });

    // --- Double-click zoom (desktop only) ---
    if (!isMobile) {
      avatar.addEventListener("dblclick", e => {
        if (!img.src) return;
        e.preventDefault();

        if (rotateMode) {
          // In rotate mode, double-click zooms rotScale
          rotScale *= 1.5;
          rotScale = Math.max(0.1, Math.min(5, rotScale));
          updateFilters();
        } else {
          // Original double-click zoom logic from working version
          const rect = avatar.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;

          const oldW = img.offsetWidth;
          const oldH = img.offsetHeight;
          const factor = 1.5;
          const newW = oldW * factor;
          const newH = newW / aspectRatio;

          const left = parseFloat(img.style.left) || 0;
          const top = parseFloat(img.style.top) || 0;

          const relX = (clickX - left) / oldW;
          const relY = (clickY - top) / oldH;

          const newLeft = clickX - relX * newW;
          const newTop  = clickY - relY * newH;

          img.style.width = newW + "px";
          img.style.height = newH + "px";
          img.style.left = newLeft + "px";
          img.style.top = newTop + "px";

          // Update zoom level
          zoomLevel = newW / baseWidth;
          updateFilters();
        }
      });
    }

    // --- REMOVED: Double-tap zoom for mobile ---
    // Mobile: Only pinch zoom and zoom slider, no double-tap zoom

    // --- Pinch zoom works in both normal and rotate modes ---
    let initialDistance = null;
    let initialZoom = 1;
    let initialRotScale = 1;

    avatar.addEventListener("touchstart", handleTouchStart, { passive: false });
    avatar.addEventListener("touchmove", handleTouchMove, { passive: false });

    function handleTouchStart(e) {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
        initialZoom = zoomLevel;
        initialRotScale = rotScale;
        e.preventDefault();
      }
    }

    function handleTouchMove(e) {
      if (!img.src || e.touches.length !== 2) return;

      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);

      if (initialDistance !== null) {
        const distanceChange = currentDistance / initialDistance;

        if (rotateMode) {
          // In rotate mode, affect rotScale
          rotScale = initialRotScale * Math.pow(distanceChange, 0.3);
          rotScale = Math.max(0.1, Math.min(5, rotScale));
        } else {
          // Normal mode: affect zoomLevel
          zoomLevel = initialZoom * Math.pow(distanceChange, 0.3);
          zoomLevel = Math.max(0.1, Math.min(5, zoomLevel));
        }

        // Update zoom slider (mobile only)
        if (zoomSlider) {
          const sliderValue = rotateMode ? Math.round(rotScale * 100) : Math.round(zoomLevel * 100);
          zoomSlider.value = sliderValue;
          updateValueDisplays();
        }

        // Apply the zoom
        if (!rotateMode) {
          applyZoom(zoomLevel);
        }
        updateFilters();
      }
      e.preventDefault();
    }

    // --- Apply zoom while maintaining aspect ratio ---
    function applyZoom(factor) {
      if (!img.src || baseWidth === 0 || baseHeight === 0) return;

      // Calculate new dimensions from base dimensions to maintain aspect ratio
      const newW = baseWidth * factor;
      const newH = baseHeight * factor;

      // Get current position
      const currentLeft = parseInt(img.style.left) || 0;
      const currentTop = parseInt(img.style.top) || 0;

      // Calculate center point for zooming
      const centerX = currentLeft + (img.offsetWidth / 2);
      const centerY = currentTop + (img.offsetHeight / 2);

      // Calculate new position to zoom from center
      const newLeft = centerX - (newW / 2);
      const newTop = centerY - (newH / 2);

      // Apply new dimensions and position
      img.style.width = newW + "px";
      img.style.height = newH + "px";
      img.style.left = newLeft + "px";
      img.style.top = newTop + "px";
    }

    // --- Sliders ---
    const sliders = [brightSlider, contrastSlider, sharpSlider, warmSlider, satSlider, rotateSlider];
    if (zoomSlider) sliders.push(zoomSlider);

    sliders.forEach(slider => {
      if (slider) {
        slider.addEventListener("input", () => {
          updateValueDisplays();

          // Handle zoom slider separately (mobile only)
          if (slider === zoomSlider) {
            const sliderValue = parseFloat(zoomSlider.value) / 100;
            if (rotateMode) {
              rotScale = sliderValue;
            } else {
              zoomLevel = sliderValue;
              applyZoom(zoomLevel);
            }
          }

          updateFilters();
        });
      }
    });

    // --- Reset button ---
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (brightSlider) brightSlider.value = "1";
        if (contrastSlider) contrastSlider.value = "1";
        if (sharpSlider) sharpSlider.value = "0";
        if (warmSlider) warmSlider.value = "0";
        if (satSlider) satSlider.value = "1";
        if (rotateSlider) rotateSlider.value = "0";
        if (zoomSlider) {
          zoomSlider.value = "100";
          zoomLevel = 1;
          rotScale = 1;
        }

        rotScale = 1;
        rotOffsetX = 0;
        rotOffsetY = 0;

        // Reset image position and size
        if (img.src) {
          const boxW = avatar.clientWidth;
          const boxH = avatar.clientHeight;

          img.style.width = baseWidth + "px";
          img.style.height = baseHeight + "px";
          img.style.left = ((boxW - baseWidth) / 2) + "px";
          img.style.top = ((boxH - baseHeight) / 2) + "px";
        }

        updateValueDisplays();
        if (img.src) updateFilters();
        showNotification("🔄 Settings reset!");
      });
    }

    // --- Unified Filter + draw ---
    function updateFilters() {
      if (!img.src || !previewCtx) return;

      const b = parseFloat(brightSlider?.value || 1);
      const c = parseFloat(contrastSlider?.value || 1);
      const s = parseFloat(sharpSlider?.value || 0);
      const w = parseFloat(warmSlider?.value || 0);
      const sat = parseFloat(satSlider?.value || 1);
      const angle = parseFloat(rotateSlider?.value || 0) * Math.PI / 180;
      const useRotate = angle !== 0;

      const outW = avatar.clientWidth * 2;
      const outH = avatar.clientHeight * 2;

      let imageData;

      // Create a temporary canvas for initial drawing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = outW;
      tempCanvas.height = outH;
      const tempCtx = tempCanvas.getContext("2d");

      if (useRotate && rotateMode) {
        const diag = Math.ceil(Math.sqrt(outW ** 2 + outH ** 2));
        const workCanvas = document.createElement("canvas");
        workCanvas.width = diag;
        workCanvas.height = diag;
        const workCtx = workCanvas.getContext("2d");

        workCtx.translate(diag/2 + rotOffsetX, diag/2 + rotOffsetY);
        workCtx.rotate(angle);
        workCtx.scale(rotScale, rotScale); // Apply zoom via scale in rotate mode
        workCtx.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);

        const cropX = (diag - outW) / 2;
        const cropY = (diag - outH) / 2;
        imageData = workCtx.getImageData(cropX, cropY, outW, outH);

      } else if (useRotate) {
        const diag = Math.ceil(Math.sqrt(outW ** 2 + outH ** 2));
        const workCanvas = document.createElement("canvas");
        workCanvas.width = diag;
        workCanvas.height = diag;
        const workCtx = workCanvas.getContext("2d");

        workCtx.translate(diag/2, diag/2);
        workCtx.rotate(angle);
        workCtx.drawImage(
          img,
          parseInt(img.style.left) || 0,
          parseInt(img.style.top) || 0,
          img.offsetWidth,
          img.offsetHeight
        );

        const cropX = (diag - outW) / 2;
        const cropY = (diag - outH) / 2;
        imageData = workCtx.getImageData(cropX, cropY, outW, outH);

      } else {
        const imgLeft = parseInt(img.style.left) || 0;
        const imgTop = parseInt(img.style.top) || 0;
        const sx = (-imgLeft) * (img.naturalWidth / img.offsetWidth);
        const sy = (-imgTop) * (img.naturalHeight / img.offsetHeight);
        const sWidth = avatar.clientWidth * (img.naturalWidth / img.offsetWidth);
        const sHeight = avatar.clientHeight * (img.naturalHeight / img.offsetHeight);

        tempCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, outW, outH);
        imageData = tempCtx.getImageData(0, 0, outW, outH);
      }

      // --- Apply brightness ---
      let data = imageData.data;
      if (b !== 1) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * b);     // R
          data[i+1] = Math.min(255, data[i+1] * b); // G
          data[i+2] = Math.min(255, data[i+2] * b); // B
        }
      }

      // --- Apply contrast ---
      if (c !== 1) {
        for (let i = 0; i < data.length; i += 4) {
          for (let j = 0; j < 3; j++) {
            data[i + j] = ((data[i + j] - 128) * c) + 128;
          }
        }
      }

      // --- warm/cool bias ---
      if (w !== 0) {
        if (w > 0) {
          for (let i = 0; i < data.length; i += 4) {
            data[i]   = Math.min(255, data[i]   + w * 0.6);
            data[i+1] = Math.min(255, data[i+1] + w * 0.3);
            data[i+2] = Math.max(0,   data[i+2] - w * 0.6);
          }
        } else {
          const cool = -w;
          for (let i = 0; i < data.length; i += 4) {
            data[i]   = Math.max(0,   data[i]   - cool * 0.6);
            data[i+1] = Math.max(0,   data[i+1] - cool * 0.3);
            data[i+2] = Math.min(255, data[i+2] + cool * 0.6);
          }
        }
      }

      // --- saturation ---
      if (sat !== 1) {
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], bcol = data[i+2];
          const gray = 0.299*r + 0.587*g + 0.114*bcol;
          data[i]   = gray + (r - gray) * sat;
          data[i+1] = gray + (g - gray) * sat;
          data[i+2] = gray + (bcol - gray) * sat;
        }
      }

      // --- sharpen ---
      if (s > 0) {
        const copy = new Uint8ClampedArray(data);
        const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        const side = 3, half = 1;
        for (let y = half; y < outH - half; y++) {
          for (let x = half; x < outW - half; x++) {
            for (let cIdx = 0; cIdx < 3; cIdx++) {
              let i = (y * outW + x) * 4 + cIdx;
              let sum = 0, ki = 0;
              for (let ky = -half; ky <= half; ky++) {
                for (let kx = -half; kx <= half; kx++) {
                  const ii = ((y + ky) * outW + (x + kx)) * 4 + cIdx;
                  sum += copy[ii] * kernel[ki++];
                }
              }
              data[i] = data[i] * (1 - s) + sum * s;
            }
          }
        }
      }

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = outW;
      finalCanvas.height = outH;
      const finalCtx = finalCanvas.getContext("2d");
      finalCtx.putImageData(imageData, 0, 0);

      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      previewCtx.drawImage(finalCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
    }

    // --- Export / Save to Photos ---
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        if (!img.src) {
          showNotification("❌ No image loaded!");
          return;
        }

        if (isMobile) {
          saveToCameraRoll();
        } else {
          // Desktop: regular download
          const link = document.createElement("a");
          link.download = "avatar-2x.png";
          link.href = previewCanvas.toDataURL("image/png");
          link.click();
          showNotification("✅ Image downloaded!");
        }
      });
    }

    // --- Save to Camera Roll (mobile) ---
    function saveToCameraRoll() {
      if (!previewCanvas) return;

      // Convert canvas to blob
      previewCanvas.toBlob((blob) => {
        // Create a File from blob
        const file = new File([blob], "avatar.png", { type: "image/png" });

        // For iOS: Use share sheet to save to Photos
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Avatar Image',
            text: 'Save this avatar to your photos'
          })
          .then(() => showNotification("✅ Image saved to Photos!"))
          .catch(err => {
            console.error("Share failed:", err);
            // Fallback: open image in new tab
            const imageUrl = previewCanvas.toDataURL();
            const newWindow = window.open();
            newWindow.document.write(`<img src="${imageUrl}" style="width:100%;" />`);
            showNotification("📱 Open image and save manually");
          });
        } else {
          // Android/other: Download link
          const link = document.createElement("a");
          link.download = "avatar-2x.png";
          link.href = previewCanvas.toDataURL("image/png");
          link.click();
          showNotification("✅ Image downloaded! Check your downloads.");
        }
      }, "image/png");
    }

    // --- Copy to Clipboard ---
    function copyToClipboard() {
      if (!previewCanvas) {
        showNotification("❌ No image to copy!");
        return;
      }

      try {
        previewCanvas.toBlob((blob) => {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item])
            .then(() => showNotification("✅ Image copied to clipboard!"))
            .catch(err => {
              console.error("Clipboard write failed:", err);
              // Fallback
              const dataUrl = previewCanvas.toDataURL();
              const textarea = document.createElement("textarea");
              textarea.value = dataUrl;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              document.body.removeChild(textarea);
              showNotification("📋 Image URL copied!");
            });
        });
      } catch (err) {
        console.error("Copy failed:", err);
        showNotification("❌ Copy failed!");
      }
    }

    // --- Notification system ---
    function showNotification(message) {
      const notification = document.createElement("div");
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #88d3ce;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        animation: slideIn 0.3s ease;
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }

    showNotification("🎨 Avatar Editor loaded!");
  });
})();
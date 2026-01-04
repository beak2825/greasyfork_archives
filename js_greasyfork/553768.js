// ==UserScript==
// @name         純圖片檢視控制器
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  純圖片頁面開啟時可使用滑鼠控制圖片縮放與拖曳圖片位置
// @author       shanlan(grok-4-fast-reasoning)
// @match        *://*/*
// @grant        GM_download
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553768/%E7%B4%94%E5%9C%96%E7%89%87%E6%AA%A2%E8%A6%96%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553768/%E7%B4%94%E5%9C%96%E7%89%87%E6%AA%A2%E8%A6%96%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: "#tm-image-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#0E0E0E;z-index:9999}#tm-image-modal canvas{position:absolute;left:0;top:0;max-width:none;max-height:none;width:100vw;height:100vh;border:none;transform-origin:0 0;user-select:none;-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;cursor:move}#tm-image-modal .fit{position:absolute;top:10px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .center{position:absolute;top:50px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .reset{position:absolute;top:90px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .interp{position:absolute;top:130px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .download{position:absolute;top:170px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}"
  }));

  const getVisibleSrc = doc => {
    for (const img of doc.querySelectorAll("img")) {
      const s = getComputedStyle(img);
      if (s.visibility !== "hidden" && img.offsetWidth && img.offsetHeight) return img.src;
    }
  };

  const isSimpleImagePage = () => {
    const isImageUrl = /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(location.pathname);
    if (isImageUrl) return true;
    const hasNav = !!document.querySelector('nav, ul, li, footer, header');
    const textLen = document.body.textContent.trim().length;
    return document.querySelectorAll('img').length === 1 && document.body.children.length <= 2 && !hasNav && textLen < 10;
  };

  const openModal = doc => {
    const src = getVisibleSrc(doc);
    if (!src) return;
    const m = document.createElement("div");
    m.id = "tm-image-modal";
    const resetBtn = document.createElement("span");
    let zoomLevel = 1;
    resetBtn.innerHTML = `${zoomLevel}x`; resetBtn.className = "reset";
    const fitBtn = document.createElement("span");
    fitBtn.innerHTML = "恢復預設"; fitBtn.className = "fit";
    const centerBtn = document.createElement("span");
    centerBtn.innerHTML = "置中"; centerBtn.className = "center";
    const interpBtn = document.createElement("span");
    interpBtn.innerHTML = "插值"; interpBtn.className = "interp";
    const downloadBtn = document.createElement("span");
    downloadBtn.innerHTML = "💾"; downloadBtn.className = "download";
    const canvas = document.createElement("canvas");
    const tempImg = new Image();
    tempImg.src = src;
    let scale = 1, posX = 0, posY = 0, isDragging = false, startX, startY, startPosX, startPosY, rafId;
    let interpMode = localStorage.getItem('tm-interp-mode') || 'auto';
    let natW = 0, natH = 0;
    const modes = [
      { value: 'auto', label: '雙立方', enabled: true, quality: 'high' },
      { value: 'bilinear', label: '雙線性', enabled: true, quality: 'low' },
      { value: 'pixelated', label: '像素化', enabled: false, quality: 'low' }
    ];
    // 確保模式有效
    if (!modes.find(m => m.value === interpMode)) {
      interpMode = 'auto';
    }
    const updateInterp = () => {
      const current = modes.find(m => m.value === interpMode);
      interpBtn.innerHTML = current ? current.label : '插值';
      localStorage.setItem('tm-interp-mode', interpMode);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplay);
    };
    const updateDisplay = () => {
      if (!natW || !natH) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.clearRect(0, 0, w, h);
      const current = modes.find(m => m.value === interpMode);
      ctx.imageSmoothingEnabled = current ? current.enabled : true;
      if (ctx.imageSmoothingQuality !== undefined) {
        ctx.imageSmoothingQuality = current ? current.quality : 'high';
      }
      ctx.save();
      ctx.translate(posX, posY);
      ctx.scale(scale, scale);
      ctx.drawImage(tempImg, 0, 0);
      ctx.restore();
      rafId = null;
    };
    const centerImage = () => {
      if (!natW || !natH) return;
      posX = (window.innerWidth - natW * scale) / 2;
      posY = (window.innerHeight - natH * scale) / 2;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplay);
    };
    const initFit = () => {
      if (!natW || !natH) return;
      const maxW = window.innerWidth * 0.9, maxH = window.innerHeight * 0.9;
      scale = Math.min(maxW / natW, maxH / natH, 1);
      posX = (window.innerWidth - natW * scale) / 2;
      posY = (window.innerHeight - natH * scale) / 2;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplay);
    };
    const toggleZoom = () => {
      if (!natW || !natH) return;
      const oldScale = scale;
      zoomLevel = zoomLevel === 1 ? 2 : 1;
      scale = zoomLevel;
      resetBtn.innerHTML = `${zoomLevel}x`;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      posX = centerX - (centerX - posX) * (scale / oldScale);
      posY = centerY - (centerY - posY) * (scale / oldScale);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplay);
    };
    const downloadImage = () => {
      const urlObj = new URL(src);
      let filename = urlObj.pathname.split('/').filter(Boolean).pop() || 'image';
      const queryIndex = filename.indexOf('?');
      if (queryIndex > -1) filename = filename.substring(0, queryIndex);
      if (!filename.includes('.')) {
        const extMatch = src.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i);
        filename += '.' + (extMatch ? extMatch[1].toLowerCase() : 'png');
      }
      GM_download(src, filename);
    };
    m.append(resetBtn, fitBtn, centerBtn, interpBtn, downloadBtn, canvas);
    document.body.appendChild(m);
    document.querySelectorAll('img').forEach(img => img.style.display = 'none');
    resetBtn.addEventListener('click', toggleZoom);
    fitBtn.addEventListener('click', initFit);
    centerBtn.addEventListener('click', centerImage);
    interpBtn.addEventListener('click', () => {
      const idx = modes.findIndex(m => m.value === interpMode);
      interpMode = modes[(idx + 1) % modes.length].value;
      updateInterp();
    });
    downloadBtn.addEventListener('click', downloadImage);
    const handleMouseDown = e => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPosX = posX;
      startPosY = posY;
      document.body.style.userSelect = 'none';
      e.preventDefault();
      window.getSelection?.removeAllRanges();
    };
    const handleMouseMove = e => {
      if (!isDragging) return;
      posX = startPosX + (e.clientX - startX);
      posY = startPosY + (e.clientY - startY);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplay);
    };
    const handleMouseUp = () => {
      isDragging = false;
      document.body.style.userSelect = '';
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    };
    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const imageX = (mouseX - posX) / scale;
      const imageY = (mouseY - posY) / scale;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = scale * factor;
      if (newScale < 0.01 || newScale > 100) return;
      scale = newScale;
      posX = mouseX - imageX * newScale;
      posY = mouseY - imageY * newScale;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplay);
    }, { passive: false });
    const onLoad = () => {
      natW = tempImg.naturalWidth;
      natH = tempImg.naturalHeight;
      if (natW === 0 || natH === 0) return;
      initFit();
      updateInterp();
    };
    if (tempImg.complete) {
      onLoad();
    } else {
      tempImg.addEventListener('load', onLoad, { once: true });
    }
    window.addEventListener('resize', () => {
      if (natW && natH) {
        initFit();
      }
    });
  };

  const checkAndOpen = () => { if (isSimpleImagePage()) openModal(document); };
  let hasOpened = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkAndOpen();
      if (!hasOpened) {
        const observer = new MutationObserver(() => {
          if (isSimpleImagePage() && !hasOpened) {
            openModal(document);
            hasOpened = true;
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { observer.disconnect(); hasOpened = true; }, 1500);
      }
    });
  } else {
    checkAndOpen();
  }
})();
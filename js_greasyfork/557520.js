// ==UserScript==
// @license MIT

// @name         Dreamina Image Downloader (PNG in target DIV)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Thêm nút download PNG vào div .context-menu-trigger-KKikks và các thẻ ảnh khác (toggle nhỏ/mờ)
// @author       You
// @match        https://dreamina.capcut.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557520/Dreamina%20Image%20Downloader%20%28PNG%20in%20target%20DIV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557520/Dreamina%20Image%20Downloader%20%28PNG%20in%20target%20DIV%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('Dreamina Downloader PNG loaded!');

  // State
  let isEnabled = GM_getValue('downloadButtonsEnabled', true);

  // Selectors — mục tiêu chính là div mà bạn yêu cầu
  const TARGET_DIV_SELECTOR = '.context-menu-trigger-KKikks';
  const TARGET_IMG_IN_DIV_SELECTOR = 'img'; // trong div trên ảnh có class preview-jvleoa, nhưng để an toàn cứ lấy <img>

  // CSS
  const style = document.createElement('style');
  style.textContent = `
    .dreamina-download-btn {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 71, 87, 0.88) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 6px 10px !important;
      cursor: pointer !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      z-index: 99999 !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      transition: transform .2s, background .2s !important;
      box-shadow: 0 2px 6px rgba(0,0,0,.25) !important;
      user-select: none !important;
    }
    .dreamina-download-btn:hover {
      background: rgba(238, 90, 111, 0.98) !important;
      transform: translateX(-50%) scale(1.04) !important;
    }
    .dreamina-download-btn svg {
      width: 14px !important;
      height: 14px !important;
    }

    /* giữ relative để position absolute hoạt động */
    .context-menu-trigger-KKikks { position: relative !important; }
    .image-card-wrapper-ykvJk8 { position: relative !important; }
    .container-O46LT2 { position: relative !important; }

    /* Toggle nhỏ/mờ góc trái dưới */
    .dreamina-toggle-container {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 999999 !important;
      background: rgba(255,255,255,.35);
      backdrop-filter: blur(10px);
      padding: 6px 10px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,.12);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: opacity .2s, background .2s;
      opacity: .45;
    }
    .dreamina-toggle-container:hover {
      opacity: 1;
      background: rgba(255,255,255,.55);
    }
    .dreamina-toggle-label {
      font-size: 11px;
      font-weight: 700;
      color: #333;
      user-select: none;
      letter-spacing: .3px;
    }
    .dreamina-toggle-switch {
      position: relative;
      width: 36px;
      height: 18px;
      background: rgba(204,204,204,.65);
      border-radius: 18px;
      cursor: pointer;
      transition: background .2s;
    }
    .dreamina-toggle-switch.active { background: rgba(76,175,80,.9); }
    .dreamina-toggle-slider {
      position: absolute;
      top: 2px; left: 2px;
      width: 14px; height: 14px;
      background: #fff; border-radius: 50%;
      transition: transform .2s;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
    }
    .dreamina-toggle-switch.active .dreamina-toggle-slider { transform: translateX(18px); }
  `;
  document.head.appendChild(style);

  // Toggle UI
  function createToggleButton() {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'dreamina-toggle-container';
    toggleContainer.innerHTML = `
      <span class="dreamina-toggle-label">DL</span>
      <div class="dreamina-toggle-switch ${isEnabled ? 'active' : ''}">
        <div class="dreamina-toggle-slider"></div>
      </div>
    `;
    const toggleSwitch = toggleContainer.querySelector('.dreamina-toggle-switch');
    toggleSwitch.onclick = () => {
      isEnabled = !isEnabled;
      GM_setValue('downloadButtonsEnabled', isEnabled);
      toggleSwitch.classList.toggle('active', isEnabled);
      if (isEnabled) {
        addAllButtons();
      } else {
        removeAllDownloadButtons();
      }
      console.log('[Dreamina Downloader] Buttons:', isEnabled ? 'Enabled' : 'Disabled');
    };
    document.body.appendChild(toggleContainer);
  }

  // Remove all buttons
  function removeAllDownloadButtons() {
    document.querySelectorAll('.dreamina-download-btn').forEach(btn => btn.remove());
  }

  // --- PNG conversion helpers ---
  async function blobToPngBlobViaCanvas(blob) {
    // Try OffscreenCanvas for performance
    try {
      const bitmap = await createImageBitmap(blob);
      // Some browsers may not support OffscreenCanvas
      if (typeof OffscreenCanvas !== 'undefined') {
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        const pngBlob = await canvas.convertToBlob({ type: 'image/png' });
        return pngBlob;
      }
      // Fallback to HTMLCanvasElement
      return await blobToPngBlobViaHTMLCanvas(blob);
    } catch (e) {
      // Fallback pathway if createImageBitmap fails (e.g., older browsers)
      return await blobToPngBlobViaHTMLCanvas(blob);
    }
  }

  function blobToPngBlobViaHTMLCanvas(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((pngBlob) => {
            URL.revokeObjectURL(url);
            if (pngBlob) resolve(pngBlob);
            else reject(new Error('PNG conversion failed'));
          }, 'image/png');
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  // Download as PNG
  async function downloadAsPNG(imgUrl, index = 1, suggestedName = 'dreamina') {
    try {
      // Giữ nguyên URL gốc (đang là webp); fetch blob trước rồi convert
      const resp = await fetch(imgUrl, { mode: 'cors', credentials: 'omit' });
      const webpBlob = await resp.blob();

      const pngBlob = await blobToPngBlobViaCanvas(webpBlob);
      const objectUrl = URL.createObjectURL(pngBlob);

      const ts = Date.now();
      const filename = `${suggestedName}_${ts}_${index}.png`;

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      console.log('[Dreamina Downloader] Saved PNG:', filename);
    } catch (err) {
      console.error('[Dreamina Downloader] PNG download error:', err);
      alert('Không thể tải PNG. Thử lại sau!');
    }
  }

  // Ensure button inside a given container + wire click
  function ensureButton(container, img, label = 'DL PNG', nameHint = 'dreamina', index = 1) {
    if (!container || !img) return;
    if (container.querySelector('.dreamina-download-btn')) return;

    // make container relative (if not already)
    const style = getComputedStyle(container);
    if (style.position === 'static') container.style.position = 'relative';

    const btn = document.createElement('button');
    btn.className = 'dreamina-download-btn';
    btn.title = 'Download PNG';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
      </svg>
      <span>${label}</span>
    `;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      downloadAsPNG(img.src || img.currentSrc || img.getAttribute('data-src') || '', index, nameHint);
    });

    container.appendChild(btn);
  }

  // Add button specifically for the requested DIV
  function addButtonsForTargetDivs() {
    const divs = document.querySelectorAll(TARGET_DIV_SELECTOR);
    divs.forEach((div, i) => {
      const img = div.querySelector(TARGET_IMG_IN_DIV_SELECTOR);
      if (img && (img.src || img.currentSrc)) {
        ensureButton(div, img, 'DL PNG', 'dreamina_div', i + 1);
      }
    });
  }

  // (Optional) add buttons for other visible image cards (giữ tính năng cũ)
  function addButtonsForGeneralImages() {
    if (!isEnabled) return;
    const imgs = document.querySelectorAll('img.image-Qj6hBo, .image-card-wrapper-ykvJk8 img, .container-O46LT2 img');
    imgs.forEach((img, idx) => {
      const container =
        img.closest('.container-O46LT2') ||
        img.closest('.image-card-wrapper-ykvJk8') ||
        img.parentElement;
      if (container && (img.src || img.currentSrc)) {
        ensureButton(container, img, 'DL PNG', 'dreamina', idx + 1);
      }
    });
  }

  function addAllButtons() {
    addButtonsForTargetDivs();   // ƯU TIÊN: gắn vào div bạn yêu cầu
    addButtonsForGeneralImages(); // Thêm: gắn cho các ảnh khác (nếu có)
  }

  // Observer
  const observer = new MutationObserver(() => {
    if (isEnabled) addAllButtons();
  });

  function startObserver() {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Init
  function boot() {
    createToggleButton();
    startObserver();

    if (isEnabled) {
      // chạy nhiều lần để chắc chắn
      addAllButtons();
      setTimeout(addAllButtons, 400);
      setTimeout(addAllButtons, 800);
      setTimeout(addAllButtons, 1500);
      setTimeout(addAllButtons, 3000);
    }

    // trigger thêm khi scroll/click
    window.addEventListener('scroll', () => { if (isEnabled) setTimeout(addAllButtons, 250); }, { passive: true });
    document.addEventListener('click', () => { if (isEnabled) setTimeout(addAllButtons, 250); }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

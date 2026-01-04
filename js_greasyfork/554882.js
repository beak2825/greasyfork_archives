// ==UserScript==
// @name         Image Capture
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Capture images loaded to a queue for manual download management
// @author       Van
// @match        *://*/*
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554882/Image%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/554882/Image%20Capture.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Global debug flag - set to true to enable logging
  const DEBUG_ENABLED = false;

  // Unified logging function
  function log(...args) {
    if (DEBUG_ENABLED) {
      console.log('[ImageCapture]', ...args);
    }
  }

  function logError(...args) {
    if (DEBUG_ENABLED) {
      console.error('[ImageCapture]', ...args);
    }
  }

  // Check if current page is in exclude list
  const excludedUrls = GM_getValue('excludedUrls', []);
  const currentUrl = window.location.hostname;

  if (excludedUrls.includes(currentUrl)) {
    log('This page is excluded');
    return;
  }

  // Image queue
  let imageQueue = [];
  let downloadCounter = 0;
  // Track images being checked to prevent recursion (per-image tracking)
  const imagesBeingChecked = new WeakSet();

  // Calculate iframe depth level
  let iframeLevel = 0;
  let currentWindow = window;
  try {
    while (currentWindow !== currentWindow.parent) {
      iframeLevel++;
      currentWindow = currentWindow.parent;
      if (iframeLevel > 10) break; // Safety limit
    }
  } catch (e) {
    // Cross-origin, can't determine exact level
    iframeLevel = window.self !== window.top ? 1 : 0;
  }

  // Create main container
  const container = document.createElement('div');
  container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 15px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        cursor: pointer;
    `;

  // Collapsed state
  let isExpanded = false;

  // Collapsed view
  const collapsedView = document.createElement('div');
  collapsedView.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        color: white;
        font-weight: 600;
    `;
  collapsedView.innerHTML = `🖼️ Image Capture <span style="
    background: rgba(255,255,255,0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    margin-left: 4px;
  ">L${iframeLevel}</span>`;

  // Expanded content wrapper
  const expandedContent = document.createElement('div');
  expandedContent.style.cssText = `
        display: none;
        width: 400px;
        max-height: calc(100vh - 40px);
        flex-direction: column;
        overflow: hidden;
    `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
    `;

  const title = document.createElement('div');
  title.innerHTML = `🖼️ Image Queue <span style="
    background: rgba(255,255,255,0.2);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 12px;
    margin-left: 8px;
    font-weight: 500;
  ">Level ${iframeLevel}</span>`;
  title.style.cssText = `
        flex: 1;
        font-weight: 600;
        color: white;
        font-size: 16px;
        letter-spacing: 0.3px;
    `;

  // Toggle capture button
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '▶️';
  toggleBtn.dataset.active = 'false';
  toggleBtn.title = '开始捕获';
  toggleBtn.style.cssText = `
        background: rgba(76, 175, 80, 0.8);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        cursor: pointer;
        padding: 6px 12px;
        font-size: 18px;
        color: white;
        transition: all 0.3s ease;
    `;

  toggleBtn.addEventListener('click', function () {
    const isActive = this.dataset.active === 'true';
    this.dataset.active = !isActive ? 'true' : 'false';
    this.innerHTML = !isActive ? '⏸️' : '▶️';
    this.title = !isActive ? '暂停捕获' : '开始捕获';
    this.style.background = !isActive ? 'rgba(255, 152, 0, 0.8)' : 'rgba(76, 175, 80, 0.8)';
    log('Capture:', !isActive ? 'enabled' : 'disabled');
  });

  // Enhancement button
  const enhanceBtn = document.createElement('button');
  enhanceBtn.innerHTML = '⚡';
  enhanceBtn.dataset.active = 'false';
  enhanceBtn.title = '开启增强模式';
  enhanceBtn.style.cssText = `
        background: rgba(156, 39, 176, 0.8);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        cursor: pointer;
        padding: 6px 12px;
        font-size: 18px;
        color: white;
        transition: all 0.3s ease;
        margin-left: 5px;
    `;

  enhanceBtn.addEventListener('click', function () {
    const isActive = this.dataset.active === 'true';
    this.dataset.active = !isActive ? 'true' : 'false';
    this.innerHTML = !isActive ? '✨' : '⚡';
    this.title = !isActive ? '关闭增强模式' : '开启增强模式';
    this.style.background = !isActive ? 'rgba(255, 193, 7, 0.8)' : 'rgba(156, 39, 176, 0.8)';
    log('Enhance mode:', !isActive ? 'enabled' : 'disabled');
  });

  // Settings button
  const settingsBtn = document.createElement('button');
  settingsBtn.innerHTML = '⚙️';
  settingsBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        cursor: pointer;
        padding: 6px 12px;
        font-size: 18px;
        color: white;
        transition: all 0.3s ease;
    `;

  // Hide button
  const hideBtn = document.createElement('button');
  hideBtn.innerHTML = '🚫';
  hideBtn.title = '在此网站隐藏';
  hideBtn.style.cssText = `
        background: rgba(244, 67, 54, 0.8);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        cursor: pointer;
        padding: 6px 12px;
        font-size: 18px;
        color: white;
        transition: all 0.3s ease;
    `;

  hideBtn.addEventListener('click', function () {
    if (confirm(`确定要在 ${currentUrl} 上隐藏此脚本吗？`)) {
      const excludedUrls = GM_getValue('excludedUrls', []);
      if (!excludedUrls.includes(currentUrl)) {
        excludedUrls.push(currentUrl);
        GM_setValue('excludedUrls', excludedUrls);
        container.remove();
      }
    }
  });

  header.appendChild(title);
  header.appendChild(toggleBtn);
  header.appendChild(enhanceBtn);
  header.appendChild(settingsBtn);
  header.appendChild(hideBtn);

  // Settings panel
  const settingsPanel = document.createElement('div');
  settingsPanel.style.cssText = `
        display: none;
        margin-bottom: 15px;
        padding: 15px;
        background: rgba(0,0,0,0.2);
        border-radius: 12px;
        max-height: 400px;
        overflow-y: auto;
    `;

  // File prefix setting
  const prefixLabel = document.createElement('label');
  prefixLabel.textContent = '📁 文件前缀';
  prefixLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        color: white;
        font-weight: 500;
    `;

  const prefixInput = document.createElement('input');
  prefixInput.type = 'text';
  prefixInput.placeholder = '例如: myimage_ 或 downloads/images/';
  prefixInput.value = GM_getValue('savePath', '');
  prefixInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        font-size: 13px;
        box-sizing: border-box;
        background: rgba(255,255,255,0.15);
        color: white;
        margin-bottom: 10px;
    `;

  // Min width
  const minWidthLabel = document.createElement('label');
  minWidthLabel.textContent = '↔️ 最小宽度 (px)';
  minWidthLabel.style.cssText = prefixLabel.style.cssText;

  const minWidthInput = document.createElement('input');
  minWidthInput.type = 'number';
  minWidthInput.placeholder = '留空表示不限制';
  minWidthInput.value = GM_getValue('minWidth', '');
  minWidthInput.style.cssText = prefixInput.style.cssText;

  // Min height
  const minHeightLabel = document.createElement('label');
  minHeightLabel.textContent = '↕️ 最小高度 (px)';
  minHeightLabel.style.cssText = prefixLabel.style.cssText;

  const minHeightInput = document.createElement('input');
  minHeightInput.type = 'number';
  minHeightInput.placeholder = '留空表示不限制';
  minHeightInput.value = GM_getValue('minHeight', '');
  minHeightInput.style.cssText = prefixInput.style.cssText;

  // Excluded sites section
  const excludedLabel = document.createElement('label');
  excludedLabel.textContent = '🚫 已隐藏的网站';
  excludedLabel.style.cssText = prefixLabel.style.cssText;

  const excludedListContainer = document.createElement('div');
  excludedListContainer.style.cssText = `
        background: rgba(0,0,0,0.3);
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        max-height: 150px;
        overflow-y: auto;
    `;

  function updateExcludedList() {
    const excludedUrls = GM_getValue('excludedUrls', []);
    if (excludedUrls.length === 0) {
      excludedListContainer.innerHTML = '<div style="color: rgba(255,255,255,0.5); text-align: center; padding: 10px; font-size: 12px;">暂无隐藏的网站</div>';
    } else {
      excludedListContainer.innerHTML = excludedUrls.map(url => `
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          margin-bottom: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 6px;
        ">
          <span style="color: white; font-size: 12px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${url}</span>
          <button class="remove-excluded-btn" data-url="${url}" style="
            padding: 4px 8px;
            background: rgba(244, 67, 54, 0.8);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 8px;
          ">移除</button>
        </div>
      `).join('');

      // Add event listeners to remove buttons
      excludedListContainer.querySelectorAll('.remove-excluded-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          const urlToRemove = this.dataset.url;
          if (confirm(`确定要移除 ${urlToRemove} 吗？`)) {
            const excludedUrls = GM_getValue('excludedUrls', []);
            const newExcludedUrls = excludedUrls.filter(url => url !== urlToRemove);
            GM_setValue('excludedUrls', newExcludedUrls);
            updateExcludedList();
            alert('已移除！刷新页面后生效。');
          }
        });
      });
    }
  }

  const saveSettingsBtn = document.createElement('button');
  saveSettingsBtn.innerHTML = '💾 保存设置';
  saveSettingsBtn.style.cssText = `
        width: 100%;
        padding: 10px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
    `;

  saveSettingsBtn.addEventListener('click', function () {
    GM_setValue('savePath', prefixInput.value.trim());
    GM_setValue('minWidth', minWidthInput.value.trim());
    GM_setValue('minHeight', minHeightInput.value.trim());
    alert('设置已保存！');
    settingsPanel.style.display = 'none';
  });

  settingsPanel.appendChild(prefixLabel);
  settingsPanel.appendChild(prefixInput);
  settingsPanel.appendChild(minWidthLabel);
  settingsPanel.appendChild(minWidthInput);
  settingsPanel.appendChild(minHeightLabel);
  settingsPanel.appendChild(minHeightInput);
  settingsPanel.appendChild(excludedLabel);
  settingsPanel.appendChild(excludedListContainer);
  settingsPanel.appendChild(saveSettingsBtn);

  // Update excluded list when settings panel is opened
  settingsBtn.addEventListener('click', function () {
    const willShow = settingsPanel.style.display === 'none';
    if (willShow) {
      updateExcludedList();
    }
  });

  settingsBtn.addEventListener('click', function () {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
  });

  // Queue controls
  const queueControls = document.createElement('div');
  queueControls.style.cssText = `
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
    `;

  const queueCount = document.createElement('div');
  queueCount.textContent = '队列: 0';
  queueCount.style.cssText = `
        flex: 1;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        font-size: 13px;
    `;

  const downloadAllBtn = document.createElement('button');
  downloadAllBtn.innerHTML = '⬇️ 全部下载';
  downloadAllBtn.style.cssText = `
        padding: 8px 12px;
        background: rgba(33, 150, 243, 0.9);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
    `;

  downloadAllBtn.addEventListener('click', function () {
    if (imageQueue.length === 0) {
      alert('队列为空！');
      return;
    }
    if (confirm(`确定要下载全部 ${imageQueue.length} 张图片吗？`)) {
      imageQueue.forEach(item => downloadImage(item));
      imageQueue = [];
      updateQueueDisplay();
    }
  });

  const clearAllBtn = document.createElement('button');
  clearAllBtn.innerHTML = '🗑️ 清空';
  clearAllBtn.style.cssText = `
        padding: 8px 12px;
        background: rgba(244, 67, 54, 0.9);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
    `;

  clearAllBtn.addEventListener('click', function () {
    if (imageQueue.length === 0) return;
    if (confirm(`确定要清空全部 ${imageQueue.length} 张图片吗？`)) {
      imageQueue = [];
      updateQueueDisplay();
    }
  });

  queueControls.appendChild(queueCount);
  queueControls.appendChild(downloadAllBtn);
  queueControls.appendChild(clearAllBtn);

  // Queue list container with flex
  const queueContainer = document.createElement('div');
  queueContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
    `;

  const queueList = document.createElement('div');
  queueList.style.cssText = `
        flex: 1;
        overflow-y: auto;
        background: rgba(0,0,0,0.2);
        border-radius: 12px;
        padding: 10px;
        min-height: 150px;
    `;

  queueContainer.appendChild(queueList);

  // Assemble UI
  expandedContent.appendChild(header);
  expandedContent.appendChild(settingsPanel);
  expandedContent.appendChild(queueControls);
  expandedContent.appendChild(queueContainer);

  container.appendChild(collapsedView);
  container.appendChild(expandedContent);
  document.body.appendChild(container);

  log(`Image Queue Manager initialized at Level ${iframeLevel}`);

  // Toggle expand/collapse
  container.addEventListener('click', function (e) {
    // Don't toggle if clicking on buttons or inputs inside expanded content
    if (isExpanded && (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('button') || e.target.closest('input'))) {
      return;
    }

    isExpanded = !isExpanded;

    if (isExpanded) {
      collapsedView.style.display = 'none';
      expandedContent.style.display = 'flex';
      container.style.cursor = 'default';
      container.style.padding = '20px';
    } else {
      collapsedView.style.display = 'flex';
      expandedContent.style.display = 'none';
      container.style.cursor = 'pointer';
      container.style.padding = '15px';
    }
  });

  // Functions
  function getImageDimensions(dataUrl, callback) {
    const img = new Image();
    imagesBeingChecked.add(img); // Track this specific image
    img.onload = function () {
      imagesBeingChecked.delete(img); // Remove from tracking
      callback(this.width, this.height);
    };
    img.onerror = function () {
      imagesBeingChecked.delete(img); // Remove from tracking
      callback(0, 0);
    };
    img.src = dataUrl;
  }

  function meetsMinimumSize(width, height) {
    const minWidth = parseInt(GM_getValue('minWidth', '')) || 0;
    const minHeight = parseInt(GM_getValue('minHeight', '')) || 0;
    return (minWidth === 0 || width >= minWidth) && (minHeight === 0 || height >= minHeight);
  }

  function addToQueue(dataUrl) {
    log('[addToQueue] Called, active:', toggleBtn.dataset.active, 'URL:', dataUrl.substring(0, 80));

    if (toggleBtn.dataset.active !== 'true') {
      log('[addToQueue] Skipped - capture not active');
      return;
    }

    // Check if already in queue - use full URL for exact matching
    if (imageQueue.some(item => item.dataUrl === dataUrl)) {
      log('[addToQueue] Skipped - already in queue');
      return;
    }

    log('[addToQueue] Getting dimensions...');
    getImageDimensions(dataUrl, function (width, height) {
      log('[addToQueue] Dimensions:', width, 'x', height);

      // Filter out images with 0 dimensions (failed to load or invalid)
      if (width === 0 || height === 0) {
        log('[addToQueue] Skipped - invalid dimensions');
        return;
      }

      if (!meetsMinimumSize(width, height)) {
        log('[addToQueue] Skipped - below minimum size');
        return;
      }

      // Double-check before adding (in case of race condition)
      if (imageQueue.some(item => item.dataUrl === dataUrl)) {
        log('[addToQueue] Skipped - race condition detected');
        return;
      }

      const id = Date.now() + Math.random();
      const imageType = dataUrl.startsWith('data:image/') ? 'data:image' : 'url';
      imageQueue.push({ id, dataUrl, width, height, timestamp: Date.now(), type: imageType });
      log('[addToQueue] ✓ Added to queue:', width, 'x', height, imageType);
      updateQueueDisplay();
    });
  }

  function downloadImage(item) {
    let format = 'png';

    // Determine format based on URL type
    if (item.dataUrl.startsWith('data:image/')) {
      // For data:image URLs
      const matches = item.dataUrl.match(/^data:image\/(\w+);base64,/);
      format = matches ? matches[1] : 'png';
    } else {
      // For regular URLs, extract extension from URL
      const urlMatch = item.dataUrl.match(/\.([a-z0-9]+)(\?|$)/i);
      if (urlMatch) {
        format = urlMatch[1].toLowerCase();
      } else {
        // Try to get from content-type if available
        format = 'jpg'; // Default for URL images
      }
    }

    const customPath = GM_getValue('savePath', '').trim();
    const baseFilename = `image_${item.timestamp}_${item.width}x${item.height}_${downloadCounter++}.${format}`;
    const filename = customPath ? customPath + baseFilename : baseFilename;

    GM_download({
      url: item.dataUrl,
      name: filename,
      onload: function () {
        log(`✓ Downloaded: ${filename}`);
      },
      onerror: function (error) {
        logError(`✗ Download failed:`, error);
      }
    });
  }

  // Image preview modal
  function showImagePreview(item) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      animation: fadeIn 0.2s ease;
    `;

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Image info bar
    const infoBar = document.createElement('div');
    infoBar.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 12px 24px;
      border-radius: 12px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      gap: 20px;
      align-items: center;
    `;

    const typeColor = item.type === 'data:image' ? '#4CAF50' : '#2196F3';
    const typeLabel = item.type === 'data:image' ? 'Data' : 'URL';

    infoBar.innerHTML = `
      <span>📐 ${item.width} × ${item.height}</span>
      <span style="background: ${typeColor}; padding: 4px 10px; border-radius: 6px; font-size: 12px;">${typeLabel}</span>
      <span>🕐 ${new Date(item.timestamp).toLocaleString()}</span>
    `;

    // Image container
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const img = document.createElement('img');
    img.src = item.dataUrl;
    img.style.cssText = `
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    imgContainer.appendChild(img);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: rgba(244, 67, 54, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    closeBtn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1) rotate(90deg)';
      this.style.background = 'rgba(244, 67, 54, 1)';
    });

    closeBtn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1) rotate(0deg)';
      this.style.background = 'rgba(244, 67, 54, 0.9)';
    });

    // Action buttons
    const actionBar = document.createElement('div');
    actionBar.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
    `;

    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = '⬇️ 下载';
    downloadBtn.style.cssText = `
      padding: 12px 24px;
      background: rgba(33, 150, 243, 0.9);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    downloadBtn.addEventListener('mouseenter', function () {
      this.style.background = 'rgba(33, 150, 243, 1)';
      this.style.transform = 'translateY(-2px)';
    });

    downloadBtn.addEventListener('mouseleave', function () {
      this.style.background = 'rgba(33, 150, 243, 0.9)';
      this.style.transform = 'translateY(0)';
    });

    downloadBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      downloadImage(item);
      modal.remove();
    });

    actionBar.appendChild(downloadBtn);

    // Close modal on click outside or ESC key
    const closeModal = () => {
      modal.style.animation = 'fadeOut 0.2s ease';
      setTimeout(() => modal.remove(), 200);
    };

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });

    // Assemble modal
    modal.appendChild(infoBar);
    modal.appendChild(imgContainer);
    modal.appendChild(closeBtn);
    modal.appendChild(actionBar);
    document.body.appendChild(modal);

    // Add fade-out animation
    style.textContent += `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
  }

  function updateQueueDisplay() {
    queueCount.textContent = `队列: ${imageQueue.length}`;

    if (imageQueue.length === 0) {
      queueList.innerHTML = '<div style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px 20px; font-size: 13px;">暂无图片<br>点击 ▶️ 开始捕获</div>';
      return;
    }

    queueList.innerHTML = imageQueue.map(item => {
      const typeColor = item.type === 'data:image' ? '#4CAF50' : '#2196F3';
      const typeLabel = item.type === 'data:image' ? 'Data' : 'URL';

      return `
      <div class="queue-item" data-id="${item.id}" style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        margin-bottom: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        transition: all 0.3s ease;
      ">
        <img class="preview-img" src="${item.dataUrl}" style="
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
          border: 2px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        " title="点击查看大图">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="color: white; font-size: 12px; font-weight: 500;">${item.width} × ${item.height}</span>
            <span style="background: ${typeColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${typeLabel}</span>
          </div>
          <div style="color: rgba(255,255,255,0.7); font-size: 11px;">${new Date(item.timestamp).toLocaleTimeString()}</div>
        </div>
        <button class="download-btn" style="
          padding: 6px 10px;
          background: rgba(33, 150, 243, 0.9);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          white-space: nowrap;
        ">⬇️ 下载</button>
        <button class="delete-btn" style="
          padding: 6px 10px;
          background: rgba(244, 67, 54, 0.9);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
        ">🗑️</button>
      </div>
    `;
    }).join('');

    // Add hover effect to preview images
    queueList.querySelectorAll('.preview-img').forEach(img => {
      img.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
        this.style.borderColor = 'rgba(255,255,255,0.6)';
      });
      img.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
        this.style.borderColor = 'rgba(255,255,255,0.3)';
      });
    });

    // Add event listeners for preview
    queueList.querySelectorAll('.preview-img').forEach((img, index) => {
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        showImagePreview(imageQueue[index]);
      });
    });

    // Add event listeners for download
    queueList.querySelectorAll('.download-btn').forEach((btn, index) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const item = imageQueue[index];
        downloadImage(item);
        imageQueue.splice(index, 1);
        updateQueueDisplay();
      });
    });

    // Add event listeners for delete
    queueList.querySelectorAll('.delete-btn').forEach((btn, index) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        imageQueue.splice(index, 1);
        updateQueueDisplay();
      });
    });
  }

  updateQueueDisplay();

  // Intercept data:image creation
  const OriginalImage = window.Image;
  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

  window.Image = function () {
    const img = new OriginalImage();

    // Create a flag to prevent infinite recursion
    let isSettingSrc = false;

    Object.defineProperty(img, 'src', {
      get: function () {
        return originalSrcDescriptor.get.call(this);
      },
      set: function (value) {
        if (!isSettingSrc && !imagesBeingChecked.has(this) && value && typeof value === 'string') {
          // Capture both data:image and regular URLs
          // Match explicit extensions OR URLs with image indicators (f=JPEG, fmt=auto, etc.)
          log('image value', value)
          const isEnhancedMode = enhanceBtn.dataset.active === 'true';
          if (value.startsWith('data:image/') ||
            (value.startsWith('http') && (
              (isEnhancedMode ? /(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(value) : /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(value)) ||
              /[?&](f|fmt|format)=(jpe?g|png|gif|webp|svg|bmp|ico)/i.test(value)))) {
            addToQueue(value);
          }
        }
        isSettingSrc = true;
        originalSrcDescriptor.set.call(this, value);
        isSettingSrc = false;
      },
      configurable: true
    });
    return img;
  };

  // Also intercept the prototype directly for existing images
  const originalPrototypeSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

  // Track which images we've already processed to prevent infinite loops
  const processedImages = new WeakSet();

  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    get: function () {
      return originalPrototypeSrcDescriptor.get.call(this);
    },
    set: function (value) {
      log('[HTMLImageElement.prototype.src] Set called:', value ? value.substring(0, 80) : 'null');
      log('[HTMLImageElement.prototype.src] Flags - beingChecked:', imagesBeingChecked.has(this), 'processed:', processedImages.has(this));

      // Prevent infinite loops by tracking this specific element
      if (!imagesBeingChecked.has(this) && !processedImages.has(this) && value && typeof value === 'string') {
        // Match explicit extensions OR URLs with image indicators (f=JPEG, fmt=auto, etc.)
        const isEnhancedMode = enhanceBtn.dataset.active === 'true';
        if (value.startsWith('data:image/') ||
          (value.startsWith('http') && (
            (isEnhancedMode ? /(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(value) : /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(value)) ||
            /[?&](f|fmt|format)=(jpe?g|png|gif|webp|svg|bmp|ico)/i.test(value)))) {
          log('[HTMLImageElement.prototype.src] ✓ Match found, adding to queue');
          processedImages.add(this);
          addToQueue(value);
        } else {
          log('[HTMLImageElement.prototype.src] ✗ No match - starts with:', value.substring(0, 20));
        }
      } else {
        log('[HTMLImageElement.prototype.src] Skipped due to flags or already processed');
      }
      originalPrototypeSrcDescriptor.set.call(this, value);
    },
    configurable: true
  });

  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    const result = originalSetAttribute.call(this, name, value);
    if (!imagesBeingChecked.has(this) && this.tagName === 'IMG' && name === 'src' && value) {
      log('[Element.prototype.setAttribute] called, the tagName is IMG', value);
      // Capture both data:image and regular image URLs
      // Match explicit extensions OR URLs with image indicators (f=JPEG, fmt=auto, etc.)
      const isEnhancedMode = enhanceBtn.dataset.active === 'true';
      if (value.startsWith('data:image/') ||
        (value.startsWith('http') && (
          (isEnhancedMode ? /(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(value) : /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(value)) ||
          /[?&](f|fmt|format)=(jpe?g|png|gif|webp|svg|bmp|ico)/i.test(value)))) {
        addToQueue(value);
      }
    }
    return result;
  };

  // Monitor XHR
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._requestUrl = url;
    return originalXHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', function () {
      if (toggleBtn.dataset.active !== 'true') return;

      try {
        // Check if this is an image request by URL
        const url = this._requestUrl;
        if (url && typeof url === 'string') {
          // Check if URL is an image - match explicit extensions OR image indicators
          const isEnhancedMode = enhanceBtn.dataset.active === 'true';
          if ((isEnhancedMode ? /(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(url) : /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(url)) ||
            /[?&](f|fmt|format)=(jpe?g|png|gif|webp|svg|bmp|ico)/i.test(url) ||
            (this.responseType === 'blob' && this.response && this.response.type && this.response.type.startsWith('image/'))) {
            // For image URLs, add directly
            log('[XMLHttpRequest.prototype.send.load] called, the request url is image type');
            if (url.startsWith('http')) {
              addToQueue(url);
            }
          }
        }

        // Also check response text for data:image
        const responseText = this.responseText;
        if (responseText && responseText.includes('data:image/')) {
          log('[XMLHttpRequest.prototype.send.load] called, the response is image type');
          const dataImageRegex = /data:image\/[\w+]+;base64,[A-Za-z0-9+/=]+/g;
          const matches = responseText.match(dataImageRegex);
          if (matches) {
            matches.forEach(dataUrl => addToQueue(dataUrl));
          }
        }
      } catch (error) { }
    });
    return originalXHRSend.apply(this, arguments);
  };

  // Monitor fetch
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    const url = typeof resource === 'string' ? resource : resource.url;

    return originalFetch.apply(this, arguments).then(function (response) {
      if (toggleBtn.dataset.active !== 'true') return response;

      // Check if this is an image request by URL - match explicit extensions OR image indicators
      if (url && typeof url === 'string') {
        const isEnhancedMode = enhanceBtn.dataset.active === 'true';
        if ((isEnhancedMode ? /(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(url) : /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(url)) ||
          /[?&](f|fmt|format)=(jpe?g|png|gif|webp|svg|bmp|ico)/i.test(url) ||
          (response.headers.get('content-type') && response.headers.get('content-type').startsWith('image/'))) {
          log('[window.fetch] called, the request url is image type');
          // For image URLs, add directly
          if (url.startsWith('http')) {
            addToQueue(url);
          }
        }
      }

      // Also check response text for data:image
      const clonedResponse = response.clone();
      clonedResponse.text().then(function (text) {
        if (text && text.includes('data:image/')) {
          log('[window.fetch] called, the response is image type');
          const dataImageRegex = /data:image\/[\w+]+;base64,[A-Za-z0-9+/=]+/g;
          const matches = text.match(dataImageRegex);
          if (matches) {
            matches.forEach(dataUrl => addToQueue(dataUrl));
          }
        }
      }).catch(function () { });

      return response;
    });
  };

  // Monitor canvas
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function () {
    const result = originalToDataURL.apply(this, arguments);
    if (result && result.startsWith('data:image/')) {
      log('[HTMLCanvasElement.prototype.toDataURL] called, get canvas picture');
      addToQueue(result);
    }
    return result;
  };

  log('Image Capture initialized');
})();
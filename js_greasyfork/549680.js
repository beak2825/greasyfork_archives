// ==UserScript==
// @name         View Images from getepic
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  View book images from getepic in a custom viewer - auto-loads with retry, cover on first row, seamless side-by-side images
// @author       You
// @match        https://www.getepic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getepic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549680/View%20Images%20from%20getepic.user.js
// @updateURL https://update.greasyfork.org/scripts/549680/View%20Images%20from%20getepic.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const originalXhrOpen = window.XMLHttpRequest.prototype.open;
  const originalXhrSend = window.XMLHttpRequest.prototype.send;

  let imageUrls = [];
  let bookTitle = '';
  let autoClickEnabled = true;

  function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .custom-button-class {
        height: 40px;
        border-radius: 20px;
        padding: 0px 10px;
        border: none;
        color: white;
        font-weight: 600;
        background: #0b6da4;
        cursor: pointer;
        margin-right: 10px;
      }

      .image-viewer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
      }

      .image-viewer-header {
        position: sticky;
        top: 0;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px 0;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        z-index: 10001;
      }

      .image-viewer-title {
        font-size: 20px;
        font-weight: bold;
      }

      .image-viewer-close {
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }

      .image-viewer-close:hover {
        background: #cc0000;
      }

      .image-viewer-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 20px;
        column-gap: 0px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .image-viewer-item {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .image-viewer-item.cover-page {
        grid-column: 1 / -1;
        max-width: 600px;
        margin: 0 auto;
      }

      .image-viewer-item img {
        width: 100%;
        height: auto;
        display: block;
      }

      .image-viewer-item .page-number {
        padding: 10px;
        text-align: center;
        background: #f0f0f0;
        font-weight: bold;
        color: #333;
      }

      .loading-indicator {
        color: white;
        text-align: center;
        font-size: 18px;
        margin: 20px 0;
      }

      @media (max-width: 768px) {
        .image-viewer-container {
          grid-template-columns: 1fr;
        }

        .image-viewer-overlay {
          padding: 10px;
        }

        .image-viewer-item.cover-page {
          max-width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  window.XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return originalXhrOpen.apply(this, arguments);
  };

  window.XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
      if (this._url.includes('class=WebBook&method=getFullDataForWeb')) {
        console.info('Book data detected');
        const responseData = JSON.parse(this.responseText);

        // Extract image URLs from the API response
        imageUrls = responseData.result?.epub?.spine?.map(imageData => imageData.pageCdn) || [];
        bookTitle = responseData.result?.book?.title || 'Unknown Book';

        if (imageUrls.length > 0) {
          addViewerButton();

          // Auto-click the view images button after a short delay with retry logic
          if (autoClickEnabled) {
            setTimeout(() => {
              attemptAutoClick();
            }, 1000);
          }
        }
      }
    });

    return originalXhrSend.apply(this, arguments);
  };

  function attemptAutoClick(retryCount = 0) {
    const maxRetries = 3;
    const viewButton = document.querySelector('.epic-viewer-container .custom-button-class');

    if (viewButton) {
      console.info('Auto-clicking View Images button');
      viewButton.click();
    } else if (retryCount < maxRetries) {
      console.info(`Auto-click failed, retrying... (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => {
        attemptAutoClick(retryCount + 1);
      }, 1000);
    } else {
      console.warn('Auto-click failed after maximum retries');
    }
  }

  function addViewerButton() {
    // Remove existing button if it exists
    const existingContainer = document.querySelector('.epic-viewer-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const viewButton = document.createElement('button');
    viewButton.textContent = 'View Images';
    viewButton.classList.add('custom-button-class');

    const imageCountSpan = document.createElement('span');
    imageCountSpan.style.color = 'white';
    imageCountSpan.style.fontWeight = 'normal';
    imageCountSpan.textContent = `(${imageUrls.length} pages)`;

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('epic-viewer-container');
    containerDiv.appendChild(viewButton);
    containerDiv.appendChild(imageCountSpan);

    viewButton.addEventListener('click', function() {
      autoClickEnabled = false; // Disable auto-click after manual click
      openImageViewer();
    });

    const headerLeftSection = document.querySelector('.header-section.header-left-section');
    if (headerLeftSection) {
      headerLeftSection.appendChild(containerDiv);
    } else {
      console.error('Header section not found');
    }
  }

  function openImageViewer() {
    const overlay = document.createElement('div');
    overlay.classList.add('image-viewer-overlay');

    const header = document.createElement('div');
    header.classList.add('image-viewer-header');

    const title = document.createElement('div');
    title.classList.add('image-viewer-title');
    title.textContent = bookTitle;

    const closeButton = document.createElement('button');
    closeButton.classList.add('image-viewer-close');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', function() {
      overlay.remove();
    });

    header.appendChild(title);
    header.appendChild(closeButton);

    const container = document.createElement('div');
    container.classList.add('image-viewer-container');

    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('loading-indicator');
    loadingIndicator.textContent = 'Loading images...';

    overlay.appendChild(header);
    overlay.appendChild(loadingIndicator);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Load images progressively
    loadImagesProgressively(container, loadingIndicator);

    // Close on escape key
    const escapeHandler = function(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  async function loadImagesProgressively(container, loadingIndicator) {
    loadingIndicator.textContent = `Loading images... 0/${imageUrls.length}`;
    let loadedCount = 0;
    let failedImages = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const success = await loadSingleImage(i, container, loadingIndicator);
      if (success) {
        loadedCount++;
      } else {
        failedImages.push(i);
      }

      loadingIndicator.textContent = `Loading images... ${i + 1}/${imageUrls.length}`;
    }

    // Retry failed images
    if (failedImages.length > 0) {
      loadingIndicator.textContent = `Retrying ${failedImages.length} failed images...`;

      for (let i = 0; i < failedImages.length; i++) {
        const imageIndex = failedImages[i];
        await new Promise(resolve => setTimeout(resolve, 500)); // Longer delay for retries
        const success = await loadSingleImage(imageIndex, container, loadingIndicator, true);
        if (success) {
          loadedCount++;
        }
      }
    }

    const finalMessage = failedImages.length > 0 ?
      `Loaded ${loadedCount}/${imageUrls.length} images` :
      `All ${imageUrls.length} images loaded`;

    loadingIndicator.textContent = finalMessage;
    setTimeout(() => {
      loadingIndicator.style.display = 'none';
    }, 2000);
  }

  async function loadSingleImage(i, container, loadingIndicator, isRetry = false) {
    const imageUrl = imageUrls[i];
    const proxUrl = 'https://wsrv.nl/?url=' + encodeURIComponent(imageUrl);

    return new Promise(async (resolve) => {
      try {
        let imageItem;

        if (isRetry) {
          // Find existing image item and update it
          imageItem = container.children[i];
          if (!imageItem) {
            resolve(false);
            return;
          }

          // Clear the existing content
          imageItem.innerHTML = '';
        } else {
          // Create new image item
          imageItem = document.createElement('div');
          imageItem.classList.add('image-viewer-item');

          // Make the first image (cover) span full width
          if (i === 0) {
            imageItem.classList.add('cover-page');
          }
        }

        const img = document.createElement('img');
        img.src = proxUrl;
        img.alt = i === 0 ? 'Cover' : `Page ${i + 1}`;

        const pageNumber = document.createElement('div');
        pageNumber.classList.add('page-number');
        pageNumber.textContent = i === 0 ? 'Cover' : `Page ${i + 1}`;

        // Set timeout for image loading
        const loadTimeout = setTimeout(() => {
          console.error(`Timeout loading ${i === 0 ? 'cover' : 'page ' + (i + 1)}`);
          pageNumber.textContent = (i === 0 ? 'Cover' : `Page ${i + 1}`) + ' - Load timeout';
          pageNumber.style.color = '#ff4444';
          resolve(false);
        }, 10000); // 10 second timeout

        img.onload = function() {
          clearTimeout(loadTimeout);
          console.log(`Loaded ${i === 0 ? 'cover' : 'page ' + (i + 1)}${isRetry ? ' (retry)' : ''}`);
          resolve(true);
        };

        img.onerror = function() {
          clearTimeout(loadTimeout);
          console.error(`Failed to load ${i === 0 ? 'cover' : 'page ' + (i + 1)}${isRetry ? ' (retry)' : ''}`);
          pageNumber.textContent = (i === 0 ? 'Cover' : `Page ${i + 1}`) + ' - Failed to load';
          pageNumber.style.color = '#ff4444';
          resolve(false);
        };

        imageItem.appendChild(img);
        imageItem.appendChild(pageNumber);

        if (!isRetry) {
          container.appendChild(imageItem);
        }

        // Small delay to prevent overwhelming the proxy service
        if (!isRetry && i < imageUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`Error loading image ${i + 1}:`, error);
        resolve(false);
      }
    });
  }

  // Initialize
  addCustomStyles();
  console.info('GetEpic Image Viewer v2.2 loaded - Auto-click with retry enabled');

})();
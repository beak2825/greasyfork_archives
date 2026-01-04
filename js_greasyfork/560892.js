// ==UserScript==
// @name         snapdom test
// @namespace    http://tampermonkey.net/
// @version      2025-12-31
// @description  ʕ•ᴥ•ʔ Capture page DOM snapshot using snapdom
// @author       canvascat@qq.cn
// @match        https://*.antgroup.com/*
// @match        https://*.pro.ant.design/*
// @match        https://*.shadcn.com/*
// @match        https://localhost:*/*
// @icon         https://snapdom.dev/assets/favicon/favicon.ico
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/@zumer/snapdom/dist/snapdom.js
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/560892/snapdom%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/560892/snapdom%20test.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const prefix = `snapdom-${Date.now().toString(36)}`;
  const toastId = `${prefix}-toast`;
  const toastStylesId = `${toastId}-styles`;
  const highlightBoxId = `${prefix}-highlight-box`;

  // Wait for snapdom library to load
  function waitForSnapdom() {
    return new Promise((resolve) => {
      if (window.snapdom) {
        resolve(window.snapdom);
        return;
      }
      const checkInterval = setInterval(() => {
        if (window.snapdom) {
          clearInterval(checkInterval);
          resolve(window.snapdom);
        }
      }, 100);
    });
  }

  // Create Toast notification (Sonner style)
  function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existingToast = document.getElementById(toastId);
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast container
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.dataset.capture = "exclude";

    // Set icon and color based on type (Sonner style)
    const config = {
      success: {
        icon: '✓',
        accentColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.1)',
        iconColor: '#10b981'
      },
      error: {
        icon: '✕',
        accentColor: '#ef4444',
        iconBg: 'rgba(239, 68, 68, 0.1)',
        iconColor: '#ef4444'
      },
      loading: {
        icon: '⟳',
        accentColor: '#3b82f6',
        iconBg: 'rgba(59, 130, 246, 0.1)',
        iconColor: '#3b82f6'
      },
      info: {
        icon: 'ℹ',
        accentColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.1)',
        iconColor: '#6366f1'
      }
    };

    const style = config[type] || config.info;

    // Add animation styles (if not already added)
    if (!document.getElementById(toastStylesId)) {
      const styleSheet = document.createElement('style');
      styleSheet.dataset.capture = "exclude";
      styleSheet.id = toastStylesId;
      styleSheet.textContent = `
        @keyframes toast-slide-in {
          from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        @keyframes toast-slide-out {
          from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          to {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
          }
        }
        @keyframes toast-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        #${toastId} {
          animation: toast-slide-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
        #${toastId}.toast-exit {
          animation: toast-slide-out 0.2s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
        }
        #${toastId} .toast-icon.loading {
          animation: toast-spin 1s linear infinite;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Set styles (Sonner style)
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000000;
      min-width: 356px;
      max-width: 420px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      pointer-events: auto;
      overflow: hidden;
    `;

    // Create content structure
    const content = document.createElement('div');
    content.dataset.capture = "exclude";
    content.style.cssText = `
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
    `;

    // Icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'toast-icon-container';
    iconContainer.style.cssText = `
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background: ${style.iconBg};
      color: ${style.iconColor};
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
    `;

    const icon = document.createElement('span');
    icon.className = type === 'loading' ? 'toast-icon loading' : 'toast-icon';
    icon.textContent = style.icon;
    icon.style.cssText = `
      display: inline-block;
      ${type === 'loading' ? 'font-size: 16px;' : ''}
    `;
    iconContainer.appendChild(icon);

    // Text content
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      flex: 1;
      font-size: 14px;
      line-height: 1.5;
      color: #09090b;
      font-weight: 400;
      word-break: break-word;
    `;
    messageEl.textContent = message;

    // Left accent bar
    const accentBar = document.createElement('div');
    accentBar.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${style.accentColor};
    `;

    // Assemble structure
    content.appendChild(iconContainer);
    content.appendChild(messageEl);
    toast.appendChild(accentBar);
    toast.appendChild(content);

    // Add to page
    document.body.appendChild(toast);

    // Auto remove (loading type doesn't auto-remove)
    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 200);
      }, duration);
    }

    return toast;
  }

  /**
   * Execute screenshot function
   * @param {'svg' | 'png'} format
   * @param {HTMLElement} targetElement - Optional, specify element to capture, defaults to entire page
   */
  async function takeScreenshot(format = 'svg', targetElement = null) {
    // Show loading toast
    const loadingToast = showToast('Capturing screenshot...', 'loading', 0);

    try {
      const snapdom = await waitForSnapdom();
      if (!snapdom) {
        throw new Error('snapdom library not loaded');
      }

      // Determine element to capture
      const elementToCapture = targetElement || document.documentElement;

      // Execute screenshot
      const result = await snapdom(elementToCapture);

      // Generate filename
      let filename = `${location.host.split('.')[0]}_${location.pathname}_${new Date().toLocaleTimeString().split(' ')[0].replace(/:/g, '')}`;
      if (targetElement) {
        // If targeting specific element, add element identifier
        const tagName = targetElement.tagName.toLowerCase();
        const className = targetElement.className ? targetElement.className.split(' ')[0] : '';
        filename += `_${tagName}${className ? '_' + className : ''}`;
      }
      // Keep only letters, numbers, and underscores
      filename = filename.replace(/[^a-zA-Z0-9_]/g, '');

      await result.download({ format, filename });

      // Remove loading toast
      if (loadingToast && loadingToast.parentNode) {
        loadingToast.remove();
      }

      // Show success toast
      showToast('Screenshot saved! File downloaded', 'success');
    } catch (error) {
      console.error('Screenshot failed:', error);

      // Remove loading toast
      if (loadingToast && loadingToast.parentNode) {
        loadingToast.remove();
      }

      // Show error toast
      showToast(`Screenshot failed: ${error.message}`, 'error');
    }
  }

  // Element selection mode related variables
  let isElementSelectMode = false;
  let highlightBox = null;
  let currentHoveredElement = null;

  /**
   * Create highlight box
   */
  function createHighlightBox() {
    if (highlightBox) return highlightBox;

    highlightBox = document.createElement('div');
    highlightBox.dataset.capture = "exclude";
    highlightBox.id = highlightBoxId;
    highlightBox.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 999998;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.1s ease-out;
      box-sizing: border-box;
      display: none;
    `;
    document.body.appendChild(highlightBox);
    return highlightBox;
  }

  /**
   * Update highlight box position
   * @param {HTMLElement} element
   */
  function updateHighlightBox(element) {
    if (!highlightBox || !element) return;

    const rect = element.getBoundingClientRect();

    // Use fixed positioning, directly use getBoundingClientRect values
    highlightBox.style.left = `${rect.left}px`;
    highlightBox.style.top = `${rect.top}px`;
    highlightBox.style.width = `${rect.width}px`;
    highlightBox.style.height = `${rect.height}px`;
    highlightBox.style.display = 'block';
  }

  /**
   * Hide highlight box
   */
  function hideHighlightBox() {
    if (highlightBox) {
      highlightBox.style.display = 'none';
    }
  }

  /**
   * Remove highlight box
   */
  function removeHighlightBox() {
    if (highlightBox && highlightBox.parentNode) {
      highlightBox.remove();
      highlightBox = null;
    }
  }

  /**
   * Get element under mouse (exclude highlight box and toast)
   * @param {MouseEvent} e
   * @returns {HTMLElement | null}
   */
  function getElementUnderMouse(e) {
    // Temporarily hide highlight box to avoid affecting element detection
    if (highlightBox) {
      highlightBox.style.pointerEvents = 'none';
    }

    const element = document.elementFromPoint(e.clientX, e.clientY);

    // If clicking on highlight box or toast, return null
    if (!element ||
      element.id === highlightBoxId ||
      element.id === toastId ||
      element.closest(`#${highlightBoxId}`) ||
      element.closest(`#${toastId}`)) {
      return null;
    }

    return element;
  }

  /**
   * Handle mouse move
   */
  function handleMouseMove(e) {
    if (!isElementSelectMode) return;

    const element = getElementUnderMouse(e);

    if (element && element !== currentHoveredElement) {
      currentHoveredElement = element;
      updateHighlightBox(element);
    } else if (!element && currentHoveredElement) {
      // Hide highlight box when mouse leaves element
      currentHoveredElement = null;
      hideHighlightBox();
    }
  }

  /**
   * Handle mouse click
   */
  async function handleMouseClick(e) {
    if (!isElementSelectMode) return;

    e.preventDefault();
    e.stopPropagation();

    const element = getElementUnderMouse(e);

    if (element) {
      // Exit selection mode
      exitElementSelectMode();

      // Capture selected element
      await takeScreenshot('svg', element);
    }
  }

  /**
   * Handle keyboard events (ESC to exit selection mode)
   */
  function handleKeyDown(e) {
    if (!isElementSelectMode) return;

    if (e.key === 'Escape') {
      exitElementSelectMode();
      showToast('Element selection cancelled', 'info');
    }
  }

  /**
   * Handle scroll (update highlight box position)
   */
  function handleScroll() {
    if (!isElementSelectMode || !currentHoveredElement) return;
    updateHighlightBox(currentHoveredElement);
  }

  /**
   * Enter element selection mode
   */
  function enterElementSelectMode() {
    if (isElementSelectMode) return;

    isElementSelectMode = true;
    createHighlightBox();

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleMouseClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('scroll', handleScroll, true);

    // Change cursor style
    document.body.style.cursor = 'crosshair';
    document.body.style.userSelect = 'none';

    showToast('Select an element to capture, press ESC to cancel', 'info', 5000);
  }

  /**
   * Exit element selection mode
   */
  function exitElementSelectMode() {
    if (!isElementSelectMode) return;

    isElementSelectMode = false;
    currentHoveredElement = null;

    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('click', handleMouseClick, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('scroll', handleScroll, true);

    // Restore cursor style
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Hide highlight box
    hideHighlightBox();
  }

  // Register Tampermonkey menu commands
  if (typeof GM_registerMenuCommand !== 'undefined') {
    // Register screenshot menu items
    GM_registerMenuCommand('📸 Screenshot (SVG)', () => takeScreenshot('svg'), 's');
    GM_registerMenuCommand('📸 Screenshot (PNG)', () => takeScreenshot('png'), 'p');
    // Register element selection screenshot menu item
    GM_registerMenuCommand('🎯 Select Element to Capture', () => enterElementSelectMode(), 'e');
  }
})();

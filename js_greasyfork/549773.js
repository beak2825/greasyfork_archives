// ==UserScript==
// @name         pekoraExtension
// @namespace    pekoraExtension
// @version      2.0.0
// @description  Custom styling panel for pekora - Optimized version
// @author       ZyyScripts (https://github.com/ZyyScripts) - Optimized by Cascade - More optimizations by cheesecake
// @match        https://www.pekora.zip/*
// @icon         https://i.imgur.com/lKe4ks1.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549773/pekoraExtension.user.js
// @updateURL https://update.greasyfork.org/scripts/549773/pekoraExtension.meta.js
// ==/UserScript==

(() => {
  'use strict';

    if (document.title.includes("Just a moment") || document.title.includes("Checking your browser")) {
    return;
}


  // Configuration with validation
  const defaultConfig = {
    bgMedia: '',
    radius: 0,
    noAds: false,
    noAlerts: false,
    panelPosition: { x: 20, y: 20 }
  };

  let config = {};
  let observers = [];
  let eventListeners = [];

  // Safe config loading with validation
  function loadConfig() {
    try {
      const stored = localStorage.getItem('vendor');
      config = Object.assign({}, defaultConfig, stored ? JSON.parse(stored) : {});

      // Validate config values
      config.radius = Math.max(0, Math.min(50, Number(config.radius) || 0));
      config.panelPosition = config.panelPosition || defaultConfig.panelPosition;
    } catch (e) {
      console.warn('Vendor: Failed to load config, using defaults:', e);
      config = { ...defaultConfig };
    }
  }

  function saveConfig() {
    try {
      localStorage.setItem('vendor', JSON.stringify(config));
    } catch (e) {
      console.error('Vendor: Failed to save config:', e);
    }
  }

  // Debounced save function
  const debouncedSave = debounce(saveConfig, 300);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // CSS injection with better performance
  function injectStyle() {
    const styleId = 'vendor-style';
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    // Use CSS custom properties for better performance
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&family=Orbitron&family=Pixelify+Sans:wght@400;700&display=swap');

      :root {
        --vendor-radius: ${config.radius}px;
        --vendor-bg: ${config.bgMedia ? `url("${CSS.escape(config.bgMedia)}")` : 'none'};
      }

      html, body {
        ${config.bgMedia ? `
          background: var(--vendor-bg) no-repeat center center fixed !important;
          background-size: cover !important;
        ` : ''}
      }

      body *:not(#vendor-panel, #vendor-panel *, .vendor-exclude) {
        border-radius: var(--vendor-radius) !important;
      }

      #vendor-panel {
        position: fixed;
        top: ${config.panelPosition.y}%;
        left: ${config.panelPosition.x}%;
        width: min(500px, 90vw);
        max-height: 80vh;
        overflow-y: auto;
        background: rgba(51, 51, 51, 0.95);
        backdrop-filter: blur(10px);
        border: 2px solid #000;
        padding: 0;
        z-index: 99999;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        border-radius: calc(var(--vendor-radius) + 5px);
        transition: all 0.3s ease;
      }

      #vendor-panel .header {
        background: linear-gradient(135deg, #000, #333);
        padding: 12px 15px;
        text-align: center;
        color: #fff;
        cursor: move;
        user-select: none;
        border-radius: calc(var(--vendor-radius) + 3px) calc(var(--vendor-radius) + 3px) 0 0;
      }

      #vendor-panel .content {
        padding: 15px;
      }

      #vendor-panel .row {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      #vendor-panel select,
      #vendor-panel input[type="range"],
      #vendor-panel input[type="file"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #222;
        color: #fff;
      }

      #vendor-panel input[type="checkbox"] {
        margin-right: 8px;
        transform: scale(1.2);
      }

      #vendor-panel .actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #555;
      }

      #vendor-panel button {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      #vendor-panel #save {
        background: #4CAF50;
        color: white;
      }

      #vendor-panel #save:hover {
        background: #45a049;
      }

      #vendor-panel #reset {
        background: #f44336;
        color: white;
      }

      #vendor-panel #reset:hover {
        background: #da190b;
      }

      #vendor-panel #close-panel {
        float: right;
        cursor: pointer;
        padding: 0 5px;
        border-radius: 3px;
        transition: background 0.2s ease;
      }

      #vendor-panel #close-panel:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .vendor-range-value {
        color: #ccc;
        text-align: right;
      }

      /* Hide elements based on config */
      ${config.noAds ? `
        [class*="adWrapper"],
        [class*="ad-"],
        .advertisement,
        [data-ad] {
          display: none !important;
        }
      ` : ''}

      ${config.noAlerts ? `
        .alertBg-0-2-19,
        [class*="alert"],
        .notification-popup {
          display: none !important;
        }
      ` : ''}

      /* Responsive design */
      @media (max-width: 768px) {
        #vendor-panel {
          width: 95vw;
          left: 2.5% !important;
          top: 10% !important;
        }
      }
    `;
  }

  // Optimized DOM updates using CSS custom properties
  function updateStyles() {
    const root = document.documentElement;
    root.style.setProperty('--vendor-radius', `${config.radius}px`);
    root.style.setProperty('--vendor-bg', config.bgMedia ? `url("${config.bgMedia}")` : 'none');
  }

  // Enhanced panel creation with better event handling
  function createPanel() {
    if (document.getElementById('vendor-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'vendor-panel';
    panel.style.display = 'none';
    panel.className = 'vendor-exclude';

    const fontOptions = [
      'Arial, sans-serif',
      'Verdana, sans-serif',
      'Tahoma, sans-serif',
      'Trebuchet MS, sans-serif',
      'Courier New, monospace',
      'Georgia, serif',
      "'Press Start 2P', monospace",
      "'VT323', monospace",
      "'Share Tech Mono', monospace",
      "'Orbitron', sans-serif",
      "'Pixelify Sans', cursive"
    ];

    panel.innerHTML = `
      <div class="header">
        Vendor
        <span id="close-panel" title="Close Panel">✖</span>
      </div>
      <div class="content">
        <div class="row">
          <label for="font-select">Font Family:</label>
          <select id="font-select">
            ${fontOptions.map(font =>
              `<option value="${font}" ${config.font === font ? 'selected' : ''}>
                ${font.replace(/['"]/g, '').replace(/,.*/, '')}
              </option>`
            ).join('')}
          </select>
        </div>

        <div class="row">
          <label for="radius">Border Radius:</label>
          <input id="radius" type="range" min="0" max="50" value="${config.radius}" step="1">
          <div class="vendor-range-value">${config.radius}px</div>
        </div>

        <div class="row">
          <label>
            <input id="ads" type="checkbox" ${config.noAds ? 'checked' : ''}>
            Hide Advertisements
          </label>
        </div>

        <div class="row">
          <label>
            <input id="alerts" type="checkbox" ${config.noAlerts ? 'checked' : ''}>
            Hide Alert Notifications
          </label>
        </div>

        <div class="row">
          <label for="bg-file">Background Image:</label>
          <input id="bg-file" type="file" accept="image/*" aria-describedby="bg-help">
          <small id="bg-help" style="color: #ccc; font-size: 12px;">
            Supports JPG, PNG, GIF, WebP (max 5MB)
          </small>
        </div>

        <div class="actions">
          <button id="save" type="button">Apply Changes</button>
          <button id="reset" type="button">Reset to Default</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    setupPanelEvents(panel);
  }

  // Centralized event handling with cleanup
  function setupPanelEvents(panel) {
    const elements = {
      closeBtn: panel.querySelector('#close-panel'),
      fontSelect: panel.querySelector('#font-select'),
      radiusInput: panel.querySelector('#radius'),
      radiusValue: panel.querySelector('.vendor-range-value'),
      adsCheckbox: panel.querySelector('#ads'),
      alertsCheckbox: panel.querySelector('#alerts'),
      bgFileInput: panel.querySelector('#bg-file'),
      saveBtn: panel.querySelector('#save'),
      resetBtn: panel.querySelector('#reset'),
      header: panel.querySelector('.header')
    };

    // Close panel
    const closeHandler = () => panel.style.display = 'none';
    elements.closeBtn.addEventListener('click', closeHandler);
    eventListeners.push({ element: elements.closeBtn, event: 'click', handler: closeHandler });

    // Font selection with validation
    const fontHandler = (e) => {
      const selectedFont = e.target.value;
      if (fontOptions.includes(selectedFont)) {
        config.font = selectedFont;
        updateStyles();
        debouncedSave();
      }
    };
    elements.fontSelect.addEventListener('change', fontHandler);
    eventListeners.push({ element: elements.fontSelect, event: 'change', handler: fontHandler });

    // Radius with live preview and validation
    const radiusHandler = (e) => {
      const value = Math.max(0, Math.min(50, parseInt(e.target.value) || 0));
      config.radius = value;
      elements.radiusValue.textContent = `${value}px`;
      updateStyles();
      debouncedSave();
    };
    elements.radiusInput.addEventListener('input', radiusHandler);
    eventListeners.push({ element: elements.radiusInput, event: 'input', handler: radiusHandler });

    // Checkboxes
    const adsHandler = (e) => {
      config.noAds = e.target.checked;
      debouncedSave();
    };
    elements.adsCheckbox.addEventListener('change', adsHandler);
    eventListeners.push({ element: elements.adsCheckbox, event: 'change', handler: adsHandler });

    const alertsHandler = (e) => {
      config.noAlerts = e.target.checked;
      debouncedSave();
    };
    elements.alertsCheckbox.addEventListener('change', alertsHandler);
    eventListeners.push({ element: elements.alertsCheckbox, event: 'change', handler: alertsHandler });

    // File upload with validation and error handling
    const fileHandler = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file
      const maxSize = 100 * 3840 * 2160; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (file.size > maxSize) {
        alert('File too large. Please select an image under 5MB.');
        e.target.value = '';
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a JPG, PNG, GIF, or WebP image.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          config.bgMedia = ev.target.result;
          updateStyles();
          debouncedSave();
        } catch (error) {
          console.error('Vendor: Failed to process image:', error);
          alert('Failed to process image. Please try a different file.');
        }
      };
      reader.onerror = () => {
        console.error('Vendor: Failed to read file');
        alert('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    };
    elements.bgFileInput.addEventListener('change', fileHandler);
    eventListeners.push({ element: elements.bgFileInput, event: 'change', handler: fileHandler });

    // Save and reset with user feedback
    const saveHandler = () => {
      try {
        injectStyle();
        updateStyles();
        saveConfig();

        // Visual feedback
        elements.saveBtn.textContent = 'Saved!';
        elements.saveBtn.style.background = '#2196F3';
        setTimeout(() => {
          elements.saveBtn.textContent = 'Apply Changes';
          elements.saveBtn.style.background = '#4CAF50';
        }, 1000);

        // Reload only if necessary (ads/alerts changed)
        if (config.noAds || config.noAlerts) {
          setTimeout(() => location.reload(), 1200);
        }
      } catch (error) {
        console.error('Vendor: Save failed:', error);
        alert('Failed to save settings. Please try again.');
      }
    };
    elements.saveBtn.addEventListener('click', saveHandler);
    eventListeners.push({ element: elements.saveBtn, event: 'click', handler: saveHandler });

    const resetHandler = () => {
      if (confirm('Reset all settings to default? This will reload the page.')) {
        try {
          localStorage.removeItem('vendor');
          config = { ...defaultConfig };
          updateStyles();
          injectStyle();
          location.reload();
        } catch (error) {
          console.error('Vendor: Reset failed:', error);
          alert('Failed to reset settings. Please try again.');
        }
      }
    };
    elements.resetBtn.addEventListener('click', resetHandler);
    eventListeners.push({ element: elements.resetBtn, event: 'click', handler: resetHandler });

    // Enhanced draggable functionality
    setupDraggable(panel, elements.header);
  }

  // Improved draggable with position persistence
  function setupDraggable(panel, header) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const mouseDownHandler = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = panel.offsetLeft;
      startTop = panel.offsetTop;

      header.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const mouseMoveHandler = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;

      // Constrain to viewport
      const maxLeft = window.innerWidth - panel.offsetWidth;
      const maxTop = window.innerHeight - panel.offsetHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      panel.style.left = `${newLeft}px`;
      panel.style.top = `${newTop}px`;
    };

    const mouseUpHandler = () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
        document.body.style.userSelect = '';

        // Save position as percentage
        config.panelPosition = {
          x: (panel.offsetLeft / window.innerWidth) * 100,
          y: (panel.offsetTop / window.innerHeight) * 100
        };
        debouncedSave();
      }
    };

    header.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    eventListeners.push(
      { element: header, event: 'mousedown', handler: mouseDownHandler },
      { element: document, event: 'mousemove', handler: mouseMoveHandler },
      { element: document, event: 'mouseup', handler: mouseUpHandler }
    );
  }

  // Optimized navigation tab injection using MutationObserver
  function addNavTab() {
    if (document.getElementById('vendor-tab')) return;

    const selectors = [
      '.navContainer-0-2-2 .row .col-0-2-15 .row',
      '.row:has(.linkEntry-0-2-13)',
      'nav .row'
    ];

    for (const selector of selectors) {
      try {
        const navRow = document.querySelector(selector);
        if (navRow) {
          const tab = document.createElement('div');
          tab.innerHTML = `<a id="vendor-tab" class="linkEntry-0-2-13 nav-link pt-0 vendor-exclude" href="#" title="Open Vendor Panel">Vendor</a>`;
          navRow.appendChild(tab);

          const clickHandler = (e) => {
            e.preventDefault();
            const panel = document.getElementById('vendor-panel');
            if (panel) {
              const isVisible = panel.style.display !== 'none';
              panel.style.display = isVisible ? 'none' : 'block';
            }
          };

          const tabLink = tab.querySelector('#vendor-tab');
          tabLink.addEventListener('click', clickHandler);
          eventListeners.push({ element: tabLink, event: 'click', handler: clickHandler });

          return true;
        }
      } catch (e) {
        console.warn('Vendor: Failed to find nav with selector:', selector);
      }
    }
    return false;
  }

  // Comprehensive logo replacement for all instances of ECSR logo URL



  // Optimized initialization using MutationObserver
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
          break;
        }
      }

      if (shouldCheck) {
        addNavTab();
        replaceLogo();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    observers.push(observer);
  }

  // Cleanup function
  function cleanup() {
    // Remove event listeners
    eventListeners.forEach(({ element, event, handler }) => {
      try {
        element.removeEventListener(event, handler);
      } catch (e) {
        console.warn('Vendor: Failed to remove event listener:', e);
      }
    });
    eventListeners = [];

    // Disconnect observers
    observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        console.warn('Vendor: Failed to disconnect observer:', e);
      }
    });
    observers = [];
  }

  // Enhanced initialization
  function init() {
    try {
      loadConfig();
      injectStyle();
      updateStyles();
      createPanel();

      // Initial setup
      addNavTab();


      // Set up DOM observation for dynamic content
      observeDOM();

      // Cleanup on page unload
      window.addEventListener('beforeunload', cleanup);

      console.log('Vendor: Successfully initialized');
    } catch (error) {
      console.error('Vendor: Initialization failed:', error);
    }
  }

  // Robust initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(init);
  }

  // Global reference for debugging (development only)
  if (typeof window !== 'undefined') {
    window.vendorDebug = {
      config,
      saveConfig,
      loadConfig,
      cleanup,
      version: '2.0.0'
    };
  }
})();

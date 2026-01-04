// ==UserScript==
// @name         enhanced godmode
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.3.2
// @description  Buttons für den PV mit Verwaltungs-Overlay und Dark-Mode-Support.
// @author       AFROnin/untopbar/mk (+martink)
// @exclude      *://*geizhals.*/?*
// @exclude      *://*geizhals.*/
// @include      *://geizhals.*/*
// @include      *://www.geizhals.*/*
// @include      *://preisvergleich.heise.de/*
// @include      *://preisvergleich.techstage.de/*
// @include      *://www.computerbase.de/preisvergleich/*
// @include      *://preisvergleich.pcgameshardware.de/*
// @noframes
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/551224/enhanced%20godmode.user.js
// @updateURL https://update.greasyfork.org/scripts/551224/enhanced%20godmode.meta.js
// ==/UserScript==

/* eslint-env jquery */
$(function () {
  'use strict';

  // Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
  try {
    if (window.self !== window.top) return;
  } catch (e) {
    // Cross-origin iframe - auch nicht ausführen
    return;
  }

  // Zusätzliche Prüfung: Nur auf Unterseiten ausführen (nicht auf Root)
  if (window.location.pathname === '/') return;

  // Verhindere mehrfache Initialisierung im selben Fenster
  if (window.__enhancedGodmodeInitialized) return;
  window.__enhancedGodmodeInitialized = true;

  // Blockt Variantenseiten wie .../irgendwas-v12345.html
  if (/\/[^/]*v\d+\.html(?:$|\?)/.test(location.pathname)) {
    return; // Skript NICHT ausführen
  }

  // ============================================
  // BUTTON-DEFINITIONEN
  // ============================================
  const BUTTONS = [
    { id: 'artikel_edit', label: 'artikel edit', type: 'normal', build: (base_url, id) => base_url + 'kalif/artikel?id=' + id },
    { id: 'mr', label: 'MR', type: 'normal', build: (base_url, id) => base_url + 'pv-edit/rulematcher.pl?id=' + id + '&rm=match' },
    { id: 'matchcode', label: 'Matchcode', type: 'ctimes', build: (base_url, ctimes_id) => base_url + 'kalif/eintrag/showeintr#ctimes_id=' + ctimes_id },
    { id: 'bilder', label: 'Bilder', type: 'normal', build: (base_url, id) => base_url + 'pv-edit/multi.pl?id=' + id },
    { id: 'log', label: 'Log', type: 'normal', build: (base_url, id) => base_url + 'pv-edit/showlog.pl?id=' + id },
    { id: 'template', label: 'Template', type: 'cat', build: (base_url, cat) => base_url + 'kalif/artikel/template#kats=' + cat },
    { id: 'kat', label: 'Kat', type: 'cat', build: (base_url, cat) => base_url + 'kalif/kat?id=' + cat },
    { id: 'filter_alt', label: 'Filter alt', type: 'cat', build: (base_url, cat) => base_url + 'pv-edit/katlist.pl?k=' + cat },
    { id: 'filter_neu', label: 'Filter neu', type: 'cat', build: (base_url, cat) => base_url + 'kalif/artikel/filter#kats=' + cat },
    { id: 'cleanup', label: 'Cleanup', type: 'cat', build: (base_url, cat) => base_url + 'pv-edit/kvmigration-value_cleanup.pl/kategorie/' + cat },
    { id: 'download_images', label: 'Download Bilder', type: 'action', action: 'downloadAllImages' }
  ];

  // ============================================
  // SPEICHERUNG UND DEFAULTS
  // ============================================
  const STORAGE_KEY = 'ghodmode_button_config';
  const STORAGE_KEY_OPTIONS = 'ghodmode_options';

  function getDefaultConfig() {
    const config = {};
    BUTTONS.forEach((btn, index) => {
      config[btn.id] = {
        visible: true,
        order: index
      };
    });
    return config;
  }

  function getDefaultOptions() {
    return {
      autoExpandDescriptions: true,
      showDocumentsInSidebar: true
    };
  }

  function getConfig() {
    try {
      const stored = GM_getValue(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Silent fail, return default config
    }
    return getDefaultConfig();
  }

  function saveConfig(config) {
    GM_setValue(STORAGE_KEY, JSON.stringify(config));
  }

  function getOptions() {
    try {
      const stored = GM_getValue(STORAGE_KEY_OPTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Silent fail, return default options
    }
    return getDefaultOptions();
  }

  function saveOptions(options) {
    GM_setValue(STORAGE_KEY_OPTIONS, JSON.stringify(options));
  }

  // ============================================
  // STYLES
  // ============================================
  function injectStyles() {
    if (document.getElementById('ghodmode-styles')) return;
    const css = `
      .god_btns_wrapper {
        display: block;
        margin-top: 8px;
        margin-bottom: 12px;
        line-height: 1.4;
        clear: both;
      }

      .god_btns {
        font-size: 12px;
        font-weight: normal;
        border: 1px solid #a00;
        padding: 2px 12px;
        color: #fff;
        background: #d00;
        text-decoration: none;
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        border-radius: 4px;
        cursor: pointer;
      }

      .god_btns:hover {
        border: 1px solid #800;
        background-color: #b00;
        text-decoration: none;
      }

      .god_btns[data-download-action] {
        background: #080;
        border: 1px solid #060;
      }

      .god_btns[data-download-action]:hover {
        background: #0a0;
        border: 1px solid #080;
      }

      .god_gear_btn {
        font-size: 18px;
        padding: 0;
        margin-right: 10px;
        background: none;
        border: none;
        color: #333;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        user-select: none;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .god_gear_btn:hover {
        opacity: 1;
      }

      .ghodmode-options-section {
        padding: 15px 10px;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 15px;
      }

      .ghodmode-option-item {
        display: flex;
        align-items: center;
      }

      .ghodmode-option-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
      }

      .ghodmode-option-checkbox {
        margin-right: 10px;
        cursor: pointer;
        width: 16px;
        height: 16px;
      }

      .ghodmode-section-divider {
        height: 1px;
        background: #ddd;
        margin: 10px 0;
      }

      .ghodmode-section-title {
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 15px 0;
        color: #333;
      }

      .ghodmode-sidebar-documents {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f9f9f9;
      }

      .ghodmode-sidebar-documents-title {
        font-size: 12px;
        font-weight: 600;
        margin: 0 0 10px 0;
        color: #333;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .ghodmode-sidebar-documents-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .ghodmode-sidebar-documents-item {
        font-size: 11px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ddd;
      }

      .ghodmode-sidebar-documents-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .ghodmode-sidebar-documents-item-link {
        display: block;
        color: #0066cc;
        text-decoration: none;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        font-weight: 500;
        margin-bottom: 3px;
        line-height: 1.3;
      }

      .ghodmode-sidebar-documents-item-link:hover {
        text-decoration: underline;
      }

      .ghodmode-sidebar-documents-item-details {
        font-size: 10px;
        color: #666;
        display: flex;
        flex-direction: column;
        gap: 2px;
        line-height: 1.2;
      }

      .ghodmode-sidebar-documents-item-flag {
        display: inline-block;
        width: 14px;
        height: 10px;
        margin-right: 4px;
        vertical-align: middle;
      }

      .ghodmode-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99999;
        align-items: center;
        justify-content: center;
      }

      .ghodmode-overlay.active {
        display: flex;
      }

      .ghodmode-modal {
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .ghodmode-modal-header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ghodmode-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ghodmode-modal-close:hover {
        color: #333;
      }

      .ghodmode-button-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .ghodmode-button-item {
        display: flex;
        align-items: center;
        padding: 12px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 10px;
        background: #f9f9f9;
      }

      .ghodmode-button-label {
        flex: 1;
        font-weight: 500;
        margin-right: 10px;
        min-width: 100px;
      }

      .ghodmode-button-controls {
        display: flex;
        gap: 4px;
      }

      .ghodmode-btn-ctrl {
        width: 32px;
        height: 32px;
        border: 1px solid #ccc;
        background: #f0f0f0;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        transition: all 0.2s;
      }

      .ghodmode-btn-ctrl:hover:not(:disabled) {
        background: #e0e0e0;
        border-color: #aaa;
      }

      .ghodmode-btn-ctrl:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .ghodmode-btn-ctrl.active {
        background: #04a;
        color: white;
        border-color: #039;
      }

      .ghodmode-modal-footer {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .ghodmode-modal-footer button {
        padding: 8px 16px;
        border: 1px solid #ccc;
        background: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .ghodmode-modal-footer button:hover {
        background: #e0e0e0;
        border-color: #aaa;
      }

      .ghodmode-modal-footer button[data-action="reset"] {
        background: #f88;
        border-color: #c00;
        color: white;
      }

      .ghodmode-modal-footer button[data-action="reset"]:hover {
        background: #f00;
        border-color: #900;
      }

      @media (prefers-color-scheme: dark) {
        .ghodmode-modal {
          background: #222;
          color: #e0e0e0;
        }

        .ghodmode-modal-header {
          color: #e0e0e0;
        }

        .ghodmode-modal-close {
          color: #999;
        }

        .ghodmode-modal-close:hover {
          color: #e0e0e0;
        }

        .ghodmode-options-section {
          background: #333;
          border-color: #444;
        }

        .ghodmode-option-label {
          color: #e0e0e0;
        }

        .ghodmode-section-divider {
          background: #444;
        }

        .ghodmode-section-title {
          color: #e0e0e0;
        }

        .ghodmode-sidebar-documents {
          background: #333;
          border-color: #444;
        }

        .ghodmode-sidebar-documents-title {
          color: #e0e0e0;
        }

        .ghodmode-sidebar-documents-item {
          border-color: #444;
        }

        .ghodmode-sidebar-documents-item-link {
          color: #4db8ff;
        }

        .ghodmode-sidebar-documents-item-details {
          color: #999;
        }

        .ghodmode-button-item {
          background: #333;
          border-color: #444;
        }

        .ghodmode-button-label {
          color: #e0e0e0;
        }

        .ghodmode-btn-ctrl {
          background: #444;
          border-color: #555;
          color: #e0e0e0;
        }

        .ghodmode-btn-ctrl:hover:not(:disabled) {
          background: #555;
          border-color: #666;
        }

        .ghodmode-btn-ctrl.active {
          background: #04a;
          border-color: #039;
        }

        .ghodmode-modal-footer {
          border-color: #444;
        }

        .ghodmode-modal-footer button {
          background: #444;
          border-color: #555;
          color: #e0e0e0;
        }

        .ghodmode-modal-footer button:hover {
          background: #555;
          border-color: #666;
        }

        .ghodmode-modal-footer button[data-action="reset"] {
          background: #c22;
          border-color: #800;
          color: white;
        }

        .ghodmode-modal-footer button[data-action="reset"]:hover {
          background: #f00;
          border-color: #900;
        }
      }

      /* Dark mode support for Geizhals (class-based, not media query) */
      .ghodmode-modal.dark-mode {
        background: #1a1a1a !important;
        color: #e0e0e0 !important;
        border: none !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-header {
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-close {
        color: #999 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-close:hover {
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-options-section {
        background: #333 !important;
        border-color: #444 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-option-label {
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-section-divider {
        background: #444 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-section-title {
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-sidebar-documents {
        background: #333 !important;
        border-color: #444 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-sidebar-documents-title {
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-sidebar-documents-item {
        border-color: #444 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-sidebar-documents-item-link {
        color: #4db8ff !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-sidebar-documents-item-details {
        color: #999 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-button-item {
        background: #333 !important;
        border-color: #444 !important;
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-button-label {
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-btn-ctrl {
        background: #444 !important;
        border-color: #555 !important;
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-btn-ctrl:hover:not(:disabled) {
        background: #555 !important;
        border-color: #666 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-btn-ctrl.active {
        background: #04a !important;
        border-color: #039 !important;
        color: white !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-footer {
        border-color: #444 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-footer button {
        background: #444 !important;
        border-color: #555 !important;
        color: #e0e0e0 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-footer button:hover {
        background: #555 !important;
        border-color: #666 !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-footer button[data-action="reset"] {
        background: #c22 !important;
        border-color: #800 !important;
        color: white !important;
      }

      .ghodmode-modal.dark-mode .ghodmode-modal-footer button[data-action="reset"]:hover {
        background: #f00 !important;
        border-color: #900 !important;
      }
    `;
    const style = document.createElement('style');
    style.id = 'ghodmode-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================
  // DARK MODE DETECTION FOR GEIZHALS
  // ============================================
  const DARK_MODE_CONFIG = {
    'geizhals.at': {
      cookies: [{ name: 'GeizhalsConfcookie', darkPattern: 'darkmode&on', lightPattern: 'darkmode&off' }],
      darkModeSelectors: ['.darkmode-icon[style*="display: none"]'],
      bodyClasses: ['dark']
    },
    'geizhals.de': {
      cookies: [{ name: 'GeizhalsConfcookie', darkPattern: 'darkmode&on', lightPattern: 'darkmode&off' }],
      darkModeSelectors: ['.darkmode-icon[style*="display: none"]'],
      bodyClasses: ['dark']
    },
    'geizhals.eu': {
      cookies: [{ name: 'GeizhalsConfcookie', darkPattern: 'darkmode&on', lightPattern: 'darkmode&off' }],
      darkModeSelectors: ['.darkmode-icon[style*="display: none"]'],
      bodyClasses: ['dark']
    }
  };

  function detectGeizhalsMode(hostname) {
    const config = DARK_MODE_CONFIG[hostname];

    if (!config) {
      return false;
    }

    // Check cookies first
    if (config.cookies && config.cookies.length > 0) {
      for (const cookieConfig of config.cookies) {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(cookieConfig.name + '='))
          ?.split('=')[1];

        if (cookieValue) {
          const isDarkFromCookie = cookieValue.includes(cookieConfig.darkPattern);
          const isLightFromCookie = cookieValue.includes(cookieConfig.lightPattern);

          if (isDarkFromCookie) {
            return true;
          }
          if (isLightFromCookie) {
            return false;
          }
        }
      }
    }

    // Check CSS selectors
    if (config.darkModeSelectors && config.darkModeSelectors.length > 0) {
      for (const selector of config.darkModeSelectors) {
        const found = document.querySelector(selector);
        if (found) {
          return true;
        }
      }
    }

    // Check body classes
    if (config.bodyClasses && config.bodyClasses.length > 0) {
      for (const className of config.bodyClasses) {
        const hasClass = document.body.classList.contains(className);
        if (hasClass) {
          return true;
        }
      }
    }

    return false;
  }

  function isDarkModeActive() {
    const hostname = window.location.hostname;

    if (hostname.includes('geizhals.')) {
      return detectGeizhalsMode(hostname);
    }

    const sysPref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return sysPref;
  }

  function applyDarkModeStyles(element) {
    const isDark = isDarkModeActive();

    if (isDark) {
      element.css({
        'background-color': '#1a1a1a !important',
        'color': '#e0e0e0 !important',
        'border-color': '#444 !important'
      });
      element.addClass('dark-mode');
    }
  }

  // ============================================
  // OVERLAY / SETTINGS UI
  // ============================================
  function createOverlay() {
    const config = getConfig();
    const options = getOptions();
    const overlay = $(`
      <div class="ghodmode-overlay">
        <div class="ghodmode-modal">
          <div class="ghodmode-modal-header">
            <span>Einstellungen</span>
            <button class="ghodmode-modal-close">✕</button>
          </div>
          <div class="ghodmode-options-section">
            <div class="ghodmode-option-item">
              <label class="ghodmode-option-label">
                <input type="checkbox" class="ghodmode-option-checkbox" id="auto-expand-descriptions" ${options.autoExpandDescriptions ? 'checked' : ''}>
                <span>Beschreibungen automatisch ausklappen</span>
              </label>
            </div>
            <div class="ghodmode-option-item">
              <label class="ghodmode-option-label">
                <input type="checkbox" class="ghodmode-option-checkbox" id="show-documents-sidebar" ${options.showDocumentsInSidebar ? 'checked' : ''}>
                <span>Dokumente neben Beschreibung anzeigen</span>
              </label>
            </div>
          </div>
          <div class="ghodmode-section-divider"></div>
          <h3 class="ghodmode-section-title">Button Verwaltung</h3>
          <ul class="ghodmode-button-list"></ul>
          <div class="ghodmode-modal-footer">
            <button data-action="reset">Zurücksetzen</button>
            <button data-action="close">Schließen</button>
          </div>
        </div>
      </div>
    `);

    // Handle auto-expand descriptions option
    overlay.find('#auto-expand-descriptions').on('change', function() {
      options.autoExpandDescriptions = $(this).is(':checked');
      saveOptions(options);
      if (options.autoExpandDescriptions) {
        expandAllDescriptions();
      }
    });

    // Handle show documents in sidebar option
    overlay.find('#show-documents-sidebar').on('change', function() {
      options.showDocumentsInSidebar = $(this).is(':checked');
      saveOptions(options);
      displayDocumentsInSidebar();
    });

    const list = overlay.find('.ghodmode-button-list');
    const sortedButtons = BUTTONS.slice().sort((a, b) => config[a.id].order - config[b.id].order);
    const maxOrder = Math.max(...Object.values(config).map(c => c.order));

    sortedButtons.forEach(btn => {
      const btnConfig = config[btn.id];
      const isVisible = btnConfig.visible;
      const currentOrder = btnConfig.order;

      const item = $(`
        <li class="ghodmode-button-item" data-button-id="${btn.id}">
          <div class="ghodmode-button-label">${btn.label}</div>
          <div class="ghodmode-button-controls">
            <button class="ghodmode-btn-ctrl ${isVisible ? 'active' : ''}" data-ctrl="toggle-on" ${isVisible ? 'disabled' : ''}>+</button>
            <button class="ghodmode-btn-ctrl ${!isVisible ? 'active' : ''}" data-ctrl="toggle-off" ${!isVisible ? 'disabled' : ''}>−</button>
            <button class="ghodmode-btn-ctrl" data-ctrl="move-up" ${currentOrder === 0 ? 'disabled' : ''}>↑</button>
            <button class="ghodmode-btn-ctrl" data-ctrl="move-down" ${currentOrder === maxOrder ? 'disabled' : ''}>↓</button>
          </div>
        </li>
      `);

      // Visibility toggles
      item.find('[data-ctrl="toggle-on"]').on('click', function() {
        config[btn.id].visible = true;
        saveConfig(config);
        renderButtons();
        updateOverlayUI();
      });

      item.find('[data-ctrl="toggle-off"]').on('click', function() {
        config[btn.id].visible = false;
        saveConfig(config);
        renderButtons();
        updateOverlayUI();
      });

      // Reorder buttons
      item.find('[data-ctrl="move-up"]').on('click', function() {
        const currentOrder = config[btn.id].order;
        if (currentOrder > 0) {
          const btnWithPrevOrder = Object.keys(config).find(key => config[key].order === currentOrder - 1);
          if (btnWithPrevOrder) {
            config[btnWithPrevOrder].order = currentOrder;
            config[btn.id].order = currentOrder - 1;
            saveConfig(config);
            renderButtons();
            updateOverlayUI();
          }
        }
      });

      item.find('[data-ctrl="move-down"]').on('click', function() {
        const currentOrder = config[btn.id].order;
        const maxOrder = Math.max(...Object.values(config).map(c => c.order));
        if (currentOrder < maxOrder) {
          const btnWithNextOrder = Object.keys(config).find(key => config[key].order === currentOrder + 1);
          if (btnWithNextOrder) {
            config[btnWithNextOrder].order = currentOrder;
            config[btn.id].order = currentOrder + 1;
            saveConfig(config);
            renderButtons();
            updateOverlayUI();
          }
        }
      });

      list.append(item);
      applyDarkModeStyles(item);
    });

    // Footer buttons
    overlay.find('[data-action="reset"]').on('click', function() {
      if (confirm('Wirklich alle Einstellungen zurücksetzen?')) {
        GM_setValue(STORAGE_KEY, null);
        GM_setValue(STORAGE_KEY_OPTIONS, null);
        renderButtons();
        updateOverlayUI();
      }
    });

    overlay.find('[data-action="close"], .ghodmode-modal-close').on('click', function() {
      overlay.removeClass('active');
    });

    // Close overlay when clicking outside modal
    overlay.on('click', function(e) {
      if ($(e.target).is('.ghodmode-overlay')) {
        overlay.removeClass('active');
      }
    });

    // Apply dark mode to modal and footer
    const modal = overlay.find('.ghodmode-modal');
    if (isDarkModeActive()) {
      applyDarkModeStyles(modal);
      applyDarkModeStyles(overlay.find('.ghodmode-modal-footer'));
      applyDarkModeStyles(overlay.find('.ghodmode-options-section'));
    }

    return overlay;
  }

  function updateOverlayUI() {
    const overlay = $('.ghodmode-overlay');
    if (!overlay.hasClass('active')) return;

    const config = getConfig();
    const options = getOptions();
    const sortedButtons = BUTTONS.slice().sort((a, b) => config[a.id].order - config[b.id].order);
    const list = overlay.find('.ghodmode-button-list');
    const maxOrder = Math.max(...Object.values(config).map(c => c.order));

    // Update options section
    overlay.find('#auto-expand-descriptions').prop('checked', options.autoExpandDescriptions);
    overlay.find('#show-documents-sidebar').prop('checked', options.showDocumentsInSidebar);

    list.empty();

    sortedButtons.forEach(btn => {
      const btnConfig = config[btn.id];
      const isVisible = btnConfig.visible;
      const currentOrder = btnConfig.order;

      const item = $(`
        <li class="ghodmode-button-item" data-button-id="${btn.id}">
          <div class="ghodmode-button-label">${btn.label}</div>
          <div class="ghodmode-button-controls">
            <button class="ghodmode-btn-ctrl ${isVisible ? 'active' : ''}" data-ctrl="toggle-on" ${isVisible ? 'disabled' : ''}>+</button>
            <button class="ghodmode-btn-ctrl ${!isVisible ? 'active' : ''}" data-ctrl="toggle-off" ${!isVisible ? 'disabled' : ''}>−</button>
            <button class="ghodmode-btn-ctrl" data-ctrl="move-up" ${currentOrder === 0 ? 'disabled' : ''}>↑</button>
            <button class="ghodmode-btn-ctrl" data-ctrl="move-down" ${currentOrder === maxOrder ? 'disabled' : ''}>↓</button>
          </div>
        </li>
      `);

      // Visibility toggles
      item.find('[data-ctrl="toggle-on"]').on('click', function() {
        config[btn.id].visible = true;
        saveConfig(config);
        renderButtons();
        updateOverlayUI();
      });

      item.find('[data-ctrl="toggle-off"]').on('click', function() {
        config[btn.id].visible = false;
        saveConfig(config);
        renderButtons();
        updateOverlayUI();
      });

      // Reorder buttons
      item.find('[data-ctrl="move-up"]').on('click', function() {
        const currentOrder = config[btn.id].order;
        if (currentOrder > 0) {
          const btnWithPrevOrder = Object.keys(config).find(key => config[key].order === currentOrder - 1);
          if (btnWithPrevOrder) {
            config[btnWithPrevOrder].order = currentOrder;
            config[btn.id].order = currentOrder - 1;
            saveConfig(config);
            renderButtons();
            updateOverlayUI();
          }
        }
      });

      item.find('[data-ctrl="move-down"]').on('click', function() {
        const currentOrder = config[btn.id].order;
        const maxOrder = Math.max(...Object.values(config).map(c => c.order));
        if (currentOrder < maxOrder) {
          const btnWithNextOrder = Object.keys(config).find(key => config[key].order === currentOrder + 1);
          if (btnWithNextOrder) {
            config[btnWithNextOrder].order = currentOrder;
            config[btn.id].order = currentOrder + 1;
            saveConfig(config);
            renderButtons();
            updateOverlayUI();
          }
        }
      });

      list.append(item);
      applyDarkModeStyles(item);
    });
  }

  // ============================================
  // BUTTONS RENDERING
  // ============================================
  function makeButton(url, label, attributes = '') {
    if (attributes) {
      return '<a ' + attributes + '><span class="god_btns">' + label + '</span></a>';
    }
    return '<a href="' + url + '"><span class="god_btns">' + label + '</span></a>';
  }

  function renderButtons() {
    const config = getConfig();
    const base_url = 'https://opus.geizhals.at/';
    var url = String(location.href);
    var ctimes_match = url.match(/(\d+)/);
    var ctimes_id = ctimes_match ? ctimes_match[0] : undefined;
    var idMatch = url.match(/[a\/](\d+)(?:\.html.*|$)/m);
    var id = idMatch ? idMatch[1] : undefined;
    var cat = $('span.locitem:eq(2)').find('a').attr('href');
    if (cat !== undefined) {
      cat = cat.replace(/.*cat=(.*)/, '$1');
    }

    let html = '<span class="god_gear_btn" id="god_config_btn" title="Button-Verwaltung">⚙️</span>';

    const sortedButtons = BUTTONS.slice().sort((a, b) => config[a.id].order - config[b.id].order);

    sortedButtons.forEach(btn => {
      if (!config[btn.id].visible) return;

      if (btn.type === 'normal' && id && parseInt(id, 10) <= 10000000) {
        const buttonUrl = btn.build(base_url, id);
        html += makeButton(buttonUrl, btn.label);
      } else if (btn.type === 'ctimes' && ctimes_id && parseInt(ctimes_id, 10) > 10000000) {
        const buttonUrl = btn.build(base_url, ctimes_id);
        html += makeButton(buttonUrl, btn.label);
      } else if (btn.type === 'cat' && cat) {
        const buttonUrl = btn.build(base_url, cat);
        html += makeButton(buttonUrl, btn.label);
      } else if (btn.type === 'action' && id && parseInt(id, 10) <= 10000000) {
        html += makeButton('', btn.label, 'href="javascript:void(0)" data-download-action="true"');
      }
    });

    const fragment = '<div class="god_btns_wrapper">' + html + '</div>';

    // Remove old buttons
    $('.god_btns_wrapper').remove();

    // Insert new buttons
    if ($('.variant__header__headline').length) {
      $('.variant__header__headline').first().before(fragment);
    } else if ($('.monav_ext').length) {
      $('.monav_ext').last().before(fragment);
    } else if ($('.monav').length) {
      $('.monav').last().before(fragment);
    } else {
      $('#content, main, body').first().prepend(fragment);
    }

    // Attach event handlers
    $(document).on('click', '[data-download-action="true"]', function(e) {
      e.preventDefault();
      downloadAllImages();
    });

    $('#god_config_btn').on('click', function() {
      const overlay = createOverlay();
      $('body').append(overlay);
      overlay.addClass('active');
    });
  }

  // ============================================
  // AUTO-EXPAND DESCRIPTIONS
  // ============================================
  function expandAllDescriptions() {
    const expandButton = document.querySelector('.variant__header__expand-button');
    if (expandButton && !expandButton.classList.contains('opened')) {
      expandButton.click();
    }
  }

  function displayDocumentsInSidebar() {
    const options = getOptions();
    const existingDocsContainer = document.querySelector('.ghodmode-sidebar-documents');
    
    // Remove existing documents container if option is disabled
    if (!options.showDocumentsInSidebar) {
      if (existingDocsContainer) {
        existingDocsContainer.remove();
      }
      return;
    }

    // Check if documents exist
    const tocButton = document.querySelector('a[href="#downloads"].variant-toc__button');
    if (!tocButton) {
      return;
    }

    const docCountText = tocButton.textContent.trim();
    const isDisabled = tocButton.classList.contains('disabled');
    
    // If no documents or button is disabled, remove the container and return
    if (isDisabled || docCountText.startsWith('0')) {
      if (existingDocsContainer) {
        existingDocsContainer.remove();
      }
      return;
    }

    // Get the downloads section
    const downloadsSection = document.querySelector('#downloads');
    if (!downloadsSection) {
      return;
    }

    const documentsList = downloadsSection.querySelector('.variant__content__list');
    if (!documentsList || documentsList.children.length === 0) {
      if (existingDocsContainer) {
        existingDocsContainer.remove();
      }
      return;
    }

    // Remove existing container if present
    if (existingDocsContainer) {
      existingDocsContainer.remove();
    }

    // Create documents HTML for sidebar
    let documentsHTML = '<div class="ghodmode-sidebar-documents"><div class="ghodmode-sidebar-documents-title">Dokumente</div><ul class="ghodmode-sidebar-documents-list">';

    const documentItems = downloadsSection.querySelectorAll('.variant__content__list-item');
    documentItems.forEach(item => {
      const link = item.querySelector('.variant__content__list-item__link');
      const titleWrapper = item.querySelector('.variant__content__list-item__title-wrapper');
      const flag = item.querySelector('.variant__content__list-item__flag');
      const detailsWrapper = item.querySelector('.variant__content__list-item__details-wrapper');
      
      if (link) {
        const href = link.getAttribute('href');
        const linkText = link.textContent.trim();
        
        let flagHTML = '';
        if (flag) {
          const flagSrc = flag.getAttribute('src');
          const flagAlt = flag.getAttribute('alt');
          flagHTML = `<img src="${flagSrc}" alt="${flagAlt}" class="ghodmode-sidebar-documents-item-flag">`;
        }

        let detailsHTML = '';
        if (detailsWrapper) {
          const details = detailsWrapper.textContent.trim();
          if (details) {
            detailsHTML = `<div class="ghodmode-sidebar-documents-item-details">${details}</div>`;
          }
        }

        documentsHTML += `<li class="ghodmode-sidebar-documents-item">
          <a href="${href}" target="_blank" rel="noopener" class="ghodmode-sidebar-documents-item-link">${flagHTML}${linkText}</a>
          ${detailsHTML}
        </li>`;
      }
    });

    documentsHTML += '</ul></div>';

    // Insert documents into sidebar
    const pricehistoryWrapper = document.querySelector('.variant__header__pricehistory-options-wrapper');
    if (pricehistoryWrapper) {
      pricehistoryWrapper.insertAdjacentHTML('beforeend', documentsHTML);
    }
  }
  function downloadAllImages() {
    const slides = document.querySelectorAll('.swiper-slide[data-pswp-src]');
    if (slides.length === 0) {
      alert('Keine Bilder in der Galerie gefunden.');
      return;
    }

    let downloadCount = 0;
    let errorCount = 0;

    slides.forEach((slide, index) => {
      const url = slide.getAttribute('data-pswp-src');
      if (url) {
        const filename = `bild_${String(index + 1).padStart(2, '0')}.webp`;

        GM_download({
          url: url,
          name: filename,
          onload: function() {
            downloadCount++;
            if (downloadCount + errorCount === slides.length) {
              alert(`Download abgeschlossen: ${downloadCount} Bilder heruntergeladen${errorCount > 0 ? `, ${errorCount} Fehler` : ''}`);
            }
          },
          onerror: function(error) {
            errorCount++;
            if (downloadCount + errorCount === slides.length) {
              alert(`Download abgeschlossen: ${downloadCount} Bilder heruntergeladen${errorCount > 0 ? `, ${errorCount} Fehler` : ''}`);
            }
          }
        });
      }
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  injectStyles();
  renderButtons();
  
  // Auto-expand descriptions if enabled
  const options = getOptions();
  if (options.autoExpandDescriptions) {
    expandAllDescriptions();
  }
  
  // Display documents in sidebar if enabled
  if (options.showDocumentsInSidebar) {
    displayDocumentsInSidebar();
  }
});
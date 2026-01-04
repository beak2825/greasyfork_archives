// ==UserScript==
// @name         Diep.io Build Browser & Share
// @namespace    https://diep.kronea.app
// @version      0.2.0
// @description  Browse & share public builds for diep.io tanks, with highscores, slash stats and a show in-game button.
// @author       Kronati
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556432/Diepio%20Build%20Browser%20%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/556432/Diepio%20Build%20Browser%20%20Share.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    const API_BASE = 'https://diep.kronea.app';
  
    const API_ROUTES = {
      tanks: '/api/tanks',
      buildsByTank: '/api/builds?tankId=',
      buildsAll: '/api/builds/all',
      createBuild: '/api/builds',
      voteBuild: (buildId) => `/api/builds/${buildId}/vote`,
      submitHighscore: (buildId) => `/api/builds/${buildId}/highscore`
    };
  
    const TANK_IMAGE_BASE = 'https://diep.kronea.app/img/tanks/';
  
    const TANK_IMAGE_FALLBACK_COLOR = '#60a5fa';

    let uiRoot = null;
    let tanksCache = null;
    let currentTankId = null;
    let currentTankName = null;
    let currentView = 'general';
    let currentSortBy = 'rating';
    let currentSortOrder = 'desc';
    let currentSearch = '';

    const DEFAULT_SETTINGS = {
      ingameDisplayDuration: 120
    };
    
    function loadSettings() {
      try {
        const saved = localStorage.getItem('kbui_settings');
        if (saved) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error('[KBUI] Failed to load settings:', e);
      }
      return { ...DEFAULT_SETTINGS };
    }
    
    function saveSettings(settings) {
      try {
        localStorage.setItem('kbui_settings', JSON.stringify(settings));
      } catch (e) {
        console.error('[KBUI] Failed to save settings:', e);
      }
    }
    
    let currentSettings = loadSettings();
    let currentTankSearch = '';
  
    function injectStyles() {
      if (document.getElementById('kronati-build-ui-style')) return;
      const style = document.createElement('style');
      style.id = 'kronati-build-ui-style';
      style.textContent = `
        .kbui-root {
          position: fixed;
          inset: 0;
          z-index: 99998;
          display: none;
          align-items: center;
          justify-content: center;
          font-family: "Nunito", "Segoe UI", sans-serif;
        }
        .kbui-root.visible {
          display: flex;
        }
        .kbui-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(0,0,0,0.7), rgba(0,0,0,0.9));
        }
        .kbui-panel {
          position: relative;
          width: min(95vw, 1400px);
          height: min(85vh, 800px);
          background: #2b3238;
          border-radius: 12px;
          border: 2px solid #4b5966;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          color: #dfe9f4;
        }
        .kbui-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .kbui-title {
          font-size: 24px;
          font-weight: 700;
          color: #f1f5f9;
        }
        .kbui-subtitle {
          font-size: 13px;
          opacity: 0.75;
        }
        .kbui-close-btn {
          cursor: pointer;
          border: 1px solid #8b99a6;
          border-radius: 8px;
          padding: 6px 14px;
          background: #1c2126;
          color: #f8fafc;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .kbui-close-btn:hover {
          border-color: #facc15;
          color: #facc15;
        }
        .kbui-body {
          flex: 1;
          display: flex;
          gap: 16px;
          overflow: hidden;
        }
        .kbui-sidebar {
          width: 300px;
          border-right: 1px solid #3b454f;
          padding-right: 12px;
          display: flex;
          flex-direction: column;
        }
        .kbui-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .kbui-section-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9ca3af;
          margin-bottom: 10px;
        }
        .kbui-tank-grid {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding-right: 6px;
          gap: 8px;
        }
        .kbui-level-header {
          font-size: 12px;
          font-weight: 700;
          color: #facc15;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 8px;
          margin-bottom: 4px;
          padding: 4px 0;
          border-bottom: 1px solid #374151;
        }
        .kbui-tank-grid-level {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 8px;
        }
        .kbui-tank-card {
          background: #1f252b;
          border-radius: 10px;
          border: 1px solid #3b444f;
          padding: 10px 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: background 0.1s, transform 0.08s, border-color 0.1s;
        }
        .kbui-tank-card:hover {
          background: #27313a;
          transform: translateY(-1px);
          border-color: #facc15;
        }
        .kbui-tank-card.selected {
          border-color: #22c55e;
          box-shadow: 0 0 0 1px rgba(34,197,94,0.5);
        }
        .kbui-tank-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #111827;
          border: 1px solid #4b5563;
        }
        .kbui-tank-name {
          font-size: 13px;
          text-align: center;
        }
        .kbui-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .kbui-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        .kbui-tab {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid #4b5563;
          background: #1f252b;
          color: #9ca3af;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.1s;
        }
        .kbui-tab:hover {
          border-color: #facc15;
          color: #facc15;
        }
        .kbui-tab.active {
          background: #facc15;
          color: #111827;
          border-color: #facc15;
        }
        .kbui-search-sort {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
        }
        .kbui-search-input {
          border-radius: 8px;
          border: 1px solid #4b5563;
          background: #020617;
          color: #e5e7eb;
          padding: 8px 12px;
          font-size: 13px;
          min-width: 200px;
        }
        .kbui-search-input:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 0 1px rgba(250,204,21,0.4);
        }
        .kbui-sort-select {
          border-radius: 8px;
          border: 1px solid #4b5563;
          background: #020617;
          color: #e5e7eb;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
        }
        .kbui-sort-select:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 0 1px rgba(250,204,21,0.4);
        }
        .kbui-build-list {
          flex: 1;
          overflow-y: auto;
          border-radius: 10px;
          border: 1px solid #38414a;
          background: radial-gradient(circle at top, #232a30, #181c20);
          padding: 10px;
        }
        .kbui-build-card {
          border-radius: 10px;
          border: 1px solid #374151;
          padding: 12px 14px;
          margin-bottom: 8px;
          background: rgba(15,23,42,0.7);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .kbui-build-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kbui-build-name {
          font-size: 16px;
          font-weight: 600;
        }
        .kbui-rating {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        .kbui-rating button {
          border-radius: 999px;
          border: 1px solid #4b5563;
          background: #111827;
          color: #e5e7eb;
          padding: 4px 10px;
          font-size: 12px;
          cursor: pointer;
          min-width: 32px;
        }
        .kbui-rating button:hover {
          border-color: #facc15;
          color: #facc15;
        }
        .kbui-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 6px 12px;
          font-size: 12px;
        }
        .kbui-stat-label {
          opacity: 0.75;
        }
        .kbui-stat-value {
          font-weight: 600;
          color: #e5e7eb;
          font-size: 13px;
        }
        .kbui-slash-stats {
          margin: 8px 0;
          padding: 10px 12px;
          background: rgba(15,23,42,0.5);
          border-radius: 8px;
          border: 1px solid #374151;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 600;
          color: #facc15;
          text-align: center;
          letter-spacing: 0.05em;
        }
        .kbui-build-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          opacity: 0.75;
        }
        .kbui-pill {
          border-radius: 999px;
          border: 1px solid #4b5563;
          padding: 4px 10px;
        }
        .kbui-button-main {
          border-radius: 999px;
          border: 1px solid #fbbf24;
          background: linear-gradient(135deg, #facc15, #f97316);
          color: #111827;
          font-size: 13px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 0 12px rgba(250,204,21,0.4);
        }
        .kbui-button-main:hover {
          filter: brightness(1.05);
        }
        .kbui-form {
          margin-top: 10px;
          border-radius: 10px;
          border: 1px solid #374151;
          padding: 12px 14px;
          background: rgba(15,23,42,0.8);
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
        }
        .kbui-form-row {
          display: flex;
          gap: 8px;
        }
        .kbui-form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .kbui-form-group label {
          opacity: 0.75;
          font-size: 12px;
        }
        .kbui-form-group input,
        .kbui-form-group select {
          border-radius: 8px;
          border: 1px solid #4b5563;
          background: #020617;
          color: #e5e7eb;
          padding: 8px 10px;
          font-size: 13px;
        }
        .kbui-form-group input:focus,
        .kbui-form-group select:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 0 1px rgba(250,204,21,0.4);
        }
        .kbui-form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        .kbui-small {
          font-size: 12px;
          opacity: 0.7;
        }
        .kbui-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(15,23,42,0.95);
          color: #e5e7eb;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid #4b5563;
          font-size: 13px;
          z-index: 99999;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .kbui-toast.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .kbui-build-stats-display {
          position: fixed;
          left: 8px;
          bottom: 60px;
          z-index: 99997;
          background: rgba(15,23,42,0.5);
          color: #facc15;
          padding: 4px 6px;
          border-radius: 4px;
          border: 1px solid rgba(250,204,21,0.5);
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          box-shadow: 0 0 10px rgba(250,204,21,0.3);
          display: none;
        }
        .kbui-build-stats-display.visible {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }
        .kbui-build-stats-display-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .kbui-build-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .kbui-build-stat-number {
          font-weight: 600;
        }
        .kbui-build-stat-separator {
          color: rgba(250,204,21,0.6);
          font-size: 12px;
        }
        .kbui-build-stats-close {
          position: absolute;
          top: -8px;
          left: -8px;
          width: 18px;
          height: 18px;
          background: #dc2626;
          color: #ffffff;
          border: none;
          border-radius: 50%;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          padding: 0;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .kbui-build-stats-close:hover {
          background: #b91c1c;
          transform: scale(1.1);
        }
        .kbui-tooltip {
          position: relative;
        }
        .kbui-tooltip::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
          padding: 6px 10px;
          background: rgba(15,23,42,0.98);
          color: #f1f5f9;
          font-size: 12px;
          font-family: "Nunito", "Segoe UI", sans-serif;
          border-radius: 6px;
          border: 1px solid #4b5563;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform: translateX(-50%) translateY(4px);
          z-index: 100000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .kbui-tooltip::before {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 2px;
          border: 5px solid transparent;
          border-top-color: #4b5563;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 100001;
        }
        .kbui-tooltip:hover::after,
        .kbui-tooltip:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
 #kbui-builds-menu-button.kbui-builds-btn {
    --color: var(--ui-color-3);
    margin-left: 6px;
    position: relative;
    overflow: hidden;
    font-family: "Nunito", "Verdana", sans-serif !important;
    background: #2b3238 !important;
    border: 1px solid #374151 !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  #kbui-builds-menu-button.kbui-builds-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.1));
    opacity: 0.6;
    pointer-events: none;
    z-index: 1;
  }
  
  #kbui-builds-menu-button .kbui-builds-icon {
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 20%, #a5b4fc, #6366f1);
    border: 2px solid rgba(15,23,42,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Nunito", "Verdana", sans-serif !important;
    font-weight: 800;
    font-size: 0.9em;
    color: #ffffff;
    text-shadow: 0 0 3px rgba(0,0,0,0.45);
  }
  
  #kbui-builds-menu-button .kbui-builds-inner {
    position: relative;
    z-index: 2;
  }
  
  #kbui-builds-menu-button .kbui-no-icon {
    padding: 0 16px;
  }
  
  #kbui-builds-menu-button .kbui-builds-label {
    font-family: "Nunito", "Verdana", sans-serif !important;
    font-size: 16px;
    font-weight: 700;
    color: #f1f5f9 !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    position: relative;
    z-index: 2;
  }
  
  #kbui-builds-menu-button:hover {
    background: #374151 !important;
    filter: brightness(1.1);
  }
  
  #kbui-builds-menu-button:active {
    background: #1f2937 !important;
  }
  
  
      `;
      document.head.appendChild(style);
    }
  
    let toastEl = null;
    let toastTimeout = null;
  
    function showToast(message) {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'kbui-toast';
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = message;
      toastEl.classList.add('visible');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toastEl.classList.remove('visible');
      }, 2200);
    }

    let ingameDisplayEl = null;
    let ingameDisplayTimeout = null;

    function hideBuildIngame() {
      if (ingameDisplayEl) {
        ingameDisplayEl.classList.remove('visible');
      }
      if (ingameDisplayTimeout) {
        clearTimeout(ingameDisplayTimeout);
        ingameDisplayTimeout = null;
      }
    }

    function showBuildIngame(statsString) {
      if (!ingameDisplayEl) {
        ingameDisplayEl = document.createElement('div');
        ingameDisplayEl.className = 'kbui-build-stats-display';
        document.body.appendChild(ingameDisplayEl);
      }
      
      ingameDisplayEl.innerHTML = '';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'kbui-build-stats-close';
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideBuildIngame();
      });
      ingameDisplayEl.appendChild(closeBtn);
      
      const content = document.createElement('div');
      content.className = 'kbui-build-stats-display-content';
      
      const statColors = {
        healthRegen: '#e8b08a',
        maxHealth: '#e666ea',
        bodyDamage: '#9466ea',
        bulletSpeed: '#638ce4',
        bulletPenetration: '#ead366',
        bulletDamage: '#ea6666',
        reload: '#92ea66',
        movementSpeed: '#66eae6'
      };
      
      const keysInOrder = [
        'healthRegen',
        'maxHealth',
        'bodyDamage',
        'bulletSpeed',
        'bulletPenetration',
        'bulletDamage',
        'reload',
        'movementSpeed'
      ];
      
      const stats = statsString.split('/');
      
      stats.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'kbui-build-stat-item';
        
        const statSpan = document.createElement('span');
        statSpan.className = 'kbui-build-stat-number';
        statSpan.textContent = value;
        statSpan.style.color = statColors[keysInOrder[index]] || '#facc15';
        item.appendChild(statSpan);
        
        if (index < stats.length - 1) {
          const separator = document.createElement('span');
          separator.className = 'kbui-build-stat-separator';
          separator.textContent = '-';
          item.appendChild(separator);
        }
        
        content.appendChild(item);
      });
      
      ingameDisplayEl.appendChild(content);
      ingameDisplayEl.classList.add('visible');
      
      if (ingameDisplayTimeout) clearTimeout(ingameDisplayTimeout);
      const duration = (currentSettings.ingameDisplayDuration || DEFAULT_SETTINGS.ingameDisplayDuration) * 1000;
      ingameDisplayTimeout = setTimeout(() => {
        hideBuildIngame();
      }, duration);
    }
  
    async function apiGet(path) {
      const res = await fetch(API_BASE + path, { credentials: 'omit' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }
  
    async function apiPost(path, body) {
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          const error = new Error(errorMessage);
          error.status = res.status;
          error.data = errorData;
          throw error;
        } catch (parseError) {
          const error = new Error(errorMessage);
          error.status = res.status;
          throw error;
        }
      }
      return res.json();
    }

    async function apiPostFormData(path, formData) {
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        credentials: 'omit',
        body: formData
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      return res.json();
    }
  
    async function copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          return successful;
        } catch (e) {
          return false;
        }
      }
    }

    function createUIRoot() {
      if (uiRoot) return uiRoot;
      uiRoot = document.createElement('div');
      uiRoot.className = 'kbui-root';
  
      const backdrop = document.createElement('div');
      backdrop.className = 'kbui-backdrop';
      backdrop.addEventListener('click', () => toggleUI(false));
  
      const panel = document.createElement('div');
      panel.className = 'kbui-panel';
  
      const header = document.createElement('div');
      header.className = 'kbui-header';
  
      const leftHeader = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'kbui-title';
      title.textContent = 'Diep.io Build Browser';
  
      const subtitle = document.createElement('div');
      subtitle.className = 'kbui-subtitle';
      subtitle.textContent = 'Browse & share public builds – by Kronati';
  
      leftHeader.appendChild(title);
      leftHeader.appendChild(subtitle);

      const rightHeader = document.createElement('div');
      rightHeader.style.display = 'flex';
      rightHeader.style.alignItems = 'center';
      rightHeader.style.gap = '10px';

      const settingsBtn = document.createElement('button');
      settingsBtn.className = 'kbui-button-main';
      settingsBtn.innerHTML = '⚙️';
      settingsBtn.style.padding = '6px 10px';
      settingsBtn.style.fontSize = '16px';
      settingsBtn.style.cursor = 'pointer';
      settingsBtn.title = 'Settings';
      settingsBtn.addEventListener('click', () => openSettings());

      const closeBtn = document.createElement('button');
      closeBtn.className = 'kbui-close-btn';
      closeBtn.textContent = 'Close';
      closeBtn.addEventListener('click', () => toggleUI(false));

      rightHeader.appendChild(settingsBtn);
      rightHeader.appendChild(closeBtn);

      header.appendChild(leftHeader);
      header.appendChild(rightHeader);
  
      const body = document.createElement('div');
      body.className = 'kbui-body';
  
      const sidebar = document.createElement('div');
      sidebar.className = 'kbui-sidebar';

      const sidebarTitle = document.createElement('div');
      sidebarTitle.className = 'kbui-section-title';
      sidebarTitle.textContent = 'Tanks';

      const tankSearchInput = document.createElement('input');
      tankSearchInput.type = 'text';
      tankSearchInput.className = 'kbui-search-input';
      tankSearchInput.placeholder = 'Search tanks...';
      tankSearchInput.id = 'kbui-tank-search-input';
      tankSearchInput.style.marginBottom = '10px';
      let tankSearchTimeout = null;
      tankSearchInput.addEventListener('input', (e) => {
        clearTimeout(tankSearchTimeout);
        tankSearchTimeout = setTimeout(() => {
          currentTankSearch = e.target.value.trim().toLowerCase();
          loadTanks().then(renderTankGrid).catch((e) => console.error(e));
        }, 200);
      });

      const tankGrid = document.createElement('div');
      tankGrid.className = 'kbui-tank-grid';
      tankGrid.id = 'kbui-tank-grid';

      sidebar.appendChild(sidebarTitle);
      sidebar.appendChild(tankSearchInput);
      sidebar.appendChild(tankGrid);
  
      const main = document.createElement('div');
      main.className = 'kbui-main';

      const tabs = document.createElement('div');
      tabs.className = 'kbui-tabs';
      
      const generalTab = document.createElement('button');
      generalTab.className = 'kbui-tab active';
      generalTab.textContent = 'General';
      generalTab.addEventListener('click', () => switchView('general'));
      
      const tankTab = document.createElement('button');
      tankTab.className = 'kbui-tab';
      tankTab.textContent = 'By Tank';
      tankTab.addEventListener('click', () => switchView('tank'));
      
      tabs.appendChild(generalTab);
      tabs.appendChild(tankTab);

      const listHeader = document.createElement('div');
      listHeader.className = 'kbui-list-header';

      const listHeaderLeft = document.createElement('div');
      listHeaderLeft.style.display = 'flex';
      listHeaderLeft.style.flexDirection = 'column';
      listHeaderLeft.style.gap = '6px';
      listHeaderLeft.style.flex = '1';

      const listTitle = document.createElement('div');
      listTitle.className = 'kbui-section-title';
      listTitle.textContent = 'Builds';

      const searchSort = document.createElement('div');
      searchSort.className = 'kbui-search-sort';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'kbui-search-input';
      searchInput.placeholder = 'Search builds...';
      searchInput.id = 'kbui-search-input';
      let searchTimeout = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          currentSearch = e.target.value.trim();
          if (currentView === 'general') {
            loadAllBuilds();
          }
        }, 300);
      });

      const sortSelect = document.createElement('select');
      sortSelect.className = 'kbui-sort-select';
      sortSelect.id = 'kbui-sort-select';
      sortSelect.innerHTML = `
        <option value="rating">Rating</option>
        <option value="highscore">Highscore</option>
        <option value="upvotes">Upvotes</option>
        <option value="downvotes">Downvotes</option>
        <option value="name">Name</option>
      `;
      sortSelect.value = currentSortBy;
      sortSelect.addEventListener('change', (e) => {
        currentSortBy = e.target.value;
        if (currentView === 'general') {
          loadAllBuilds();
        }
      });

      const orderSelect = document.createElement('select');
      orderSelect.className = 'kbui-sort-select';
      orderSelect.id = 'kbui-order-select';
      orderSelect.innerHTML = `
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      `;
      orderSelect.value = currentSortOrder;
      orderSelect.addEventListener('change', (e) => {
        currentSortOrder = e.target.value;
        if (currentView === 'general') {
          loadAllBuilds();
        }
      });

      searchSort.appendChild(searchInput);
      searchSort.appendChild(sortSelect);
      searchSort.appendChild(orderSelect);

      listHeaderLeft.appendChild(listTitle);
      listHeaderLeft.appendChild(searchSort);

      const createBtn = document.createElement('button');
      createBtn.className = 'kbui-button-main';
      createBtn.textContent = 'Create Build';
      createBtn.addEventListener('click', () => openCreateBuildForm());

      listHeader.appendChild(listHeaderLeft);
      listHeader.appendChild(createBtn);

      const buildList = document.createElement('div');
      buildList.className = 'kbui-build-list';
      buildList.id = 'kbui-build-list';
      buildList.textContent = 'Loading builds...';

      main.appendChild(tabs);
      main.appendChild(listHeader);
      main.appendChild(buildList);
  
      body.appendChild(sidebar);
      body.appendChild(main);
  
      panel.appendChild(header);
      panel.appendChild(body);
  
      uiRoot.appendChild(backdrop);
      uiRoot.appendChild(panel);
      document.body.appendChild(uiRoot);
      return uiRoot;
    }
  
    function toggleUI(show) {
      const root = createUIRoot();
      if (show) {
        root.classList.add('visible');
        if (currentView === 'general') {
          loadAllBuilds();
        }
      } else {
        root.classList.remove('visible');
      }
    }

    function switchView(view) {
      currentView = view;
      const tabs = document.querySelectorAll('.kbui-tab');
      tabs.forEach(tab => tab.classList.remove('active'));
      
      if (view === 'general') {
        tabs[0].classList.add('active');
        document.getElementById('kbui-search-input').style.display = '';
        document.getElementById('kbui-sort-select').style.display = '';
        document.getElementById('kbui-order-select').style.display = '';
        loadAllBuilds();
      } else {
        tabs[1].classList.add('active');
        document.getElementById('kbui-search-input').style.display = 'none';
        document.getElementById('kbui-sort-select').style.display = 'none';
        document.getElementById('kbui-order-select').style.display = 'none';
        if (currentTankId) {
          loadBuildsForTank(currentTankId, currentTankName);
        } else {
          const list = document.getElementById('kbui-build-list');
          if (list) list.textContent = 'Select a tank on the left to view builds.';
        }
      }
    }
  
  function injectMenuBuildButton() {
    if (document.getElementById('kbui-builds-menu-button')) return;
  
    const container = document.querySelector('.corner-buttons.top.left[data-is-active="true"]');
    if (!container) return;
  
    const btn = document.createElement('button');
    btn.id = 'kbui-builds-menu-button';
    btn.className = 'updated-standard-button active minimal diep-style-button kbui-builds-btn';
    btn.setAttribute('tabindex', '-1');
    btn.setAttribute('data-is-clickable', 'true');
    btn.setAttribute('data-is-flashing', 'false');
    btn.style.setProperty('--color', 'var(--ui-color-3)');
  
    const inner = document.createElement('div');
    inner.className = 'kbui-builds-inner kbui-no-icon';
    const label = document.createElement('div');
    label.className = 'kbui-builds-label';
    label.textContent = 'Builds';
    inner.appendChild(label);
    btn.appendChild(inner);
  
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUI(true);
    });
  
    container.appendChild(btn);
  }
    async function loadTanks() {
      if (tanksCache) return tanksCache;
      const tanks = await apiGet(API_ROUTES.tanks);
      tanksCache = tanks;
      return tanks;
    }
  
    function renderTankGrid(tanks) {
      const grid = document.getElementById('kbui-tank-grid');
      if (!grid) return;
      grid.innerHTML = '';
  
      if (!tanks || !tanks.length) {
        const msg = document.createElement('div');
        msg.className = 'kbui-small';
        msg.textContent = 'No tanks from API yet. Configure your backend.';
        grid.appendChild(msg);
        return;
      }
  
      let filteredTanks = tanks;
      if (currentTankSearch) {
        filteredTanks = tanks.filter(tank => {
          const name = (tank.name || '').toLowerCase();
          const shortName = (tank.shortName || '').toLowerCase();
          return name.includes(currentTankSearch) || shortName.includes(currentTankSearch);
        });
      }

      if (!filteredTanks.length) {
        const msg = document.createElement('div');
        msg.className = 'kbui-small';
        msg.textContent = 'No tanks found matching your search.';
        grid.appendChild(msg);
        return;
      }

      const tanksByLevel = {
        1: [],
        15: [],
        30: [],
        45: []
      };

      filteredTanks.forEach(tank => {
        const level = tank.level || tank.sortOrder || 0;
        if (level === 1) tanksByLevel[1].push(tank);
        else if (level === 15) tanksByLevel[15].push(tank);
        else if (level === 30) tanksByLevel[30].push(tank);
        else if (level === 45) tanksByLevel[45].push(tank);
        else tanksByLevel[45].push(tank);
      });

      const levels = [1, 15, 30, 45];
      levels.forEach(level => {
        const levelTanks = tanksByLevel[level];
        if (levelTanks.length === 0) return;

        const levelHeader = document.createElement('div');
        levelHeader.className = 'kbui-level-header';
        levelHeader.textContent = `Level ${level}`;
        grid.appendChild(levelHeader);

        const levelGrid = document.createElement('div');
        levelGrid.className = 'kbui-tank-grid-level';
        levelGrid.style.gridTemplateColumns = 'repeat(3, minmax(0,1fr))';
        levelGrid.style.gap = '8px';
        levelGrid.style.marginBottom = '12px';

        levelTanks.forEach((tank) => {
          const card = document.createElement('div');
          card.className = 'kbui-tank-card';
          card.dataset.tankId = tank.id;
          card.dataset.tankName = tank.name;

          const icon = document.createElement('div');
          icon.className = 'kbui-tank-icon';

          let imgUrl = tank.imageUrl || null;
          if (!imgUrl && TANK_IMAGE_BASE && tank.imageKey) {
            imgUrl = TANK_IMAGE_BASE + tank.imageKey;
          }
          if (imgUrl) {
            icon.style.backgroundImage = `url("${imgUrl}")`;
          } else {
            icon.style.borderRadius = '50%';
            icon.style.border = '3px solid rgba(0,0,0,0.8)';
            icon.style.backgroundImage = '';
            icon.style.backgroundColor = tank.colorHex || TANK_IMAGE_FALLBACK_COLOR;
          }

          const name = document.createElement('div');
          name.className = 'kbui-tank-name';
          name.textContent = tank.shortName || tank.name;

          card.appendChild(icon);
          card.appendChild(name);

          card.addEventListener('click', () => {
            document
              .querySelectorAll('.kbui-tank-card.selected')
              .forEach((el) => el.classList.remove('selected'));
            card.classList.add('selected');
            currentTankId = tank.id;
            currentTankName = tank.name;
            switchView('tank');
            loadBuildsForTank(tank.id, tank.name);
          });

          levelGrid.appendChild(card);
        });

        grid.appendChild(levelGrid);
      });
    }
  
    async function loadAllBuilds() {
      const list = document.getElementById('kbui-build-list');
      if (!list) return;
      list.innerHTML = 'Loading builds...';

      try {
        const params = new URLSearchParams({
          all: 'true',
          sortBy: currentSortBy,
          sortOrder: currentSortOrder
        });
        if (currentSearch) {
          params.append('search', currentSearch);
        }
        const builds = await apiGet(API_ROUTES.buildsAll + '?' + params.toString());
        renderBuildList(builds, null, true);
      } catch (e) {
        list.innerHTML = '';
        const msg = document.createElement('div');
        msg.className = 'kbui-small';
        msg.textContent = 'Failed to load builds. Check console.';
        list.appendChild(msg);
        console.error(e);
      }
    }

    async function loadBuildsForTank(tankId, tankName) {
      const list = document.getElementById('kbui-build-list');
      if (!list) return;
      list.innerHTML = 'Loading builds...';

      try {
        const builds = await apiGet(API_ROUTES.buildsByTank + encodeURIComponent(tankId));
        renderBuildList(builds, tankName, false);
      } catch (e) {
        list.innerHTML = '';
        const msg = document.createElement('div');
        msg.className = 'kbui-small';
        msg.textContent = 'Failed to load builds. Check console.';
        list.appendChild(msg);
        console.error(e);
      }
    }
  
    function renderBuildList(builds, tankName, isGeneral = false) {
      const list = document.getElementById('kbui-build-list');
      if (!list) return;
      list.innerHTML = '';

      if (!isGeneral && tankName) {
        const headerLine = document.createElement('div');
        headerLine.className = 'kbui-small';
        headerLine.textContent = `Tank: ${tankName || 'Unknown'}`;
        list.appendChild(headerLine);
      }

      if (!builds || !builds.length) {
        const msg = document.createElement('div');
        msg.className = 'kbui-small';
        msg.style.marginTop = '6px';
        msg.textContent = isGeneral 
          ? (currentSearch ? 'No builds found matching your search.' : 'No builds yet. Be the first to create one!')
          : 'No builds yet. Be the first to create one!';
        list.appendChild(msg);
        return;
      }

      builds.forEach((build) => {
        const card = document.createElement('div');
        card.className = 'kbui-build-card';

        const header = document.createElement('div');
        header.className = 'kbui-build-header';

        const nameContainer = document.createElement('div');
        nameContainer.style.display = 'flex';
        nameContainer.style.flexDirection = 'column';
        nameContainer.style.gap = '2px';

        const name = document.createElement('div');
        name.className = 'kbui-build-name';
        name.textContent = build.name || 'Unnamed Build';

        if (isGeneral && build.tankName) {
          const tankLabel = document.createElement('div');
          tankLabel.className = 'kbui-small';
          tankLabel.style.opacity = '0.7';
          tankLabel.textContent = `Tank: ${build.tankName}`;
          nameContainer.appendChild(name);
          nameContainer.appendChild(tankLabel);
        } else {
          nameContainer.appendChild(name);
        }

        const ratingBox = document.createElement('div');
        ratingBox.className = 'kbui-rating';
        ratingBox.style.display = 'flex';
        ratingBox.style.flexDirection = 'column';
        ratingBox.style.alignItems = 'flex-end';
        ratingBox.style.gap = '2px';

        const ratingValue = document.createElement('span');
        ratingValue.textContent = `Score: ${build.rating ?? 0}`;

        const voteCounts = document.createElement('div');
        voteCounts.className = 'kbui-small';
        voteCounts.style.opacity = '0.7';
        voteCounts.style.fontSize = '11px';
        voteCounts.textContent = `▲${build.upvotes || 0} ▼${build.downvotes || 0}`;

        const voteButtons = document.createElement('div');
        voteButtons.style.display = 'flex';
        voteButtons.style.gap = '4px';
        const upBtn = document.createElement('button');
        upBtn.textContent = '▲';
        upBtn.setAttribute('data-build-id', build.id);
        const downBtn = document.createElement('button');
        downBtn.textContent = '▼';
        downBtn.setAttribute('data-build-id', build.id);

        upBtn.addEventListener('click', () => voteBuild(build.id, +1, ratingValue, voteCounts, build));
        downBtn.addEventListener('click', () => voteBuild(build.id, -1, ratingValue, voteCounts, build));

        voteButtons.appendChild(upBtn);
        voteButtons.appendChild(downBtn);

        ratingBox.appendChild(ratingValue);
        ratingBox.appendChild(voteCounts);
        ratingBox.appendChild(voteButtons);

        header.appendChild(nameContainer);
        header.appendChild(ratingBox);
  
        const stats = build.stats || {};
        const statGrid = document.createElement('div');
        statGrid.className = 'kbui-stat-grid';
  
        const statColors = {
          healthRegen: '#e8b08a',
          maxHealth: '#e666ea',
          bodyDamage: '#9466ea',
          bulletSpeed: '#638ce4',
          bulletPenetration: '#ead366',
          bulletDamage: '#ea6666',
          reload: '#92ea66',
          movementSpeed: '#66eae6'
        };

        const statDefs = [
          ['Health Regen', 'healthRegen'],
          ['Max Health', 'maxHealth'],
          ['Body Damage', 'bodyDamage'],
          ['Bullet Speed', 'bulletSpeed'],
          ['Bullet Penetration', 'bulletPenetration'],
          ['Bullet Damage', 'bulletDamage'],
          ['Reload', 'reload'],
          ['Movement Speed', 'movementSpeed']
        ];
  
        statDefs.forEach(([label, key]) => {
          const wrap = document.createElement('div');
          const l = document.createElement('div');
          l.className = 'kbui-stat-label';
          l.textContent = label;
          const v = document.createElement('div');
          v.className = 'kbui-stat-value';
          v.textContent = stats[key] ?? '-';
          if (stats[key] !== null && stats[key] !== undefined) {
            v.style.color = statColors[key] || '#e5e7eb';
          }
          wrap.appendChild(l);
          wrap.appendChild(v);
          statGrid.appendChild(wrap);
        });

        const slashStatsContainer = document.createElement('div');
        slashStatsContainer.style.display = 'flex';
        slashStatsContainer.style.alignItems = 'center';
        slashStatsContainer.style.gap = '10px';
        slashStatsContainer.style.marginTop = '8px';

        const keysInOrder = [
          'healthRegen',
          'maxHealth',
          'bodyDamage',
          'bulletSpeed',
          'bulletPenetration',
          'bulletDamage',
          'reload',
          'movementSpeed'
        ];
        const slashValues = keysInOrder.map(key => stats[key] ?? 0);
        const slashValuesString = slashValues.join('/');

        const slashStats = document.createElement('div');
        slashStats.className = 'kbui-slash-stats';
        slashStats.style.display = 'flex';
        slashStats.style.alignItems = 'center';
        slashStats.style.justifyContent = 'center';
        slashStats.style.gap = '2px';
        slashStats.style.cursor = 'text';
        slashStats.style.userSelect = 'all';
        slashStats.title = 'Click to select and copy';

        slashValues.forEach((value, index) => {
          const span = document.createElement('span');
          span.textContent = value;
          span.style.color = statColors[keysInOrder[index]] || '#facc15';
          span.style.fontWeight = '600';
          slashStats.appendChild(span);
          
          if (index < slashValues.length - 1) {
            const slash = document.createElement('span');
            slash.textContent = '/';
            slash.style.color = '#facc15';
            slashStats.appendChild(slash);
          }
        });

        const copyBtn = document.createElement('button');
        copyBtn.className = 'kbui-button-main';
        copyBtn.textContent = 'Copy';
        copyBtn.style.padding = '4px 10px';
        copyBtn.style.fontSize = '11px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.addEventListener('click', async () => {
          const success = await copyToClipboard(slashValuesString);
          if (success) {
            showToast('Copied to clipboard!');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
            }, 2000);
          } else {
            showToast('Failed to copy');
          }
        });

        const showIngameBtn = document.createElement('button');
        showIngameBtn.className = 'kbui-button-main kbui-tooltip';
        showIngameBtn.textContent = 'Show Ingame';
        showIngameBtn.style.padding = '4px 10px';
        showIngameBtn.style.fontSize = '11px';
        showIngameBtn.style.cursor = 'pointer';
        const displayDuration = currentSettings.ingameDisplayDuration || DEFAULT_SETTINGS.ingameDisplayDuration;
        showIngameBtn.setAttribute('data-tooltip', `Configurable in Settings (${displayDuration}s)`);
        showIngameBtn.addEventListener('click', () => {
          showBuildIngame(slashValuesString);
        });

        slashStatsContainer.appendChild(slashStats);
        slashStatsContainer.appendChild(copyBtn);
        slashStatsContainer.appendChild(showIngameBtn);

        const footer = document.createElement('div');
        footer.className = 'kbui-build-footer';
  
        function formatScore(score) {
          if (!score || score === null) return '-';
          if (score >= 1000000) {
            return (score / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
          } else if (score >= 1000) {
            return (score / 1000).toFixed(0) + 'K';
          }
          return score.toString();
        }

        const best = document.createElement('div');
        best.className = 'kbui-pill';
        const scoreText = build.bestScoreFormatted || formatScore(build.bestScore);
        const usernameText = build.bestUsername ? ` by ${build.bestUsername}` : '';
        best.textContent = `Best: ${scoreText}${usernameText}${build.bestLevel ? ` (LVL ${build.bestLevel})` : ''}${build.bestTime ? `, ${build.bestTime}` : ''}`;
  
        const highscoreBtn = document.createElement('button');
        highscoreBtn.className = 'kbui-button-main';
        highscoreBtn.textContent = 'Submit Highscore';
        highscoreBtn.style.padding = '2px 8px';
        highscoreBtn.style.fontSize = '12px';
        highscoreBtn.addEventListener('click', () => openHighscoreForm(build));
  
        footer.appendChild(best);
        footer.appendChild(highscoreBtn);
  
        card.appendChild(header);
        card.appendChild(statGrid);
        card.appendChild(slashStatsContainer);
        card.appendChild(footer);
  
        list.appendChild(card);
      });
    }
  
    async function voteBuild(buildId, value, ratingLabelEl, voteCountsEl, build) {
      const buttons = document.querySelectorAll(`[data-build-id="${buildId}"] button`);
      buttons.forEach(btn => btn.disabled = true);

      try {
        const res = await apiPost(API_ROUTES.voteBuild(buildId), { value });
        if (ratingLabelEl && res && typeof res.newRating === 'number') {
          ratingLabelEl.textContent = `Score: ${res.newRating}`;
        }
        if (res && res.alreadyVoted) {
          showToast('Vote changed');
        } else {
          showToast('Vote submitted');
        }
        if (currentView === 'general') {
          loadAllBuilds();
        } else if (currentTankId) {
          loadBuildsForTank(currentTankId, currentTankName);
        }
      } catch (e) {
        const errorMsg = e.message || 'Vote failed';
        if (errorMsg.includes('already voted')) {
          showToast('You already voted on this build');
        } else {
          showToast('Vote failed: ' + errorMsg);
        }
        console.error(e);
      } finally {
        buttons.forEach(btn => btn.disabled = false);
      }
    }
  
    function openCreateBuildForm() {
      const list = document.getElementById('kbui-build-list');
      if (!list) return;
  
      list.innerHTML = '';
  
      const form = document.createElement('div');
      form.className = 'kbui-form';
  
      const title = document.createElement('div');
      title.className = 'kbui-section-title';
      title.textContent = 'Create Build';
  
      const info = document.createElement('div');
      info.className = 'kbui-small';
      info.textContent = 'Choose how to enter stats: separate fields or "0/0/0/0/0/0/0/0".';
  
      const nameRow = document.createElement('div');
      nameRow.className = 'kbui-form-row';
  
      const tankGroup = document.createElement('div');
      tankGroup.className = 'kbui-form-group';
      const tankLabel = document.createElement('label');
      tankLabel.textContent = 'Tank *';
      const tankSelect = document.createElement('select');
      tankSelect.id = 'kbui-tank-select';
      tankSelect.required = true;
      
      loadTanks().then(tanks => {
        if (!tanks || !tanks.length) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'No tanks available';
          tankSelect.appendChild(option);
          return;
        }

        const sortedTanks = [...tanks].sort((a, b) => {
          const levelA = a.level || a.sortOrder || 999;
          const levelB = b.level || b.sortOrder || 999;
          if (levelA !== levelB) return levelA - levelB;
          return (a.name || '').localeCompare(b.name || '');
        });

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select Tank --';
        if (!currentTankId) {
          defaultOption.selected = true;
        }
        tankSelect.appendChild(defaultOption);

        const levels = [1, 15, 30, 45];
        const processedTankIds = new Set();
        
        levels.forEach(level => {
          const levelTanks = sortedTanks.filter(t => {
            const tankLevel = t.level || t.sortOrder || 0;
            return tankLevel === level;
          });
          if (levelTanks.length === 0) return;

          const optgroup = document.createElement('optgroup');
          optgroup.label = `Level ${level}`;
          
          levelTanks.forEach(tank => {
            processedTankIds.add(tank.id);
            const option = document.createElement('option');
            option.value = tank.id;
            option.textContent = tank.name;
            if (currentTankId && tank.id === currentTankId) {
              option.selected = true;
            }
            optgroup.appendChild(option);
          });
          
          tankSelect.appendChild(optgroup);
        });

        const otherTanks = sortedTanks.filter(t => !processedTankIds.has(t.id));
        if (otherTanks.length > 0) {
          const optgroup = document.createElement('optgroup');
          optgroup.label = 'Other';
          
          otherTanks.forEach(tank => {
            const option = document.createElement('option');
            option.value = tank.id;
            option.textContent = tank.name;
            if (currentTankId && tank.id === currentTankId) {
              option.selected = true;
            }
            optgroup.appendChild(option);
          });
          
          tankSelect.appendChild(optgroup);
        }
      }).catch(err => {
        console.error('Failed to load tanks:', err);
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Error loading tanks';
        tankSelect.appendChild(option);
      });

      tankGroup.appendChild(tankLabel);
      tankGroup.appendChild(tankSelect);
  
      const nameGroup = document.createElement('div');
      nameGroup.className = 'kbui-form-group';
      const nameLabel = document.createElement('label');
      nameLabel.textContent = 'Build Name';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'My sniper build';
      nameGroup.appendChild(nameLabel);
      nameGroup.appendChild(nameInput);
  
      nameRow.appendChild(tankGroup);
      nameRow.appendChild(nameGroup);
  
      let inputMode = 'fields';
  
      const modeRow = document.createElement('div');
      modeRow.className = 'kbui-form-row';
      const modeGroup = document.createElement('div');
      modeGroup.className = 'kbui-form-group';
      const modeLabel = document.createElement('label');
      modeLabel.textContent = 'Stats input mode';
  
      const modeOptions = document.createElement('div');
      modeOptions.style.display = 'flex';
      modeOptions.style.gap = '8px';
      modeOptions.style.alignItems = 'center';
  
      const fieldsRadio = document.createElement('input');
      fieldsRadio.type = 'radio';
      fieldsRadio.name = 'kbui-stat-mode';
      fieldsRadio.checked = true;
      const fieldsLabel = document.createElement('span');
      fieldsLabel.textContent = 'Fields';
  
      const slashRadio = document.createElement('input');
      slashRadio.type = 'radio';
      slashRadio.name = 'kbui-stat-mode';
      const slashLabel = document.createElement('span');
      slashLabel.textContent = 'Slash "0/0/0/0/0/0/0/0"';
  
      modeOptions.appendChild(fieldsRadio);
      modeOptions.appendChild(fieldsLabel);
      modeOptions.appendChild(slashRadio);
      modeOptions.appendChild(slashLabel);
  
      modeGroup.appendChild(modeLabel);
      modeGroup.appendChild(modeOptions);
      modeRow.appendChild(modeGroup);
  
      const statsFieldRows = [];
  
      function makeStatRow(labels) {
        const row = document.createElement('div');
        row.className = 'kbui-form-row';
        labels.forEach(([label, key]) => {
          const g = document.createElement('div');
          g.className = 'kbui-form-group';
          const l = document.createElement('label');
          l.textContent = label;
          const inp = document.createElement('input');
          inp.type = 'number';
          inp.min = '0';
          inp.max = '7';
          inp.step = '1';
          inp.dataset.statKey = key;
          g.appendChild(l);
          g.appendChild(inp);
          row.appendChild(g);
        });
        return row;
      }
  
      statsFieldRows.push(
        makeStatRow([
          ['Health Regen', 'healthRegen'],
          ['Max Health', 'maxHealth']
        ]),
        makeStatRow([
          ['Body Damage', 'bodyDamage'],
          ['Bullet Speed', 'bulletSpeed']
        ]),
        makeStatRow([
          ['Bullet Penetration', 'bulletPenetration'],
          ['Bullet Damage', 'bulletDamage']
        ]),
        makeStatRow([
          ['Reload', 'reload'],
          ['Movement Speed', 'movementSpeed']
        ])
      );
  
      const statsFieldsWrapper = document.createElement('div');
      statsFieldRows.forEach(r => statsFieldsWrapper.appendChild(r));
  
      const statsSlashWrapper = document.createElement('div');
      statsSlashWrapper.style.display = 'none';
      statsSlashWrapper.className = 'kbui-form-group';
      const slashInfo = document.createElement('label');
      slashInfo.textContent = 'Stats (HR/HP/BD/BS/BP/BDmg/RL/MS) - Use /, space, comma, ; or |';
      const slashInput = document.createElement('input');
      slashInput.type = 'text';
      slashInput.placeholder = '0/0/0/0/0/0/0/0 or 0 0 0 0 0 0 0 0';
      statsSlashWrapper.appendChild(slashInfo);
      statsSlashWrapper.appendChild(slashInput);
  
      fieldsRadio.addEventListener('change', () => {
        if (fieldsRadio.checked) {
          inputMode = 'fields';
          statsFieldsWrapper.style.display = '';
          statsSlashWrapper.style.display = 'none';
        }
      });
      slashRadio.addEventListener('change', () => {
        if (slashRadio.checked) {
          inputMode = 'string';
          statsFieldsWrapper.style.display = 'none';
          statsSlashWrapper.style.display = '';
        }
      });
  
      const footer = document.createElement('div');
      footer.className = 'kbui-form-footer';
  
      const hint = document.createElement('div');
      hint.className = 'kbui-small';
      hint.textContent = 'Stats 0–7. You can set highscores later via "Submit Highscore".';
  
      const saveBtn = document.createElement('button');
      saveBtn.className = 'kbui-button-main';
      saveBtn.textContent = 'Save Build';
  
      saveBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim() || 'Unnamed Build';
        const selectedTankId = tankSelect.value ? parseInt(tankSelect.value, 10) : null;
        
        if (!selectedTankId || !Number.isFinite(selectedTankId)) {
          showToast('Please select a tank');
          return;
        }

        const stats = {};
  
        const keysInOrder = [
          'healthRegen',
          'maxHealth',
          'bodyDamage',
          'bulletSpeed',
          'bulletPenetration',
          'bulletDamage',
          'reload',
          'movementSpeed'
        ];
  
        if (inputMode === 'fields') {
          form.querySelectorAll('input[data-stat-key]').forEach((inp) => {
            const key = inp.dataset.statKey;
            const v = inp.value.trim();
            stats[key] = v === '' ? null : Number(v);
          });
        } else {
          const raw = slashInput.value.trim();
          if (!raw) {
            showToast('Please enter stats like "0/0/0/0/0/0/0/0" or "0 0 0 0 0 0 0 0" or "0,0,0,0,0,0,0,0"');
            return;
          }
          
          let parts = raw.split('/');
          if (parts.length !== 8) {
            parts = raw.split(/\s+/);
          }
          if (parts.length !== 8) {
            parts = raw.split(',');
          }
          if (parts.length !== 8) {
            parts = raw.split(';');
          }
          if (parts.length !== 8) {
            parts = raw.split('|');
          }
          
          if (parts.length !== 8) {
            showToast('Exactly 8 values required. Use /, space, comma, semicolon, or | as separator');
            return;
          }
          
          for (let i = 0; i < 8; i++) {
            const num = Number(parts[i].trim());
            if (!Number.isFinite(num) || num < 0 || num > 7) {
              showToast('Stats must be numbers 0–7');
              return;
            }
            stats[keysInOrder[i]] = num;
          }
        }

        const totalStats = Object.values(stats).reduce((sum, val) => sum + (val || 0), 0);
        if (totalStats > 33) {
          showToast(`Total stats (${totalStats}) exceeds maximum of 33. Max: 4×7 + 1×5 = 33`);
          return;
        }

        const payload = {
          tankId: selectedTankId,
          name,
          stats
        };
  
        try {
          await apiPost(API_ROUTES.createBuild, payload);
          showToast('Build saved');
          if (currentView === 'tank' && currentTankId) {
            loadBuildsForTank(currentTankId, currentTankName);
          } else if (currentView === 'general') {
            loadAllBuilds();
          }
        } catch (e) {
          let errorMessage = 'Saving failed';
          try {
            if (e.data) {
              const errorData = e.data;
              if (errorData.error === 'DUPLICATE_BUILD' || errorData.message) {
                const details = errorData.details || {};
                const statsStr = details.stats || `${stats.healthRegen || 0}/${stats.maxHealth || 0}/${stats.bodyDamage || 0}/${stats.bulletSpeed || 0}/${stats.bulletPenetration || 0}/${stats.bulletDamage || 0}/${stats.reload || 0}/${stats.movementSpeed || 0}`;
                errorMessage = `${errorData.message || 'A build with identical stats already exists for this tank.'}\n\nTank: ${details.tankName || 'Unknown'}\nExisting Build: "${details.buildName || 'Unknown'}"\nStats: ${statsStr}`;
              } else {
                errorMessage = errorData.error || errorData.message || e.message || 'Unknown error';
              }
            } else {
              const errorText = e.message || '';
              if (errorText.includes('identical stats already exists') || errorText.includes('DUPLICATE_BUILD')) {
                const statsString = `${stats.healthRegen || 0}/${stats.maxHealth || 0}/${stats.bodyDamage || 0}/${stats.bulletSpeed || 0}/${stats.bulletPenetration || 0}/${stats.bulletDamage || 0}/${stats.reload || 0}/${stats.movementSpeed || 0}`;
                errorMessage = `A build with identical stats already exists for this tank.\n\nStats: ${statsString}`;
              } else {
                errorMessage = errorText || 'Unknown error';
              }
            }
          } catch (parseError) {
            errorMessage = e.message || 'Unknown error';
          }
          
          showToast(errorMessage);
          console.error('[KBUI] Build save error:', e);
        }
      });
  
      footer.appendChild(hint);
      footer.appendChild(saveBtn);
  
      form.appendChild(title);
      form.appendChild(info);
      form.appendChild(nameRow);
      form.appendChild(modeRow);
      form.appendChild(statsFieldsWrapper);
      form.appendChild(statsSlashWrapper);
      form.appendChild(footer);
  
      list.appendChild(form);
    }
  
    function openSettings() {
      const list = document.getElementById('kbui-build-list');
      if (!list) return;

      list.innerHTML = '';

      const form = document.createElement('div');
      form.className = 'kbui-form';

      const title = document.createElement('div');
      title.className = 'kbui-section-title';
      title.textContent = 'Settings - Special Options';

      const durationRow = document.createElement('div');
      durationRow.className = 'kbui-form-row';
      
      const durationGroup = document.createElement('div');
      durationGroup.className = 'kbui-form-group';
      durationGroup.style.flex = '1';
      
      const durationLabel = document.createElement('label');
      durationLabel.textContent = 'Ingame Display Duration (seconds)';
      
      const durationInput = document.createElement('input');
      durationInput.type = 'number';
      durationInput.min = '1';
      durationInput.max = '300';
      durationInput.step = '1';
      durationInput.value = currentSettings.ingameDisplayDuration || DEFAULT_SETTINGS.ingameDisplayDuration;
      durationInput.style.width = '100%';
      
      const durationHint = document.createElement('div');
      durationHint.className = 'kbui-small';
      durationHint.style.marginTop = '4px';
      durationHint.textContent = 'How long the build stats are displayed when clicking "Show Ingame" (1-300 seconds)';
      
      durationGroup.appendChild(durationLabel);
      durationGroup.appendChild(durationInput);
      durationGroup.appendChild(durationHint);
      durationRow.appendChild(durationGroup);

      const footer = document.createElement('div');
      footer.className = 'kbui-form-footer';
      footer.style.marginTop = '20px';

      const saveBtn = document.createElement('button');
      saveBtn.className = 'kbui-button-main';
      saveBtn.textContent = 'Save Settings';
      saveBtn.addEventListener('click', () => {
        const duration = parseInt(durationInput.value, 10);
        if (isNaN(duration) || duration < 1 || duration > 300) {
          showToast('Duration must be between 1 and 300 seconds');
          return;
        }
        currentSettings.ingameDisplayDuration = duration;
        saveSettings(currentSettings);
        showToast('Settings saved');
        setTimeout(() => {
          if (currentView === 'general') {
            loadAllBuilds();
          } else if (currentTankId) {
            loadBuildsForTank(currentTankId, currentTankName);
          }
        }, 500);
      });

      const backBtn = document.createElement('button');
      backBtn.className = 'kbui-close-btn';
      backBtn.textContent = 'Back';
      backBtn.addEventListener('click', () => {
        if (currentView === 'general') {
          loadAllBuilds();
        } else if (currentTankId) {
          loadBuildsForTank(currentTankId, currentTankName);
        }
      });

      footer.appendChild(saveBtn);
      footer.appendChild(backBtn);

      form.appendChild(title);
      form.appendChild(durationRow);
      form.appendChild(footer);

      list.appendChild(form);
    }

    function openHighscoreForm(build) {
      const list = document.getElementById('kbui-build-list');
      if (!list) return;

      list.innerHTML = '';

      const form = document.createElement('div');
      form.className = 'kbui-form';

      const title = document.createElement('div');
      title.className = 'kbui-section-title';
      title.textContent = `Submit Highscore for "${build.name || 'Build'}"`;

      const info = document.createElement('div');
      info.className = 'kbui-small';
      info.textContent = 'Upload a screenshot showing your score, level, time, and the build. Admin will verify and approve.';

      const row1 = document.createElement('div');
      row1.className = 'kbui-form-row';

      const usernameGroup = document.createElement('div');
      usernameGroup.className = 'kbui-form-group';
      const usernameLabel = document.createElement('label');
      usernameLabel.textContent = 'Username *';
      const usernameInput = document.createElement('input');
      usernameInput.type = 'text';
      usernameInput.placeholder = 'Your username';
      usernameInput.maxLength = 50;
      usernameGroup.appendChild(usernameLabel);
      usernameGroup.appendChild(usernameInput);

      row1.appendChild(usernameGroup);

      const row2 = document.createElement('div');
      row2.className = 'kbui-form-row';

      const imageGroup = document.createElement('div');
      imageGroup.className = 'kbui-form-group';
      imageGroup.style.flex = '1';
      const imageLabel = document.createElement('label');
      imageLabel.textContent = 'Screenshot (Proof) *';
      const imageInput = document.createElement('input');
      imageInput.type = 'file';
      imageInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
      imageInput.style.width = '100%';
      imageInput.style.padding = '4px';
      imageGroup.appendChild(imageLabel);
      imageGroup.appendChild(imageInput);

      row2.appendChild(imageGroup);

      const footer = document.createElement('div');
      footer.className = 'kbui-form-footer';

      const hint = document.createElement('div');
      hint.className = 'kbui-small';
      hint.textContent = 'Screenshot must show: Score, Level, Time, and the Build. Max 10MB.';

      const submitBtn = document.createElement('button');
      submitBtn.className = 'kbui-button-main';
      submitBtn.textContent = 'Submit Highscore';

      submitBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const imageFile = imageInput.files[0];

        if (!username) {
          showToast('Username is required');
          return;
        }

        if (!imageFile) {
          showToast('Screenshot is required');
          return;
        }

        if (imageFile.size > 10 * 1024 * 1024) {
          showToast('Image must be smaller than 10MB');
          return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
          showToast('Only image files are allowed (jpeg, jpg, png, gif, webp)');
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Uploading...';

          const formData = new FormData();
          formData.append('image', imageFile);
          formData.append('username', username);

          await apiPostFormData(API_ROUTES.submitHighscore(build.id), formData);
          showToast('Highscore submitted! Waiting for admin approval.');
          if (currentTankId) {
            loadBuildsForTank(currentTankId, currentTankName);
          }
        } catch (e) {
          showToast('Submit failed: ' + (e.message || 'Unknown error'));
          console.error(e);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Highscore';
        }
      });

      footer.appendChild(hint);
      footer.appendChild(submitBtn);

      form.appendChild(title);
      form.appendChild(info);
      form.appendChild(row1);
      form.appendChild(row2);
      form.appendChild(footer);

      list.appendChild(form);
    }
  
    function init() {
      injectStyles();
      createUIRoot();

      currentSettings = loadSettings();

      loadTanks().then(renderTankGrid).catch((e) => console.error(e));
  
      injectMenuBuildButton();
      const mo = new MutationObserver(() => injectMenuBuildButton());
      mo.observe(document.body, { childList: true, subtree: true });
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  
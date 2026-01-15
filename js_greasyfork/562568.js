// ==UserScript==
// @name         kuplaVaatekaappiFix
// @namespace    https://kuplahotelli.com/
// @version      2.1.2
// @description  Custom avatar wardrobe - parent window UI, Nitro in-game renderer (no Habbo Imaging)
// @author       res
// @match        https://kuplahotelli.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/562568/kuplaVaatekaappiFix.user.js
// @updateURL https://update.greasyfork.org/scripts/562568/kuplaVaatekaappiFix.meta.js
// ==/UserScript==

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                        KUPLA WARDROBE PRO v2.2.0                          ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  ARCHITECTURE:                                                            ║
 * ║  • Window lives in PARENT (no iframe injection that breaks things)        ║
 * ║  • Calls into iframe only for Nitro renderer access (no iframe UI)        ║
 * ║  • No Habbo Imaging (in-game renderer only)                               ║
 * ║  • Native item-only rendering using getAssetByName (no body silhouette)   ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

(function() {
  'use strict';

  const SCRIPT_NAME = 'kupla-wardrobe';
  const SCRIPT_VERSION = '2.2.2';
  
  const log = {
    prefix: `[${SCRIPT_NAME}]`,
    info: (...args) => console.log(log.prefix, ...args),
    warn: (...args) => console.warn(log.prefix, ...args),
    error: (...args) => console.error(log.prefix, ...args),
  };

  // ═══════════════════════════════════════════════════════════════
  // FIGURE PARSER
  // ═══════════════════════════════════════════════════════════════
  class FigureParser {
    static parse(figureString) {
      const parts = {};
      if (!figureString) return parts;
      figureString.split('.').forEach(part => {
        const match = part.match(/^([a-z]{2})-(\d+)(?:-(.+))?$/);
        if (match) {
          const [, type, id, colorsStr] = match;
          const colors = colorsStr ? colorsStr.split('-').map(c => parseInt(c, 10)) : [];
          parts[type] = { id: parseInt(id, 10), colors };
        }
      });
      return parts;
    }
    
    static build(parts) {
      return Object.entries(parts)
        .filter(([, value]) => value && value.id >= 0)
        .map(([type, { id, colors }]) => {
          let part = type + '-' + id;
          if (colors && colors.length > 0) part += '-' + colors.join('-');
          return part;
        })
        .join('.');
    }
    
    static updatePart(figureString, partType, partId, colors = []) {
      const parts = this.parse(figureString);
      if (partId === -1 || partId === null) {
        delete parts[partType];
      } else {
        parts[partType] = { id: partId, colors };
      }
      return this.build(parts);
    }
    
    static updateColors(figureString, partType, colors) {
      const parts = this.parse(figureString);
      if (parts[partType]) {
        parts[partType].colors = colors;
      }
      return this.build(parts);
    }
    
    static getPart(figureString, partType) {
      return this.parse(figureString)[partType] || null;
    }
    
    static buildItemOnly(partType, partId, colors = []) {
      if (partId === -1 || partId === null) return '';
      const parts = { [partType]: { id: partId, colors } };
      return this.build(parts);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FIGURE DATA MANAGER
  // ═══════════════════════════════════════════════════════════════
  class FigureDataManager {
    constructor() {
      this.figureData = null;
      this.loaded = false;
    }
    
    async load() {
      if (this.loaded) return this.figureData;
      try {
        const resp = await fetch('/nitro-assets/gamedata/FigureDataISO.json');
        this.figureData = await resp.json();
        this.loaded = true;
        log.info('FigureData loaded');
        return this.figureData;
      } catch (err) {
        log.error('Failed to load FigureData:', err);
        return null;
      }
    }
    
    getSetType(type) {
      if (!this.figureData) return null;
      const setTypes = this.figureData.setTypes || this.figureData.settype || [];
      return Array.isArray(setTypes) ? setTypes.find(s => s.type === type) : setTypes[type];
    }
    
    getPalette(paletteId) {
      if (!this.figureData) return null;
      const palettes = this.figureData.palettes || this.figureData.palette || [];
      return Array.isArray(palettes) ? palettes.find(p => p.id === parseInt(paletteId)) : palettes[paletteId];
    }
    
    getPartSets(type, gender = 'M') {
      const setType = this.getSetType(type);
      if (!setType) return [];
      let sets = setType.sets || setType.set || [];
      if (!Array.isArray(sets)) sets = Object.values(sets);
      return sets.filter(set => {
        if (!set) return false;
        const setGender = set.gender || 'U';
        return (setGender === 'U' || setGender === gender) && set.selectable !== false;
      }).sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    
    getColors(type) {
      const setType = this.getSetType(type);
      if (!setType) return [];
      const paletteId = setType.paletteId || setType.paletteid || setType.palette;
      const palette = this.getPalette(paletteId);
      if (!palette) return [];
      let colors = palette.colors || palette.color || [];
      if (!Array.isArray(colors)) colors = Object.values(colors);
      return colors.filter(c => c && c.selectable !== false).map(c => ({
        id: c.id ?? c.index ?? 0,
        hexCode: c.hexCode || c.color || c.hex || 'FFFFFF',
      }));
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════════
  const CATEGORIES = [
    { id: 'hd', name: 'Iho', iconClass: 'hd-icon', mandatory: true },
    { id: 'hr', name: 'Hiukset', iconClass: 'hr-icon' },
    { id: 'ha', name: 'Hattu', iconClass: 'ha-icon' },
    { id: 'he', name: 'Pääkoriste', iconClass: 'he-icon' },
    { id: 'ea', name: 'Lasit', iconClass: 'ea-icon' },
    { id: 'fa', name: 'Naamakoriste', iconClass: 'fa-icon' },
    { id: 'ch', name: 'Paita', iconClass: 'ch-icon', mandatory: true },
    { id: 'cc', name: 'Takki', iconClass: 'cc-icon' },
    { id: 'cp', name: 'Printit', iconClass: 'cp-icon' },
    { id: 'ca', name: 'Rintakoriste', iconClass: 'ca-icon' },
    { id: 'lg', name: 'Housut', iconClass: 'lg-icon', mandatory: true },
    { id: 'sh', name: 'Kengät', iconClass: 'sh-icon', mandatory: true },
    { id: 'wa', name: 'Vyö', iconClass: 'wa-icon' },
  ];

  // ═══════════════════════════════════════════════════════════════
  // STYLES - In parent window
  // ═══════════════════════════════════════════════════════════════
  const STYLES = `
    .kw-window {
      position: fixed;
      top: 60px;
      left: 80px;
      width: 780px;
      height: 573px;
      min-width: 600px;
      min-height: 400px;
      background: rgba(17,23,27,0.98);
      border: 1px solid #718792;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.7);
      z-index: 999999;
      display: none;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', sans-serif;
      resize: both;
      overflow: hidden;
    }
    
    .kw-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: linear-gradient(180deg, #3a4d56 0%, #2c3b43 100%);
      border-bottom: 1px solid #718792;
      cursor: move;
      user-select: none;
      flex-shrink: 0;
    }
    
    .kw-title {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .kw-badge {
      background: linear-gradient(135deg, #4a9eff, #2d7ad6);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .kw-close {
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      width: 26px;
      height: 26px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.15s;
    }
    .kw-close:hover { background: rgba(255,80,80,0.5); }
    
    .kw-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    
    .kw-preview {
      width: 170px;
      background: linear-gradient(180deg, rgba(54,73,81,0.8) 0%, rgba(40,55,62,0.9) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      border-right: 1px solid #718792;
      gap: 10px;
      flex-shrink: 0;
    }
    
    .kw-avatar-box {
      width: 130px;
      height: 300px;
      background: rgba(0,0,0,0.4);
      border-radius: 6px;
      border: 1px solid #5a6a72;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .kw-avatar-box img {
      max-width: 100%;
      max-height: 100%;
      image-rendering: pixelated;
      scale: 2;
    }
    
    .kw-gender-row {
      display: flex;
      gap: 6px;
      width: 100%;
    }
    
    .kw-gender-btn {
      flex: 1;
      height: 48px;
      padding: 0;
      border: 1px solid #5a6a72;
      background: rgba(54,73,81,0.7);
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .kw-gender-btn:hover { background: rgba(255,255,255,0.1); }
    .kw-gender-btn.active { background: #4a9eff; border-color: #4a9eff; }
    .kw-gender-btn.active .nitro-avatar-editor-spritesheet { filter: brightness(1.2); }
    
    .kw-rotate-row {
      display: flex;
      gap: 6px;
    }
    
    .kw-rotate-btn {
      width: 32px;
      height: 32px;
      background: #2c3b43;
      border: 1px solid #5a6a72;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.15s;
    }
    .kw-rotate-btn:hover { background: #3a4d56; border-color: #718792; }
    
    .kw-action-col {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .kw-action-btn {
      padding: 7px;
      background: #2c3b43;
      border: 1px solid #5a6a72;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      transition: all 0.15s;
    }
    .kw-action-btn:hover { background: #3a4d56; }
    .kw-action-btn.primary { background: linear-gradient(135deg, #4a9eff, #2d7ad6); border-color: #4a9eff; }
    
    .kw-editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .kw-categories {
      display: flex;
      gap: 3px;
      padding: 8px 10px;
      background: #2c3b43;
      overflow-x: auto;
      border-bottom: 1px solid #718792;
      flex-shrink: 0;
    }
    
    .kw-cat-btn {
      padding: 6px 6px;
      border: 1px solid #5a6a72;
      background: rgba(54,73,81,0.7);
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      min-width: fit-content;
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.15s;
    }
    .kw-cat-btn:hover:not(.active) { background: rgba(255,255,255,0.1); }
    .kw-cat-btn.active { background: #4a9eff; border-color: #4a9eff; }
    .kw-cat-btn.active .nitro-avatar-editor-spritesheet { filter: brightness(1.2); }
    
    /* Nitro Avatar Editor Spritesheet */
    .nitro-avatar-editor-spritesheet {
      background: url(data:image/png;base64,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) transparent no-repeat;
    }
    .nitro-avatar-editor-spritesheet.ca-icon { width: 25px; height: 25px; background-position: -226px -61px; }
    .nitro-avatar-editor-spritesheet.ca-icon.selected { background-position: -226px -96px; }
    .nitro-avatar-editor-spritesheet.cc-icon { width: 31px; height: 29px; background-position: -145px -5px; }
    .nitro-avatar-editor-spritesheet.cc-icon.selected { background-position: -145px -44px; }
    .nitro-avatar-editor-spritesheet.ch-icon { width: 29px; height: 24px; background-position: -186px -39px; }
    .nitro-avatar-editor-spritesheet.ch-icon.selected { background-position: -186px -73px; }
    .nitro-avatar-editor-spritesheet.cp-icon { width: 30px; height: 24px; background-position: -145px -264px; }
    .nitro-avatar-editor-spritesheet.cp-icon.selected { background-position: -186px -5px; }
    .nitro-avatar-editor-spritesheet.ea-icon { width: 35px; height: 16px; background-position: -226px -193px; }
    .nitro-avatar-editor-spritesheet.ea-icon.selected { background-position: -226px -219px; }
    .nitro-avatar-editor-spritesheet.fa-icon { width: 27px; height: 20px; background-position: -186px -137px; }
    .nitro-avatar-editor-spritesheet.fa-icon.selected { background-position: -186px -107px; }
    .nitro-avatar-editor-spritesheet.ha-icon { width: 25px; height: 22px; background-position: -226px -245px; }
    .nitro-avatar-editor-spritesheet.ha-icon.selected { background-position: -226px -277px; }
    .nitro-avatar-editor-spritesheet.hd-icon { width: 26px; height: 26px; background-position: -5px -5px; }
    .nitro-avatar-editor-spritesheet.hd-icon.selected { background-position: -5px -41px; }
    .nitro-avatar-editor-spritesheet.he-icon { width: 31px; height: 27px; background-position: -145px -83px; }
    .nitro-avatar-editor-spritesheet.he-icon.selected { background-position: -145px -120px; }
    .nitro-avatar-editor-spritesheet.hr-icon { width: 29px; height: 25px; background-position: -145px -194px; }
    .nitro-avatar-editor-spritesheet.hr-icon.selected { background-position: -145px -229px; }
    .nitro-avatar-editor-spritesheet.lg-icon { width: 19px; height: 20px; background-position: -303px -45px; }
    .nitro-avatar-editor-spritesheet.lg-icon.selected { background-position: -303px -75px; }
    .nitro-avatar-editor-spritesheet.sh-icon { width: 37px; height: 10px; background-position: -303px -5px; }
    .nitro-avatar-editor-spritesheet.sh-icon.selected { background-position: -303px -25px; }
    .nitro-avatar-editor-spritesheet.wa-icon { width: 36px; height: 18px; background-position: -226px -5px; }
    .nitro-avatar-editor-spritesheet.wa-icon.selected { background-position: -226px -33px; }
    .nitro-avatar-editor-spritesheet.gender-male { width: 21px; height: 21px; background-position: -186px -276px; }
    .nitro-avatar-editor-spritesheet.gender-male.selected { background-position: -272px -5px; filter: brightness(1.2); }
    .nitro-avatar-editor-spritesheet.gender-female { width: 18px; height: 27px; background-position: -186px -202px; }
    .nitro-avatar-editor-spritesheet.gender-female.selected { background-position: -186px -239px; filter: brightness(1.2); }

    .kw-main-area {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    
    .kw-items {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
      gap: 6px;
      align-content: start;
      background: rgba(0,0,0,0.25);
    }
    
    .kw-item {
      width: 48px;
      height: 48px;
      background: rgba(54,73,81,0.8);
      border: 1px solid #5a6a72;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #ccc;
      font-weight: 500;
      transition: all 0.15s;
      overflow: hidden;
    }

    .kw-item img {
      width: 100%;
      height: 100%;
      object-fit: none;
      image-rendering: pixelated;
      display: block;
    }

    .kw-item .kw-item-label {
      position: absolute;
      bottom: 1px;
      right: 2px;
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      text-shadow: 0 1px 2px rgba(0,0,0,0.9);
      pointer-events: none;
      display: none;
    }
    .kw-item:hover { background: rgba(74,158,255,0.2); border-color: #4a9eff; }
    .kw-item.selected { 
      border-color: #4a9eff; 
      background: rgba(74,158,255,0.35); 
      box-shadow: 0 0 8px rgba(74,158,255,0.5);
      color: #fff;
    }
    .kw-item.clear { border-style: dashed; background: transparent; }
    .kw-item.clear::after { content: '✕'; font-size: 16px; color: #8ab; }
    
    .kw-colors {
      width: 210px;
      padding: 10px;
      background: rgba(54,73,81,0.7);
      border-left: 1px solid #718792;
      overflow-y: auto;
      display: flex;
      flex-direction: row;
      gap: 10px;
      flex-shrink: 0;
    }
    
    .kw-color-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .kw-color-label {
      color: #9ab;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      text-align: center;
      letter-spacing: 0.5px;
    }
    
    .kw-color-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3px;
    }
    
    .kw-color {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.15s;
    }
    .kw-color:hover { transform: scale(1.2); z-index: 1; }
    .kw-color.selected { border-color: #fff; box-shadow: 0 0 6px rgba(255,255,255,0.6); }
    
    .kw-footer {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: #2c3b43;
      border-top: 1px solid #718792;
      flex-shrink: 0;
    }
    
    .kw-figure-input {
      flex: 1;
    }
    
    .kw-figure-input input {
      width: 100%;
      padding: 7px 10px;
      background: rgba(0,0,0,0.4);
      border: 1px solid #5a6a72;
      border-radius: 4px;
      color: #fff;
      font-size: 11px;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    .kw-figure-input input:focus { outline: none; border-color: #4a9eff; }
    
    .kw-btn {
      padding: 8px 16px;
      border: 1px solid #5a6a72;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.15s;
    }
    .kw-btn-cancel { background: rgba(54,73,81,0.7); color: #fff; }
    .kw-btn-cancel:hover { background: rgba(80,100,110,0.8); }
    .kw-btn-save { background: linear-gradient(135deg, #5a9a6a, #458054); border-color: #5a9a6a; color: #fff; }
    .kw-btn-save:hover { filter: brightness(1.1); }
    
    .kw-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #8ab;
      font-size: 12px;
    }
    
    /* Floating button */
    #kw-float-btn {
      position: fixed;
      bottom: 120px;
      right: 20px;
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #3a4d56, #2c3b43);
      border: 2px solid #718792;
      border-radius: 10px;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    #kw-float-btn:hover { 
      background: linear-gradient(135deg, #4a5d66, #3c4b53);
      border-color: #4a9eff; 
      transform: scale(1.05);
    }
  `;

  // ═══════════════════════════════════════════════════════════════
  // NITRO RENDER BRIDGE (parent -> iframe)
  // ═══════════════════════════════════════════════════════════════
  class NitroRenderBridge {
    constructor() {
      this._installed = false;
      this._pending = new Map();
      this._preloadPending = new Map();
      this._cache = new Map();
      this._cacheMax = 250;

      this._onMessage = (event) => {
        const msg = event?.data;
        if (!msg || msg.__kwRender !== true) return;
        
        // Handle preload completion
        if (msg.type === 'KW_PRELOAD_COMPLETE') {
          const entry = this._preloadPending.get(msg.requestId);
          if (entry) {
            this._preloadPending.delete(msg.requestId);
            clearTimeout(entry.timeoutId);
            entry.resolve();
          }
          return;
        }
        
        // Handle render results
        if (msg.type !== 'KW_RENDER_RESULT') return;
        const entry = this._pending.get(msg.requestId);
        if (!entry) return;
        this._pending.delete(msg.requestId);
        clearTimeout(entry.timeoutId);
        if (msg.ok) entry.resolve(msg.dataUrl);
        else entry.reject(new Error(msg.error || 'Render failed'));
      };
      window.addEventListener('message', this._onMessage);
    }

    _getNitroIframe() {
      return document.getElementById('nitro');
    }

    _cacheGet(key) {
      return this._cache.get(key) || null;
    }

    _cacheSet(key, value) {
      this._cache.set(key, value);
      if (this._cache.size <= this._cacheMax) return;
      const firstKey = this._cache.keys().next().value;
      if (firstKey) this._cache.delete(firstKey);
    }

    async _waitForIframeDoc(timeoutMs = 30000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const iframe = this._getNitroIframe();
        if (iframe && iframe.contentDocument && iframe.contentWindow) {
          return { iframe, doc: iframe.contentDocument, win: iframe.contentWindow };
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      throw new Error('Nitro iframe not ready');
    }

    async ensureInstalled() {
      if (this._installed) return;
      const { doc } = await this._waitForIframeDoc();
      if (doc.getElementById('kw-render-service')) {
        this._installed = true;
        return;
      }

      const script = doc.createElement('script');
      script.id = 'kw-render-service';
      script.type = 'text/javascript';
      script.textContent = `(function() {
  if (window.__kwRenderServiceInstalled) return;
  window.__kwRenderServiceInstalled = true;

  var ORIGIN = window.location.origin;
  var _cachedAvatarMgr = null;
  var _vendorApiPromise = null;

  function isAvatarManager(mgr) {
    try { return !!mgr && typeof mgr.createAvatarImage === 'function'; } catch (e) { return false; }
  }

  function safeCall(fn) {
    try { return fn(); } catch (e) { return null; }
  }

  function getEntryModuleUrl() {
    try {
      var scripts = Array.from(document.querySelectorAll('script[type="module"][src]'));
      var preferred = scripts.find(function(s) { return /\\/index-[^/]+\\.js(\\?|$)/.test(String(s.src)); }) || scripts[0];
      return preferred ? String(preferred.src) : null;
    } catch (e) {
      return null;
    }
  }

  function loadVendorApi() {
    if (_vendorApiPromise) return _vendorApiPromise;
    _vendorApiPromise = (function() {
      return new Promise(function(resolve) {
        var entryUrl = getEntryModuleUrl();
        if (!entryUrl) { resolve(null); return; }

        fetch(entryUrl, { credentials: 'include' }).then(function(resp) {
          if (!resp || !resp.ok) { resolve(null); return; }
          return resp.text();
        }).then(function(entryCode) {
          if (!entryCode) { resolve(null); return; }

          var m = entryCode.match(/import\\{([^}]+)\\}\\s*from\\s*["'](\\.\\/(vendor|index)-[^"']+)["']/);
          if (!m) { resolve(null); return; }

          var importSpec = String(m[1] || '');
          var vendorRel = String(m[2] || '');
          if (!vendorRel) { resolve(null); return; }
          var vendorUrl = new URL(vendorRel, entryUrl).href;

          var aliasToExport = Object.create(null);
          importSpec.split(',').forEach(function(raw) {
            var part = String(raw || '').trim();
            if (!part) return;
            var mm = part.match(/^([A-Za-z0-9_$]+)\\s+as\\s+([A-Za-z0-9_$]+)$/);
            if (mm) aliasToExport[mm[2]] = mm[1];
          });

          import(vendorUrl).then(function(ns) {
            var hsKey = aliasToExport.hs;
            var ciKey = aliasToExport.ci;
            var ZrKey = aliasToExport.Zr;
            var hs = hsKey ? ns[hsKey] : null;
            var ci = ciKey ? ns[ciKey] : null;
            var Zr = ZrKey ? ns[ZrKey] : null;
            resolve({ entryUrl: entryUrl, vendorUrl: vendorUrl, ns: ns, hs: hs, ci: ci, Zr: Zr });
          }).catch(function() { resolve(null); });
        }).catch(function() { resolve(null); });
      });
    })();
    return _vendorApiPromise;
  }

  function resolveScaleConst(vendorApi, scale) {
    try {
      var ci = vendorApi && vendorApi.ci;
      if (!ci) return scale;
      var s = String(scale || '').toLowerCase();
      if (s === 'large' || s === 'h' || s === 'l' || s === 'big') return ci.LARGE != null ? ci.LARGE : scale;
      if (s === 'small' || s === 's') return ci.SMALL != null ? ci.SMALL : scale;
      return ci.LARGE != null ? ci.LARGE : scale;
    } catch (e) {
      return scale;
    }
  }

  function resolveSetTypeConst(vendorApi, setType) {
    try {
      var Zr = vendorApi && vendorApi.Zr;
      if (!Zr) return setType;
      if (setType === 'head') return Zr.HEAD != null ? Zr.HEAD : setType;
      if (setType === 'full') return Zr.FULL != null ? Zr.FULL : setType;
      if (setType === 'item') return Zr.FULL != null ? Zr.FULL : 'full';
      return setType;
    } catch (e) {
      return setType;
    }
  }

  function scanForAvatarManager(maxProps) {
    maxProps = maxProps || 1500;
    try {
      var props = Object.getOwnPropertyNames(window);
      for (var i = 0; i < props.length && i < maxProps; i++) {
        var key = props[i];
        if (!key || key === '__kwRenderServiceInstalled') continue;
        var v = null;
        try { v = window[key]; } catch (e) { continue; }
        if (!v) continue;
        if (isAvatarManager(v)) return v;
        try {
          if (v.avatar && isAvatarManager(v.avatar)) return v.avatar;
          if (v.instance) {
            if (v.instance.avatar && isAvatarManager(v.instance.avatar)) return v.instance.avatar;
            if (v.instance.avatarRenderManager && isAvatarManager(v.instance.avatarRenderManager)) return v.instance.avatarRenderManager;
          }
        } catch (e) {}
      }
    } catch (e) {}
    return null;
  }

  function getAvatarManagerAsync() {
    return new Promise(function(resolve) {
      if (_cachedAvatarMgr && isAvatarManager(_cachedAvatarMgr)) { resolve(_cachedAvatarMgr); return; }

      loadVendorApi().then(function(vendorApi) {
        var hs = vendorApi && vendorApi.hs;
        var fromHs = hs && hs.instance && hs.instance.avatar ? hs.instance.avatar : null;
        if (isAvatarManager(fromHs)) { _cachedAvatarMgr = fromHs; resolve(fromHs); return; }

        var fromAt = safeCall(function() { return typeof window.At === 'function' ? window.At() : null; });
        if (isAvatarManager(fromAt)) { _cachedAvatarMgr = fromAt; resolve(fromAt); return; }

        var fromTe = safeCall(function() {
          if (typeof window.Te !== 'function') return null;
          var inst = window.Te();
          return inst && inst.avatar ? inst.avatar : null;
        });
        if (isAvatarManager(fromTe)) { _cachedAvatarMgr = fromTe; resolve(fromTe); return; }

        var hsGlobal = window.hs || null;
        if (hsGlobal && hsGlobal.instance && hsGlobal.instance.avatar && isAvatarManager(hsGlobal.instance.avatar)) {
          _cachedAvatarMgr = hsGlobal.instance.avatar; resolve(hsGlobal.instance.avatar); return;
        }

        var nitro = (window.Nitro && (window.Nitro.instance || window.Nitro)) || null;
        if (nitro && nitro.avatar && isAvatarManager(nitro.avatar)) { _cachedAvatarMgr = nitro.avatar; resolve(nitro.avatar); return; }
        if (nitro && nitro.instance && nitro.instance.avatar && isAvatarManager(nitro.instance.avatar)) {
          _cachedAvatarMgr = nitro.instance.avatar; resolve(nitro.instance.avatar); return;
        }
        if (typeof window.GetAvatarRenderManager === 'function') {
          var mgr = safeCall(function() { return window.GetAvatarRenderManager(); });
          if (isAvatarManager(mgr)) { _cachedAvatarMgr = mgr; resolve(mgr); return; }
        }

        var scanned = scanForAvatarManager();
        if (isAvatarManager(scanned)) { _cachedAvatarMgr = scanned; resolve(scanned); return; }
        resolve(null);
      }).catch(function() { resolve(null); });
    });
  }

  function waitForAvatarManager(timeoutMs) {
    timeoutMs = timeoutMs || 3000;
    return new Promise(function(resolve) {
      var start = Date.now();
      function check() {
        getAvatarManagerAsync().then(function(mgr) {
          if (mgr) { resolve(mgr); return; }
          if (Date.now() - start >= timeoutMs) { resolve(null); return; }
          setTimeout(check, 50);
        });
      }
      check();
    });
  }

  function makeDataUrlFromCanvas(srcCanvas, removeBlack) {
    try {
      var out = document.createElement('canvas');
      out.width = srcCanvas.width || 1;
      out.height = srcCanvas.height || 1;
      var ctx = out.getContext('2d', { willReadFrequently: true });
      if (ctx && srcCanvas) ctx.drawImage(srcCanvas, 0, 0);
      
      // Remove black silhouette pixels if requested (for item-only mode)
      if (removeBlack && ctx) {
        var imgData = ctx.getImageData(0, 0, out.width, out.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 4) {
          var r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          // Make very dark pixels (body silhouette) transparent
          // The black body has RGB close to (0,0,0) or very dark values
          if (a > 0 && r < 25 && g < 25 && b < 25) {
            data[i + 3] = 0; // Make transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
      
      return out.toDataURL('image/png');
    } catch (e) {
      return null;
    }
  }

  function processDataUrlRemoveBlack(dataUrl) {
    return new Promise(function(resolve) {
      try {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          var result = makeDataUrlFromCanvas(canvas, true);
          resolve(result || dataUrl);
        };
        img.onerror = function() { resolve(dataUrl); };
        img.src = dataUrl;
      } catch (e) {
        resolve(dataUrl);
      }
    });
  }

  function readImageSrc(maybeImage) {
    try {
      if (!maybeImage) return null;
      if (typeof maybeImage === 'string') return maybeImage;
      if (typeof maybeImage.src === 'string' && maybeImage.src.length) return maybeImage.src;
    } catch (e) {}
    return null;
  }

  // Native item-only rendering - renders just the clothing sprites without any avatar body
  // This mimics how Nitro's avatar editor renders item thumbnails (AvatarEditorGridPartItem.ts)
  var THUMB_DIRECTIONS = [2, 6, 0, 4, 3, 1];
  var DRAW_ORDER = ['li', 'lh', 'ls', 'lc', 'bd', 'sh', 'lg', 'ch', 'ca', 'cc', 'cp', 'wa', 'rh', 'rs', 'rc', 'hd', 'fc', 'ey', 'hr', 'hrb', 'fa', 'ea', 'ha', 'he', 'ri'];

  // Get PixiJS classes from window (they're exposed by Nitro)
  function getPixiClasses() {
    var w = window;
    // Try to find Container and Sprite classes
    var Container = w.PIXI && w.PIXI.Container;
    var Sprite = w.PIXI && w.PIXI.Sprite;
    
    // Also check for Nitro's proxied versions
    if (!Container) {
      // Search through window properties for NitroContainer/Container
      for (var key in w) {
        try {
          var v = w[key];
          if (v && v.prototype && v.prototype.addChild && v.prototype.destroy) {
            Container = v;
            break;
          }
        } catch (e) {}
      }
    }
    
    return { Container: Container, Sprite: Sprite };
  }

  // Keep recent avatar instances alive to prevent asset unloading/re-fetching
  var _avatarKeepAlive = [];
  function cacheTempAvatar(avatar) {
    if (!avatar) return;
    _avatarKeepAlive.push(avatar);
    // Keep last 50 avatars in memory
    while (_avatarKeepAlive.length > 50) {
      var old = _avatarKeepAlive.shift();
      try { if (old && typeof old.dispose === 'function') old.dispose(); } catch (e) {}
    }
  }

  function renderItemOnlyNative(mgr, partType, partId, colors, direction) {
    return new Promise(function(resolve, reject) {
      try {
        if (!mgr) {
          reject(new Error('No avatar manager'));
          return;
        }

        // Get structure data to find the part set
        var structData = mgr.structureData;
        if (!structData) {
          // Try alternate path
          structData = mgr.structure && mgr.structure.figureData;
        }
        if (!structData) {
          reject(new Error('No structure data available'));
          return;
        }

        // Get the set type for this part category using the proper method
        var setType = null;
        if (typeof structData.getSetType === 'function') {
          setType = structData.getSetType(partType);
        }
        if (!setType) {
          reject(new Error('Set type not found for: ' + partType));
          return;
        }

        // Get the specific part set using the proper method
        var partSet = null;
        var numericPartId = parseInt(partId, 10);
        if (typeof setType.getPartSet === 'function') {
          partSet = setType.getPartSet(numericPartId);
        }

        if (!partSet) {
          reject(new Error('Part set not found: ' + partType + '-' + partId));
          return;
        }

        // Get the palette for this part type to convert color IDs to RGB
        var paletteId = setType.paletteID;
        var palette = null;
        if (paletteId !== undefined && typeof structData.getPalette === 'function') {
          palette = structData.getPalette(paletteId);
        }

        // Helper function to convert color ID to RGB
        function getColorRgb(colorId) {
          if (!palette) return null;
          var partColor = null;
          if (typeof palette.getColor === 'function') {
            partColor = palette.getColor(colorId);
          }
          if (partColor && typeof partColor.rgb === 'number') {
            return partColor.rgb;
          }
          return null;
        }

        var parts = partSet.parts;
        if (!parts || !parts.length) {
          reject(new Error('No parts in part set'));
          return;
        }

        // Sort parts by draw order
        var sortedParts = parts.slice().sort(function(a, b) {
          var aIdx = DRAW_ORDER.indexOf(a.type);
          var bIdx = DRAW_ORDER.indexOf(b.type);
          if (aIdx < 0) aIdx = 999;
          if (bIdx < 0) bIdx = 999;
          if (aIdx !== bIdx) return aIdx - bIdx;
          return (a.index || 0) - (b.index || 0);
        });

        // First attempt: try to render with already-loaded assets
        var spriteInfos = collectSpriteInfos();
        
        if (spriteInfos.length > 0) {
          // Assets already loaded - render immediately
          doRender(spriteInfos);
          return;
        }
        
        // Assets not loaded - trigger download and wait
        var tempFigure = partType + '-' + partId;
        if (colors && colors.length > 0) {
          tempFigure += '-' + colors.join('.');
        }
        
        var downloadComplete = false;
        var tempAvatar = null;
        var tempListener = {
          resetFigure: function() {
            downloadComplete = true;
          }
        };
        
        try {
          if (typeof mgr.createAvatarImage === 'function') {
            tempAvatar = mgr.createAvatarImage(tempFigure, null, 'M', tempListener, null);
          }
        } catch (e) {
          downloadComplete = true;
        }
        
        // Wait for download with shorter timeout for thumbnails
        var waitStart = Date.now();
        var maxWait = 1500;
        var checkInterval = setInterval(function() {
          if (downloadComplete || Date.now() - waitStart > maxWait) {
            clearInterval(checkInterval);
            
            // Cache temp avatar instead of disposing to prevent asset unloading
            if (tempAvatar) {
              cacheTempAvatar(tempAvatar);
            }
            
            // Try again after download
            spriteInfos = collectSpriteInfos();
            if (spriteInfos.length > 0) {
              doRender(spriteInfos);
            } else {
              reject(new Error('No sprites found after download for ' + partType + '-' + partId));
            }
          }
        }, 30);
        
        function collectSpriteInfos() {
          var infos = [];
          for (var p = 0; p < sortedParts.length; p++) {
            var part = sortedParts[p];
            if (!part) continue;

            var asset = null;
            var foundDir = -1;

            for (var d = 0; d < THUMB_DIRECTIONS.length; d++) {
              var tryDir = (direction !== undefined && direction !== null) ? direction : THUMB_DIRECTIONS[d];
              var assetName = 'h_std_' + part.type + '_' + part.id + '_' + tryDir + '_0';
              
              if (typeof mgr.getAssetByName === 'function') {
                asset = mgr.getAssetByName(assetName);
              }
              
              if (asset && asset.texture) {
                foundDir = tryDir;
                break;
              }
              
              if (direction !== undefined && direction !== null) break;
            }

            if (!asset || !asset.texture) continue;

            var tintColor = null;
            if (part.colorLayerIndex > 0 && colors && colors.length >= part.colorLayerIndex) {
              var colorId = colors[part.colorLayerIndex - 1];
              if (colorId !== undefined && colorId !== null) {
                tintColor = getColorRgb(colorId);
              }
            }

            infos.push({
              asset: asset,
              texture: asset.texture,
              x: asset.offsetX || asset.x || 0,
              y: asset.offsetY || asset.y || 0,
              flipH: asset.flipH || false,
              flipV: asset.flipV || false,
              tint: tintColor
            });
          }
          return infos;
        }
        
        function doRender(spriteInfos) {
          // Try to use PixiJS for rendering (native approach)
          // Look for TextureUtils from Nitro or PixiJS
          var textureUtils = window.TextureUtils;
        
        // Also try to find it in the module exports
        if (!textureUtils) {
          try {
            var w = window;
            for (var key in w) {
              try {
                var val = w[key];
                if (val && typeof val.generateImageUrl === 'function') {
                  textureUtils = val;
                  break;
                }
              } catch (e) {}
            }
          } catch (e) {}
        }
        
        // Create a container with sprites using PixiJS
        var pixi = getPixiClasses();
        if (pixi.Container && pixi.Sprite) {
          try {
            var container = new pixi.Container();
            
            for (var s = 0; s < spriteInfos.length; s++) {
              var info = spriteInfos[s];
              var sprite = new pixi.Sprite(info.texture);
              sprite.position.set(info.x, info.y);
              if (info.tint) sprite.tint = info.tint;
              container.addChild(sprite);
            }
            
            // Try TextureUtils.generateImageUrl first
            if (textureUtils && typeof textureUtils.generateImageUrl === 'function') {
              var url = textureUtils.generateImageUrl(container);
              container.destroy({ children: true });
              resolve(url);
              return;
            }
            
            // Try using the PixiJS Extract plugin directly
            var renderer = null;
            if (window.PIXI && window.PIXI.Renderer && window.PIXI.Renderer.instance) {
              renderer = window.PIXI.Renderer.instance;
            }
            // Try PixiApplicationProxy
            if (!renderer) {
              try {
                var pixiProxy = window.PixiApplicationProxy;
                if (pixiProxy && pixiProxy.instance && pixiProxy.instance.renderer) {
                  renderer = pixiProxy.instance.renderer;
                }
              } catch (e) {}
            }
            // Search for renderer instance
            if (!renderer) {
              try {
                var w = window;
                for (var key in w) {
                  if (key.toLowerCase().indexOf('pixi') >= 0 || key.toLowerCase().indexOf('app') >= 0) {
                    try {
                      var v = w[key];
                      if (v && v.renderer && v.renderer.plugins && v.renderer.plugins.extract) {
                        renderer = v.renderer;
                        break;
                      }
                    } catch (e) {}
                  }
                }
              } catch (e) {}
            }
            
            if (renderer && renderer.plugins && renderer.plugins.extract) {
              var extractor = renderer.plugins.extract;
              if (typeof extractor.base64 === 'function') {
                var dataUrl = extractor.base64(container);
                container.destroy({ children: true });
                resolve(dataUrl);
                return;
              }
            }
            
            // Container created but couldn't extract - will fall through to canvas
            container.destroy({ children: true });
          } catch (pixiErr) {
            // Fall through to canvas approach
          }
        }

        // Fallback: Manual canvas rendering
        // Calculate bounds
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var b = 0; b < spriteInfos.length; b++) {
          var si = spriteInfos[b];
          var tw = si.texture && si.texture.width ? si.texture.width : 64;
          var th = si.texture && si.texture.height ? si.texture.height : 64;
          if (si.x < minX) minX = si.x;
          if (si.y < minY) minY = si.y;
          if (si.x + tw > maxX) maxX = si.x + tw;
          if (si.y + th > maxY) maxY = si.y + th;
        }
        
        // Handle edge case where no valid bounds were calculated
        if (minX === Infinity) minX = 0;
        if (minY === Infinity) minY = 0;
        if (maxX === -Infinity) maxX = 64;
        if (maxY === -Infinity) maxY = 64;

        var canvasW = Math.max(1, maxX - minX);
        var canvasH = Math.max(1, maxY - minY);
        var canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        var ctx = canvas.getContext('2d', { willReadFrequently: true });

        var pending = spriteInfos.length;
        var drawnSprites = [];

        spriteInfos.forEach(function(info, idx) {
          // Try asset.getImageUrl() first (uses TextureUtils internally)
          var assetUrl = null;
          if (info.asset && typeof info.asset.getImageUrl === 'function') {
            try {
              assetUrl = info.asset.getImageUrl();
            } catch (e) {}
          }
          
          if (assetUrl) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
              drawnSprites.push({ img: img, info: info, order: idx });
              pending--;
              if (pending === 0) finishDrawing();
           
            };
            img.onerror = function() {
              pending--;
              if (pending === 0) finishDrawing();
            };
            img.src = assetUrl;
          } else {
            // Fallback to texture extraction
            extractTextureToImage(info.texture, function(extractedImg) {
              if (extractedImg) {
                drawnSprites.push({ img: extractedImg, info: info, order: idx });
              }
              pending--;
              if (pending === 0) finishDrawing();
            });
          }
        });

        function finishDrawing() {
          // Sort and draw
          drawnSprites.sort(function(a, b) { return a.order - b.order; });
          for (var d = 0; d < drawnSprites.length; d++) {
            var ds = drawnSprites[d];
            var dx = ds.info.x - minX;
            var dy = ds.info.y - minY;
            try {
              // Handle flip
              if (ds.info.flipH || ds.info.flipV) {
                ctx.save();
                ctx.translate(ds.info.flipH ? dx + ds.img.width : dx, ds.info.flipV ? dy + ds.img.height : dy);
                ctx.scale(ds.info.flipH ? -1 : 1, ds.info.flipV ? -1 : 1);
                ctx.drawImage(ds.img, 0, 0);
                ctx.restore();
              } else {
                ctx.drawImage(ds.img, dx, dy);
              }
              
              // Apply tint via multiply
              if (ds.info.tint && ds.info.tint !== 0xFFFFFF) {
                applyTintToRegion(ctx, dx, dy, ds.img.width, ds.img.height, ds.info.tint);
              }
            } catch (e) {}
          }
          resolve(canvas.toDataURL('image/png'));
        }
        } // end doRender
      } catch (e) {
        reject(e);
      }
    });
  }

  function extractTextureToImage(texture, callback) {
    try {
      // Try to get source directly
      var baseTexture = texture.baseTexture || texture.source || texture;
      var resource = baseTexture.resource || baseTexture;
      var source = resource.source || resource.data || resource;
      
      if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
        // Handle frame/region if present
        if (texture.frame && texture.frame.width && texture.frame.height) {
          var frameCanvas = document.createElement('canvas');
          frameCanvas.width = texture.frame.width;
          frameCanvas.height = texture.frame.height;
          var fCtx = frameCanvas.getContext('2d', { willReadFrequently: true });
          fCtx.drawImage(source, texture.frame.x || 0, texture.frame.y || 0, 
                         texture.frame.width, texture.frame.height, 0, 0, 
                         texture.frame.width, texture.frame.height);
          callback(frameCanvas);
        } else {
          callback(source);
        }
        return;
      }
      
      // Try to render texture using its method
      if (typeof texture.castToBaseTexture === 'function') {
        var bt = texture.castToBaseTexture();
        if (bt && bt.resource && bt.resource.source) {
          callback(bt.resource.source);
          return;
        }
      }
      
      callback(null);
    } catch (e) {
      callback(null);
    }
  }

  function applyTintToRegion(ctx, x, y, w, h, tintColor) {
    try {
      var imgData = ctx.getImageData(x, y, w, h);
      var data = imgData.data;
      var r = (tintColor >> 16) & 0xFF;
      var g = (tintColor >> 8) & 0xFF;
      var b = tintColor & 0xFF;
      
      for (var i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
          data[i] = Math.round(data[i] * r / 255);
          data[i + 1] = Math.round(data[i + 1] * g / 255);
          data[i + 2] = Math.round(data[i + 2] * b / 255);
        }
      }
      ctx.putImageData(imgData, x, y);
    } catch (e) {}
  }

  function renderOnce(payload, timeoutMs) {
    timeoutMs = timeoutMs || 1500;
    return new Promise(function(resolve, reject) {
      loadVendorApi().then(function(vendorApi) {
        waitForAvatarManager(Math.max(1500, timeoutMs)).then(function(mgr) {
          if (!mgr || typeof mgr.createAvatarImage !== 'function') {
            var flags = [
              'entry:' + (!!getEntryModuleUrl()),
              'vendor:' + (!!vendorApi),
              'vendorHs:' + (!!(vendorApi && vendorApi.hs)),
              'At:' + (typeof window.At),
              'Te:' + (typeof window.Te),
              'hs:' + (!!window.hs),
              'Nitro:' + (!!window.Nitro),
              'GetAvatarRenderManager:' + (typeof window.GetAvatarRenderManager)
            ].join(', ');
            reject(new Error('Avatar renderer not available (' + flags + ')'));
            return;
          }

          // Check if this is a native item-only render request
          var itemOnly = payload.itemOnly === true;
          var partType = payload.partType;
          var partId = payload.partId;
          var colors = payload.colors;

          if (itemOnly && partType && partId !== undefined && partId !== null) {
            // Use native item-only rendering (no avatar body)
            renderItemOnlyNative(mgr, partType, partId, colors, payload.direction).then(function(dataUrl) {
              resolve(dataUrl);
            }).catch(function(err) {
              // Fallback to avatar render with black removal if native fails
              console.warn('Native item render failed, falling back:', err);
              doAvatarRender();
            });
            return;
          }

          // Standard avatar rendering
          doAvatarRender();

          function doAvatarRender() {
            var finished = false;
            var rafId = 0;
            var avatarImage = null;
            var timeoutId = 0;
            var attemptCount = 0;
            var maxAttempts = 60; // ~1 second of attempts before giving up on waiting
            var figure = payload.figure;
            var gender = payload.gender;
            var direction = payload.direction;
            var scale = payload.scale;
            var setType = payload.setType;

            var resolvedSetType = resolveSetTypeConst(vendorApi, setType);
            var resolvedScale = resolveScaleConst(vendorApi, scale);

            var listener = { 
              resetFigure: function() { 
                // Assets loaded - immediately try to resolve
                tryResolve(); 
              } 
            };

            function done(err, dataUrl) {
              if (finished) return;
              finished = true;
              try { if (timeoutId) clearTimeout(timeoutId); } catch (e) {}
              try { if (rafId) cancelAnimationFrame(rafId); } catch (e) {}
              try { if (avatarImage && typeof avatarImage.dispose === 'function') avatarImage.dispose(); } catch (e) {}
              try { if (mgr && typeof mgr.removeListener === 'function') mgr.removeListener(listener); } catch (e) {}
              if (err) reject(err);
              else resolve(dataUrl);
            }

            function tryResolve() {
              if (finished) return;
              attemptCount++;
              
              try {
                if (!avatarImage) { rafId = requestAnimationFrame(tryResolve); return; }
                var canvas = null;
                if (typeof avatarImage.getCroppedImage === 'function') {
                  var cropped = avatarImage.getCroppedImage(resolvedSetType);
                  var croppedSrc = readImageSrc(cropped);
                  if (croppedSrc) { done(null, croppedSrc); return; }
                  canvas = cropped;
                } else if (typeof avatarImage.getImage === 'function') {
                  var img = avatarImage.getImage();
                  var imgSrc = readImageSrc(img);
                  if (imgSrc) { done(null, imgSrc); return; }
                  canvas = img;
                }
                if (canvas && canvas.width > 0 && canvas.height > 0) {
                  var url = makeDataUrlFromCanvas(canvas, false);
                  if (url) { done(null, url); return; }
                }
              } catch (e) {}
              
              // Keep trying but don't block forever
              rafId = requestAnimationFrame(tryResolve);
            }

            try {
              avatarImage = mgr.createAvatarImage(figure, resolvedScale, gender, listener, null);
              try {
                if (avatarImage && typeof avatarImage.setDirection === 'function') {
                  avatarImage.setDirection(resolvedSetType, direction);
                }
              } catch (e) {}
            } catch (e) {
              done(e);
              return;
            }

            timeoutId = setTimeout(function() { done(new Error('Render timeout')); }, timeoutMs);
            tryResolve();
          } // end doAvatarRender

        });
      }).catch(function(e) { reject(e); });
    });
  }

  window.addEventListener('message', function(event) {
    var msg = event && event.data;
    if (!msg) return;
    if (event.origin !== ORIGIN) return;
    
    // Handle asset preloading request with confirmation callback
    if (msg.__kwRender && msg.type === 'KW_PRELOAD_REQUEST') {
      var requestId = msg.requestId;
      var figure = msg.figure;
      var gender = msg.gender || 'M';
      
      loadVendorApi().then(function(vendorApi) {
        waitForAvatarManager(1500).then(function(mgr) {
          if (!mgr || typeof mgr.createAvatarImage !== 'function') {
            // Send completion even if failed
            if (event.source) {
              event.source.postMessage({ __kwRender: true, type: 'KW_PRELOAD_COMPLETE', requestId: requestId }, ORIGIN);
            }
            return;
          }
          
          var tempAvatar = null;
          var assetsLoaded = false;
          var listener = { 
            resetFigure: function() {
              assetsLoaded = true;
              // Send confirmation when assets are loaded
              if (event.source) {
                event.source.postMessage({ __kwRender: true, type: 'KW_PRELOAD_COMPLETE', requestId: requestId }, ORIGIN);
              }
              // Cache avatar to prevent asset unloading
              cacheTempAvatar(tempAvatar);
            }
          };
          
          try {
            // Create invisible temp avatar to force asset downloads
            tempAvatar = mgr.createAvatarImage(figure, null, gender, listener, null);
            
            // Fallback: send completion after timeout if resetFigure never fires
            setTimeout(function() {
              if (!assetsLoaded) {
                if (event.source) {
                  event.source.postMessage({ __kwRender: true, type: 'KW_PRELOAD_COMPLETE', requestId: requestId }, ORIGIN);
                }
                cacheTempAvatar(tempAvatar);
              }
            }, 1500);
          } catch (e) {
            // Send completion even if failed
            if (event.source) {
              event.source.postMessage({ __kwRender: true, type: 'KW_PRELOAD_COMPLETE', requestId: requestId }, ORIGIN);
            }
          }
        }).catch(function() {
          if (event.source) {
            event.source.postMessage({ __kwRender: true, type: 'KW_PRELOAD_COMPLETE', requestId: requestId }, ORIGIN);
          }
        });
      }).catch(function() {
        if (event.source) {
          event.source.postMessage({ __kwRender: true, type: 'KW_PRELOAD_COMPLETE', requestId: requestId }, ORIGIN);
        }
      });
      return;
    }
    
    // Handle render request
    if (!msg.__kwRender) return;
    if (msg.type !== 'KW_RENDER_REQUEST') return;

    var requestId = msg.requestId;
    var payload = msg.payload || {};

    renderOnce(payload).then(function(dataUrl) {
      if (event.source) event.source.postMessage({ __kwRender: true, type: 'KW_RENDER_RESULT', requestId: requestId, ok: true, dataUrl: dataUrl }, ORIGIN);
    }).catch(function(e) {
      var errMsg = e && e.message ? e.message : String(e);
      if (event.source) event.source.postMessage({ __kwRender: true, type: 'KW_RENDER_RESULT', requestId: requestId, ok: false, error: errMsg }, ORIGIN);
    });
  });
})();`;

      (doc.head || doc.documentElement || doc.body).appendChild(script);
      this._installed = true;
    }

    async renderAvatar({ figure, gender, direction, setType, itemOnly = false, partType = null, partId = null, colors = null }) {
      await this.ensureInstalled();
      const scale = 'h';
      const payload = {
        figure,
        gender,
        direction,
        scale,
        setType,
        itemOnly,
        partType,
        partId,
        colors,
      };
      const key = JSON.stringify(payload);
      const cached = this._cacheGet(key);
      if (cached) return cached;

      const { win } = await this._waitForIframeDoc();
      const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const origin = location.origin;

      const promise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this._pending.delete(requestId);
          reject(new Error('Render request timeout'));
        }, 2500);
        this._pending.set(requestId, { resolve, reject, timeoutId });
      });

      win.postMessage({ __kwRender: true, type: 'KW_RENDER_REQUEST', requestId, payload }, origin);
      const dataUrl = await promise;
      this._cacheSet(key, dataUrl);
      return dataUrl;
    }
    
    async preloadFigureAssets(figure, gender) {
      await this.ensureInstalled();
      const { win } = await this._waitForIframeDoc();
      const requestId = `preload-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const origin = location.origin;
      
      const promise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this._preloadPending.delete(requestId);
          resolve(); // Don't reject on timeout, just resolve anyway
        }, 2000);
        this._preloadPending.set(requestId, { resolve, reject, timeoutId });
      });
      
      win.postMessage({ __kwRender: true, type: 'KW_PRELOAD_REQUEST', requestId, figure, gender }, origin);
      await promise;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WARDROBE CLASS - Lives in parent window
  // ═══════════════════════════════════════════════════════════════
  class KuplaWardrobe {
    constructor() {
      this.dataManager = new FigureDataManager();
      this.renderer = new NitroRenderBridge();
      this.window = null;
      this.currentFigure = '';
      this.currentGender = 'M';
      this.currentDirection = 2;
      this.activeCategory = 'hd';

      this._previewReqId = 0;
      this._itemsReqId = 0;
      
      this.injectStyles();
    }
    
    injectStyles() {
      if (document.getElementById('kw-styles')) return;
      const style = document.createElement('style');
      style.id = 'kw-styles';
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
    
    async open(figure = '', gender = 'M') {
      this.currentFigure = figure || this.getDefaultFigure(gender);
      this.currentGender = gender;
      this.currentDirection = 2;
      
      if (!this.dataManager.loaded) {
        await this.dataManager.load();
      }
      
      if (!this.window) {
        this.createWindow();
      }
      
      this.window.style.display = 'flex';
      this.updateAll();
      log.info('Wardrobe opened');
    }
    
    close() {
      if (this.window) {
        this.window.style.display = 'none';
      }
      log.info('Wardrobe closed');
    }
    
    toggle() {
      if (this.window && this.window.style.display !== 'none') {
        this.close();
      } else {
        this.open();
      }
    }
    
    getDefaultFigure(gender) {
      return gender === 'F' 
        ? 'hd-600-1.hr-515-33.ch-635-70.lg-716-66.sh-735-68'
        : 'hd-180-7.hr-100-61.ch-215-66.lg-270-79.sh-305-62';
    }

    _getSetTypeForCategory(categoryId) {
      const headCats = new Set(['hr', 'ha', 'he', 'ea', 'fa']);
      return headCats.has(categoryId) ? 'head' : 'full';
    }
    
    createWindow() {
      const win = document.createElement('div');
      win.className = 'kw-window';
      win.innerHTML = `
        <div class="kw-header">
          <h2 class="kw-title">👔 Vaatekaappi <span class="kw-badge">PRO</span></h2>
          <button class="kw-close">✕</button>
        </div>
        <div class="kw-body">
          <div class="kw-preview">
            <div class="kw-avatar-box"><img src="" alt="Avatar"></div>
            <div class="kw-gender-row">
              <button class="kw-gender-btn" data-gender="M"><div class="nitro-avatar-editor-spritesheet gender-male"></div></button>
              <button class="kw-gender-btn" data-gender="F"><div class="nitro-avatar-editor-spritesheet gender-female"></div></button>
            </div>
            <div class="kw-rotate-row">
              <button class="kw-rotate-btn" data-dir="1">◀</button>
              <button class="kw-rotate-btn" data-dir="-1">▶</button>
            </div>
            <div class="kw-action-col">
              <button class="kw-action-btn primary" data-action="random">🎲 Satunnainen</button>
              <button class="kw-action-btn" data-action="reset">↺ Nollaa</button>
            </div>
          </div>
          <div class="kw-editor">
            <div class="kw-categories"></div>
            <div class="kw-main-area">
              <div class="kw-items"><div class="kw-loading">Ladataan...</div></div>
              <div class="kw-colors"><div class="kw-loading">...</div></div>
            </div>
          </div>
        </div>
        <div class="kw-footer">
          <div class="kw-figure-input">
            <input type="text" placeholder="Figure string...">
          </div>
          <button class="kw-btn kw-btn-cancel">Peruuta</button>
          <button class="kw-btn kw-btn-save">💾 Tallenna</button>
        </div>
      `;
      
      document.body.appendChild(win);
      this.window = win;
      
      this.bindEvents();
      this.makeDraggable();
      this.renderCategories();
    }
    
    bindEvents() {
      const win = this.window;
      
      win.querySelector('.kw-close').onclick = () => this.close();
      win.querySelector('.kw-btn-cancel').onclick = () => this.close();
      win.querySelector('.kw-btn-save').onclick = () => this.save();
      
      win.querySelectorAll('.kw-gender-btn').forEach(btn => {
        btn.onclick = () => this.setGender(btn.dataset.gender);
      });
      
      win.querySelectorAll('.kw-rotate-btn').forEach(btn => {
        btn.onclick = () => this.rotate(parseInt(btn.dataset.dir));
      });
      
      win.querySelector('[data-action="random"]').onclick = () => this.randomize();
      win.querySelector('[data-action="reset"]').onclick = () => this.reset();
      
      const input = win.querySelector('.kw-figure-input input');
      input.onchange = () => {
        this.currentFigure = input.value;
        this.updateAll();
      };
      
      // ESC to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.window?.style.display !== 'none') {
          this.close();
        }
      });
    }
    
    makeDraggable() {
      const win = this.window;
      const header = win.querySelector('.kw-header');
      let isDragging = false, startX, startY, initialX, initialY;
      
      header.onmousedown = (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = win.offsetLeft;
        initialY = win.offsetTop;
        e.preventDefault();
      };
      
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        win.style.left = Math.max(0, initialX + dx) + 'px';
        win.style.top = Math.max(0, initialY + dy) + 'px';
      });
      
      document.addEventListener('mouseup', () => { isDragging = false; });
    }
    
    renderCategories() {
      const container = this.window.querySelector('.kw-categories');
      container.innerHTML = CATEGORIES.map(cat => `
        <button class="kw-cat-btn" data-cat="${cat.id}" title="${cat.name}">
          <div class="nitro-avatar-editor-spritesheet ${cat.iconClass}"></div>
        </button>
      `).join('');
      
      container.querySelectorAll('.kw-cat-btn').forEach(btn => {
        btn.onclick = () => {
          this.activeCategory = btn.dataset.cat;
          this.updateCategories();
          this.updateItems();
          this.updateColors();
        };
      });
    }
    
    async updateAll() {
      // CRITICAL: Avatar preview must complete first before any thumbnail rendering
      await this.updatePreview();
      this.updateGender();
      this.updateCategories();
      this.updateItems();
      this.updateColors();
      this.updateFigureInput();
    }
    
    async updatePreview() {
      const img = this.window?.querySelector('.kw-avatar-box img');
      if (!img) return;
      const reqId = ++this._previewReqId;
      
      // Cancel any pending thumbnail renders to prioritize avatar preview
      this._pauseThumbnails = true;
      
      try {
        const dataUrl = await this.renderer.renderAvatar({
          figure: this.currentFigure,
          gender: this.currentGender,
          direction: this.currentDirection,
          setType: 'full',
        });
        
        if (reqId !== this._previewReqId) return;
        img.src = dataUrl;
        img.alt = 'Avatar';
      } catch (err) {
        if (reqId !== this._previewReqId) return;
        log.warn('Preview render failed:', err);
      } finally {
        // Resume thumbnail rendering after avatar is done
        this._pauseThumbnails = false;
      }
    }
    
    updateGender() {
      this.window?.querySelectorAll('.kw-gender-btn').forEach(btn => {
        const isActive = btn.dataset.gender === this.currentGender;
        btn.classList.toggle('active', isActive);
        const icon = btn.querySelector('.nitro-avatar-editor-spritesheet');
        if (icon) icon.classList.toggle('selected', isActive);
      });
    }
    
    updateCategories() {
      this.window?.querySelectorAll('.kw-cat-btn').forEach(btn => {
        const isActive = btn.dataset.cat === this.activeCategory;
        btn.classList.toggle('active', isActive);
        const icon = btn.querySelector('.nitro-avatar-editor-spritesheet');
        if (icon) icon.classList.toggle('selected', isActive);
      });
    }
    
    updateItems() {
      const container = this.window?.querySelector('.kw-items');
      if (!container) return;

      const myReqId = ++this._itemsReqId;
      
      const sets = this.dataManager.getPartSets(this.activeCategory, this.currentGender);
      const currentPart = FigureParser.getPart(this.currentFigure, this.activeCategory);
      const currentId = currentPart ? currentPart.id : -1;
      const category = CATEGORIES.find(c => c.id === this.activeCategory);
      const isMandatory = category?.mandatory;
      const setType = this._getSetTypeForCategory(this.activeCategory);
      
      let html = '';
      if (!isMandatory) {
        html += `<div class="kw-item clear${currentId === -1 ? ' selected' : ''}" data-id="-1"></div>`;
      }
      
      sets.forEach(set => {
        const sel = currentId === parseInt(set.id) ? ' selected' : '';
        html += `<div class="kw-item${sel}" data-id="${set.id}"><img alt="${set.id}"><div class="kw-item-label">${set.id}</div></div>`;
      });
      
      container.innerHTML = html;
      
      container.querySelectorAll('.kw-item').forEach(item => {
        item.onclick = () => this.selectItem(parseInt(item.dataset.id));
      });

      // Render thumbnails (async)
      this._renderThumbnailsForCurrentCategory({ container, sets, setType, reqId: myReqId }).catch((e) => {
        if (myReqId !== this._itemsReqId) return;
        log.warn('Thumbnail rendering failed:', e);
      });
      
      // Scroll selected into view
      const selected = container.querySelector('.kw-item.selected');
      if (selected) selected.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }

    async _renderThumbnailsForCurrentCategory({ container, sets, setType, reqId }) {
      const currentPart = FigureParser.getPart(this.currentFigure, this.activeCategory);
      const colors = currentPart?.colors || [0, 0];
      const partType = this.activeCategory;

      // Check cache first
      if (!this._itemRenderCache) this._itemRenderCache = {};
      const cacheKey = (id) => `${partType}-${id}-${colors.join('.')}`;

      // Find selected item to prioritize it
      const selectedPart = FigureParser.getPart(this.currentFigure, this.activeCategory);
      const selectedId = selectedPart ? selectedPart.id : -1;

      // Build tasks with priority - selected item first, then nearby items
      const tasks = [];
      const selectedIdx = sets.findIndex(s => parseInt(s.id) === selectedId);
      
      // Add selected item first
      if (selectedIdx >= 0) {
        const set = sets[selectedIdx];
        tasks.push({ 
          id: parseInt(set.id), 
          partType, partId: parseInt(set.id),
          colors: colors.slice(), cacheKey: cacheKey(set.id),
          priority: 0
        });
      }
      
      // Add remaining items
      for (let i = 0; i < sets.length; i++) {
        if (i === selectedIdx) continue;
        const set = sets[i];
        // Priority based on distance from selected
        const dist = selectedIdx >= 0 ? Math.abs(i - selectedIdx) : i;
        tasks.push({ 
          id: parseInt(set.id), 
          partType, partId: parseInt(set.id),
          colors: colors.slice(), cacheKey: cacheKey(set.id),
          priority: dist + 1
        });
      }

      // Sort by priority
      tasks.sort((a, b) => a.priority - b.priority);

      const concurrency = 4;
      let index = 0;

      // Helper to wait while paused (avatar preview has priority)
      const waitIfPaused = async () => {
        while (this._pauseThumbnails) {
          await new Promise(r => setTimeout(r, 50));
          if (reqId !== this._itemsReqId) return false;
        }
        return true;
      };

      const runOne = async () => {
        while (index < tasks.length) {
          if (reqId !== this._itemsReqId) return;
          
          // Wait if avatar preview is rendering
          if (!(await waitIfPaused())) return;
          
          const task = tasks[index++];
          const el = container.querySelector(`.kw-item[data-id="${task.id}"] img`);
          if (!el) continue;
          
          // Check cache - instant load
          if (this._itemRenderCache[task.cacheKey]) {
            el.src = this._itemRenderCache[task.cacheKey];
            continue;
          }
          
          try {
            const url = await this.renderer.renderAvatar({
              figure: '',
              gender: this.currentGender,
              direction: 2,
              setType: 'full',
              itemOnly: true,
              partType: task.partType,
              partId: task.partId,
              colors: task.colors,
            });
            if (reqId !== this._itemsReqId) return;
            
            // Cache the result
            this._itemRenderCache[task.cacheKey] = url;
            el.src = url;
          } catch (_) {
            // Keep empty; user still can click
          }
          
          // Small yield to keep UI responsive
          if (index % 8 === 0) {
            await new Promise(r => setTimeout(r, 0));
          }
        }
      };

      const workers = [];
      for (let i = 0; i < concurrency; i++) workers.push(runOne());
      await Promise.all(workers);
    }
    
    updateColors() {
      const container = this.window?.querySelector('.kw-colors');
      if (!container) return;
      
      const colors = this.dataManager.getColors(this.activeCategory);
      const currentPart = FigureParser.getPart(this.currentFigure, this.activeCategory);
      const currentColors = currentPart?.colors || [0, 0];
      
      if (!colors.length) {
        container.innerHTML = '<div class="kw-loading">Ei värejä</div>';
        return;
      }
      
      let html = '';
      for (let i = 0; i < 2; i++) {
        const selId = currentColors[i] ?? 0;
        html += `<div class="kw-color-col">
          <div class="kw-color-label">${i === 0 ? 'Pääväri' : 'Lisäväri'}</div>
          <div class="kw-color-grid">`;
        colors.forEach(c => {
          const hex = c.hexCode.startsWith('#') ? c.hexCode : '#' + c.hexCode;
          const sel = c.id === selId ? ' selected' : '';
          html += `<div class="kw-color${sel}" style="background:${hex}" data-id="${c.id}" data-idx="${i}" title="#${c.hexCode}"></div>`;
        });
        html += '</div></div>';
      }
      
      container.innerHTML = html;
      
      container.querySelectorAll('.kw-color').forEach(el => {
        el.onclick = () => this.selectColor(parseInt(el.dataset.id), parseInt(el.dataset.idx));
      });
    }
    
    updateFigureInput() {
      const input = this.window?.querySelector('.kw-figure-input input');
      if (input) input.value = this.currentFigure;
    }
    
    setGender(gender) {
      if (this.currentGender === gender) return;
      this.currentGender = gender;
      this.updateAll();
    }
    
    async rotate(delta) {
      this.currentDirection = (this.currentDirection + delta + 8) % 8;
      await this.updatePreview();
    }
    
    async selectItem(itemId) {
      const currentPart = FigureParser.getPart(this.currentFigure, this.activeCategory);
      const colors = currentPart?.colors || [0, 0];
      this.currentFigure = FigureParser.updatePart(this.currentFigure, this.activeCategory, itemId, colors);
      
      // Preload assets for the newly selected item before rendering
      await this.renderer.preloadFigureAssets(this.currentFigure, this.currentGender);
      
      await this.updateAll();
    }
    
    async selectColor(colorId, colorIndex) {
      const currentPart = FigureParser.getPart(this.currentFigure, this.activeCategory);
      if (!currentPart) return;
      const colors = [...(currentPart.colors || [0, 0])];
      colors[colorIndex] = colorId;
      this.currentFigure = FigureParser.updateColors(this.currentFigure, this.activeCategory, colors);
      // Avatar preview must complete before thumbnail re-rendering
      await this.updatePreview();
      this.updateColors();
      this.updateItems();
    }
    
    async randomize() {
      const mandatory = ['hd', 'ch', 'lg', 'sh'];
      const optional = ['hr', 'ha', 'he', 'ea', 'fa', 'cc', 'cp', 'ca', 'wa'];
      const parts = [];
      
      for (const type of mandatory) {
        const sets = this.dataManager.getPartSets(type, this.currentGender);
        if (sets.length) {
          const set = sets[Math.floor(Math.random() * sets.length)];
          const colors = this.dataManager.getColors(type);
          const color = colors.length ? colors[Math.floor(Math.random() * colors.length)].id : 0;
          parts.push(`${type}-${set.id}-${color}`);
        }
      }
      
      for (const type of optional) {
        if (Math.random() > 0.5) continue;
        const sets = this.dataManager.getPartSets(type, this.currentGender);
        if (sets.length) {
          const set = sets[Math.floor(Math.random() * sets.length)];
          const colors = this.dataManager.getColors(type);
          const color = colors.length ? colors[Math.floor(Math.random() * colors.length)].id : 0;
          parts.push(`${type}-${set.id}-${color}`);
        }
      }
      
      this.currentFigure = parts.join('.');
      
      // CRITICAL: Preload all assets for randomized parts before rendering
      await this.renderer.preloadFigureAssets(this.currentFigure, this.currentGender);
      
      await this.updateAll();
    }
    
    reset() {
      this.currentFigure = this.getDefaultFigure(this.currentGender);
      this.updateAll();
    }
    
    save() {
      log.info('Saving: gender=' + this.currentGender + ', figure=' + this.currentFigure);
      
      // Send via kuplafix packets
      if (window.kuplafix?.packets) {
        try {
          window.kuplafix.packets.send(2730, 
            { type: 'String', value: this.currentGender },
            { type: 'String', value: this.currentFigure }
          );
          log.info('Outfit saved');
        } catch (err) {
          log.error('Save failed:', err);
        }
      } else {
        log.warn('kuplafix.packets not available');
      }
      
      this.close();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════
  function createFloatingButton(wardrobe) {
    if (document.getElementById('kw-float-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'kw-float-btn';
    btn.innerHTML = '👔';
    btn.title = 'Avaa Vaatekaappi';
    btn.onclick = () => wardrobe.toggle();
    
    document.body.appendChild(btn);
    log.info('Float button added');
  }
  
  function waitForKuplafix(timeout = 30000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (window.kuplafix) return resolve(window.kuplafix);
        if (Date.now() - start > timeout) return reject(new Error('kuplafix not found'));
        setTimeout(check, 100);
      };
      check();
    });
  }
  
  async function init() {
    log.info(`${SCRIPT_NAME} v${SCRIPT_VERSION} loading...`);
    
    try {
      await waitForKuplafix();
      log.info('kuplafix found');
      
      const wardrobe = new KuplaWardrobe();
      window.kuplaWardrobe = wardrobe;
      
      createFloatingButton(wardrobe);
      
      log.info('Ready! Click 👔 button to open');
      
    } catch (err) {
      log.error('Init failed:', err);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

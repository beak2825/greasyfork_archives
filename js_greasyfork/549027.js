// ==UserScript==
// @name         FlatMMO Remote Bank Viewer
// @namespace    com.pizza1337.flatmmo.remotebank
// @version      1.0.1
// @description  View bank contents remotely
// @author       Pizza1337
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549027/FlatMMO%20Remote%20Bank%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/549027/FlatMMO%20Remote%20Bank%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Fixed bank panel height when in bank view (change if you want)
  const BANK_HEIGHT_PX = 500;

  class RemoteBankViewerPlugin extends FlatMMOPlusPlugin {
    constructor() {
      super('remote-bank-viewer', {
        about: {
          name: GM_info.script.name,
          version: GM_info.script.version,
          author: GM_info.script.author,
          description: GM_info.script.description
        }
        // Always on: no FlatMMOPlus config entries
      });

      // State
      this.isChangingView = false;
      this.stickyBank = false;           // when true, hold bank view
      this.userForcedInventory = false;  // set when user clicks inventory button
      this.inventoryObserver = null;
      this.stickyObs = null;
      this.restoreTimer = null;
      this._cachedBank = null;

      // Previous container styles for restoring (we no longer replace children)
      this.prevContainerStyles = {
        height: '',
        maxHeight: '',
        overflow: '',
        overflowX: '',
        overflowY: '',
        position: ''
      };

      this.injectStyles();
      this._installCoreHooks();
      this._attachDOMWatchers();
      this._hookInventoryButton();
    }

    /* ===========================
       Styles (overlay approach)
    =========================== */
    injectStyles() {
      if (document.getElementById('rb-overlay-styles')) return;
      const style = document.createElement('style');
      style.id = 'rb-overlay-styles';
      style.textContent = `
        /* Ensure container can host overlay */
        #ui-panel-inventory-content.rb-bank-mode { position: relative !important; }

        /* In bank mode, hide everything except our overlay */
        #ui-panel-inventory-content.rb-bank-mode > :not(#remote-bank-overlay) {
          display: none !important;
        }

        /* Overlay layer to show bank items */
        #remote-bank-overlay {
          position: absolute !important;
          inset: 0 !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          z-index: 5 !important;
          background: transparent;
        }
      `;
      document.head.appendChild(style);
    }

    /* ===========================
       FM+ lifecycle & events
    =========================== */
    onLogin() {
      // If we were in sticky bank before login, re-assert it
      if (this.stickyBank) requestAnimationFrame(() => this.showBankView());
    }

    // No onConfigsChanged (always on)

    onPanelChanged(before, after) {
      // If user explicitly asked for inventory, do NOT re-assert bank
      if (this.userForcedInventory) return;
      if (this.stickyBank && after === 'inventory') {
        requestAnimationFrame(() => this.showBankView());
      }
    }

    onMapChanged() {
      if (this.stickyBank && !this.userForcedInventory) {
        requestAnimationFrame(() => this.showBankView());
      }
    }

    onInventoryChanged() {
      if (this.stickyBank && !this.userForcedInventory) {
        requestAnimationFrame(() => this.showBankView());
      }
    }

    /* ===========================
       Core hooks & observers
    =========================== */
    _installCoreHooks() {
      // Save bank data when the real bank UI closes
      const originalCloseBank = window.close_bank;
      if (typeof originalCloseBank === 'function') {
        window.close_bank = (...args) => {
          this._saveBankContents();
          return originalCloseBank.apply(window, args);
        };
      }
      // ESC also saves if bank is open
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._saveBankContents();
      });

      // Wrap game's refresh_inventory so bank doesn't flicker out while sticky
      this._wrapRefreshInventory();

      // Wrap switch_panels to honor explicit inventory intent (kills sticky)
      this._wrapSwitchPanels();
    }

    _wrapRefreshInventory() {
      if (window.__rb_wrappedRefresh) return;
      const original = window.refresh_inventory;
      if (typeof original !== 'function') {
        setTimeout(() => this._wrapRefreshInventory(), 250);
        return;
      }
      window.refresh_inventory = (...args) => {
        try {
          const content = this._content();
          const inBank = content && content.dataset.viewMode === 'bank';
          if (this.stickyBank && inBank && !this.userForcedInventory) {
            // Swallow redraw attempts while sticky bank is active
            return;
          }
        } catch {}
        return original.apply(window, args);
      };
      window.__rb_wrappedRefresh = true;
    }

    _wrapSwitchPanels() {
      if (window.__rb_wrappedSwitchPanels) return;
      const original = window.switch_panels;
      if (typeof original !== 'function') {
        setTimeout(() => this._wrapSwitchPanels(), 250);
        return;
      }
      window.switch_panels = (...args) => {
        try {
          const target = args?.[0];
          if (target === 'inventory') {
            // User explicitly chose inventory -> disable sticky, mark intent
            this.userForcedInventory = true;
            this.stickyBank = false;
            // Immediately restore inventory view to avoid any lag/flicker
            requestAnimationFrame(() => this.showInventoryView());
          } else {
            // Any other panel change clears the inventory-intent flag
            this.userForcedInventory = false;
          }
        } catch {}
        return original.apply(window, args);
      };
      window.__rb_wrappedSwitchPanels = true;
    }

    _attachDOMWatchers() {
      // Sticky observer — if anything replaces our bank, re-assert it quickly
      this._startStickyObserver();
    }

    _startStickyObserver() {
      const content = this._content();
      if (!content) {
        setTimeout(() => this._startStickyObserver(), 250);
        return;
      }
      if (this.stickyObs) this.stickyObs.disconnect();

      this.stickyObs = new MutationObserver(() => {
        if (this.isChangingView) return;
        if (this.userForcedInventory) return; // user wants inventory → don’t fight it

        if (this.stickyBank) {
          const overlay = this._getOverlay();
          const lostBank =
            content.dataset.viewMode !== 'bank' ||
            !content.classList.contains('rb-bank-mode') ||
            !overlay || overlay.style.display === 'none' ||
            !content.querySelector('#remote-bank-marker');

          if (lostBank) {
            clearTimeout(this.restoreTimer);
            this.restoreTimer = setTimeout(() => {
              if (this.stickyBank && !this.userForcedInventory) {
                requestAnimationFrame(() => this.showBankView());
              }
            }, 0);
          }
        }
      });

      this.stickyObs.observe(content, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-view-mode', 'style', 'class']
      });
    }

    _hookInventoryButton() {
      // Ensure that clicking the UI inventory button ALSO forces inventory mode
      const attach = () => {
        const btn = document.getElementById('ui-button-inventory');
        if (!btn) return;
        if (btn.__rb_hooked) return;
        btn.__rb_hooked = true;
        btn.addEventListener('click', () => {
          this.userForcedInventory = true;
          this.stickyBank = false;
          requestAnimationFrame(() => this.showInventoryView());
        }, true); // capture = true to run before game handler
      };

      // Try now, and keep trying as DOM changes
      attach();
      const obs = new MutationObserver(attach);
      obs.observe(document.body, { childList: true, subtree: true });
    }

    /* ===========================
       Overlay helpers
    =========================== */
    _getOverlay() {
      const content = this._content();
      return content ? content.querySelector('#remote-bank-overlay') : null;
    }

    _ensureOverlay() {
      const content = this._content();
      if (!content) return null;

      let overlay = this._getOverlay();
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'remote-bank-overlay';
        overlay.style.display = 'none';
        content.appendChild(overlay);
      }
      return overlay;
    }

    /* ===========================
       Public actions
    =========================== */
    showBankView() {
      const content = this._content();
      if (!content || this.isChangingView) return;

      this.isChangingView = true;
      this.stickyBank = true;            // lock to bank
      this.userForcedInventory = false;  // clear explicit inventory intent

      // Save container styles the first time we enter bank mode
      if (content.dataset.__rb_saved !== '1') {
        this.prevContainerStyles.height   = content.style.height || '';
        this.prevContainerStyles.maxHeight= content.style.maxHeight || '';
        this.prevContainerStyles.overflow = content.style.overflow || '';
        this.prevContainerStyles.overflowX= content.style.overflowX || '';
        this.prevContainerStyles.overflowY= content.style.overflowY || '';
        this.prevContainerStyles.position = content.style.position || '';
        content.dataset.__rb_saved = '1';
      }

      // Lock container size; overlay scrolls
      content.style.height = `${BANK_HEIGHT_PX}px`;
      content.style.maxHeight = `${BANK_HEIGHT_PX}px`;
      content.style.position = 'relative';
      content.style.overflowY = 'hidden';
      content.style.overflowX = 'hidden';

      // Create / update overlay (do NOT touch original children — listeners survive)
      const overlay = this._ensureOverlay();
      if (overlay) {
        overlay.innerHTML = this._createBankViewHTML() + '<div id="remote-bank-marker" style="display:none"></div>';
        overlay.style.display = 'block';
      }

      // Mark mode and hide everything else via CSS
      content.dataset.viewMode = 'bank';
      content.classList.add('rb-bank-mode');

      this._updateButtons('bank');

      setTimeout(() => {
        this.isChangingView = false;
        this._startStickyObserver();
      }, 20);
    }

    showInventoryView() {
      const content = this._content();
      if (!content || this.isChangingView) return;

      this.isChangingView = true;
      this.stickyBank = false;

      // Hide overlay only; keep original inventory DOM (listeners intact)
      const overlay = this._getOverlay();
      if (overlay) overlay.style.display = 'none';

      content.classList.remove('rb-bank-mode');
      content.dataset.viewMode = 'inventory';

      // Restore container scrolling/height to game defaults
      content.style.height    = this.prevContainerStyles.height;
      content.style.maxHeight = this.prevContainerStyles.maxHeight;
      content.style.overflow  = this.prevContainerStyles.overflow;
      content.style.overflowX = this.prevContainerStyles.overflowX;
      content.style.overflowY = this.prevContainerStyles.overflowY;
      content.style.position  = this.prevContainerStyles.position;

      this._updateButtons('inventory');

      setTimeout(() => {
        this.isChangingView = false;
        // keep observer running; stickyBank stays false
        this._startStickyObserver();
      }, 20);
    }

    /* ===========================
       UI helpers
    =========================== */
    _updateButtons(mode) {
      const invBtn = document.querySelector('.inventory-btn');
      const bankBtn = document.querySelector('.view-bank-btn');
      if (mode === 'bank') {
        if (invBtn) invBtn.style.opacity = '0.6';
        if (bankBtn) bankBtn.style.opacity = '1';
      } else {
        if (invBtn) invBtn.style.opacity = '1';
        if (bankBtn) bankBtn.style.opacity = '0.6';
      }
    }

    ensureHeaderButtons() {
      const panel = document.getElementById('ui-panel-inventory');
      if (!panel) return;
      const title = panel.querySelector('.ui-panel-title');
      if (!title || title.querySelector('.view-bank-btn')) return;

      title.innerHTML = `
        <span class="inventory-btn" style="cursor:pointer;transition:opacity .2s;">INVENTORY</span>
        <span style="margin:0 5px;">•</span>
        <span class="view-bank-btn" style="cursor:pointer;opacity:0.6;transition:opacity .2s;">VIEW BANK</span>
      `;

      const invBtn = title.querySelector('.inventory-btn');
      const bankBtn = title.querySelector('.view-bank-btn');

      invBtn.addEventListener('click', () => {
        const content = this._content();
        if (content && content.dataset.viewMode === 'bank') {
          this.userForcedInventory = true;
          this.stickyBank = false;
          this.showInventoryView();
        }
      });

      bankBtn.addEventListener('click', () => {
        const content = this._content();
        if (content && content.dataset.viewMode !== 'bank') {
          this.showBankView();
        }
      });
    }

    /* ===========================
       Bank persistence
    =========================== */
    _saveBankContents() {
      const storageDiv = document.getElementById('storage');
      if (!storageDiv || storageDiv.style.display === 'none') return;

      const items = [];
      storageDiv.querySelectorAll('[data-bank-item-name]').forEach(div => {
        const name = div.getAttribute('data-bank-item-name');
        const img = div.querySelector('img');
        const tooltip = div.querySelector('.tooltiptext');
        const amountEl = div.querySelector('.item-amount');

        if (img && name) {
          const onclickAttr = img.getAttribute('onclick');
          const match = onclickAttr ? onclickAttr.match(/,\s*"(\d+)"\)/) : null;
          const amount = match ? match[1] : '1';

          items.push({
            name,
            amount,
            imgSrc: img.src,
            tooltipText: tooltip ? tooltip.innerHTML : name.toUpperCase().replace(/_/g, ' '),
            amountDisplay: amountEl ? amountEl.innerHTML : amount,
            backgroundColor: div.style.backgroundColor || 'rgb(225, 225, 225)'
          });
        }
      });

      this._cachedBank = items; // keep in memory
      // Persist in localStorage (simple, no GM storage)
      localStorage.setItem('rb_bankData', JSON.stringify(items));
      localStorage.setItem('rb_bankUpdated', new Date().toISOString());
    }

    _loadBankContents() {
      try {
        const raw = localStorage.getItem('rb_bankData');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    /* ===========================
       Rendering helpers
    =========================== */
    _createBankViewHTML() {
      const items = this._cachedBank || this._loadBankContents();
      const updated = localStorage.getItem('rb_bankUpdated');

      if (!items.length) {
        return `<div class="bank-last-updated" style="width:100%;text-align:center;margin-top:6px;padding-bottom:6px;color:#888;font-size:11px;">
          No bank data saved. Open your bank to save its contents.
        </div>`;
      }

      let html = '';
      for (const it of items) {
        html += `
          <div data-bank-item-name="${it.name}" class="tooltip item"
               style="${it.backgroundColor ? 'background-color:' + it.backgroundColor + ';' : 'background-color: rgb(225,225,225);'} border:1px solid rgb(205,205,205);">
            <span class="item-amount">${it.amountDisplay}</span>
            <img src="${it.imgSrc}" draggable="false">
            <span class="tooltiptext">${it.tooltipText}</span>
          </div>
        `;
      }

      if (updated) {
        html += `<div class="bank-last-updated" style="width:100%;text-align:center;margin-top:6px;padding-bottom:6px;color:#888;font-size:11px;">
          Last updated: ${this._timeAgo(new Date(updated))}
        </div>`;
      }
      return html;
    }

    _timeAgo(date) {
      const s = Math.floor((Date.now() - date.getTime()) / 1000);
      const unit = [['year',31536000],['month',2592000],['week',604800],['day',86400],['hour',3600],['minute',60]];
      for (const [n,sec] of unit) {
        const v = Math.floor(s / sec);
        if (v >= 1) return v + ' ' + n + (v !== 1 ? 's' : '') + ' ago';
      }
      return 'just now';
    }

    /* ===========================
       DOM helpers
    =========================== */
    _content() {
      return document.getElementById('ui-panel-inventory-content');
    }
  }

  /* ===========================
     Boot
  =========================== */
  const plugin = new RemoteBankViewerPlugin();

  // Ensure header buttons appear as soon as the panel exists
  const titleObs = new MutationObserver(() => plugin.ensureHeaderButtons());
  titleObs.observe(document.body, { childList: true, subtree: true });

  // Register with FlatMMOPlus
  FlatMMOPlus.registerPlugin(plugin);

})();

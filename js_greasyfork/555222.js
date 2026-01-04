// ==UserScript==
// @name         Amazon Orders signs 27
// @namespace    solomon.amazon.orders
// @version      27
// @description  Enhanced yesterday detection with date parsing. Shows "Delivered Today" (orange), "Delivered Yesterday" (blue), "Arriving Today" (green), "Arriving Tomorrow" (purple). Light modern UI with quantity badges, tinted return cards, status stripe, hover-highlight, draggable panels, Israel address alert, right-rail removal.
// @match        https://www.amazon.com/*order-history*
// @match        https://www.amazon.com/*your-orders*
// @match        https://www.amazon.com/gp/css/order-history*
// @match        https://www.amazon.com/hz/order-history*
// @match        https://smile.amazon.com/*order-history*
// @match        https://smile.amazon.com/*your-orders*
// @match        https://smile.amazon.com/gp/css/order-history*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555222/Amazon%20Orders%20signs%2027.user.js
// @updateURL https://update.greasyfork.org/scripts/555222/Amazon%20Orders%20signs%2027.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========================================
  // CONFIGURATION
  // ========================================

  const CONFIG = {
    DEBUG: true,
    MAX_SCAN: 400,
    PANEL_IDS: {
      TODAY: 'tm-today',
      YESTERDAY: 'tm-yest',
      ARRIVING_TODAY: 'tm-arriving-today',
      TOMORROW: 'tm-tomorrow',
      RETURNS: 'tm-ret'
    },
    PANELS: {
      VERTICAL_SPACING: 24,
      DEFAULT_LEFT: 12,
      DEFAULT_TOP: 160,
      SNAP_THRESHOLD: 0.5
    },
    SELECTORS: {
      orderBoxes: '.a-box-group, [data-order-id], [id^="order-"]',
      status: [
        '.yohtmlc-shipment-status-primaryText',
        '.delivery-box__primary-text',
        '.yohtmlc-order-status',
        '.a-size-medium',
        '[data-test*="shipment-status"]',
        '[id*="shipment"] .a-row',
        '.a-row .a-color-success',
        '.a-row .a-color-secondary'
      ],
      title: '.yohtmlc-product-title a, .a-link-normal.a-text-bold, a.a-link-normal[href*="/gp/product/"], a.a-link-normal[href*="/dp/"]',
      image: '.product-image img, img.s-image, img[src*="images"]',
      address: [
        '.displayAddressDiv',
        '.ship-address',
        '[data-test="order-address"]',
        '.yohtmlc-shipment-address',
        '.a-section.shipment'
      ]
    },
    PATTERNS: {
      openReturn: new RegExp([
        'return (started|requested|initiated|approved)',
        '(label|qr) (created|code)',
        '(drop(?:ped)? off|handed to carrier|picked up)',
        '(in transit|en route|on the way)',
        '(delivered to (amazon|seller)|arrived at (amazon|facility))',
        '(received by (amazon|seller)|package received|inspection)',
        '(processing( refund)?|awaiting (drop ?off|pickup))',
        '(replacement (ordered|shipped))'
      ].join('|'), 'i'),
      refunded: /\b(refund(ed| issued| processed| complete| completed)|credit issued|refunded to)\b/i,
      deliveredToday: /delivered\s+today/i,
      deliveredYesterday: /delivered\s+yesterday/i,
      arrivingToday: /arriving\s+today/i,
      arrivingTomorrow: /arriving\s+tomorrow/i,
      returnDeadline: /\breturn (?:by|window closes on)\s+([A-Za-z]{3,9}\.? \d{1,2})\b/i,
      // NEW in v27: Pattern to match "Delivered [Month] [Day]"
      deliveredDate: /delivered\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i
    }
  };

  const state = {
    processedBoxes: new WeakSet(),
    processedAddresses: new WeakSet(),
    currentPanels: new Map(),
    lastScan: null,
    cssInjected: false
  };

  const Storage = {
    namespace: `${location.hostname}${location.pathname}`,
    getKey(type, id) {
      return `${this.namespace}::tm_${type}_${id}`;
    },
    savePosition(id, left, top) {
      try {
        const key = this.getKey('sidebar_pos', id);
        localStorage.setItem(key, JSON.stringify({ left, top }));
      } catch (error) {
        Logger.warn('Failed to save position:', error);
      }
    },
    loadPosition(id) {
      try {
        const key = this.getKey('sidebar_pos', id);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        return null;
      }
    },
    saveMinimized(id, isMinimized) {
      try {
        const key = this.getKey('panel_min', id);
        localStorage.setItem(key, isMinimized ? '1' : '0');
      } catch (error) {
        Logger.warn('Failed to save minimized state:', error);
      }
    },
    loadMinimized(id) {
      try {
        const key = this.getKey('panel_min', id);
        return localStorage.getItem(key) === '1';
      } catch (error) {
        return false;
      }
    }
  };

  const Logger = {
    prefix: '[Amazon Orders v27]',
    log(...args) {
      console.log(this.prefix, ...args);
    },
    debug(...args) {
      if (CONFIG.DEBUG) {
        console.log(this.prefix, '[DEBUG]', ...args);
      }
    },
    warn(...args) {
      console.warn(this.prefix, ...args);
    },
    error(...args) {
      console.error(this.prefix, ...args);
    }
  };

  const Utils = {
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    textOf(element) {
      return element ? (element.textContent || '').trim() : '';
    },
    ariaOf(element) {
      return element ? (element.getAttribute?.('aria-label') || '').trim() : '';
    },
    getParentElement() {
      return document.querySelector('#a-page, #ordersContainer, .a-section.a-spacing-medium') || document.body;
    },
    extractASIN(url) {
      if (!url) return null;
      const match = url.match(/\/(dp|product)\/([A-Z0-9]{6,})/i);
      return match ? match[2].toUpperCase() : null;
    },
    dedupeByASIN(items) {
      const map = new Map();
      for (const item of items) {
        const asin = this.extractASIN(item.link);
        const key = asin || item.link;
        if (!map.has(key)) {
          map.set(key, item);
        }
      }
      return Array.from(map.values());
    }
  };

  const CSSInjector = {
    getStyles() {
      return `
        /* Enhanced right rail removal (from v26) */
        .right-rail,
        .js-yo-right-rail,
        .bia-content,
        .right-rail-top-content,
        .your-orders-content-container__column--right,
        div[class*="your-orders-content-container__column--right"],
        section[class*="your-orders-content-container__column--right"],
        [cel_widget_id*="ab-yo-static-upsell"],
        [data-csa-c-painter="ab-yo-static-upsell-cards"],
        [id*="CardInstance_"][data-card-metrics-id*="ab-yo-static-upsell"],
        [data-card-metrics-id*="p13n-desktop-list"],
        [data-card-metrics-id*="yo-rightrails"],
        [id*="CardInstance"][data-acp-tracking],
        ._cDEzb_your-orders-box-styling_1K33F,
        [data-cel-widget*="p13n-desktop-list"],
        [cel_widget_id*="desktop-yo-rightrails"],
        [data-csa-c-slot-id*="desktop-yo-rightrails"],
        div:has(> h3:first-child):has(> h3:contains("Buy it again")) {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -9999px !important;
        }

        /* Constrain content width to reasonable size */
        .your-orders-content-container,
        div[class*="your-orders-content-container"] {
          display: block !important;
          max-width: 1500px !important;
          margin: 0 auto !important;
        }

        .your-orders-content-container__column--left,
        div[class*="your-orders-content-container__column--left"] {
          width: 100% !important;
          max-width: 100% !important;
          flex: 1 1 100% !important;
          margin-right: 0 !important;
        }

        .a-section.a-spacing-none.your-orders-content-container__column.your-orders-content-container__column--left .a-box,
        .your-orders-content-container__column--left > .a-box,
        div[class*="your-orders-content-container__column--left"] .a-box {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%) !important;
          border: 2px solid #f59e0b !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.2) !important;
        }
        .your-orders-content-container__column--left .a-box-inner {
          background: transparent !important;
        }
        .your-orders-content-container__column--left h2 {
          color: #92400e !important;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          margin: 4px 0 8px 0 !important;
          border: 1px solid #fbbf24 !important;
          font-weight: 700 !important;
        }
        .tm-panel {
          position: absolute;
          width: 320px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #3b82f6;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 16px 16px 16px 20px;
          z-index: 1000;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          max-height: 78vh;
          overflow: auto;
          pointer-events: auto;
        }
        .tm-panel:hover, .tm-panel:focus-within {
          z-index: 2147480000;
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.25), 0 6px 16px rgba(0, 0, 0, 0.12);
          border-color: #2563eb;
        }
        .tm-panel h3 {
          margin: 0 0 12px;
          font-size: 18px;
          font-weight: 700;
          text-align: center;
          color: #1e40af;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 1px solid #93c5fd;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: move;
          user-select: none;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);
        }
        #${CONFIG.PANEL_IDS.TODAY} h3 {
          color: #92400e;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #fbbf24;
        }
        #${CONFIG.PANEL_IDS.YESTERDAY} h3 {
          color: #1e40af;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-color: #93c5fd;
        }
        #${CONFIG.PANEL_IDS.TOMORROW} h3 {
          color: #6b21a8;
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          border-color: #c084fc;
        }
        #${CONFIG.PANEL_IDS.ARRIVING_TODAY} h3 {
          color: #065f46;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-color: #6ee7b7;
        }
        #${CONFIG.PANEL_IDS.RETURNS} h3 {
          color: #0f766e;
          background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
          border-color: #5eead4;
        }
        #${CONFIG.PANEL_IDS.TODAY} {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 2px solid #f59e0b;
          box-shadow: 0 12px 32px rgba(245, 158, 11, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        #${CONFIG.PANEL_IDS.TODAY}:hover, #${CONFIG.PANEL_IDS.TODAY}:focus-within {
          box-shadow: 0 16px 40px rgba(245, 158, 11, 0.25), 0 6px 16px rgba(0, 0, 0, 0.12);
          border-color: #d97706;
        }
        #${CONFIG.PANEL_IDS.TOMORROW} {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border: 2px solid #a855f7;
          box-shadow: 0 12px 32px rgba(168, 85, 247, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        #${CONFIG.PANEL_IDS.TOMORROW}:hover, #${CONFIG.PANEL_IDS.TOMORROW}:focus-within {
          box-shadow: 0 16px 40px rgba(168, 85, 247, 0.25), 0 6px 16px rgba(0, 0, 0, 0.12);
          border-color: #9333ea;
        }
        #${CONFIG.PANEL_IDS.ARRIVING_TODAY} {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        #${CONFIG.PANEL_IDS.ARRIVING_TODAY}:hover, #${CONFIG.PANEL_IDS.ARRIVING_TODAY}:focus-within {
          box-shadow: 0 16px 40px rgba(16, 185, 129, 0.25), 0 6px 16px rgba(0, 0, 0, 0.12);
          border-color: #059669;
        }
        .tm-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .tm-item {
          margin: 8px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tm-link {
          display: flex;
          gap: 10px;
          align-items: center;
          text-decoration: none;
          color: #0f172a;
          font-weight: 600;
          flex: 1 1 auto;
        }
        .tm-link:hover {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .tm-img {
          width: 56px;
          height: 56px;
          object-fit: contain;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
        }
        .item-count {
          font-weight: 800;
          color: #dc2626;
          margin-left: 6px;
          font-size: 16px;
        }
        .tm-min {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
          padding: 10px 16px !important;
          border-radius: 999px !important;
          border: 2px solid #3b82f6 !important;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
          background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
        }
        .tm-panel.tm-min h3 {
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          font-size: 16px !important;
          line-height: 24px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: move;
          background: transparent !important;
          box-shadow: none !important;
        }
        .tm-panel.tm-min .tm-list,
        .tm-panel.tm-min .tm-img,
        .tm-panel.tm-min .tm-pill {
          display: none !important;
        }
        .tm-panel.tm-min .item-count {
          font-weight: 800 !important;
          margin-left: 6px !important;
        }
        .tm-pill {
          margin-left: auto;
          font: 12px/1.2 system-ui, Arial;
          padding: 4px 8px;
          border-radius: 999px;
          background: #fefce8;
          color: #7a5e00;
          border: 1px solid #fde68a;
          white-space: nowrap;
        }
        .tm-pill-soon {
          background: #fff7ed;
          color: #7a3412;
          border-color: #fdba74;
        }
        .tm-pill-urgent {
          background: #fee2e2;
          color: #7f1d1d;
          border-color: #fca5a5;
          font-weight: 700;
        }
        .tm-hi {
          outline: 3px solid #60a5fa !important;
          outline-offset: 2px;
          border-radius: 10px;
          scroll-margin-top: 120px;
          transition: outline-color .2s ease;
        }
        .tm-return-flag {
          position: relative !important;
          border-radius: 12px;
          outline: 1px solid rgba(14,165,164,.25);
          box-shadow: 0 6px 18px rgba(14,165,164,.08), inset 0 0 0 9999px rgba(45,212,191,.06);
          transition: box-shadow .25s ease, outline-color .25s ease, background-color .25s ease;
        }
        .tm-return-flag .delivery-box,
        .tm-return-flag .a-box.order-header {
          background-color: rgba(45,212,191,.06) !important;
        }
        .tm-return-flag:hover,
        .tm-return-flag:focus-within {
          outline-color: rgba(14,165,164,.38);
          box-shadow: 0 10px 26px rgba(14,165,164,.12), inset 0 0 0 9999px rgba(45,212,191,.075);
        }
        .tm-return-flag { --tmStripe: linear-gradient(180deg, #5eead4, #22d3ee); }
        .tm-return-flag > .tm-stripe {
          content: "";
          position: absolute;
          left: -2px;
          top: 8px;
          bottom: 8px;
          width: 4px;
          border-radius: 4px;
          background: var(--tmStripe);
          box-shadow: 0 0 0 1px rgba(255,255,255,.6) inset, 0 2px 8px rgba(0,0,0,.08);
          pointer-events: none;
          z-index: 1;
        }
        .tm-address-alert {
          background: linear-gradient(135deg, rgba(254,240,138,.25), rgba(253,224,71,.15)) !important;
          outline: 2px solid rgba(202,138,4,.4) !important;
          outline-offset: 1px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(202,138,4,.15) !important;
        }
        .product-image {
          position: relative !important;
          display: inline-block !important;
        }
        .product-image__qty {
          position: absolute !important;
          bottom: 2px !important;
          right: 2px !important;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          font-size: 18px !important;
          line-height: 1.2 !important;
          padding: 6px 11px !important;
          border-radius: 50% !important;
          border: 3px solid #ffffff !important;
          box-shadow: 0 4px 14px rgba(239,68,68,.5), 0 2px 6px rgba(0,0,0,.3) !important;
          min-width: 36px !important;
          min-height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          z-index: 100 !important;
          transform: scale(1) !important;
        }
        @media (prefers-color-scheme: dark) {
          .tm-panel {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-color: #3b82f6;
            color: #e5e7eb;
            box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25), 0 4px 12px rgba(0, 0, 0, 0.5);
          }
          .tm-panel:hover, .tm-panel:focus-within {
            box-shadow: 0 16px 40px rgba(59, 130, 246, 0.35), 0 6px 16px rgba(0, 0, 0, 0.6);
          }
          .tm-panel h3 {
            color: #60a5fa;
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            border-color: #3b82f6;
          }
          #${CONFIG.PANEL_IDS.TODAY} h3 {
            color: #92400e;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-color: #fbbf24;
          }
          #${CONFIG.PANEL_IDS.YESTERDAY} h3 {
            color: #60a5fa;
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            border-color: #3b82f6;
          }
          #${CONFIG.PANEL_IDS.TOMORROW} h3 {
            color: #c084fc;
            background: linear-gradient(135deg, #581c87 0%, #6b21a8 100%);
            border-color: #a855f7;
          }
          #${CONFIG.PANEL_IDS.ARRIVING_TODAY} h3 {
            color: #6ee7b7;
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
            border-color: #10b981;
          }
          #${CONFIG.PANEL_IDS.RETURNS} h3 {
            color: #2dd4bf;
            background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
            border-color: #14b8a6;
          }
          .tm-link { color: #e5e7eb; }
          .tm-img { background: #0b0f14; border-color: #1f2937; }
          .tm-pill { background: #3a2f12; color: #fde68a; border-color: #6b5e1e; }
          .tm-pill-soon { background: #402617; color: #ffddb7; border-color: #7a3a34; }
          .tm-pill-urgent { background: #3a1717; color: #ffb4b4; border-color: #8b2a2a; }
          .tm-return-flag {
            outline-color: rgba(34,211,238,.28);
            box-shadow: 0 8px 22px rgba(34,211,238,.12), inset 0 0 0 9999px rgba(34,211,238,.07);
          }
          .tm-return-flag .delivery-box,
          .tm-return-flag .a-box.order-header {
            background-color: rgba(34,211,238,.08) !important;
          }
          .tm-address-alert {
            background: linear-gradient(135deg, rgba(202,138,4,.3), rgba(161,98,7,.2)) !important;
            outline-color: rgba(202,138,4,.5) !important;
          }
          .tm-min {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-color: #3b82f6 !important;
          }
          #${CONFIG.PANEL_IDS.TOMORROW} {
            background: linear-gradient(135deg, #581c87 0%, #6b21a8 100%);
            border-color: #a855f7;
          }
          #${CONFIG.PANEL_IDS.ARRIVING_TODAY} {
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
            border-color: #10b981;
          }
        }
      `;
    },
    inject() {
      if (state.cssInjected) return;
      try {
        const style = document.createElement('style');
        style.id = 'tm-orders-styles';
        style.textContent = this.getStyles();
        document.documentElement.appendChild(style);
        state.cssInjected = true;
        Logger.debug('CSS injected successfully');
      } catch (error) {
        Logger.error('CSS injection failed:', error);
      }
    }
  };

  // NEW in v27: Enhanced date detection
  const DateHelpers = {
    // Parse month name to number
    parseMonth(monthName) {
      const months = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3,
        'may': 4, 'june': 5, 'july': 6, 'august': 7,
        'september': 8, 'october': 9, 'november': 10, 'december': 11
      };
      return months[monthName.toLowerCase()];
    },

    // Check if a date string matches yesterday
    isDateYesterday(monthName, day) {
      try {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const monthNum = this.parseMonth(monthName);
        if (monthNum === undefined) return false;

        const dayNum = parseInt(day, 10);

        // Check if the parsed date matches yesterday
        if (monthNum === yesterday.getMonth() && dayNum === yesterday.getDate()) {
          return true;
        }

        // Handle year wrap (e.g., December 31 -> January 1)
        const candidateDate = new Date(now.getFullYear(), monthNum, dayNum);
        if (candidateDate > now) {
          candidateDate.setFullYear(candidateDate.getFullYear() - 1);
        }

        const daysDiff = Math.floor((now - candidateDate) / (1000 * 60 * 60 * 24));
        return daysDiff === 1;
      } catch (error) {
        Logger.warn('Error parsing date:', error);
        return false;
      }
    },

    isToday(statusText) {
      return CONFIG.PATTERNS.deliveredToday.test(statusText);
    },

    // NEW in v27: Enhanced yesterday detection with date parsing
    isYesterday(statusText) {
      // First check for explicit "delivered yesterday" text
      if (CONFIG.PATTERNS.deliveredYesterday.test(statusText)) {
        return true;
      }

      // NEW: Parse "Delivered [Month] [Day]" format
      const dateMatch = statusText.match(CONFIG.PATTERNS.deliveredDate);
      if (dateMatch) {
        const [, monthName, day] = dateMatch;
        Logger.debug(`Checking if "${monthName} ${day}" is yesterday`);
        return this.isDateYesterday(monthName, day);
      }

      return false;
    },

    isArrivingToday(statusText) {
      return CONFIG.PATTERNS.arrivingToday.test(statusText);
    },
    isArrivingTomorrow(statusText) {
      return CONFIG.PATTERNS.arrivingTomorrow.test(statusText);
    },
    getYesterdayLabel() {
      return 'Yesterday';
    },
    parseReturnDeadline(statusText) {
      if (!statusText) return '';
      const match = statusText.match(CONFIG.PATTERNS.returnDeadline);
      if (!match) return '';
      const now = new Date();
      let deadlineDate = new Date(`${match[1]} ${now.getFullYear()}`);
      if (isNaN(deadlineDate.getTime())) return '';
      if (deadlineDate.getTime() - now.getTime() < -45 * 86400000) {
        deadlineDate = new Date(`${match[1]} ${now.getFullYear() + 1}`);
      }
      const daysLeft = Math.ceil((deadlineDate - now) / 86400000);
      const dateLabel = deadlineDate.toDateString().split(' ').slice(0, 3).join(' ');
      return daysLeft >= 0 ? `Return by ${dateLabel} (${daysLeft} day${daysLeft !== 1 ? 's' : ''} left)` : '';
    },
    getPillClass(dueText) {
      const match = dueText?.match(/\((\d+) day/);
      if (!match) return '';
      const days = parseInt(match[1], 10);
      if (days <= 2) return 'tm-pill-urgent';
      if (days <= 7) return 'tm-pill-soon';
      return '';
    }
  };

  const ReturnDetector = {
    isOpenReturn(statusText) {
      if (!statusText) return false;
      return CONFIG.PATTERNS.openReturn.test(statusText) && !CONFIG.PATTERNS.refunded.test(statusText);
    },
    clearReturnFlags() {
      document.querySelectorAll('.tm-return-flag').forEach(element => {
        const stripe = element.querySelector('.tm-stripe');
        if (stripe) stripe.remove();
        element.classList.remove('tm-return-flag');
      });
    },
    markReturnOnBox(box) {
      const target = box.closest('.a-box-group') || box.closest('.delivery-box') || box;
      if (target && !state.processedBoxes.has(target)) {
        target.classList.add('tm-return-flag');
        state.processedBoxes.add(target);
        if (!target.querySelector('.tm-stripe')) {
          const stripe = document.createElement('i');
          stripe.className = 'tm-stripe';
          target.appendChild(stripe);
        }
      }
    }
  };

  const AddressDetector = {
    checkAddresses() {
      document.querySelectorAll('.tm-address-alert').forEach(element => {
        element.classList.remove('tm-address-alert');
      });
      state.processedAddresses = new WeakSet();
      CONFIG.SELECTORS.address.forEach(selector => {
        document.querySelectorAll(selector).forEach(addressElement => {
          if (state.processedAddresses.has(addressElement)) return;
          const text = Utils.textOf(addressElement).toLowerCase();
          if (text && !text.includes('israel')) {
            const orderBox = addressElement.closest(CONFIG.SELECTORS.orderBoxes);
            if (orderBox) {
              orderBox.classList.add('tm-address-alert');
              state.processedAddresses.add(addressElement);
            }
          }
        });
      });
    }
  };

  const OrderScanner = {
    getStatus(box) {
      for (const selector of CONFIG.SELECTORS.status) {
        const element = box.querySelector(selector);
        if (element) {
          const statusText = (Utils.textOf(element) + ' ' + Utils.ariaOf(element)).trim();
          if (statusText) {
            Logger.debug('Found status from selector:', selector, '→', statusText);
            return statusText;
          }
        }
      }
      const fallbackText = Utils.textOf(box).slice(0, 600);
      Logger.debug('Using fallback status text:', fallbackText.slice(0, 100));
      return fallbackText;
    },
    getProductInfo(box) {
      const titleElement = box.querySelector(CONFIG.SELECTORS.title);
      const imageElement = box.querySelector(CONFIG.SELECTORS.image);
      if (!titleElement) return null;
      return {
        title: titleElement.textContent.trim().replace(/\s+/g, ' '),
        link: titleElement.href,
        image: imageElement ? (imageElement.getAttribute('data-a-hires') || imageElement.src) : null
      };
    },
    selectOrderBoxes() {
      const boxes = document.querySelectorAll(CONFIG.SELECTORS.orderBoxes);
      Logger.debug('Found order boxes:', boxes.length);
      return Array.from(boxes).slice(0, CONFIG.MAX_SCAN);
    },
    scan() {
      const startTime = performance.now();
      ReturnDetector.clearReturnFlags();
      AddressDetector.checkAddresses();
      const boxes = this.selectOrderBoxes();
      const result = {
        today: [],
        yesterday: [],
        arrivingToday: [],
        tomorrow: [],
        openReturns: []
      };
      let processedCount = 0;
      for (const box of boxes) {
        const status = this.getStatus(box);
        const info = this.getProductInfo(box);
        if (!info) {
          Logger.debug('No product info found, skipping box');
          continue;
        }
        processedCount++;
        Logger.debug(`\n--- Processing order ${processedCount}: ${info.title.slice(0, 50)} ---`);
        Logger.debug('Status text:', status);
        if (ReturnDetector.isOpenReturn(status)) {
          Logger.debug('✓ Matched: OPEN RETURN');
          const due = DateHelpers.parseReturnDeadline(status);
          result.openReturns.push({ ...info, due });
          ReturnDetector.markReturnOnBox(box);
          continue;
        }
        if (DateHelpers.isToday(status)) {
          Logger.debug('✓ Matched: DELIVERED TODAY');
          result.today.push(info);
          continue;
        }
        // NEW in v27: Enhanced yesterday detection
        if (DateHelpers.isYesterday(status)) {
          Logger.debug('✓ Matched: DELIVERED YESTERDAY');
          result.yesterday.push(info);
          continue;
        }
        if (DateHelpers.isArrivingToday(status)) {
          Logger.debug('✓ Matched: ARRIVING TODAY');
          result.arrivingToday.push(info);
          continue;
        }
        if (DateHelpers.isArrivingTomorrow(status)) {
          Logger.debug('✓ Matched: ARRIVING TOMORROW');
          result.tomorrow.push(info);
          continue;
        }
        Logger.debug('✗ No match for any category');
      }
      result.today = Utils.dedupeByASIN(result.today);
      result.yesterday = Utils.dedupeByASIN(result.yesterday);
      result.arrivingToday = Utils.dedupeByASIN(result.arrivingToday);
      result.tomorrow = Utils.dedupeByASIN(result.tomorrow);
      result.openReturns = Utils.dedupeByASIN(result.openReturns);
      const baseTitle = document.title.replace(/^🔁\s+/, '');
      document.title = result.openReturns.length ? `🔁 ${baseTitle}` : baseTitle;
      const duration = (performance.now() - startTime).toFixed(2);
      Logger.log(`\n=== SCAN RESULTS ===`);
      Logger.log(`Processed ${processedCount} orders in ${duration}ms`);
      Logger.log(`Today: ${result.today.length}`);
      Logger.log(`Yesterday: ${result.yesterday.length}`);
      Logger.log(`Arriving Today: ${result.arrivingToday.length}`);
      Logger.log(`Tomorrow: ${result.tomorrow.length}`);
      Logger.log(`Returns: ${result.openReturns.length}`);
      Logger.log(`===================\n`);
      return result;
    }
  };

  const PanelManager = {
    createPanel(id, header, items, parent) {
      if (!items.length) return null;
      const panel = document.createElement('div');
      panel.id = id;
      panel.className = 'tm-panel';
      panel.innerHTML = `
        <h3 tabindex="0">${header} <span class="item-count">(${items.length})</span></h3>
        <ul class="tm-list">${
          items.map(item => `
            <li class="tm-item">
              ${item.image ? `<img class="tm-img" src="${item.image}" alt="">` : ''}
              <a class="tm-link" href="${item.link}" target="_blank" title="${item.title}">
                <span>${item.title.length > 70 ? item.title.slice(0, 70) + '…' : item.title}</span>
              </a>
              ${item.due ? `<span class="tm-pill ${DateHelpers.getPillClass(item.due)}">${item.due}</span>` : ''}
            </li>
          `).join('')
        }</ul>
      `;
      parent.appendChild(panel);
      if (Storage.loadMinimized(id)) {
        panel.classList.add('tm-min');
      }
      this.setupDragging(panel, parent);
      this.setupDoubleClickMinimize(panel);
      return panel;
    },
    setupDragging(panel, parent) {
      const handle = panel.querySelector('h3');
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialLeft = 0;
      let initialTop = 0;
      const onMouseDown = (e) => {
        isDragging = true;
        document.body.style.userSelect = 'none';
        const parentRect = parent.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        initialLeft = panelRect.left - parentRect.left;
        initialTop = panelRect.top - parentRect.top;
        const event = e.touches ? e.touches[0] : e;
        startX = event.pageX;
        startY = event.pageY;
        window.addEventListener('mousemove', onMouseMove, { passive: false });
        window.addEventListener('mouseup', onMouseUp, { passive: false });
        window.addEventListener('touchmove', onMouseMove, { passive: false });
        window.addEventListener('touchend', onMouseUp, { passive: false });
        e.preventDefault();
      };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const event = e.touches ? e.touches[0] : e;
        let newLeft = initialLeft + (event.pageX - startX);
        let newTop = initialTop + (event.pageY - startY);
        const maxLeft = parent.clientWidth - panel.offsetWidth - 10;
        const maxTop = (parent.scrollHeight || parent.clientHeight) - panel.offsetHeight - 10;
        newLeft = Utils.clamp(newLeft, -10, Math.max(10, maxLeft));
        newTop = Utils.clamp(newTop, 10, Math.max(10, maxTop));
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        e.preventDefault();
      };
      const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        const parentRect = parent.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const leftInParent = panelRect.left - parentRect.left;
        const snapLeft = leftInParent < (parent.clientWidth - panelRect.width) * CONFIG.PANELS.SNAP_THRESHOLD
          ? CONFIG.PANELS.DEFAULT_LEFT
          : parent.clientWidth - panelRect.width - CONFIG.PANELS.DEFAULT_LEFT;
        panel.style.left = snapLeft + 'px';
        const finalRect = panel.getBoundingClientRect();
        Storage.savePosition(panel.id, finalRect.left - parentRect.left, finalRect.top - parentRect.top);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchmove', onMouseMove);
        window.removeEventListener('touchend', onMouseUp);
      };
      handle.addEventListener('mousedown', onMouseDown);
      handle.addEventListener('touchstart', onMouseDown, { passive: false });
    },
    setupDoubleClickMinimize(panel) {
      const handle = panel.querySelector('h3');
      handle.addEventListener('dblclick', (e) => {
        e.preventDefault();
        panel.classList.toggle('tm-min');
        Storage.saveMinimized(panel.id, panel.classList.contains('tm-min'));
      });
    },
    positionPanels(panels, parent) {
      let currentTop = CONFIG.PANELS.DEFAULT_TOP;
      panels.forEach(panel => {
        const savedPos = Storage.loadPosition(panel.id);
        panel.style.left = CONFIG.PANELS.DEFAULT_LEFT + 'px';
        panel.style.top = currentTop + 'px';
        panel.offsetHeight;
        const parentRect = parent.getBoundingClientRect();
        Storage.savePosition(panel.id, CONFIG.PANELS.DEFAULT_LEFT, currentTop);
        currentTop += panel.offsetHeight + CONFIG.PANELS.VERTICAL_SPACING;
      });
    },
    updatePanelContent(panel, items) {
      if (!panel) return;
      const list = panel.querySelector('.tm-list');
      const countElement = panel.querySelector('.item-count');
      if (!items.length) {
        list.innerHTML = '<li class="tm-item" style="color:#64748b;">No matches found.</li>';
        if (countElement) countElement.textContent = '(0)';
        return;
      }
      list.innerHTML = items.map(item => `
        <li class="tm-item">
          ${item.image ? `<img class="tm-img" src="${item.image}" alt="">` : ''}
          <a class="tm-link" href="${item.link}" target="_blank" title="${item.title}">
            <span>${item.title.length > 70 ? item.title.slice(0, 70) + '…' : item.title}</span>
          </a>
          ${item.due ? `<span class="tm-pill ${DateHelpers.getPillClass(item.due)}">${item.due}</span>` : ''}
        </li>
      `).join('');
      if (countElement) countElement.textContent = `(${items.length})`;
    }
  };

  const HoverHighlight = {
    lastHighlighted: null,
    findOrderBoxByASIN(asin) {
      if (!asin) return null;
      const link = document.querySelector(`a[href*="/dp/${asin}"], a[href*="/product/${asin}"]`);
      if (!link) return null;
      return link.closest(CONFIG.SELECTORS.orderBoxes);
    },
    setup() {
      document.addEventListener('mouseenter', (e) => {
        const listItem = e.target.closest('.tm-item');
        if (!listItem) return;
        const link = listItem.querySelector('a.tm-link');
        if (!link) return;
        if (this.lastHighlighted) {
          this.lastHighlighted.classList.remove('tm-hi');
          this.lastHighlighted = null;
        }
        const asin = Utils.extractASIN(link.href);
        const orderBox = this.findOrderBoxByASIN(asin);
        if (orderBox) {
          orderBox.classList.add('tm-hi');
          this.lastHighlighted = orderBox;
        }
      }, true);
      document.addEventListener('mouseleave', (e) => {
        const listItem = e.target.closest('.tm-item');
        if (!listItem) return;
        if (this.lastHighlighted) {
          this.lastHighlighted.classList.remove('tm-hi');
          this.lastHighlighted = null;
        }
      }, true);
      document.addEventListener('click', (e) => {
        const link = e.target.closest('.tm-item a.tm-link');
        if (!link) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const asin = Utils.extractASIN(link.href);
        const orderBox = this.findOrderBoxByASIN(asin);
        if (orderBox) {
          e.preventDefault();
          orderBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          orderBox.classList.add('tm-hi');
          setTimeout(() => orderBox.classList.remove('tm-hi'), 1500);
        }
      });
    }
  };

  const ResizeHandler = {
    timeoutId: null,
    reclampAllPanels() {
      const parent = Utils.getParentElement();
      const panels = parent.querySelectorAll('.tm-panel');
      panels.forEach(panel => {
        const parentRect = parent.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const leftInParent = panelRect.left - parentRect.left;
        const topInParent = panelRect.top - parentRect.top;
        const newLeft = Utils.clamp(leftInParent, -10, parent.clientWidth - panel.offsetWidth - 10);
        const newTop = Utils.clamp(topInParent, 10, (parent.scrollHeight || parent.clientHeight) - panel.offsetHeight - 10);
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        Storage.savePosition(panel.id, newLeft, newTop);
      });
    },
    setup() {
      window.addEventListener('resize', () => {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.reclampAllPanels(), 120);
      });
    }
  };

  const SidebarCleaner = {
    remove() {
      Logger.debug('Running SidebarCleaner.remove()');
      const rightRails = document.querySelectorAll(`
        .right-rail,
        .js-yo-right-rail,
        .bia-content
      `);
      rightRails.forEach(el => {
        Logger.debug('Removing right-rail element:', el.className);
        el.remove();
      });
      const rightColumns = document.querySelectorAll(`
        .your-orders-content-container__column--right,
        div[class*="your-orders-content-container__column--right"],
        section[class*="your-orders-content-container__column--right"],
        .right-rail-top-content,
        [cel_widget_id*="desktop-yo-rightrails"],
        [data-csa-c-slot-id*="desktop-yo-rightrails"]
      `);
      rightColumns.forEach(el => {
        Logger.debug('Removing right column element:', el.className);
        el.remove();
      });
      const containers = document.querySelectorAll(`
        .your-orders-content-container,
        div[class*="your-orders-content-container"]
      `);
      containers.forEach(el => {
        el.style.maxWidth = '1500px';
        el.style.margin = '0 auto';
        Logger.debug('Set container max-width to 1500px');
      });
      const leftColumns = document.querySelectorAll(`
        .your-orders-content-container__column--left,
        div[class*="your-orders-content-container__column--left"]
      `);
      leftColumns.forEach(el => {
        el.style.width = '100%';
        el.style.maxWidth = '100%';
        el.style.flex = '1 1 100%';
        el.style.marginRight = '0';
        Logger.debug('Set left column to full width');
      });
      document.querySelectorAll('h3').forEach(heading => {
        if (heading.textContent.trim() === 'Buy it again') {
          let container = heading.closest('.a-box');
          if (!container) container = heading.closest('[id*="CardInstance"]');
          if (!container) container = heading.closest('[class*="your-orders"]');
          if (!container) container = heading.parentElement?.parentElement;
          if (container) {
            Logger.debug('Removing Buy it again container');
            container.remove();
          }
        }
      });
      document.querySelectorAll(`
        [data-card-metrics-id*="p13n-desktop-list"],
        [cel_widget_id*="ab-yo-static-upsell"],
        ._cDEzb_your-orders-box-styling_1K33F,
        [id*="CardInstance"][data-acp-tracking]
      `).forEach(el => {
        Logger.debug('Removing promo element');
        el.remove();
      });
    },
    observe() {
      const observer = new MutationObserver(() => {
        this.remove();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      this.remove();
      setTimeout(() => this.remove(), 500);
      setTimeout(() => this.remove(), 1500);
      setTimeout(() => this.remove(), 3000);
    }
  };

  function renderPanels() {
    try {
      const startTime = performance.now();
      const parent = Utils.getParentElement();
      parent.style.position = parent.style.position || 'relative';
      const scanResult = OrderScanner.scan();
      const panels = [];
      const todayPanel = PanelManager.createPanel(
        CONFIG.PANEL_IDS.TODAY,
        '📦 Delivered Today',
        scanResult.today,
        parent
      );
      const yesterdayPanel = PanelManager.createPanel(
        CONFIG.PANEL_IDS.YESTERDAY,
        `📅 Delivered ${DateHelpers.getYesterdayLabel()}`,
        scanResult.yesterday,
        parent
      );
      const arrivingTodayPanel = PanelManager.createPanel(
        CONFIG.PANEL_IDS.ARRIVING_TODAY,
        '📬 Arriving Today',
        scanResult.arrivingToday,
        parent
      );
      const tomorrowPanel = PanelManager.createPanel(
        CONFIG.PANEL_IDS.TOMORROW,
        '🚚 Arriving Tomorrow',
        scanResult.tomorrow,
        parent
      );
      const returnsPanel = PanelManager.createPanel(
        CONFIG.PANEL_IDS.RETURNS,
        '🔁 Return In Progress',
        scanResult.openReturns,
        parent
      );
      [todayPanel, yesterdayPanel, arrivingTodayPanel, tomorrowPanel, returnsPanel].forEach(panel => {
        if (panel) panels.push(panel);
      });
      PanelManager.positionPanels(panels, parent);
      const duration = (performance.now() - startTime).toFixed(2);
      Logger.log(`Panels rendered in ${duration}ms`);
      const idleCallback = (callback) => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(callback, { timeout: 2000 });
        } else {
          setTimeout(callback, 1200);
        }
      };
      idleCallback(() => {
        Logger.debug('Running secondary scan...');
        const secondScan = OrderScanner.scan();
        PanelManager.updatePanelContent(todayPanel, secondScan.today);
        PanelManager.updatePanelContent(yesterdayPanel, secondScan.yesterday);
        PanelManager.updatePanelContent(arrivingTodayPanel, secondScan.arrivingToday);
        PanelManager.updatePanelContent(tomorrowPanel, secondScan.tomorrow);
        PanelManager.updatePanelContent(returnsPanel, secondScan.openReturns);
        Logger.debug('Secondary scan complete');
      });
    } catch (error) {
      Logger.error('Render error:', error);
    }
  }

  function initialize() {
    try {
      Logger.log('Initializing...');
      CSSInjector.inject();
      SidebarCleaner.observe();
      renderPanels();
      HoverHighlight.setup();
      ResizeHandler.setup();
      Logger.log('Initialization complete');
    } catch (error) {
      Logger.error('Initialization failed:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
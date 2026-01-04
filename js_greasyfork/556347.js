// ==UserScript==
// @name        Amazon Triage
// @namespace   nikhilweee
// @match       https://www.amazon.com/*
// @match       https://www.amazon.in/*
// @grant       none
// @version     1.0
// @author      nikhilweee
// @description Triage Amazon search results.
// @icon        https://www.amazon.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/556347/Amazon%20Triage.user.js
// @updateURL https://update.greasyfork.org/scripts/556347/Amazon%20Triage.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    key: "com.nikhilweee.amazon_triage",
    colors: {
      shortlist: {
        border: "#059669", // Emerald 600
        bg: "rgba(5, 150, 105, 0.05)",
        text: "#047857",
        bannerBg: "#ecfdf5",
        bannerBorder: "#6ee7b7"
      },
      discard: {
        border: "#ef4444", // Red 500
        bg: "rgba(239, 68, 68, 0.05)",
        text: "#b91c1c",
        bannerBg: "#fef2f2",
        bannerBorder: "#fca5a5"
      },
      neutral: {
        bg: "#f3f4f6",
        text: "#1f2937",
        border: "#d1d5db",
        hoverBg: "#e5e7eb",
        hoverBorder: "#9ca3af"
      }
    }
  };

  const Triage = {
    state: {},
    hoverAsin: null,

    init() {
      this.load();
      this.injectStyles();
      this.initObservers();
      this.initEvents();
      this.renderToolbar();
      this.checkDetailPage();
    },

    load() {
      try {
        this.state = JSON.parse(localStorage.getItem(CONFIG.key) || "{}");
      } catch (e) {
        this.state = {};
      }
    },

    save() {
      try {
        localStorage.setItem(CONFIG.key, JSON.stringify(this.state));
      } catch (e) { }
      this.updateToolbar();
    },

    // Helper to handle both old (string) and new (object) state formats
    getItem(asin) {
      const val = this.state[asin];
      if (!val) return null;
      return typeof val === "string" ? { status: val, title: asin } : val;
    },

    setStatus(asin, status, title = null) {
      if (!asin) return;
      const current = this.getItem(asin);

      if (current && current.status === status) {
        delete this.state[asin];
      } else {
        // Preserve existing title if not provided
        const finalTitle = title || (current ? current.title : asin);
        this.state[asin] = { status, title: finalTitle, ts: Date.now() };
      }

      this.save();
      this.sync(asin);
    },

    sync(asin) {
      const item = this.getItem(asin);
      const status = item ? item.status : null;

      document.querySelectorAll(`div[data-asin="${asin}"][data-at-ready="true"]`).forEach(el => {
        el.classList.remove("at-s", "at-d");
        if (status) el.classList.add(`at-${status}`);
      });
    },

    clearAll() {
      if (!confirm("Clear all triage data?")) return;
      this.state = {};
      this.save();
      document.querySelectorAll(".at-s, .at-d").forEach(el => el.classList.remove("at-s", "at-d"));
      document.querySelector(".at-banner")?.remove();
    },

    getCounts() {
      let s = 0, d = 0;
      Object.values(this.state).forEach(v => {
        const status = typeof v === "string" ? v : v.status;
        if (status === "s") s++;
        if (status === "d") d++;
      });
      return { s, d, total: s + d };
    },

    getItemsByStatus(statusKey) {
      return Object.entries(this.state)
        .map(([asin, val]) => {
          const data = typeof val === "string" ? { status: val, title: asin } : val;
          return { asin, ...data };
        })
        .filter(i => i.status === statusKey)
        .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    },

    processCard(el) {
      if (el.hasAttribute("data-at-ready")) return;
      if (!el.querySelector('.s-image')) return;

      el.setAttribute("data-at-ready", "true");
      el.classList.add("at-card");

      const imgContainer = el.querySelector('.s-image-fixed-height, .s-product-image-container') || el;
      if (getComputedStyle(imgContainer).position === 'static') imgContainer.style.position = 'relative';

      const ui = document.createElement('div');
      ui.className = 'at-ui';
      ui.innerHTML = `
        <button class="at-btn s" title="Shortlist (S)">★</button>
        <button class="at-btn d" title="Discard (D)">✕</button>
      `;
      imgContainer.appendChild(ui);

      const asin = el.getAttribute("data-asin");
      const item = this.getItem(asin);
      if (item) el.classList.add(`at-${item.status}`);
    },

    injectStyles() {
      const c = CONFIG.colors;
      const css = `
        .at-card { position: relative !important; transition: all 0.2s ease; }
        .at-card::after {
          content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          box-sizing: border-box; border: 0 solid transparent; pointer-events: none; z-index: 20;
        }
        
        /* Status Styles */
        .at-s { background: ${c.shortlist.bg}; }
        .at-s::after { border-width: 4px; border-color: ${c.shortlist.border}; }
        .at-btn.s { color: ${c.shortlist.border}; }

        .at-d { background: ${c.discard.bg}; }
        .at-d::after { border-width: 4px; border-color: ${c.discard.border}; }
        .at-btn.d { color: ${c.discard.border}; }

        /* UI Overlay */
        .at-ui { position: absolute; top: 6px; right: 6px; display: none; gap: 4px; z-index: 100; }
        [data-asin]:hover .at-ui { display: flex; }
        .at-btn { 
          width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ddd; 
          background: #fff; cursor: pointer; padding: 0; display: grid; place-items: center; 
          font-size: 14px; transition: transform 0.1s; 
        }
        .at-btn:hover { transform: scale(1.15); background: #f8f8f8; }

        /* Toolbar */
        .at-toolbar { display: flex; align-items: center; gap: 10px; padding: 12px 0; font-family: inherit; }
        
        .at-dropdown-wrap { position: relative; }
        .at-dropdown {
          position: absolute; top: 100%; left: 0; min-width: 300px; max-height: 400px; overflow-y: auto;
          background: #fff; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000; display: none; flex-direction: column;
        }
        .at-dropdown.open { display: flex; }
        .at-dropdown-item {
          padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 13px; color: #333; text-decoration: none;
          display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .at-dropdown-item:hover { background: #f5f5f5; color: #111; }
        .at-dropdown-item:last-child { border-bottom: none; }

        /* Buttons */
        .at-btn-summary, .at-clear, .at-banner {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer; border: 1px solid transparent;
        }
        
        .at-btn-summary.s { background: ${c.shortlist.bannerBg}; color: ${c.shortlist.text}; border-color: ${c.shortlist.bannerBorder}; }
        .at-btn-summary.s:hover { background: #d1fae5; }
        
        .at-btn-summary.d { background: ${c.discard.bannerBg}; color: ${c.discard.text}; border-color: ${c.discard.bannerBorder}; }
        .at-btn-summary.d:hover { background: #fee2e2; }

        .at-clear { background: ${c.neutral.bg}; color: ${c.neutral.text}; border-color: ${c.neutral.border}; }
        .at-clear:hover { background: ${c.neutral.hoverBg}; border-color: ${c.neutral.hoverBorder}; }

        /* Banner */
        .at-banner { display: flex; width: fit-content; margin-bottom: 8px; gap: 6px; }
        .at-banner.at-s { background: ${c.shortlist.bannerBg}; color: ${c.shortlist.text}; border: 1px solid ${c.shortlist.bannerBorder}; }
        .at-banner.at-d { background: ${c.discard.bannerBg}; color: ${c.discard.text}; border: 1px solid ${c.discard.bannerBorder}; }
      `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    },

    renderToolbar() {
      const mainSlot = document.querySelector('.s-main-slot');
      if (!mainSlot || document.querySelector('.at-toolbar')) return;

      const wrapper = document.createElement('div');
      wrapper.className = "at-toolbar";
      mainSlot.parentNode.insertBefore(wrapper, mainSlot);
      this.updateToolbar();

      // Toolbar Events
      wrapper.addEventListener('click', (e) => {
        if (e.target.closest('.at-clear')) {
          this.clearAll();
        } else if (e.target.closest('.at-btn-summary')) {
          const type = e.target.closest('.at-btn-summary').dataset.type;
          this.toggleDropdown(type);
        }
      });

      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.at-dropdown-wrap')) {
          document.querySelectorAll('.at-dropdown').forEach(el => el.classList.remove('open'));
        }
      });
    },

    updateToolbar() {
      const wrapper = document.querySelector('.at-toolbar');
      if (!wrapper) return;

      const { s, d, total } = this.getCounts();

      wrapper.innerHTML = `
        <div class="at-dropdown-wrap">
          <button class="at-btn-summary s" data-type="s">Shortlist (${s}) ▼</button>
          <div class="at-dropdown" id="at-drop-s"></div>
        </div>

        <div class="at-dropdown-wrap">
          <button class="at-btn-summary d" data-type="d">Discard (${d}) ▼</button>
          <div class="at-dropdown" id="at-drop-d"></div>
        </div>

        <button class="at-clear">Reset</button>
      `;
    },

    toggleDropdown(type) {
      const drop = document.getElementById(`at-drop-${type}`);
      if (!drop) return;

      const wasOpen = drop.classList.contains('open');
      document.querySelectorAll('.at-dropdown').forEach(el => el.classList.remove('open'));

      if (!wasOpen) {
        const items = this.getItemsByStatus(type);
        if (items.length === 0) {
          drop.innerHTML = '<div class="at-dropdown-item">No items</div>';
        } else {
          drop.innerHTML = items.map(i => `
            <a href="/dp/${i.asin}" class="at-dropdown-item" target="_blank" title="${i.title}">
              ${i.title}
            </a>
          `).join('');
        }
        drop.classList.add('open');
      }
    },

    initEvents() {
      document.addEventListener("click", (e) => {
        const btn = e.target.closest(".at-btn");
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest("div[data-asin]");
        if (!card) return;

        // Try to grab title
        const titleEl = card.querySelector("h2");
        const title = titleEl ? titleEl.textContent.trim() : card.getAttribute("data-asin");

        this.setStatus(card.getAttribute("data-asin"), btn.classList.contains("s") ? "s" : "d", title);
      });

      document.addEventListener("mouseover", (e) => {
        const card = e.target.closest("div[data-asin]");
        this.hoverAsin = card ? card.getAttribute("data-asin") : null;
      });

      document.addEventListener("keydown", (e) => {
        if (!this.hoverAsin || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
        const k = e.key.toLowerCase();

        let status = null;
        if (k === "s") status = "s";
        else if (k === "d") status = "d";
        else if (k === "x") status = null;
        else return;

        // Try to grab title from the hovered card
        const card = document.querySelector(`div[data-asin="${this.hoverAsin}"]`);
        const titleEl = card ? card.querySelector("h2") : null;
        const title = titleEl ? titleEl.textContent.trim() : this.hoverAsin;

        this.setStatus(this.hoverAsin, status, title);
      });
    },

    initObservers() {
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
              if (n.matches && n.matches('div[data-asin]')) this.processCard(n);
              n.querySelectorAll?.('div[data-asin]').forEach(el => this.processCard(el));
            }
          });
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      document.querySelectorAll('div[data-asin]').forEach(el => this.processCard(el));
    },

    checkDetailPage() {
      const asin = document.getElementById("ASIN")?.value;
      if (asin) {
        const item = this.getItem(asin);
        if (item) {
          const title = document.getElementById("productTitle");
          if (title) {
            const b = document.createElement("div");
            b.className = `at-banner at-${item.status}`;
            b.innerHTML = item.status === "s" ? "<span>★</span> Shortlisted" : "<span>✕</span> Discarded";
            title.parentNode.insertBefore(b, title);
          }
        }
      }
    }
  };

  Triage.init();
})();

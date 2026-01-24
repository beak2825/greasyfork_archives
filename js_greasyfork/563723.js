// ==UserScript==
// @name         AccountRefresh.top
// @namespace    accountrefresh.top
// @author       Armoire
// @version      1.2
// @description  Adds a floating button to retrieve and inject new account information using a paid credit system.
// @license      GNU AGPLv3
// @match        *://*.ome.tv/*
// @match        *://*.ometv.chat/*
// @match        *://*.minichat.com/*
// @match        *://*.chatalternative.com/*
// @connect      accountrefresh.top
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-end
// @antifeature  payment
// @downloadURL https://update.greasyfork.org/scripts/563723/AccountRefreshtop.user.js
// @updateURL https://update.greasyfork.org/scripts/563723/AccountRefreshtop.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BASE_URL = "https://accountrefresh.top/api";
  const LANDING_URL = "https://accountrefresh.top";
  const SYNC_TOKEN = "75e92b318d3748e7b877c7a127ecdaf1";

  const ICON_SHIELD_BLACK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E")`;
  const ICON_SHIELD_WHITE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E")`;

  let popupChecker = null;

  if (window.top !== window.self) return;

  const existingOverlay = document.getElementById("mm-overlay-container");
  if (existingOverlay) existingOverlay.remove();

  const cssStyles = `
      #mm-overlay-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        z-index: 2147483647;
        pointer-events: none;

        --mm-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
        --mm-bg: #f8fafc;
        --mm-card-bg: #ffffff;
        --mm-text: #0f172a;
        --mm-text-muted: #64748b;
        --mm-border: #e2e8f0;
        --mm-primary: #3b82f6;
        --mm-primary-hover: #2563eb;
        --mm-danger: #ef4444;
        --mm-success: #10b981;
      }

      #mm-overlay-container.dark-mode {
        --mm-bg: #1a1a1a;
        --mm-card-bg: #2a2a2a;
        --mm-text: #f1f5f9;
        --mm-text-muted: #94a3b8;
        --mm-border: #334155;
        --mm-primary: #60a5fa;
        --mm-primary-hover: #3b82f6;
      }

      #mm-overlay-container ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #mm-overlay-container ::-webkit-scrollbar-track {
        background: transparent;
      }

      #mm-overlay-container ::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 4px;
      }

      #mm-overlay-container ::-webkit-scrollbar-thumb:hover {
        background: #333333;
      }

      #mm-overlay-container.dark-mode ::-webkit-scrollbar-thumb:hover {
        background: #ffffff;
      }

      #mm-overlay-container * {
        all: unset;
        box-sizing: border-box;
        font-family: var(--mm-font);
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }

      #mm-overlay-container div {
        display: block;
      }
      #mm-overlay-container button {
        display: inline-block;
        cursor: pointer;
        text-align: center;
      }
      #mm-overlay-container span {
        display: inline;
      }
      #mm-overlay-container input {
        display: inline-block;
      }
      #mm-overlay-container ul {
        display: block;
      }
      #mm-overlay-container li {
        display: block;
      }

      #mm-overlay-container #mm-floating-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        bottom: auto;
        left: auto;
        width: 50px;
        height: 50px;
        background-color: var(--mm-bg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        pointer-events: auto;
        cursor: pointer;
        z-index: 2147483647;
        padding: 12px;
        transition: transform 0.1s;
      }
      #mm-overlay-container #mm-floating-btn .mm-icon {
        display: block;
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: ${ICON_SHIELD_BLACK};
      }
      #mm-overlay-container.dark-mode #mm-floating-btn .mm-icon {
        background-image: ${ICON_SHIELD_WHITE};
      }
      #mm-overlay-container #mm-floating-btn:active {
        transform: scale(0.95);
      }
      #mm-overlay-container #mm-floating-btn:hover {
        filter: brightness(1.1);
      }

      #mm-overlay-container .mm-window {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 380px;
        max-height: 80vh;
        background-color: var(--mm-bg);
        border: 1px solid var(--mm-border);
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: none !important;
        flex-direction: column;
        overflow: hidden;
        pointer-events: auto;
        color: var(--mm-text);
      }
      #mm-overlay-container.open .mm-window {
        display: flex !important;
      }

      #mm-overlay-container .mm-view {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;
        overflow-y: auto;
      }
      #mm-overlay-container .hidden {
        display: none !important;
      }

      #mm-overlay-container .mm-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #mm-overlay-container .mm-header-actions {
        display: flex;
        gap: 6px;
        align-items: center;
        user-select: none;
        -webkit-user-select: none;
      }

      #mm-overlay-container .mm-title {
        font-size: 16px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--mm-text);
        -webkit-user-select: none;
        user-select: none;
      }

      #mm-overlay-container .mm-inline-logo {
        width: 20px;
        height: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: ${ICON_SHIELD_BLACK};
      }

      #mm-overlay-container.dark-mode .mm-inline-logo {
        width: 20px;
        height: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: ${ICON_SHIELD_WHITE};
      }

      #mm-overlay-container .mm-card {
        background-color: var(--mm-card-bg);
        border: 1px solid var(--mm-border);
        border-radius: 8px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      #mm-overlay-container .mm-btn {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        border: none;
        transition: opacity 0.2s;
      }
      #mm-overlay-container .mm-btn:hover {
        opacity: 0.9;
      }

      #mm-overlay-container .mm-btn-primary {
        background-color: var(--mm-primary);
        color: #ffffff;
      }
      #mm-overlay-container .mm-btn-secondary {
        background-color: var(--mm-card-bg);
        border: 1px solid var(--mm-border);
        color: var(--mm-text);
      }
      #mm-overlay-container .mm-btn-ghost {
        background: transparent;
        color: var(--mm-text-muted);
        width: auto;
        padding: 6px;
        border-radius: 6px;
        min-width: 28px;
      }
      #mm-overlay-container .mm-btn-ghost:hover {
        background: var(--mm-border);
        color: var(--mm-text);
      }
      #mm-overlay-container .mm-btn-close:hover {
        background: var(--mm-danger) !important;
        color: #ffffff !important;
      }
      #mm-overlay-container .mm-btn-link {
        background: none;
        color: var(--mm-primary);
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        border: none;
        padding: 4px;
      }

      #mm-overlay-container .mm-pos-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 8px;
        margin-top: 4px;
      }
      #mm-overlay-container .mm-pos-btn {
        padding: 8px;
        background: var(--mm-card-bg);
        border: 1px solid var(--mm-border);
        border-radius: 6px;
        color: var(--mm-text-muted);
        font-size: 18px;
      }
      #mm-overlay-container .mm-pos-btn:hover {
        border-color: var(--mm-primary);
        color: var(--mm-primary);
      }
      #mm-overlay-container .mm-pos-btn.active {
        background: rgba(59, 130, 246, 0.1);
        border-color: var(--mm-primary);
        color: var(--mm-primary);
      }

      #mm-overlay-container .mm-input-group {
        margin-bottom: 8px;
      }
      #mm-overlay-container .mm-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--mm-text-muted);
        margin-bottom: 4px;
        display: block;
        pointer-events: none;
        -webkit-user-select: none;
        user-select: none;
      }
      #mm-overlay-container .mm-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }
      #mm-overlay-container .mm-input {
        width: 100%;
        padding: 8px 32px 8px 10px;
        border-radius: 6px;
        border: 1px solid var(--mm-border);
        background-color: var(--mm-card-bg);
        color: var(--mm-text);
        font-size: 13px;
        font-family: monospace;
      }
      #mm-overlay-container .mm-input:focus {
        outline: 2px solid var(--mm-primary);
        border-color: transparent;
      }
      #mm-overlay-container .mm-copy-btn {
        position: absolute;
        right: 4px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        font-size: 14px;
        opacity: 0.6;
        transition: opacity 0.2s;
      }
      #mm-overlay-container .mm-copy-btn:hover {
        opacity: 1;
        background: var(--mm-border);
        border-radius: 4px;
      }

      #mm-overlay-container .mm-list {
        list-style: none;
        border: 1px solid var(--mm-border);
        border-radius: 6px;
        background: var(--mm-card-bg);
        max-height: 150px;
        overflow-y: auto;
      }
      #mm-overlay-container .mm-list-item {
        padding: 8px 12px;
        border-bottom: 1px solid var(--mm-border);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        color: var(--mm-text);
        cursor: pointer;
      }
      #mm-overlay-container .mm-list-item:hover {
        background-color: var(--mm-bg);
      }
      #mm-overlay-container .mm-time {
        color: var(--mm-text-muted);
        font-size: 11px;
      }

      #mm-overlay-container .mm-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      #mm-overlay-container .mm-price-card {
        border: 1px solid var(--mm-border);
        border-radius: 8px;
        padding: 10px;
        background: var(--mm-card-bg);
        cursor: pointer;
        text-align: left;
        position: relative;
        display: block;
      }
      #mm-overlay-container .mm-price-card:hover {
        border-color: var(--mm-primary);
      }
      #mm-overlay-container .mm-price-main {
        font-size: 18px;
        font-weight: 800;
        color: var(--mm-text);
        display: block;
      }
      #mm-overlay-container .mm-price-sub {
        font-size: 12px;
        color: var(--mm-text-muted);
        display: block;
      }
      #mm-overlay-container .mm-badge {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(59, 130, 246, 0.1);
        color: var(--mm-primary);
        display: inline-block;
        margin-top: 4px;
        pointer-events: none;
        -webkit-user-select: none;
        user-select: none;
      }

      #mm-overlay-container .mm-switch-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
      }
      #mm-overlay-container .mm-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
      }
      #mm-overlay-container .mm-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      #mm-overlay-container .mm-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--mm-border);
        transition: 0.4s;
        border-radius: 34px;
      }
      #mm-overlay-container .mm-slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
      #mm-overlay-container input:checked + .mm-slider {
        background-color: var(--mm-primary);
      }
      #mm-overlay-container input:checked + .mm-slider:before {
        transform: translateX(16px);
      }

      #mm-overlay-container .mm-modal-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2147483647;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #mm-overlay-container .mm-modal {
        width: 280px;
        background: var(--mm-card-bg);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid var(--mm-border);
        text-align: center;
        color: var(--mm-text);
      }
      #mm-overlay-container .mm-modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 16px;
      }
  `;

  GM_addStyle(cssStyles);

  const container = document.createElement("div");
  container.id = "mm-overlay-container";
  container.innerHTML = `
      <div id="mm-floating-btn" title="Open Menu">
        <div class="mm-icon"></div>
      </div>

      <div class="mm-window">
        <div id="view-main" class="mm-view">
          <div class="mm-header">
            <div class="mm-title">
              <div class="mm-inline-logo"></div>
              AccountRefresh.top
            </div>
            <div class="mm-header-actions">
              <button class="mm-btn-ghost theme-toggle" title="Toggle Theme">
                🌙
              </button>
              <button
                id="btn-close"
                class="mm-btn-ghost mm-btn-close"
                title="Close Window"
              >
                ✕
              </button>
            </div>
          </div>
          <div class="mm-card">
            <button
              id="btn-refresh"
              class="mm-btn mm-btn-primary"
              title="Refresh Account"
            >
              <span>↻</span> Refresh Account
            </button>
            <button
              id="btn-settings"
              class="mm-btn mm-btn-secondary"
              title="Open Settings Menu"
            >
              <span>⚙️</span> Settings
            </button>
            <div
              id="msg-main"
              style="
                text-align: center;
                font-size: 11px;
                color: var(--mm-danger);
                min-height: 14px;
              "
            ></div>
          </div>
          <div style="flex-grow: 1; display: flex; flex-direction: column">
            <div class="mm-header">
              <span class="mm-label">Recent Accounts</span>
              <span
                class="mm-badge"
                style="
                  background: var(--mm-border);
                  color: var(--mm-text-muted);
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-size: 10px;
                "
                >Last 10 Accounts</span
              >
            </div>
            <ul id="list-history" class="mm-list"></ul>
          </div>
        </div>

        <div id="view-settings" class="mm-view hidden">
          <div class="mm-header">
            <div class="mm-title">
              <button id="nav-back-main" class="mm-btn-ghost" title="Go Back">
                ←
              </button>
              Settings
            </div>
            <div class="mm-header-actions">
              <button class="mm-btn-ghost theme-toggle">🌙</button>
              <button
                id="btn-close"
                class="mm-btn-ghost mm-btn-close"
                title="Close Window"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="mm-card">
            <div class="mm-switch-row">
              <span class="mm-label" style="margin: 0; font-size: 12px"
                >Auto-Refresh on Ban</span
              >
              <label class="mm-switch">
                <input type="checkbox" id="inp-autorefresh" />
                <span class="mm-slider"></span>
              </label>
            </div>
          </div>

          <div class="mm-card">
            <span class="mm-label">Button Position</span>
            <div class="mm-pos-grid">
              <button class="mm-pos-btn" data-pos="TL" title="Top Left">↖</button>
              <button class="mm-pos-btn" data-pos="TR" title="Top Right">↗</button>
              <button class="mm-pos-btn" data-pos="BL" title="Bottom Left">↙</button>
              <button class="mm-pos-btn" data-pos="BR" title="Bottom Right">↘</button>
            </div>
          </div>

          <div class="mm-card" style="align-items: center; text-align: center">
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              "
            >
              <span class="mm-label">Credits Balance</span>
              <button
                id="btn-refresh-credits"
                class="mm-btn-ghost"
                style="font-size: 20px; width: 40px; height: 40px"
                title="Refresh Balance"
              >
                ↻
              </button>
            </div>
            <div
              id="val-credits"
              style="font-size: 24px; font-weight: 800; color: var(--mm-text)"
            >
              --
            </div>
            <button
              id="nav-topup"
              class="mm-btn-link"
              title="Open Top Up Credits Menu"
            >
              Top Up Credits ↗
            </button>
          </div>

          <div class="mm-card">
            <form onsubmit="return false;">
              <div class="mm-input-group">
                <label class="mm-label">User ID</label>
                <div class="mm-input-wrapper">
                  <input
                    id="inp-userid"
                    type="password"
                    class="mm-input"
                    autocomplete=""
                    readonly
                  />
                  <button
                    id="btn-copy-userid"
                    class="mm-copy-btn"
                    title="Copy User ID"
                    type="button"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div class="mm-input-group">
                <label class="mm-label">API Key</label>
                <div class="mm-input-wrapper">
                  <input
                    id="inp-key"
                    type="password"
                    class="mm-input"
                    placeholder="sk-..."
                    autocomplete=""
                  />
                  <button
                    id="btn-copy-key"
                    class="mm-copy-btn"
                    title="Copy API Key"
                    type="button"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div style="display: flex; gap: 8px">
                <button
                  id="btn-gen-key"
                  class="mm-btn mm-btn-secondary"
                  title="Generate New API Key"
                  type="button"
                >
                  Generate
                </button>
                <button
                  id="btn-save"
                  class="mm-btn mm-btn-primary"
                  title="Save API Key"
                  type="button"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>

        <div id="view-topup" class="mm-view hidden">
          <div class="mm-header">
            <div class="mm-title">
              <button id="nav-back-settings" class="mm-btn-ghost" title="Go Back">
                ←
              </button>
              Add Credits
            </div>
            <div class="mm-header-actions">
              <button class="mm-btn-ghost theme-toggle">🌙</button>
              <button
                id="btn-close"
                class="mm-btn-ghost mm-btn-close"
                title="Close Window"
              >
                ✕
              </button>
            </div>
          </div>
          <div class="mm-grid">
            <button
              class="mm-price-card charge-btn"
              data-amt="1"
              title="Get 2 Credits for $1"
            >
              <div class="mm-price-main">$1</div>
              <div class="mm-price-sub">2 Credits</div>
            </button>
            <button
              class="mm-price-card charge-btn"
              data-amt="5"
              title="Get 15 Credits for $5"
            >
              <div class="mm-price-main">$5</div>
              <div class="mm-price-sub">15 Credits</div>
              <div class="mm-badge">+50% Value</div>
            </button>
            <button
              class="mm-price-card charge-btn"
              data-amt="10"
              title="Get 35 Credits for $10"
              style="
                border-color: var(--mm-primary);
                background: rgba(59, 130, 246, 0.05);
              "
            >
              <div class="mm-price-main">$10</div>
              <div class="mm-price-sub">35 Credits</div>
              <div class="mm-badge">+75% Value</div>
            </button>
            <button
              class="mm-price-card charge-btn"
              data-amt="20"
              title="Get 75 Credits for $20"
            >
              <div class="mm-price-main">$20</div>
              <div class="mm-price-sub">75 Credits</div>
              <div class="mm-badge">+88% Value</div>
            </button>
            <button
              class="mm-price-card charge-btn"
              data-amt="50"
              title="Get 200 Credits for $50"
            >
              <div class="mm-price-main">$50</div>
              <div class="mm-price-sub">200 Credits</div>
              <div class="mm-badge">DOUBLE CREDITS (+100%)</div>
            </button>
          </div>
          <div
            id="msg-topup"
            style="
              text-align: center;
              font-size: 11px;
              margin-top: 10px;
              color: var(--mm-text-muted);
            "
          ></div>
        </div>

        <div id="mm-modal" class="mm-modal-bg hidden">
          <div class="mm-modal">
            <h3
              id="modal-title"
              style="
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 8px;
                display: block;
              "
            >
              Confirm
            </h3>
            <p
              id="modal-msg"
              style="
                font-size: 13px;
                color: var(--mm-text-muted);
                margin-bottom: 16px;
                display: block;
              "
            >
              Sure?
            </p>
            <div class="mm-modal-actions">
              <button
                id="modal-cancel"
                class="mm-btn mm-btn-secondary"
                title="Cancel Action"
              >
                Cancel
              </button>
              <button
                id="modal-confirm"
                class="mm-btn mm-btn-primary"
                title="Confirm Action"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

  `;
  document.body.appendChild(container);

  const getEl = (id) => container.querySelector(`#${id}`);
  const getEls = (sel) => container.querySelectorAll(sel);

  const showView = (id) => {
    getEls(".mm-view").forEach((v) => v.classList.add("hidden"));
    getEl(id).classList.remove("hidden");
  };

  function setBtnPos(code) {
    const el = getEl("mm-floating-btn");
    const pad = "20px";
    const auto = "auto";

    el.style.top = auto;
    el.style.bottom = auto;
    el.style.left = auto;
    el.style.right = auto;

    switch (code) {
      case "TL":
        el.style.top = pad;
        el.style.left = pad;
        break;
      case "BL":
        el.style.bottom = pad;
        el.style.left = pad;
        break;
      case "BR":
      default:
        el.style.bottom = pad;
        el.style.right = pad;
        break;
      case "TR":
        el.style.top = pad;
        el.style.right = pad;
        break;
    }
    GM_setValue("btnPosCode", code);

    getEls(".mm-pos-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.pos === code);
    });
  }

  setBtnPos(GM_getValue("btnPosCode", "TR"));

  getEls(".mm-pos-btn").forEach((btn) => {
    btn.onclick = () => setBtnPos(btn.dataset.pos);
  });

  getEl("mm-floating-btn").onclick = () => {
    showView("view-main");
    container.classList.toggle("open");
  };

  function checkBanStatus() {
    const iframe = document.getElementById("videochat");
    let doc = null;
    if (iframe) {
      doc = iframe.contentDocument || iframe.contentWindow?.document;
    } else {
      doc = document;
    }

    if (!doc) return;

    const banPopup = doc.getElementById("BanPopup");
    const mobileBanPopup = doc.querySelector(".ban-popup.overlay.visible");

    if ((banPopup && banPopup.style.display === "block") || mobileBanPopup) {
      performAccountRefresh(true);
    }
  }

  function startMonitoring() {
    if (popupChecker) return;
    checkBanStatus();
    popupChecker = setInterval(checkBanStatus, 1000);
  }

  function stopMonitoring() {
    if (popupChecker) {
      clearInterval(popupChecker);
      popupChecker = null;
    }
  }

  const autoToggle = getEl("inp-autorefresh");
  autoToggle.onchange = () => {
    const isEnabled = autoToggle.checked;
    GM_setValue("autoRefresh", isEnabled);

    if (isEnabled) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  };

  function apiRequest(endpoint, method = "GET", body = null, apiKey = null) {
    return new Promise((resolve, reject) => {
      const headers = {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      };
      if (apiKey) headers["X-Api-Key"] = apiKey;
      GM_xmlhttpRequest({
        method,
        url: `${BASE_URL}${endpoint}`,
        headers,
        data: body ? JSON.stringify(body) : null,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            try {
              resolve(JSON.parse(res.responseText));
            } catch {
              reject("Bad JSON");
            }
          } else {
            try {
              reject(new Error(JSON.parse(res.responseText).detail || "Error"));
            } catch {
              reject(new Error("Status: " + res.status));
            }
          }
        },
        onerror: () => reject(new Error("Network Error")),
      });
    });
  }

  async function fetchInfo() {
    const k = GM_getValue("userApiKey", "");
    if (!k) return { credits: -1, user_id: null };
    try {
      return await apiRequest("/balance", "GET", null, k);
    } catch {
      return { credits: -1, user_id: null };
    }
  }

  function renderHistory() {
    const list = GM_getValue("accountHistory", []);
    const ul = getEl("list-history");
    ul.innerHTML = "";
    list.forEach((item) => {
      const li = document.createElement("li");
      li.className = "mm-list-item";
      li.innerHTML = `<span class="mm-time" title="Restore Account Generated at ${item.timestamp}">${item.timestamp}</span>`;
      li.onclick = async () => {
        const isAutoRefreshEnabled = getEl("inp-autorefresh").checked;
        if (isAutoRefreshEnabled) {
          if (
            await confirmAction(
              "WARNING: Auto Refresh Enabled",
              "If this account is banned, you will immediately spend a credit to refresh. Restore anyway?"
            )
          ) {
            clearSiteData(item.account, scrapeSettings());
          }
        } else {
          if (
            await confirmAction("Restore?", "Restore this account session?")
          ) {
            clearSiteData(item.account, scrapeSettings());
          }
        }
      };
      ul.appendChild(li);
    });
  }

  function clearSiteData(account, settings) {
    window.postMessage(
      {
        type: "RESET_SESSION_CONTEXT",
        token: SYNC_TOKEN,
        account,
        settings,
      },
      "*"
    );
  }

  window.addEventListener("message", (e) => {
    if (
      e.data?.type === "SESSION_RESET_COMPLETE" &&
      e.data.token === SYNC_TOKEN
    ) {
      const s = e.data.settings;
      localStorage.setItem("snid", e.data.account);
      if (s) {
        localStorage.setItem("selected_country", s.selected_country);
        localStorage.setItem("gender", s.gender);
        localStorage.setItem("language", s.language);
        localStorage.setItem("translate_messages", s.translate_messages);
      }
      location.reload();
    }
  });

  function scrapeSettings() {
    return {
      selected_country: localStorage.getItem("selected_country") || "ZZ",
      gender: localStorage.getItem("gender") || "0",
      language: localStorage.getItem("language") || "en",
      translate_messages: localStorage.getItem("translate_messages") === "true",
    };
  }

  const applyTheme = (isDark) => {
    isDark
      ? container.classList.add("dark-mode")
      : container.classList.remove("dark-mode");
    getEls(".theme-toggle").forEach(
      (b) => (b.textContent = isDark ? "☀️" : "🌙")
    );
  };
  getEls(".theme-toggle").forEach(
    (b) =>
      (b.onclick = () => {
        const d = !container.classList.contains("dark-mode");
        GM_setValue("darkMode", d);
        applyTheme(d);
      })
  );

  getEl("btn-settings").onclick = () => showView("view-settings");
  getEl("nav-back-main").onclick = () => showView("view-main");
  getEl("nav-topup").onclick = () => showView("view-topup");
  getEl("nav-back-settings").onclick = () => showView("view-settings");
  getEls(".mm-btn-close").forEach(
    (b) => (b.onclick = () => container.classList.remove("open"))
  );
  getEl("btn-refresh-credits").onclick = async () => {
    const info = await fetchInfo();
    getEl("val-credits").textContent = info.credits >= 0 ? info.credits : "--";
    getEl("inp-userid").value = info.user_id || "";
  };

  getEl("btn-copy-userid").onclick = () =>
    navigator.clipboard.writeText(getEl("inp-userid").value);
  getEl("btn-copy-key").onclick = () =>
    navigator.clipboard.writeText(getEl("inp-key").value);

  function confirmAction(title, msg) {
    return new Promise((resolve) => {
      const m = getEl("mm-modal");
      getEl("modal-title").textContent = title;
      getEl("modal-msg").textContent = msg;
      m.classList.remove("hidden");
      getEl("modal-confirm").onclick = () => {
        m.classList.add("hidden");
        resolve(true);
      };
      getEl("modal-cancel").onclick = () => {
        m.classList.add("hidden");
        resolve(false);
      };
    });
  }

  getEl("btn-gen-key").onclick = async () => {
    const k = GM_getValue("userApiKey", "");
    if (
      !k ||
      (await confirmAction(
        "Existing API Key Detected",
        "This will replace your existing API key and reset your credits to 0. Are you sure?"
      ))
    ) {
      try {
        getEl("btn-gen-key").textContent = "...";
        const d = await apiRequest("/register", "POST");
        GM_setValue("userApiKey", d.api_key);
        init();
      } catch (e) {
        alert(e.message);
      }
      getEl("btn-gen-key").textContent = "Generate";
    }
  };

  getEl("btn-save").onclick = async () => {
    const k = GM_getValue("userApiKey", "");
    const isSameKey = k === getEl("inp-key");
    if (
      !isSameKey &&
      (!k ||
        (await confirmAction(
          "Save API Key?",
          "Do you want to overwrite your current key and lose access to any existing credits?"
        )))
    ) {
      GM_setValue("userApiKey", getEl("inp-key").value);
      init();
    }
  };

  async function performAccountRefresh(isAuto = false) {
    if (!isAuto) {
      const confirmed = await confirmAction(
        "Refresh?",
        "This will spend 1 credit to generate new account data and clear your current cookies."
      );
      if (!confirmed) return;
    }

    stopMonitoring();

    const btn = getEl("btn-refresh");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = "Working...";
    }

    try {
      const d = await apiRequest(
        "/refresh",
        "POST",
        {},
        GM_getValue("userApiKey")
      );
      const h = GM_getValue("accountHistory", []);
      h.unshift({
        timestamp: new Date().toLocaleString(),
        account: d.account,
      });
      GM_setValue("accountHistory", h.slice(0, 10));

      clearSiteData(d.account, scrapeSettings());
    } catch (e) {
      const msgEl = getEl("msg-main");
      if (msgEl) msgEl.textContent = e.message;

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = "<span>↻</span> Refresh Account";
      }

      const isAuto = getEl("inp-autorefresh").checked;
      if (isAuto) startMonitoring();
    }
  }

  getEl("btn-refresh").onclick = async () => performAccountRefresh(false);

  getEls(".charge-btn").forEach((btn) => {
    btn.onclick = async () => {
      const amt = btn.dataset.amt;
      if (
        await confirmAction("Charge?", `Generate a payment link for $${amt}?`)
      ) {
        try {
          getEl("msg-topup").textContent = "Opening...";
          const d = await apiRequest(
            "/create-charge",
            "POST",
            { amount_usd: parseInt(amt) },
            GM_getValue("userApiKey")
          );
          const url = d.data?.hosted_url || d.url;
          if (url) {
            GM_openInTab(url, { active: true });
            getEl("msg-topup").textContent = "Opened tab.";
          }
        } catch (e) {
          getEl("msg-topup").textContent = e.message;
        }
      }
    };
  });

  async function init() {
    applyTheme(GM_getValue("darkMode", false));
    const k = GM_getValue("userApiKey", "");
    if (k) getEl("inp-key").value = k;

    const info = await fetchInfo();
    getEl("val-credits").textContent = info.credits >= 0 ? info.credits : "--";
    getEl("inp-userid").value = info.user_id || "";

    renderHistory();

    const savedAutoRefresh = GM_getValue("autoRefresh", false);
    autoToggle.checked = savedAutoRefresh;
    if (savedAutoRefresh) {
      startMonitoring();
    }

    const firstRunComplete = GM_getValue("firstRunComplete", false);
    if (!firstRunComplete) {
      GM_openInTab(LANDING_URL, { active: true });
      GM_setValue("firstRunComplete", true);
    }
  }
  init();
})();
// ==UserScript==
// @name         Skyskraber Core
// @namespace    local.skyskraber.core
// @version      1.3.0
// @description  Core module providing websocket access and indicator management
// @match        https://www.skyskraber.dk/chat*
// @match        https://skyskraber.dk/chat*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563007/Skyskraber%20Core.user.js
// @updateURL https://update.greasyfork.org/scripts/563007/Skyskraber%20Core.meta.js
// ==/UserScript==

(() => {
  "use strict";

  let wsRef = null;
  let canvas = null;
  let indicatorExpanded = false;
  const VERSION = "1.3.0";

  console.log(`[Core] Script loaded, version ${VERSION}`);

  // Use window reference so all script instances share the same indicator
  const getIndicator = () => window.SkyskraberCoreIndicator;
  const setIndicator = (el) => { window.SkyskraberCoreIndicator = el; };

  const messageListeners = [];
  const sendListeners = [];
  const indicatorButtons = []; // { label, callback }

  /******************************************************************
   * PUBLIC API - Define early so modules can access it immediately
   ******************************************************************/
  window.SkyskraberCore = {
    /**
     * Register a listener for incoming websocket messages
     * @param {Function} callback - Called with (msg) for each message
     */
    onMessage(callback) {
      messageListeners.push(callback);
    },

    /**
     * Register a listener for outgoing websocket messages
     * @param {Function} callback - Called with (msg) for each sent message
     */
    onSend(callback) {
      sendListeners.push(callback);
    },

    /**
     * Send a message through the websocket
     * @param {Object} msg - The message object to send
     */
    send(msg) {
      if (!wsRef) return false;
      try {
        wsRef.send(JSON.stringify(msg));
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Add a button to the indicator control panel
     * @param {string} label - Button label
     * @param {Function} callback - Callback when button is clicked
     */
    addIndicatorButton(label, callback) {
      indicatorButtons.push({ label, callback });
    },

    /**
     * Check if websocket is connected
     */
    isConnected() {
      return wsRef !== null;
    }
  };

  /******************************************************************
   * CANVAS
   ******************************************************************/
  async function waitForCanvas() {
    console.log('[Core] waitForCanvas called');
    while (!canvas) {
      canvas = document.querySelector("canvas[tabindex='1']");
      await new Promise(r => setTimeout(r, 300));
    }
  }

  /******************************************************************
   * WEBSOCKET HOOK
   ******************************************************************/
  (function hookWebSocketSend() {
    console.log('[Core] hookWebSocketSend called');
    const nativeSend = WebSocket.prototype.send;

    WebSocket.prototype.send = function (...args) {
      try {
        if (!wsRef) {
          wsRef = this;
          attachMessageListener(wsRef);
          updateIndicatorColor();
        }

        const msg = JSON.parse(args[0]);
        for (const listener of sendListeners) {
          const propagate = listener(msg);

          if (propagate === false) {
            return false;
          }
        }

        return nativeSend.call(this, ...args);
      } catch { }
    };
  })();

  /******************************************************************
   * MESSAGE LISTENER
   ******************************************************************/
  function attachMessageListener(ws) {
    console.log('[Core] attachMessageListener called');
    ws.addEventListener("message", e => {
      try {
        const msg = JSON.parse(e.data);

        // Notify all message listeners
        for (const listener of messageListeners) {
          listener(msg);
        }
      } catch { }
    });
  }

  /******************************************************************
   * INDICATOR
   ******************************************************************/
  function updateIndicatorColor() {
    console.log('[Core] updateIndicatorColor called');
    const indicator = getIndicator();
    if (!indicator) return;
    const color = wsRef ? "#15803D" : "#555";
    indicator.style.background = color;
  }

  function createIndicator() {
    console.log('[Core] createIndicator called');
    // Only create if it hasn't been created yet in this session
    if (window.SkyskraberCoreIndicatorCreated) {
      console.log("[Core] Indicator creation skipped - already created");
      return;
    }
    console.log("[Core] Creating indicator for first time");
    window.SkyskraberCoreIndicatorCreated = true;

    // Check if it already exists in the DOM
    let existing = document.querySelector("[data-skyskraber-core-indicator]");
    if (existing) {
      console.log("[Core] Found existing indicator in DOM");
      setIndicator(existing);
      return;
    }

    console.log("[Core] Creating new indicator div");
    const indicator = document.createElement("div");
    indicator.setAttribute("data-skyskraber-core-indicator", "true");
    indicator.style.cssText = `
      position: fixed;
      top: 5px;
      left: 5px;
      padding: 3px 5px;
      font: 600 8px Arial, sans-serif;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      z-index: 9999;
      user-select: none;
      background: #555;
    `;
    indicator.textContent = `Core ${VERSION}`;

    indicator.addEventListener("click", handleIndicatorClick);

    console.log("[Core] About to append indicator to canvas.parentElement", canvas.parentElement);
    canvas.parentElement.appendChild(indicator);
    console.log("[Core] Indicator appended, setting reference");
    setIndicator(indicator);
    console.log("[Core] Indicator reference set");
  }

  function handleIndicatorClick(e) {
    console.log('[Core] handleIndicatorClick called', e);
    // If clicking the header in expanded view, collapse it
    if (e.target.closest(".core-indicator-header")) {
      collapseIndicator();
      return;
    }

    // Otherwise, toggle expansion
    indicatorExpanded = !indicatorExpanded;
    if (indicatorExpanded) {
      expandIndicator();
    } else {
      collapseIndicator();
    }
  }

  function expandIndicator() {
    console.log('[Core] expandIndicator called');
    const indicator = getIndicator();
    if (!indicator) return;

    indicatorExpanded = true;

    // Set expanded styling
    indicator.style.cssText = `
      position: fixed;
      top: 5px;
      left: 5px;
      padding: 5px;
      font: 600 8px Arial, sans-serif;
      border-radius: 5px;
      color: white;
      z-index: 9999;
      user-select: none;
      background: ${wsRef ? "#15803D" : "#555"};
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 100px;
    `;

    // Clear and rebuild content
    indicator.innerHTML = `
      <div class="core-indicator-header" style="text-align: center; padding-bottom: 3px; border-bottom: 1px solid rgba(255,255,255,0.3); cursor: pointer;">Core</div>
    `;

    // Add buttons
    for (const btn of indicatorButtons) {
      const buttonEl = document.createElement("button");
      buttonEl.textContent = btn.label;
      buttonEl.style.cssText = `
        padding: 2px 4px;
        font: 600 8px Arial, sans-serif;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 3px;
        color: white;
        cursor: pointer;
        transition: background 0.2s;
        font-weight: bold;
        font-size: 8px;
      `;

      buttonEl.addEventListener("mouseover", () => {
        buttonEl.style.background = "rgba(255,255,255,0.3)";
      });

      buttonEl.addEventListener("mouseout", () => {
        buttonEl.style.background = "rgba(255,255,255,0.2)";
      });

      buttonEl.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.callback();
      });

      indicator.appendChild(buttonEl);
    }
  }

  function collapseIndicator() {
    console.log('[Core] collapseIndicator called');
    const indicator = getIndicator();
    if (!indicator) return;

    indicatorExpanded = false;

    indicator.style.cssText = `
      position: fixed;
      top: 5px;
      left: 5px;
      padding: 3px 5px;
      font: 600 8px Arial, sans-serif;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      z-index: 9999;
      user-select: none;
      background: ${wsRef ? "#15803D" : "#555"};
    `;
    indicator.textContent = `Core ${VERSION}`;
  }

  /******************************************************************
   * INIT
   ******************************************************************/
  async function start() {
    console.log('[Core] start called');
    await waitForCanvas();
    createIndicator();
  }

  console.log('[Core] IIFE executing, about to call start()');
  start();
})();

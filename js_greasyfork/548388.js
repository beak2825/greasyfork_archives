// ==UserScript==
// @name         Torn War Chat Highlighter
// @namespace    smitty.torn.tools
// @version      2.8
// @description  Highlight DIBS, HOLD, TURTLE, CHAIN, or PUSH (ALL CAPS) in Torn chat. Toggle per keyword via gear icon.
// @author       Smitty
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548388/Torn%20War%20Chat%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/548388/Torn%20War%20Chat%20Highlighter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "tornWarChatHighlighter_opts_v24";

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveSettings(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  const KEYWORDS = [
    { key: "dibs", regex: /\bDIBS\b/, label: "DIBS", className: "kw-dibs" },
    { key: "hold", regex: /\bHOLD\b/, label: "HOLD", className: "kw-hold" },
    { key: "turtle", regex: /\bTURTLE\b/, label: "TURTLE", className: "kw-turtle" },
    { key: "chain", regex: /\bCHAIN\b/, label: "CHAIN", className: "kw-chain" },
    { key: "push", regex: /\bPUSH\b/, label: "PUSH", className: "kw-push" },
  ];

  let settings = Object.assign(
    { dibs: true, hold: true, turtle: true, chain: true, push: true, panelVisible: false },
    loadSettings()
  );

  const CHAT_MESSAGE_SELECTORS = [
    '[class*="message"]',
    '[class*="msg"]',
    '[data-message-id]',
    'li[class*="message"]',
    'div[class*="chat"] [class*="message"]',
  ];

  const style = document.createElement("style");
  style.textContent = `
    .torn-chat-war-highlight { border-radius: 4px; padding: 2px; }

    .kw-dibs   { outline: 0px solid #f57f17; background: rgba(245, 127, 23, 0.65); }  /* amber-orange */
    .kw-hold   { outline: 0px solid #e53935; background: rgba(229, 57, 53, 0.65); }  /* red */
    .kw-turtle { outline: 0px solid #039be5; background: rgba(3, 155, 229, 0.65); }  /* blue */
    .kw-chain  { outline: 0px solid #8e24aa; background: rgba(142, 36, 170, 0.65); } /* purple */
    .kw-push   { outline: 0px solid #d32f2f; background: rgba(211, 47, 47, 0.65); }   /* deep red */

    #warhl-gear {
      position: fixed; top: 45px; right: 10px; z-index: 99999;
      width: 28px; height: 28px; line-height: 26px; text-align: center;
      border-radius: 6px; border: 1px solid #666; cursor: pointer;
      background: rgba(30,30,30,0.85); color: #eee; font-size: 16px;
      user-select: none;
    }
    #warhl-panel {
      position: fixed; top: 79px; right: 10px; z-index: 99999;
      background: rgba(30,30,30,0.92); color: #eee; font-size: 12px;
      border: 1px solid #666; border-radius: 6px; padding: 6px 8px;
      font-family: sans-serif; min-width: 120px; display: none;
      user-select: none;
    }
    #warhl-panel label { display: block; cursor: pointer; margin: 2px 0; }
    #warhl-panel input { margin-right: 6px; }
    #warhl-panel .hint { font-size: 11px; opacity: 0.8; margin-top: 4px; }

    @media (prefers-color-scheme: light) {
      #warhl-gear { background: rgba(250,250,250,0.92); color: #222; border-color: #bbb; }
      #warhl-panel { background: rgba(250,250,250,0.95); color: #222; border-color: #bbb; }
    }
  `;
  document.head.appendChild(style);

  const gear = document.createElement("div");
  gear.id = "warhl-gear";
  gear.title = "War highlight options";
  gear.textContent = "⚙";
  document.body.appendChild(gear);

  const panel = document.createElement("div");
  panel.id = "warhl-panel";
  panel.innerHTML = `
    <div style="font-weight:600; margin-bottom:4px;">Highlights</div>
    <div class="opts"></div>
    <div class="hint">Unchecked = disabled</div>
  `;
  const opts = panel.querySelector(".opts");
  KEYWORDS.forEach(k => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!settings[k.key];
    cb.addEventListener("change", () => {
      settings[k.key] = cb.checked;
      saveSettings(settings);
      reapplyAll();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(k.label));
    opts.appendChild(label);
  });
  document.body.appendChild(panel);

  function applyPanelVisibility() {
    panel.style.display = settings.panelVisible ? "block" : "none";
  }

  gear.addEventListener("click", () => {
    settings.panelVisible = !settings.panelVisible;
    saveSettings(settings);
    applyPanelVisibility();
  });

  applyPanelVisibility();

  const PROCESSED_FLAG = "data-warhl-checked";

  function processMessageEl(el, force = false) {
    if (!el) return;
    if (!force && el.getAttribute(PROCESSED_FLAG) === "1") return;

    // Clean existing highlight classes
    el.classList.remove("torn-chat-war-highlight", ...KEYWORDS.map(k => k.className));

    const text = el.textContent;
    for (const k of KEYWORDS) {
      if (settings[k.key] && k.regex.test(text)) {
        el.classList.add("torn-chat-war-highlight", k.className);
        break;
      }
    }

    el.setAttribute(PROCESSED_FLAG, "1");
  }

  function scanExisting(force = false) {
    try {
      CHAT_MESSAGE_SELECTORS.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          if (el.textContent?.trim().length > 0 && el.textContent.length < 2000)
            processMessageEl(el, force);
        });
      });
    } catch (e) {
      console.warn("Chat highlighter skipped scan due to error:", e);
    }
  }

  function reapplyAll() {
    scanExisting(true);
  }

  if (!document.documentElement) return;

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        CHAT_MESSAGE_SELECTORS.forEach((sel) => {
          if (node.matches?.(sel)) processMessageEl(node);
          node.querySelectorAll?.(sel).forEach((el) => processMessageEl(el));
        });
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  scanExisting();
  let rescans = 0;
  const rescanTimer = setInterval(() => {
    scanExisting();
    if (++rescans >= 5) clearInterval(rescanTimer);
  }, 1200);
})();
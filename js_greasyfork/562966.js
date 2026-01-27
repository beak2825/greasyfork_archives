// ==UserScript==
// @name         Gemini Response Collapse for Quick Navigation
// @namespace    https://mekineer.com
// @version      0.2
// @description  Collapse long Gemini responses. Click the user message to expand the corresponding response. Adds Collapse/Expand buttons.
// @author       mekineer and Nova (ChatGPT 5.2 Thinking).  Concept: John Chi.
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562966/Gemini%20Response%20Collapse%20for%20Quick%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/562966/Gemini%20Response%20Collapse%20for%20Quick%20Navigation.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const CFG = {
    collapsedMaxHeightPx: 140,   // visible height when collapsed
    minHeightToCollapsePx: 220,  // don't collapse short replies
    autoCollapseNew: false,       // auto-collapse new/changed responses
  };

  // ---------- styles ----------
  const style = document.createElement("style");
  style.textContent = `
    .gmz-collapsed {
      max-height: ${CFG.collapsedMaxHeightPx}px !important;
      overflow: hidden !important;
      position: relative !important;
      border-bottom: 2px solid rgba(59,130,246,.25);
      transition: max-height 180ms ease;
    }
    .gmz-collapsed::after {
      content: "Click the user message above to expand";
      position: absolute;
      left: 0; right: 0; bottom: 0;
      height: 48px;
      background: linear-gradient(transparent, rgba(59,130,246,.12));
      display: flex;
      align-items: flex-end;
      padding: 8px 10px;
      font-size: 12px;
      pointer-events: none;
    }
    .gmz-panel {
      position: fixed;
      right: 14px;
      bottom: 90px;
      z-index: 999999;
      display: flex;
      gap: 8px;
      font: 13px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    .gmz-btn {
      background: rgba(0,0,0,.65);
      color: #fff;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 999px;
      padding: 8px 10px;
      cursor: pointer;
      user-select: none;
    }
    .gmz-btn:hover { filter: brightness(1.08); }
    .gmz-btn[data-on="0"] { opacity: .55; }
  `;
  document.documentElement.appendChild(style);

  // ---------- helpers ----------
  const isLongEnough = (el) => (el && el.scrollHeight >= CFG.minHeightToCollapsePx);

  function getResponseContent(modelResponseEl) {
    if (!modelResponseEl) return null;

    // most consistent on your captured page:
    // <structured-content-container class="model-response-text ...">
    return (
      modelResponseEl.querySelector("structured-content-container.model-response-text") ||
      modelResponseEl.querySelector(".model-response-text") ||
      modelResponseEl.querySelector("message-content .markdown") ||
      null
    );
  }

  let uqToContent = new WeakMap();

  function rebuildPairs() {
    const root =
      document.querySelector("chat-window") ||
      document.querySelector("share-viewer") ||
      document.body;

    const nodes = Array.from(root.querySelectorAll("user-query, model-response"));
    const newMap = new WeakMap();

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].tagName !== "USER-QUERY") continue;

      // find next MODEL-RESPONSE after this USER-QUERY
      let j = i + 1;
      while (j < nodes.length && nodes[j].tagName !== "MODEL-RESPONSE") j++;

      if (j >= nodes.length) continue;

      const content = getResponseContent(nodes[j]);
      if (content) newMap.set(nodes[i], content);
    }

    uqToContent = newMap;
  }

  function collapseContent(content) {
    if (!content) return;
    if (!isLongEnough(content)) return;
    content.classList.add("gmz-collapsed");
  }

  function expandContent(content) {
    if (!content) return;
    content.classList.remove("gmz-collapsed");
  }

  function collapseAll() {
    rebuildPairs();
    document.querySelectorAll("model-response").forEach((mr) => collapseContent(getResponseContent(mr)));
  }

  function expandAll() {
    document.querySelectorAll(".gmz-collapsed").forEach((el) => el.classList.remove("gmz-collapsed"));
  }

  function toggleFromUserQuery(uqEl) {
    const content = uqToContent.get(uqEl);
    if (!content) return;

    if (content.classList.contains("gmz-collapsed")) expandContent(content);
    else collapseContent(content);
  }

  // ---------- UI ----------
  function ensurePanel() {
    if (document.querySelector(".gmz-panel")) return;

    const panel = document.createElement("div");
    panel.className = "gmz-panel";

    const btnCollapse = document.createElement("div");
    btnCollapse.className = "gmz-btn";
    btnCollapse.textContent = "Collapse all";
    btnCollapse.title = "Collapse all long responses";
    btnCollapse.addEventListener("click", () => collapseAll());

    const btnExpand = document.createElement("div");
    btnExpand.className = "gmz-btn";
    btnExpand.textContent = "Expand all";
    btnExpand.title = "Expand all responses";
    btnExpand.addEventListener("click", () => expandAll());

    const btnAuto = document.createElement("div");
    btnAuto.className = "gmz-btn";
    btnAuto.textContent = "Auto";
    btnAuto.dataset.on = CFG.autoCollapseNew ? "1" : "0";
    btnAuto.title = "Auto-collapse new long responses";
    btnAuto.addEventListener("click", () => {
      CFG.autoCollapseNew = !CFG.autoCollapseNew;
      btnAuto.dataset.on = CFG.autoCollapseNew ? "1" : "0";
    });

    panel.append(btnCollapse, btnExpand, btnAuto);
    document.body.appendChild(panel);
  }

  // ---------- click behavior: click USER message -> toggle its MODEL response ----------
  function onDocumentClick(e) {
    // don’t toggle when selecting text
    if (window.getSelection()?.toString()?.trim()) return;

    const uq = e.target.closest("user-query");
    if (!uq) return;

    // ignore clicks on obvious controls/links inside the bubble
    if (e.target.closest("button, a, input, textarea, mat-icon")) return;

    rebuildPairs();
    toggleFromUserQuery(uq);
  }

  // ---------- observer / init ----------
  let debounceTimer = null;
  function scheduleUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      ensurePanel();
      rebuildPairs();

      if (CFG.autoCollapseNew) {
        document.querySelectorAll("model-response").forEach((mr) => collapseContent(getResponseContent(mr)));
      }
    }, 150);
  }

  function start() {
    ensurePanel();
    rebuildPairs();

    document.addEventListener("click", onDocumentClick, true);

    const obs = new MutationObserver(scheduleUpdate);
    obs.observe(document.body, { childList: true, subtree: true });

    // first pass
    scheduleUpdate();
  }

  start();
})();

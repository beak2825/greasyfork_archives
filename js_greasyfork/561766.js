// ==UserScript==
// @name         ChatGPT Optimizer, Remove lag by trimming In-Memory Conversation History.
// @namespace    skylimits.chatgpt.trimmer
// @version      0.6
// @description  Trims huge conversation payloads for performance. Adds a bottom-right collapsible vertical menu to load older messages in safe increments.
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// Created by    FunkyCrunchy

// @downloadURL https://update.greasyfork.org/scripts/561766/ChatGPT%20Optimizer%2C%20Remove%20lag%20by%20trimming%20In-Memory%20Conversation%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/561766/ChatGPT%20Optimizer%2C%20Remove%20lag%20by%20trimming%20In-Memory%20Conversation%20History.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const DEBUG = false;
  const DEFAULT_KEEP_LAST = 40;
  const STEP = 20;
  const SOFT_CAP = 400;
  const UI_RIGHT = "14px";
  const UI_BOTTOM = "90px";
  const KEY_KEEP_LAST = "cgpt_pruner_keep_last";
  const KEY_DISABLE_ONCE = "cgpt_pruner_disable_once";
  const w = unsafeWindow;

  function log(...args) {
    if (DEBUG) console.log("[ChatGPT Trimmer]", ...args);
  }

  function getKeepLast() {
    const raw = w.localStorage.getItem(KEY_KEEP_LAST);
    const n = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_KEEP_LAST;
  }

  function setKeepLast(n) {
    w.localStorage.setItem(KEY_KEEP_LAST, String(n));
  }

  function shouldDisableOnce() {
    return w.sessionStorage.getItem(KEY_DISABLE_ONCE) === "1";
  }

  function setDisableOnce(val) {
    if (val) w.sessionStorage.setItem(KEY_DISABLE_ONCE, "1");
    else w.sessionStorage.removeItem(KEY_DISABLE_ONCE);
  }

  function shouldIntercept(url) {
    return /conversation/i.test(url);
  }

  function trimConversationPayload(json, keepLast) {
    try {
      if (!json || typeof json !== "object") return json;

      const mapping = json.mapping;
      const current = json.current_node;

      if (!mapping || typeof mapping !== "object" || !current || !mapping[current]) {
        return json;
      }


      const path = [];
      let nodeId = current;
      const seen = new Set();

      while (nodeId && mapping[nodeId] && !seen.has(nodeId)) {
        seen.add(nodeId);
        path.push(nodeId);
        nodeId = mapping[nodeId].parent;
      }


      const keepIds = new Set(path.slice(0, keepLast));
      const newMapping = {};

      for (const id of keepIds) {
        const node = mapping[id];
        if (!node) continue;

        const copy = { ...node };


        if (Array.isArray(copy.children)) {
          copy.children = copy.children.filter((ch) => keepIds.has(ch));
        }


        if (copy.parent && !keepIds.has(copy.parent)) {
          copy.parent = null;
        }

        newMapping[id] = copy;
      }

      const before = Object.keys(mapping).length;
      const after = Object.keys(newMapping).length;
      if (after < before) log(`Trimmed mapping ${before} -> ${after} (keepLast=${keepLast})`);

      return { ...json, mapping: newMapping };
    } catch (e) {
      log("Trim failed:", e);
      return json;
    }
  }


  const originalFetch = w.fetch?.bind(w);
  if (!originalFetch) return;

  const keepLastNow = getKeepLast();


  const trimmingEnabled = !shouldDisableOnce();
  if (!trimmingEnabled) {

    setDisableOnce(false);
    log("Trimming disabled for this reload (one-time).");
  }

  w.fetch = async (...args) => {
    const res = await originalFetch(...args);

    try {
      if (!trimmingEnabled) return res;

      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0] && typeof args[0] === "object"
          ? args[0].url || ""
          : "";

      if (!shouldIntercept(url)) return res;

      const clone = res.clone();
      const ct = clone.headers.get("content-type") || "";
      if (!ct.includes("application/json")) return res;

      const data = await clone.json();
      const trimmed = trimConversationPayload(data, keepLastNow);


      if (data?.mapping && trimmed?.mapping) {
        const sameSize = Object.keys(data.mapping).length === Object.keys(trimmed.mapping).length;
        if (sameSize) return res;
      }

      const body = JSON.stringify(trimmed);
      const headers = new w.Headers(res.headers);

      return new w.Response(body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
    } catch {
      return res;
    }
  };


  function addUI() {
    try {
      const existing = w.document.getElementById("cgpt-trimmer-ui");
      if (existing) return;

      const ui = w.document.createElement("div");
      ui.id = "cgpt-trimmer-ui";
      ui.style.position = "fixed";
      ui.style.right = UI_RIGHT;
      ui.style.bottom = UI_BOTTOM;
      ui.style.zIndex = "999999";
      ui.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ui.style.fontSize = "12px";
      ui.style.color = "white";
      ui.style.userSelect = "none";


      const panel = w.document.createElement("div");
      panel.id = "cgpt-trimmer-panel";
      panel.style.display = "flex";
      panel.style.flexDirection = "column";
      panel.style.gap = "8px";
      panel.style.padding = "10px";
      panel.style.borderRadius = "14px";
      panel.style.backdropFilter = "blur(10px)";
      panel.style.background = "rgba(0,0,0,0.55)";
      panel.style.border = "1px solid rgba(255,255,255,0.12)";
      panel.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
      panel.style.minWidth = "170px";


      const toggle = w.document.createElement("button");
      toggle.id = "cgpt-trimmer-toggle";
      toggle.style.display = "flex";
      toggle.style.alignItems = "center";
      toggle.style.justifyContent = "space-between";
      toggle.style.gap = "10px";
      toggle.style.width = "100%";
      toggle.style.padding = "8px 10px";
      toggle.style.borderRadius = "12px";
      toggle.style.border = "1px solid rgba(255,255,255,0.18)";
      toggle.style.background = "rgba(255,255,255,0.10)";
      toggle.style.color = "white";
      toggle.style.cursor = "pointer";
      toggle.style.fontSize = "12px";

      const title = w.document.createElement("span");
      const caret = w.document.createElement("span");
      caret.style.opacity = "0.9";


      const body = w.document.createElement("div");
      body.id = "cgpt-trimmer-body";
      body.style.display = "flex";
      body.style.flexDirection = "column";
      body.style.gap = "8px";

      const label = w.document.createElement("div");
      label.id = "cgpt-trimmer-label";
      label.style.opacity = "0.9";

      function mkBtn(text) {
        const b = w.document.createElement("button");
        b.textContent = text;
        b.style.padding = "8px 10px";
        b.style.borderRadius = "12px";
        b.style.border = "1px solid rgba(255,255,255,0.18)";
        b.style.background = "rgba(255,255,255,0.10)";
        b.style.color = "white";
        b.style.cursor = "pointer";
        b.style.fontSize = "12px";
        b.style.textAlign = "left";
        return b;
      }

      const older = mkBtn(`Load older (+${STEP})`);
      older.onclick = () => {
        const cur = getKeepLast();
        setKeepLast(cur + STEP);
        w.location.reload();
      };

      const reset = mkBtn("Reset (fast)");
      reset.onclick = () => {
        setKeepLast(DEFAULT_KEEP_LAST);
        w.location.reload();
      };

      const full = mkBtn("Full history (slow)");
      full.onclick = () => {
        setDisableOnce(true);
        w.location.reload();
      };

      body.appendChild(label);
      body.appendChild(older);
      body.appendChild(reset);
      body.appendChild(full);

      toggle.appendChild(title);
      toggle.appendChild(caret);

      panel.appendChild(toggle);
      panel.appendChild(body);

      ui.appendChild(panel);
      w.document.documentElement.appendChild(ui);


      const OPEN_KEY = "cgpt_trimmer_ui_open";
      let isOpen = w.sessionStorage.getItem(OPEN_KEY) === "1";


      isOpen = false;

      function refreshText() {
        const keep = getKeepLast();
        label.textContent = keep > SOFT_CAP ? `History: last ${keep} (may lag)` : `History: last ${keep}`;
        title.textContent = `History: last ${keep}`;
        caret.textContent = isOpen ? "▾" : "▸";
      }

      function applyOpenState() {
        body.style.display = isOpen ? "flex" : "none";
        panel.style.minWidth = isOpen ? "170px" : "auto";
        panel.style.padding = isOpen ? "10px" : "0";
        toggle.style.borderRadius = isOpen ? "12px" : "999px";
        toggle.style.padding = isOpen ? "8px 10px" : "8px 12px";
        refreshText();
        w.sessionStorage.setItem(OPEN_KEY, isOpen ? "1" : "0");
      }

      toggle.onclick = () => {
        isOpen = !isOpen;
        applyOpenState();
      };

      applyOpenState();
    } catch (e) {
      log("UI failed:", e);
    }
  }


  const uiTimer = w.setInterval(() => {
    if (w.document?.body) {
      w.clearInterval(uiTimer);
      addUI();
    }
  }, 200);

  log(`Fetch interceptor installed. keepLast=${keepLastNow} enabled=${trimmingEnabled}`);
})();

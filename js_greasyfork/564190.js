// ==UserScript==
// @name         Liverpool Spoiler Cleaner (Fast) w/ Mini Logo Panel
// @namespace    https://greasyfork.org/users/your-user-id
// @version      1.1.1
// @description  Toggle to remove all numbers and spoiler words from visible page text. Faster (no flash) + mini collapsed logo.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564190/Liverpool%20Spoiler%20Cleaner%20%28Fast%29%20w%20Mini%20Logo%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/564190/Liverpool%20Spoiler%20Cleaner%20%28Fast%29%20w%20Mini%20Logo%20Panel.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /***********************
   * Defaults / Storage
   ***********************/
  const DEFAULT_WORDS = [
    "win","wins","won","lose","loses","lost","draw","draws","drew",
    "defeat","defeats","defeated","beat","beats","beaten","stun","stuns","stunned",
    "upset","upsets","thrash","thrashes","thrashed","rout","routs","routed",
    "hammer","hammers","hammered","crush","crushes","crushed","edge","edges","edged",
    "goal","goals","scores","scored","scorer","scorers","brace","hat-trick","hattrick","hat trick",
    "clean sheet","winner","late winner","equaliser","equalizer","opener","opening goal","own goal",
    "full-time","full time","ft","half-time","half time","ht","injury-time","injury time",
    "stoppage-time","stoppage time","added time","final whistle","final score","result","results",
    "match report","highlights","recap","reaction","penalties","penalty","extra time","extra-time","aet"
  ];

  const state = {
    enabled: GM_getValue("enabled", false),
    removeNumbers: GM_getValue("removeNumbers", true),
    removeWords: GM_getValue("removeWords", true),
    words: GM_getValue("words", DEFAULT_WORDS),
    panelX: GM_getValue("panelX", 16),
    panelY: GM_getValue("panelY", 16),
    collapsed: GM_getValue("collapsed", false)
  };

  /***********************
   * CSS (works at document-start)
   ***********************/
  GM_addStyle(`
    #lsc-panel, #lsc-mini {
      position: fixed;
      z-index: 2147483647;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      user-select: none;
    }

    /* Full panel */
    #lsc-panel {
      width: 320px;
      color: #111827;
      background: rgba(255,255,255,0.96);
      border: 1px solid rgba(17,24,39,0.12);
      box-shadow: 0 12px 30px rgba(0,0,0,0.18);
      border-radius: 14px;
      overflow: hidden;
      backdrop-filter: blur(8px);
    }
    #lsc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      background: linear-gradient(135deg, rgba(255,75,75,0.20), rgba(255,255,255,0));
      cursor: move;
    }
    #lsc-title { display:flex; flex-direction:column; line-height:1.1; }
    #lsc-title strong { font-size: 13px; }
    #lsc-title span { font-size: 11px; opacity: 0.7; }
    #lsc-actions { display:flex; gap:6px; align-items:center; }
    .lsc-btn {
      border: 1px solid rgba(17,24,39,0.12);
      background: #fff;
      border-radius: 10px;
      padding: 6px 9px;
      font-size: 12px;
      cursor: pointer;
    }
    .lsc-btn:hover { background: rgba(17,24,39,0.04); }

    #lsc-body { padding: 10px 12px 12px; }
    .lsc-row { display:flex; align-items:center; justify-content:space-between; gap:10px; margin:8px 0; }
    .lsc-row label { font-size: 12px; opacity: 0.85; }

    .lsc-switch {
      width: 46px; height: 26px;
      background: rgba(17,24,39,0.12);
      border-radius: 999px;
      position: relative;
      cursor: pointer;
      flex: 0 0 auto;
      border: 1px solid rgba(17,24,39,0.12);
    }
    .lsc-switch[data-on="true"] { background: rgba(255,75,75,0.55); border-color: rgba(255,75,75,0.55); }
    .lsc-knob {
      position:absolute; top:50%; transform:translateY(-50%);
      left:3px; width:20px; height:20px; border-radius:999px;
      background:white; box-shadow:0 4px 10px rgba(0,0,0,0.18);
      transition:left 0.15s ease;
    }
    .lsc-switch[data-on="true"] .lsc-knob { left:23px; }

    #lsc-words {
      width:100%; height:110px; resize:vertical;
      border-radius:10px; border:1px solid rgba(17,24,39,0.14);
      padding:8px; font-size:12px; line-height:1.3; outline:none;
    }
    #lsc-help { font-size:11px; opacity:0.7; margin-top:8px; line-height:1.3; }
    #lsc-status { font-size:11px; opacity:0.75; margin-top:6px; }

    /* Mini collapsed button (Liverpool-ish) */
    #lsc-mini {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), rgba(255,75,75,0.95));
      border: 1px solid rgba(255,255,255,0.35);
      box-shadow: 0 10px 22px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    #lsc-mini span {
      color: white;
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.35);
    }
    #lsc-mini[data-on="true"] { outline: 2px solid rgba(255,75,75,0.35); }
  `);

  /***********************
   * Fast no-flash option
   ***********************/
  // If enabled, hide page immediately; show after first pass
  const PREVENT_FLASH = true;
  if (PREVENT_FLASH) {
    try { document.documentElement.style.visibility = "hidden"; } catch (_) {}
  }

  /***********************
   * Core processing
   ***********************/
  const originalText = new WeakMap(); // TextNode -> original string

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function buildWordRegex(words) {
    const cleaned = (words || []).map(w => (w || "").toString().trim()).filter(Boolean);
    if (!cleaned.length) return null;
    cleaned.sort((a,b) => b.length - a.length);

    const parts = cleaned.map(w => {
      const isPhrase = /[\s-]/.test(w);
      return isPhrase ? escapeRegExp(w) : `\\b${escapeRegExp(w)}\\b`;
    });

    return new RegExp(parts.join("|"), "gi");
  }

  function transformText(text, wordRegex) {
    let out = text;
    if (state.removeNumbers) out = out.replace(/\d+/g, "");
    if (state.removeWords && wordRegex) out = out.replace(wordRegex, "");
    out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?;:])/g, "$1");
    return out;
  }

  function isSkippableTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return false;
    const tag = parent.tagName?.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "noscript") return true;
    if (parent.isContentEditable) return true;
    return false;
  }

  function processAllTextNodes() {
    const wordRegex = buildWordRegex(state.words);

    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (isSkippableTextNode(n)) continue;
      nodes.push(n);
    }

    if (!state.enabled) {
      for (const node of nodes) {
        if (originalText.has(node)) node.nodeValue = originalText.get(node);
      }
      return;
    }

    for (const node of nodes) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const base = originalText.get(node);
      const transformed = transformText(base, wordRegex);
      if (node.nodeValue !== transformed) node.nodeValue = transformed;
    }
  }

  /***********************
   * Observer for dynamic pages
   ***********************/
  let pending = false;
  const observer = new MutationObserver(() => {
    if (!state.enabled) return;
    if (pending) return;
    pending = true;
    // small debounce to avoid thrashing
    setTimeout(() => {
      pending = false;
      processAllTextNodes();
      updateStatus();
    }, 60);
  });

  function startObserver() {
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  /***********************
   * UI: Full panel + mini button
   ***********************/
  function createSwitch(isOn, onToggle) {
    const sw = document.createElement("div");
    sw.className = "lsc-switch";
    sw.dataset.on = isOn ? "true" : "false";
    const knob = document.createElement("div");
    knob.className = "lsc-knob";
    sw.appendChild(knob);
    sw.addEventListener("click", () => {
      const now = sw.dataset.on !== "true";
      sw.dataset.on = now ? "true" : "false";
      onToggle(now);
    });
    return sw;
  }

  const panel = document.createElement("div");
  panel.id = "lsc-panel";

  const header = document.createElement("div");
  header.id = "lsc-header";

  const title = document.createElement("div");
  title.id = "lsc-title";
  title.innerHTML = `<strong>Liverpool Spoiler Cleaner</strong><span>Remove numbers + spoiler words</span>`;

  const actions = document.createElement("div");
  actions.id = "lsc-actions";

  const applyBtn = document.createElement("button");
  applyBtn.className = "lsc-btn";
  applyBtn.textContent = "Apply";

  const collapseBtn = document.createElement("button");
  collapseBtn.className = "lsc-btn";
  collapseBtn.textContent = "Collapse"; // FIXED: always has text

  actions.appendChild(applyBtn);
  actions.appendChild(collapseBtn);

  header.appendChild(title);
  header.appendChild(actions);

  const body = document.createElement("div");
  body.id = "lsc-body";

  // Enabled
  const rowEnable = document.createElement("div");
  rowEnable.className = "lsc-row";
  const enableLabel = document.createElement("label");
  enableLabel.textContent = "Enabled";
  const enableSwitch = createSwitch(state.enabled, (val) => {
    state.enabled = val;
    GM_setValue("enabled", val);
    processAllTextNodes();
    updateStatus();
    updateMini();
  });
  rowEnable.appendChild(enableLabel);
  rowEnable.appendChild(enableSwitch);

  // Remove numbers
  const rowNums = document.createElement("div");
  rowNums.className = "lsc-row";
  const numsLabel = document.createElement("label");
  numsLabel.textContent = "Remove numbers (0–9)";
  const numsSwitch = createSwitch(state.removeNumbers, (val) => {
    state.removeNumbers = val;
    GM_setValue("removeNumbers", val);
    if (state.enabled) processAllTextNodes();
    updateStatus();
  });
  rowNums.appendChild(numsLabel);
  rowNums.appendChild(numsSwitch);

  // Remove words
  const rowWords = document.createElement("div");
  rowWords.className = "lsc-row";
  const wordsLabel = document.createElement("label");
  wordsLabel.textContent = "Remove spoiler words/phrases";
  const wordsSwitch = createSwitch(state.removeWords, (val) => {
    state.removeWords = val;
    GM_setValue("removeWords", val);
    if (state.enabled) processAllTextNodes();
    updateStatus();
  });
  rowWords.appendChild(wordsLabel);
  rowWords.appendChild(wordsSwitch);

  const textarea = document.createElement("textarea");
  textarea.id = "lsc-words";
  textarea.value = (state.words || []).join("\n");
  textarea.placeholder = "One word or phrase per line…";

  const saveRow = document.createElement("div");
  saveRow.className = "lsc-row";
  const saveBtn = document.createElement("button");
  saveBtn.className = "lsc-btn";
  saveBtn.textContent = "Save";
  const resetBtn = document.createElement("button");
  resetBtn.className = "lsc-btn";
  resetBtn.textContent = "Reset";
  saveRow.appendChild(saveBtn);
  saveRow.appendChild(resetBtn);

  const help = document.createElement("div");
  help.id = "lsc-help";
  help.innerHTML = `
    <b>No-flash mode:</b> runs at <code>document-start</code> and briefly hides the page to prevent flicker.
    <br/>Edits <b>visible text</b> (headings, cite, etc.). Avoids breaking sites by not touching link/image attributes.
  `;

  const status = document.createElement("div");
  status.id = "lsc-status";

  function updateStatus() {
    const parts = [];
    parts.push(state.enabled ? "ON" : "OFF");
    if (state.enabled) {
      parts.push(state.removeNumbers ? "numbers removed" : "numbers kept");
      parts.push(state.removeWords ? "words removed" : "words kept");
      parts.push(`${(state.words || []).length} terms`);
    }
    status.textContent = parts.join(" • ");
  }

  applyBtn.addEventListener("click", () => {
    processAllTextNodes();
    updateStatus();
  });

  saveBtn.addEventListener("click", () => {
    const list = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);
    state.words = list;
    GM_setValue("words", list);
    if (state.enabled) processAllTextNodes();
    updateStatus();
    saveBtn.textContent = "Saved ✓";
    setTimeout(() => (saveBtn.textContent = "Save"), 800);
  });

  resetBtn.addEventListener("click", () => {
    state.words = DEFAULT_WORDS.slice();
    textarea.value = state.words.join("\n");
    GM_setValue("words", state.words);
    if (state.enabled) processAllTextNodes();
    updateStatus();
  });

  body.appendChild(rowEnable);
  body.appendChild(rowNums);
  body.appendChild(rowWords);
  body.appendChild(textarea);
  body.appendChild(saveRow);
  body.appendChild(help);
  body.appendChild(status);

  panel.appendChild(header);
  panel.appendChild(body);

  // Mini collapsed button
  const mini = document.createElement("div");
  mini.id = "lsc-mini";
  mini.innerHTML = `<span>LFC</span>`;

  function positionEl(el) {
    el.style.left = `${state.panelX}px`;
    el.style.top = `${state.panelY}px`;
  }
  positionEl(panel);
  positionEl(mini);

  function showMini() {
    panel.remove();
    document.documentElement.appendChild(mini);
  }
  function showPanel() {
    mini.remove();
    document.documentElement.appendChild(panel);
  }

  function setCollapsed(collapsed) {
    state.collapsed = collapsed;
    GM_setValue("collapsed", collapsed);
    if (collapsed) showMini();
    else showPanel();
  }

  function updateMini() {
    mini.dataset.on = state.enabled ? "true" : "false";
    mini.title = state.enabled ? "Spoiler Cleaner: ON (click to open)" : "Spoiler Cleaner: OFF (click to open)";
  }

  collapseBtn.addEventListener("click", () => setCollapsed(true));
  mini.addEventListener("click", () => setCollapsed(false));

  // Draggable (works for both panel and mini)
  function makeDraggable(handleEl, targetEl) {
    let dragging = false;
    let startX = 0, startY = 0;
    let originX = 0, originY = 0;

    handleEl.addEventListener("mousedown", (e) => {
      // If clicking a button in header, don't drag
      if (e.target && e.target.closest("button")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      originX = parseInt(targetEl.style.left, 10) || 0;
      originY = parseInt(targetEl.style.top, 10) || 0;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const x = Math.max(0, originX + dx);
      const y = Math.max(0, originY + dy);
      targetEl.style.left = `${x}px`;
      targetEl.style.top = `${y}px`;
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      const x = parseInt(targetEl.style.left, 10) || 0;
      const y = parseInt(targetEl.style.top, 10) || 0;
      state.panelX = x; state.panelY = y;
      GM_setValue("panelX", x);
      GM_setValue("panelY", y);

      // Keep the other UI element aligned when swapped
      if (targetEl === panel) positionEl(mini);
      if (targetEl === mini) positionEl(panel);
    });
  }

  makeDraggable(header, panel);
  makeDraggable(mini, mini);

  /***********************
   * Init
   ***********************/
  function initUI() {
    updateStatus();
    updateMini();
    if (state.collapsed) showMini();
    else showPanel();
  }

  // Run observer early
  startObserver();

  // Wait for DOM to exist enough to attach UI + run first pass
  const ready = () => {
    initUI();

    // First pass immediately
    if (state.enabled) processAllTextNodes();
    updateStatus();
    updateMini();

    // Reveal page after first pass to avoid flash
    if (PREVENT_FLASH) {
      try { document.documentElement.style.visibility = ""; } catch (_) {}
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();

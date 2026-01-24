// ==UserScript==
// @name         ChatGPT Canvas Search
// @namespace    https://tampermonkey.net/
// @license      GPLv2
// @version      0.1
// @description  Ctrl+Alt+F: open a search window for ChatGPT-Canvas
// @author       you
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563771/ChatGPT%20Canvas%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/563771/ChatGPT%20Canvas%20Search.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ==========================================
  // Canvas editor discovery (Canvas mode only)
  // ==========================================
  function isInChatComposer(el) {
    return (
      !!el?.closest?.("footer") ||
      !!el?.closest?.('[data-testid*="prompt" i],[data-testid*="composer" i]')
    );
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function pickBestCmEditor() {
    const editors = Array.from(document.querySelectorAll(".cm-editor"))
      .filter((ed) => !isInChatComposer(ed))
      .filter(isVisible);

    if (!editors.length) return null;

    const ae = document.activeElement;
    const focused = ae?.closest?.(".cm-editor");
    if (focused && editors.includes(focused)) return focused;

    if (lastCanvasEditor && editors.includes(lastCanvasEditor)) return lastCanvasEditor;

    if (editors.length === 1) return editors[0];

    // Prefer the largest visible editor (Canvas is typically the big one).
    let best = editors[0];
    let bestArea = 0;
    for (const ed of editors) {
      const r = ed.getBoundingClientRect();
      const area = r.width * r.height;
      if (area > bestArea) {
        bestArea = area;
        best = ed;
      }
    }
    return best;
  }

  // ---------- UI ----------
  const UI_ID = "canvas-addon-search-ui";
  const STYLE_ID = "canvas-addon-search-style";
  let ui = null;
  let ctxAtOpen = null; // snapshot of the focused canvas editor context
  let lastCanvasEditor = null; // last focused Canvas editor (.cm-editor)

  // ---------- Find state (per popup session) ----------
  let lastQuery = "";
  let lastCtxRoot = null;
  let lastFrom = 0; // next search starts here (forward) / before this (backward)
  let lastMatch = null; // { from, to, text }

  // ---------- Highlight overlay (current match) ----------
  const HL_WRAP_ID = "canvas-addon-highlight-wrap";
  let hlWrap = null;
  let hlRaf = 0;

  function ensureHighlightWrap() {
    if (hlWrap && hlWrap.isConnected) return hlWrap;
    hlWrap = document.getElementById(HL_WRAP_ID);
    if (hlWrap && hlWrap.isConnected) return hlWrap;

    const el = document.createElement("div");
    el.id = HL_WRAP_ID;
    document.body.appendChild(el);
    hlWrap = el;
    return hlWrap;
  }

  function clearHighlight() {
    if (!hlWrap || !hlWrap.isConnected) return;
    hlWrap.innerHTML = "";
  }

  function drawHighlightRects(rects) {
    const wrap = ensureHighlightWrap();
    wrap.innerHTML = "";

    for (const r of rects) {
      if (!r) continue;
      const w = r.width ?? (r.right - r.left);
      const h = r.height ?? (r.bottom - r.top);
      if (!(w > 0 && h > 0)) continue;

      const d = document.createElement("div");
      d.className = "hl";
      d.style.left = Math.round(r.left) + "px";
      d.style.top = Math.round(r.top) + "px";
      d.style.width = Math.max(1, Math.round(w)) + "px";
      d.style.height = Math.max(1, Math.round(h)) + "px";
      wrap.appendChild(d);
    }
  }

  function getRectsForMatch(ctx, match) {
    if (!ctx || !match) return [];

    // CodeMirror path
    if (ctx.kind === "chatgpt-canvas-cm6" && ctx.view?.coordsAtPos && ctx.view?.state?.doc) {
      const doc = ctx.view.state.doc;
      const rects = [];

      let pos = match.from;
      while (pos < match.to) {
        const line = doc.lineAt(pos);
        const segFrom = pos;
        const segTo = Math.min(match.to, line.to);

        const a = ctx.view.coordsAtPos(segFrom);
        const b = ctx.view.coordsAtPos(segTo);

        if (a && b) {
          const left = Math.min(a.left, a.right, b.left, b.right);
          const right = Math.max(a.left, a.right, b.left, b.right);
          rects.push({
            left,
            top: a.top,
            width: Math.max(1, right - left),
            height: Math.max(1, a.bottom - a.top),
          });
        }

        pos = line.to + 1;
      }

      return rects;
    }

    // DOM path
    if (ctx.kind === "chatgpt-canvas-dom" && ctx.content?.isContentEditable) {
      const range = document.createRange();
      const ok = setRangeByTextOffsets(ctx.content, range, match.from, match.to);
      if (!ok) return [];
      return Array.from(range.getClientRects()).map((r) => ({
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      }));
    }

    return [];
  }

  function applyHighlight(ctx, match) {
    if (!match) return;
    const rects = getRectsForMatch(ctx, match);
    drawHighlightRects(rects);
  }

  function scheduleHighlightRefresh() {
    if (!lastMatch || !ctxAtOpen) return;
    if (hlRaf) return;

    hlRaf = requestAnimationFrame(() => {
      hlRaf = 0;
      try {
        const ctx = getCanvasEditorContext() || ctxAtOpen;
        if (!ctx) return;
        ctxAtOpen = ctx;
        applyHighlight(ctx, lastMatch);
      } catch (_) {}
    });
  }


  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #canvas-addon-highlight-wrap{
        position: fixed;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        z-index: 2147483646;
        pointer-events: none;
      }
      #canvas-addon-highlight-wrap .hl{
        position: fixed;
        background: rgba(255, 255, 0, 0.55);
        border-radius: 3px;
        pointer-events: none;
      }
      #${UI_ID}{
        position: fixed;
        top: 16px;
        right: 16px;
        width: 360px;
        z-index: 2147483647;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        background: rgba(20,20,20,.92);
        color: #fff;
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,.45);
        padding: 12px;
        display: none;
        backdrop-filter: blur(6px);
      }
      #${UI_ID} .hdr{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      #${UI_ID} .title{
        font-weight: 650;
        font-size: 13px;
        letter-spacing: .2px;
        opacity: .95;
        user-select:none;
      }
      #${UI_ID} .close{
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(255,255,255,.06);
        color: #fff;
        border-radius: 8px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
      }
      #${UI_ID} .close:hover{ background: rgba(255,255,255,.10); }
      #${UI_ID} .row{
        display:flex;
        gap: 8px;
        align-items:center;
      }
      #${UI_ID} input{
        width: 100%;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,.18);
        padding: 8px 10px;
        background: rgba(255,255,255,.06);
        color: #fff;
        outline: none;
        font-size: 13px;
      }
      #${UI_ID} input:focus{
        border-color: rgba(255,255,255,.35);
        box-shadow: 0 0 0 2px rgba(255,255,255,.10);
      }
      #${UI_ID} button{
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(255,255,255,.06);
        color: #fff;
        border-radius: 8px;
        padding: 8px 10px;
        cursor: pointer;
        font-size: 13px;
        white-space: nowrap;
      }
      #${UI_ID} button:hover{ background: rgba(255,255,255,.10); }
      #${UI_ID} .hint{
        margin-top: 8px;
        font-size: 11px;
        opacity: .75;
        line-height: 1.25;
        user-select:none;
      }
      #${UI_ID} .status{
        margin-top: 6px;
        font-size: 12px;
        opacity: .9;
        min-height: 16px;
      }
      #${UI_ID} .kbd{
        display:inline-block;
        padding: 1px 6px;
        border: 1px solid rgba(255,255,255,.18);
        border-bottom-color: rgba(255,255,255,.28);
        border-radius: 6px;
        background: rgba(0,0,0,.25);
        font-size: 11px;
        margin: 0 2px;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureUI() {
    // ChatGPT is an SPA; route changes / rerenders can remove our injected DOM.
    // If that happens, recreate the UI on demand.
    if (ui && (!ui.root?.isConnected || document.getElementById(UI_ID) !== ui.root)) {
      ui = null;
    }
    if (ui) return ui;
    ensureStyle();

    const root = document.createElement("div");
    root.id = UI_ID;
    root.innerHTML = `
      <div class="hdr">
        <div class="title">Canvas Search</div>
        <button class="close" type="button" title="Close (Esc)">✕</button>
      </div>
      <div class="row">
        <input type="text" placeholder="Enter text..." />
      </div>
      <div class="row" style="margin-top:8px;">
        <button class="prev" type="button">Find previous</button>
        <button class="next" type="button">Find next</button>
        <button class="clear" type="button">Clear</button>
      </div>
      <div class="status" aria-live="polite"></div>
      <div class="hint">
        Tips: <span class="kbd">Enter</span> next • <span class="kbd">Shift</span>+<span class="kbd">Enter</span> previous • <span class="kbd">Esc</span> closes • shortcut: <span class="kbd">Ctrl</span>+<span class="kbd">Alt</span>+<span class="kbd">F</span>
      </div>
    `;

    document.body.appendChild(root);

    const input = root.querySelector("input");
    const btnPrev = root.querySelector("button.prev");
    const btnNext = root.querySelector("button.next");
    const btnClear = root.querySelector("button.clear");
    const btnClose = root.querySelector("button.close");
    const status = root.querySelector(".status");

    function setStatus(msg) {
      status.textContent = msg || "";
    }

    btnClose.addEventListener("click", () => closeUI());

    btnClear.addEventListener("click", () => {
      input.value = "";
      input.focus();

      // Reset cursor/state.
      lastQuery = "";
      lastMatch = null;
      lastFrom = 0;
      lastCtxRoot = ctxAtOpen?.root || lastCtxRoot;
      clearHighlight();

      setStatus("Cleared.");
    });

    btnNext.addEventListener("click", () => {
      doFindFromUI(1, input.value, setStatus);
    });

    btnPrev.addEventListener("click", () => {
      doFindFromUI(-1, input.value, setStatus);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Enter = Find next, Shift+Enter = Find previous
        doFindFromUI(e.shiftKey ? -1 : 1, input.value, setStatus);
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeUI();
      }
    });

    ui = { root, input, setStatus };
    return ui;
  }

  function openUI(context) {
    const { root, input, setStatus } = ensureUI();
    ctxAtOpen = context;
    root.style.display = "block";
    setStatus("Ready. Type text, then Find next/previous.");
    input.focus();
    input.select();

    // Reset find cursor whenever the popup is opened.
    lastQuery = "";
    lastCtxRoot = context?.root || null;
    lastFrom = 0;
    lastMatch = null;
  }

  function closeUI() {
    if (!ui?.root?.isConnected) return;
    ui.root.style.display = "none";
    ui.setStatus("");
    clearHighlight();
    try {
      ctxAtOpen?.focus?.();
    } catch (_) {}
  }

  function isUIOpen() {
    if (!ui?.root?.isConnected) return false;
    return getComputedStyle(ui.root).display !== "none";
  }

  // =======================================
  // ChatGPT Canvas detection (CodeMirror 6)
  // =======================================
  function readTextByWalker(root) {
    // IMPORTANT:
    // Do NOT use innerText here. innerText may include layout-induced line breaks
    // (soft-wrapping), which shifts indices and causes selection to land after the match.
    // Using a TreeWalker keeps indexing consistent with setRangeByTextOffsets().
    let out = "";
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      out += walker.currentNode.nodeValue || "";
    }
    return out;
  }

  function findEditorView(cmEditor, content) {
    // ChatGPT/Canvas can store the CodeMirror EditorView under varying property names.
    // We try known hooks first, then fall back to a safe brute scan of DOM element properties.

    const scroller = cmEditor?.querySelector?.(".cm-scroller") || null;

    function unwrapCandidate(c) {
      if (!c) return null;
      const v = c?.view && typeof c.view.dispatch === "function" ? c.view : c;
      if (v?.state?.doc && typeof v.dispatch === "function") return v;
      return null;
    }

    // 1) Known hooks
    const directCandidates = [
      content?.cmView,
      scroller?.cmView,
      cmEditor?.cmView,
      content?.view,
      scroller?.view,
      cmEditor?.view,
      content?._view,
      scroller?._view,
      cmEditor?._view,
    ];

    for (const c of directCandidates) {
      const v = unwrapCandidate(c);
      if (v) return v;
    }

    // 2) Brute scan: own properties (including symbols) on likely elements/ancestors.
    const scanTargets = [
      content,
      scroller,
      cmEditor,
      cmEditor?.parentElement,
      cmEditor?.parentElement?.parentElement,
    ].filter(Boolean);

    for (const el of scanTargets) {
      for (const k of Object.getOwnPropertyNames(el)) {
        let val;
        try {
          val = el[k];
        } catch (_) {
          continue;
        }
        const v = unwrapCandidate(val);
        if (v) return v;
      }

      for (const sym of Object.getOwnPropertySymbols(el)) {
        let val;
        try {
          val = el[sym];
        } catch (_) {
          continue;
        }
        const v = unwrapCandidate(val);
        if (v) return v;
      }
    }

    return null;
  }

  function scrollMatchIntoView(view, from, to) {
    const scrollDOM = view?.scrollDOM || view?.dom?.querySelector?.(".cm-scroller") || null;
    if (!scrollDOM || typeof scrollDOM.getBoundingClientRect !== "function") return;

    const pad = 20;

    const tryScroll = () => {
      const a = view.coordsAtPos?.(from);
      const b = view.coordsAtPos?.(to);
      if (!a || !b) return false;

      const vr = scrollDOM.getBoundingClientRect();
      const left = Math.min(a.left, a.right, b.left, b.right);
      const right = Math.max(a.left, a.right, b.left, b.right);
      const top = Math.min(a.top, b.top);
      const bottom = Math.max(a.bottom, b.bottom);

      let dx = 0;
      let dy = 0;

      if (left < vr.left + pad) dx = left - (vr.left + pad);
      else if (right > vr.right - pad) dx = right - (vr.right - pad);

      if (top < vr.top + pad) dy = top - (vr.top + pad);
      else if (bottom > vr.bottom - pad) dy = bottom - (vr.bottom - pad);

      if (dx) scrollDOM.scrollLeft += dx;
      if (dy) scrollDOM.scrollTop += dy;

      return !!(dx || dy);
    };

    // Eerst meteen, dan nog eens na een frame (na render/virtualisatie).
    tryScroll();
    requestAnimationFrame(() => {
      tryScroll();
    });
  }

  function buildContextFromCmEditor(cmEditor) {
    const content = cmEditor.querySelector?.(".cm-content") || null;
    if (!content) return null;

    // Try to find the real CodeMirror EditorView (Needed for full tekst + working scroll)
    const view = findEditorView(cmEditor, content);

    // Use ONE source of truth for BOTH reading and selecting.
    // If we can reliably use CodeMirror's doc + dispatch, do that.
    // Otherwise fall back to DOM-walker reading + DOM range selection.
    const canUseCM = !!(view?.state?.doc && typeof view.dispatch === "function");

    if (canUseCM) {
      return {
        kind: "chatgpt-canvas-cm6",
        root: cmEditor,
        content,
        view,
        getText: () => view.state.doc.toString(),
        selectRange: (from, to) => {
          view.dispatch({
            selection: { anchor: from, head: to },
            scrollIntoView: true,
          });
          // Extra: forceer zowel verticale als horizontale scroll in de editor.
          scrollMatchIntoView(view, from, to);
          return true;
        },
        describePos: (index) => {
          const line = view.state.doc.lineAt(index);
          const col = index - line.from + 1;
          return { line: line.number, col };
        },
        focus: () => {
          view.focus?.();
          cmEditor.focus?.();
        },
      };
    }

    // DOM fallback mode (no CM dispatch/doc available): keep text + selection indexed the same way.
    return {
      kind: "chatgpt-canvas-dom",
      root: cmEditor,
      content,
      view: null,
      getText: () => readTextByWalker(content),
      selectRange: (from, to) => {
        if (!content.isContentEditable) return false;
        const range = document.createRange();
        const sel = window.getSelection();
        const ok = setRangeByTextOffsets(content, range, from, to);
        if (!ok) return false;
        sel.removeAllRanges();
        sel.addRange(range);
        range.startContainer?.parentElement?.scrollIntoView?.({ block: "center" });
        return true;
      },
      describePos: (_index) => null,
      focus: () => content.focus(),
    };
  }

  function getCanvasEditorContext() {
    const cmEditor = pickBestCmEditor();
    if (!cmEditor) return null;
    lastCanvasEditor = cmEditor;
    return buildContextFromCmEditor(cmEditor);
  }

  // Helper: select offsets in a contenteditable root by walking text nodes
  function setRangeByTextOffsets(root, range, start, end) {
    let cur = 0;
    let startNode = null;
    let startOffset = 0;
    let endNode = null;
    let endOffset = 0;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const len = node.nodeValue?.length || 0;

      if (!startNode && cur + len >= start) {
        startNode = node;
        startOffset = Math.max(0, start - cur);
      }
      if (!endNode && cur + len >= end) {
        endNode = node;
        endOffset = Math.max(0, end - cur);
        break;
      }
      cur += len;
    }

    if (!startNode) return false;
    if (!endNode) {
      endNode = startNode;
      endOffset = startOffset;
    }

    try {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      return true;
    } catch (_) {
      return false;
    }
  }

  // ---------- Searching ----------
  function normalizeQuery(rawInput) {
    return String(rawInput || "").trim();
  }

  // Literal (non-regex) searching.
  // Using indexOf/lastIndexOf ensures characters like (), ., [, ] are treated literally.

  function findNextOccurrence(text, query, startIndex) {
    const start = Math.max(0, startIndex || 0);
    const idx = text.indexOf(query, start);
    if (idx === -1) return null;
    return { from: idx, to: idx + query.length, text: query };
  }

  function findPrevOccurrence(text, query, beforeIndex) {
    const limit = Math.max(0, Math.min(beforeIndex ?? text.length, text.length));
    // lastIndexOf searches backwards from (limit - 1)
    const idx = text.lastIndexOf(query, Math.max(0, limit - 1));
    if (idx === -1) return null;
    return { from: idx, to: idx + query.length, text: query };
  }

  function doFindFromUI(direction, rawInput, setStatus) {
    const query = normalizeQuery(rawInput);

    // Refresh context while popup is open (Canvas can rerender).
    const ctx = getCanvasEditorContext() || ctxAtOpen;
    if (!ctx) {
      setStatus("No Canvas editor found.");
      return;
    }
    ctxAtOpen = ctx;

    if (!query) {
      setStatus("Enter text to search.");
      return;
    }

    const text = ctx.getText?.() ?? "";
    if (!text) {
      setStatus("Couldn’t read Canvas text.");
      return;
    }

    const limitedNote = ctx.kind === "chatgpt-canvas-dom" ? " (limited to currently-rendered content)" : "";

    // Reset cursor when switching editors or changing query.
    if (ctx.root !== lastCtxRoot) {
      lastCtxRoot = ctx.root;
      lastQuery = "";
      lastFrom = 0;
      lastMatch = null;
    }

    if (query !== lastQuery) {
      lastQuery = query;
      lastMatch = null;
      lastFrom = direction < 0 ? text.length : 0;
    }

    let wrapped = false;
    let match = null;

    if (direction >= 0) {
      const start = lastMatch ? Math.max(lastMatch.to, lastFrom) : lastFrom;
      match = findNextOccurrence(text, query, start);
      if (!match && start > 0) {
        match = findNextOccurrence(text, query, 0);
        wrapped = !!match;
      }
    } else {
      const startBefore = lastMatch ? Math.min(lastMatch.from, lastFrom) : lastFrom;
      match = findPrevOccurrence(text, query, startBefore);
      if (!match && startBefore < text.length) {
        match = findPrevOccurrence(text, query, text.length);
        wrapped = !!match;
      }
    }

    if (!match) {
      setStatus(`No match for: ${query}${limitedNote}`);
      return;
    }

    const ok = ctx.selectRange?.(match.from, match.to);
    if (!ok) {
      setStatus("Found a match, but selection/scroll failed.");
      return;
    }

    // Gele achtergrond-highlight op de match (los van focus)
    applyHighlight(ctx, match);

    lastMatch = match;
    lastFrom = direction >= 0 ? match.to : match.from;

    const pos = ctx.describePos?.(match.from);
    const wrapNote = wrapped ? " (wrapped)" : "";
    if (pos) {
      setStatus(`Found at line ${pos.line}, col ${pos.col}${wrapNote}.`);
    } else {
      setStatus(`Found at index ${match.from}${wrapNote}.${limitedNote}`);
    }

    // Keep focus in the popup input after selecting.
    setTimeout(() => {
      if (ui?.input?.isConnected) ui.input.focus();
    }, 0);

    // Houd highlight in sync tijdens scroll/resize.
    scheduleHighlightRefresh();
  }

  // ---------- Hotkey ----------
  function onKeyDown(e) {
    // Ctrl+Alt+F
    if (!(e.ctrlKey && e.altKey && (e.key === "f" || e.key === "F"))) return;

    // Canvas-only: do nothing unless focus is inside a Canvas CodeMirror editor.
    const context = getCanvasEditorContext();
    if (!context) return;

    e.preventDefault();
    e.stopPropagation();

    if (isUIOpen()) {
      closeUI();
      return;
    }

    openUI(context);
  }

  document.addEventListener("keydown", onKeyDown, true);

  // Hou highlight in sync tijdens scroll/resize.
  document.addEventListener("scroll", scheduleHighlightRefresh, true);
  window.addEventListener("resize", scheduleHighlightRefresh, true);

  // Track last-focused Canvas editor so the hotkey can work even if focus moved elsewhere.
  document.addEventListener(
    "focusin",
    (e) => {
      const cmEditor = e.target?.closest?.(".cm-editor");
      if (!cmEditor) return;
      if (isInChatComposer(cmEditor)) return;
      if (!isVisible(cmEditor)) return;
      lastCanvasEditor = cmEditor;
    },
    true
  );

  // Close UI if user clicks outside it
  document.addEventListener(
    "mousedown",
    (e) => {
      if (!isUIOpen()) return;
      if (!ui?.root) return;
      if (ui.root.contains(e.target)) return;
      closeUI();
    },
    true
  );

  console.log("[ChatGPT Canvas Search] loaded (v0.1)");
})();

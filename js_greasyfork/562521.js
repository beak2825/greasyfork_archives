// ==UserScript==
// @name         arXiv HTML: Eq Ref Preview [v1.0]
// @namespace    arxiv-html-eq-preview-3modes
// @version      1.0
// @description  Preview Formula links in Arxiv html pages.
// @match        https://arxiv.org/html/*
// @run-at       document-idle
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562521/arXiv%20HTML%3A%20Eq%20Ref%20Preview%20%5Bv10%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/562521/arXiv%20HTML%3A%20Eq%20Ref%20Preview%20%5Bv10%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // CONSTANTS
  // =========================
  const TOOLTIP_VW_RATIO = 0.60;   // kept (no longer used for width when aligned to text column)
  const TOOLTIP_MAX_H_VH = 90;
  const TOOLTIP_FONT_PX = 15;
  const TOOLTIP_ZOOM = 1.20;

  const DOCK_MAX_H_VH = 38;
  const DOCK_FONT_PX = 15;
  const DOCK_ZOOM = 1.0;           // (REQ) was 1.12; must be 1 to avoid off-screen X
  const PINNED_MAX_ITEMS = 5;

  const USE_DARK_IF_PREFERS = true;

  // =========================
  // CSS: hide scrollbars but keep scroll (apply to scroll areas)
  // =========================
  const style = document.createElement('style');
  style.textContent = `
    .aepp-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .aepp-scroll::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
    .aepp-scroll * { scrollbar-width: none; -ms-overflow-style: none; }
    .aepp-scroll *::-webkit-scrollbar { width: 0 !important; height: 0 !important; }

    .aepp-btn {
      cursor: pointer;
      border-radius: 10px;
      padding: 2px 10px;
      background: transparent;
      color: inherit;
      font: inherit;
      line-height: 1;
      user-select: none;
    }
    .aepp-item {
      border-radius: 10px;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,0.10);
      margin-bottom: 10px;
    }
    @media (prefers-color-scheme: light) {
      .aepp-item { border: 1px solid rgba(0,0,0,0.10); }
    }
  `;
  document.head.appendChild(style);

  // =========================
  // Theme
  // =========================
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = USE_DARK_IF_PREFERS && prefersDark;

  // =========================
  // Helpers: find main text column rect (exclude TOC if possible)
  // =========================
  function getCandidateRects() {
    const selectors = [
      '.ltx_page_main',
      '.ltx_page_content',
      '.ltx_document',
      'main',
      'article',
      '.ltx_page',
      '#content'
    ];
    const els = selectors.map(s => document.querySelector(s)).filter(Boolean);
    const vw = window.innerWidth;

    const scored = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width < 320) continue;
      if (r.width > vw * 0.98) continue;
      // Prefer elements that are not flush-left (likely excluding TOC)
      const score = r.width + Math.min(Math.max(r.left - 120, 0), 500);
      scored.push({ r, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.length ? scored[0].r : document.body.getBoundingClientRect();
  }

  function getTextColumnRect() {
    const r = getCandidateRects();
    const left = Math.max(8, Math.floor(r.left));
    const width = Math.min(window.innerWidth - 16, Math.floor(r.width));
    return { left, width };
  }

  // =========================
  // Resolve ref -> container (equationgroup aware)
  // =========================
  function equationContainerFromHashNode(hashNode) {
    if (!hashNode) return null;
    const group = hashNode.closest('table.ltx_equationgroup');
    if (group) return group;
    return (
      hashNode.closest('table.ltx_eqn_table, table.ltx_equation, .ltx_equation, .ltx_display, figure.ltx_equation, figure') ||
      null
    );
  }

  function findMathByBaseId(baseId) {
    if (!baseId) return null;
    const sel = [
      `math[id^="${baseId}."][id$=".ltx_Math"]`,
      `math[id^="${baseId}."]`,
      `*[id^="${baseId}."][id$=".ltx_Math"]`,
      `*[id^="${baseId}."]`
    ].join(',');
    return document.querySelector(sel);
  }

  function equationContainerFromMathNode(mathNode) {
    if (!mathNode) return null;
    const group = mathNode.closest('table.ltx_equationgroup');
    if (group) return group;
    return (
      mathNode.closest('table.ltx_eqn_table, table.ltx_equation, .ltx_equation, .ltx_display, figure.ltx_equation, figure') ||
      null
    );
  }

  function parseBaseIdFromAnchor(a) {
    const href = a.getAttribute('href') || '';
    const i = href.indexOf('#');
    if (i < 0) return null;
    const baseId = href.slice(i + 1).trim();
    return baseId || null;
  }

  function resolveEquationContainerFromRefAnchor(a) {
    const baseId = parseBaseIdFromAnchor(a);
    if (!baseId) return null;

    const hashNode = document.getElementById(baseId);
    if (hashNode) {
      const c = equationContainerFromHashNode(hashNode);
      if (c) return c;
    }

    const mathNode = findMathByBaseId(baseId);
    if (!mathNode) return null;
    return equationContainerFromMathNode(mathNode);
  }

  function getRefAnchorFromEventTarget(t) {
    if (!t || !t.closest) return null;
    return t.closest('a.ltx_ref[href*="#"], a[href*="#"]');
  }

  // =========================
  // Panel base styling
  // =========================
  function stylePanelBase(el, fontPx) {
    el.style.position = 'fixed';
    el.style.zIndex = '2147483647';
    el.style.display = 'none';
    el.style.borderRadius = '12px';
    el.style.boxShadow = '0 12px 34px rgba(0,0,0,0.30)';
    el.style.border = dark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.18)';
    el.style.background = dark ? 'rgba(25,25,25,0.98)' : 'rgba(255,255,255,0.98)';
    el.style.color = dark ? '#eee' : '#111';
    el.style.lineHeight = '1.45';
    el.style.fontSize = `${fontPx}px`;
    el.style.backdropFilter = 'blur(2px)';
    el.style.textAlign = 'left';
  }

  function applyZoom(el, zoomFactor) {
    el.style.zoom = String(zoomFactor);
  }

  // =========================
  // Clone equation: keep equationgroup whole; enforce left alignment (v2.3 behavior)
  // =========================
  function isEquationGroup(el) {
    return el && el.matches && el.matches('table.ltx_equationgroup');
  }

  function cloneEquationOnly(container) {
    let src = container;

    if (!isEquationGroup(container)) {
      const innerEq =
        container.querySelector('table.ltx_eqn_table, table.ltx_equation, .ltx_equation, .ltx_display, figure.ltx_equation, figure');
      if (innerEq) src = innerEq;
    }

    const clone = src.cloneNode(true);

    // Remove equation tags / numbers
    clone.querySelectorAll('.ltx_tag, .ltx_tag_equation, .ltx_tag_lefteqn, .ltx_eqn_tag').forEach(el => el.remove());

    // Disable links inside preview
    clone.querySelectorAll('a').forEach(a => {
      a.removeAttribute('href');
      a.style.pointerEvents = 'none';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
    });

    // Force left alignment and remove centering margins (as in v2.3)
    clone.style.width = '100%';
    clone.style.maxWidth = '100%';
    clone.style.textAlign = 'left';
    clone.style.marginLeft = '0';
    clone.style.marginRight = 'auto';

    clone.querySelectorAll('table, figure, .ltx_display, .ltx_equation, .ltx_equationgroup').forEach(el => {
      el.style.width = '100%';
      el.style.maxWidth = '100%';
      el.style.textAlign = 'left';
      el.style.marginLeft = '0';
      el.style.marginRight = 'auto';
    });

    // IMPORTANT: do NOT set overflow hidden on td/tr; prevents clipping multi-line
    return clone;
  }

  // =========================
  // Shift tooltip (scroll area only)
  // =========================
  const tooltip = document.createElement('div');
  stylePanelBase(tooltip, TOOLTIP_FONT_PX);
  tooltip.style.padding = '10px 18px 10px 12px';

  const tooltipScroll = document.createElement('div');
  tooltipScroll.classList.add('aepp-scroll');
  tooltipScroll.style.overflowY = 'auto';
  tooltipScroll.style.overflowX = 'hidden';
  tooltip.appendChild(tooltipScroll);

  document.body.appendChild(tooltip);

  // (REQ) Shift tooltip should align to text column like dock
  function setTooltipToTextColumnWidthAndLeft() {
    const { left, width } = getTextColumnRect();
    tooltip.style.left = `${left}px`;
    tooltip.style.width = `${width}px`;
    tooltip.style.maxHeight = `${TOOLTIP_MAX_H_VH}vh`;
  }

  // Vertical placement near cursor, with viewport clamp
  function placeTooltipNearCursorY(y) {
    const pad = 14;
    const rect = tooltip.getBoundingClientRect();
    const vh = window.innerHeight;

    let top = y + pad;
    if (top + rect.height > vh - 8) top = Math.max(8, y - pad - rect.height);
    tooltip.style.top = `${top}px`;
  }

  function showShiftTooltip(container, x, y) {
    if (!container) return;
    setTooltipToTextColumnWidthAndLeft();
    tooltipScroll.innerHTML = '';
    tooltipScroll.appendChild(cloneEquationOnly(container));
    applyZoom(tooltip, TOOLTIP_ZOOM);
    tooltip.style.display = 'block';
    tooltip.style.textAlign = 'left';
    placeTooltipNearCursorY(y);
  }

  function hideShiftTooltip() {
    tooltip.style.display = 'none';
    tooltipScroll.innerHTML = '';
  }

  // =========================
  // Bottom dock (pinned list + temp alt preview)
  // =========================
  const dock = document.createElement('div');
  stylePanelBase(dock, DOCK_FONT_PX);
  dock.style.padding = '10px 12px 12px 12px';
  dock.style.overflow = 'hidden';

  const dockHeader = document.createElement('div');
  dockHeader.style.display = 'flex';
  dockHeader.style.alignItems = 'center';
  dockHeader.style.justifyContent = 'space-between';
  dockHeader.style.gap = '12px';
  dockHeader.style.padding = '0 2px 10px 2px';

  const dockTitle = document.createElement('div');
  dockTitle.style.fontSize = '12px';
  dockTitle.style.opacity = '0.85';
  dockTitle.textContent = `Pinned formulas (max ${PINNED_MAX_ITEMS})`;

  const dockClose = document.createElement('button');
  dockClose.className = 'aepp-btn';
  dockClose.textContent = '×';
  dockClose.title = 'Close';
  dockClose.style.border = dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.18)';
  dockClose.style.display = 'inline-block';

  dockHeader.appendChild(dockTitle);
  dockHeader.appendChild(dockClose);

  const dockScroll = document.createElement('div');
  dockScroll.classList.add('aepp-scroll');
  dockScroll.style.overflowY = 'auto';
  dockScroll.style.overflowX = 'hidden';

  dock.appendChild(dockHeader);
  dock.appendChild(dockScroll);
  document.body.appendChild(dock);

  let dockVisible = false;

  /** @type {{key:string,label:string,content:HTMLElement}[]} */
  let pinnedItems = [];

  function layoutDock() {
    const { left, width } = getTextColumnRect();
    dock.style.left = `${left}px`;
    dock.style.width = `${width}px`;
    dock.style.bottom = '10px';
    dock.style.top = 'auto';
    dock.style.maxHeight = `${DOCK_MAX_H_VH}vh`;
    dock.style.textAlign = 'left';
    dockScroll.style.maxHeight = `calc(${DOCK_MAX_H_VH}vh - 52px)`;
  }

  function hideDockAll() {
    dockVisible = false;
    pinnedItems = [];
    dock.style.display = 'none';
    dockScroll.innerHTML = '';
  }

  dockClose.addEventListener('click', hideDockAll);

  function renderPinnedList() {
    dockScroll.innerHTML = '';

    if (pinnedItems.length === 0) {
      const empty = document.createElement('div');
      empty.style.opacity = '0.75';
      empty.style.fontSize = '12px';
      empty.style.padding = '4px 2px 6px 2px';
      empty.textContent = `No pinned formulas. Ctrl+Alt+Hover to pin (max ${PINNED_MAX_ITEMS}).`;
      dockScroll.appendChild(empty);
      return;
    }

    for (const item of pinnedItems) {
      const block = document.createElement('div');
      block.className = 'aepp-item';

      const hdr = document.createElement('div');
      hdr.style.display = 'flex';
      hdr.style.alignItems = 'center';
      hdr.style.justifyContent = 'space-between';
      hdr.style.gap = '10px';
      hdr.style.marginBottom = '8px';

      const label = document.createElement('div');
      label.style.fontSize = '12px';
      label.style.opacity = '0.90';
      label.style.whiteSpace = 'nowrap';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      label.textContent = item.label;

      const del = document.createElement('button');
      del.className = 'aepp-btn';
      del.textContent = '×';
      del.title = 'Remove this formula';
      del.style.border = dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.18)';

      del.addEventListener('click', () => {
        pinnedItems = pinnedItems.filter(x => x.key !== item.key);
        if (pinnedItems.length === 0) hideDockAll();
        else renderPinnedList();
      });

      hdr.appendChild(label);
      hdr.appendChild(del);

      block.appendChild(hdr);
      block.appendChild(item.content);
      dockScroll.appendChild(block);
    }
  }

  function ensureDockVisible() {
    dockVisible = true;
    layoutDock();
    applyZoom(dock, DOCK_ZOOM); // DOCK_ZOOM = 1 per requirement
    dock.style.display = 'block';
  }

  // default accumulation rule:
  // Ctrl+Alt adds to pinned list (max 5). If duplicate key exists, move it to top.
  function pinFormulaFromAnchor(a, container) {
    const baseId = parseBaseIdFromAnchor(a) || '(unknown)';
    const labelText = (a.textContent || '').trim() || `#${baseId}`;
    const key = baseId;

    const content = cloneEquationOnly(container);

    const existingIdx = pinnedItems.findIndex(x => x.key === key);
    if (existingIdx >= 0) pinnedItems.splice(existingIdx, 1);

    pinnedItems.unshift({ key, label: labelText, content });

    if (pinnedItems.length > PINNED_MAX_ITEMS) {
      pinnedItems = pinnedItems.slice(0, PINNED_MAX_ITEMS);
    }

    ensureDockVisible();
    dockTitle.textContent = `Pinned formulas (max ${PINNED_MAX_ITEMS})`;
    renderPinnedList();
  }

  // Alt temporary dock (single formula) — disabled while pinned list is non-empty
  let altTempActive = false;
  function showAltTemp(container) {
    if (!container) return;
    if (pinnedItems.length > 0) return; // keep pinned view; do not replace with temp
    altTempActive = true;
    ensureDockVisible();
    dockTitle.textContent = 'Preview (Alt)';
    dockScroll.innerHTML = '';
    dockScroll.appendChild(cloneEquationOnly(container));
  }

  function hideAltTempIfAny() {
    if (!altTempActive) return;
    altTempActive = false;

    if (pinnedItems.length > 0) {
      dockTitle.textContent = `Pinned formulas (max ${PINNED_MAX_ITEMS})`;
      renderPinnedList();
      return;
    }
    dock.style.display = 'none';
    dockVisible = false;
    dockScroll.innerHTML = '';
  }

  // =========================
  // Hover/key state
  // =========================
  let currentHoverLink = null;
  let currentHoverContainer = null;
  let lastMouseX = Math.floor(window.innerWidth / 2);
  let lastMouseY = Math.floor(window.innerHeight / 2);

  function updateHoverStateFromTarget(target) {
    const a = getRefAnchorFromEventTarget(target);
    if (!a) {
      currentHoverLink = null;
      currentHoverContainer = null;
      return;
    }
    currentHoverLink = a;
    currentHoverContainer = resolveEquationContainerFromRefAnchor(a);
  }

  // (REQ) For mouse-first then key press, be resilient if currentHoverLink wasn't updated.
  function refreshHoverStateFromPointer() {
    const el = document.elementFromPoint(lastMouseX, lastMouseY);
    if (!el) return;
    updateHoverStateFromTarget(el);
  }

  // =========================
  // Events
  // =========================
  document.addEventListener('mousemove', (ev) => {
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;

    // Shift tooltip: keep vertical near cursor; horizontal fixed to text column
    if (tooltip.style.display === 'block') {
      placeTooltipNearCursorY(ev.clientY);
    }

    // (REQ, robust) If Alt temp preview is active but altKey is no longer held,
    // hide it even if keyup was missed by the browser/system.
    if (altTempActive && !ev.altKey) {
      hideAltTempIfAny();
    }
  }, { passive: true });

  // Mouse enters a link: update state and show if modifier held
  document.addEventListener('mouseover', (ev) => {
    updateHoverStateFromTarget(ev.target);
    if (!currentHoverLink || !currentHoverContainer) return;

    if (ev.ctrlKey && ev.altKey) {
      pinFormulaFromAnchor(currentHoverLink, currentHoverContainer);
      return;
    }
    if (ev.altKey && !ev.ctrlKey) {
      showAltTemp(currentHoverContainer);
      return;
    }
    if (ev.shiftKey && !ev.altKey && !ev.ctrlKey) {
      showShiftTooltip(currentHoverContainer, ev.clientX, ev.clientY);
      return;
    }
  });

  // Mouse leaves a link: Shift tooltip disappears immediately (even if Shift still held)
  document.addEventListener('mouseout', (ev) => {
    const fromA = getRefAnchorFromEventTarget(ev.target);
    if (!fromA) return;

    const toEl = ev.relatedTarget;
    const toA = toEl ? getRefAnchorFromEventTarget(toEl) : null;

    if (fromA && fromA !== toA) {
      currentHoverLink = null;
      currentHoverContainer = null;
      hideShiftTooltip();
    }
  });

  // Keydown: allow pressing Shift/Alt/Ctrl+Alt while already hovering a link
  document.addEventListener('keydown', (ev) => {
    // If hover state is missing (e.g., browser swallowed events), try best-effort refresh
    if (!currentHoverLink || !currentHoverContainer) {
      refreshHoverStateFromPointer();
    }
    if (!currentHoverLink || !currentHoverContainer) return;

    if (ev.key === 'Shift') {
      showShiftTooltip(currentHoverContainer, lastMouseX, lastMouseY);
      return;
    }

    // (REQ) mouse-first then Alt works; and mouse-first then Ctrl+Alt works:
    // If Alt is pressed while Ctrl is already held, treat as pin.
    if (ev.key === 'Alt') {
      if (ev.ctrlKey) {
        pinFormulaFromAnchor(currentHoverLink, currentHoverContainer);
      } else {
        showAltTemp(currentHoverContainer);
      }
      return;
    }

    // Ctrl+Alt pin via keys while hovering:
    if (ev.key === 'Control' && ev.altKey) {
      pinFormulaFromAnchor(currentHoverLink, currentHoverContainer);
    }
  });

  // Keyup: release behaviors
  document.addEventListener('keyup', (ev) => {
    if (ev.key === 'Shift') hideShiftTooltip();
    if (ev.key === 'Alt') hideAltTempIfAny();
  });

  window.addEventListener('resize', () => {
    if (tooltip.style.display === 'block') {
      setTooltipToTextColumnWidthAndLeft();
      placeTooltipNearCursorY(lastMouseY);
    }
    if (dockVisible) layoutDock();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (dockVisible) layoutDock();
  }, { passive: true });

})();

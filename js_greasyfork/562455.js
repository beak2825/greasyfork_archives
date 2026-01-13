// ==UserScript==
// @name         Show daily trip number in mosaic tiles on Transit Tracker daily stats
// @namespace    https://transittracker.net/
// @version      1.0.0
// @description  Inserts each cell's data-count inside the mosaic boxes on daily-stats.
// @match        https://transittracker.net/*/daily-stats*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562455/Show%20daily%20trip%20number%20in%20mosaic%20tiles%20on%20Transit%20Tracker%20daily%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/562455/Show%20daily%20trip%20number%20in%20mosaic%20tiles%20on%20Transit%20Tracker%20daily%20stats.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const CFG = {
    showZeros: false,          // set true if you want "0" displayed too
    minCellSizePx: 12,         // matches current cell size; we keep it compatible
    fontSizePx: 8,             // small, because cells are tiny
    fontWeight: 700,
    textShadow: "0 0 2px rgba(0,0,0,.55)", // helps on bright colors
    zIndex: 10,
    attrFlag: "data-tt-overlay", // marks processed cells
  };

  function parseRgb(str) {
    // Supports "rgb(r,g,b)" and "rgba(r,g,b,a)"
    const m = String(str).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function luminance({ r, g, b }) {
    // simple perceived brightness
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function bestTextColorFor(el) {
    const bg = getComputedStyle(el).backgroundColor;
    const rgb = parseRgb(bg);
    if (!rgb) return "#fff";
    return luminance(rgb) > 140 ? "#111" : "#fff";
  }

  function ensureOverlay(td) {
    if (!(td instanceof HTMLElement)) return;
    if (!td.hasAttribute("data-count")) return;

    // If it's an "empty spacer" cell, it won't have data-date/data-count in your table.
    const countRaw = td.getAttribute("data-count");
    if (countRaw == null) return;

    const count = Number(countRaw);
    const shouldShow = CFG.showZeros ? Number.isFinite(count) : (Number.isFinite(count) && count > 0);

    // Mark parent so our overlay positioning works.
    td.style.position = td.style.position || "relative";

    let badge = td.querySelector(`span[${CFG.attrFlag}="1"]`);
    if (!shouldShow) {
      if (badge) badge.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement("span");
      badge.setAttribute(CFG.attrFlag, "1");
      td.appendChild(badge);
    }

    // Update text
    badge.textContent = String(count);

    // Style (keep lightweight; cells are small)
    const color = bestTextColorFor(td);
    Object.assign(badge.style, {
      position: "absolute",
      inset: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      userSelect: "none",
      fontSize: `${CFG.fontSizePx}px`,
      fontWeight: String(CFG.fontWeight),
      lineHeight: "1",
      color,
      textShadow: CFG.textShadow,
      zIndex: String(CFG.zIndex),
    });
  }

  function paintAll(root = document) {
    const tds = root.querySelectorAll('td[data-count]');
    for (const td of tds) ensureOverlay(td);
  }

  // Debounced repaint (Livewire can cause many DOM mutations)
  let raf = 0;
  function schedulePaint() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      raf = 0;
      paintAll();
    });
  }

  function observe() {
    const target =
      document.querySelector("table[role='grid']") ||
      document.body;

    const mo = new MutationObserver(() => schedulePaint());
    mo.observe(target, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-count", "class", "style"] });

    // Also repaint on clicks (wire:click updates selection/classes)
    document.addEventListener("click", () => schedulePaint(), true);

    // Initial paint
    paintAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observe);
  } else {
    observe();
  }
})();

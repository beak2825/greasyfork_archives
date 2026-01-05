// ==UserScript==
// @name         TransitTracker Mobile Layout Fix
// @namespace    https://transittracker.net/
// @version      1.0.0
// @description  Fixes mobile layout issues, overflow, cut-off content, and responsiveness on TransitTracker
// @match        https://transittracker.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558839/TransitTracker%20Mobile%20Layout%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558839/TransitTracker%20Mobile%20Layout%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
/* =========================
   GLOBAL MOBILE SAFETY NET
========================= */
html, body {
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* Prevent any rogue element from forcing horizontal scroll */
* {
  max-width: 100%;
  box-sizing: border-box;
}

/* =========================
   MAIN GRID / CONTENT FIXES
========================= */
[data-flux-header],
[grid-area="header"] {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

/* Main content area */
main,
[data-flux-main],
[grid-area="main"] {
  padding: 0.75rem !important;
  width: 100% !important;
  overflow-x: hidden !important;
}

/* =========================
   SIDEBAR BEHAVIOR
========================= */
/* Ensure sidebar never pushes content off screen */
ui-sidebar {
  max-width: 100vw !important;
}

/* When sidebar is hidden on mobile, let content fill screen */
@media (max-width: 1024px) {
  ui-sidebar[data-flux-sidebar-collapsed-mobile] {
    transform: translateX(-100%) !important;
  }
}

/* =========================
   DASHBOARD CARDS & PANELS
========================= */
/* Convert multi-column grids into single column on mobile */
@media (max-width: 768px) {
  .grid,
  [class*="grid-cols-"] {
    grid-template-columns: 1fr !important;
  }
}

/* Reduce excessive card padding */
@media (max-width: 768px) {
  .p-6, .p-8 {
    padding: 0.75rem !important;
  }
}

/* =========================
   TABLE FIXES
========================= */
/* Wrap tables instead of breaking layout */
table {
  display: block !important;
  width: 100% !important;
  overflow-x: auto !important;
  white-space: nowrap;
}

/* Make table containers scrollable */
.table,
[data-table],
.overflow-x-auto {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
}

/* =========================
   LOGS / COLLECTIONS / LISTS
========================= */
@media (max-width: 768px) {
  .flex-row {
    flex-direction: column !important;
  }

  .items-center {
    align-items: flex-start !important;
  }
}

/* =========================
   TEXT & BUTTON SAFETY
========================= */
button,
a,
span,
div {
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* Prevent buttons from extending off screen */
button,
a {
  max-width: 100%;
}

/* =========================
   MODALS / DROPDOWNS
========================= */
ui-menu,
ui-dropdown {
  max-width: calc(100vw - 1rem) !important;
}

/* =========================
   FIX IMAGES & SVGs
========================= */
img,
svg {
  max-width: 100%;
  height: auto;
}

/* =========================
   REMOVE HARD HEIGHT TRAPS
========================= */
.h-screen,
.min-h-screen {
  min-height: auto !important;
  height: auto !important;
}

/* =========================
   SAFETY: FORCE NO OVERFLOW
========================= */
@media (max-width: 768px) {
  body * {
    overflow-x: visible;
  }
}
`);

  // Optional JS safety net: remove inline widths that break mobile
  function fixInlineWidths() {
    document.querySelectorAll('[style*="width"]').forEach(el => {
      if (el.scrollWidth > window.innerWidth) {
        el.style.width = '100%';
        el.style.maxWidth = '100%';
      }
    });
  }

  fixInlineWidths();
  window.addEventListener('resize', fixInlineWidths);
})();

// ==UserScript==
// @name         Script 1 – Requested / Open – Status Colors
// @namespace    http://tampermonkey.net/
// @version      3.5 - 25-12-16
// @description  Script 1 (ciblage table fiable) + palette (v6 traverse iframes) + popover modern + 🎨 button
// @match        https://translations.myelan.net/xtrf/faces/dashboard2/genericBrowseIFrame.seam*
// @match        https://translations.myelan.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559057/Script%201%20%E2%80%93%20Requested%20%20Open%20%E2%80%93%20Status%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/559057/Script%201%20%E2%80%93%20Requested%20%20Open%20%E2%80%93%20Status%20Colors.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===================== CONFIG ===================== */

  const TARGET_VIEW_TITLE = "Requested / Open";
  const REQUIRED_HEADERS = ["Job Status", "Deadline"];
  const STATUS_HEADER_TEXT = "Job Status";

  const DEFAULT_STATUS_COLORS = {
    "open": "#e97f7f",
    "offers sent / requested": "#8A8AFF"
  };

  const STORAGE_KEY = "xtrf_requested_open_status_colors_v2";
  const RESCAN_INTERVAL_MS = 1000;

  /* ===================== HELPERS ===================== */

  function normalize(text) {
    return (text || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function lookupColorForText(text, STATUS_COLORS) {
    if (!text) return null;
    const n = normalize(text);
    if (STATUS_COLORS[n]) return STATUS_COLORS[n];
    for (const k of Object.keys(STATUS_COLORS)) {
      if (normalize(k) === n) return STATUS_COLORS[k];
    }
    return null;
  }

  function loadColorsFromStorage() {
    let STATUS_COLORS = { ...DEFAULT_STATUS_COLORS };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return STATUS_COLORS;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") STATUS_COLORS = Object.assign(STATUS_COLORS, parsed);
    } catch (e) {
      console.warn("[XTRF] Failed to load colors:", e);
    }
    return STATUS_COLORS;
  }

  function saveColorsToStorage(STATUS_COLORS) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STATUS_COLORS));
    } catch (e) {
      console.warn("[XTRF] Failed to save colors:", e);
    }
  }

  // Traverse all same-origin documents (main doc + iframes)
  function traverseSameOriginDocuments(fn) {
    const seen = new Set();
    function visit(win) {
      if (!win || seen.has(win)) return;
      seen.add(win);

      let doc;
      try { doc = win.document; } catch { return; } // cross-origin

      try { fn(doc, win); } catch (e) { console.warn("[XTRF] traverse fn error", e); }

      const iframes = Array.from(doc.querySelectorAll("iframe"));
      for (const iframe of iframes) {
        try { if (iframe && iframe.contentWindow) visit(iframe.contentWindow); } catch {}
      }
    }
    visit(window);
  }

  /* ===================== HEADING (v6 style) ===================== */

  function findTargetHeadingInDoc(doc) {
    if (!doc) return null;

    const classHeadings = Array.from(doc.querySelectorAll(
      "h2.x-card__header__heading, h1.x-card__header__heading, h3.x-card__header__heading"
    ));
    let found = classHeadings.find(h => normalize(h.textContent) === normalize(TARGET_VIEW_TITLE));
    if (found) return found;

    const cardHeaders = Array.from(doc.querySelectorAll(".x-card__header, .xlt-card__header, .card-header"));
    for (const ch of cardHeaders) {
      if (normalize(ch.textContent) === normalize(TARGET_VIEW_TITLE)) {
        const inner = ch.querySelector(".x-card__header__heading, h1, h2, h3, h4, .header-title");
        return inner || ch;
      }
    }

    const any = Array.from(doc.querySelectorAll("h1,h2,h3,h4,div,span"));
    found = any.find(el => normalize(el.textContent) === normalize(TARGET_VIEW_TITLE));
    return found || null;
  }

  function findWidgetContainerForHeading(heading) {
    if (!heading) return null;
    const selectors = [".xdb-dashboard__widget", ".x-card", ".xlt-card", ".card", ".widget", ".x-card__container", ".panel"];
    for (const sel of selectors) {
      const anc = heading.closest ? heading.closest(sel) : null;
      if (anc) return anc;
    }
    const headerParent = heading.closest ? heading.closest(".x-card__header, .xlt-card__header, .card-header") : null;
    if (headerParent && headerParent.parentElement) return headerParent.parentElement;
    return heading.parentElement || null;
  }

  /* ===================== TABLE LOGIC (Script 1 style) ===================== */

  function extractHeaderTexts(table) {
    if (!table) return null;
    const thead = table.querySelector("thead");
    if (thead) {
      const headerRow = thead.querySelector("tr");
      if (headerRow) return Array.from(headerRow.querySelectorAll("th,td")).map(h => normalize(h.textContent));
    }
    return null;
  }

  function tableHasRequiredHeaders(table) {
    const headers = extractHeaderTexts(table);
    if (!headers || !headers.length) return false;
    return REQUIRED_HEADERS.every(req => headers.some(h => h.includes(normalize(req))));
  }

  function getColumnIndex(table, headerText) {
    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return -1;
    const headers = Array.from(headerRow.querySelectorAll("th, td"));
    for (let i = 0; i < headers.length; i++) {
      if (normalize(headers[i].textContent).includes(normalize(headerText))) return i;
    }
    return -1;
  }

  function resetCellStyles(cell) {
    if (!cell) return;
    try {
      cell.style.removeProperty("background-color");
      cell.style.removeProperty("color");
      cell.style.removeProperty("font-weight");
      cell.style.removeProperty("text-align");
      if (cell.firstElementChild) {
        cell.firstElementChild.style.removeProperty("background-color");
        cell.firstElementChild.style.removeProperty("color");
        cell.firstElementChild.style.removeProperty("font-weight");
      }
    } catch {}
  }

  function styleCell(cell, color) {
    if (!cell) return;
    try {
      cell.style.setProperty("background-color", color, "important");
      cell.style.setProperty("color", "white", "important");
      cell.style.setProperty("font-weight", "700", "important");
      cell.style.setProperty("text-align", "center", "important");
      const child = cell.firstElementChild;
      if (child) {
        child.style.setProperty("background-color", color, "important");
        child.style.setProperty("color", "white", "important");
        child.style.setProperty("font-weight", "700", "important");
      }
    } catch {}
  }

  function findTableForWidget(doc, heading) {
    const container = findWidgetContainerForHeading(heading);
    if (container) {
      const tables = Array.from(container.querySelectorAll("table"));
      const match = tables.find(tableHasRequiredHeaders);
      if (match) return match;
    }
    const allTables = Array.from(doc.querySelectorAll("table"));
    return allTables.find(tableHasRequiredHeaders) || null;
  }

  function applyColorsInDoc(doc, STATUS_COLORS) {
    const heading = findTargetHeadingInDoc(doc);

    let table = null;
    if (heading) table = findTableForWidget(doc, heading);
    if (!table) {
      const allTables = Array.from(doc.querySelectorAll("table"));
      table = allTables.find(tableHasRequiredHeaders) || null;
    }
    if (!table) return;

    const statusCol = getColumnIndex(table, STATUS_HEADER_TEXT);
    if (statusCol < 0) return;

    const rows = table.querySelectorAll("tbody tr");
    if (!rows.length) return;

    rows.forEach(row => {
      const tds = row.querySelectorAll("td");
      if (!tds.length) return;
      const cell = tds[statusCol];
      if (!cell) return;

      const text = normalize(cell.innerText || cell.textContent);
      resetCellStyles(cell);

      const color = lookupColorForText(text, STATUS_COLORS);
      if (color) styleCell(cell, color);
    });
  }

  /* ===================== PALETTE UI (pretty) ===================== */

  let popoverMap = new WeakMap();

  function closePopoverForDoc(doc) {
    const pop = popoverMap.get(doc);
    if (!pop) return;
    try { pop._cleanup?.(); } catch {}
    try { pop.remove(); } catch {}
    popoverMap.delete(doc);
  }

  function showPopoverForDoc(doc, anchorEl, STATUS_COLORS) {
    if (!doc || !anchorEl) return;

    const existing = popoverMap.get(doc);
    if (existing) { closePopoverForDoc(doc); return; }

    const pop = doc.createElement("div");
    pop.className = "xtrf-status-popover";
    Object.assign(pop.style, {
      position: "absolute",
      zIndex: 99999,
      minWidth: "260px",
      padding: "12px 12px 10px",
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(0,0,0,0.10)",
      borderRadius: "14px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      fontSize: "13px",
      color: "#1f2328"
    });

    const header = doc.createElement("div");
    header.textContent = "Status colors";
    Object.assign(header.style, {
      fontWeight: "700",
      fontSize: "13px",
      marginBottom: "10px",
      letterSpacing: "0.2px"
    });

    const sub = doc.createElement("div");
    sub.textContent = "Click a color to change it";
    Object.assign(sub.style, {
      marginTop: "-6px",
      marginBottom: "10px",
      fontSize: "12px",
      color: "rgba(31,35,40,0.65)"
    });

    const form = doc.createElement("div");
    Object.assign(form.style, {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    });

    Object.keys(STATUS_COLORS).forEach(statusKey => {
      const row = doc.createElement("label");
      Object.assign(row.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.65)"
      });

      const nameSpan = doc.createElement("span");
      nameSpan.textContent = statusKey;
      nameSpan.style.flex = "1";

      const input = doc.createElement("input");
      input.type = "color";
      input.value = STATUS_COLORS[statusKey] || "#000000";
      input.dataset.statusKey = statusKey;
      Object.assign(input.style, {
        width: "44px",
        height: "30px",
        border: "none",
        background: "transparent",
        padding: "0",
        cursor: "pointer"
      });

      row.appendChild(nameSpan);
      row.appendChild(input);
      form.appendChild(row);
    });

    const buttons = doc.createElement("div");
    Object.assign(buttons.style, {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
      marginTop: "10px"
    });

    const cancelBtn = doc.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    Object.assign(cancelBtn.style, {
      padding: "8px 12px",
      background: "rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: "12px",
      cursor: "pointer"
    });

    const saveBtn = doc.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    Object.assign(saveBtn.style, {
      padding: "8px 12px",
      background: "#0b6cff",
      color: "#fff",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(11,108,255,0.22)"
    });

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);

    pop.appendChild(header);
    pop.appendChild(sub);
    pop.appendChild(form);
    pop.appendChild(buttons);

    try { doc.body.appendChild(pop); } catch { return; }

    // position near the anchor
    const rect = anchorEl.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left - (popRect.width / 2) + (rect.width / 2);

    const docWidth = doc.documentElement.clientWidth;
    if (left + popRect.width > docWidth - 8) left = docWidth - popRect.width - 8;
    if (left < 8) left = 8;

    const win = doc.defaultView || window;
    pop.style.top = `${top + win.scrollY}px`;
    pop.style.left = `${left + win.scrollX}px`;

    cancelBtn.addEventListener("click", () => closePopoverForDoc(doc));
    saveBtn.addEventListener("click", () => {
      const inputs = pop.querySelectorAll('input[type="color"]');
      inputs.forEach(inp => {
        const key = inp.dataset.statusKey;
        if (key) STATUS_COLORS[key] = inp.value;
      });
      saveColorsToStorage(STATUS_COLORS);
      traverseSameOriginDocuments((d) => applyColorsInDoc(d, STATUS_COLORS));
      closePopoverForDoc(doc);
    });

    const outsideHandler = (ev) => {
      if (!pop.contains(ev.target) && ev.target !== anchorEl && !anchorEl.contains(ev.target)) closePopoverForDoc(doc);
    };
    const escHandler = (ev) => { if (ev.key === "Escape") closePopoverForDoc(doc); };

    setTimeout(() => document.addEventListener("mousedown", outsideHandler), 0);
    document.addEventListener("keydown", escHandler);
    pop._cleanup = () => {
      document.removeEventListener("mousedown", outsideHandler);
      document.removeEventListener("keydown", escHandler);
    };

    popoverMap.set(doc, pop);
  }

  function ensureSettingsIconInDoc(doc, STATUS_COLORS) {
    const heading = findTargetHeadingInDoc(doc);
    if (!heading) return false;

    const headerContainer = heading.closest
      ? heading.closest(".x-card__header, .xlt-card__header, .card-header")
      : (heading.parentElement || doc.body);

    let actionsArea = headerContainer
      ? headerContainer.querySelector(".x-card__header__actions, .header-actions, .card-actions")
      : null;

    if (!actionsArea) {
      actionsArea = headerContainer.querySelector(".xtrf-status-actions");
      if (!actionsArea) {
        actionsArea = doc.createElement("div");
        actionsArea.className = "xtrf-status-actions";
        actionsArea.style.display = "inline-flex";
        actionsArea.style.alignItems = "center";
        actionsArea.style.marginLeft = "8px";
        actionsArea.style.verticalAlign = "middle";
        heading.insertAdjacentElement("afterend", actionsArea);
      }
    }

    if (actionsArea.querySelector(".xtrf-status-settings-icon")) return true;

    const iconBtn = doc.createElement("button");
    iconBtn.type = "button";
    iconBtn.className = "xtrf-status-settings-icon";
    iconBtn.title = "Change status colors";
    Object.assign(iconBtn.style, {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "0",
      marginLeft: "6px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: "22px",
      width: "22px",
      borderRadius: "999px",
      lineHeight: "1",
      transition: "transform 120ms ease, background 120ms ease"
    });

    // 🎨 emoji icon
    iconBtn.textContent = "🎨";
    iconBtn.setAttribute("aria-label", "Change status colors");

    iconBtn.addEventListener("mouseenter", () => {
      iconBtn.style.background = "rgba(0,0,0,0.06)";
      iconBtn.style.transform = "scale(1.06)";
    });
    iconBtn.addEventListener("mouseleave", () => {
      iconBtn.style.background = "transparent";
      iconBtn.style.transform = "scale(1)";
    });

    actionsArea.appendChild(iconBtn);

    iconBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      showPopoverForDoc(doc, iconBtn, STATUS_COLORS);
    });

    return true;
  }

  /* ===================== RUN ===================== */

  function run() {
    const STATUS_COLORS = loadColorsFromStorage();

    traverseSameOriginDocuments((doc) => {
      try { ensureSettingsIconInDoc(doc, STATUS_COLORS); } catch {}
      try { applyColorsInDoc(doc, STATUS_COLORS); } catch {}
    });
  }

  run();
  setInterval(run, RESCAN_INTERVAL_MS);

  try {
    const observer = new MutationObserver(() => run());
    if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch {}
})();

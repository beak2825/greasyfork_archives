// ==UserScript==
// @name         Script 2 – Projects due today – Deadline urgency
// @namespace    http://tampermonkey.net/
// @version      2.1 - 25-12-16
// @description  Highlights rows based on deadline (overdue / within 1 hour / later today) - OVERFLOWS into other views on purpose
// @match        https://translations.myelan.net/xtrf/faces/dashboard2/genericBrowseIFrame.seam*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559058/Script%202%20%E2%80%93%20Projects%20due%20today%20%E2%80%93%20Deadline%20urgency.user.js
// @updateURL https://update.greasyfork.org/scripts/559058/Script%202%20%E2%80%93%20Projects%20due%20today%20%E2%80%93%20Deadline%20urgency.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================================================
     CONFIGURATION
     ========================================================= */

  const TARGET_VIEW_TITLE = "Projects due today";
  const REQUIRED_HEADERS = ["Deadline"];
  const DEADLINE_HEADER_TEXT = "Deadline";

  // Styling
  const OVERDUE_BG_COLOR = "#ffcccc"; // red
  const OVERDUE_TEXT_COLOR = "#990000";

  const SOON_BG_COLOR = "#ffe4b3"; // orange
  const SOON_TEXT_COLOR = "#9a5b00";

  const TODAY_BG_COLOR = "#d9f0ff"; // light blue
  const TODAY_TEXT_COLOR = "#0b4f7a";

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const RESCAN_INTERVAL_MS = 5000;

  /* =========================================================
     HELPERS
     ========================================================= */

  function normalize(text) {
    return (text || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  // Parse a deadline like: "12/12/2025 17:00 CET"
  // NOTE: We intentionally ignore the timezone suffix and interpret it as local time.
  function parseDeadline(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return null;

    const m = trimmed.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
    if (!m) return null;

    const [, dd, MM, yyyy, hh, mm] = m;
    const date = new Date(
      Number(yyyy),
      Number(MM) - 1,
      Number(dd),
      Number(hh),
      Number(mm)
    );

    return isNaN(date.getTime()) ? null : date;
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function findTargetHeading() {
    const headings = document.querySelectorAll("h2.x-card__header__heading");
    return Array.from(headings).find(h2 => normalize(h2.textContent) === normalize(TARGET_VIEW_TITLE)) || null;
  }

  function findTablesByHeadingRange() {
    const h2 = findTargetHeading();
    if (!h2) return [];

    const headings = Array.from(document.querySelectorAll("h2.x-card__header__heading"));
    const index = headings.indexOf(h2);
    const nextHeading = headings[index + 1] || null;

    const range = document.createRange();
    try {
      range.setStartAfter(h2);
      if (nextHeading) range.setEndBefore(nextHeading);
      else range.setEndAfter(document.body.lastChild || document.body);
    } catch {
      return [];
    }

    const tables = Array.from(document.querySelectorAll("table"));
    const inRange = [];
    for (const table of tables) {
      try {
        if (range.intersectsNode(table)) inRange.push(table);
      } catch {}
    }
    return inRange;
  }

  function tableHasRequiredHeaders(table) {
    const headerRow = table?.querySelector("thead tr");
    const tbody = table?.querySelector("tbody");
    if (!headerRow || !tbody) return false;

    const headers = Array.from(headerRow.querySelectorAll("th, td"))
      .map(th => normalize(th.textContent));

    return REQUIRED_HEADERS.every(req =>
      headers.some(h => h.includes(normalize(req)))
    );
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

  function resetRowStyle(row) {
    row.style.backgroundColor = "";
    row.style.color = "";
    row.style.fontWeight = "";
  }

  function applyRowStyle(row, bg, fg) {
    row.style.backgroundColor = bg;
    row.style.color = fg;
    row.style.fontWeight = "bold";
  }

  /* =========================================================
     CORE LOGIC
     ========================================================= */

  let cachedTable = null;

  function pickProjectsTable() {
    // Prefer tables in the widget's DOM range first
    const rangeTables = findTablesByHeadingRange();
    const inRangeMatch = rangeTables.find(tableHasRequiredHeaders);
    if (inRangeMatch) return inRangeMatch;

    // Fallback: scan all tables, but only accept those matching REQUIRED_HEADERS
    const allTables = Array.from(document.querySelectorAll("table"));
    return allTables.find(tableHasRequiredHeaders) || null;
  }

  function run() {
    if (!cachedTable || !document.contains(cachedTable) || !tableHasRequiredHeaders(cachedTable)) {
      cachedTable = pickProjectsTable();
    }
    if (!cachedTable) return;

    const deadlineIndex = getColumnIndex(cachedTable, DEADLINE_HEADER_TEXT);
    if (deadlineIndex < 0) return;

    const now = new Date();
    const rows = cachedTable.querySelectorAll("tbody tr");
    if (!rows.length) return;

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (!cells.length) return;

      const deadlineCell = cells[deadlineIndex];
      if (!deadlineCell) return;

      resetRowStyle(row);

      const deadlineText = (deadlineCell.innerText || deadlineCell.textContent || "").trim();
      const deadlineDate = parseDeadline(deadlineText);
      if (!deadlineDate) return;

      const diffMs = deadlineDate.getTime() - now.getTime();

      if (deadlineDate < now) {
        // Overdue -> red
        applyRowStyle(row, OVERDUE_BG_COLOR, OVERDUE_TEXT_COLOR);
      } else if (isSameDay(deadlineDate, now) && diffMs <= ONE_HOUR_MS) {
        // Due within 1 hour (today) -> orange
        applyRowStyle(row, SOON_BG_COLOR, SOON_TEXT_COLOR);
      } else if (isSameDay(deadlineDate, now) && diffMs > ONE_HOUR_MS) {
        // Due later today (> 1 hour) -> light blue
        applyRowStyle(row, TODAY_BG_COLOR, TODAY_TEXT_COLOR);
      }
    });
  }

  /* =========================================================
     EXECUTION & OBSERVERS
     ========================================================= */

  run();
  setInterval(run, RESCAN_INTERVAL_MS);

  const observer = new MutationObserver(() => run());
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

})();

// ==UserScript==
// @name         enhanced showlog.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.1.0
// @description  Wandelt Log-Einträge in strukturierte Tabellen um, fügt Benutzer- und Event-Filter hinzu und hebt Änderungen mit Diff-Ansicht hervor.
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/showlog.pl*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551734/enhanced%20showlogpl.user.js
// @updateURL https://update.greasyfork.org/scripts/551734/enhanced%20showlogpl.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Verhindere automatische Scroll-Wiederherstellung durch Browser
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Sofort nach oben scrollen
  window.scrollTo(0, 0);

  // -------------------- ZENTRALE EVENT-DEFINITION --------------------
  const EVENT_ORDER = [
    "VALUE-EDIT",
    "EDIT",
    "MASS-EDIT",
    "MASS-VALUE-EDIT",
    "PICTURE",
    "CREATE",
    "CLONE",
    "----", // Trennlinie
    "BULK-CREATE",
    "BULK-EDIT",
    "----", // Trennlinie
    "LINK",
    "LINK-ADD",
    "LINK-ADD-MASS",
    "LINK-ADD-FROM-CSV",
    "LINK-EDIT",
    "LINK-DELETE",
    "LINK-VARIANT",
    "UNLINK-VARIANT",
    "----", // Trennlinie
    "MATCH-ADD",
    "MATCH-ADD-MR",
    "MATCH-DELETE",
    "PREISLIMIT",
    "RULE-BROKEN",
    "----", // Trennlinie
    "HERSTELLER-EDIT",
    "AUTO-FILL",
    "MOVE",
    "MIGRATE"
  ];

  // -------------------- CSS --------------------
  const STYLE_ID = "gh-custom-style";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Einheitliche Schrift */
      .gh-unify-font, .gh-unify-font td, .gh-unify-font th {
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important;
      }

      /* Topbar */
      .gh-topbar {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        margin:8px 0 6px 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: white;
        padding: 8px 0;
        border-bottom: 1px solid #ddd;
      }
      .gh-left  { display:flex; align-items:center; gap:8px; }
      .gh-right { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
      .gh-backlink { text-decoration: none; color: #0057b8; font: inherit; }
      .gh-backlink:hover { text-decoration: underline; }

      /* User Filter Dropdown */
      .gh-user-filter {
        padding: 4px 8px;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        width: 180px;
      }
      .gh-user-filter option {
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }

      /* Event Multi-Select */
      .gh-event-multiselect {
        position: relative;
        display: inline-block;
      }
      .gh-event-trigger {
        padding: 4px 8px;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        min-width: 180px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .gh-event-trigger:hover {
        background: #f5f5f5;
      }
      .gh-event-trigger-arrow {
        font-size: 10px;
        color: #666;
      }
      .gh-event-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 2px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 220px;
        display: none;
        z-index: 1000;
      }
      .gh-event-dropdown.gh-open {
        display: block;
      }
      .gh-event-dropdown-header {
        padding: 8px 10px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
      }
      .gh-event-clear-btn {
        padding: 2px 8px;
        font-size: 11px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      .gh-event-clear-btn:hover {
        background: #d32f2f;
      }
      .gh-event-clear-btn.gh-select-all {
        background: #4caf50;
      }
      .gh-event-clear-btn.gh-select-all:hover {
        background: #45a049;
      }
      .gh-event-option {
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      .gh-event-option:hover:not(.gh-event-disabled) {
        background: #f5f5f5;
      }
      .gh-event-option.gh-event-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .gh-event-option input[type="checkbox"] {
        margin: 0;
        cursor: pointer;
      }
      .gh-event-option.gh-event-disabled input[type="checkbox"] {
        cursor: not-allowed;
      }
      .gh-event-separator {
        height: 1px;
        background: #e0e0e0;
        margin: 4px 0;
      }

      /* Quick Filter Button */
      .gh-quick-filter-btn {
        padding: 4px 12px;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        white-space: nowrap;
      }
      .gh-quick-filter-btn:hover {
        background: #f5f5f5;
      }

      /* Unsere Wrapper */
      .gh-owned {}
      .gh-change-wrap {
        margin:6px 0;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
        display: block !important;
      }

      /* ---------- Änderungs-Tabellen (Feld/Alt/Neu) ---------- */
      .gh-change-table {
        border-collapse: collapse;
        width: 100%;
        max-width: 100%;
        table-layout: fixed !important;
        font: inherit;
      }
      /* KRITISCH: Maximale Spezifität um Mainlog-Regeln zu überschreiben */
      .gh-mainlog tbody .gh-change-wrap .gh-change-table th,
      .gh-mainlog tbody .gh-change-wrap .gh-change-table td {
        border: 1px solid #ddd;
        vertical-align: top;
        /* Robuster Umbruch: bricht nur um wenn nötig, dann aber zuverlässig */
        white-space: normal !important;
        word-wrap: break-word !important;
        overflow-wrap: anywhere !important;
        min-width: 0 !important;
        max-width: 100% !important;
        box-sizing: border-box;
        word-break: normal !important;
        /* Default padding für alle Zellen */
        padding: 4px 6px !important;
      }
      /* Thead ausblenden */
      .gh-mainlog tbody .gh-change-wrap .gh-change-table thead {
        display: none;
      }
      /* Feld-Spalte (1) */
      .gh-mainlog tbody .gh-change-wrap .gh-change-table tbody td:nth-child(1) {
        width: 20% !important;
        max-width: 20% !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }
      /* Alt und Neu Spalten (2+3) */
      .gh-mainlog tbody .gh-change-wrap .gh-change-table tbody td:nth-child(2),
      .gh-mainlog tbody .gh-change-wrap .gh-change-table tbody td:nth-child(3) {
        word-break: break-all !important;
      }
      .gh-mainlog tbody .gh-change-wrap .gh-change-table tbody td:nth-child(2) {
        width: 40% !important;
        max-width: 40% !important;
      }
      .gh-mainlog tbody .gh-change-wrap .gh-change-table tbody td:nth-child(3) {
        width: 40% !important;
        max-width: 40% !important;
      }

      /* Originaltexte: global sichtbar/unsichtbar - EINHEITLICHE SCHRIFTART */
      .gh-original {
        display:none;
        white-space:pre-wrap;
        color:#333;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important;
        margin-top:4px;
      }
      body.gh-show-original .gh-original { display:block; }
      body.gh-show-original .gh-change-wrap .gh-change-table { display: none !important; }

      /* Diff-Hervorhebung nur in TDs (Header bleibt unberührt) */
      .gh-change-table td .gh-diff-added   { background: #e6ffe6; border-radius: 3px; padding: 0 3px; }
      .gh-change-table td .gh-diff-removed { background: #ffecec; border-radius: 3px; padding: 0 3px; text-decoration: line-through; }

      /* Schalter (Switch) */
      .gh-switch { display:inline-flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; user-select:none; }
      .gh-switch input { display:none; }
      .gh-switch .gh-slider {
        position: relative; width: 40px; height: 20px; border-radius: 999px;
        background: #ccc; transition: background 0.2s ease;
      }
      .gh-switch .gh-slider::before {
        content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
        border-radius: 50%; background: #fff; transition: transform 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      .gh-switch input:checked + .gh-slider { background: #4caf50; }
      .gh-switch input:checked + .gh-slider::before { transform: translateX(20px); }
      .gh-switch .gh-switch-label { color:#333; }

      /* Disabled State */
      .gh-switch.gh-disabled { cursor: not-allowed; opacity: 0.5; }
      .gh-switch.gh-disabled .gh-slider { background: #e0e0e0; }
      .gh-switch.gh-disabled input:checked + .gh-slider { background: #a5d6a7; }
      .gh-switch.gh-disabled .gh-switch-label { color: #999; }

      /* ---------- Haupt-Logtabelle (WHAT/WHO/TIME) ---------- */
      .gh-mainlog { table-layout: fixed; }
      .gh-mainlog th, .gh-mainlog td { position: relative; }

      /* Spaltenbreiten für Haupttabelle: 10%/10%/10%/70% */
      .gh-mainlog > tbody > tr > th:nth-child(1),
      .gh-mainlog > tbody > tr > td:nth-child(1) {
        width: 10% !important;
        min-width: 10% !important;
        max-width: 10% !important;
        text-align: center !important;
      }
      .gh-mainlog > tbody > tr > th:nth-child(2),
      .gh-mainlog > tbody > tr > td:nth-child(2) {
        width: 10% !important;
        min-width: 10% !important;
        max-width: 10% !important;
        text-align: center !important;
      }
      .gh-mainlog > tbody > tr > th:nth-child(3),
      .gh-mainlog > tbody > tr > td:nth-child(3) {
        width: 10% !important;
        min-width: 10% !important;
        max-width: 10% !important;
        text-align: center !important;
      }
      .gh-mainlog > tbody > tr > th:nth-child(4),
      .gh-mainlog > tbody > tr > td:nth-child(4) {
        width: 70% !important;
        min-width: 70% !important;
        max-width: 70% !important;
      }

      /* 1) Erste drei Spalten: Umbrechen erlauben, aber nur wenn nötig */
      .gh-mainlog > tbody > tr > th:nth-child(-n+3),
      .gh-mainlog > tbody > tr > td:nth-child(-n+3) {
        white-space: normal !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
      }

      /* INFO-Spalte: Umbrechen erlauben */
      .gh-mainlog > tbody > tr > th:nth-child(4),
      .gh-mainlog > tbody > tr > td:nth-child(4) {
        white-space: normal !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
      }

      /* Heute-Markierung (nur Datum fett) */
      .gh-date-today { font-weight: 700; }

      /* ---------- Change-Table Exception-Regeln (müssen NACH Mainlog-Regeln kommen) ---------- */
      /* Explizite Exception: Change-Table TDs dürfen umbrechen */
      .gh-change-table td {
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        word-break: normal !important;
      }

      /* Versteckte Zeilen für User-Filter */
      .gh-row-hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // -------------------- Globals --------------------
  const url = new URL(location.href);
  const idParam = url.searchParams.get("id") || "";
  let mainLogTable = null;

  const managedTables = new Set();
  let diffState = true; // Standardmäßig AN
  let originalsState = false;
  let resizeTimeout = null;

  // Hauptfeldtypen (GROSSBUCHSTABEN)
  const MAIN_FIELD_TYPES = [
    "BEZEICHNUNG",
    "DESC",
    "HINWEIS",
    "KW",
    "MATCHRULE",
    "MPN"
  ];

  // Spaltenbreiten - zentral steuerbar
  const MAIN_TABLE_WIDTHS = {
    TIME: 0.08,
    WHO: 0.05,
    WHAT: 0.08,
    INFO: 0.79
  };

  const CHANGE_TABLE_WIDTHS = {
    FIELD: "20%",
    OLD: "40%",
    NEW: "40%"
  };

  // -------------------- User & Event Filter --------------------
  let selectedUser = "";
  let selectedEvents = new Set();
  let userDropdown = null;
  let eventMultiSelect = null;

  function buildUserFilter(filterEvents = null) {
    const userCounts = new Map();
    let createUser = null;

    const mainTbody = mainLogTable.querySelector("tbody");
    if (!mainTbody) return null;

    const rows = Array.from(mainTbody.children);
    rows.forEach(row => {
      if (row.querySelector("th")) return;

      const whoCell = row.children[1];
      const whatCell = row.children[2];
      const infoCell = row.children[3];
      if (!whoCell || !whatCell || !infoCell) return;

      const infoText = infoCell.textContent.trim();
      if (/^GH::Images\s+DELETE:\s*<[^>]+>$/i.test(infoText)) return;

      if (filterEvents && filterEvents.size > 0) {
        const eventName = whatCell.textContent.trim();
        if (!filterEvents.has(eventName)) return;
      }

      let userName = whoCell.textContent.trim();

      const match = userName.match(/\(([^)]+)\)$/);
      if (match) {
        userName = match[1];
      }

      const count = userCounts.get(userName) || 0;
      userCounts.set(userName, count + 1);

      if (whatCell.textContent.trim() === "CREATE") {
        createUser = userName;
      }
    });

    const sortedUsers = Array.from(userCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    const select = document.createElement("select");
    select.className = "gh-user-filter";

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = `Alle User-Edits (${sortedUsers.reduce((sum, [, count]) => sum + count, 0)})`;
    select.appendChild(allOption);

    sortedUsers.forEach(([userName, count]) => {
      const option = document.createElement("option");
      option.value = userName;
      option.textContent = `${userName} (${count})`;

      if (userName === createUser) {
        option.style.fontWeight = "bold";
      }

      if (userName === selectedUser) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      selectedUser = e.target.value;

      if (eventMultiSelect?.parentElement) {
        const newEventMultiSelect = buildEventMultiSelect(selectedUser);
        if (newEventMultiSelect) {
          eventMultiSelect.replaceWith(newEventMultiSelect);
          eventMultiSelect = newEventMultiSelect;
        }
      }

      applyFilters();
    });

    return select;
  }

  function buildEventMultiSelect(filterUser = "") {
    const eventCounts = new Map();
    const allEvents = new Set();

    const mainTbody = mainLogTable.querySelector("tbody");
    if (!mainTbody) return null;

    const rows = Array.from(mainTbody.children);
    rows.forEach(row => {
      if (row.querySelector("th")) return;

      const whoCell = row.children[1];
      const whatCell = row.children[2];
      const infoCell = row.children[3];
      if (!whatCell || !infoCell || !whoCell) return;

      const infoText = infoCell.textContent.trim();
      if (/^GH::Images\s+DELETE:\s*<[^>]+>$/i.test(infoText)) return;

      const eventName = whatCell.textContent.trim();
      if (!eventName) return;

      allEvents.add(eventName);

      if (filterUser) {
        let userName = whoCell.textContent.trim();
        const match = userName.match(/\(([^)]+)\)$/);
        if (match) {
          userName = match[1];
        }
        if (userName !== filterUser) return;
      }

      const count = eventCounts.get(eventName) || 0;
      eventCounts.set(eventName, count + 1);
    });

    allEvents.forEach(eventName => {
      if (!EVENT_ORDER.includes(eventName) && eventName !== "----") {
        alert(`Showlog-Userscript: Event "${eventName}" nicht definiert, bitte martink bescheid geben.`);
      }
    });

    const container = document.createElement("div");
    container.className = "gh-event-multiselect";

    const trigger = document.createElement("div");
    trigger.className = "gh-event-trigger";

    const updateTriggerText = () => {
      const activeCount = selectedEvents.size;
      const totalCount = EVENT_ORDER.filter(e => e !== "----" && eventCounts.has(e)).length;
      trigger.innerHTML = `
        <span>WHAT (${activeCount}/${totalCount})</span>
        <span class="gh-event-trigger-arrow">▼</span>
      `;
    };

    const dropdown = document.createElement("div");
    dropdown.className = "gh-event-dropdown";

    const header = document.createElement("div");
    header.className = "gh-event-dropdown-header";
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "gh-event-clear-btn";

    const updateToggleButton = () => {
      const nothingSelected = selectedEvents.size === 0;

      if (nothingSelected) {
        toggleBtn.textContent = "Alle anwählen";
        toggleBtn.classList.add("gh-select-all");
      } else {
        toggleBtn.textContent = "Alle abwählen";
        toggleBtn.classList.remove("gh-select-all");
      }
    };

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const isDeselectMode = selectedEvents.size > 0;

      if (isDeselectMode) {
        selectedEvents.clear();
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });
      } else {
        const availableEvents = EVENT_ORDER.filter(e => e !== "----" && eventCounts.has(e));
        selectedEvents.clear();
        availableEvents.forEach(e => selectedEvents.add(e));
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          const eventName = cb.value;
          if (eventCounts.has(eventName)) {
            cb.checked = true;
          }
        });
      }

      updateTriggerText();
      updateToggleButton();

      if (userDropdown?.parentElement) {
        const newUserDropdown = buildUserFilter(selectedEvents);
        if (newUserDropdown) {
          userDropdown.replaceWith(newUserDropdown);
          userDropdown = newUserDropdown;
        }
      }

      applyFilters();
    });

    header.appendChild(toggleBtn);
    dropdown.appendChild(header);

    const isInitialState = selectedEvents.size === 0;
    if (isInitialState) {
      EVENT_ORDER.forEach(eventName => {
        if (eventName !== "----" && eventCounts.has(eventName)) {
          selectedEvents.add(eventName);
        }
      });
    }

    updateTriggerText();
    updateToggleButton();

    EVENT_ORDER.forEach(eventName => {
      if (eventName === "----") {
        const separator = document.createElement("div");
        separator.className = "gh-event-separator";
        dropdown.appendChild(separator);
        return;
      }

      const count = eventCounts.get(eventName) || 0;
      const isAvailable = count > 0;

      const option = document.createElement("label");
      option.className = "gh-event-option";
      if (!isAvailable) {
        option.classList.add("gh-event-disabled");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = eventName;
      checkbox.disabled = !isAvailable;

      checkbox.checked = isAvailable && selectedEvents.has(eventName);

      checkbox.addEventListener("change", (e) => {
        e.stopPropagation();
        if (checkbox.checked) {
          selectedEvents.add(eventName);
        } else {
          selectedEvents.delete(eventName);
        }
        updateTriggerText();
        updateToggleButton();

        if (userDropdown?.parentElement) {
          const newUserDropdown = buildUserFilter(selectedEvents);
          if (newUserDropdown) {
            userDropdown.replaceWith(newUserDropdown);
            userDropdown = newUserDropdown;
          }
        }

        applyFilters();
      });

      const label = document.createElement("span");
      if (eventName === "CREATE" || eventName === "BULK-CREATE") {
        label.textContent = eventName;
      } else {
        label.textContent = isAvailable ? `${eventName} (${count})` : eventName;
      }

      option.appendChild(checkbox);
      option.appendChild(label);
      dropdown.appendChild(option);
    });

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("gh-open");
    });

    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove("gh-open");
      }
    });

    container.appendChild(trigger);
    container.appendChild(dropdown);

    return container;
  }

  function applyFilters() {
    if (!mainLogTable) return;

    const mainTbody = mainLogTable.querySelector("tbody");
    if (!mainTbody) return;

    const rows = Array.from(mainTbody.children);

    rows.forEach(row => {
      if (row.querySelector("th")) return;

      const whoCell = row.children[1];
      const whatCell = row.children[2];
      if (!whoCell || !whatCell) return;

      let cellUserName = whoCell.textContent.trim();
      const match = cellUserName.match(/\(([^)]+)\)$/);
      if (match) {
        cellUserName = match[1];
      }

      const cellEventName = whatCell.textContent.trim();

      const userMatches = !selectedUser || cellUserName === selectedUser;
      const eventMatches = selectedEvents.has(cellEventName);

      if (userMatches && eventMatches) {
        row.classList.remove("gh-row-hidden");
      } else {
        row.classList.add("gh-row-hidden");
      }
    });
  }

  // -------------------- Topbar --------------------
  function ensureTopbar() {
    if (document.querySelector(".gh-topbar") || !mainLogTable) return;

    const bar = document.createElement("div");
    bar.className = "gh-topbar gh-owned gh-unify-font";

    const left = document.createElement("div");
    left.className = "gh-left";
    if (idParam) {
      const a = document.createElement("a");
      a.className = "gh-backlink";
      a.href = `https://opus.geizhals.at/kalif/artikel?id=${encodeURIComponent(idParam)}`;
      a.textContent = "Zurück zu Artikel";
      left.appendChild(a);
    }

    userDropdown = buildUserFilter();
    if (userDropdown) {
      left.appendChild(userDropdown);
    }

    eventMultiSelect = buildEventMultiSelect();
    if (eventMultiSelect) {
      left.appendChild(eventMultiSelect);
    }

    const quickFilterBtn = document.createElement("button");
    quickFilterBtn.className = "gh-quick-filter-btn";
    quickFilterBtn.textContent = "Nur MATCH/PREISLIMIT";
    quickFilterBtn.addEventListener("click", () => {
      selectedEvents.clear();
      selectedEvents.add("MATCH-ADD");
      selectedEvents.add("MATCH-ADD-MR");
      selectedEvents.add("MATCH-DELETE");
      selectedEvents.add("PREISLIMIT");

      if (eventMultiSelect?.parentElement) {
        const newEventMultiSelect = buildEventMultiSelect(selectedUser);
        if (newEventMultiSelect) {
          eventMultiSelect.replaceWith(newEventMultiSelect);
          eventMultiSelect = newEventMultiSelect;
        }
      }

      if (userDropdown?.parentElement) {
        const newUserDropdown = buildUserFilter(selectedEvents);
        if (newUserDropdown) {
          userDropdown.replaceWith(newUserDropdown);
          userDropdown = newUserDropdown;
        }
      }

      applyFilters();
    });
    left.appendChild(quickFilterBtn);

    const right = document.createElement("div");
    right.className = "gh-right";

    const diffLabel = document.createElement("label");
    diffLabel.className = "gh-switch";
    const diffInput = document.createElement("input");
    diffInput.type = "checkbox";
    diffInput.checked = true;
    diffInput.setAttribute("aria-label", "Unterschiede hervorheben (global)");
    const diffSlider = document.createElement("span");
    diffSlider.className = "gh-slider";
    const diffCaption = document.createElement("span");
    diffCaption.className = "gh-switch-label";
    diffCaption.textContent = "Unterschiede hervorheben";
    diffLabel.appendChild(diffInput);
    diffLabel.appendChild(diffSlider);
    diffLabel.appendChild(diffCaption);
    diffInput.addEventListener("change", () => {
      diffState = diffInput.checked;
      applyDiffStateToAll(diffState);
    });

    const origLabel = document.createElement("label");
    origLabel.className = "gh-switch";
    const origInput = document.createElement("input");
    origInput.type = "checkbox";
    origInput.setAttribute("aria-label", "Originaltext anzeigen (global)");
    const origSlider = document.createElement("span");
    origSlider.className = "gh-slider";
    const origCaption = document.createElement("span");
    origCaption.className = "gh-switch-label";
    origCaption.textContent = "Originaltext anzeigen";
    origLabel.appendChild(origInput);
    origLabel.appendChild(origSlider);
    origLabel.appendChild(origCaption);
    origInput.addEventListener("change", () => {
      originalsState = origInput.checked;
      document.body.classList.toggle("gh-show-original", originalsState);

      if (originalsState) {
        diffLabel.classList.add("gh-disabled");
        diffInput.disabled = true;
      } else {
        diffLabel.classList.remove("gh-disabled");
        diffInput.disabled = false;
      }
    });

    right.appendChild(diffLabel);
    right.appendChild(origLabel);

    bar.appendChild(left);
    bar.appendChild(right);

    mainLogTable.parentNode.insertBefore(bar, mainLogTable);
  }

  // -------------------- Utilities --------------------
  function firstLogTable() {
    const cell = document.querySelector("td.wrap-anywhere, td:nth-child(4)");
    return cell ? cell.closest("table") : document.querySelector("table");
  }

  function extractBracketSegmentsSmart(payload) {
    const segs = [];
    let i = 0, d = 0, start = -1;
    while (i < payload.length) {
      const ch = payload[i];
      if (ch === "[") {
        if (d === 0) start = i + 1;
        d++;
      } else if (ch === "]") {
        d--;
        if (d === 0 && start >= 0) {
          segs.push(payload.slice(start, i));
          start = -1;
        }
      }
      i++;
    }
    return segs;
  }

  function parseChangeSegment(segment) {
    const ARROW = "==>";
    const idx = segment.indexOf(ARROW);

    if (idx === -1) {
      const fieldOnly = (segment || "").trim();
      return {
        field: fieldOnly.replace(/:$/, "") || "(unbekannt)",
        oldVal: "NIX",
        newVal: ""
      };
    }

    const left = segment.slice(0, idx).trimEnd();
    const right = segment.slice(idx + ARROW.length).trim();

    let field = "",
      oldVal = "";

    for (const mainType of MAIN_FIELD_TYPES) {
      const pattern = new RegExp(`^${mainType}(?:\\s+|:|$)`, "i");
      if (pattern.test(left)) {
        field = mainType;
        oldVal = left
          .slice(mainType.length)
          .replace(/^[\s:]+/, "")
          .trim();
        break;
      }
    }

    if (!field) {
      const keyMatch = /^([a-z0-9_]+)\s*(.*)$/i.exec(left);
      if (keyMatch) {
        field = keyMatch[1].replace(/:$/, "").trim();
        oldVal = keyMatch[2].replace(/^:\s*/, "").trim();
      } else {
        field = left.replace(/:$/, "").trim() || "(unbekannt)";
        oldVal = "";
      }
    }

    if (oldVal === "") oldVal = "NIX";
    const clean = (s) => s.replace(/\s*,\s*/g, ", ").trim();
    return { field, oldVal: clean(oldVal), newVal: clean(right) };
  }

  function buildTable(changes) {
    const t = document.createElement("table");
    t.className = "gh-change-table";

    t.innerHTML = `
      <colgroup>
        <col style="width:${CHANGE_TABLE_WIDTHS.FIELD}">
        <col style="width:${CHANGE_TABLE_WIDTHS.OLD}">
        <col style="width:${CHANGE_TABLE_WIDTHS.NEW}">
      </colgroup>
      <tbody></tbody>
    `;
    const tb = t.querySelector("tbody");
    for (const { field, oldVal, newVal } of changes) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      td1.textContent = (field || "").trim();
      td2.textContent = (oldVal || "").trim();
      td3.textContent = (newVal || "").trim();
      td2.dataset.orig = (oldVal || "").trim();
      td3.dataset.orig = (newVal || "").trim();
      tr.append(td1, td2, td3);
      tb.appendChild(tr);
    }
    return t;
  }

  function normalizePictureEventInCell(cell) {
    const raw = (cell.textContent || "").trim();
    if (!/^Picture uploaded:/i.test(raw)) return false;
    const m = raw.match(
      /Picture uploaded:\s*<[^>]*>\s*->\s*<\s*(?:https?:\/\/[^>]*?)?\/images\/pix_source\/([^>]+?)\s*>/i
    );
    if (m && m[1]) cell.textContent = `Picture uploaded: <${m[1]}>`;
    cell.classList.add("gh-picture-processed");
    return true;
  }

  function removeGhImagesDeleteRows() {
    for (const tr of Array.from(document.querySelectorAll("tr"))) {
      const info = tr.querySelector("td.wrap-anywhere, td:nth-child(4)");
      if (!info) continue;
      const txt = (info.textContent || "").trim();
      if (/^GH::Images\s+DELETE:\s*<[^>]+>$/i.test(txt)) tr.remove();
    }
  }

  function normalizeDateTimeInCell(cell) {
    if (cell.closest(".gh-owned")) return;
    if (cell.classList.contains("gh-picture-processed")) return;

    const row = cell.closest("tr");
    if (row) {
      const cells = Array.from(row.children);
      const cellIndex = cells.indexOf(cell);
      if (cellIndex === 1) return;
    }

    const raw = cell.textContent || "";
    if (/^Picture uploaded:/i.test(raw)) return;

    const dateMatch = raw.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    const timeMatch = raw.match(/\b(\d{1,2}:\d{2}:\d{2})(?:\.\d+)?(?:[+\-]\d{2})?\b/);
    if (!dateMatch && !timeMatch) return;

    const y = dateMatch ? dateMatch[1] : null;
    const m = dateMatch ? dateMatch[2] : null;
    const d = dateMatch ? dateMatch[3] : null;
    const ddmmyyyy = dateMatch ? `${d}-${m}-${y}` : null;
    const hhmmss = timeMatch ? timeMatch[1] : null;

    let isToday = false;
    if (dateMatch) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      isToday =
        `${y}-${m}-${d}` ===
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }

    if (!ddmmyyyy && !hhmmss) return;

    const container = document.createElement("span");
    if (ddmmyyyy) {
      const dateEl = document.createElement(isToday ? "b" : "span");
      if (isToday) dateEl.className = "gh-date-today";
      dateEl.textContent = ddmmyyyy;
      container.appendChild(dateEl);
    }
    if (ddmmyyyy && hhmmss) container.appendChild(document.createTextNode(" - "));
    if (hhmmss) {
      const timeEl = document.createElement("span");
      timeEl.textContent = hhmmss;
      container.appendChild(timeEl);
    }

    let rest = raw;
    if (dateMatch) rest = rest.replace(dateMatch[0], "").trim();
    if (timeMatch) rest = rest.replace(timeMatch[0], "").trim();

    cell.innerHTML = "";
    cell.appendChild(container);
    if (rest) cell.appendChild(document.createTextNode(" " + rest));
  }

  function normalizeDateTimeOnPage(root) {
    root.querySelectorAll("td").forEach(normalizeDateTimeInCell);
  }

  // -------------------- Diff --------------------
  function chooseSeparator(a, b) {
    const count = (s, ch) =>
      s ? (s.match(new RegExp(`\\${ch}`, "g")) || []).length : 0;
    const ca = { pipe: count(a, "|"), comma: count(a, ",") };
    const cb = { pipe: count(b, "|"), comma: count(b, ",") };
    if (ca.pipe + cb.pipe >= ca.comma + cb.comma && ca.pipe + cb.pipe > 0)
      return "|";
    if (ca.comma + cb.comma > 0) return ",";
    return null;
  }

  function tokenize(s, sep) {
    if (!s) return [];
    if (sep === "|" || sep === ",")
      return s
        .split(sep)
        .map((t) => t.trim())
        .filter(Boolean);
    return s
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  function renderTokens(tokens, joiner, klass) {
    const frag = document.createDocumentFragment();
    tokens.forEach((t, i) => {
      const span = document.createElement("span");
      const c = klass(t);
      if (c) span.className = c;
      span.textContent = t;
      frag.appendChild(span);
      if (i < tokens.length - 1) frag.appendChild(document.createTextNode(joiner));
    });
    return frag;
  }

  function applyDiffToTable(table, on) {
    const tb = table.tBodies && table.tBodies[0];
    if (!tb) return;
    for (const tr of Array.from(tb.rows)) {
      const tdOld = tr.children[1];
      const tdNew = tr.children[2];
      if (!tdOld || !tdNew) continue;
      const oldText = tdOld.dataset.orig ?? tdOld.textContent ?? "";
      const newText = tdNew.dataset.orig ?? tdNew.textContent ?? "";

      const oldIsNix = oldText.trim() === "NIX";
      const newIsNix = newText.trim() === "NIX";

      if (!on) {
        tdOld.textContent = oldText;
        tdNew.textContent = newText;
        continue;
      }

      if (oldIsNix) {
        tdOld.textContent = oldText;
      } else {
        const sep = chooseSeparator(oldText, newText);
        const joiner = sep === "|" ? " | " : sep === "," ? ", " : " ";
        const oldT = tokenize(oldText, sep);
        const newT = tokenize(newText, sep);
        const setNew = new Set(newT);
        tdOld.innerHTML = "";
        tdOld.appendChild(
          renderTokens(oldT, joiner, (t) => (!setNew.has(t) ? "gh-diff-removed" : ""))
        );
      }

      if (newIsNix) {
        tdNew.textContent = newText;
      } else {
        const sep = chooseSeparator(oldText, newText);
        const joiner = sep === "|" ? " | " : sep === "," ? ", " : " ";
        const oldT = tokenize(oldText, sep);
        const newT = tokenize(newText, sep);
        const setOld = new Set(oldT);
        tdNew.innerHTML = "";
        tdNew.appendChild(
          renderTokens(newT, joiner, (t) => (!setOld.has(t) ? "gh-diff-added" : ""))
        );
      }
    }
  }

  function applyDiffStateToAll(on) {
    managedTables.forEach((t) => applyDiffToTable(t, on));
  }

  // -------------------- Changes / MATCHRULE / PREISLIMIT → Tabellen --------------------
  function processInfoCell_Changes(cell) {
    if (cell.dataset.ghProcessed === "1") return true;
    const text = (cell.textContent || "").trim();
    if (!text.startsWith("Changes:")) return false;

    const original = text;
    const segments = extractBracketSegmentsSmart(text.slice("Changes:".length).trim());
    if (!segments.length) return false;

    const parsed = segments.map(parseChangeSegment);
    const table = buildTable(parsed);

    const wrap = document.createElement("div");
    wrap.className = "gh-owned gh-change-wrap";
    const pre = document.createElement("pre");
    pre.className = "gh-original";
    pre.textContent = original;

    wrap.appendChild(table);
    wrap.appendChild(pre);
    cell.innerHTML = "";
    cell.appendChild(wrap);

    managedTables.add(table);
    if (diffState) applyDiffToTable(table, true);
    cell.dataset.ghProcessed = "1";
    return true;
  }

  function processInfoCell_Preislimit(cell) {
    if (cell.dataset.ghProcessed === "1") return true;

    const row = cell.closest("tr");
    if (!row) return false;
    const whatCell = row.querySelector("td:nth-child(3)");
    if (!whatCell || whatCell.textContent.trim() !== "PREISLIMIT") return false;

    const text = (cell.textContent || "").trim();

    if (!/==>/.test(text)) return false;

    const original = text;
    const parts = text.split("==>");
    if (parts.length !== 2) return false;

    const oldVal = parts[0].trim();
    const newVal = parts[1].trim();

    const parsed = [{ field: "PREISLIMIT", oldVal, newVal }];
    const table = buildTable(parsed);

    const wrap = document.createElement("div");
    wrap.className = "gh-owned gh-change-wrap";
    const pre = document.createElement("pre");
    pre.className = "gh-original";
    pre.textContent = original;

    wrap.appendChild(table);
    wrap.appendChild(pre);
    cell.innerHTML = "";
    cell.appendChild(wrap);

    managedTables.add(table);
    if (diffState) applyDiffToTable(table, true);
    cell.dataset.ghProcessed = "1";
    return true;
  }

  function processInfoCell_Matchrule(cell) {
    if (cell.dataset.ghProcessed === "1") return true;
    const text = (cell.textContent || "").trim();
    if (/^Changes:/i.test(text)) return false;
    if (!/\[/.test(text) || !/MATCHRULE/i.test(text) || !/==>/.test(text))
      return false;

    const segs = extractBracketSegmentsSmart(text).filter((seg) =>
      /^\s*MATCHRULE\b\s*:?.*==>/.test(seg)
    );
    if (!segs.length) return false;

    const original = text;
    const parsed = segs.map(parseChangeSegment);
    const table = buildTable(parsed);

    const wrap = document.createElement("div");
    wrap.className = "gh-owned gh-change-wrap";
    const pre = document.createElement("pre");
    pre.className = "gh-original";
    pre.textContent = original;

    wrap.appendChild(table);
    wrap.appendChild(pre);
    cell.innerHTML = "";
    cell.appendChild(wrap);

    managedTables.add(table);
    if (diffState) applyDiffToTable(table, true);
    cell.dataset.ghProcessed = "1";
    return true;
  }

  // -------------------- Haupt-Logtabelle --------------------
  function markMainLogTable() {
    if (mainLogTable) return;
    mainLogTable = firstLogTable();
    if (!mainLogTable) return;
    mainLogTable.classList.add("gh-unify-font", "gh-mainlog");

    const colgroups = mainLogTable.querySelectorAll("colgroup");
    colgroups.forEach((cg) => {
      if (cg.parentElement === mainLogTable) {
        cg.remove();
      }
    });

    const setMainTableColumnWidths = () => {
      if (!mainLogTable) return;

      const container = mainLogTable.parentElement;
      const availableWidth =
        (container ? container.clientWidth : document.body.clientWidth) - 20;

      const widths = {
        time: Math.floor(availableWidth * MAIN_TABLE_WIDTHS.TIME),
        who: Math.floor(availableWidth * MAIN_TABLE_WIDTHS.WHO),
        what: Math.floor(availableWidth * MAIN_TABLE_WIDTHS.WHAT),
        info: Math.floor(availableWidth * MAIN_TABLE_WIDTHS.INFO)
      };

      const firstRow = mainLogTable.querySelector("tbody > tr:first-child");
      if (firstRow) {
        const cells = Array.from(firstRow.children);
        const widthValues = [widths.time, widths.who, widths.what, widths.info];

        cells.forEach((cell, i) => {
          if (widthValues[i]) {
            cell.style.setProperty("width", widthValues[i] + "px", "important");
            cell.style.setProperty("min-width", widthValues[i] + "px", "important");
            cell.style.setProperty("max-width", widthValues[i] + "px", "important");

            const allRows = Array.from(mainLogTable.querySelectorAll("tbody > tr"));
            allRows.forEach((tr) => {
              const c = tr.children[i];
              if (c) {
                c.style.setProperty("width", widthValues[i] + "px", "important");
                c.style.setProperty("min-width", widthValues[i] + "px", "important");
                c.style.setProperty("max-width", widthValues[i] + "px", "important");
              }
            });
          }
        });
      }
    };

    setTimeout(setMainTableColumnWidths, 100);

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setMainTableColumnWidths, 150);
    });
  }

  // -------------------- Pipeline --------------------
  function processPage() {
    markMainLogTable();
    if (!mainLogTable) return;

    ensureTopbar();
    removeGhImagesDeleteRows();

    document.querySelectorAll("td").forEach(normalizePictureEventInCell);

    const infoCells = Array.from(
      document.querySelectorAll("td.wrap-anywhere, td:nth-child(4)")
    );
    infoCells.forEach((cell) => {
      if (processInfoCell_Changes(cell)) return;
      if (processInfoCell_Preislimit(cell)) return;
      processInfoCell_Matchrule(cell);
    });

    normalizeDateTimeOnPage(document.body);

    applyDiffStateToAll(diffState);

    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
  }

  processPage();

  const observer = new MutationObserver((muts) => {
    const external = muts.some((m) => {
      const node = m.target.nodeType === 3 ? m.target.parentElement : m.target;
      return !node || !node.closest || !node.closest(".gh-owned");
    });
    if (external) requestAnimationFrame(processPage);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
// ==UserScript==
// @name         Friendly Aither tables
// @namespace    https://aither.cc/
// @version      1.0.2
// @description  Click table headers to sort on aither.cc
// @match        https://aither.cc/torrents/*/*
// @match        https://aither.cc/users/*
// @license      gpl-3.0
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552710/Friendly%20Aither%20tables.user.js
// @updateURL https://update.greasyfork.org/scripts/552710/Friendly%20Aither%20tables.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .data-table thead th { cursor: pointer; user-select: none; position: relative; }
    .data-table thead th[data-sortdir="asc"]::after  { content: "▲"; opacity:.8; font-size:.8em; margin-left:.35em; }
    .data-table thead th[data-sortdir="desc"]::after { content: "▼"; opacity:.8; font-size:.8em; margin-left:.35em; }
  `;
  document.documentElement.appendChild(style);

  const NBSP = /\u00a0/g, WS = /[ ,\t\r\n]+/g;
  const DEC = { b:1, kb:1e3, mb:1e6, gb:1e9, tb:1e12, pb:1e15 };
  const BIN = { kib:2**10, mib:2**20, gib:2**30, tib:2**40, pib:2**50 };
  // global, finds the first "<number><unit>" anywhere (works with "(…)" noise)
  const UNIT_G = /([+-]?\d+(?:[ ,]\d{3})*(?:\.\d+)?)(?:\s*)([KMGTPE]?i?B)\b/ig;

  // Locale collator for text compares (fast & stable)
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

  function parseBytesAny(raw) {
    if (!raw) return Number.NEGATIVE_INFINITY;
    const s = raw.replace(NBSP, " ").trim();
    UNIT_G.lastIndex = 0;
    const m = UNIT_G.exec(s);
    if (!m) return Number.NEGATIVE_INFINITY;
    const n = Number(m[1].replace(WS, ""));
    if (!Number.isFinite(n)) return Number.NEGATIVE_INFINITY;
    const u = m[2].toLowerCase();
    if (u in BIN) return n * BIN[u];
    if (u in DEC) return n * DEC[u];
    return Number.NEGATIVE_INFINITY;
  }
  
  function parseYesNo(raw) {
    const s = (raw || "").trim().toLowerCase();
    if (s === "yes") return 1;
    if (s === "no")  return 0;
    return Number.NEGATIVE_INFINITY;
  }

  function parseDateCell(cell) {
    const t = cell.querySelector("time");
    const v = t?.getAttribute("datetime") || cell.getAttribute("data-sort") || cell.textContent;
    const ts = Date.parse((v || "").replace(NBSP," ").trim());
    return Number.isNaN(ts) ? Number.NEGATIVE_INFINITY : ts;
  }

  function parseText(cell) {
    const v = cell.getAttribute("data-sort");
    return (v != null ? v : cell.textContent).replace(NBSP, " ").trim().toLowerCase();
  }

	function parseBytesCell(cell) { return parseBytesAny(cell.textContent); }

  function parseDurationSeedtime(cell) {
    const txt = (cell.textContent || "").replace(/\u00a0/g, " ").trim();
    if (!txt || /^(-|n\/a|\s*)$/i.test(txt)) return Number.NEGATIVE_INFINITY;

    const SEC = {
      year: 365 * 86400,
      month: 30 * 86400,  // treat a month as 30 days for ordering
      week:  7 * 86400,
      day:   86400,
      hour:  3600,
      min:   60,
      sec:   1,
    };

    let total = 0;

    // Match sequences like: 2M 1W 6D 23h 36m 12s, 3 months, 4wks, 5min, etc.
    // Preserve original unit case so 'M' (months) != 'm' (minutes).
    const re = /(\d+)\s*([a-zA-Z]+)/g;
    let m;
    while ((m = re.exec(txt))) {
      const val = Number(m[1]);
      const unitRaw = m[2];

      // Single-letter disambiguation by case:
      if (unitRaw === "M") { total += val * SEC.month; continue; } // Months
      if (unitRaw === "D") { total += val * SEC.day;   continue; } // Days

      const u = unitRaw.toLowerCase();
      if (u === "w" || u === "wk" || u === "wks" || u === "week" || u === "weeks") {
        total += val * SEC.week;
      } else if (u === "d" || u === "day" || u === "days") {
        total += val * SEC.day;
      } else if (u === "h" || u === "hr" || u === "hrs" || u === "hour" || u === "hours") {
        total += val * SEC.hour;
      } else if (u === "m" || u === "min" || u === "mins" || u === "minute" || u === "minutes") {
        total += val * SEC.min;
      } else if (u === "s" || u === "sec" || u === "secs" || u === "second" || u === "seconds") {
        total += val * SEC.sec;
      } else if (u === "mo" || u === "mon" || u === "mons" || u === "month" || u === "months") {
        total += val * SEC.month;
      } else if (u === "y" || u === "yr" || u === "yrs" || u === "year" || u === "years") {
        total += val * SEC.month;
      }      
      // Unknown units are ignored
    }

    return total > 0 ? total : Number.NEGATIVE_INFINITY;
  }

  function detectType(th, sampleCells) {
    if (th.dataset.type) {
      // override if header says seedtime but data-type is text
      const hdr = th.textContent.trim().toLowerCase();
      if (/seedtime/.test(hdr)) return (th.dataset.type = "duration");
      return th.dataset.type;
    }    
    const header = th.textContent.trim().toLowerCase();
    if (/upload|download|left|size|refunded/.test(header)) return (th.dataset.type = "bytes");
    if (/last update|completed at|added/.test(header))    return (th.dataset.type = "date");
    if (/connected|completed|connectable/.test(header))   return (th.dataset.type = "yesno");
    if (/agent|user|client|ip|port|peers/.test(header))   return (th.dataset.type = "text");
    if (/seedtime/.test(header))                          return (th.dataset.type = "duration");
    let bytesHit=0, dateHit=0, ynHit=0, textHit=0;
    for (let i=0;i<sampleCells.length;i++) {
      const c = sampleCells[i];
      const txt = c.textContent.replace(NBSP, " ").trim();
      if (!txt || txt.toLowerCase() === "n/a" || txt === "---") { textHit++; continue; }
      const b = parseBytesStrict(txt);
      if (Number.isFinite(b)) bytesHit++;
      else if (!Number.isNaN(Date.parse(txt))) dateHit++;
      else if (parseYesNo(txt) !== Number.NEGATIVE_INFINITY) ynHit++;
      else textHit++;
    }
    const max = Math.max(bytesHit, dateHit, ynHit, textHit);
    const type = (max === bytesHit) ? "bytes" : (max === dateHit) ? "date" : (max === ynHit) ? "yesno" : "text";
    return (th.dataset.type = type);
  }

  function buildKeys(rows, colIdx, type) {
    const out = new Array(rows.length);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cell = row.cells[colIdx];
      let key;
      switch (type) {
        case "bytes":    key = parseBytesCell(cell); break;
        case "date":     key = parseDateCell(cell);  break;
        case "yesno":    key = parseYesNo(cell.textContent); break;
        case "duration": key = parseDurationSeedtime(cell); break;
        case "number":   key = Number((cell.textContent||"").replace(/[,\s]/g,"")) ?? Number.NEGATIVE_INFINITY; break;
        default:         key = parseText(cell); break;
      }
      out[i] = { row, i, key };
    }
    return out;
  }
  
  function cmp(a, b, type) {
    const aBad = a === Number.NEGATIVE_INFINITY;
    const bBad = b === Number.NEGATIVE_INFINITY;
    if (aBad && bBad) return 0;
    if (aBad) return 1;     // push invalid to bottom (asc)
    if (bBad) return -1;

    if (type === "text") return collator.compare(String(a), String(b));
    return a < b ? -1 : (a > b ? 1 : 0);
  }
  
  function sortTable(th) {
    const table = th.closest("table.data-table");
    if (!table) return;

    const dir = th.dataset.sortdir === "asc" ? "desc" : "asc";
    for (const t of th.parentNode.children) t.removeAttribute("data-sortdir");
    th.setAttribute("data-sortdir", dir);

    const tbody = table.tBodies[0] || table.createTBody();
    const rows = Array.from(tbody.rows);
    if (!rows.length) return;

    const colIdx = Array.prototype.indexOf.call(th.parentNode.children, th);
    const sample = rows.slice(0, 16).map(r => r.cells[colIdx]).filter(Boolean);
    const type = detectType(th, sample);

    const decorated = buildKeys(rows, colIdx, type);

    decorated.sort((A, B) => {
      const base = cmp(A.key, B.key, type);
      if (base !== 0) return dir === "asc" ? base : -base;
      return A.i - B.i; // stable
    });

    const frag = document.createDocumentFragment();
    for (let i=0;i<decorated.length;i++) frag.appendChild(decorated[i].row);
    requestAnimationFrame(() => { tbody.appendChild(frag); });
  }

  document.addEventListener("click", (ev) => {
    const th = ev.target instanceof Element ? ev.target.closest("table.data-table thead th") : null;
    if (!th) return;
    if (ev.target.closest("a,button,input,select,textarea")) return;
    sortTable(th);
  }, { passive: true });

  // Seed data-types by header text (micro-opt)
  function primeTypes() {
    document.querySelectorAll("table.data-table thead").forEach(thead => {
      const ths = thead.querySelectorAll("th");
      ths.forEach(th => {
        if (th.dataset.type) return;
        const lbl = th.textContent.trim().toLowerCase();
        if (/upload|download|left|size|refunded/.test(lbl)) th.dataset.type = "bytes";
        else if (/last update|completed at|added/.test(lbl)) th.dataset.type = "date";
        else if (/connected|completed|connectable/.test(lbl)) th.dataset.type = "yesno";
        else th.dataset.type = "text";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", primeTypes, { once: true });
  } else {
    primeTypes();
  }
})();

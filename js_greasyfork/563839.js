// ==UserScript==
// @name         HLTV: Add KPR estimate to player stats pages
// @namespace    plennhar-hltv-add-kpr-estimate-to-player-stats-pages
// @version      1.1
// @description  Adds an estimated KPR range column (calculated from Rounds, K-D Diff, and K/D), and sorts by the conservative minimum.
// @author       Plennhar
// @match        https://www.hltv.org/stats/players*
// @run-at       document-idle
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563839/HLTV%3A%20Add%20KPR%20estimate%20to%20player%20stats%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/563839/HLTV%3A%20Add%20KPR%20estimate%20to%20player%20stats%20pages.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2026 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(() => {
  "use strict";

  const CFG = {
    colClass: "tmKprRangeCol",
    matchesHeaderClass: "tmKprMatchesHeader",
    styleId: "tmKprRangeStyle",
    headerTextPlayers: "KPR (est.)",
    headerTextMatches: "KPR",
    matchesHeaderTextColor: "#87a3bf",
    decimals: 2,
    colWidthPx: 80,
    maxKillsPerRound: 5,
    observerDebounceMs: 60,
    matchCellPlaceholder: "…",
  };

  const normalizeMinus = (s) => (s || "").replace(/\u2212/g, "-");

  function parseIntLoose(text) {
    const s = normalizeMinus(text).replace(/[+,]/g, "").trim();
    const m = s.match(/-?\d+/);
    return m ? Number.parseInt(m[0], 10) : Number.NaN;
  }

  function parseFloatLoose(text) {
    const s = normalizeMinus(text).replace(/,/g, "").trim();
    const m = s.match(/-?\d+(?:\.\d+)?/);
    return m ? Number.parseFloat(m[0]) : Number.NaN;
  }

  function estimateKprRange(rounds, kdDiff, kdShown) {
    if (!Number.isFinite(rounds) || rounds <= 0) return null;
    if (!Number.isFinite(kdDiff)) return null;
    if (!Number.isFinite(kdShown) || kdShown <= 0) return null;

    const n = Math.round(kdShown * 100);
    if (!Number.isFinite(n) || n <= 0) return null;

    const maxKillsHard = CFG.maxKillsPerRound * rounds;

    let minKills = Infinity;
    let maxKills = -Infinity;

    const lhsFactor = (2 * n - 1);
    const rhsFactor = (2 * n + 1);

    for (let deaths = 1; deaths <= rounds; deaths++) {
      const kills = deaths + kdDiff;
      if (kills < 0) continue;
      if (kills > maxKillsHard) continue;

      const lhs = lhsFactor * deaths;
      const mid = 200 * kills;
      const rhs = rhsFactor * deaths;

      if (mid < lhs || mid >= rhs) continue;

      if (kills < minKills) minKills = kills;
      if (kills > maxKills) maxKills = kills;
    }

    if (!Number.isFinite(minKills) || !Number.isFinite(maxKills)) return null;

    return {
      kprMin: minKills / rounds,
      kprMax: maxKills / rounds,
      minKills,
      maxKills,
    };
  }

  function formatRange(minVal, maxVal) {
    const a = minVal.toFixed(CFG.decimals);
    const b = maxVal.toFixed(CFG.decimals);
    return (a === b) ? a : `${a}\u2013${b}`;
  }

  function findPlayersTable() {
    const tables = Array.from(document.querySelectorAll("table.stats-table"));
    for (const t of tables) {
      if (t.querySelector("thead th.kdDiffCol") && t.querySelector("tbody td.kdDiffCol") && t.querySelector("tbody td.gtSmartphone-only")) {
        return t;
      }
    }
    return null;
  }

  function findMatchesTable() {
    const direct =
      document.querySelector("table.stats-matches-table") ||
      document.querySelector("table.stats-table.stats-matches-table") ||
      document.querySelector("table.stats-table.sortable-table.stats-matches-table");
    if (direct) return direct;

    const tables = Array.from(document.querySelectorAll("table.stats-table"));
    for (const t of tables) {
      const headerRow = t.querySelector("thead tr");
      if (!headerRow) continue;
      const ht = (headerRow.textContent || "").replace(/\s+/g, " ").trim();
      if (/\bK\s*-\s*D\b/i.test(ht) && /\bDate\b/i.test(ht) && /\bMap\b/i.test(ht) && t.querySelector('tbody a[href*="/stats/matches/mapstatsid/"]')) {
        return t;
      }
    }
    return null;
  }

  function ensureStyle(table) {
    if (document.getElementById(CFG.styleId)) return;

    const refTh =
      table.querySelector("thead th.kdDiffCol") ||
      table.querySelector("thead th.kdCol") ||
      table.querySelector("thead th");

    const cs = refTh ? getComputedStyle(refTh) : null;

    const bgc = cs ? cs.backgroundColor : "transparent";
    const bgi = cs ? cs.backgroundImage : "none";
    const bgp = cs ? cs.backgroundPosition : "0% 0%";
    const bgr = cs ? cs.backgroundRepeat : "repeat";
    const bgs = cs ? cs.backgroundSize : "auto";
    const fg = cs ? cs.color : "inherit";

    const style = document.createElement("style");
    style.id = CFG.styleId;
    style.textContent = `
      th.${CFG.colClass}, td.${CFG.colClass} {
        width: ${CFG.colWidthPx}px !important;
        min-width: ${CFG.colWidthPx}px !important;
        white-space: nowrap !important;
        text-align: center !important;
      }

      th.${CFG.colClass},
      th.${CFG.colClass}:hover {
        background-color: ${bgc} !important;
        background-image: ${bgi} !important;
        background-position: ${bgp} !important;
        background-repeat: ${bgr} !important;
        background-size: ${bgs} !important;
        color: ${fg} !important;
        transition: none !important;
        filter: none !important;
      }

      th.${CFG.colClass}.${CFG.matchesHeaderClass},
      th.${CFG.colClass}.${CFG.matchesHeaderClass}:hover {
        color: ${CFG.matchesHeaderTextColor} !important;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHeaderPlayers(table) {
    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return null;

    const kdDiffTh = headerRow.querySelector("th.kdDiffCol");
    if (!kdDiffTh) return null;

    let th = headerRow.querySelector(`th.${CFG.colClass}`);
    if (!th) {
      th = document.createElement("th");
      th.classList.add(CFG.colClass, "gtSmartphone-only");
      th.textContent = CFG.headerTextPlayers;
      headerRow.insertBefore(th, kdDiffTh);
    }

    th.style.width = `${CFG.colWidthPx}px`;
    th.style.minWidth = `${CFG.colWidthPx}px`;
    th.style.whiteSpace = "nowrap";
    th.style.textAlign = "center";
    th.style.cursor = "pointer";

    return th;
  }

  function ensureRowCellPlayers(row, kdDiffTd) {
    let td = row.querySelector(`td.${CFG.colClass}`);
    if (!td) {
      td = document.createElement("td");
      td.classList.add("statsDetail", CFG.colClass, "gtSmartphone-only");
      td.style.width = `${CFG.colWidthPx}px`;
      td.style.minWidth = `${CFG.colWidthPx}px`;
      td.style.whiteSpace = "nowrap";
      td.style.textAlign = "center";
      row.insertBefore(td, kdDiffTd);
    }
    return td;
  }

  function updatePlayersRows(table) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    for (const row of rows) {
      const kdDiffTd = row.querySelector("td.kdDiffCol");
      if (!kdDiffTd) continue;

      const roundsTd = row.querySelector("td.gtSmartphone-only");
      if (!roundsTd) continue;

      const kdTd = kdDiffTd.nextElementSibling;
      if (!kdTd) continue;

      const td = ensureRowCellPlayers(row, kdDiffTd);

      const rounds = parseIntLoose(roundsTd.textContent);
      const kdDiff = parseIntLoose(kdDiffTd.textContent);
      const kdShown = parseFloatLoose(kdTd.textContent);

      const range = estimateKprRange(rounds, kdDiff, kdShown);
      if (!range) {
        td.textContent = "—";
        td.dataset.kprMin = "";
        td.dataset.kprMax = "";
        td.title = "";
        continue;
      }

      td.textContent = formatRange(range.kprMin, range.kprMax);
      td.dataset.kprMin = String(range.kprMin);
      td.dataset.kprMax = String(range.kprMax);
      td.title =
        `KPR range from integer (kills,deaths) consistent with:\n` +
        `Rounds=${rounds}, KD Diff=${kdDiff}, shown K/D=${kdShown.toFixed(2)}\n` +
        `Kills range: ${range.minKills}–${range.maxKills}`;
    }
  }

  function sortByKprMin(table, dir) {
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      const aTd = a.querySelector(`td.${CFG.colClass}`);
      const bTd = b.querySelector(`td.${CFG.colClass}`);

      const aVal = aTd ? Number.parseFloat(aTd.dataset.kprMin) : Number.NaN;
      const bVal = bTd ? Number.parseFloat(bTd.dataset.kprMin) : Number.NaN;

      const aBad = !Number.isFinite(aVal);
      const bBad = !Number.isFinite(bVal);
      if (aBad && bBad) return 0;
      if (aBad) return 1;
      if (bBad) return -1;

      return (dir === "asc") ? (aVal - bVal) : (bVal - aVal);
    });

    for (const r of rows) tbody.appendChild(r);
  }

  function attachSort(th, table) {
    if (th.dataset.tmKprSortAttached === "1") return;
    th.dataset.tmKprSortAttached = "1";

    th.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const current = th.dataset.tmKprSortDir;
      const next = (current === "desc") ? "asc" : "desc";
      th.dataset.tmKprSortDir = next;

      sortByKprMin(table, next);
    }, true);
  }

  function getMapStatsKey(url) {
    const m = (url || "").match(/\/mapstatsid\/(\d+)\//);
    return m ? m[1] : url;
  }

  function escapeRegex(s) {
    return (s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function parseTotalRoundsFromHtml(html, mapCode) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = (doc && doc.body && doc.body.textContent) ? doc.body.textContent : "";

    let m = text.match(/(\d{1,2})\s*:\s*(\d{1,2})\s*\(\s*\d{1,2}\s*:\s*\d{1,2}\s*\)/);
    if (!m && mapCode) {
      const re = new RegExp("(\\d{1,2})\\s*-\\s*(\\d{1,2})\\s+" + escapeRegex(mapCode) + "\\b", "i");
      m = text.match(re);
    }
    if (!m) return null;

    const a = Number.parseInt(m[1], 10);
    const b = Number.parseInt(m[2], 10);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

    const total = a + b;
    return total > 0 ? total : null;
  }

  const roundsCache = new Map();
  const roundsPromiseCache = new Map();

  function getRoundsForMap(url, mapCode) {
    const key = getMapStatsKey(url);
    if (roundsCache.has(key)) return Promise.resolve(roundsCache.get(key));

    const storageKey = `tmKprRounds:${key}`;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const val = Number.parseInt(stored, 10);
        if (Number.isFinite(val) && val > 0) {
          roundsCache.set(key, val);
          return Promise.resolve(val);
        }
      }
    } catch (_) {}

    if (roundsPromiseCache.has(key)) return roundsPromiseCache.get(key);

    const p = fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((html) => {
        const total = parseTotalRoundsFromHtml(html, mapCode);
        if (total && Number.isFinite(total) && total > 0) {
          roundsCache.set(key, total);
          try { sessionStorage.setItem(storageKey, String(total)); } catch (_) {}
          return total;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => roundsPromiseCache.delete(key));

    roundsPromiseCache.set(key, p);
    return p;
  }

  function ensureHeaderMatches(table) {
    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return null;

    const ths = Array.from(headerRow.querySelectorAll("th"));
    const kdTh = ths.find((th) => /\bK\s*-\s*D\b/i.test((th.textContent || "").replace(/\s+/g, " ").trim()));
    if (!kdTh) return null;

    let th = headerRow.querySelector(`th.${CFG.colClass}.${CFG.matchesHeaderClass}`);
    if (!th) {
      th = document.createElement("th");
      th.classList.add(CFG.colClass, CFG.matchesHeaderClass, "gtSmartphone-only");
      th.textContent = CFG.headerTextMatches;
      headerRow.insertBefore(th, kdTh.nextElementSibling);
    }

    th.style.width = `${CFG.colWidthPx}px`;
    th.style.minWidth = `${CFG.colWidthPx}px`;
    th.style.whiteSpace = "nowrap";
    th.style.textAlign = "center";
    th.style.cursor = "pointer";

    return th;
  }

  function findMatchKdCell(row) {
    const tds = Array.from(row.querySelectorAll(":scope > td"));
    for (const td of tds) {
      const txt = (td.textContent || "").replace(/\s+/g, " ").trim();
      if (/^\d+\s*-\s*\d+$/.test(txt)) return td;
    }
    return null;
  }

  function ensureRowCellMatches(row, kdCell) {
    let td = row.querySelector(`td.${CFG.colClass}`);
    if (!td) {
      td = document.createElement("td");
      td.classList.add(CFG.colClass, "gtSmartphone-only");
      td.style.width = `${CFG.colWidthPx}px`;
      td.style.minWidth = `${CFG.colWidthPx}px`;
      td.style.whiteSpace = "nowrap";
      td.style.textAlign = "center";
      row.insertBefore(td, kdCell.nextElementSibling);
    }
    return td;
  }

  function updateMatchesRows(table) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const th = table.querySelector(`thead th.${CFG.colClass}.${CFG.matchesHeaderClass}`);

    for (const row of rows) {
      const kdCell = findMatchKdCell(row);
      if (!kdCell) continue;

      const linkEl = row.querySelector('a[href*="/stats/matches/mapstatsid/"]');
      if (!linkEl) continue;

      const mapCell = row.querySelector("td.statsMapPlayed");
      const mapCode = mapCell ? (mapCell.textContent || "").trim() : "";

      const td = ensureRowCellMatches(row, kdCell);

      const kills = parseIntLoose(kdCell.textContent);
      if (!Number.isFinite(kills) || kills < 0) {
        td.textContent = "—";
        td.dataset.kprMin = "";
        td.dataset.kprReady = "1";
        continue;
      }

      if (td.dataset.kprReady === "1") continue;

      const href = linkEl.getAttribute("href") || "";
      const url = new URL(href, window.location.origin).toString();

      td.textContent = CFG.matchCellPlaceholder;

      getRoundsForMap(url, mapCode).then((rounds) => {
        if (td.dataset.kprReady === "1") return;

        if (!Number.isFinite(rounds) || rounds <= 0) {
          td.textContent = "—";
          td.dataset.kprMin = "";
          td.dataset.kprReady = "1";
          return;
        }

        const kpr = kills / rounds;
        if (!Number.isFinite(kpr) || kpr < 0) {
          td.textContent = "—";
          td.dataset.kprMin = "";
          td.dataset.kprReady = "1";
          return;
        }

        td.textContent = kpr.toFixed(CFG.decimals);
        td.dataset.kprMin = String(kpr);
        td.title = `Kills=${kills}, Rounds=${rounds}`;
        td.dataset.kprReady = "1";

        if (th && th.dataset.tmKprSortDir) {
          sortByKprMin(table, th.dataset.tmKprSortDir);
        }
      });
    }
  }

  let observer = null;
  let debounceTimer = null;

  function patch() {
    let didSomething = false;

    const playersTable = findPlayersTable();
    if (playersTable) {
      ensureStyle(playersTable);
      const th = ensureHeaderPlayers(playersTable);
      if (th) {
        updatePlayersRows(playersTable);
        attachSort(th, playersTable);
        didSomething = true;
      }
    }

    const matchesTable = findMatchesTable();
    if (matchesTable) {
      ensureStyle(matchesTable);
      const th = ensureHeaderMatches(matchesTable);
      if (th) {
        updateMatchesRows(matchesTable);
        attachSort(th, matchesTable);
        didSomething = true;
      }
    }

    if (!observer) {
      observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          patch();
        }, CFG.observerDebounceMs);
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    return didSomething;
  }

  const start = Date.now();
  const timer = setInterval(() => {
    if (patch()) {
      clearInterval(timer);
      return;
    }
    if (Date.now() - start > 10_000) clearInterval(timer);
  }, 250);
})();
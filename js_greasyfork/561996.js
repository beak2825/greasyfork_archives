// ==UserScript==
// @name         Territory War Helper
// @namespace    https://torn.com/
// @version      01.13.2026.19.15
// @description  Territory war helper: Seats, Score, TIMER, Projected end score, Current pace, Seat requirements, and Defenders "hold to guarantee". Binds to ACTIVE WAR TILE using warId so score/timer/seats never come from the wrong war.
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561996/Territory%20War%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561996/Territory%20War%20Helper.meta.js
// ==/UserScript==

/*
NOTES & REQUIREMENTS
Version: 01.13.2026.19.15
Author: KillerCleat [2842410]

UPDATE:
- FIX: Always binds to the ACTIVE WAR tile (LI) using warId from the URL hash.
  This prevents pulling score/timer/seats from other wars in the list (the "stuck at 500k" issue).
- Seat counts are read ONLY from the active war tile, then mapped using the tile text:
  "defending" => LEFT=defenders RIGHT=attackers
  "assaulting" => LEFT=attackers RIGHT=defenders
*/

(function () {
  "use strict";

  // =========================
  // CONFIG (EDIT THIS)
  // =========================
  const MY_FACTION_ID = 0; // Change when you change factions

  // =========================
  // CONSTANTS / IDS
  // =========================
  const BOX_ID = "kc-wall-box";
  const STYLE_ID = "kc-wall-style";
  const INJECTED_FLAG = "data-kc-id-injected";

  // =========================
  // UTILS
  // =========================
  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }
  function toIntSafe(str) {
    const n = parseInt(String(str).replace(/[^\d-]/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  }
  function fmtNum(n) {
    const x = Math.round(n);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // Expects seconds, returns "DD:HH:MM:SS"
  function fmtTimerDDHHMMSS(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const dd = Math.floor(s / 86400);
    const hh = Math.floor((s % 86400) / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    const pad2 = (v) => String(v).padStart(2, "0");
    return `${pad2(dd)}:${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
  }

  function parseDDHHMMSS(text) {
    const t = String(text || "").replace(/\s+/g, "");
    const m = t.match(/^(\d{1,3}):(\d{2}):(\d{2}):(\d{2})$/);
    if (!m) return null;
    const dd = toIntSafe(m[1]);
    const hh = toIntSafe(m[2]);
    const mm = toIntSafe(m[3]);
    const ss = toIntSafe(m[4]);
    return dd * 86400 + hh * 3600 + mm * 60 + ss;
  }

  function getActiveWarId() {
    const m = String(location.hash || "").match(/\/war\/(\d+)/);
    return m ? m[1] : null;
  }

  // =========================
  // ACTIVE WAR HEADER PARSE
  // =========================
  function parseWarHeaderInfo() {
    const info = $(".faction-war-info");
    if (!info) return null;

    const title = $(".faction-war-info .raid-title", info) || info;
    const text = title ? title.textContent : info.textContent;

    const isAssaulting = /is\s+assaulting/i.test(text);
    const isDefending = /is\s+defending/i.test(text);

    const factionLinks = $all('a[href*="factions.php?step=profile"][href*="ID="]', info);
    const firstFactionLink = factionLinks[0] || null;
    const secondFactionLink = factionLinks[1] || null;

    const firstId = firstFactionLink ? toIntSafe(new URL(firstFactionLink.href, location.origin).searchParams.get("ID")) : 0;
    const secondId = secondFactionLink ? toIntSafe(new URL(secondFactionLink.href, location.origin).searchParams.get("ID")) : 0;

    const firstName = firstFactionLink ? firstFactionLink.textContent.trim() : "";
    const secondName = secondFactionLink ? secondFactionLink.textContent.trim() : "";

    // Territory short name is the city link text in header
    const terrLink = $('.faction-war-info a[href*="/city.php#terrName="]');
    const territory = terrLink ? terrLink.textContent.trim() : "";

    // "X is assaulting TERR held by Y"  => attacker = first link, defender = second link
    // "X is defending TERR assaulted by Y" => defender = first link, attacker = second link
    let attackerId = 0, defenderId = 0, attackerName = "", defenderName = "";
    if (isAssaulting) {
      attackerId = firstId; attackerName = firstName;
      defenderId = secondId; defenderName = secondName;
    } else if (isDefending) {
      defenderId = firstId; defenderName = firstName;
      attackerId = secondId; attackerName = secondName;
    } else {
      attackerId = firstId; attackerName = firstName;
      defenderId = secondId; defenderName = secondName;
    }

    return {
      infoEl: info,
      territory,
      isAssaulting,
      isDefending,
      attackerId,
      attackerName,
      defenderId,
      defenderName
    };
  }

  // =========================
  // FIND THE CORRECT WAR TILE (FIXED)
  // =========================
  function findActiveWarTileByWarId(warId) {
    if (!warId) return null;

    // Find the link that targets this war in the list tiles, then grab its LI.
    // Example: <a href="/factions.php?step=profile&ID=9524#/war/44383"></a>
    const a = document.querySelector(`a[href*="#/war/${warId}"]`);
    if (!a) return null;

    const li = a.closest("li");
    if (!li) return null;

    // Validate it contains the expected elements (score/timer/counts) for safety.
    const ok = !!li.querySelector(".faction-progress-wrap .score")
      && !!li.querySelector(".faction-progress-wrap .timer")
      && !!li.querySelector(".member-count .count");

    return ok ? li : null;
  }

  // =========================
  // SCORE/TIMER/SEATS FROM *ACTIVE LI TILE*
  // =========================
  function parseScoreTimerCountsFromTile(tile) {
    if (!tile) return null;

    const scoreEl = $(".faction-progress-wrap .score", tile);
    const timerEl = $(".faction-progress-wrap .timer", tile);
    if (!scoreEl || !timerEl) return null;

    const rawScore = scoreEl.textContent.trim(); // "198,246 / 250,000"
    const parts = rawScore.split("/");
    const score = parts[0] ? toIntSafe(parts[0]) : 0;
    const target = parts[1] ? toIntSafe(parts[1]) : 0;

    const secondsLeft = parseDDHHMMSS(timerEl.textContent.trim());
    if (secondsLeft === null) return null;

    // IMPORTANT:
    // Read ONLY the two seat counts inside this LI.
    const counts = $all(".member-count .count", tile).map(e => toIntSafe(e.textContent));
    const leftCount = Number.isFinite(counts[0]) ? counts[0] : 0;
    const rightCount = Number.isFinite(counts[1]) ? counts[1] : 0;

    // Decide which side is defending vs assaulting using tile text.
    // "HT defending LAA from ..." => LEFT=defenders, RIGHT=attackers
    // "Violent Resolution assaulting MAA ..." => LEFT=attackers, RIGHT=defenders
    const tileText = tile.textContent.toLowerCase();

    let attackers = 0;
    let defenders = 0;

    if (tileText.includes(" defending ")) {
      defenders = leftCount;
      attackers = rightCount;
    } else if (tileText.includes(" assaulting ")) {
      attackers = leftCount;
      defenders = rightCount;
    } else {
      // Fallback: stable left/right
      attackers = leftCount;
      defenders = rightCount;
    }

    return { score, target, secondsLeft, attackers, defenders };
  }

  // =========================
  // TOTAL SEATS FROM OPEN WAR TABLE (OPTIONAL)
  // =========================
  function parseTotalSeatsFromOpenWarTable() {
    const warTable = $(".faction-war .members-list");
    if (!warTable) return null;
    const rows = $all(":scope > li", warTable);
    const seatRows = rows.filter((li) => !!$(".id.left", li));
    const total = seatRows.length;
    return total > 0 ? total : null;
  }

  // =========================
  // FACTION ID INJECTION
  // =========================
  function injectFactionIdsInline() {
    const info = $(".faction-war-info");
    if (!info) return;

    const links = $all('a[href*="factions.php?step=profile"][href*="ID="]', info);
    links.forEach((a) => {
      if (a.getAttribute(INJECTED_FLAG) === "1") return;

      const id = toIntSafe(new URL(a.href, location.origin).searchParams.get("ID"));
      if (!id) return;

      a.title = `Faction ID: ${id}`;
      a.setAttribute(INJECTED_FLAG, "1");

      const span = document.createElement("span");
      span.className = "kc-faction-id-inline";
      span.textContent = ` [${id}]`;
      span.style.fontSize = "11px";
      span.style.opacity = "0.75";
      span.style.marginLeft = "2px";
      span.style.userSelect = "text";

      a.insertAdjacentElement("afterend", span);
    });
  }

  // =========================
  // STYLES
  // =========================
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BOX_ID}{
        background: #f3efe3;
        border: 1px solid #cfc7b8;
        border-radius: 4px;
        padding: 10px 12px;
        margin: 10px 0 12px 0;
        color: #333;
        font-weight: normal;
        font-size: 12px;
        line-height: 1.45;
      }
      #${BOX_ID} .row{
        margin: 2px 0;
        white-space: normal;
      }
      #${BOX_ID} .section{
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #d7cfbf;
      }
      #${BOX_ID} .good{
        color: #1f7a1f;
        font-weight: normal;
      }
      #${BOX_ID} .bad{
        color: #b12828;
        font-weight: normal;
      }
      #${BOX_ID} .muted{
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================
  // RENDER HELPERS
  // =========================
  function row(html) {
    return `<div class="row">${html}</div>`;
  }
  function section(lines) {
    return `<div class="section">${lines.map((t) => row(t)).join("\n")}</div>`;
  }
  function getOrCreateBox(infoEl) {
    let box = document.getElementById(BOX_ID);
    if (box) return box;
    box = document.createElement("div");
    box.id = BOX_ID;
    infoEl.insertAdjacentElement("afterend", box);
    return box;
  }

  // =========================
  // CORE MATH / RENDER
  // =========================
  function computeAndRender() {
    const header = parseWarHeaderInfo();
    if (!header) return;

    const warId = getActiveWarId();
    const tile = findActiveWarTileByWarId(warId);
    const tileData = parseScoreTimerCountsFromTile(tile);
    if (!tileData) return;

    const totalSeatsFromTable = parseTotalSeatsFromOpenWarTable();
    const totalSeats = totalSeatsFromTable !== null
      ? totalSeatsFromTable
      : (tileData.attackers + tileData.defenders);

    const attackersSeats = tileData.attackers;
    const defendersSeats = tileData.defenders;
    const emptySeats = Math.max(0, totalSeats - attackersSeats - defendersSeats);

    const score = tileData.score;
    const target = tileData.target;
    const secondsLeft = tileData.secondsLeft;

    // TT scoring rule
    const rate = attackersSeats - defendersSeats;
    const projectedRaw = score + rate * secondsLeft;
    const projectedEnd = clamp(projectedRaw, 0, target);

    let paceLine = "CURRENT PACE: STALLED";
    if (rate > 0) paceLine = "CURRENT PACE: ATTACKERS GAINING";
    if (rate < 0) paceLine = "CURRENT PACE: DEFENDERS PUSHING BACK";

    const myIsAttacker = header.attackerId === MY_FACTION_ID;
    const myIsDefender = header.defenderId === MY_FACTION_ID;
    const myInWar = myIsAttacker || myIsDefender;

    let statusText = "";
    let statusClass = "muted";

    if (myInWar) {
      if (myIsDefender) {
        const safe = projectedEnd < target;
        statusText = `YOUR FACTION (DEFENDING): ${safe ? "SAFE" : "DANGER"}`;
        statusClass = safe ? "good" : "bad";
      } else {
        const onTrack = projectedEnd >= target;
        statusText = `YOUR FACTION (ATTACKING): ${onTrack ? "ON TRACK" : "BEHIND"}`;
        statusClass = onTrack ? "good" : "bad";
      }
    } else {
      const defenderSafe = projectedEnd < target;
      statusText = `DEFENDING FACTION (${header.defenderName || "UNKNOWN"}): ${defenderSafe ? "SAFE" : "DANGER"}`;
      statusClass = defenderSafe ? "good" : "bad";
    }

    const rateAll = totalSeats;
    const remainingNeeded = target - score;

    let allTakeLine = "";
    if (rateAll <= 0) {
      allTakeLine = `IF ATTACKERS TAKE ALL ${totalSeats}: NOT POSSIBLE`;
    } else if (remainingNeeded <= 0) {
      allTakeLine = `IF ATTACKERS TAKE ALL ${totalSeats}: ALREADY WON`;
    } else {
      const secToWinAll = Math.ceil(remainingNeeded / rateAll);
      if (secToWinAll <= secondsLeft) {
        allTakeLine = `IF ATTACKERS TAKE ALL ${totalSeats}: WIN IN ${fmtTimerDDHHMMSS(secToWinAll)}`;
      } else {
        allTakeLine = `IF ATTACKERS TAKE ALL ${totalSeats}: NOT POSSIBLE`;
      }
    }

    let attackersNeedSeatsLine = "";
    const maxAttackerGain = Math.max(0, totalSeats - attackersSeats);
    let needGain = null;

    if (target <= 0) {
      needGain = 0;
    } else {
      for (let g = 0; g <= maxAttackerGain; g++) {
        const r = (attackersSeats + g) - defendersSeats;
        const end = clamp(score + r * secondsLeft, 0, target);
        if (end >= target) {
          needGain = g;
          break;
        }
      }
    }

    if (needGain === null) {
      attackersNeedSeatsLine = `TO WIN: NOT POSSIBLE (SEAT LIMIT)`;
    } else if (needGain === 0) {
      attackersNeedSeatsLine = `TO WIN: ATTACKERS ALREADY ON PACE`;
    } else {
      attackersNeedSeatsLine = `TO WIN: ATTACKERS MUST GAIN ${needGain} SEATS`;
    }

    let defendersHoldLine = "";
    if (projectedEnd < target) {
      defendersHoldLine = `TO HOLD: DEFENDERS ALREADY HOLD`;
    } else {
      const maxDefGain = Math.max(0, totalSeats - defendersSeats);
      let needDef = null;
      for (let g = 0; g <= maxDefGain; g++) {
        const r = attackersSeats - (defendersSeats + g);
        const end = clamp(score + r * secondsLeft, 0, target);
        if (end < target) {
          needDef = g;
          break;
        }
      }
      if (needDef === null) defendersHoldLine = `TO HOLD: NOT POSSIBLE (SEAT LIMIT)`;
      else if (needDef === 0) defendersHoldLine = `TO HOLD: DEFENDERS ALREADY HOLD`;
      else defendersHoldLine = `TO HOLD: DEFENDERS MUST GAIN ${needDef} SEATS`;
    }

    let guaranteeLine = "";
    if (rateAll <= 0 || target <= 0) {
      guaranteeLine = `DEFENDERS: HOLD FOR N/A`;
    } else if (remainingNeeded <= 0) {
      guaranteeLine = `DEFENDERS: HOLD FOR 00:00:00:00 TO GUARANTEE WIN`;
    } else {
      const latestTimeAttackersNeedAtFull = Math.floor(remainingNeeded / rateAll);
      const holdNeeded = secondsLeft - latestTimeAttackersNeedAtFull;

      if (holdNeeded <= 0) {
        guaranteeLine = `DEFENDERS: CANNOT GUARANTEE YET`;
      } else if (holdNeeded > secondsLeft) {
        guaranteeLine = `DEFENDERS: HOLD FOR N/A`;
      } else {
        guaranteeLine = `DEFENDERS: HOLD FOR ${fmtTimerDDHHMMSS(holdNeeded)} TO GUARANTEE WIN`;
      }
    }

    const headerSentence = header.isAssaulting
      ? `${header.attackerName} is assaulting ${header.territory || "TERRITORY"} which is currently held by ${header.defenderName}`
      : `${header.defenderName} is defending ${header.territory || "TERRITORY"} which is assaulted by ${header.attackerName}`;

    const terr = header.territory ? ` (${header.territory})` : "";
    let modeLine = "";
    if (myInWar) {
      modeLine = myIsDefender ? `MODE: DEFENDING${terr}` : `MODE: ATTACKING${terr}`;
    } else {
      modeLine = `MODE: OBSERVING${terr}`;
    }

    ensureStyles();
    const box = getOrCreateBox(header.infoEl);

    const lines = [];
    lines.push(row(modeLine));
    lines.push(row(headerSentence));
    lines.push(row(`SEATS: ATTACKERS ${attackersSeats} | DEFENDERS ${defendersSeats} | EMPTY ${emptySeats} (TOTAL ${totalSeats})`));
    lines.push(row(`SCORE: ${fmtNum(score)} / ${fmtNum(target)}`));
    lines.push(row(`TIMER: ${fmtTimerDDHHMMSS(secondsLeft)}`));
    lines.push(row(`<span class="${statusClass}">${statusText}</span>`));

    lines.push(section([
      `PROJECTED (END): ${fmtNum(projectedEnd)} / ${fmtNum(target)}`,
      paceLine
    ]));

    lines.push(section([
      allTakeLine,
      attackersNeedSeatsLine,
      defendersHoldLine,
      guaranteeLine
    ]));

    box.innerHTML = lines.join("\n");
  }

  // =========================
  // TICK / BOOT
  // =========================
  function tick() {
    try {
      injectFactionIdsInline();
      computeAndRender();
    } catch (e) {
      // silent
    }
  }

  function boot() {
    ensureStyles();
    tick();

    const mo = new MutationObserver(() => {
      if (boot._raf) return;
      boot._raf = requestAnimationFrame(() => {
        boot._raf = null;
        tick();
      });
    });

    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

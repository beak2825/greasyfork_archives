// ==UserScript==
// @name         Torn Territory Wall Helper 
// @namespace    https://torn.com/
// @version      01.09.2026.12.25
// @description  Territory wall helper
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561996/Torn%20Territory%20Wall%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561996/Torn%20Territory%20Wall%20Helper.meta.js
// ==/UserScript==

/*
NOTES & REQUIREMENTS
Version: 01.09.2026.12.25
Author: KillerCleat [2842410]
*/

const MY_FACTION_ID = 0;   // change when you change factions
const TOTAL_SPOTS = 14;

(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  function num(v) {
    if (v === null || v === undefined) return null;
    const cleaned = String(v).replace(/[^\d]/g, '');
    if (!cleaned) return 0;
    const n = parseInt(cleaned, 10);
    return Number.isFinite(n) ? n : 0;
  }

  function fmt(n) {
    if (!Number.isFinite(n)) return '0';
    return Math.round(n).toLocaleString('en-US');
  }

  function secondsFromWords(text) {
    if (!text) return null;
    const t = String(text).toLowerCase();
    const d = (t.match(/(\d+)\s*days?/) || [])[1];
    const h = (t.match(/(\d+)\s*hours?/) || [])[1];
    const m = (t.match(/(\d+)\s*minutes?/) || [])[1];
    const s = (t.match(/(\d+)\s*seconds?/) || [])[1];
    if ([d, h, m, s].some(v => v === undefined)) return null;

    const dd = parseInt(d, 10);
    const hh = parseInt(h, 10);
    const mm = parseInt(m, 10);
    const ss = parseInt(s, 10);
    if (![dd, hh, mm, ss].every(Number.isFinite)) return null;

    return (dd * 86400) + (hh * 3600) + (mm * 60) + ss;
  }

  function ddhhmmss(totalSeconds) {
    if (!Number.isFinite(totalSeconds)) return '00:00:00:00';
    let s = Math.max(0, Math.floor(totalSeconds));

    const dd = Math.floor(s / 86400); s %= 86400;
    const hh = Math.floor(s / 3600);  s %= 3600;
    const mm = Math.floor(s / 60);
    const ss = s % 60;

    const p2 = (n) => String(n).padStart(2, '0');
    return `${p2(dd)}:${p2(hh)}:${p2(mm)}:${p2(ss)}`;
  }

  function isWar() {
    return typeof location.hash === 'string' && location.hash.startsWith('#/war/');
  }

  function extractFactionIdFromHref(href) {
    if (!href) return null;
    const m = String(href).match(/[?&]ID=(\d+)/i);
    return m ? parseInt(m[1], 10) : null;
  }

  // Determine which faction is DEFENDING and which is ATTACKING from the header text around links.
  function getWarFactionRoles(headerEl) {
    if (!headerEl) return { defenderId: null, attackerId: null };

    const links = Array.from(headerEl.querySelectorAll('a[href*="factions.php?step=profile&ID="]'));
    if (!links.length) return { defenderId: null, attackerId: null };

    let defenderId = null;
    let attackerId = null;

    links.forEach((a) => {
      const id = extractFactionIdFromHref(a.getAttribute('href'));
      if (!id) return;

      // Look at nearby text to decide role
      const prevText = (a.previousSibling && a.previousSibling.textContent) ? a.previousSibling.textContent.toLowerCase() : '';
      const nextText = (a.nextSibling && a.nextSibling.textContent) ? a.nextSibling.textContent.toLowerCase() : '';

      // Example: "Warhawks is defending ..."
      if (nextText.includes(' is defending')) defenderId = id;

      // Example: "... assaulted by Bleed"
      if (prevText.includes('assaulted by') || prevText.includes('assaulting')) attackerId = id;
      if (prevText.includes(' which is assaulted by')) attackerId = id;
    });

    // Fallback: if we only found one role, try to infer from order.
    // In Torn header, defender faction link appears before the words "is defending", attacker link appears after "assaulted by".
    // If still missing, assume first faction link is defender and last is attacker.
    if (!defenderId && links.length >= 1) defenderId = extractFactionIdFromHref(links[0].getAttribute('href'));
    if (!attackerId && links.length >= 2) attackerId = extractFactionIdFromHref(links[links.length - 1].getAttribute('href'));

    return { defenderId, attackerId };
  }

  // Styles (locked cream)
  if (!$('#kc-wall-style')) {
    const st = document.createElement('style');
    st.id = 'kc-wall-style';
    st.textContent = `
#kc-wall-box{
  margin-top:8px;
  padding:10px 12px;
  background:#f3efe4;
  border:1px solid #d8d3c7;
  border-radius:6px;
  font-size:13.5px;
  line-height:1.5;
  color:#111;
  pointer-events:none;
}
#kc-wall-box .row{ margin:3px 0; font-weight:400; }
#kc-wall-box .section{ margin-top:8px; padding-top:8px; border-top:1px solid #d8d3c7; }
#kc-wall-box .safe{ color:#1b5e20; font-weight:400; }
#kc-wall-box .danger{ color:#b71c1c; font-weight:400; }

.kc-faction-id-inline{
  margin-left:6px;
  opacity:0.75;
  font-size:12.5px;
  pointer-events:none;
}
`;
    document.head.appendChild(st);
  }

  // Add faction IDs (hover + inline) to header faction links
  function decorateFactionLinks() {
    const header = $('.faction-war-info');
    if (!header) return;

    const links = header.querySelectorAll('a[href*="factions.php?step=profile&ID="]');
    if (!links || links.length === 0) return;

    links.forEach((a) => {
      const id = extractFactionIdFromHref(a.getAttribute('href'));
      if (!id) return;

      // Hover tooltip
      const desiredTitle = `Faction ID: ${id}`;
      if (!a.title || a.title.indexOf('Faction ID:') === -1) {
        a.title = desiredTitle;
      }

      // Inline [#####] next to the link (avoid duplicates)
      if (a.dataset.kcIdInjected === '1') return;

      const span = document.createElement('span');
      span.className = 'kc-faction-id-inline';
      span.textContent = `[${id}]`;

      a.insertAdjacentElement('afterend', span);
      a.dataset.kcIdInjected = '1';
    });
  }

  function render() {
    if (!isWar()) {
      $('#kc-wall-box')?.remove();
      return;
    }

    const header = $('.faction-war-info');
    if (!header) return;

    decorateFactionLinks();

    let box = $('#kc-wall-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'kc-wall-box';
      header.after(box);
    }

    // Roles
    const { defenderId, attackerId } = getWarFactionRoles(header);
    const isYourWar = (defenderId === MY_FACTION_ID) || (attackerId === MY_FACTION_ID);
    const youAreDefender = (defenderId === MY_FACTION_ID);
    const youAreAttacker = (attackerId === MY_FACTION_ID);

    // Seats (from the progress panel)
    const attackers = num($('.enemy-count')?.innerText);
    const defenders = num($('.your-count')?.innerText);
    const empty = Math.max(0, TOTAL_SPOTS - attackers - defenders);

    // Score
    const scoreTxt = $('.score')?.innerText || '';
    const parts = scoreTxt.split('/');
    const cur = parts.length > 0 ? num(parts[0]) : null;
    const tgt = parts.length > 1 ? num(parts[1]) : null;

    // Time left
    const secsLeft = secondsFromWords(header.innerText);

    if (cur === null || tgt === null || !Number.isFinite(secsLeft) || secsLeft <= 0) {
      box.innerHTML = `<div class="row">Waiting for war data…</div>`;
      return;
    }

    const left = Math.max(0, tgt - cur);

    // Current net rate (attackers gain, defenders reduce)
    const rate = attackers - defenders;

    // Required rate to finish
    const needRate = (left === 0) ? 0 : Math.ceil(left / secsLeft);

    // HARD LIMIT: if needRate > 14 then attackers cannot win even with all seats
    const impossibleByRateCap = (left > 0 && needRate > TOTAL_SPOTS);

    // Current pace: are attackers winning at current seats?
    const attackersWinAtCurrent = (!impossibleByRateCap && left > 0 && rate > 0 && rate >= needRate);

    // Max attackers outcome
    const maxAtkSecondsNeeded = (left === 0) ? 0 : (left / TOTAL_SPOTS);
    const maxAtkPossible = !impossibleByRateCap && (maxAtkSecondsNeeded <= secsLeft);

    // ROLE-AWARE status line
    // - For defenders: SAFE if attackers are NOT winning at current pace
    // - For attackers: WINNING if attackers ARE winning at current pace
    // - If not your war: talk about DEFENDERS
    let statusLineText = '';
    let statusClass = 'safe';

    if (isYourWar) {
      if (youAreDefender) {
        statusLineText = `YOUR FACTION (DEFENDING): ${attackersWinAtCurrent ? 'IN DANGER' : 'SAFE'}`;
        statusClass = attackersWinAtCurrent ? 'danger' : 'safe';
      } else if (youAreAttacker) {
        statusLineText = `YOUR FACTION (ATTACKING): ${attackersWinAtCurrent ? 'WINNING' : 'LOSING'}`;
        statusClass = attackersWinAtCurrent ? 'safe' : 'danger';
      } else {
        // Should not happen, but keep sane fallback
        statusLineText = `YOUR FACTION: ${attackersWinAtCurrent ? 'IN DANGER' : 'SAFE'}`;
        statusClass = attackersWinAtCurrent ? 'danger' : 'safe';
      }
    } else {
      statusLineText = `DEFENDERS: ${attackersWinAtCurrent ? 'IN DANGER' : 'SAFE'}`;
      statusClass = attackersWinAtCurrent ? 'danger' : 'safe';
    }

    const statusHtml = `<span class="${statusClass}">${statusLineText}</span>`;

    // Current pace line
    let currentPaceLine = 'CURRENT PACE: DEFENDERS HOLD';
    if (left === 0) {
      currentPaceLine = 'CURRENT PACE: TARGET ALREADY REACHED';
    } else if (attackersWinAtCurrent) {
      const winSec = Math.ceil(left / rate);
      currentPaceLine = `CURRENT PACE: ATTACKERS WIN IN ${ddhhmmss(winSec)}`;
    } else if (impossibleByRateCap) {
      currentPaceLine = 'CURRENT PACE: DEFENDERS HOLD (ATTACKERS CANNOT REACH TARGET IN TIME)';
    }

    // Projected score at current pace
    const projected = Math.max(0, Math.min(tgt, cur + (rate * secsLeft)));

    // TO WIN line (only meaningful if maxAtkPossible)
    let toWinLine = '';
    if (left === 0) {
      toWinLine = 'TO WIN: NOT NEEDED';
    } else if (!maxAtkPossible) {
      toWinLine = 'TO WIN: NOT POSSIBLE (NOT ENOUGH TIME)';
    } else if (rate >= needRate) {
      toWinLine = 'TO WIN: ATTACKERS ALREADY HAVE ENOUGH SEATS';
    } else {
      // Best case: taking a defender seat shifts net by +2
      let seatsNeededToWin = Math.ceil((needRate - rate) / 2);
      seatsNeededToWin = Math.max(0, Math.min(TOTAL_SPOTS, seatsNeededToWin));
      toWinLine = `TO WIN: ATTACKERS MUST GAIN ${seatsNeededToWin} SEATS`;
    }

    // TO HOLD line
    let toHoldLine = '';
    if (left === 0) {
      toHoldLine = 'TO HOLD: ALREADY HELD';
    } else if (!maxAtkPossible) {
      toHoldLine = 'TO HOLD: GUARANTEED (ATTACKERS CANNOT REACH TARGET)';
    } else if (rate < needRate) {
      toHoldLine = 'TO HOLD: DEFENDERS ALREADY HOLD';
    } else {
      let seatsNeededToHold = Math.ceil((rate - (needRate - 1)) / 2);
      seatsNeededToHold = Math.max(0, Math.min(TOTAL_SPOTS, seatsNeededToHold));
      toHoldLine = `TO HOLD: DEFENDERS MUST GAIN ${seatsNeededToHold} SEATS`;
    }

    // Defender lock time (your request)
    let guaranteeLine = '';
    if (left === 0) {
      guaranteeLine = 'DEFENDERS: ALREADY WON';
    } else if (!maxAtkPossible) {
      guaranteeLine = 'ATTACKERS: NOT POSSIBLE (EVEN WITH ALL 14)';
    } else {
      const lockSeconds = Math.ceil(secsLeft - maxAtkSecondsNeeded);
      if (lockSeconds <= 0) {
        guaranteeLine = 'DEFENDERS: NO GUARANTEED LOCK YET (ATTACKERS STILL HAVE ENOUGH TIME)';
      } else {
        guaranteeLine = `DEFENDERS: HOLD FOR ${ddhhmmss(lockSeconds)} TO GUARANTEE WIN`;
      }
    }

    box.innerHTML = `
<div class="row">SEATS: ATTACKERS ${attackers} | DEFENDERS ${defenders} | EMPTY ${empty} (TOTAL 14)</div>
<div class="row">SCORE: ${fmt(cur)} / ${fmt(tgt)}</div>
<div class="row">TIMER: ${ddhhmmss(secsLeft)}</div>
<div class="row">${statusHtml}</div>

<div class="section">
  <div class="row">PROJECTED (CURRENT): ${fmt(projected)} / ${fmt(tgt)}</div>
  <div class="row">${currentPaceLine}</div>
</div>

<div class="section">
  <div class="row">
    IF ATTACKERS TAKE ALL 14: ${maxAtkPossible ? `WIN IN ${ddhhmmss(maxAtkSecondsNeeded)}` : 'NOT POSSIBLE'}
  </div>
  <div class="row">${toWinLine}</div>
  <div class="row">${toHoldLine}</div>
  <div class="row">${guaranteeLine}</div>
</div>
`;
  }

  render();
  setInterval(render, 2000);
  window.addEventListener('hashchange', render);
})();

// ==UserScript==
// @name         Torn Gym Energy Calculator
// @namespace    torn.com
// @version      3.2
// @description  gym unlock calculator. Uses LAST unlocked gym (not active) + auto detects Music Store job (30%).
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/gym.php*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560445/Torn%20Gym%20Energy%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/560445/Torn%20Gym%20Energy%20Calculator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const GYM_ENERGIES = [
    200, 500, 1000, 2000, 2750, 3000, 3500, 4000, 6000, 7000, 8000,
    11000, 12420, 18000, 18100, 24140, 31260, 36610, 46640, 56520, 67775, 84535, 106305
  ];

  const BAR_ID = "QaimGymBar";
  const MUSIC_MULT = 1.3;

  let lastEnergyVal = -1;
  let localSpentOffset = 0;
  let lastProgressPct = null;

  function formatNum(n) {
    const x = Math.round(Number(n) || 0);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function parseGymIdFromButton(btn) {
    const icon = btn.querySelector('[class*="gym-"]');
    if (!icon) return 0;
    const cls = icon.getAttribute("class") || "";
    const m = cls.match(/gym-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function parseGymNameFromAria(ariaLabel) {
    if (!ariaLabel) return "Unknown";
    let m = ariaLabel.match(/^(.*?)\.\s*Membership cost/i);
    if (m && m[1]) return m[1].trim();
    const dot = ariaLabel.indexOf(".");
    if (dot > 0) return ariaLabel.slice(0, dot).trim();
    return ariaLabel.trim();
  }

  function findUnlockingGym() {
    const buttons = Array.from(document.querySelectorAll('button[class*="gymButton"]'));
    for (const btn of buttons) {
      const aria = btn.getAttribute("aria-label") || "";
      const isUnlocking = /Unlock progress\s*-\s*\d+/i.test(aria) || btn.querySelector('[class*="percentage"]');
      if (!isUnlocking) continue;

      const gymId = parseGymIdFromButton(btn);
      const name = parseGymNameFromAria(aria);

      let pct = null;
      const pctEl = btn.querySelector('[class*="percentage"]');
      if (pctEl && pctEl.textContent) {
        const t = pctEl.textContent.trim().replace("%", "");
        const v = parseFloat(t);
        if (!Number.isNaN(v)) pct = v;
      }
      if (pct === null) {
        const m = aria.match(/Unlock progress\s*-\s*(\d+)\s*percent/i);
        if (m && m[1]) pct = parseInt(m[1], 10);
      }
      if (pct === null) pct = 0;

      return { btn, gymId, name, pct: clamp(pct, 0, 100) };
    }
    return null;
  }

  function detectMusicStoreJob() {
    const companyA = document.querySelector('a[aria-label^="Company:"]');
    if (companyA) {
      const aria = companyA.getAttribute("aria-label") || "";
      if (/Music Store/i.test(aria)) return true;
    }
    const any = Array.from(document.querySelectorAll('a[href^="/jobs.php"], a[href="/jobs.php"]'))
      .find(a => /Music Store/i.test(a.getAttribute("aria-label") || ""));
    return !!any;
  }

  function detectDonator() {
    if (document.querySelector('a[href="/donator.php"]')) return true;
    const a = Array.from(document.querySelectorAll('a[aria-label*="Donator status" i]'))[0];
    return !!a;
  }

  function getEnergyCurrentMax() {
    const els = Array.from(document.querySelectorAll('p[class*="bar-value"], span[class*="bar-value"]'));
    const candidates = [];

    for (const el of els) {
      const txt = (el.textContent || "").trim();
      const m = txt.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
      if (!m) continue;
      const cur = parseInt(m[1], 10);
      const max = parseInt(m[2], 10);
      if (Number.isFinite(cur) && Number.isFinite(max)) candidates.push({ cur, max });
    }

    const filtered = candidates.filter(c => c.max <= 400 && c.max >= 30);
    if (!filtered.length) return { cur: -1, max: 150 };
    filtered.sort((a, b) => b.max - a.max);
    return { cur: filtered[0].cur, max: filtered[0].max };
  }

  function computeDailyEnergies(maxEnergy, isDonator) {
    const regen = isDonator ? 720 : 480;
    return { nat: regen, refill: regen + (maxEnergy || 0), xanax: regen + 750 };
  }

  function daysFromRemaining(remaining, currentEnergy, dailyE) {
    const rem = Math.max(0, (remaining || 0) - (currentEnergy || 0));
    if (!dailyE || dailyE <= 0) return Infinity;
    return rem / dailyE;
  }

  function formatDays(d) {
    if (!Number.isFinite(d)) return "—";
    if (d <= 0) return "0.0d";
    if (d < 0.05) return "<0.1d";
    return `${d.toFixed(1)}d`;
  }

  function findGymListRoot() {
    const btn = document.querySelector('button[class*="gymButton"]');
    if (!btn) return null;
    return btn.closest('div[class*="gymsList"], div[class*="gymList"]') || btn.parentElement;
  }

  function findActiveGymName(buttons) {
    if (!buttons.length) return "—";

    const preferred = buttons.find(b =>
      b.getAttribute("aria-pressed") === "true" ||
      b.getAttribute("aria-current") === "true" ||
      (b.getAttribute("class") || "").toLowerCase().includes("active") ||
      (b.getAttribute("class") || "").toLowerCase().includes("selected")
    );
    if (preferred) return parseGymNameFromAria(preferred.getAttribute("aria-label") || "");

    const listRoot = findGymListRoot();
    const outsideIcons = Array.from(document.querySelectorAll('div[class*="gymIcon"] [class*="gym-"]'))
      .filter(el => !listRoot || !listRoot.contains(el));
    if (outsideIcons.length) {
      const cls = outsideIcons[0].getAttribute("class") || "";
      const m = cls.match(/gym-(\d+)/);
      const id = m ? parseInt(m[1], 10) : 0;
      if (id) {
        const matchBtn = buttons.find(b => parseGymIdFromButton(b) === id);
        if (matchBtn) return parseGymNameFromAria(matchBtn.getAttribute("aria-label") || "");
      }
    }

    return "—";
  }

  function injectStylesOnce() {
    if (document.getElementById("qaimGymCalcStyles")) return;

    const css = `
      .qaim-gym-bar {
        background-color: #222;
        border-left: 6px solid #00bcd4;
        border-right: 6px solid #00bcd4;
        border-radius: 5px;
        margin: 10px 0;
        padding: 10px 14px;
        color: #fff;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
      .qaim-stats-container {
        display: flex;
        gap: 18px;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .qaim-stat-group {
        display: flex;
        flex-direction: column;
        min-width: 120px;
      }
      .qaim-label {
        font-size: 10px;
        color: #00bcd4;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 3px;
        letter-spacing: .5px;
      }
      .qaim-value {
        font-size: 14px;
        color: #eee;
        font-weight: 400;
        transition: color .25s;
        white-space: nowrap;
      }
      .qaim-value.updated { color: #00bcd4; }
      .qaim-bar-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-left: auto;
      }
      .qaim-badge {
        background: #444;
        color: #aaa;
        padding: 2px 7px;
        border-radius: 3px;
        font-size: 11px;
        border: 1px solid #555;
      }
      .qaim-badge.active {
        background: #00bcd4;
        color: #111;
        border-color: #00bcd4;
        font-weight: 700;
      }
      .qaim-muted {
        font-size: 11px;
        color: #bbb;
        opacity: .9;
        white-space: nowrap;
      }
    `;

    const style = document.createElement("style");
    style.id = "qaimGymCalcStyles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function ensureBar() {
    if (document.getElementById(BAR_ID)) return;

    const listRoot = findGymListRoot();
    if (!listRoot) return;

    injectStylesOnce();

    const bar = document.createElement("div");
    bar.id = BAR_ID;
    bar.className = "qaim-gym-bar";

    bar.innerHTML = `
      <div class="qaim-stats-container">
        <div class="qaim-stat-group">
          <div class="qaim-label">Unlocking</div>
          <div class="qaim-value" id="qaim-unlocking">---</div>
        </div>
        <div class="qaim-stat-group">
          <div class="qaim-label">Progress</div>
          <div class="qaim-value" id="qaim-progress">---</div>
        </div>
        <div class="qaim-stat-group">
          <div class="qaim-label">Req (base)</div>
          <div class="qaim-value" id="qaim-req-base">---</div>
        </div>
        <div class="qaim-stat-group">
          <div class="qaim-label">Req (adj)</div>
          <div class="qaim-value" id="qaim-req-adj">---</div>
        </div>
        <div class="qaim-stat-group">
          <div class="qaim-label">Remaining</div>
          <div class="qaim-value" id="qaim-remaining">---</div>
        </div>
        <div class="qaim-stat-group">
          <div class="qaim-label">Days (nat / +refill / +3x)</div>
          <div class="qaim-value" id="qaim-days">---</div>
        </div>
      </div>

      <div class="qaim-bar-controls">
        <span class="qaim-badge" id="qaim-donator-badge">Donator</span>
        <span class="qaim-badge" id="qaim-music-badge">Music Store +30%</span>
        <span class="qaim-muted" id="qaim-active-gym">Active: —</span>
      </div>
    `;

    listRoot.insertAdjacentElement("afterend", bar);
  }

  function updateBar() {
    ensureBar();
    const bar = document.getElementById(BAR_ID);
    if (!bar) return;

    const unlocking = findUnlockingGym();
    const isMusic = detectMusicStoreJob();
    const isDonator = detectDonator();
    const e = getEnergyCurrentMax();
    const daily = computeDailyEnergies(e.max, isDonator);

    const allGymButtons = Array.from(document.querySelectorAll('button[class*="gymButton"]'));
    const activeGymName = findActiveGymName(allGymButtons);

    const elUnlocking = document.getElementById("qaim-unlocking");
    const elProgress = document.getElementById("qaim-progress");
    const elReqBase = document.getElementById("qaim-req-base");
    const elReqAdj = document.getElementById("qaim-req-adj");
    const elRemaining = document.getElementById("qaim-remaining");
    const elDays = document.getElementById("qaim-days");

    const donBadge = document.getElementById("qaim-donator-badge");
    const musBadge = document.getElementById("qaim-music-badge");
    const activeEl = document.getElementById("qaim-active-gym");
    if (donBadge) donBadge.classList.toggle("active", isDonator);
    if (musBadge) musBadge.classList.toggle("active", isMusic);
    if (activeEl) activeEl.textContent = `Active: ${activeGymName}`;

    if (!unlocking) {
      elUnlocking.textContent = "N/A";
      elProgress.textContent = "N/A";
      elReqBase.textContent = "N/A";
      elReqAdj.textContent = "N/A";
      elRemaining.textContent = "N/A";
      elDays.textContent = "N/A";
      return;
    }

    const { gymId, name, pct } = unlocking;

    if (lastProgressPct === null) lastProgressPct = pct;
    if (pct !== lastProgressPct) {
      localSpentOffset = 0;
      lastProgressPct = pct;
    }

    let baseReq = 0;
    if (gymId > 1 && (gymId - 2) >= 0 && (gymId - 2) < GYM_ENERGIES.length) {
      baseReq = GYM_ENERGIES[gymId - 2];
    }

    let adjReq = baseReq;
    if (baseReq > 0 && isMusic) adjReq = Math.round(baseReq / MUSIC_MULT);

    let remaining = 0;
    if (adjReq > 0) {
      remaining = Math.round(adjReq * ((100 - pct) / 100));
      remaining = Math.max(0, remaining - localSpentOffset);
    }

    const dNat = daysFromRemaining(remaining, e.cur, daily.nat);
    const dRefill = daysFromRemaining(remaining, e.cur, daily.refill);
    const dXanax = daysFromRemaining(remaining, e.cur, daily.xanax);

    elUnlocking.textContent = name;
    elProgress.textContent = `${pct.toFixed(0)}%`;

    if (baseReq <= 0) {
      elReqBase.textContent = "Specialist / N/A";
      elReqAdj.textContent = "Specialist / N/A";
      elRemaining.textContent = "Specialist / N/A";
      elDays.textContent = "—";
      return;
    }

    elReqBase.textContent = formatNum(baseReq);
    elReqAdj.textContent = formatNum(adjReq);
    elRemaining.textContent = formatNum(remaining);
    elDays.textContent = `${formatDays(dNat)} / ${formatDays(dRefill)} / ${formatDays(dXanax)}`;

    const vals = bar.querySelectorAll(".qaim-value");
    vals.forEach(v => v.classList.toggle("updated", localSpentOffset > 0));
  }

  function setupEnergyObserver() {
    const root = document.getElementById("sidebarroot") || document.body;

    const readEnergyOnly = () => getEnergyCurrentMax().cur;

    lastEnergyVal = readEnergyOnly();

    const observer = new MutationObserver(() => {
      const cur = readEnergyOnly();
      if (cur !== -1 && lastEnergyVal !== -1) {
        if (cur < lastEnergyVal) {
          const diff = lastEnergyVal - cur;
          if (diff > 0 && diff <= 50) {
            localSpentOffset += diff;
            updateBar();
          }
        }
      }
      lastEnergyVal = cur;
    });

    observer.observe(root, { childList: true, subtree: true, characterData: true });
  }

  let scheduled = false;
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateBar();
    });
  }

  function boot() {
    updateBar();
    setupEnergyObserver();

    const mo = new MutationObserver(() => scheduleUpdate());
    mo.observe(document.body, { childList: true, subtree: true });

    setInterval(() => updateBar(), 1000);
  }

  boot();
})();

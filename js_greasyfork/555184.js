// ==UserScript==
// @name         Torn: SFC Suggester (Item/Profit Optimized)
// @namespace    https://torn-auto-tools.example
// @version      3.1.0
// @description  Evaluates SFC choices and visually highlights the best button.
// @match        https://www.torn.com/page.php?sid=crimes*
// @run-at       document-idle
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/555184/Torn%3A%20SFC%20Suggester%20%28ItemProfit%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555184/Torn%3A%20SFC%20Suggester%20%28ItemProfit%20Optimized%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**************  CONFIG  **************/
  const CFG = {
    scanBaseIntervalMs: [700, 1200],
    scanBackoffCeilMs: 60000,
    scanBackoffGrow: 1.6,
    scanBackoffShrink: 0.6,
    respectVisibility: true,

    // Never recommend below this unless literally everything is below it
    absoluteFloorPct: 45,

    /**************  ITEM-OPTIMIZED LOGIC  **************/
    itemWeight: {
      TRASH:    0.25,
      SUBWAY:   0.30,
      JUNKYARD: 1.00,
      BEACH:    0.35,
      CEMETERY: 0.55,
      FOUNTAIN: 0.15
    },

    thresholds: {
      TRASH:    70,
      SUBWAY:   70,
      JUNKYARD: 58,
      BEACH:    75,
      CEMETERY: 75,
      FOUNTAIN: 72
    },

    bonuses: {
      junkyardSunMon: 10,
      junkyardBase:    6,
      cemeteryOffHours: 8,
      cemeteryGroundsPenalty: -25,
      beachPenalty:   -8,
      trashPenalty:   -5,
      subwayPenalty:  -4,
      fountainPenalty:-8,
      fountainLateMonth: 5,
      fountainEarlyPenalty: -6
    }
  };

  /********************  UTILITIES  ******************************/
  const clampInt = (n, lo, hi) => Math.max(lo, Math.min(hi, n|0));
  const rnd = (min, max) => Math.random() * (max - min) + min;
  const rndInt = (min, max) => Math.floor(rnd(min, max + 1));
  const pickMs = (range) => rndInt(range[0], range[1]);

  function parseTrailingPercent(label) {
    const m = /\((\d{1,3})%\)\s*$/.exec(label || '');
    return m ? clampInt(parseInt(m[1], 10), 0, 100) : null;
  }

  function getCommitButtonFromTile(tile) {
    const btn = tile.querySelector('[class*="commitButtonSection"] button');
    return (btn && btn.nodeName === 'BUTTON') ? btn : null;
  }

  function enumerateJobTiles() {
    const tiles = Array.from(document.querySelectorAll('[class*="crimeOptionWrapper"]'));
    return tiles.map((tile, idx) => {
      const pctNode = tile.querySelector('[class*="densityTooltipTrigger"][aria-label*="%"]');
      const aria = pctNode?.getAttribute('aria-label') || '';
      const pct = parseTrailingPercent(aria);
      const btn = getCommitButtonFromTile(tile);
      const isDisabled = (btn?.getAttribute('aria-disabled') || '').toLowerCase() === 'true';
      return (pctNode && btn && pct != null) ? { tile, pct, aria, btn, isDisabled, idx } : null;
    }).filter(Boolean);
  }

  /****************  TCT TIME HELPERS  **************************/
  function getTctNow() {
    const d = new Date();
    return { dow: d.getUTCDay(), hour: d.getUTCHours(), dom: d.getUTCDate() };
  }
  function isWeekday(dow) { return dow >= 1 && dow <= 5; }

  /****************  SCORING / SELECTION  ***********************/
  const idxToName = ['TRASH','SUBWAY','JUNKYARD','BEACH','CEMETERY','FOUNTAIN'];

  function dynamicThreshold(name, base, t) {
    if (name === 'BEACH') return Math.max(base, 75);
    if (name === 'FOUNTAIN') {
      if (t.dom <= 7)  return Math.min(90, base + 6);
      if (t.dom >= 24) return Math.max(55, base - 6);
    }
    return base;
  }

  function itemBiasBase(name) {
    return 0.5 + 0.5 * (CFG.itemWeight[name] ?? 0.5);
  }

  function computeScore(job, t) {
    const name = idxToName[job.idx];
    let score = job.pct * itemBiasBase(name);

    if (name === 'JUNKYARD') {
      score += CFG.bonuses.junkyardBase;
      if (t.dow === 0 || (t.dow === 1 && t.hour < 12)) score += CFG.bonuses.junkyardSunMon;
    }

    if (name === 'CEMETERY') {
      const grounds = (isWeekday(t.dow) && t.hour >= 9 && t.hour < 17);
      score += grounds ? CFG.bonuses.cemeteryGroundsPenalty : CFG.bonuses.cemeteryOffHours;
    }

    if (name === 'BEACH')   score += CFG.bonuses.beachPenalty;
    if (name === 'TRASH')   score += CFG.bonuses.trashPenalty;
    if (name === 'SUBWAY')  score += CFG.bonuses.subwayPenalty;

    if (name === 'FOUNTAIN') {
      score += CFG.bonuses.fountainPenalty;
      if (t.dom >= 24) score += CFG.bonuses.fountainLateMonth;
      if (t.dom <= 7)  score += CFG.bonuses.fountainEarlyPenalty;
    }

    return score;
  }

  function chooseBest(enabled) {
    const t = getTctNow();

    const evaluated = enabled.map(j => {
      const name = idxToName[j.idx];
      const baseThr = CFG.thresholds[name] ?? 65;
      const thr = dynamicThreshold(name, baseThr, t);
      const meets = j.pct >= Math.max(CFG.absoluteFloorPct, thr);
      const score = computeScore(j, t);
      return { ...j, name, thr, meets, score };
    });

    const passers = evaluated.filter(x => x.meets);
    if (passers.length) return { pick: passers.reduce((a,b)=>a.score>=b.score?a:b), why: "meets dynamic threshold" };

    const floorPass = evaluated.filter(x => x.pct >= CFG.absoluteFloorPct);
    if (floorPass.length) return { pick: floorPass.reduce((a,b)=>a.score>=b.score?a:b), why:"fallback to absolute floor" };

    const bestPct = evaluated.reduce((a,b)=>a.pct>=b.pct?a:b);
    return { pick: bestPct, why:"highest %" };
  }

  /****************  SUGGESTION UI  *****************************/
  function injectCssOnce() {
    if (document.getElementById('sfc-suggest-style')) return;
    const style = document.createElement('style');
    style.id = 'sfc-suggest-style';
    style.textContent = `
      .sfc-suggested-btn {
        outline: 3px solid #4caf50 !important;
        box-shadow: 0 0 0 3px rgba(76,175,80,.25), 0 0 10px rgba(76,175,80,.55) !important;
        animation: sfcPulse 1.8s infinite;
      }
      .sfc-suggested-tile { position: relative !important; }
      .sfc-suggested-badge {
        position: absolute; top: 6px; right: 6px;
        background: #4caf50; color: white; font-weight: 600;
        padding: 2px 8px; font-size: 12px; border-radius: 12px;
        pointer-events: none;
      }
      @keyframes sfcPulse {
        0% { box-shadow: 0 0 0 3px rgba(76,175,80,.25), 0 0 10px rgba(76,175,80,.55); }
        70% { box-shadow: 0 0 0 10px rgba(76,175,80,0), 0 0 6px rgba(76,175,80,.4); }
        100% { box-shadow: 0 0 0 3px rgba(76,175,80,.25), 0 0 10px rgba(76,175,80,.55); }
      }
    `;
    document.head.appendChild(style);
  }

  function clearSuggestion() {
    document.querySelectorAll('.sfc-suggested-btn').forEach(el => el.classList.remove('sfc-suggested-btn'));
    document.querySelectorAll('.sfc-suggested-badge').forEach(el => el.remove());
    document.querySelectorAll('.sfc-suggested-tile').forEach(el => el.classList.remove('sfc-suggested-tile'));
  }

  function applySuggestion(candidate, why) {
    clearSuggestion();
    if (!candidate?.btn) return;

    candidate.tile.classList.add('sfc-suggested-tile');

    const badge = document.createElement('div');
    badge.className = 'sfc-suggested-badge';
    badge.textContent = 'Suggested';
    candidate.tile.appendChild(badge);

    candidate.btn.classList.add('sfc-suggested-btn');
    candidate.btn.setAttribute('title', `Suggested because: ${why}`);
  }

  /****************  DECISION + SCHEDULER  **********************/
  async function trySuggestOnce() {
    injectCssOnce();

    const jobs = enumerateJobTiles();
    if (!jobs.length) { clearSuggestion(); return { suggested:false, reason:"no-tiles" }; }

    const enabled = jobs.filter(j => !j.isDisabled);
    if (!enabled.length) { clearSuggestion(); return { suggested:false, reason:"all-disabled" }; }

    const { pick, why } = chooseBest(enabled);
    applySuggestion(pick, why);

    return { suggested:true, reason:"suggested" };
  }

  function installObserver(trigger) {
    const root = document.querySelector('#react-root');
    if (!root) return;
    const obs = new MutationObserver(() => {
      if (location.hash !== '#/searchforcash') return;
      setTimeout(() => trigger('dom-change'), rndInt(140,420));
    });
    obs.observe(root, { childList:true, subtree:true });
    return obs;
  }

  function startScheduler(loopFn) {
    let backoff = pickMs(CFG.scanBaseIntervalMs);
    let scheduled = null;

    async function tick(source) {
      if (CFG.respectVisibility && document.hidden) {
        schedule(Math.min(CFG.scanBackoffCeilMs, backoff*1.5));
        return;
      }

      const result = await loopFn(source);
      backoff = result.suggested
        ? Math.max(pickMs(CFG.scanBaseIntervalMs), Math.floor(backoff * CFG.scanBackoffShrink))
        : Math.min(CFG.scanBackoffCeilMs, Math.floor(backoff * CFG.scanBackoffGrow));

      schedule(backoff + rndInt(-150,250));
    }

    function schedule(ms){ clearTimeout(scheduled); scheduled = setTimeout(() => tick('timer'), ms); }

    const obs = installObserver(() => {
      clearTimeout(scheduled);
      scheduled = setTimeout(() => tick('observer'), rndInt(250,500));
    });

    schedule(pickMs(CFG.scanBaseIntervalMs));
    document.addEventListener('visibilitychange', () => !document.hidden && tick('visibility'));

    return () => { clearTimeout(scheduled); obs?.disconnect(); };
  }

  /************************  MAIN  *******************************/
  (async function main() {
    if (!/\/page\.php\?sid=crimes/.test(location.href)) return;
    const stop = startScheduler(async () =>
      location.hash !== '#/searchforcash'
        ? (clearSuggestion(), { suggested:false, reason:"not-on-sfc" })
        : await trySuggestOnce()
    );
    window.addEventListener('beforeunload', stop, { once:true });
  })();

})();

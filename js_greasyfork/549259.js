// ==UserScript==
// @name         Torn War Pay Estimator (Caches → Pay/Hit)
// @namespace    https://torn.example/killercleat/war-pay   // any URL works
// @version      2025.09.12.10
// @author       KillerCleat [2842410]
// @description  Parse Ranked War Report, value caches via Torn API, subtract faction cut, divide by hits to estimate pay per hit for both teams.
// @match        https://www.torn.com/war.php?step=rankreport*
// @icon         https://www.torn.com/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
//
// --------------------------- NOTES & REQUIREMENTS ---------------------------
// • Reads team cache rewards and sums Attacks from the two member tables.
// • Values caches using Torn items endpoint (market_value). Cached 24h in storage.
// • Configurable faction cut (%) and API key via Tampermonkey menu.
// • If API fetch fails or times out, prints on-screen note to refresh in ~1 min.
// • Caches recognized: Armor Cache, Heavy Arms Cache, Medium Arms Cache, Melee Cache, Small Arms Cache.
// • All math: (Sum(cache_value) * qty) → subtotal; then subtract faction_cut% → pool; pool / total_hits(team) = pay_per_hit.
// • This is an estimator. Torn UI and endpoints can change; script is defensive where possible.
// ---------------------------------------------------------------------------
// CHANGELOG:
// 2025-09-12: Initial release.
// ---------------------------------------------------------------------------
// @downloadURL https://update.greasyfork.org/scripts/549259/Torn%20War%20Pay%20Estimator%20%28Caches%20%E2%86%92%20PayHit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549259/Torn%20War%20Pay%20Estimator%20%28Caches%20%E2%86%92%20PayHit%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------------- Config & storage ----------------------
  const LS = {
    apiKey: 'warpay_api_key',
    cut: 'warpay_cut_pct',
    price: 'warpay_price_cache_v1', // { timestamp, prices: { name: value } }
  };

  const DEF = {
    cutPct: 20,
    timeout: 8000,
    dayMs: 86400000,
    cacheNames: [
      'Armor Cache',
      'Heavy Arms Cache',
      'Medium Arms Cache',
      'Melee Cache',
      'Small Arms Cache',
    ],
  };

  // ---------------------- Menu ----------------------
  GM_registerMenuCommand('Set Torn API Key', () => {
    const cur = GM_getValue(LS.apiKey, '');
    const next = prompt('Enter your Torn API key (Limited Access):', cur || '');
    if (next !== null) GM_setValue(LS.apiKey, next.trim());
    location.reload();
  });

  GM_registerMenuCommand('Set Faction Cut %', () => {
    const cur = Number(GM_getValue(LS.cut, DEF.cutPct));
    const next = prompt('Enter faction cut percent (e.g. 20):', String(cur));
    if (next !== null && !Number.isNaN(Number(next))) {
      GM_setValue(LS.cut, Number(next));
      location.reload();
    }
  });

  GM_registerMenuCommand('Refresh Prices Now', async () => {
    await fetchPrices(true).catch(() => {});
    location.reload();
  });

  // ---------------------- Styles ----------------------
  GM_addStyle(`
    .warpay-card{
      background:#171717;border:1px solid #3c3c3c;color:#eee;border-radius:8px;
      padding:10px 12px;margin:10px 0 18px 0;box-shadow:0 3px 14px rgba(0,0,0,.25)
    }
    .warpay-card .hl{color:#fff;font-weight:700}
    .warpay-row{margin:4px 0}
    .warpay-small{opacity:.8;font-size:12px}
    .warpay-mono{font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace}
    .warpay-dash{margin-top:6px;border-top:1px dashed #555;padding-top:6px}
    .warpay-warn{color:#ffd25c}
    .warpay-bad{color:#ff7a7a}
    .warpay-good{color:#6bff8a}
  `);

  // ---------------------- Helpers ----------------------
  const money = n => '$' + Math.round(n).toLocaleString();
  const cutPct = () => Number(GM_getValue(LS.cut, DEF.cutPct)) || DEF.cutPct;

  const getJSON = (url, timeout) =>
    new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout,
        onload: r => {
          try { resolve(JSON.parse(r.responseText)); }
          catch { reject(new Error('PARSE_FAIL')); }
        },
        ontimeout: () => reject(new Error('TIMEOUT')),
        onerror: () => reject(new Error('XHR_ERROR')),
      });
    });

  const loadPricesBlob = () => {
    const raw = GM_getValue(LS.price, null);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };
  const savePricesBlob = blob => GM_setValue(LS.price, JSON.stringify(blob));

  async function fetchPrices(force = false) {
    const cached = loadPricesBlob();
    if (!force && cached && (Date.now() - cached.timestamp) < DEF.dayMs) {
      return cached.prices;
    }
    const key = (GM_getValue(LS.apiKey, '') || '').trim();
    if (!key) throw new Error('NO_API_KEY');

    const url = `https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(key)}`;
    const json = await getJSON(url, DEF.timeout);
    if (!json || !json.items) throw new Error('BAD_ITEMS');

    const out = {};
    for (const id in json.items) {
      const it = json.items[id];
      if (DEF.cacheNames.includes(it.name)) out[it.name] = Number(it.market_value) || 0;
    }
    // ensure all names present (0 if missing)
    DEF.cacheNames.forEach(n => { if (!(n in out)) out[n] = 0; });

    savePricesBlob({ timestamp: Date.now(), prices: out });
    return out;
  }

  // ---------------------- Page parsing ----------------------
  // Award sentence → { team, caches: {name: qty} }
  function parseAwardText(txt) {
    const t = txt.replace(/\s+/g, ' ').trim();
    // Team name until " ranked"/" remained"/" moved"
    const head = t.match(/^([A-Za-z0-9'()[\].\- ]+?)\s+(?:ranked|remained|moved)\b/i);
    if (!head) return null;
    const team = head[1].trim();

    const caches = {};
    const re = /(\d+)x\s+(Armor Cache|Heavy Arms Cache|Medium Arms Cache|Melee Cache|Small Arms Cache)/gi;
    let m; while ((m = re.exec(t)) !== null) {
      caches[m[2]] = (caches[m[2]] || 0) + Number(m[1]);
    }
    return { team, caches };
  }

  // Find the two award lines (leaves that contain “received … Cache”)
  function findAwardElements() {
    const all = Array.from(document.querySelectorAll('div, p, li, span'));
    const hits = [];
    for (const el of all) {
      const text = (el.textContent || '').trim();
      if (!/received/i.test(text) || !/Cache/i.test(text)) continue;
      // ignore container elements that only wrap children with same text
      const childHas = Array.from(el.children).some(c =>
        /received/i.test((c.textContent || '')) && /Cache/i.test((c.textContent || ''))
      );
      if (childHas) continue;
      const parsed = parseAwardText(text);
      if (parsed) hits.push({ el, ...parsed });
    }
    // Keep first unique by team, max 2
    const out = [];
    const seen = new Set();
    for (const h of hits) {
      if (seen.has(h.team)) continue;
      seen.add(h.team);
      out.push(h);
      if (out.length === 2) break;
    }
    return out;
  }

  // Build an index of elements that contain a team name (for proximity mapping)
  function indexTeamHeaders(teamNames) {
    const names = [...teamNames].sort((a, b) => b.length - a.length); // longer first
    const all = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,div,span,p,li,strong,b'));
    const res = [];
    for (const el of all) {
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt) continue;
      for (const name of names) {
        if (txt.toLowerCase().includes(name.toLowerCase())) {
          res.push({ name, el, rect: el.getBoundingClientRect() });
          break;
        }
      }
    }
    return res;
  }

  // Read total attacks from a members <ul class="members-list ...">
  function readHitsFromList(list) {
    if (!list) return null;
    // Prefer "Total" row if present
    const items = Array.from(list.querySelectorAll(':scope > li'));
    const totalRow = [...items].reverse().find(li => /Total/i.test(li.textContent || ''));
    const parseNum = n => {
      if (!n) return null;
      const v = Number((n.textContent || '').replace(/[, ]+/g, ''));
      return Number.isFinite(v) ? v : null;
    };
    const total = parseNum(totalRow?.querySelector('.points'));
    if (Number.isFinite(total)) return total;

    // Fallback: sum each row’s Attacks column ('.points')
    let sum = 0;
    for (const li of items) {
      const v = parseNum(li.querySelector('.points'));
      if (Number.isFinite(v)) sum += v;
    }
    return sum || null;
  }

  // Find all team lists and map them to the nearest header that contains a team name
  function mapListsToTeamNames(teamNames) {
    const lists = Array.from(document.querySelectorAll('.members-list.membersCont___USwcq.report___srhC_'));
    if (lists.length === 0) return {};
    const headers = indexTeamHeaders(teamNames);
    const out = {};
    for (const list of lists) {
      const targetTop = list.getBoundingClientRect().top;
      // choose header with smallest vertical distance
      let best = null, bestDist = Infinity;
      for (const h of headers) {
        const d = Math.abs((h.rect?.top || 0) - targetTop);
        if (d < bestDist) { bestDist = d; best = h; }
      }
      const team = best?.name || null;
      if (!team) continue;
      out[team] = readHitsFromList(list) ?? 0;
    }
    return out;
  }

  // ---------------------- Render ----------------------
  function renderCardHTML(team, caches, hits, prices, ts) {
    const pct = cutPct();
    const lines = [];
    let subtotal = 0;

    for (const name of DEF.cacheNames) {
      const qty = caches[name] || 0;
      if (!qty) continue;
      const unit = prices ? (prices[name] || 0) : 0;
      const val = unit * qty;
      subtotal += val;
      lines.push(`${qty}× ${name} @ ${money(unit)} = <span class="warpay-mono">${money(val)}</span>`);
    }

    const cutAmt = subtotal * (pct / 100);
    const pool = subtotal - cutAmt;
    const pph = hits > 0 ? pool / hits : 0;

    return `
      <div class="warpay-card">
        <div class="warpay-small">Using item prices ${ts ? ('from ' + new Date(ts).toLocaleString()) : '(no prices)'}.</div>
        <div class="warpay-row"><span class="hl">${team}</span></div>
        <div class="warpay-row warpay-small">${lines.length ? lines.join(' · ') : 'No caches parsed.'}</div>
        <div class="warpay-row warpay-dash">
          caches est. value: <span class="hl">${money(subtotal)}</span><br/>
          Faction cut at ${pct}%: <span class="hl">${money(cutAmt)}</span><br/>
          Team hits counted: <span class="hl">${(hits || 0).toLocaleString()}</span><br/>
          Pay per hit est.: <span class="hl warpay-good">${money(pph)}</span>
        </div>
      </div>`;
  }

  function insertAfter(node, html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const card = wrap.firstElementChild;
    node.parentNode.insertBefore(card, node.nextSibling);
  }

  // ---------------------- Main ----------------------
  async function runOnce() {
    // Clean previous runs
    document.querySelectorAll('.warpay-card').forEach(n => n.remove());

    // 1) Find the two awards (with faction names)
    const awards = findAwardElements(); // [{el, team, caches}, ...]
    if (awards.length !== 2) return false; // try again shortly

    const teamNames = awards.map(a => a.team);

    // 2) Read prices (cached) or fallback to last saved
    let prices = null, ts = null, priceWarn = '';
    try {
      prices = await fetchPrices(false);
      ts = loadPricesBlob()?.timestamp || null;
    } catch (e) {
      const cached = loadPricesBlob();
      if (cached?.prices) {
        prices = cached.prices; ts = cached.timestamp || null;
        priceWarn = `<div class="warpay-row warpay-warn warpay-small">Price lookup failed; using last saved prices. You can refresh via menu.</div>`;
      } else {
        priceWarn = `<div class="warpay-row warpay-bad warpay-small">No prices available. Set your API key in the Tampermonkey menu.</div>`;
      }
    }

    // 3) Map lists → team names and read hits
    const hitsByTeam = mapListsToTeamNames(teamNames); // { name: hits }
    // If we only got one or zero, try a simple left-to-right fallback
    if (Object.keys(hitsByTeam).length < 2) {
      const lists = Array.from(document.querySelectorAll('.members-list.membersCont___USwcq.report___srhC_'));
      if (lists.length >= 2) {
        const leftHits = readHitsFromList(lists[0]) || 0;
        const rightHits = readHitsFromList(lists[1]) || 0;
        if (!(teamNames[0] in hitsByTeam)) hitsByTeam[teamNames[0]] = leftHits;
        if (!(teamNames[1] in hitsByTeam)) hitsByTeam[teamNames[1]] = rightHits;
      }
    }

    // 4) Render one card under each award line
    for (const a of awards) {
      const html =
        renderCardHTML(a.team, a.caches, hitsByTeam[a.team] || 0, prices, ts) +
        (priceWarn || '');
      insertAfter(a.el, html);
    }
    return true;
  }

  // Try a few times while React finishes rendering
  let tries = 0;
  const tick = async () => {
    tries++;
    const ok = await runOnce().catch(() => false);
    if (!ok && tries < 8) setTimeout(tick, 600);
  };
  tick();
})();

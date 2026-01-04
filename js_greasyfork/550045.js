// ==UserScript==
// @name         PoE2 Ninja → Trade (Arpg_community)
// @namespace    poe2.ninja.trade.helper
// @version      0.1.2
// @description  Кнопка Trade на плитке. Глобальный тумблер в правом верхнем углу: включать/выключать передачу числовых значений модов, а так же доработал Jewels
// @match        https://poe.ninja/poe2/builds/*
// @match        https://poe.ninja/poe2/builds/*/character/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.pathofexile.com
// @connect      pathofexile.com
// @run-at       document-start
// @author       TheStorey and ChatGPT
// @downloadURL https://update.greasyfork.org/scripts/550045/PoE2%20Ninja%20%E2%86%92%20Trade%20%28Arpg_community%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550045/PoE2%20Ninja%20%E2%86%92%20Trade%20%28Arpg_community%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ON_NINJA = /poe\.ninja$/i.test(location.hostname) || /\.poe\.ninja$/i.test(location.hostname);

  // ---------- persistent setting ----------
  const CFG_KEY = "poe2_trade_include_values";
  let includeValues = (typeof GM_getValue === "function") ? !!GM_getValue(CFG_KEY, false) : false;
  function setIncludeValues(v) {
    includeValues = !!v;
    try { GM_setValue && GM_setValue(CFG_KEY, includeValues); } catch {}
    updateToggleUI();
    toast(`Статы: ${includeValues ? "включены (с цифрами)" : "выключены (без цифр)"}`);
  }

  // ---------- helpers ----------
  const openInTab = url => {
    try {
      if (typeof GM_openInTab === "function") return GM_openInTab(url, {active:true, insert:true});
      if (typeof GM !== "undefined" && typeof GM.openInTab === "function") return GM.openInTab(url, {active:true, insert:true});
    } catch {}
    window.open(url, "_blank", "noopener");
  };
  function leagueSlug() {
    const m = location.href.match(/poe2\/builds\/([^/]+)/i);
    if (m && m[1].toLowerCase().includes("abyss")) return "Rise%20of%20the%20Abyssal";
    return "Rise%20of%20the%20Abyssal";
  }
  const norm = s => (s||"")
    .toLowerCase()
    .replace(/<[^>]*>/g,"")
    .replace(/\(implicit\)|\(crafted\)|\(fractured\)|\(local\)|\(global\)|\(enchanted\)/gi,"")
    .replace(/[“”"′’]/g,'"')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g," ")
    .trim();
  const normTemplate = s => norm(s)
    .replace(/[\+\-]?\d+(?:\.\d+)?/g, "#")
    .replace(/#\s*to\s*#/g, "# to #")
    .replace(/^\+\s*/, '')
    .replace(/\+#%/g, "#%")
    .replace(/\+#/g, "#");
  const parseNums = s => (s.match(/[\+\-]?\d+(?:\.\d+)?/g) || []).map(Number);
  const tokenize = s => norm(s).replace(/[^a-z0-9#% ]+/g,' ').split(/\s+/).filter(Boolean);
  function applySynonyms(t) {
    return t
      .replace(/critical hit chance/g, "critical strike chance")
      .replace(/critical hit multiplier/g, "critical strike multiplier")
      .replace(/to accuracy rating/g, "to accuracy");
  }
  function isUniqueLike(d) {
    const r = (d.rarity || d.frameTypeName || "").toString().toLowerCase();
    return r === "unique" || d.frameType === 3;
  }

  // ---------- capture poe.ninja API ----------
  let EQUIPMENT = null;
  const _fetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await _fetch.apply(this, args);
    try {
      const url = (args[0] && args[0].url) || args[0];
      if (typeof url === "string" && url.includes("/poe2/api/builds/") && url.includes("/character")) {
        res.clone().json().then(j => (EQUIPMENT=j)).catch(()=>{});
      }
    } catch {}
    return res;
  };
  const _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.addEventListener("load", function () {
      try {
        if (typeof url === "string" && url.includes("/poe2/api/builds/") && url.includes("/character")) {
          try { EQUIPMENT = JSON.parse(this.responseText); } catch {}
        }
      } catch {}
    });
    return _open.call(this, method, url, ...rest);
  };
  setTimeout(() => {
    try {
      for (const e of performance.getEntriesByType("resource")) {
        if (e.name.includes("/poe2/api/builds/") && e.name.includes("/character")) {
          fetch(e.name).then(r=>r.json()).then(j => (EQUIPMENT=j)).catch(()=>{});
          break;
        }
      }
    } catch {}
  }, 500);

  // ---------- load trade2 stats & indices ----------
  let EXACT = null;   // Map normalized template -> [id...]
  let SUFFIX = null;  // Map last2 tokens -> [{id,text}]
  async function loadTrade2Stats() {
    if (EXACT) return;
    await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method:"GET",
        url:"https://www.pathofexile.com/api/trade2/data/stats",
        headers:{Accept:"application/json"},
        onload:res=>{ try {
          const data = JSON.parse(res.responseText);
          const entries = [];
          for (const g of (data.result||[])) for (const e of (g.entries||[])) if (e && e.id && e.text) entries.push(e);
          EXACT = new Map();
          SUFFIX = new Map();
          for (const e of entries) {
            const t0 = normTemplate(e.text);
            const t  = applySynonyms(t0);
            const vars = new Set([t, t.replace(/^\+\s*/,'').replace('+#%','#%').replace('+#','#')]);
            for (const v of vars) {
              if (!EXACT.has(v)) EXACT.set(v, []);
              const arr = EXACT.get(v);
              if (!arr.includes(e.id)) arr.push(e.id);
            }
            const toks = tokenize(t).filter(w=>w!=="#");
            const last2 = toks.slice(-2).join(' ');
            if (last2) {
              if (!SUFFIX.has(last2)) SUFFIX.set(last2, []);
              SUFFIX.get(last2).push({id:e.id, text:t});
            }
          }
          resolve();
        } catch(e){ reject(e);} },
        onerror: reject, ontimeout: reject
      });
    });
  }
  function similar(a, b) {
    const A = new Set(tokenize(a).filter(w=>w!=="#"));
    const B = new Set(tokenize(b).filter(w=>w!=="#"));
    if (!A.size || !B.size) return 0;
    let inter = 0; for (const w of A) if (B.has(w)) inter++;
    return inter / Math.max(A.size, B.size);
  }

  // ---------- findStatIds with preferred prefix (explicit/enchant/...) ----------
  function findStatIds(raw, preferredPrefix=null) {
    const t0 = normTemplate(raw);
    const t  = applySynonyms(t0);

    // exact match
    let ids = EXACT.get(t);
    if (!ids || !ids.length) {
      const t2 = t.replace(/^\+\s*/,'').replace('+#%','#%').replace('+#','#');
      ids = EXACT.get(t2);
    }
    if (ids && ids.length) {
      if (preferredPrefix) {
        const pref = ids.filter(id => id.startsWith(preferredPrefix + "."));
        if (pref.length) return {ids: pref, how: "exact+"+preferredPrefix};
      }
      return {ids, how:"exact"};
    }

    // suffix-similarity
    const toks = tokenize(t).filter(w=>w!=="#");
    const last2 = toks.slice(-2).join(' ');
    let cands = (last2 && SUFFIX.get(last2)) ? SUFFIX.get(last2) : [];
    if (!cands.length) {
      const last1 = toks.slice(-1).join(' ');
      cands = (last1 && SUFFIX.get(last1)) ? SUFFIX.get(last1) : [];
    }
    let best=null, bestScore=0;
    const LIMIT = cands.length ? Math.min(200, cands.length) : 0;
    for (let i=0;i<LIMIT;i++) {
      const s = similar(t, cands[i].text);
      if (s > bestScore) { bestScore = s; best = cands[i]; }
    }
    if (best && bestScore >= 0.72) {
      let out = [best.id];
      if (preferredPrefix && !best.id.startsWith(preferredPrefix + ".")) {
        const all = EXACT.get(applySynonyms(normTemplate(best.text))) || [];
        const pref = all.filter(id => id.startsWith(preferredPrefix + "."));
        if (pref.length) out = [pref[0]];
      }
      return {ids: out, how:`suffix-sim(${bestScore.toFixed(2)})`};
    }

    // global-similarity
    let bestG=null, bestGS=0;
    for (const [tpl, arr] of EXACT.entries()) {
      const s = similar(t, tpl);
      if (s > bestGS) { bestGS = s; bestG = {tpl, arr}; }
    }
    if (bestG && bestGS >= 0.82) {
      if (preferredPrefix) {
        const pref = bestG.arr.filter(id => id.startsWith(preferredPrefix + "."));
        if (pref.length) return {ids:[pref[0]], how:`global-sim(${bestGS.toFixed(2)})+${preferredPrefix}`};
      }
      return {ids:[bestG.arr[0]], how:`global-sim(${bestGS.toFixed(2)})`};
    }
    return {ids:[], how:"no-match"};
  }

  // ---------- build query ----------
  function collectMods(d) {
    const cols = ["implicitMods","explicitMods","enchantMods","craftedMods","fracturedMods","desecratedMods","runeMods"];
    const out = [];
    for (const k of cols) if (Array.isArray(d[k])) out.push(...d[k]);
    return out;
  }

  function buildQueryFromItem(it) {
    const d = it.itemData || it;
    const name = d.name || "";
    const type = d.baseType || d.typeLine || "";
    const corrupted = !!d.corrupted;
    const mods = collectMods(d);

    const details = [];
    const seen = new Set();
    const filters = [];
    for (const raw of mods) {
      const nums = parseNums(raw);
      const tpl = normTemplate(raw);
      const {ids, how} = findStatIds(raw);
      let chosenId = null;
      if (!seen.has(tpl) && ids.length) {
        chosenId = ids[0];
        const f = { id: chosenId, disabled:false };
        if (includeValues) {
          if (nums.length === 1)      f.value = { min: nums[0] };
          else if (nums.length >= 2)  f.value = { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
          else                        f.value = null;
        } else {
          f.value = null;
        }
        filters.push(f);
        seen.add(tpl);
      }
      details.push({
        raw, template: tpl, how, ids, chosenId,
        numbers: includeValues ? nums : [],
        valueSent: includeValues ? (nums.length ? (nums.length===1?{min:nums[0]}:{min:Math.min(nums[0],nums[1]),max:Math.max(nums[0],nums[1])}) : null) : null,
        note: chosenId ? (includeValues ? "MATCHED (value from item)" : "MATCHED (value=null)") : "NOT MATCHED"
      });
    }

    try {
      const inv = (d.inventoryId || "").toString();
      console.groupCollapsed(`[PoE2→Trade] ${inv} | ${name || "(no name)"} — ${type || "(no type)"}  (mods: ${mods.length}, matched: ${filters.length}, values: ${includeValues ? "ON" : "OFF"})`);
      console.table(details);
      console.log("Final query.query.stats:", [{ type:"and", filters }]);
      console.groupEnd();
    } catch {}

    const q = {
      query: {
        status: { option: "online" },
        stats: [ { type: "and", filters } ],
        filters: { misc_filters: { filters: corrupted ? { corrupted: { option: "true" } } : {} } }
      },
      sort: { price: "asc" }
    };

    if (isUniqueLike(d) && name) {
      q.query.name = name;
      if (type) q.query.type = type;
    } else {
      if (type) q.query.type = type;
    }

    return q;
  }

  // ---------- JEWELS helpers (source-aware) ----------
  function collectModsDetailed(d) {
    const out = [];
    const push = (arr, source) => Array.isArray(arr) && arr.forEach(raw => out.push({raw, source}));
    push(d.implicitMods,  "implicit");
    push(d.explicitMods,  "explicit");
    push(d.enchantMods,   "enchant");
    push(d.craftedMods,   "crafted");
    push(d.fracturedMods, "fractured");
    push(d.desecratedMods,"unknown");
    push(d.runeMods,      "unknown");
    return out;
  }

  // JEWELS: всегда Item Category -> Any Jewel;
  function buildJewelQueryFromItem(it) {
    const d = it.itemData || it;
    const corrupted = !!d.corrupted;

    const mods = collectModsDetailed(d);
    const seen = new Set();
    const details = [];
    const filters = [];

    for (const {raw, source} of mods) {
      const nums = parseNums(raw);
      const tpl  = normTemplate(raw);
      const pref = (source === "implicit" || source === "explicit" || source === "enchant" || source === "crafted" || source === "fractured")
        ? source : null;

      const {ids, how} = findStatIds(raw, pref);
      const chosenId = (ids && ids.length) ? ids[0] : null;

      if (!seen.has(tpl) && chosenId) {
        const f = { id: chosenId, disabled:false };
        if (includeValues) {
          if (nums.length === 1)      f.value = { min: nums[0] };
          else if (nums.length >= 2)  f.value = { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
          else                        f.value = null;
        } else f.value = null;

        filters.push(f);
        seen.add(tpl);
      }

      details.push({
        source, raw, template: tpl, how, ids, chosenId,
        numbers: includeValues ? nums : [],
        valueSent: includeValues ? (nums.length ? (nums.length===1?{min:nums[0]}:{min:Math.min(nums[0],nums[1]),max:Math.max(nums[0],nums[1])}) : null) : null,
        note: chosenId ? (includeValues ? "MATCHED (value from jewel)" : "MATCHED (value=null)") : "NOT MATCHED"
      });
    }

    try {
      console.groupCollapsed(`[PoE2→Trade][JEWEL] mods: ${mods.length}, matched: ${filters.length}, values: ${includeValues ? "ON" : "OFF"}`);
      console.table(details);
      console.log("Final JEWEL query (category=jewel):", [{ type:"and", filters }]);
      if (corrupted) console.log("misc_filters.corrupted = true");
      console.groupEnd();
    } catch {}

    return {
      query: {
        status: { option: "online" },
        stats: [ { type: "and", filters } ],
        filters: {
          type_filters: { filters: { category: { option: "jewel" } } }, // Any Jewel обязательно
          misc_filters: { filters: corrupted ? { corrupted: { option: "true" } } : {} }
        }
      },
      sort: { price: "asc" }
    };
  }

  // ---------- POST + retry ----------
  function postSearchAndOpen(league, bodyObj) {
    const url  = `https://www.pathofexile.com/api/trade2/search/poe2/${league}`;
    const doPost = (payload, retried) => {
      GM_xmlhttpRequest({
        method: "POST",
        url,
        headers: { "Content-Type":"application/json", "Accept":"application/json" },
        data: JSON.stringify(payload),
        onload: (res) => {
          let j = null;
          try { j = JSON.parse(res.responseText); } catch {}
          if (j && j.error && j.error.code === 2 && !retried && payload?.query?.name) {
            const p2 = JSON.parse(JSON.stringify(payload));
            delete p2.query.name;
            console.warn("[PoE2→Trade] Unknown item name → retry без query.name");
            return doPost(p2, true);
          }
          if (j && j.id) {
            openInTab(`https://www.pathofexile.com/trade2/search/poe2/${league}/${j.id}`);
          } else {
            console.warn("[PoE2→Trade] POST ok, но без id. Ответ:", res.responseText);
            openInTab(`https://www.pathofexile.com/trade2/search/poe2/${league}?q=${encodeURIComponent(JSON.stringify(payload))}`);
          }
        },
        onerror: (e) => {
          console.error("[PoE2→Trade] POST error:", e);
          openInTab(`https://www.pathofexile.com/trade2/search/poe2/${league}?q=${encodeURIComponent(JSON.stringify(payload))}`);
        }
      });
    };
    doPost(bodyObj, false);
  }

  // ---------- UI: кнопка Trade на плитках (экипировка) ----------
  function makeTradeBtn() {
    const a = document.createElement("a");
    a.textContent = "Trade";
    a.href = "#";
    Object.assign(a.style, {
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      height:"24px", padding:"0 8px", borderRadius:"8px",
      background:"rgba(0,0,0,.65)", border:"1px solid rgba(255,255,255,.25)",
      color:"#d9f7ff", fontSize:"12px", textDecoration:"none", cursor:"pointer",
      whiteSpace:"nowrap"
    });
    return a;
  }
  function makeBtnWrap() {
    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
      position:"absolute", top:"6px", right:"6px", zIndex:"2147483647",
      display:"flex", gap:"6px", opacity:"0", transition:"opacity .12s ease"
    });
    return wrap;
  }
  function applyHover(tile, wrap){
    tile.addEventListener("mouseenter", ()=> wrap.style.opacity = "1");
    tile.addEventListener("mouseleave", ()=> { setTimeout(()=>{ if(!tile.matches(":hover")) wrap.style.opacity = "0"; }, 0); });
  }
  function ensureButtonOnTile(tile){
    if (tile.__poe2_trade_btn__) return;
    const wrap = makeBtnWrap();
    const tradeBtn = makeTradeBtn();
    wrap.appendChild(tradeBtn);
    tile.style.position = tile.style.position || "relative";
    tile.appendChild(wrap);
    applyHover(tile, wrap);
    tile.__poe2_trade_btn__ = wrap;

    tradeBtn.addEventListener("click", async (e)=>{
      e.preventDefault();
      if (!EQUIPMENT) { alert("Подожди секунду — данные предметов ещё не подгрузились."); return; }
      await loadTrade2Stats();

      const m = /grid-area:\s*([a-zA-Z0-9_-]+)/.exec(tile.getAttribute("style")||"");
      if (!m) return;
      const inv = m[1].toLowerCase();
      const it = (EQUIPMENT.items||[]).find(x => ((x.itemData?.inventoryId||"").toLowerCase() === inv))
             || (inv==="ring" ? (EQUIPMENT.items||[]).find(x => /ring/i.test(x.itemData?.inventoryId||"")) : null);
      if (!it) { console.warn("[PoE2→Trade] Не нашёл предмет по grid-area:", inv); return; }

      const q = buildQueryFromItem(it);
      const league = leagueSlug();
      postSearchAndOpen(league, q);
    });
  }
  function scanTiles(root=document){
    root.querySelectorAll("div.group.relative.rounded-xs.bg-center[style*='grid-area']").forEach(ensureButtonOnTile);
  }

  // ---------- BASE JEWELS: кнопка Trade на камнях (только моды + лог) ----------
  function enhanceBaseJewelsSection() {
    const headers = Array.from(document.querySelectorAll('h2, h3, [data-scale]'))
      .filter(el => (el.textContent||'').trim().toUpperCase() === 'BASE JEWELS');

    headers.forEach(header => {
      const section = header.closest('div');
      if (!section) return;
      const grid = section.querySelector('div._layout-cluster_hedo7_1');
      const tiles = (grid || section).querySelectorAll('div.w-16');

      tiles.forEach(tile => {
        if (tile.__poe2_jewel_btn__) return;

        const box = tile.querySelector('div.rounded-sm') || tile;
        const img = tile.querySelector('img');

        const btn = makeTradeBtn();
        btn.style.background = "rgba(30,120,210,.9)";
        btn.style.color = "#fff";
        const wrap = makeBtnWrap();
        wrap.appendChild(btn);

        const cs = getComputedStyle(box);
        if (cs.position === 'static') box.style.position = 'relative';
        box.appendChild(wrap);
        applyHover(box, wrap);
        tile.__poe2_jewel_btn__ = wrap;

        btn.addEventListener('click', async e => {
          e.preventDefault();
          if (!EQUIPMENT) { alert("Подожди секунду — данные предметов ещё не подгрузились."); return; }
          await loadTrade2Stats();

          const src = img?.src?.split('?')[0] || '';
          let jewel = (EQUIPMENT?.jewels || []).find(j => (j.itemData?.icon||'').split('?')[0] === src);

          if (!jewel) {
            const alt = (img?.alt || '').toLowerCase();
            jewel = (EQUIPMENT?.jewels || []).find(j => {
              const combo = `${(j.itemData?.name||'').toLowerCase()} ${(j.itemData?.typeLine||'').toLowerCase()}`.trim();
              return alt === combo || alt.includes((j.itemData?.name||'').toLowerCase());
            });
          }

          if (!jewel) { console.warn("[PoE2→Trade] Jewel не найден по DOM/иконке"); return; }

          const q = buildJewelQueryFromItem(jewel);
          postSearchAndOpen(leagueSlug(), q);
        });
      });
    });
  }
  function initBaseJewelsWatcher() {
    enhanceBaseJewelsSection();
    const mo = new MutationObserver(() => enhanceBaseJewelsSection());
    mo.observe(document.documentElement, { childList:true, subtree:true });
  }

  // ---------- UI: глобальная иконка (справа сверху) ----------
  function injectToggleUI() {
    if (document.getElementById("poe2-trade-toggle-top")) return;

    const wrap = document.createElement("div");
    wrap.id = "poe2-trade-toggle-top";
    wrap.innerHTML = `
      <div class="poe2-toggle-btn" title="PoE2 Trade: настройки">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M3 6h13v2H3V6zm0 5h18v2H3v-2zm0 5h10v2H3v-2z"/>
        </svg>
      </div>
      <div class="poe2-toggle-panel">
        <div class="row">
          <span>Передавать цифры модов</span>
          <label class="switch">
            <input type="checkbox" id="poe2-toggle-checkbox">
            <span class="slider"></span>
          </label>
        </div>
        <div class="hint">${includeValues ? "включено: будут подставляться цифры с предмета" : "выключено: будут уходить пустые значения модов"}</div>
      </div>
    `;
    document.documentElement.appendChild(wrap);

    const style = document.createElement("style");
    style.textContent = `
      #poe2-trade-toggle-top{
        position: fixed; right: 14px; top: 18px; z-index: 2147483647;
        font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial;
        pointer-events: none;
      }
      #poe2-trade-toggle-top .poe2-toggle-btn{
        pointer-events: auto;
        width: 38px; height: 38px; border-radius: 10px;
        background: rgba(0,0,0,.7); color: #e2f1ff; display:flex; align-items:center; justify-content:center;
        border: 1px solid rgba(255,255,255,.25); cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,.25);
      }
      #poe2-trade-toggle-top .poe2-toggle-btn:hover{ background: rgba(0,0,0,.85); }
      #poe2-trade-toggle-top .poe2-toggle-panel{
        position: absolute; right: 0; top: 46px; min-width: 280px; max-width: 340px;
        padding: 12px 14px; pointer-events: auto;
        background: rgba(10,12,14,.95); color: #d7e2ea; border: 1px solid rgba(255,255,255,.2);
        border-radius: 12px; box-shadow: 0 10px 24px rgba(0,0,0,.35);
        display: none; gap: 10px; backdrop-filter: blur(2px);
      }
      #poe2-trade-toggle-top .row{ display:flex; align-items:center; justify-content:space-between; gap:14px; font-size: 14px; }
      #poe2-trade-toggle-top .hint{ margin-top: 8px; font-size: 12px; color:#9db0be; }
      #poe2-trade-toggle-top .switch { position: relative; display: inline-block; width: 46px; height: 24px; }
      #poe2-trade-toggle-top .switch input {display:none;}
      #poe2-trade-toggle-top .slider {
        position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #5a6872; transition: .2s; border-radius: 12px;
      }
      #poe2-trade-toggle-top .slider:before {
        position: absolute; content: ""; height: 18px; width: 18px; left: 3px; top: 3px; background-color: white; transition: .2s; border-radius: 50%;
      }
      #poe2-trade-toggle-top input:checked + .slider { background-color: #32c48d; }
      #poe2-trade-toggle-top input:checked + .slider:before { transform: translateX(22px); }
      #poe2-toast{
        position: fixed; right: 14px; bottom: 18px; background: rgba(0,0,0,.82);
        padding: 8px 12px; border-radius: 8px; border:1px solid rgba(255,255,255,.2);
        z-index:2147483647; font-size:13px; display:none; pointer-events: none;
      }`;
    document.documentElement.appendChild(style);

    const btn   = wrap.querySelector(".poe2-toggle-btn");
    const panel = wrap.querySelector(".poe2-toggle-panel");
    const checkbox = wrap.querySelector("#poe2-toggle-checkbox");
    checkbox.checked = includeValues;

    btn.addEventListener("click", () => {
      panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
    checkbox.addEventListener("change", () => {
      setIncludeValues(checkbox.checked);
      const hint = wrap.querySelector(".hint");
      hint.textContent = includeValues ? "включено: будут подставляться цифры с предмета" : "выключено: не будут подставляться статы с предмета";
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) panel.style.display = "none";
    });
  }
  function updateToggleUI(){
    const cb = document.getElementById("poe2-toggle-checkbox");
    if (cb) cb.checked = includeValues;
    const hint = document.querySelector("#poe2-trade-toggle-top .hint");
    if (hint) hint.textContent = includeValues ? "включено: будут подставляться статы с предмета" : "выключено: не будут подставляться статы с предмета";
  }
  function toast(msg){
    let t = document.getElementById("poe2-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "poe2-toast";
      document.documentElement.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(toast.__tmr);
    toast.__tmr = setTimeout(()=>{ t.style.display = "none"; }, 1600);
  }

  // ---------- init ----------
  if (ON_NINJA) {
    const initUI = () => injectToggleUI();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initUI);
    } else { initUI(); }

    // экипировка
    const moEquip = new MutationObserver(ml => { for (const m of ml) for (const n of m.addedNodes) if (n instanceof HTMLElement) scanTiles(n); });
    moEquip.observe(document.documentElement || document.body, {childList:true,subtree:true});
    scanTiles();

    // Base Jewels
    initBaseJewelsWatcher();
  }

  // исходная
  function scanTiles(root=document){
    root.querySelectorAll("div.group.relative.rounded-xs.bg-center[style*='grid-area']").forEach(ensureButtonOnTile);
  }

})();

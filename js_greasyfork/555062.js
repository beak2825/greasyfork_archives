// ==UserScript==
// @name         Torn Stock Daytrade Helper • Safe-Boot+ (profit tools + polished dropdown)
// @namespace    tc-daytrade-helper
// @version      1.7.0
// @description  Minimal stable overlay: API key modal, stock dropdown (SYM — Name + reload), holdings table, fee-aware profit tools with per-stock targets.
// @match        https://www.torn.com/stockexchange.php*
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/555062/Torn%20Stock%20Daytrade%20Helper%20%E2%80%A2%20Safe-Boot%2B%20%28profit%20tools%20%2B%20polished%20dropdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555062/Torn%20Stock%20Daytrade%20Helper%20%E2%80%A2%20Safe-Boot%2B%20%28profit%20tools%20%2B%20polished%20dropdown%29.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /* ---------- constants ---------- */
  const SELL_FEE_PCT = 0.001; // 0.1% sell fee
  const K = {
    apikey:     'tc_helper_apikey_170',
    collapsed:  'tc_helper_collapsed_170',
    targetsMap: 'tc_helper_targets_170'  // { [stockId or SYM]: targetPctDecimal }
  };

  /* ---------- styles ---------- */
  const pdaLikely = /Torn PDA/i.test(navigator.userAgent);
  const PDA_LIFT = pdaLikely ? 96 : 0;

  GM_addStyle(
`.tc-sb-root{--lift:${PDA_LIFT}px}
#tc-sb{position:fixed;right:10px;bottom:calc(14px + env(safe-area-inset-bottom,0px) + var(--lift));z-index:99998;background:#0e0e14;color:#eaeaea;border:1px solid #2a2a32;border-radius:12px;padding:10px;width:clamp(260px,38vw,360px);max-width:92vw;font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial;box-shadow:0 8px 30px rgba(0,0,0,.35);transition:transform .2s ease,opacity .2s ease}
#tc-sb.collapsed{transform:translateX(calc(100% + 12px));opacity:.2;pointer-events:none}
#tc-sb h3{margin:0 0 6px;font-size:13px}
#tc-sb .hdr{display:flex;gap:8px;align-items:center}
#tc-sb .hdr .sp{flex:1}
#tc-sb .row{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}
#tc-sb .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:6px}
#tc-sb select,#tc-sb input,#tc-sb button{width:100%;background:#12121a;color:#eaeaea;border:1px solid #2c2f39;border-radius:8px;padding:6px}
#tc-sb button{cursor:pointer}
#tc-sb .hr{height:1px;background:#2c2f39;margin:8px 0}
#tc-tab{position:fixed;right:0;top:40%;transform:translateY(-50%);z-index:99999;width:26px;height:120px;display:flex;align-items:center;justify-content:center;background:#1b1e27;color:#eaeaea;border:1px solid #2a2a32;border-right:none;border-top-left-radius:10px;border-bottom-left-radius:10px;box-shadow:-2px 0 10px rgba(0,0,0,.25);cursor:pointer;user-select:none}
#tc-tab .v{writing-mode:vertical-rl;text-orientation:mixed;font-weight:700;font-size:10px;letter-spacing:1px}
#tc-key-back{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center}
#tc-key{background:#0f1117;color:#eaeaea;border:1px solid #2a2a32;border-radius:12px;padding:14px;width:min(92vw,380px);box-shadow:0 10px 30px rgba(0,0,0,.5);font:13px/1.4 system-ui}
#tc-key h4{margin:0 0 8px;font-size:14px}
#tc-key input{width:100%;background:#111218;color:#eaeaea;border:1px solid #2c2f39;border-radius:8px;padding:8px 10px;margin:6px 0 10px 0}
#tc-key .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#tc-hold{max-height:min(36vh,220px);overflow:auto;border:1px solid #2c2f39;border-radius:8px;padding:4px}
#tc-hold table{width:100%;border-collapse:collapse}
#tc-hold th,#tc-hold td{padding:4px 6px;border-bottom:1px solid #2c2f39;white-space:nowrap}
#tc-hold tr:last-child td{border-bottom:none}
.ok{color:#78ffb3}.bad{color:#ff7a7a}.muted{color:#9aa0a6}
` );

  /* ---------- storage ---------- */
  const loadKey = ()=> GM_getValue(K.apikey,'');
  const saveKey = (v)=> GM_setValue(K.apikey, v||'');
  const loadCollapsed = ()=> !!GM_getValue(K.collapsed,false);
  const saveCollapsed = (v)=> GM_setValue(K.collapsed, !!v);
  const loadTargets = ()=> GM_getValue(K.targetsMap, {});
  const saveTargets = (obj)=> GM_setValue(K.targetsMap, obj || {});

  /* ---------- helpers ---------- */
  function fmt(n,d){ return (n==null || !isFinite(n)) ? '—' : Number(n).toFixed(d); }
  function pct(n,d){ if(n==null || !isFinite(n)) return '—'; return (n>=0?'+':'') + n.toFixed(d) + '%'; }
  function breakevenSell(avg){ return avg/(1-SELL_FEE_PCT); }

  function parseJsonSafe(text){
    try{ return JSON.parse(text); }catch{ return null; }
  }

  function xhrJson(url){
    return new Promise((resolve,reject)=>{
      if(typeof GM_xmlhttpRequest === 'function'){
        GM_xmlhttpRequest({
          method:'GET', url, headers:{'Accept':'application/json'}, timeout:15000,
          onload: (res)=>{
            if(res.status!==200){ reject(new Error('HTTP '+res.status)); return; }
            const j=parseJsonSafe(res.responseText||''); if(!j){ reject(new Error('Bad JSON')); return; }
            if(j.error){ reject(new Error('API '+j.error.code+': '+j.error.error)); return; }
            resolve(j);
          },
          onerror: ()=>reject(new Error('Network error')),
          ontimeout: ()=>reject(new Error('Timeout'))
        });
      } else {
        fetch(url,{cache:'no-store'}).then(r=>r.text()).then(t=>{
          let j=parseJsonSafe(t); if(!j) throw new Error('Bad JSON');
          if(j.error) throw new Error('API '+j.error.code+': '+j.error.error);
          resolve(j);
        }).catch(e=>reject(e));
      }
    });
  }

  async function apiStocksMeta(key){
    const url = `https://api.torn.com/torn/?selections=stocks&key=${encodeURIComponent(key)}`;
    const j = await xhrJson(url);
    return j.stocks || null;
  }
  async function apiUserStocks(key){
    const url = `https://api.torn.com/user/?selections=stocks&key=${encodeURIComponent(key)}`;
    const j = await xhrJson(url);
    return j.stocks || null;
  }

  /* ---------- state ---------- */
  let META = null;      // { [id]: { acronym, name, current_price, ... } }
  let TARGETS = loadTargets(); // saved per stock target pct (decimal)
  let LAST_SELECTED_ID = '';

  /* ---------- build UI ---------- */
  document.documentElement.classList.add('tc-sb-root');

  const panel = document.createElement('div');
  panel.id = 'tc-sb';
  panel.innerHTML =
    '<div class="hdr drag">'+
      '<h3 style="margin:0">TC Stocks</h3>'+
      '<span class="sp"></span>'+
      '<button id="tc-reload">Reload</button>'+
      '<button id="tc-key-btn" title="Set/Change API key">API Key</button>'+
    '</div>'+
    '<div class="hr"></div>'+
    '<div class="row">'+
      '<div><label class="muted">Choose stock</label><select id="tc-sel"><option value="">(loading…)</option></select></div>'+
      '<div><label class="muted">Status</label><input id="tc-status" readonly style="opacity:.85"></div>'+
    '</div>'+
    '<div class="hr"></div>'+
    '<div><b>Profit tools</b> <span class="muted">(0.1% sell fee auto-applied)</span></div>'+
    '<div class="row">'+
      '<div><label class="muted">Target profit %</label><input id="tc-target" type="number" step="0.1" value="1.0"></div>'+
      '<div><label class="muted">Buy @ price</label><input id="tc-entry" type="number" step="0.0001" placeholder="e.g. 512.34"></div>'+
    '</div>'+
    '<div class="row">'+
      '<button id="tc-use-live" title="Use selected stock live price">Use live</button>'+
      '<button id="tc-save-target" title="Save target for this stock">Save target</button>'+
    '</div>'+
    '<div class="row">'+
      '<div><label class="muted">Breakeven sell</label><input id="tc-be" readonly></div>'+
      '<div><label class="muted">Target sell</label><input id="tc-tpsell" readonly></div>'+
    '</div>'+
    '<div class="row">'+
      '<button id="tc-calc">Calculate</button>'+
      '<button id="tc-clear-entry">Clear</button>'+
    '</div>'+
    '<div class="hr"></div>'+
    '<div><b>Your Holdings</b> <span id="tc-hint" class="muted" style="display:none">No key or no access</span></div>'+
    '<div id="tc-hold"><table><thead><tr>'+
      '<th>SYM</th><th>Shares</th><th>Avg</th><th>Live</th><th>BE</th><th>TP</th><th>P/L%</th>'+
    '</tr></thead><tbody id="tc-hold-body"></tbody></table></div>';
  document.body.appendChild(panel);

  const tab = document.createElement('div');
  tab.id = 'tc-tab';
  tab.innerHTML = '<div class="v">STOCKS</div>';
  document.body.appendChild(tab);

  const back = document.createElement('div');
  back.id = 'tc-key-back';
  back.innerHTML =
    '<div id="tc-key">'+
      '<h4>Set Torn API Key</h4>'+
      '<input id="tc-key-input" type="password" placeholder="Paste your API key">'+
      '<div class="grid">'+
        '<button id="tc-key-save">Save</button>'+
        '<button id="tc-key-cancel">Cancel</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(back);

  /* ---------- refs ---------- */
  const els = {
    reload: document.getElementById('tc-reload'),
    select: document.getElementById('tc-sel'),
    status: document.getElementById('tc-status'),
    hint:   document.getElementById('tc-hint'),
    tbody:  document.getElementById('tc-hold-body'),
    // profit tools
    target: document.getElementById('tc-target'),
    entry:  document.getElementById('tc-entry'),
    be:     document.getElementById('tc-be'),
    tpsell: document.getElementById('tc-tpsell'),
    calc:   document.getElementById('tc-calc'),
    useLive:document.getElementById('tc-use-live'),
    clearEntry:document.getElementById('tc-clear-entry'),
    saveTargetBtn:document.getElementById('tc-save-target'),
    // key modal
    keyBtn: document.getElementById('tc-key-btn'),
    keyBack:document.getElementById('tc-key-back'),
    keyInput:document.getElementById('tc-key-input'),
    keySave: document.getElementById('tc-key-save'),
    keyCancel:document.getElementById('tc-key-cancel')
  };

  /* ---------- drag + collapse ---------- */
  (function makeDraggable(el){
    let sx=0, sy=0, ox=0, oy=0, dragging=false;
    const header = el.querySelector('.drag') || el;
    header.addEventListener('mousedown',(e)=>{
      if(panel.classList.contains('collapsed')) return;
      dragging=true; sx=e.clientX; sy=e.clientY;
      const r=el.getBoundingClientRect(); ox=r.left; oy=r.top; e.preventDefault();
    });
    document.addEventListener('mousemove',(e)=>{
      if(!dragging) return;
      el.style.left=(ox+(e.clientX-sx))+'px';
      el.style.top=(oy+(e.clientY-sy))+'px';
      el.style.right='auto'; el.style.bottom='auto';
    });
    document.addEventListener('mouseup',()=>{ dragging=false; });
  })(panel);

  function setCollapsed(v){
    if(v){ panel.classList.add('collapsed'); }
    else { panel.classList.remove('collapsed'); }
    saveCollapsed(v);
  }
  tab.addEventListener('click',()=> setCollapsed(!panel.classList.contains('collapsed')));
  setCollapsed(loadCollapsed());

  /* ---------- key modal ---------- */
  function openKeyModal(){
    els.keyInput.value = loadKey() || '';
    els.keyBack.style.display = 'flex';
    els.keyInput.focus();
  }
  function closeKeyModal(){ els.keyBack.style.display = 'none'; }
  els.keyBtn.addEventListener('click', openKeyModal);
  els.keyCancel.addEventListener('click', (e)=>{ e.preventDefault(); closeKeyModal(); });
  els.keySave.addEventListener('click', (e)=>{
    e.preventDefault();
    const v=(els.keyInput.value||'').trim();
    if(!v){ els.status.value='Please paste API key'; return; }
    saveKey(v);
    els.status.value='API key saved locally';
    els.hint.style.display='none';
    closeKeyModal();
    loadDropdown();
    loadHoldings();
  });
  try{ GM_registerMenuCommand('Set/Change Torn API key', openKeyModal); }catch{}

  /* ---------- dropdown ---------- */
  function populateSelectFromMeta(metaObj){
    const list = Object.entries(metaObj).map(([id,m])=>{
      return { id, sym:(m.acronym||'').toUpperCase(), name:(m.name||'') };
    }).sort((a,b)=> a.sym.localeCompare(b.sym) || a.name.localeCompare(b.name));

    const frag = document.createDocumentFragment();
    const first = document.createElement('option');
    first.value=''; first.textContent='(choose)';
    frag.appendChild(first);
    list.forEach(s=>{
      const o=document.createElement('option');
      o.value = s.id;
      o.textContent = s.sym ? `${s.sym} — ${s.name}` : s.name;
      frag.appendChild(o);
    });
    els.select.innerHTML='';
    els.select.appendChild(frag);
  }

  async function loadDropdown(){
    els.select.innerHTML = '<option value="">(loading…)</option>';
    const key = loadKey();
    if(!key){
      els.hint.style.display='block';
      els.select.innerHTML='<option value="">(no key)</option>';
      return;
    }
    try{
      META = await apiStocksMeta(key);
      if(!META){ els.select.innerHTML='<option value="">(none)</option>'; return; }
      populateSelectFromMeta(META);
      els.status.value = 'Stocks loaded';
      // restore selection if we had one
      if (LAST_SELECTED_ID && META[LAST_SELECTED_ID]){
        els.select.value = LAST_SELECTED_ID;
        applySavedTargetToUI(LAST_SELECTED_ID);
      }
    } catch(e){
      els.status.value = 'Meta load error';
    }
  }

  els.reload.addEventListener('click', ()=>{ loadDropdown(); });

  /* ---------- profit tools ---------- */
  function getLivePriceFor(id){
    if(!META || !id || !META[id]) return NaN;
    const m = META[id];
    return Number(m.current_price ?? m.price ?? NaN);
  }

  function applySavedTargetToUI(stockId){
    const key = stockId || ''; // prefer ID
    const sym = (META && META[stockId]) ? (META[stockId].acronym||'').toUpperCase() : '';
    const altKey = sym || '';
    const t = TARGETS[key] ?? TARGETS[altKey];
    if (typeof t === 'number' && isFinite(t)){
      els.target.value = (t*100).toFixed(2);
    }
  }

  function calculateAndFill(){
    const entry = parseFloat(els.entry.value);
    const tgtPct = parseFloat(els.target.value);
    if(!isFinite(entry)){ els.be.value='—'; els.tpsell.value='—'; return; }
    const be = breakevenSell(entry);
    const tpSell = be * (1 + (isFinite(tgtPct)? (tgtPct/100) : 0));
    els.be.value = fmt(be, 4);
    els.tpsell.value = fmt(tpSell, 4);
  }

  els.calc.addEventListener('click', calculateAndFill);
  els.target.addEventListener('change', calculateAndFill);
  els.entry.addEventListener('change', calculateAndFill);

  els.useLive.addEventListener('click', ()=>{
    const id = els.select.value || '';
    const live = getLivePriceFor(id);
    if(isFinite(live)){ els.entry.value = String(live); calculateAndFill(); }
  });

  els.clearEntry.addEventListener('click', ()=>{
    els.entry.value = '';
    calculateAndFill();
  });

  els.saveTargetBtn.addEventListener('click', ()=>{
    const id = els.select.value || '';
    const tgt = parseFloat(els.target.value);
    if(!isFinite(tgt)){ els.status.value='Enter a valid target %'; return; }
    const pctDec = tgt/100;
    const sym = (META && META[id]) ? (META[id].acronym||'').toUpperCase() : '';
    const map = loadTargets();
    if (id) map[id] = pctDec;
    if (sym) map[sym] = pctDec; // also save by symbol for holdings mapping
    TARGETS = map;
    saveTargets(map);
    els.status.value = (sym?`${sym}`:'(stock)') + ' target saved';
  });

  /* ---------- holdings ---------- */
  function renderRows(rows){
    els.tbody.innerHTML='';
    rows.forEach(r=>{
      const tr=document.createElement('tr');
      const cls = (r.plPct>=0)?'ok':'bad';
      tr.innerHTML =
        '<td>'+r.sym+'</td>'+
        '<td>'+fmt(r.shares,0)+'</td>'+
        '<td>'+fmt(r.avg,4)+'</td>'+
        '<td>'+fmt(r.live,4)+'</td>'+
        '<td>'+fmt(r.be,4)+'</td>'+
        '<td>'+ (isFinite(r.tpPrice)? fmt(r.tpPrice,4) : '—') +'</td>'+
        '<td class="'+cls+'">'+pct(r.plPct,2)+'</td>';
      els.tbody.appendChild(tr);
    });
  }

  async function loadHoldings(){
    const key = loadKey();
    if(!key){ els.hint.style.display='block'; renderRows([]); return; }
    try{
      els.hint.style.display='none';
      els.status.value='Loading holdings…';

      const [meta, user] = await Promise.all([apiStocksMeta(key), apiUserStocks(key)]);
      META = meta || META; // keep latest meta in memory
      const rows=[];
      if(meta && user){
        const num = (v)=> v==null ? 0 : Number(v);
        const asArray = Array.isArray(user) ? user : Object.entries(user).map(([id,pos])=> Object.assign({id},pos));
        asArray.forEach(pos=>{
          const id = String(pos.stock_id || pos.id || '');
          const mm = meta[id] || {};
          const sym = (mm.acronym || pos.symbol || id || '').toUpperCase();
          const shares = num(pos.amount ?? pos.shares ?? pos.total ?? pos.qty ?? pos.quantity);
          const avg = num(pos.average_price ?? pos.avg_price ?? pos.avg ?? pos.average ?? pos.price_avg);
          const live = num(mm.current_price ?? mm.price);
          if(shares>0 && avg>0){
            const be = breakevenSell(avg);
            // lookup saved target (prefer by id, else by sym)
            const t = TARGETS[id] ?? TARGETS[sym];
            const tpPrice = (typeof t === 'number' && isFinite(t)) ? be * (1 + t) : NaN;
            const plPct = (live>0) ? ((live-avg)/avg)*100 : 0;
            rows.push({sym, shares, avg, live, be, plPct, tpPrice});
          }
        });
      }
      rows.sort((a,b)=> b.plPct - a.plPct);
      renderRows(rows);
      els.status.value = rows.length ? `Holdings: ${rows.length}` : 'No holdings';
    } catch(e){
      els.status.value='Holdings error';
      renderRows([]);
      els.hint.style.display='block';
    }
  }

  /* ---------- start ---------- */
  function start(){
    if(!loadKey()){ els.hint.style.display='block'; openKeyModal(); }
    loadDropdown();
    loadHoldings();
  }
  start();

  // events
  els.select.addEventListener('change', ()=>{
    LAST_SELECTED_ID = els.select.value || '';
    applySavedTargetToUI(LAST_SELECTED_ID);
    // also, if user wants to calc immediately using live:
    // (we don't auto-fill entry to avoid surprises)
  });

  /* ---------- key modal open helpers ---------- */
  function openKeyModal(){
    els.keyInput.value = loadKey() || '';
    els.keyBack.style.display = 'flex';
    els.keyInput.focus();
  }
})();

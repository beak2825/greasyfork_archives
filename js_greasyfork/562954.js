// ==UserScript==
// @name         TornPDA Race Filter
// @namespace    modul.torn.racing
// @version      1.3.1
// @description  Race filter for custom races.
// @author       MoDuL
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562954/TornPDA%20Race%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/562954/TornPDA%20Race%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Smaller = smoother but slower to finish filtering.
  const BATCH_SIZE = 24;

  const STORE_KEY = 'modul_racefilter_v4';
  const hasGM = (typeof GM_getValue === 'function' && typeof GM_setValue === 'function');

  function loadState() {
    try {
      if (hasGM) return GM_getValue(STORE_KEY, null);
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }
  function saveState(s) {
    try {
      if (hasGM) GM_setValue(STORE_KEY, s);
      else localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch (_) {}
  }

  const TRACKS = [
    'Any','Commerce','Convict','Docks','Hammerhead','Industrial','Meltdown','Mudpit',
    'Parkland','Sewage','Speedway','Stone Park','Two Islands','Underdog','Uptown','Vector','Withdrawal'
  ];

  const CARCLASS_OPTIONS = [
    'Any',
    'A','B','C','D','E',
    'Stock A','Stock B','Stock C','Stock D','Stock E',
    'Stormatti Casteon',
    'Veloria LFA',
    'Mercia SLR',
    'Weston Marlin 177',
    'Lambrini Torobravo',
    'Volt GT',
    'Lolo 458',
    'Zaibatsu GT-R',
    'Echo R8',
    'Edomondo NSX',
    'Tsubasa Impressor',
    'Echo S4',
    'Volt MNG',
    'Dart Rampager',
    'Yotsuhada EVX',
    'Bavaria M5',
    'Cosmos EX',
    'Sturmfahrt 111',
    'Colina Tanprice',
    'Wington GGU',
    'Volt RS',
    'Oceania SS',
    'Edomondo IR',
    'Chevalier CZ06',
    'Edomondo S2',
    'Nano Cavalier',
    'Knight Firebrand',
    'Bavaria Z8',
    'Echo Quadrato',
    'Echo S3',
    'Tabata RM2',
    'Invader H3',
    'Bavaria X5',
    'Bedford Nova',
    'Verpestung Insecta',
    'Verpestung Sport',
    'Chevalier CVR',
    'Alpha Milano 156',
    'Coche Basurero',
    'Edomondo ACD',
    'Limoen Saxon',
    'Papani Colé',
    'Edomondo Localé',
    'Çagoutte 10-6',
    'Zaibatsu Macro',
    'Trident',
    'Stålhög 860',
    'Nano Pioneer',
    'Vita Bravo',
    'Bedford Racer',
  ];

  const DEFAULTS = {
    enabled: false,
    track: 'Any',
    laps: 'Any',
    lapsMode: 'exact',
    showFull: false,

    advOpen: false,
    urt: 'any',
    carClass: 'Any',
    pw: 'hide',
    bet: 'any',
  };

  let state = Object.assign({}, DEFAULTS, loadState() || {});

  if (typeof state.notFull === 'boolean' && typeof state.showFull !== 'boolean') {
    state.showFull = !state.notFull;
    delete state.notFull;
    saveState(state);
  }

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(`
      #rtRF4 {
        margin:8px 0; padding:10px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:10px;
        background:rgba(20,20,20,.92);
      }
      #rtRF4 .topBtns {
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:10px;
        margin-bottom:10px;
      }
      #rtRF4 button, #rtRF4 select {
        font-size:13px; color:#fff;
        border-radius:8px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(45,45,45,.95);
        padding:7px 10px;
        width:100%;
        box-sizing:border-box;
      }
      #rtRF4 .muted { opacity:.85; }

      #rtRF4 .grid {
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:10px;
        align-items:start;
      }
      #rtRF4 .col { display:flex; flex-direction:column; gap:8px; }

      #rtRF4 .pair {
        display:grid;
        grid-template-columns: 96px 1fr;
        gap:8px;
        align-items:center;
      }
      #rtRF4 .lbl {
        font-size:12px;
        color:rgba(255,255,255,.85);
        white-space:nowrap;
      }
      #rtRF4 .chkBox {
        display:flex;
        align-items:center;
        gap:8px;
        padding:7px 10px;
        border-radius:8px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(45,45,45,.95);
        color:#fff;
        font-size:13px;
        width:100%;
        box-sizing:border-box;
      }
      #rtRF4 input[type=checkbox]{ width:16px; height:16px; margin:0; }

      @media (max-width: 420px) {
        #rtRF4 .grid { grid-template-columns: 1fr; }
      }
    `);
  }

  function $(sel, root=document){ return root.querySelector(sel); }
  function getList(){ return $('.custom-events-wrap .events-list'); }
  function getItems(){
    const list = getList();
    if (!list) return [];
    return Array.from(list.children).filter(li => li && li.tagName === 'LI');
  }

  const toInt = (t) => {
    const m = (t || '').match(/\d+/);
    return m ? (m[0] | 0) : null;
  };

  function normText(li) {
    if (!li.dataset.rtTxt) {
      li.dataset.rtTxt = (li.textContent || '').replace(/\s+/g, ' ').toLowerCase();
    }
    return li.dataset.rtTxt;
  }

  function getTrackName(li) {
    const trackLi = li.querySelector('.event-header li.track');
    if (!trackLi) return '';
    const lapsEl = trackLi.querySelector('.laps');
    const fullText = (trackLi.textContent || '').replace(/\s+/g, ' ').trim();
    const lapsText = (lapsEl?.textContent || '').replace(/\s+/g, ' ').trim();
    return lapsText ? fullText.replace(lapsText, '').trim() : fullText;
  }

  function getLaps(li) {
    if (li.dataset.rtLaps) return parseInt(li.dataset.rtLaps, 10);
    const n = toInt(li.querySelector('.event-header li.track .laps')?.textContent);
    if (Number.isFinite(n)) li.dataset.rtLaps = String(n);
    return n;
  }

  function getDrivers(li) {
    if (li.dataset.rtCur && li.dataset.rtMax) {
      return { cur: parseInt(li.dataset.rtCur, 10), max: parseInt(li.dataset.rtMax, 10) };
    }
    const txt = li.querySelector('.acc-body li.drivers')?.textContent || '';
    const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return { cur: null, max: null };
    const cur = m[1] | 0, max = m[2] | 0;
    li.dataset.rtCur = String(cur);
    li.dataset.rtMax = String(max);
    return { cur, max };
  }

  function getFee(li) {
    if (li.dataset.rtFee) return parseInt(li.dataset.rtFee, 10);
    const txt = li.querySelector('.acc-body li.fee')?.textContent || '';
    const m = txt.match(/\$[\d,]+/);
    if (!m) return null;
    const n = parseInt(m[0].replace(/[^\d]/g, ''), 10);
    if (Number.isFinite(n)) li.dataset.rtFee = String(n);
    return Number.isFinite(n) ? n : null;
  }

  function isPasswordProtected(li) {
    if (li.dataset.rtPw) return li.dataset.rtPw === '1';
    const prot = !!li.querySelector('.event-header li.password.protected');
    li.dataset.rtPw = prot ? '1' : '0';
    return prot;
  }

  function isChampionshipURT(li) {
    if (li.dataset.rtUrt) return li.dataset.rtUrt === '1';

    const t = normText(li);
    if (!/\burtp?\d+\b/i.test(t)) { li.dataset.rtUrt = '0'; return false; }

    const hasStar =
      !!li.querySelector('.fa-star, .icon-star, .star, [class*="star"], svg use[href*="star"], svg use[xlink\\:href*="star"]') ||
      /★/.test(li.textContent || '');

    const hasChamp =
      /\bchamp/i.test(li.className) ||
      !!li.querySelector('[class*="champ"], [class*="championship"]');

    if (hasStar || hasChamp) { li.dataset.rtUrt = '1'; return true; }

    const header = li.querySelector('.event-header') || li;
    const cs = window.getComputedStyle(header);
    const cands = [cs.borderLeftColor, cs.borderColor, cs.backgroundColor].filter(Boolean);

    const isGoldish = (color) => {
      const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!m) return false;
      const r = +m[1], g = +m[2], b = +m[3];
      return r >= 150 && g >= 120 && b <= 120;
    };

    const res = cands.some(isGoldish);
    li.dataset.rtUrt = res ? '1' : '0';
    return res;
  }

  function lapsOk(li) {
    if (state.laps === 'Any') return true;
    const target = parseInt(state.laps, 10);
    if (!Number.isFinite(target)) return true;
    const n = getLaps(li);
    if (n == null) return true;
    return state.lapsMode === 'min' ? n >= target : n === target;
  }

  function pwOk(li) {
    if (state.pw === 'any') return true;
    const prot = isPasswordProtected(li);
    if (state.pw === 'hide') return !prot;
    if (state.pw === 'show') return prot;
    return true;
  }

  function betOk(li) {
    if (state.bet === 'any') return true;
    const fee = getFee(li);
    if (fee == null) return true;
    return state.bet === 'free' ? fee === 0 : fee > 0;
  }

  function showFullOk(li) {
    if (state.showFull) return true;
    const { cur, max } = getDrivers(li);
    if (cur == null || max == null) return true;
    return cur < max;
  }

  function carClassOk(li) {
    if (!state.carClass || state.carClass === 'Any') return true;

    const v = state.carClass.toLowerCase();
    const t = normText(li);

    if (v === 'a' || v === 'b' || v === 'c' || v === 'd' || v === 'e') {
      const re = new RegExp(`\\bclass\\s*${v}\\b|\\b${v}\\s*class\\b`, 'i');
      return re.test(t);
    }

    if (v.startsWith('stock ')) {
      const cls = v.replace('stock ', '');
      const re = new RegExp(`\\bstock\\b.*\\bclass\\s*${cls}\\b|\\bstock\\s*${cls}\\b`, 'i');
      return re.test(t);
    }

    return t.includes(v);
  }

  function trackOk(li) {
    if (state.track === 'Any') return true;
    return getTrackName(li) === state.track;
  }

  function urtOk(li) {
    if (state.urt === 'any') return true;
    const champ = isChampionshipURT(li);
    if (state.urt === 'only') return champ;
    if (state.urt === 'hide') return !champ;
    return true;
  }

  function keep(li) {
    if (!state.enabled) return true;

    if (!pwOk(li)) return false;
    if (!urtOk(li)) return false;
    if (!trackOk(li)) return false;
    if (!carClassOk(li)) return false;
    if (!lapsOk(li)) return false;
    if (!showFullOk(li)) return false;
    if (!betOk(li)) return false;

    return true;
  }

  let applyToken = 0;
  function applyBatched() {
    const items = getItems();
    if (!items.length) return;

    const myToken = ++applyToken;
    let i = 0;

    function step() {
      if (myToken !== applyToken) return;

      const end = Math.min(i + BATCH_SIZE, items.length);
      for (; i < end; i++) {
        const li = items[i];

        const shouldShow = keep(li);
        const last = li.dataset.rtShow;
        const now = shouldShow ? '1' : '0';
        if (last !== now) {
          li.dataset.rtShow = now;
          li.style.display = shouldShow ? '' : 'none';
        }
      }

      if (i < items.length) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  let tmr = null;
  function scheduleApply() {
    if (tmr) clearTimeout(tmr);
    tmr = setTimeout(() => { tmr = null; applyBatched(); }, 180);
  }

  function setState(patch) {
    state = Object.assign({}, state, patch);
    saveState(state);
  }

  function buildLapOptions(){
    const vals = ['Any'];
    for (let i=1;i<=10;i++) vals.push(String(i));
    for (let i=15;i<=50;i+=5) vals.push(String(i));
    for (let i=75;i<=100;i+=25) vals.push(String(i));
    return vals;
  }

  function makePair(labelText, controlEl) {
    const pair = document.createElement('div');
    pair.className = 'pair';

    const lab = document.createElement('div');
    lab.className = 'lbl';
    lab.textContent = labelText;

    pair.append(lab, controlEl);
    return pair;
  }

  function makeChkPair(labelText, checkboxEl, text) {
    const pair = document.createElement('div');
    pair.className = 'pair';

    const lab = document.createElement('div');
    lab.className = 'lbl';
    lab.textContent = labelText;

    const box = document.createElement('div');
    box.className = 'chkBox';
    box.append(checkboxEl, document.createTextNode(text));

    pair.append(lab, box);
    return pair;
  }

  function mountUI(){
    const wrap = document.querySelector('.custom-events-wrap');
    if (!wrap || document.getElementById('rtRF4')) return false;

    const bar = document.createElement('div');
    bar.id = 'rtRF4';

    const top = document.createElement('div');
    top.className = 'topBtns';

    const btn = document.createElement('button');
    btn.textContent = state.enabled ? 'Filter: ON' : 'Filter: OFF';
    btn.onclick = () => {
      setState({ enabled: !state.enabled });
      btn.textContent = state.enabled ? 'Filter: ON' : 'Filter: OFF';
      scheduleApply();
    };

    const advBtn = document.createElement('button');
    advBtn.textContent = state.advOpen ? 'Advanced ▲' : 'Advanced ▼';
    advBtn.className = 'muted';

    top.append(btn, advBtn);

    const grid = document.createElement('div');
    grid.className = 'grid';

    const col1 = document.createElement('div');
    col1.className = 'col';

    const col2 = document.createElement('div');
    col2.className = 'col';

    const selTrack = document.createElement('select');
    selTrack.innerHTML = TRACKS.map(t=>`<option value="${t}">${t}</option>`).join('');
    selTrack.value = state.track;
    selTrack.onchange = () => { setState({track: selTrack.value}); scheduleApply(); };

    const selLaps = document.createElement('select');
    selLaps.innerHTML = buildLapOptions().map(v=>`<option value="${v}">${v}</option>`).join('');
    selLaps.value = state.laps;
    selLaps.onchange = () => { setState({laps: selLaps.value}); scheduleApply(); };

    const selMode = document.createElement('select');
    selMode.innerHTML = `<option value="exact">Exact</option><option value="min">Min</option>`;
    selMode.value = state.lapsMode;
    selMode.onchange = () => { setState({lapsMode: selMode.value}); scheduleApply(); };

    const cbFull = document.createElement('input');
    cbFull.type = 'checkbox';
    cbFull.checked = !!state.showFull;
    cbFull.onchange = () => { setState({showFull: cbFull.checked}); scheduleApply(); };

    col1.append(
      makePair('Track', selTrack),
      makePair('Laps', selLaps),
      makePair('Lap mode', selMode),
      makeChkPair('Status', cbFull, 'Show full')
    );

    const advWrap = document.createElement('div');
    advWrap.style.display = state.advOpen ? 'block' : 'none';

    advBtn.onclick = () => {
      setState({ advOpen: !state.advOpen });
      advWrap.style.display = state.advOpen ? 'block' : 'none';
      advBtn.textContent = state.advOpen ? 'Advanced ▲' : 'Advanced ▼';
    };

    const selURT = document.createElement('select');
    selURT.innerHTML = `
      <option value="any">Any</option>
      <option value="only">Only</option>
      <option value="hide">Hide</option>`;
    selURT.value = state.urt;
    selURT.onchange = () => { setState({urt: selURT.value}); scheduleApply(); };

    const selCar = document.createElement('select');
    selCar.innerHTML = CARCLASS_OPTIONS.map(v => `<option value="${v}">${v}</option>`).join('');
    selCar.value = state.carClass || 'Any';
    selCar.onchange = () => { setState({carClass: selCar.value}); scheduleApply(); };

    const selBet = document.createElement('select');
    selBet.innerHTML = `
      <option value="any">Any</option>
      <option value="free">Free</option>
      <option value="bet">Bet</option>`;
    selBet.value = state.bet;
    selBet.onchange = () => { setState({bet: selBet.value}); scheduleApply(); };

    const selPw = document.createElement('select');
    selPw.innerHTML = `
      <option value="any">Any</option>
      <option value="show">Show</option>
      <option value="hide">Hide</option>`;
    selPw.value = state.pw || 'hide';
    selPw.onchange = () => { setState({pw: selPw.value}); scheduleApply(); };

    advWrap.append(
      makePair('URT', selURT),
      makePair('Car/Class', selCar),
      makePair('Bet', selBet),
      makePair('Password', selPw)
    );

    col2.append(advWrap);

    grid.append(col1, col2);

    bar.append(top, grid);
    wrap.parentNode.insertBefore(bar, wrap);

    scheduleApply();
    return true;
  }

  function boot(){
    if (mountUI()) return;

    const obs = new MutationObserver(() => {
      if (mountUI()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), 6000);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
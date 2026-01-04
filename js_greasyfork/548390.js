// ==UserScript==
// @name        GMEP – Photos & Views per Place (i18n + minimize)
// @namespace   local.gmep
// @version     2.7.0-i18n
// @description Counts photos & videos per place (incl. views). Smart auto-load, CSV, aligned grid, media & place filters, row click to jump. Optimized for German UI, works in English too. Now with minimize/restore.
// @match       https://www.google.com/maps/*
// @match       https://www.google.de/maps/*
// @match       https://www.google.at/maps/*
// @include     /^https:\/\/www\.google\.[a-z.]+\/maps\/.*/
// @license      MIT
// @copyright    (c) 2025 CGIELER
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/548390/GMEP%20%E2%80%93%20Photos%20%20Views%20per%20Place%20%28i18n%20%2B%20minimize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548390/GMEP%20%E2%80%93%20Photos%20%20Views%20per%20Place%20%28i18n%20%2B%20minimize%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- Router guard ---------- */
  const onRoute = () => /\/maps\/contrib\/[^/]+\/photos/.test(location.href) ? boot() : teardown();
  ['pushState','replaceState'].forEach(k=>{
    const orig=history[k]; history[k]=function(){const r=orig.apply(this,arguments); setTimeout(onRoute,0); return r;};
  });
  addEventListener('popstate', onRoute);
  setInterval(onRoute, 800);

  /* ---------- i18n ---------- */
  const I18N = {
    de: {
      title: 'GMEP • ALLE Fotos & Aufrufe je Ort',
      buttons: { scan:'Scan', load:'Alles laden (smart)', stop:'Stopp', reset:'Reset', csv:'CSV', find:'Scroller finden' },
      media: { all:'Alle', photos:'Fotos', videos:'Videos' },
      labels: {
        place:'Ort', placePh:'Ort filtern (Teilbegriff)…', delay:'Verzögerung (ms)',
        tip:'Tipp: Zeile anklicken → zum Ort im linken Paneel springen. Strg/⌘-Klick lädt automatisch nach unten, bis der Ort gefunden ist.',
        ready:'bereit…'
      },
      head: { place:'Ort', ph:'Fotos', vd:'Videos', views:'Aufrufe' },
      stats: ({n,ph,vd,vw,filter,mode}) => `${n} Orte • ${num(ph)} ${mode!=='videos'?'Fotos':'Fotos (0)'} • ${num(vd)} ${mode!=='photos'?'Videos':'Videos (0)'} • ${num(vw)} Aufrufe${filter}`,
      rowTip: (pv,vv,mode) => mode==='photos' ? `Foto-Aufrufe: ${num(pv)} (Videos ausgeblendet)` :
                           mode==='videos' ? `Video-Aufrufe: ${num(vv)} (Fotos ausgeblendet)` :
                                             `Foto-Aufrufe: ${num(pv)} • Video-Aufrufe: ${num(vv)}`,
      noRows: 'Keine Treffer.',
      jumped: p => `Zu „${p}“ gesprungen.`,
      notFound: p => `„${p}“ ist in den geladenen Einträgen nicht vorhanden.`,
      prog: { stopped:'gestoppt', done:'fertig', cycle: i => `Load-All: Zyklus ${i}` },
      csv: { headers:['Ort','Fotos','FotoAufrufe','Videos','VideoAufrufe','AufrufeGesamt'], filename:'gmep_orte_fotos_aufrufe.csv' },
      langLabel:'Sprache', langDe:'Deutsch', langEn:'English',
      mini: { minimize:'Minimieren', restore:'Maximieren' }
    },
    en: {
      title: 'GMEP • ALL Photos & Views per Place',
      buttons: { scan:'Scan', load:'Load All (smart)', stop:'Stop', reset:'Reset', csv:'CSV', find:'Find Scroller' },
      media: { all:'All', photos:'Photos', videos:'Videos' },
      labels: {
        place:'Place', placePh:'Filter places (substring)…', delay:'Delay (ms)',
        tip:'Tip: Click a row to jump to the place in the left panel. Ctrl/Cmd-click auto-loads until found.',
        ready:'ready…'
      },
      head: { place:'Place', ph:'Photos', vd:'Videos', views:'Views' },
      stats: ({n,ph,vd,vw,filter,mode}) => `${n} places • ${num(ph)} ${mode!=='videos'?'photos':'photos (0)'} • ${num(vd)} ${mode!=='photos'?'videos':'videos (0)'} • ${num(vw)} views${filter}`,
      rowTip: (pv,vv,mode) => mode==='photos' ? `Photo views: ${num(pv)} (videos hidden)` :
                           mode==='videos' ? `Video views: ${num(vv)} (photos hidden)` :
                                             `Photo views: ${num(pv)} • Video views: ${num(vv)}`,
      noRows: 'No results.',
      jumped: p => `Jumped to “${p}”.`,
      notFound: p => `“${p}” not found in loaded items.`,
      prog: { stopped:'stopped', done:'done', cycle: i => `Load-All: cycle ${i}` },
      csv: { headers:['Place','Photos','PhotoViews','Videos','VideoViews','ViewsTotal'], filename:'gmep_photos_videos_per_place.csv' },
      langLabel:'Language', langDe:'Deutsch', langEn:'English',
      mini: { minimize:'Minimize', restore:'Restore' }
    }
  };
  function detectLang(){
    const html = (document.documentElement.lang||'').slice(0,2).toLowerCase();
    const nav  = (navigator.language||'').slice(0,2).toLowerCase();
    const a = document.querySelector('button.xUc6Hf[data-photo-id]')?.getAttribute('aria-label') || '';
    if (/Aufruf|Ansicht/i.test(a)) return 'de';
    if (/view/i.test(a)) return 'en';
    if (html==='de'||nav==='de') return 'de';
    return 'en';
  }

  /* ---------- State ---------- */
  const S = {
    totals:new Map(), seen:new Set(),
    auto:false, overlay:null, delayMs:700, scroller:null, booted:false,
    mode:'all', place:'', lang: detectLang(),
    min: false // Minimiert?
  };

  /* ---------- Utils ---------- */
  const num = n => n.toLocaleString();
  const TX  = el => (el?.innerText || el?.textContent || '').trim();
  const N   = s  => parseInt((s||'').replace(/[^\d]/g,''),10)||0;
  const ESC = s  => (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const nap = ms => new Promise(r=>setTimeout(r,ms));

  /* ---------- Place ---------- */
  function placeFromNode(node){
    const img = node.querySelector?.('img[alt], img[title]') ||
                node.closest?.('button.xUc6Hf')?.querySelector('img[alt], img[title]');
    const fromImg = (img?.alt || img?.title || '').trim();
    if (fromImg) return fromImg;
    let el=node;
    for (let i=0;i<12 && el;i++,el=el.parentElement){
      let s=el.previousElementSibling;
      while (s){
        const h = s.matches?.('.YB0Y6d[aria-label], .YB0Y6d.BcOb1[aria-label]') ? s
                : s.querySelector?.('.YB0Y6d[aria-label], .YB0Y6d.BcOb1[aria-label]');
        if (h){
          const raw = h.getAttribute('aria-label') || '';
          const cut = raw.split(/[·,–-]/)[0].replace(/\s\d.*$/,'').trim();
          return cut || raw.trim();
        }
        s = s.previousElementSibling;
      }
    }
    return S.lang==='de' ? 'Unbekannter Ort' : 'Unknown place';
  }

  /* ---------- Media & Views ---------- */
  const listMedia = () =>
    Array.from(document.querySelectorAll('button.xUc6Hf[data-photo-id]'))
      .map(btn => ({ btn, isVideo:/video/i.test(btn.getAttribute('aria-label')||'') }));

  const VIEWS_RE = /([\d\s.,]+)\s*(Aufruf(e)?|Ansicht(en)?|views?)/i;
  function viewsFrom(btn){
    const v1 = N(TX(btn.querySelector('.HtPsUd'))); if (v1>0) return v1;
    const a = btn.getAttribute('aria-label') || '';
    const m = a.match(VIEWS_RE);
    return m ? N(m[1]) : 0;
  }

  /* ---------- Scroller ---------- */
  const isScroll = el => {
    const cs = getComputedStyle(el), oy=cs.overflowY, o=cs.overflow;
    return (oy==='auto'||oy==='scroll'||o==='auto'||o==='scroll') && el.scrollHeight>el.clientHeight+4;
  };
  const scrollParent = el => { let n=el; while(n&&n!==document.body){ if(isScroll(n)) return n; n=n.parentElement } return null; };
  function ensureScroller(hl=false){
    if (!S.scroller || !document.body.contains(S.scroller)){
      const first = document.querySelector('button.xUc6Hf[data-photo-id]');
      S.scroller = (first && scrollParent(first))
                || Array.from(document.querySelectorAll('div,section,main,aside')).find(el=>isScroll(el)&&el.querySelector('button.xUc6Hf[data-photo-id]'))
                || document.querySelector('.m6QErb.XiKgde')?.parentElement
                || document.scrollingElement;
    }
    if (hl && S.scroller){ S.scroller.style.outline='2px solid #3b82f6'; setTimeout(()=>{if(S.scroller) S.scroller.style.outline='';},1200); }
    return S.scroller;
  }

  /* ---------- Styles ---------- */
  function ensureStyles(){
    if (document.getElementById('gmep-styles-i18n-min')) return;
    const st=document.createElement('style'); st.id='gmep-styles-i18n-min';
    st.textContent = `
      .gmep-box{position:fixed;top:12px;right:12px;z-index:2147483647;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:14px;max-height:78vh;overflow:auto;font:12px/1.4 system-ui,Segoe UI,Arial;min-width:700px}
      .gmep-title{display:flex;align-items:center;gap:8px;font-weight:700;margin-bottom:8px;font-size:13px}
      .gmep-controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
      .gmep-btn{appearance:none;border:1px solid transparent;padding:8px 12px;border-radius:10px;font-weight:600;cursor:pointer;transition:all .15s ease;user-select:none;box-shadow:0 1px 0 rgba(0,0,0,.04)}
      .gmep-btn:disabled{opacity:.6;cursor:not-allowed}
      .gmep-btn.primary{background:#2563eb;color:#fff;border-color:#2563eb}.gmep-btn.primary:hover{filter:brightness(1.05)}
      .gmep-btn.success{background:#10b981;color:#062b23;border-color:#10b981}.gmep-btn.success:hover{filter:brightness(1.05)}
      .gmep-btn.warn{background:#ef4444;color:#fff;border-color:#ef4444}.gmep-btn.warn:hover{filter:brightness(1.05)}
      .gmep-btn.ghost{background:#f8fafc;color:#111827;border-color:#e5e7eb}.gmep-btn.ghost:hover{background:#eef2f7}
      .gmep-inline{display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap}
      .gmep-input{width:90px;padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;font:12px system-ui}
      .gmep-input-wide{width:240px;padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;font:12px system-ui}
      .gmep-badge{font:11px system-ui;color:#6b7280}
      .gmep-seg{display:inline-flex;border:1px solid #e5e7eb;background:#f8fafc;border-radius:12px;overflow:hidden}
      .gmep-segbtn{padding:6px 10px;border:0;background:transparent;cursor:pointer;font-weight:600}
      .gmep-segbtn.on{background:#111827;color:#fff}
      .gmep-grid{display:grid;grid-template-columns:1fr 90px 90px 120px;column-gap:12px;align-items:baseline}
      .gmep-head{font-weight:700;border-bottom:1px solid #f1f5f9;padding:6px 0;margin-bottom:4px;position:sticky;top:0;background:#fff}
      .gmep-row{padding:4px 0;border-bottom:1px dashed #f1f5f9}
      .gmep-row.clickable{cursor:pointer}
      .gmep-row.clickable:hover{background:#f9fafb}
      .gmep-num{text-align:right}
      .gmep-highlight{outline:3px solid #f59e0b; outline-offset:2px; transition:outline-color .2s}
      .gmep-lang{margin-left:auto; display:flex; gap:6px; align-items:center}
      .gmep-select{padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}
      .gmep-minbtn{padding:6px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc}
      .gmep-minbtn:hover{background:#eef2f7}

      /* Minimiert: nur Titelzeile bleibt sichtbar, restliche Bereiche ausblenden */
      .gmep-box.gmep-minimized{padding:6px 8px; min-width:auto; width:auto}
      .gmep-box.gmep-minimized .gmep-controls,
      .gmep-box.gmep-minimized .gmep-inline,
      .gmep-box.gmep-minimized #gm-stats,
      .gmep-box.gmep-minimized .gmep-head,
      .gmep-box.gmep-minimized #gm-list,
      .gmep-box.gmep-minimized .gmep-badge:not(.gmep-title){display:none !important}
      .gmep-box.gmep-minimized .gmep-lang{display:none}
    `;
    document.head.appendChild(st);
  }

  /* ---------- UI ---------- */
  function ensureOverlay(){
    if (S.overlay && document.body.contains(S.overlay)) return;
    ensureStyles();
    const i = I18N[S.lang];

    const box=document.createElement('div'); box.className='gmep-box';
    box.innerHTML = `
      <div class="gmep-title">
        <span id="gm-title-text">${i.title}</span>
        <span class="gmep-lang">
          <label>${i.langLabel}:</label>
          <select id="gm-lang" class="gmep-select">
            <option value="de"${S.lang==='de'?' selected':''}>${I18N.de.langDe}</option>
            <option value="en"${S.lang==='en'?' selected':''}>${I18N.en.langEn}</option>
          </select>
        </span>
        <button id="gm-min" class="gmep-minbtn" title="${i.mini.minimize}">${i.mini.minimize}</button>
      </div>

      <div class="gmep-controls">
        <button id="gm-scan"  class="gmep-btn primary">${i.buttons.scan}</button>
        <button id="gm-load"  class="gmep-btn success">${i.buttons.load}</button>
        <button id="gm-stop"  class="gmep-btn warn">${i.buttons.stop}</button>
        <button id="gm-reset" class="gmep-btn ghost">${i.buttons.reset}</button>
        <button id="gm-csv"   class="gmep-btn ghost">${i.buttons.csv}</button>
        <button id="gm-find"  class="gmep-btn ghost" title="${i.buttons.find}">${i.buttons.find}</button>
      </div>

      <div class="gmep-inline">
        <div class="gmep-seg" id="gm-media">
          <button class="gmep-segbtn" data-m="all">${i.media.all}</button>
          <button class="gmep-segbtn" data-m="photos">${i.media.photos}</button>
          <button class="gmep-segbtn" data-m="videos">${i.media.videos}</button>
        </div>
        <label>${i.labels.place}:
          <input id="gm-place" list="gm-places" class="gmep-input-wide" placeholder="${i.labels.placePh}">
        </label>
        <datalist id="gm-places"></datalist>
        <button id="gm-clear" class="gmep-btn ghost">${S.lang==='de'?'Löschen':'Clear'}</button>

        <label>${i.labels.delay}: <input id="gm-delay" type="number" min="200" max="3000" class="gmep-input"></label>
        <span id="gm-prog" class="gmep-badge"></span>
      </div>

      <div class="gmep-badge" style="margin:-4px 0 6px 0;">${i.labels.tip}</div>

      <div id="gm-stats" class="gmep-badge">${i.labels.ready}</div>
      <div class="gmep-grid gmep-head">
        <span>${i.head.place}</span><span class="gmep-num">${i.head.ph}</span><span class="gmep-num">${i.head.vd}</span><span class="gmep-num">${i.head.views}</span>
      </div>
      <div id="gm-list">–</div>
    `;
    document.body.appendChild(box); S.overlay=box;

    // Sprache umschalten
    box.querySelector('#gm-lang').onchange = e => {
      S.lang = (e.target.value === 'de') ? 'de' : 'en';
      // Overlay neu aufbauen, Minimierungszustand erhalten
      const keepMin = S.min;
      S.overlay?.remove(); S.overlay=null;
      ensureOverlay(); setMin(keepMin); render(0);
    };

    // Minimieren/Maximieren
    box.querySelector('#gm-min').onclick = () => setMin(!S.min);
    // Minimierungszustand aus localStorage übernehmen
    try { S.min = localStorage.getItem('gmep:min') === '1'; } catch(_) {}
    setMin(S.min);

    // Controls
    box.querySelector('#gm-delay').value = S.delayMs;
    box.querySelector('#gm-delay').onchange = e => S.delayMs = Math.max(200, +e.target.value || 700);
    box.querySelector('#gm-scan').onclick  = () => { const a = scanOnce(); render(a); };
    box.querySelector('#gm-load').onclick  = () => loadAllSmart();
    box.querySelector('#gm-stop').onclick  = () => { S.auto = false; setProg(I18N[S.lang].prog.stopped); };
    box.querySelector('#gm-reset').onclick = () => { S.totals.clear(); S.seen.clear(); render(0); };
    box.querySelector('#gm-csv').onclick   = exportCSV;
    box.querySelector('#gm-find').onclick  = () => ensureScroller(true);

    // Medien-Schalter
    const seg=box.querySelector('#gm-media');
    seg.addEventListener('click', e=>{
      const b=e.target.closest('.gmep-segbtn'); if(!b) return;
      S.mode=b.dataset.m;
      seg.querySelectorAll('.gmep-segbtn').forEach(x=>x.classList.toggle('on', x===b));
      render(0);
    });
    seg.querySelector(`.gmep-segbtn[data-m="${S.mode}"]`).classList.add('on');

    // Ort-Filter
    const pf = box.querySelector('#gm-place'); pf.value = S.place || '';
    pf.oninput = e => { S.place = e.target.value.trim(); render(0); };
    box.querySelector('#gm-clear').onclick = () => { S.place=''; pf.value=''; render(0); };

    // Zeilenklick → springen
    box.addEventListener('click', e=>{
      const row = e.target.closest('.gmep-row[data-place]');
      if (!row) return;
      const place = row.dataset.place;
      const tryLoad = e.ctrlKey || e.metaKey;  // Strg/⌘
      jumpToPlace(place, tryLoad);
    });
  }

  function updateMinButton(){
    const btn = S.overlay?.querySelector('#gm-min');
    if (!btn) return;
    const i = I18N[S.lang];
    btn.textContent = S.min ? i.mini.restore : i.mini.minimize;
    btn.title = btn.textContent;
  }
  function setMin(flag){
    S.min = !!flag;
    try { localStorage.setItem('gmep:min', S.min ? '1':'0'); } catch(_){}
    if (S.overlay){
      S.overlay.classList.toggle('gmep-minimized', S.min);
      updateMinButton();
    }
  }
  const setProg = t => { const el=S.overlay?.querySelector('#gm-prog'); if (el) el.textContent = t||''; };

  /* ---------- Render ---------- */
  function render(last=0){
    ensureOverlay();
    const i = I18N[S.lang];

    // datalist füllen
    const dl = S.overlay.querySelector('#gm-places');
    if (dl) dl.innerHTML = [...S.totals.keys()].sort().slice(0,2000).map(p=>`<option value="${ESC(p)}">`).join('');

    // rows (mit Anzeige-Filter)
    let rows = [...S.totals.entries()].map(([p,o])=>{
      const ph=o.photos||0, pv=o.photoViews||0, vd=o.videos||0, vv=o.videoViews||0;
      let showPh=ph, showVd=vd, showViews=pv+vv, tip=i.rowTip(pv,vv,S.mode);
      if (S.mode==='photos'){ showVd=0; showViews=pv; tip=i.rowTip(pv,vv,S.mode); }
      if (S.mode==='videos'){ showPh=0; showViews=vv; tip=i.rowTip(pv,vv,S.mode); }
      return [p, showPh, showVd, showViews, pv, vv];
    });

    const q = S.place?.trim().toLowerCase();
    if (q) rows = rows.filter(r => r[0].toLowerCase().includes(q));

    rows.sort((a,b)=>b[3]-a[3]);

    const sumPh=rows.reduce((a,r)=>a+r[1],0), sumVd=rows.reduce((a,r)=>a+r[2],0), sumVw=rows.reduce((a,r)=>a+r[3],0);
    const filtTxt = q ? (S.lang==='de' ? ` • Filter: „${S.place}“` : ` • Filter: “${S.place}”`) : '';

    const statsEl = S.overlay.querySelector('#gm-stats');
    if (statsEl){
      statsEl.textContent =
        i.stats({n:rows.length, ph:sumPh, vd:sumVd, vw:sumVw, filter:filtTxt, mode:S.mode}) +
        (last? (S.lang==='de'?` • +${last} neu`:` • +${last} new`):``);
    }

    const listEl = S.overlay.querySelector('#gm-list');
    if (listEl){
      listEl.innerHTML =
        rows.length ? rows.slice(0,400).map(([p,ph,vd,vw,pvw,vvw]) =>
          `<div class="gmep-grid gmep-row clickable" data-place="${ESC(p)}" title="${ESC(I18N[S.lang]===I18N.de ? 'Klicken zum Springen · Strg/⌘-Klick lädt bis gefunden' : 'Click to jump · Ctrl/Cmd-click to auto-load until found')}">
             <span title="${ESC(p)}">${ESC(p.length>80?p.slice(0,79)+'…':p)}</span>
             <span class="gmep-num">${num(ph)}</span>
             <span class="gmep-num">${num(vd)}</span>
             <span class="gmep-num" title="${ESC(I18N[S.lang].rowTip(pvw,vvw,S.mode))}">${num(vw)}</span>
           </div>`).join('')
        : ESC(i.noRows);
    }
  }

  /* ---------- CSV ---------- */
  function exportCSV(){
    const i = I18N[S.lang];
    const rows = [ i.csv.headers,
      ...[...S.totals.entries()].map(([p,o])=>{
        const ph=o.photos||0,pv=o.photoViews||0,vd=o.videos||0,vv=o.videoViews||0;
        return [p,ph,pv,vd,vv,pv+vv];
      }).sort((a,b)=>b[5]-a[5]) ];
    const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob= new Blob([csv],{type:'text/csv;charset=utf-8'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=i.csv.filename; a.click(); URL.revokeObjectURL(a.href);
  }

  /* ---------- Scan & Auto ---------- */
  function scanOnce(){
    let added=0;
    for (const {btn,isVideo} of listMedia()){
      const id = btn.getAttribute('data-photo-id');
      if (!id || S.seen.has(id)) continue;
      S.seen.add(id);
      const place = placeFromNode(btn);
      const v = viewsFrom(btn);
      const e = S.totals.get(place) || {photos:0,photoViews:0,videos:0,videoViews:0};
      if (isVideo){ e.videos++; e.videoViews += v; } else { e.photos++; e.photoViews += v; }
      S.totals.set(place, e);
      added++;
    }
    return added;
  }

  async function loadAllSmart(maxLoops=300){
    S.auto = true;
    const sc = ensureScroller(false) || document.scrollingElement;
    let stable = 0;
    for (let i=0; i<maxLoops && S.auto; i++){
      sc.scrollTop = sc.scrollHeight;
      sc.dispatchEvent(new Event('scroll',{bubbles:true}));
      setProg(I18N[S.lang].prog.cycle(i+1));
      await nap(S.delayMs);
      const a = scanOnce(); render(a);
      if (a===0){ if (++stable >= 3) break; } else stable = 0;
    }
    S.auto = false; setProg(I18N[S.lang].prog.done);
  }

  /* ---------- Jump to place ---------- */
  function findFirstNodeForPlace(place){
    const btns = document.querySelectorAll('button.xUc6Hf[data-photo-id]');
    for (const btn of btns){
      if (placeFromNode(btn) === place) return btn;
    }
    return null;
  }
  async function jumpToPlace(place, loadIfMissing=false){
    const sc = ensureScroller(true) || document.scrollingElement;
    let el = findFirstNodeForPlace(place);

    if (!el && loadIfMissing){
      for (let i=0;i<60 && !el;i++){
        sc.scrollTop = sc.scrollHeight;
        sc.dispatchEvent(new Event('scroll',{bubbles:true}));
        await nap(300);
        el = findFirstNodeForPlace(place);
      }
    }

    if (el){
      el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
      const card = el.closest('.WY21Hc') || el;
      card.classList.add('gmep-highlight');
      setTimeout(()=>card.classList.remove('gmep-highlight'), 1600);
      setProg(I18N[S.lang].jumped(place));
    }else{
      setProg(I18N[S.lang].notFound(place));
    }
  }

  /* ---------- Boot / Teardown ---------- */
  function boot(){
    if (S.booted) return;
    S.booted = true;
    // Minimierungszustand vorab laden
    try { S.min = localStorage.getItem('gmep:min') === '1'; } catch(_){}
    ensureOverlay();
    ensureScroller(true);
    render( scanOnce() );
  }
  function teardown(){
    if (!S.booted) return;
    S.overlay?.remove(); S.overlay=null;
    S.totals.clear(); S.seen.clear(); S.scroller=null; S.auto=false; S.booted=false;
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', onRoute); else onRoute();
})();

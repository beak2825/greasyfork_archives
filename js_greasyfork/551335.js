// ==UserScript==
// @name         WME Curve Safety
// @namespace    csa.ultralite.locked.uifold
// @version      2025.01.31
// @description  Analyse à chaque clic sur un segment. Pas d'overlay, pas de bouton manuel, UI épurée.
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551335/WME%20Curve%20Safety.user.js
// @updateURL https://update.greasyfork.org/scripts/551335/WME%20Curve%20Safety.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== Utils ===== */
  const g = 9.81;
  const fmt  = (x, n = 0) => (x == null || Number.isNaN(x) ? '—' : x.toFixed(n).replace('.', ','));
  const toNum = (s) => (typeof s === 'number' ? s : Number(String(s ?? '').replace(',', '.')));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lsGet = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const until = (test, every=200, tries=80) => new Promise((res, rej)=>{
    let n=0, t=setInterval(()=>{ try{ if(test()){ clearInterval(t); res(); } else if(++n>=tries){ clearInterval(t); rej(new Error('WME non prêt')); } }catch(e){ clearInterval(t); rej(e); } }, every);
  });

  /* ===== Profils ===== */
  const PROFILES = {
    urbain:   { label: 'Urbain (strict)',      f: 0.14, iDeg: 2, step: 1.5, halfWin: 20, marginKmh: 12, vTargetKmh: 50, percentile: 30 },
    campagne: { label: 'Campagne (équilibré)', f: 0.16, iDeg: 2, step: 2.0, halfWin: 30, marginKmh: 18, vTargetKmh: 50, percentile: 40 },
    montagne: { label: 'Montagne (épingles)',  f: 0.13, iDeg: 2, step: 1.5, halfWin: 18, marginKmh: 10, vTargetKmh: 40, percentile: 25 }
  };
  const defaultProfileKey = lsGet('csa.profile', 'campagne');

  /* ===== Etat ===== */
  let ui={}; let scheduled=null; let running=false;
  let headerBadge=null; let collapseBtn=null;

  /* ===== Boot ===== */
  until(()=>window.W && W.map && W.model && W.selectionManager && window.OpenLayers)
    .then(init)
    .catch(()=>console.warn('[CSA] init timeout'));

  /* ===== Sélection ===== */
  function getSelSegs(){
    const sm=W?.selectionManager; const segById=id=>W?.model?.segments?.getObjectById?.(id);
    const resolve=(x)=>{ if(!x) return null; if(x.type==='segment'||x.CLASS_NAME==='Waze.Model.Segment') return x;
      const m=x.model||x.dataModel||x._dataModel||x.attributes?.model;
      if(m && (m.type==='segment'||m.CLASS_NAME==='Waze.Model.Segment')) return m;
      const id=x.id||x.attributes?.id||m?.attributes?.id; if(id!=null){ const s=segById(id); if(s) return s; }
      if(x.geometry && x.attributes?.id!=null){ const s=segById(x.attributes.id); if(s) return s; } return null; };
    try{ const raw=sm.getSelectedDataModelObjects?.()||[]; const list=Array.isArray(raw)?raw:[raw]; const segs=list.map(resolve).filter(Boolean); if(segs.length) return segs; }catch{}
    try{ const feats=sm.getSelectedWMEFeatures?.()||sm.getSelectedFeatures?.()||[]; const segs=feats.map(resolve).filter(Boolean); if(segs.length) return segs; }catch{}
    return [];
  }
  function hookSelection(){
    const sm=W?.selectionManager;
    // Toujours actif : on calcule dès que la sélection change
    try{ sm.events.register('selectionchanged',null,()=> scheduleRun(120)); }catch{}
    try{ sm.events.register('selected',null,()=> scheduleRun(80)); }catch{}
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ ui.out.textContent=''; setBadge('—','#eee','#333'); } });
  }

  /* ===== UI ===== */
  function el(tag, attrs={}){ const d=document.createElement(tag); for(const [k,v] of Object.entries(attrs)){ if(k==='text') d.textContent=v; else if(k==='style') d.setAttribute('style',v); else d[k]=v; } return d; }
  function setCollapsed(coll){
    lsSet('csa.collapsed', coll?'1':'0');
    if(!ui.panel) return;
    ui.panel.classList.toggle('csa-collapsed', !!coll);
    collapseBtn.textContent = coll ? '+' : '–';
  }

  function buildPanel(){
    const panel = el('div', { id:'csa-panel', style: `
      position:fixed; right:16px; top:16px; width:360px; max-width:42vw;
      background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.18);
      padding:12px; font:13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; z-index:9999;
    `});
    const extraCSS = `
      #csa-panel.csa-collapsed{ padding:8px 10px; width:auto; }
      #csa-panel.csa-collapsed .csa-content{ display:none; }
      #csa-panel .csa-head-btn{ border:0; background:#eef2f6; color:#333; width:28px; height:28px; border-radius:6px; cursor:pointer; font-weight:700; }
      .csa-row{ display:flex; align-items:center; margin:6px 0; gap:8px; }
      .csa-row-label{ display:flex; align-items:center; gap:6px; min-width:150px; color:#111; }
    `;
    (function injectCSS(css){ const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); })(extraCSS);

    const head = el('div', {style:'display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; cursor:move;'});
    const left = el('div', {style:'display:flex; align-items:center; gap:8px;'});
    const title = el('div', {text:'WME CSA', style:'font-weight:700;'});
    headerBadge = el('span', {text:'—', style:'font-weight:700; padding:2px 6px; border-radius:6px; background:#eee; color:#333;'});
    left.appendChild(title); left.appendChild(headerBadge);

    const right = el('div', {style:'display:flex; align-items:center; gap:6px;'});
    // Bouton ? supprimé comme demandé
    const gearBtn = el('button', {text:'⚙︎', title:'Afficher/Masquer les réglages', className:'csa-head-btn'});
    collapseBtn = el('button', {text:'–', title:'Replier/Déplier', className:'csa-head-btn'});
    right.appendChild(gearBtn); right.appendChild(collapseBtn);

    head.appendChild(left); head.appendChild(right);
    panel.appendChild(head);

    const content = el('div', {className:'csa-content'});

    const row = (labelTxt, inputNode) => {
      const r = el('div', {className:'csa-row'});
      const lbl = el('div', {className:'csa-row-label', text:labelTxt});
      r.appendChild(lbl); r.appendChild(inputNode); content.appendChild(r); return r;
    };

    // Profil
    const selProfile = el('select', {id:'csa-profile', style:'width:200px;'});
    for (const [k,p] of Object.entries(PROFILES)) selProfile.appendChild(el('option', {value:k, text:p.label}));
    selProfile.value = defaultProfileKey;
    row('Profil', selProfile);

    // Réglages (repliés par défaut)
    const settingsWrap = el('div', {id:'csa-settings', style:'display:none; border-top:1px dashed #e2e8f0; margin-top:6px; padding-top:8px;'});
    const mkInput = (id,w=90,title='')=>el('input',{id, type:'text', title, style:`width:${w}px; box-sizing:border-box; padding:4px 6px; border:1px solid #ccc; border-radius:8px;`});
    const f=mkInput('csa-f',90), i=mkInput('csa-i',90), step=mkInput('csa-step',90), hw=mkInput('csa-halfwin',90);
    const margin=mkInput('csa-margin',90), vt=mkInput('csa-vtarget',90), perc=mkInput('csa-percentile',90);
    settingsWrap.appendChild(row('f (adhérence)', f));
    settingsWrap.appendChild(row('i (dévers°)', i));
    settingsWrap.appendChild(row('Pas (m)', step));
    settingsWrap.appendChild(row('½ Fenêtre (m)', hw));
    settingsWrap.appendChild(row('Marge (km/h)', margin));
    settingsWrap.appendChild(row('V cible (km/h)', vt));
    settingsWrap.appendChild(row('Percentile (R) %', perc));

    content.appendChild(settingsWrap);

    // Sortie (résultats)
    content.appendChild(el('div', {text:'Astuce: pas 1–3 m, ½ fenêtre 20–30 m.', style:'color:#666; margin:6px 0;'}));
    const out = el('div', {id:'csa-out', style:'margin-top:4px; white-space:pre-line; color:#111;'});
    content.appendChild(out);

    panel.appendChild(content);
    (document.body||document.documentElement).appendChild(panel);

    gearBtn.addEventListener('click', ()=>toggleSettings());
    collapseBtn.addEventListener('click', ()=> setCollapsed(!ui.panel.classList.contains('csa-collapsed')));

    // Drag
    (function enableDrag(panel, handle, storageKey='csa.panelPos'){
      let down=false, ox=0, oy=0;
      const readPos = () => { try { return JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch { return {}; } };
      const savePos = (x,y) => { try { localStorage.setItem(storageKey, JSON.stringify({x, y})); } catch {} };
      (function restore(){ const p = readPos(); if (Number.isFinite(p.x) && Number.isFinite(p.y)){ panel.style.left=p.x+'px'; panel.style.top=p.y+'px'; panel.style.right='unset'; panel.style.bottom='unset'; } })();
      const start=(cx,cy)=>{ const r=panel.getBoundingClientRect(); ox=cx-r.left; oy=cy-r.top; down=true; document.body.style.userSelect='none'; };
      const move=(cx,cy)=>{ if(!down) return; const x=Math.max(4,cx-ox), y=Math.max(4,cy-oy); panel.style.left=x+'px'; panel.style.top=y+'px'; panel.style.right='unset'; panel.style.bottom='unset'; };
      const end=()=>{ if(!down) return; down=false; document.body.style.userSelect=''; const r=panel.getBoundingClientRect(); savePos(r.left,r.top); };
      handle.addEventListener('mousedown',e=>{ e.preventDefault(); start(e.clientX,e.clientY); });
      addEventListener('mousemove',e=>move(e.clientX,e.clientY)); addEventListener('mouseup',end);
      handle.addEventListener('touchstart',e=>{ const t=e.touches[0]; if(!t) return; start(t.clientX,t.clientY); },{passive:false});
      addEventListener('touchmove',e=>{ const t=e.touches[0]; if(!t) return; move(t.clientX,t.clientY); },{passive:false}); addEventListener('touchend',end);
    })(panel, head, 'csa.panelPos');

    ui = { panel, selProfile, settingsWrap, f, i, step, halfWin: hw, margin, vtarget: vt, percentile: perc, out };
    applyProfileToUI(defaultProfileKey);
    toggleSettings(lsGet('csa.showSettings','0')==='1');
    setCollapsed(lsGet('csa.collapsed','0')==='1');
  }

  function toggleSettings(force){ const shown = force!==undefined ? !!force : (ui.settingsWrap.style.display==='none'); ui.settingsWrap.style.display = shown ? 'block' : 'none'; lsSet('csa.showSettings', shown?'1':'0'); }
  function applyProfileToUI(key){ const p = PROFILES[key]; if(!p) return; ui.f.value=String(p.f).replace('.',','); ui.i.value=p.iDeg; ui.step.value=p.step; ui.halfWin.value=p.halfWin; ui.margin.value=p.marginKmh; ui.vtarget.value=p.vTargetKmh; ui.percentile.value=p.percentile; lsSet('csa.profile', key); }
  function scheduleRun(delay=120){ if (scheduled) clearTimeout(scheduled); scheduled=setTimeout(run, delay); }

  /* ===== Géométrie & calcul ===== */
  function segToPts(seg){ const g=seg.getOLGeometry? seg.getOLGeometry(): seg.geometry; if(!g||!g.components) return []; return g.components.map(c=>[c.x,c.y]); }
  function densifyPath(pts, stepM=2){ if(!pts||pts.length<2) return []; const out=[pts[0]]; let prev=pts[0]; for(let i=1;i<pts.length;i++){ const cur=pts[i], dx=cur[0]-prev[0], dy=cur[1]-prev[1]; const L=Math.hypot(dx,dy); if(L<=0) continue; const n=Math.max(1,Math.floor(L/stepM)); for(let k=1;k<=n;k++){ const t=k/n; out.push([prev[0]+dx*t, prev[1]+dy*t]); } prev=cur; } return out; }
  function circleRadius(a,b,c){
    const ax=a[0],ay=a[1],bx=b[0],by=b[1],cx=c[0],cy=c[1];
    const A=bx-ax, B=by-ay, C=cx-ax, D=cy-ay;
    const E=A*(ax+bx)+B*(ay+by), F=C*(ax+cx)+D*(ay+cy);
    const G=2*(A*(cy-by)-B*(cx-bx));
    if(Math.abs(G)<1e-9) return Infinity;
    const ux=(D*E-B*F)/G, uy=(A*F-C*E)/G;
    return Math.hypot(ax-ux,ay-uy);
  }
  function slidingRadii(pts, halfWinMeters, stepM){ const hw=Math.max(2,Math.round(halfWinMeters/(stepM||2))); const out=[]; for(let i=hw;i<pts.length-hw;i++){ out.push(circleRadius(pts[i-hw],pts[i],pts[i+hw])); } return out; }
  function percentile(arr,p){ if(!arr.length) return Infinity; const k=clamp(Math.floor((p/100)*arr.length),0,arr.length-1); const s=arr.slice().sort((a,b)=>a-b); return s[k]; }
  function radiusToSpeed(R,f,iDeg){ if(!Number.isFinite(R)||R<=0) return 0; const i=Math.tan((iDeg||0)*Math.PI/180); const a=(f+i)*g; return Math.sqrt(a*R)*3.6; }
  function speedRef(segs, fallback){ let lim=null; for(const s of segs){ const a=s.attributes||{}; const v=a.fwdMaxSpeed ?? a.revMaxSpeed ?? a.speedLimit ?? a.speed ?? null; if(v && v>0){ lim=v; break; } } return (lim && lim>0)? lim: fallback; }
  function classify(vSure,vRef,margin){ if(!vRef) return '—'; return (vSure + margin >= vRef) ? 'OK' : 'Dangereux'; }

  /* ===== Run (sélection seulement) ===== */
  async function run(){
    if(running) return; running=true;
    try{
      if(!ui||!ui.out){ running=false; return; }
      const segs=getSelSegs();
      if(!segs.length){
        ui.out.textContent='';
        setBadge('—','#eee','#333');
        running=false; return;
      }

      // params UI
      const p={ f:toNum(ui.f.value), iDeg:toNum(ui.i.value), step:clamp(toNum(ui.step.value)||2,.5,10), halfWin:clamp(toNum(ui.halfWin.value)||20,5,80), marginKmh:clamp(toNum(ui.margin.value)||10,0,50), vTargetKmh:clamp(toNum(ui.vtarget.value)||50,10,130), percentile:clamp(toNum(ui.percentile.value)||40,1,99) };

      // points sélection
      const all=[]; segs.forEach(s=>all.push(...segToPts(s)));
      if(all.length<3){ ui.out.textContent='Quasi-ligne droite (pas assez de points)'; setBadge('—','#eee','#333'); running=false; return; }

      // Densification adaptative (borne supérieure de points)
      let stepEff = p.step;
      const roughLen = all.reduce((L,p,i)=> i? L+Math.hypot(p[0]-all[i-1][0], p[1]-all[i-1][1]) : 0, 0);
      const targetPts = 20000;
      if(roughLen/stepEff > targetPts) stepEff = Math.max(p.step, roughLen/targetPts);

      const dens=densifyPath(all, stepEff);
      const radii=slidingRadii(dens,p.halfWin,stepEff);
      const finite=radii.filter(r=>Number.isFinite(r)&&r>0);
      const Rrob=percentile(finite,p.percentile);
      const vSure=radiusToSpeed(Rrob,p.f,p.iDeg);
      const vRef=speedRef(segs,p.vTargetKmh);
      const statut=classify(vSure,vRef,p.marginKmh);

      // badge + sortie
      if(statut==='OK'){ setBadge('OK','#e6f7ea','#0b7a2a'); }
      else if(statut==='Dangereux'){ setBadge('Dangereux','#fde8e8','#c00'); }
      else { setBadge('—','#eee','#333'); }

      ui.out.textContent = `Rmin robuste (P${fmt(toNum(ui.percentile.value),0)}): ${Number.isFinite(Rrob)? fmt(Rrob,0)+' m':'—'}\n`+
        `V sûre (f,i) : ${fmt(vSure,1)} km/h\n`+
        `V. de référence : ${vRef? fmt(vRef,0):'—'} km/h\n`+
        `Statut : ${statut}` + (stepEff!==p.step ? `\n(optimisation perf : pas=${fmt(stepEff,1)} m)` : '');
    } finally {
      running=false;
    }
  }

  function setBadge(text,bg,color){ headerBadge.textContent=text; headerBadge.style.background=bg; headerBadge.style.color=color; }

  function init(){
    buildPanel();
    hookSelection();
    console.log('[CSA] sélection simple prête (sans surlignage).');
  }

})();

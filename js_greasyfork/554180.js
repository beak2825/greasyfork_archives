// ==UserScript==
// @name         GGn Ghost Changer
// @namespace    https://greasyfork.org/users/1395131
// @version      1.1.1
// @description  Adds new image sets to replace the ghosts
// @author       Unknown
// @match        https://gazellegames.net/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554180/GGn%20Ghost%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/554180/GGn%20Ghost%20Changer.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
(function() {
  'use strict';

  const STORAGE_MODE = 'GGN_GHOST_MODE';
  const STORAGE_MAX  = 'GGN_GHOST_MAX';
  const STORAGE_OPT_OPEN = 'GGN_GHOST_OPTIONS_OPEN';
  const DEFAULT_MODE = 'boring';

  // --- image sets ---
  const TRICK_IMAGES = [
    "https://files.catbox.moe/p4bp1b.jpg", // Dyno uncolorized - OG: https://files.catbox.moe/ys00ua.jpg
    "https://files.catbox.moe/9q68l9.png", // Trollface dyno - OG: https://files.catbox.moe/d15d8a.png - modified transparent: https://files.catbox.moe/gpo6r8.png
    "https://files.catbox.moe/8up3nb.png", // Egg dyno - OG: https://files.catbox.moe/focdp1.png
    "https://files.catbox.moe/6sffbp.png", // Strongarm dyno - OG: https://files.catbox.moe/1320rs.png
    "https://files.catbox.moe/mi8w7f.png", // Stretching dyno - OG: https://files.catbox.moe/2in2ki.png
    "https://files.catbox.moe/q66ynn.png", // That man - OG: https://ptpimg.me/ceqss3.png
    "https://files.catbox.moe/od0k9x.jpg", // BugsBunnyHung - OG: https://files.catbox.moe/z3g8vp.jpg

  ];
  const TREAT_IMAGES = [
    "https://files.catbox.moe/cdq9lo.png", //happy cat gazelle thing - OG: https://files.catbox.moe/mnyvff.png
    "https://files.catbox.moe/6a33lc.png", // mr foxius the first - OG: https://files.catbox.moe/s8isqp.png
  ];
  const LABUBU_IMAGES  = [
    "https://files.catbox.moe/t5ff7n.png", // ShargBubu - OG: https://ptpimg.me/87y2i9.png
    "https://files.catbox.moe/ox2gdm.png", // FrankenBubu - OG: https://files.catbox.moe/bt724y.png
    "https://files.catbox.moe/d7k7si.png", // NightlordVivil2Bubu - OG: https://files.catbox.moe/3tutsf.png
    "https://files.catbox.moe/6o1evs.png", // HornetBubu - OG: https://files.catbox.moe/042j5l.png
    "https://files.catbox.moe/58c54z.png", // DirectorBubu - OG: https://files.catbox.moe/x6ohsc.png alt: https://files.catbox.moe/5snlyz.png
    "https://files.catbox.moe/cqxi3x.png", // ServerDownBubu - OG: https://files.catbox.moe/s6dem1.png
    "https://files.catbox.moe/062pvu.png", // McBubu - OG: https://files.catbox.moe/s6dem1.png
    "https://files.catbox.moe/lolxjm.png", // PlagueBubu - OG: https://files.catbox.moe/blelxw.png
    "https://files.catbox.moe/t2yiy7.png", // DoomBubu - OG: https://files.catbox.moe/0hfrkh.png
    "https://files.catbox.moe/489d6i.png", // GazelleBubu - OG: https://files.catbox.moe/aj9o63.png
    "https://files.catbox.moe/9se8x2.png", // MonopolyBubu - OG: https://files.catbox.moe/vfhkhv.png
    "https://files.catbox.moe/l710xh.png", // MarioBubu - OG: https://files.catbox.moe/mksd0j.png
    "https://files.catbox.moe/d17fqu.png", // GhostBubu - OG: https://files.catbox.moe/5t3q1s.png
    "https://files.catbox.moe/itdkbu.png", // AngyDinoBubu - OG: https://files.catbox.moe/g1j55g.png
    "https://files.catbox.moe/g88hu7.png", // VanitiesKittyBubu - OG: https://files.catbox.moe/eem8h3.png
    "https://files.catbox.moe/45euzl.png", // TonknannerBubu - OG: https://files.catbox.moe/y7uy50.png
    "https://files.catbox.moe/5bd1gb.png", // VelMeowBubu - OG: https://files.catbox.moe/a52z7l.png

  ];
  const SHARG_IMAGES   = [
    "https://files.catbox.moe/t5ff7n.png", // GamerSharg - OG: https://ptpimg.me/dq9473.png
    "https://files.catbox.moe/t5ff7n.png", // ShargBubu - OG: https://ptpimg.me/87y2i9.png
    "https://files.catbox.moe/2qu950.png", // Airplane Sharg - OG: https://ptpimg.me/1l2mwb.png
    "https://files.catbox.moe/b235pq.png", // PreBubu Sharg - OG: https://files.catbox.moe/bzj29v.png alt: https://files.catbox.moe/qorj60.png
    "https://files.catbox.moe/gui1lx.png", // Astronaut Sharg - OG: https://files.catbox.moe/kypwia.png
    "https://files.catbox.moe/2gmlfx.png", // Artist Sharg - OG: https://files.catbox.moe/xwh0yy.PNG
    "https://files.catbox.moe/4cdh2o.png", // DefinitelyNotSharg (Gazelle) - OG: https://files.catbox.moe/u2bje9.png
    "https://files.catbox.moe/8m7qy1.png", // Rocketlauncher Sharg - OG: https://files.catbox.moe/qsf74j.png
    "https://files.catbox.moe/ove2ri.png", // DancingDress Sharg - OG: https://files.catbox.moe/5wmnub.png
    "https://files.catbox.moe/vtqyyc.png", // IForgetButChemicalMaskAndroidSharg - OG: https://files.catbox.moe/bg6ovs.png
    "https://files.catbox.moe/3xsqxi.png", // BitchinHotrod Sharg - OG: https://files.catbox.moe/kkstgl.png
    "https://files.catbox.moe/pptpa9.png", // SleepyCat Sharg - OG: https://i.postimg.cc/rpB9kJQB/catsharg.png
    "https://files.catbox.moe/8ghmpm.png", // Chicken Sharg - OG: https://files.catbox.moe/exv584.png
    "https://files.catbox.moe/kfmxoo.png", // Banana Sharg - OG: https://files.catbox.moe/x1c9lr.png


  ];
  const RC_IMAGES = [
    "https://files.catbox.moe/uzcfc2.png", // RC Dragon - OG: https://files.catbox.moe/2dgzrs.png
    "https://files.catbox.moe/r7xinw.png", // Rev Raven - OG: https://files.catbox.moe/hjndu4.png
    "https://files.catbox.moe/08gndb.png", // Tonka - OG: https://files.catbox.moe/4wv98j.png alt: https://files.catbox.moe/gc5z93.png ORIGINAL OG: https://files.catbox.moe/ipqa6j.png
    "https://files.catbox.moe/4g7rjg.png", // Vanities - OG: https://files.catbox.moe/ni5p47.png OR https://files.catbox.moe/20tu9d.png OR https://files.catbox.moe/q2wb42.png
    "https://files.catbox.moe/i73io5.png", // NightlordVivil - OG: https://files.catbox.moe/2tl4jq.png
    "https://files.catbox.moe/j97aho.png", // Narwhal McBeanson - OG: https://files.catbox.moe/kmp6bl.png
    "https://files.catbox.moe/26q1th.png", // SleepingGiant - OG: https://files.catbox.moe/ibspjf.png
    "https://files.catbox.moe/q44n8a.png", // Sharg+Doom dolls scissor - OG: https://files.catbox.moe/vqhnk4.png
    "https://files.catbox.moe/sk7ejf.png", // DynoNuggies - OG: https://ptpimg.me/m3r345.png
    "https://files.catbox.moe/e2mkw4.png", // DynoTonky - OG: https://ptpimg.me/nd5349.png
    "https://files.catbox.moe/qhe0yp.png", // Fat Monopoly Man Wealth - OG: https://ptpimg.me/9v2r19.png
  ];

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const qs  = (sel, root=document) => root.querySelector(sel);

  let originals = [];
  let baselineCount = 0;
  let $btnBoring, $btnTrick, $btnTreat, $btnOptions;
  let $optionsRow, $maxInput;

  const SUMMON_CLASS = 'ggn-summoned-ghost';
  let summoned = []; // {el,img,moveRAF,turnTimer,fadeTimer,baseOpacity,x,y,vx,vy,speed,src}

  const getMode = () => localStorage.getItem(STORAGE_MODE) || DEFAULT_MODE;
  const setMode = (m) => localStorage.setItem(STORAGE_MODE, m);
  const getMax  = () => {
    const n = parseInt(localStorage.getItem(STORAGE_MAX) || '', 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const setMax  = (n) => localStorage.setItem(STORAGE_MAX, String(Math.max(0, n|0)));
  const isOptionsOpen = () => localStorage.getItem(STORAGE_OPT_OPEN) === '1';
  const setOptionsOpen = (open) => localStorage.setItem(STORAGE_OPT_OPEN, open ? '1' : '0');

  const collectGhostImgs = () => qsa('div[id^="ghost"] > img');
  const collectGhostDivs = () => qsa('div[id^="ghost"]');

  function snapshotOriginals() {
    const imgs = collectGhostImgs();
    originals = imgs.map(img => ({ img, src: img.src }));
    baselineCount = imgs.length;
  }

  function shuffled(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildSelection(pool, n) {
    if (!pool.length || n <= 0) return [];
    const sel = [];
    const base = shuffled(pool);
    for (let i = 0; i < base.length && sel.length < n; i++) sel.push(base[i]);
    while (sel.length < n) sel.push(pool[Math.floor(Math.random() * pool.length)]);
    return sel;
  }

  // (removed cloning/creation; we only show/hide among existing ghosts)

  function applyImageSet(pool, count=null) {
    if (!originals.length) snapshotOriginals();

    // Only use existing ghost containers
    const total = collectGhostDivs().length;
    const desired = Math.min(count ?? total, total);

    const imgs = collectGhostImgs();
    const picks = buildSelection(pool, desired);

    imgs.forEach((img, i) => {
      const visible = i < desired;
      img.parentElement.style.visibility = visible ? 'visible' : 'hidden';
      if (visible) img.src = picks[i % picks.length];
    });
  }

  function restoreOriginals(count=null) {
    if (!originals.length) snapshotOriginals();

    // Only use existing ghost containers
    const total = collectGhostDivs().length;
    const desired = Math.min(count ?? total, total);

    const imgs = collectGhostImgs();
    imgs.forEach((img,i)=>{
      const vis = i < desired;
      img.parentElement.style.visibility = vis?'visible':'hidden';
      img.src = originals[i % originals.length].src;
    });
  }

  function currentPool(mode) {
    return ({
      boring: null,
      trick: TRICK_IMAGES,
      treat: TREAT_IMAGES,
      labubu: LABUBU_IMAGES,
      sharg: SHARG_IMAGES,
      rc: RC_IMAGES
    })[mode] || null;
  }

  let prevMode = getMode();
  let chosenSrcs = []; // stable per mode

  function regenerate() {
    const mode = getMode();
    const siteCount = collectGhostDivs().length;
    const count = getMax() ?? (siteCount || 12);
    const pool = currentPool(mode);

    if (siteCount) {
      if (!pool) restoreOriginals(count); else applyImageSet(pool, count);
    }

    // If mode changed, rebuild the stable selection so all ghosts switch immediately
    if (mode !== prevMode) {
      chosenSrcs = [];
      prevMode = mode;
      // also update the "pressed" visual
      highlightActive(mode);
    }

    ensureSummoned(pool || (originals.length ? originals.map(o=>o.src) : TRICK_IMAGES), count);

    // keep input in sync
    if ($maxInput) {
      const saved = getMax();
      $maxInput.value = String(saved != null ? saved : (siteCount || 12));
    }
  }

  function findToolbar() {
    const all = qsa('a,button,span');
    const tb = all.find(e=>/toolbox/i.test(e.textContent));
    const rf = all.find(e=>/refresh data/i.test(e.textContent));
    const ref = rf || tb;
    return ref && { container: ref.parentElement, ref };
  }

  function inferClass() {
    const tb = findToolbar()?.ref;
    return tb?.className || 'button';
  }

  function mkBtn(label, click) {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = inferClass();
    b.style.marginLeft = '6px';
    b.addEventListener('click', click);
    return b;
  }

  function highlightActive(mode) {
    // reset all mode buttons
    qsa('[data-mode]').forEach(b => b.style.opacity = '1');
    const active = qs(`[data-mode="${mode}"]`);
    if (active) active.style.opacity='0.7';
  }

  function buildButtons() {
    const bar = findToolbar();
    if (!bar?.container) return;
    if (qs('#ghostWrap')) return;
    const wrap = document.createElement('span');
    wrap.id='ghostWrap';
    wrap.style.display='inline-flex';
    wrap.style.alignItems='center';
    wrap.style.marginLeft='8px';
    wrap.style.gap='6px';

    const makeModeBtn = (name, label) => {
      const b = mkBtn(label, ()=>{setMode(name);regenerate();});
      b.dataset.mode=name;
      return b;
    };
    $btnBoring=makeModeBtn('boring','Boring');
    $btnTrick=makeModeBtn('trick','Trick');
    $btnTreat=makeModeBtn('treat','Treat');

    $btnOptions=mkBtn(isOptionsOpen()?'▼':'▶',()=>{
      const o=!isOptionsOpen();
      setOptionsOpen(o);
      $btnOptions.textContent=o?'▼':'▶';
      if($optionsRow)$optionsRow.style.display=o?'inline-flex':'none';
    });

    wrap.append($btnBoring,$btnTrick,$btnTreat,$btnOptions);
    bar.ref.insertAdjacentElement('afterend',wrap);
    buildOptionsRow(wrap);
    // ensure correct pressed state on load
    highlightActive(getMode());
  }

  function buildOptionsRow(anchor){
    if($optionsRow)return;
    $optionsRow=document.createElement('span');
    $optionsRow.style.display=isOptionsOpen()?'inline-flex':'none';
    $optionsRow.style.alignItems='center';
    $optionsRow.style.gap='4px';                  // tighter
    $optionsRow.style.marginLeft='4px';           // tighter
    $optionsRow.style.borderLeft='none';          // remove big divider
    $optionsRow.style.paddingLeft='0';            // remove extra padding

    const makeExtra = (name,label)=>{
      const b=mkBtn(label,()=>{setMode(name);regenerate();});
      b.dataset.mode=name;
      return b;
    };
    const labubu=makeExtra('labubu','Labubu');
    const sharg=makeExtra('sharg','Sharg');
    const rc=makeExtra('rc','RC');

    const label=document.createElement('span');
    label.textContent='';

    const maxWrap=document.createElement('label');
    maxWrap.textContent='';
    $maxInput=document.createElement('input');
    $maxInput.type='number';
    $maxInput.min='0';
    $maxInput.step='1';
    $maxInput.style.width='5em';
    $maxInput.value=String(getMax()??(collectGhostDivs().length||12));
    $maxInput.addEventListener('change',()=>{
      const v=parseInt($maxInput.value||'0',10);
      if(!isNaN(v)&&v>=0){setMax(v);regenerate();}
    });
    maxWrap.append($maxInput);

    $optionsRow.append(labubu,sharg,rc,label,maxWrap);
    anchor.appendChild($optionsRow);
  }

  function observe() {
    const mo=new MutationObserver(()=>{buildButtons();regenerate();});
    mo.observe(document.body,{childList:true,subtree:true});
  }

  // ---------- artificial ghosts that scroll with the page (absolute) ----------
  function pageRect(){
    const de = document.documentElement;
    return {
      w: Math.max(de.scrollWidth,  de.clientWidth),
      h: Math.max(de.scrollHeight, de.clientHeight)
    };
  }
  function rand(min,max){ return Math.random()*(max-min)+min; }
  function rint(min,max){ return Math.floor(rand(min,max)); }

  function clampToPage(x,y,gw=120,gh=120){
    const {w,h} = pageRect();
    const m=8;
    return {
      x: Math.min(Math.max(m, x), Math.max(m, w - gw - m)),
      y: Math.min(Math.max(m, y), Math.max(m, h - gh - m))
    };
  }

  function hostForGhosts(){
    const host = document.createElement('div');
    host.id = 'ggn-summoned-host';
    const wrapper = document.getElementById('wrapper');
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.insertBefore(host, wrapper);
    } else {
      document.body.insertBefore(host, document.body.firstChild);
    }
    return host;
  }
  function ensureHost(){
    return document.getElementById('ggn-summoned-host') || hostForGhosts();
  }

  function ensureSummoned(pool, count){
    if (!pool || !pool.length) return;

    const host = ensureHost();

    // Rebuild stable src list if it is shorter than needed
    while (chosenSrcs.length < count){
      let candidate = pool[Math.floor(Math.random()*pool.length)];
      const used = new Set(chosenSrcs);
      let attempts = 0;
      while (used.has(candidate) && attempts++ < 20){
        candidate = pool[Math.floor(Math.random()*pool.length)];
      }
      chosenSrcs.push(candidate);
    }
    while (chosenSrcs.length > count){
      chosenSrcs.pop();
    }

    // Grow DOM to match
    while (summoned.length < chosenSrcs.length){
      const src = chosenSrcs[summoned.length];
      const g = createSummonedGhost(src);
      host.appendChild(g.el);
      setupWander(g);         // start smooth movement
      scheduleFadeCycle(g);   // visibility cycle uses baseOpacity
      summoned.push(g);
    }
    // Shrink DOM if needed
    while (summoned.length > chosenSrcs.length){
      const g = summoned.pop();
      if (g.moveRAF) cancelAnimationFrame(g.moveRAF);
      if (g.turnTimer) clearTimeout(g.turnTimer);
      if (g.fadeTimer) clearTimeout(g.fadeTimer);
      g.el.remove();
    }

    // Apply chosenSrcs immediately (mode switch) without reshuffling order
    for (let i=0;i<summoned.length;i++){
      const g = summoned[i];
      const want = chosenSrcs[i];
      if (g.img.src !== want) g.img.src = want;
    }
  }

  function createSummonedGhost(src){
    const el = document.createElement('div');
    el.className = SUMMON_CLASS;
    el.style.position = 'absolute';    // page-anchored, scrolls
    el.style.pointerEvents = 'none';
    el.style.zIndex = '1000';
    el.style.overflow = 'hidden';
    el.style.willChange = 'left, top, opacity';
    el.style.transition = 'opacity 4s linear';
    const baseOpacity = rand(0.5, 0.9);
    el.style.opacity = String(baseOpacity);

    const img = document.createElement('img');
    img.src = src;
    img.style.display='block';
    // native size (no width override)
    img.style.height = 'auto';
    img.style.filter = 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))';
    el.appendChild(img);

    // initial pos
    const {w:pw,h:ph} = pageRect();
    const iw = Math.max(120, img.naturalWidth || 120);
    const ih = Math.max(120, img.naturalHeight|| 120);
    const margin = 8;
    const x = rint(margin, Math.max(margin, pw - iw - margin));
    const y = rint(margin, Math.max(margin, ph - ih - margin));
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;

    img.addEventListener('load', ()=>{
      const gw = img.getBoundingClientRect().width  || iw;
      const gh = img.getBoundingClientRect().height || ih;
      const cl = clampToPage(parseFloat(el.style.left)||0, parseFloat(el.style.top)||0, gw, gh);
      el.style.left = cl.x + 'px';
      el.style.top  = cl.y + 'px';
    });

    return {el,img,moveRAF:null,turnTimer:null,fadeTimer:null,baseOpacity, x:x, y:y, vx:0, vy:0, speed:0, src};
  }

  // Smooth wandering with higher possible speeds
  function setupWander(g){
    // speed ~ 15–105 px/s (up to 3× the previous upper bound)
    g.speed = rand(15, 105);
    const angle = rand(0, Math.PI*2);
    g.vx = Math.cos(angle) * g.speed;
    g.vy = Math.sin(angle) * g.speed;

    let lastT = performance.now();

    function step(t){
      const dt = Math.max(0.008, Math.min(0.05, (t - lastT)/1000));
      lastT = t;

      const rect = g.img.getBoundingClientRect();
      const gw = Math.max(1, rect.width  || 120);
      const gh = Math.max(1, rect.height || 120);
      const {w,h} = pageRect();
      const m=8;

      // integrate
      g.x += g.vx * dt;
      g.y += g.vy * dt;

      // edge bounce
      if (g.x < m){ g.x = m; g.vx = Math.abs(g.vx)*0.98; }
      else if (g.x > w - gw - m){ g.x = w - gw - m; g.vx = -Math.abs(g.vx)*0.98; }

      if (g.y < m){ g.y = m; g.vy = Math.abs(g.vy)*0.98; }
      else if (g.y > h - gh - m){ g.y = h - gh - m; g.vy = -Math.abs(g.vy)*0.98; }

      // gentle random steering and mild speed wobble
      if (!g._nextTurn || t >= g._nextTurn){
        const maxTurn = (25 * Math.PI)/180;
        const dTheta = rand(-maxTurn, maxTurn);
        const curAng = Math.atan2(g.vy, g.vx);
        const newAng = curAng + dTheta;
        g.speed = Math.max(12, Math.min(120, g.speed * rand(0.95, 1.08)));
        g.vx = Math.cos(newAng) * g.speed;
        g.vy = Math.sin(newAng) * g.speed;
        g._nextTurn = t + rand(1000, 3000); // a touch more responsive
      }

      g.el.style.left = `${Math.round(g.x)}px`;
      g.el.style.top  = `${Math.round(g.y)}px`;

      g.moveRAF = requestAnimationFrame(step);
    }

    g.moveRAF = requestAnimationFrame(step);
  }

  // ~90% visible; hide >=4s; returns to baseOpacity
  function scheduleFadeCycle(g){
    function next(){
      const hideDur = rand(4000,8000);
      const visibleDur = hideDur * rand(8.5,10.5);
      setTimeout(()=>{
        g.el.style.opacity = '0';
        setTimeout(()=>{
          g.el.style.opacity = String(g.baseOpacity);
          next();
        }, hideDur);
      }, visibleDur);
    }
    next();
  }

  (async function init(){
    for(let i=0;i<20;i++){
      if(findToolbar()?.container) break;
      await sleep(200);
    }
    snapshotOriginals();
    buildButtons();
    regenerate();
    observe();

    if (!document.getElementById('ggn-summoned-style')) {
      const s = document.createElement('style');
      s.id = 'ggn-summoned-style';
      s.textContent = `
        .${SUMMON_CLASS} img {
          image-rendering: auto;
          user-select: none;
          -webkit-user-drag: none;
        }
      `;
      document.head.appendChild(s);
    }

    const ro = new ResizeObserver(()=> {
      const {w,h} = pageRect();
      const m=8;
      for (const g of summoned){
        const rect = g.img.getBoundingClientRect();
        const gw = Math.max(1, rect.width  || 120);
        const gh = Math.max(1, rect.height || 120);
        g.x = Math.min(Math.max(m, g.x), Math.max(m, w - gw - m));
        g.y = Math.min(Math.max(m, g.y), Math.max(m, h - gh - m));
        g.el.style.left = `${Math.round(g.x)}px`;
        g.el.style.top  = `${Math.round(g.y)}px`;
      }
    });
    ro.observe(document.documentElement);
  })();
})();

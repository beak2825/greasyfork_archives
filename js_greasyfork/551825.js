// ==UserScript==
// @name         Instagram Unhook
// @namespace    instagram-unhook
// @version      1.2
// @description  A userscript to help people escape Instagram addiction. After installation, a small gear icon will appear on Instagram in the bottom right corner. There, you can set various tools/schedules to reduce your exposure to the algorithm. Currently, you can enable/disable messaging, a chronological/algorithmic feed, and instagram stories, and you can disable the blocker entirely. You can also set a schedule for working hours to have certain features appear and dissapear. Best of luck and fuck you Meta!
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT-0
// @downloadURL https://update.greasyfork.org/scripts/551825/Instagram%20Unhook.user.js
// @updateURL https://update.greasyfork.org/scripts/551825/Instagram%20Unhook.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ───────── GM poly + helpers ───────── */
  const GM = (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') ? {
    get: (k, v) => { try { return GM_getValue(k, v); } catch { return v; } },
    set: (k, v) => { try { GM_setValue(k, v); } catch {} },
    addStyle: (css) => { try { GM_addStyle(css); } catch { const el = document.createElement('style'); el.textContent = css; document.documentElement.appendChild(el); } },
    registerMenu: (label, fn) => { try { GM_registerMenuCommand(label, fn); } catch {} },
  } : {
    get: (k, v) => { try { return JSON.parse(localStorage.getItem(k)) ?? v; } catch { return v; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    addStyle: (css) => { const el = document.createElement('style'); el.textContent = css; document.documentElement.appendChild(el); },
    registerMenu: () => {},
  };

  const now = () => new Date();
  const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
  const pad2 = (n)=>String(n).padStart(2,'0');
  const hhmmToMins = (s)=>{const m=/^(\d{1,2}):(\d{2})$/.exec(String(s).trim()); if(!m) return 0; return clamp(+m[1],0,23)*60+clamp(+m[2],0,59);};
  const dayOfWeek = (d=new Date())=>{const n=d.getDay(); return n===0?7:n;};

  const sameOrigin=(u)=>{ try{return new URL(u,location.origin).origin===location.origin;}catch{return false;} };
  const pathOf=(u)=>{ try{return new URL(u,location.origin).pathname;}catch{return '';} };

  const isRoot = ()=>location.pathname==='/';
  const onFollowing = ()=>location.search.startsWith('?variant=following');
  const isDMPath = (p=location.pathname)=>p.startsWith('/direct');
  const isLoginFlowPath = (p=location.pathname)=>/^\/(accounts|challenge|oauth)(\/|$)/.test(p);

  const DM_INBOX_URL='https://www.instagram.com/direct/inbox/';
  const FOLLOWING_URL='https://www.instagram.com/?variant=following';
  const STORY_FLAG_SS='iuStoriesOnly'; // per-tab only
  const STORY_HASH   ='#iu_so';
  const ALLOW_LOGIN_FLOWS = true;

  /* ───────── Settings ───────── */
  const SETTINGS_KEY='iu_settings_v2';
  const DEFAULTS={
    version:2,
    debug:true,
    persistOverrideAcrossSessions:true,
    schedule:{
      weekdays:{ rangeStart:'09:00', rangeEnd:'19:00',
        inRange:{messages:true,chronological:false,stories:false,unrestricted:false},
        outRange:{messages:true,chronological:true,stories:true,unrestricted:false} },
      weekends:{ rangeStart:'00:00', rangeEnd:'00:00',
        inRange:{messages:true,chronological:true,stories:true,unrestricted:false},
        outRange:{messages:true,chronological:true,stories:true,unrestricted:false} },
    },
    override:{active:false,features:{messages:false,chronological:false,stories:false,unrestricted:false},expiresAt:null},
  };
  let settings=(function(){const s=GM.get(SETTINGS_KEY,null); if(!s||s.version!==DEFAULTS.version){GM.set(SETTINGS_KEY,DEFAULTS); return JSON.parse(JSON.stringify(DEFAULTS));} return s;})();
  function saveSettings(){ GM.set(SETTINGS_KEY,settings); }

  /* ───────── Debug ───────── */
  const dbg = {
    on: !!settings.debug,
    log(tag, msg, extra){ if(!this.on) return; try{ console.log(`[IU] ${tag} :: ${msg}`, extra??''); }catch{} },
    group(tag, obj){ if(!this.on) return; try{ console.groupCollapsed(`[IU] ${tag}`); if(obj) console.log(obj); console.groupEnd(); }catch{} }
  };
  window.IU = {
    version:'1.1.3',
    get settings(){return JSON.parse(JSON.stringify(settings));},
    state(){return {features: current.features, nextBoundary: current.nextBoundary};},
    toggleDebug(on){settings.debug=!!on; saveSettings(); dbg.on=settings.debug; console.info('[IU] debug', dbg.on?'ENABLED':'disabled');},
    setOverride(f){const exp=computeNextSwitchTime(); settings.override={active:true,features:f,expiresAt:exp.toISOString()}; saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=exp; applyPolicyForLocation(); dbg.group('IU.setOverride',{f,exp});},
    clearOverride(){settings.override.active=false; settings.override.expiresAt=null; saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=computeNextSwitchTime(); applyPolicyForLocation(); dbg.group('IU.clearOverride');},
    forceApply(){applyPolicyForLocation(); dbg.group('IU.forceApply');}
  };

  /* ───────── Stories intent (per-tab) ───────── */
  const setSOIntent = ()=>{ try{ sessionStorage.setItem(STORY_FLAG_SS,'1'); }catch{} };
  const inSO        = ()=> sessionStorage.getItem(STORY_FLAG_SS)==='1';
  const clearSOIntent = ()=>{ try{ sessionStorage.removeItem(STORY_FLAG_SS); }catch{} };
  const hasAndConsumeSOFromURL = ()=>{ if (location.hash===STORY_HASH){ history.replaceState(history.state,'',location.pathname+location.search); return true; } return false; };
  const consumeSOIntent = ()=>{ const s=inSO() || hasAndConsumeSOFromURL(); if(s) sessionStorage.setItem(STORY_FLAG_SS,'1'); return s; };
  let lastSOJump = 0;

  /* ───────── Scheduler ───────── */
  const isWeekend=(n)=>n===6||n===7;
  const cloneF=(f)=>({messages:!!f.messages,chronological:!!f.chronological,stories:!!f.stories,unrestricted:!!f.unrestricted});
  const eqF=(a,b)=>a.messages===b.messages && a.chronological===b.chronological && a.stories===b.stories && !!a.unrestricted===!!b.unrestricted;

  function normalizeRangesForDay(kind){
    const conf=settings.schedule[kind];
    const s=hhmmToMins(conf.rangeStart), e=hhmmToMins(conf.rangeEnd);
    const inR=cloneF(conf.inRange), outR=cloneF(conf.outRange);
    if(s===e) return [{start:0,end:1440,f:outR}];
    if(s<e) return [{start:0,end:s,f:outR},{start:s,end:e,f:inR},{start:e,end:1440,f:outR}];
    return [{start:0,end:e,f:inR},{start:e,end:s,f:outR},{start:s,end:1440,f:inR}];
  }
  function getScheduledFAt(d=new Date()){
    const dn=dayOfWeek(d), mins=d.getHours()*60+d.getMinutes(), kind=isWeekend(dn)?'weekends':'weekdays';
    const blocks=normalizeRangesForDay(kind);
    let f=blocks.find(b=>mins>=b.start&&mins<b.end)?.f; if(!f) f=blocks[blocks.length-1].f; return cloneF(f);
  }
  function getActiveFeatures(){
    if(settings.override?.active){
      const exp=settings.override.expiresAt?new Date(settings.override.expiresAt):null;
      if(!exp || now()<exp) return cloneF(settings.override.features);
      settings.override.active=false; settings.override.expiresAt=null; saveSettings(); dbg.log('Override','expired');
    }
    return getScheduledFAt();
  }
  function getNextBoundaryAfter(d=new Date()){
    const start=new Date(d.getTime()); const curr=getScheduledFAt(start);
    for(let i=0;i<8;i++){
      const day=new Date(start.getTime()); day.setDate(start.getDate()+i);
      const kind=isWeekend(dayOfWeek(day))?'weekends':'weekdays';
      for(const b of normalizeRangesForDay(kind)){
        const t=new Date(day.getFullYear(),day.getMonth(),day.getDate(),Math.floor(b.start/60),b.start%60,0,0);
        if(t<=d) continue;
        if(!eqF(getScheduledFAt(t), curr)) return t;
      }
    }
    const fb=new Date(d.getTime()+86400000); fb.setSeconds(0,0); return fb;
  }
  function computeNextSwitchTime(){ return getNextBoundaryAfter(now()); }

  /* ───────── Current state & timers ───────── */
  let current={ features:getActiveFeatures(), nextBoundary:computeNextSwitchTime() };
  dbg.group('Startup', current);

  let boundaryTimer=null;
  function scheduleTick(){
    if(boundaryTimer) clearTimeout(boundaryTimer);
    const ms=Math.max(1000, Math.min(86400000, current.nextBoundary - now()));
    boundaryTimer=setTimeout(()=>{
      current.features=getActiveFeatures(); current.nextBoundary=computeNextSwitchTime();
      dbg.group('Boundary tick', current);
      applyPolicyForLocation();
      toast(`Instagram Unhook → ${describeF(current.features)} (until ${fmtTime(current.nextBoundary)})`);
      scheduleTick(); refreshUI();
    }, ms);
  }
  const fmtTime=(d)=>{const dd=new Date(d); return `${dd.toLocaleDateString()} ${pad2(dd.getHours())}:${pad2(dd.getMinutes())}`;};
  function describeF(f){ if(f.unrestricted) return 'Unrestricted (Reels allowed)'; const p=[]; if(f.messages)p.push('Messages'); if(f.chronological)p.push('Chronological'); if(f.stories)p.push('Stories'); return p.join(' + ')||'No features'; }

  /* ───────── Access policy (allow comments/post detail; safe Stories viewer) ───────── */
  const isPostDetail = (p) => /^\/p\/[^/]+/.test(p);
  const isStoriesViewer = (p) => /^\/stories(\/|$)/.test(p);
  const isReelsPath = (p) => /^\/reels(\/|$)/.test(p);

  function checkAccess(f, p=location.pathname){
    if (f.unrestricted) return {allowed:true, reason:'unrestricted'};
    if (isDMPath(p)) return {allowed:true, reason:'dm'};
    if (ALLOW_LOGIN_FLOWS && isLoginFlowPath(p)) return {allowed:true, reason:'login'};
    if ((f.chronological || f.stories) && isPostDetail(p)) return {allowed:true, reason:'post-detail'}; // NEW
    if (f.stories && isStoriesViewer(p)) return {allowed:true, reason:'stories-viewer'}; // NEW

    const hybrid = f.messages && (f.chronological || f.stories);
    if (hybrid) {
      if (p === '/') return {allowed:true, reason:'hybrid-home'};
      if (isReelsPath(p)) return {allowed:true, reason:'reels-mapping'};
      return {allowed:false, reason:'hybrid-block-nonhome'};
    }
    if (f.messages && !hybrid) return {allowed:false, reason:'pure-messages'};
    return {allowed:true, reason:'default-allow'};
  }
  const landingForHybrid = (f)=> f.chronological ? FOLLOWING_URL : '/';

  /* ───────── CSS ───────── */
  GM.addStyle(`
    .iu-block-all body { opacity:0 !important; pointer-events:none !important; }
    .iu-stories-only main article { display:none !important; }
    .iu-toast{position:fixed;z-index:2147483647;left:50%;transform:translateX(-50%);bottom:24px;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 6px 30px rgba(0,0,0,.35);opacity:.95;max-width:calc(100vw - 28px);text-align:center;}
    .iu-gear{position:fixed;z-index:2147483647;right:max(18px, env(safe-area-inset-right,18px));bottom:max(18px, env(safe-area-inset-bottom,18px));width:40px;height:40px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 30px rgba(0,0,0,.35);}
    .iu-panel-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:2147483646;}
    .iu-panel{position:fixed;right:max(20px, env(safe-area-inset-right,20px));bottom:max(70px, env(safe-area-inset-bottom,70px));width:360px;max-width:min(420px, calc(100vw - 32px));background:#fff;color:#111;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.25);padding:16px;z-index:2147483647;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-sizing:border-box;}
    .iu-panel *{box-sizing:border-box}
    .iu-row{display:flex;gap:8px;align-items:center;margin:6px 0;flex-wrap:wrap}
    .iu-sec{border-top:1px solid #eee;margin-top:10px;padding-top:10px}
    .iu-h{font-weight:700;font-size:14px;margin-bottom:6px}
    .iu-muted{opacity:.5;pointer-events:none}
    .iu-panel .iu-btn{all:unset;display:inline-block;padding:6px 10px;border-radius:8px;border:1px solid #ddd;background:#fafafa;cursor:pointer;white-space:nowrap;font:13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif !important;color:#111 !important;-webkit-appearance:none;appearance:none}
    .iu-panel .iu-btn.primary{background:#111;border-color:#111;color:#fff !important}
    .iu-grid{display:grid;grid-template-columns:auto 1fr;gap:6px 10px}
    .iu-note{color:#666;font-size:12px}
    .iu-kbd{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#f1f1f1;padding:1px 4px;border-radius:4px;border:1px solid #ddd}
  `);

  /* ───────── Early enforcement (ordered) ───────── */
  if (!getActiveFeatures().stories && sessionStorage.getItem(STORY_FLAG_SS)) {
    dbg.log('Early','Clearing stories intent (Stories OFF)');
    clearSOIntent();
  }

  if (!current.features.unrestricted && /^\/reels(\/|$)/.test(location.pathname)) {
    dbg.log('Early','Reels path → stories intent home');
    setSOIntent(); location.replace('/' + STORY_HASH);
  }

  {
    const chk = checkAccess(current.features, location.pathname);
    dbg.log('Early-Access', `${chk.allowed?'allow':'BLOCK'} @${location.pathname}`, chk.reason);
    if (!chk.allowed) {
      document.documentElement.classList.add('iu-block-all');
      const f=current.features;
      if (f.messages && !(f.chronological||f.stories)) {
        if (location.href !== DM_INBOX_URL) location.replace(DM_INBOX_URL);
      } else {
        const dest = landingForHybrid(f);
        if (location.href !== dest) location.replace(dest);
      }
    }
  }

  if (!current.features.unrestricted && current.features.chronological && isRoot() && !onFollowing()) {
    if (current.features.stories) {
      if (!inSO() && !hasAndConsumeSOFromURL()) {
        dbg.log('Early','Chrono+Stories but no intent → Following');
        location.replace(FOLLOWING_URL);
      }
    } else {
      if (inSO()) { dbg.log('Early','Chrono only → clear stories intent'); clearSOIntent(); }
      dbg.log('Early','Chrono only → Following');
      location.replace(FOLLOWING_URL);
    }
  }

  /* ───────── Nav enforcement ───────── */
  function gotoDM(reason=''){ try{sessionStorage.setItem('iu_reason',reason);}catch{} if(location.href!==DM_INBOX_URL) location.replace(DM_INBOX_URL); }
  const blockContent=(on)=>document.documentElement.classList.toggle('iu-block-all',!!on);
  const applySOClass=(on)=>document.documentElement.classList.toggle('iu-stories-only',!!on);

  function wireAnchors(root=document){
    root.querySelectorAll('a[href]:not([data-iu-wired])').forEach(a=>{
      a.dataset.iuWired='1';
      a.addEventListener('click',(ev)=>{
        const href=a.getAttribute('href')||''; if(!href||!sameOrigin(href)) return;
        const p=pathOf(href); const f=current.features;

        // Reels inside DMs: block in-place (no nav) unless Unrestricted
        if (!f.unrestricted && isDMPath(location.pathname) && /^\/reels(\/|$)/.test(p)) {
          ev.preventDefault(); ev.stopImmediatePropagation();
          toast('Reels blocked in Messages (enable Unrestricted to view)');
          dbg.log('Anchor','Reels in DM → blocked in place');
          return;
        }

        // Access control
        const chk = checkAccess(f, p);
        if (!chk.allowed) {
          ev.preventDefault(); ev.stopImmediatePropagation();
          dbg.log('Anchor','BLOCK', {p, reason: chk.reason});
          if (f.messages && !(f.chronological||f.stories)) { blockContent(true); gotoDM(`click:${p}`); }
          else { location.assign(landingForHybrid(f)); }
          return;
        }

        // Home behavior
        if (!f.unrestricted && p==='/') {
          ev.preventDefault(); ev.stopImmediatePropagation();
          if (f.chronological) {
            clearSOIntent(); applySOClass(false);
            dbg.log('Anchor','Home → Following (chronological preferred)');
            location.assign(FOLLOWING_URL);
          } else if (f.stories) {
            setSOIntent(); applySOClass(true);
            dbg.log('Anchor','Home → stories-only');
            location.assign('/');
          } else {
            dbg.log('Anchor','Home pass-through');
            location.assign('/');
          }
          return;
        }

        // Global Reels mapping (non-DM contexts)
        if (!f.unrestricted && /^\/reels(\/|$)/.test(p)) {
          ev.preventDefault(); ev.stopImmediatePropagation();
          const t = Date.now();
          if (t - lastSOJump > 800) {
            lastSOJump = t;
            dbg.log('Anchor','Reels → stories intent');
            setSOIntent(); location.assign('/'+STORY_HASH);
          } else {
            dbg.log('Anchor','Reels mapping throttled');
          }
          return;
        }
      }, {capture:true});
    });
  }

  wireAnchors();
  const bigMO=new MutationObserver(m=>{ for(const rec of m) for(const n of rec.addedNodes||[]) if(n.nodeType===1){ wireAnchors(n); relabelAndInterceptReels(!current.features.unrestricted); } });
  bigMO.observe(document.documentElement,{childList:true,subtree:true});

  (function hookHistory(){
    const wrap=(fn)=>function(...args){ const rv=fn.apply(this,args); queueMicrotask(()=>{ dbg.log('History',`${fn.name} → policy`); applyPolicyForLocation(); }); return rv; };
    history.pushState=wrap(history.pushState.bind(history));
    history.replaceState=wrap(history.replaceState.bind(history));
  })();
  window.addEventListener('popstate',()=>{ dbg.log('History','popstate → policy'); applyPolicyForLocation(); });
  window.addEventListener('DOMContentLoaded',()=>{ buildUI(); refreshUI(); });

  /* ───────── Per-location policy ───────── */
  function applyPolicyForLocation(){
    const f=current.features;
    dbg.group('ApplyPolicy', {path: location.pathname+location.search+location.hash, features: f, inSO: inSO()});

    if (!f.stories && inSO()) { dbg.log('Policy','Stories OFF → clear intent'); clearSOIntent(); applySOClass(false); }

    const chk = checkAccess(f);
    dbg.log('Policy-Access', `${chk.allowed?'allow':'BLOCK'}`, chk.reason);
    if (!chk.allowed) {
      if (f.messages && !(f.chronological||f.stories)) { blockContent(true); gotoDM(`policy:${location.pathname}`); return; }
      location.replace(landingForHybrid(f)); return;
    } else { blockContent(false); }

    if (!f.unrestricted && isRoot()) {
      if (f.stories && !onFollowing()) {
        const so = consumeSOIntent();
        if (so || inSO()) { applySOClass(true); startSOHiding(); dbg.log('Policy','stories-only on Home'); }
        else if (f.chronological) { applySOClass(false); dbg.log('Policy','chronological preferred on Home → Following'); location.replace(FOLLOWING_URL); return; }
        else { applySOClass(false); }
      } else if (f.chronological && !onFollowing()) {
        applySOClass(false); clearSOIntent();
        dbg.log('Policy','chronological only → Following'); location.replace(FOLLOWING_URL); return;
      } else { applySOClass(false); }
    } else { applySOClass(false); }

    relabelAndInterceptReels(!f.unrestricted);
  }

  /* ───────── Stories-only hider ───────── */
  let soObserver=null;
  function hidePostsOnce(){ if(!document.documentElement.classList.contains('iu-stories-only')) return;
    document.querySelectorAll('main article').forEach(el=>{ if(el.dataset.iuHidden) return; el.dataset.iuHidden='1'; el.style.display='none'; el.setAttribute('aria-hidden','true'); });
  }
  function startSOHiding(){ hidePostsOnce(); if(soObserver||!document.body) return; soObserver=new MutationObserver(()=>{ if(inSO()) hidePostsOnce(); }); soObserver.observe(document.body,{childList:true,subtree:true}); }
  function stopSOHiding(){ if(soObserver){ soObserver.disconnect(); soObserver=null; } document.querySelectorAll('main article[data-iu-hidden="1"]').forEach(el=>{ el.style.display=''; el.removeAttribute('aria-hidden'); delete el.dataset.iuHidden; }); }

  /* ───────── Reels → Stories label/mapping ───────── */
  function setAnchorLabel(a, text){
    let touched=false;
    const leaf=[...a.querySelectorAll('span,div')].find(n=>n.childElementCount===0 && /\S/.test(n.textContent));
    if(leaf){ leaf.textContent=text; touched=true; }
    if(a.getAttribute('aria-label')){ a.setAttribute('aria-label',text); touched=true; }
    const svg=a.querySelector('svg'); if(svg){ svg.setAttribute('aria-label',text); const t=svg.querySelector('title'); if(t) t.textContent=text; touched=true; }
    return touched;
  }
  function relabelAndInterceptReels(enableMapping){
    const root=document;

    root.querySelectorAll('a[href^="/reels"]:not([data-iu-wired-reels])').forEach(a=>{
      a.dataset.iuWiredReels='1';
      a.addEventListener('click',(ev)=>{ if(enableMapping && !isDMPath(location.pathname)){ ev.preventDefault(); ev.stopImmediatePropagation(); const t=Date.now(); if(t-lastSOJump>800){ lastSOJump=t; dbg.log('Reels','icon link → stories intent'); setSOIntent(); location.assign('/'+STORY_HASH);} } }, {capture:true});
    });
    root.querySelectorAll('a[href^="/reels"]:not([data-iu-wired-reels-text])').forEach(a=>{
      if(a.querySelector('svg')) return;
      a.dataset.iuWiredReelsText='1';
      a.addEventListener('click',(ev)=>{ if(enableMapping && !isDMPath(location.pathname)){ ev.preventDefault(); ev.stopImmediatePropagation(); const t=Date.now(); if(t-lastSOJump>800){ lastSOJump=t; dbg.log('Reels','text link → stories intent'); setSOIntent(); location.assign('/'+STORY_HASH);} } }, {capture:true});
    });

    root.querySelectorAll('a[href^="/reels"]').forEach(a=>{
      if(enableMapping){ if(a.dataset.iuLabeled!=='1'){ if(setAnchorLabel(a,'Stories')){ a.dataset.iuLabeled='1'; dbg.log('Reels','Relabeled'); } } }
      else { if(a.dataset.iuLabeled==='1'){ setAnchorLabel(a,'Reels'); a.dataset.iuLabeled=''; } }
    });
  }

  /* ───────── Toast & UI ───────── */
  let toastTimer=null;
  function toast(msg,dur=2500){ try{ const old=document.querySelector('.iu-toast'); if(old) old.remove(); const t=document.createElement('div'); t.className='iu-toast'; t.textContent=msg; document.documentElement.appendChild(t); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.remove(),dur); }catch{} }

  let gearBtn=null, panel=null, backdrop=null;
  function buildUI(){
    gearBtn=document.createElement('div'); gearBtn.className='iu-gear'; gearBtn.title='Instagram Unhook settings (Alt+U)'; gearBtn.innerHTML='⚙️';
    gearBtn.addEventListener('click',openPanel); document.documentElement.appendChild(gearBtn);
    window.addEventListener('keydown',(e)=>{ if(e.altKey&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='u'){ e.preventDefault(); openPanel(); }});
    GM.registerMenu('Instagram Unhook: Open settings', openPanel);
  }
  function openPanel(){
    if(panel){ refreshUI(); return; }
    backdrop=document.createElement('div'); backdrop.className='iu-panel-backdrop'; backdrop.addEventListener('click', closePanel);
    panel=document.createElement('div'); panel.className='iu-panel';
    panel.innerHTML=`
      <div class="iu-h">Instagram Unhook</div>
      <div class="iu-grid"><div>Current:</div><div id="iu-cur"></div><div>Next switch:</div><div id="iu-next"></div></div>
      <div class="iu-sec">
        <div class="iu-h">Override (until next boundary)</div>
        <div class="iu-row">
          <button id="iu-ovr-none" class="iu-btn">Clear override</button>
          <button id="iu-ovr-unr" class="iu-btn">Unrestricted</button>
          <label><input type="checkbox" id="iu-ovr-msg"> Messages</label>
          <label><input type="checkbox" id="iu-ovr-chron"> Chronological</label>
          <label><input type="checkbox" id="iu-ovr-sto"> Stories</label>
          <button id="iu-ovr-apply" class="iu-btn primary">Apply</button>
        </div>
        <div class="iu-row">
          <label><input type="checkbox" id="iu-ovr-persist"> Persist override across sessions</label>
          <label><input type="checkbox" id="iu-debug"> Enable debug logging</label>
        </div>
        <div class="iu-note">Enabling <b>Unrestricted</b> allows Reels and disables all protections.</div>
      </div>
      <div class="iu-sec">
        <div class="iu-h">Schedule — Weekdays</div>
        <div class="iu-row"><span>In-range:</span><input id="iu-wd-start" type="time" step="60" style="width:110px"><span>to</span><input id="iu-wd-end" type="time" step="60" style="width:110px"></div>
        <div id="iu-wd-in" class="iu-row"><span>Features in-range:</span>
          <label><input type="checkbox" id="iu-wd-in-msg"> Messages</label>
          <label><input type="checkbox" id="iu-wd-in-chron"> Chronological</label>
          <label><input type="checkbox" id="iu-wd-in-sto"> Stories</label>
        </div>
        <div id="iu-wd-out" class="iu-row"><span>Features out-of-range:</span>
          <label><input type="checkbox" id="iu-wd-out-msg"> Messages</label>
          <label><input type="checkbox" id="iu-wd-out-chron"> Chronological</label>
          <label><input type="checkbox" id="iu-wd-out-sto"> Stories</label>
        </div>
      </div>
      <div class="iu-sec">
        <div class="iu-h">Schedule — Weekends</div>
        <div class="iu-row"><span>In-range:</span><input id="iu-we-start" type="time" step="60" style="width:110px"><span>to</span><input id="iu-we-end" type="time" step="60" style="width:110px"></div>
        <div id="iu-we-in" class="iu-row"><span>Features in-range:</span>
          <label><input type="checkbox" id="iu-we-in-msg"> Messages</label>
          <label><input type="checkbox" id="iu-we-in-chron"> Chronological</label>
          <label><input type="checkbox" id="iu-we-in-sto"> Stories</label>
        </div>
        <div id="iu-we-out" class="iu-row"><span>Features out-of-range:</span>
          <label><input type="checkbox" id="iu-we-out-msg"> Messages</label>
          <label><input type="checkbox" id="iu-we-out-chron"> Chronological</label>
          <label><input type="checkbox" id="iu-we-out-sto"> Stories</label>
        </div>
        <div class="iu-note" id="iu-we-note" style="display:none">Note: Start = End → full-day uses <b>Out-of-range</b>; In-range is inactive.</div>
      </div>
      <div class="iu-sec iu-row" style="justify-content:space-between">
        <button id="iu-save" class="iu-btn primary">Save</button>
        <button id="iu-reset" class="iu-btn">Reset to defaults</button>
        <span class="iu-note">Tip: open with <span class="iu-kbd">Alt+U</span></span>
      </div>`;
    document.documentElement.appendChild(backdrop);
    document.documentElement.appendChild(panel);

    panel.querySelector('#iu-ovr-none').addEventListener('click', ()=>{ settings.override.active=false; settings.override.expiresAt=null; saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=computeNextSwitchTime(); applyPolicyForLocation(); refreshUI(); toast('Override cleared'); });
    panel.querySelector('#iu-ovr-unr').addEventListener('click', ()=>{ if(!confirm('Enable Unrestricted? Reels will be available and protections disabled until the next scheduled boundary.')) return; const exp=computeNextSwitchTime(); settings.override={active:true,features:{messages:false,chronological:false,stories:false,unrestricted:true},expiresAt:exp.toISOString()}; saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=exp; applyPolicyForLocation(); refreshUI(); toast('Unrestricted ON'); });
    panel.querySelector('#iu-ovr-apply').addEventListener('click', ()=>{ const f={messages:panel.querySelector('#iu-ovr-msg').checked, chronological:panel.querySelector('#iu-ovr-chron').checked, stories:panel.querySelector('#iu-ovr-sto').checked, unrestricted:false}; const exp=computeNextSwitchTime(); settings.override={active:true,features:f,expiresAt:exp.toISOString()}; saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=exp; applyPolicyForLocation(); refreshUI(); toast(`Override: ${describeF(f)}`); });
    panel.querySelector('#iu-ovr-persist').addEventListener('change',(e)=>{ settings.persistOverrideAcrossSessions=!!e.target.checked; saveSettings(); });
    panel.querySelector('#iu-debug').addEventListener('change',(e)=>{ settings.debug=!!e.target.checked; saveSettings(); dbg.on=settings.debug; console.info('[IU] debug', dbg.on?'ENABLED':'disabled'); });

    panel.querySelector('#iu-save').addEventListener('click', ()=>{
      const S=settings.schedule;
      S.weekdays.rangeStart=panel.querySelector('#iu-wd-start').value||'09:00';
      S.weekdays.rangeEnd  =panel.querySelector('#iu-wd-end').value  ||'19:00';
      S.weekdays.inRange   ={messages:panel.querySelector('#iu-wd-in-msg').checked, chronological:panel.querySelector('#iu-wd-in-chron').checked, stories:panel.querySelector('#iu-wd-in-sto').checked, unrestricted:false};
      S.weekdays.outRange  ={messages:panel.querySelector('#iu-wd-out-msg').checked, chronological:panel.querySelector('#iu-wd-out-chron').checked, stories:panel.querySelector('#iu-wd-out-sto').checked, unrestricted:false};
      S.weekends.rangeStart=panel.querySelector('#iu-we-start').value||'00:00';
      S.weekends.rangeEnd  =panel.querySelector('#iu-we-end').value  ||'00:00';
      S.weekends.inRange   ={messages:panel.querySelector('#iu-we-in-msg').checked, chronological:panel.querySelector('#iu-we-in-chron').checked, stories:panel.querySelector('#iu-we-in-sto').checked, unrestricted:false};
      S.weekends.outRange  ={messages:panel.querySelector('#iu-we-out-msg').checked, chronological:panel.querySelector('#iu-we-out-chron').checked, stories:panel.querySelector('#iu-we-out-sto').checked, unrestricted:false};
      saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=computeNextSwitchTime(); applyPolicyForLocation(); refreshUI(); toast('Schedule saved'); });

    panel.querySelector('#iu-reset').addEventListener('click', ()=>{ if(!confirm('Reset to defaults?')) return; settings=JSON.parse(JSON.stringify(DEFAULTS)); saveSettings(); current.features=getActiveFeatures(); current.nextBoundary=computeNextSwitchTime(); applyPolicyForLocation(); refreshUI(); toast('Defaults restored'); });

    [['#iu-wd-start','#iu-wd-end','#iu-wd-in',null], ['#iu-we-start','#iu-we-end','#iu-we-in','#iu-we-note']].forEach(([sId,eId,inId,noteId])=>{
      const s=panel.querySelector(sId), e=panel.querySelector(eId), row=panel.querySelector(inId), note=noteId?panel.querySelector(noteId):null;
      const up=()=>{ const same=(s.value||'00:00')===(e.value||'00:00'); row.classList.toggle('iu-muted',same); if(note) note.style.display=same?'':'none'; };
      s.addEventListener('input',up); e.addEventListener('input',up);
    });

    refreshUI();
  }
  function closePanel(){ if(panel) panel.remove(); panel=null; if(backdrop) backdrop.remove(); backdrop=null; }
  function setInput(id,val){ const i=panel.querySelector(id); if(i) i.checked=!!val; }
  function setTime(id,val){ const i=panel.querySelector(id); if(i) i.value=val; }
  function refreshUI(){
    if(!panel) return;
    panel.querySelector('#iu-cur').textContent=describeF(current.features);
    panel.querySelector('#iu-next').textContent=fmtTime(current.nextBoundary);

    const S=settings.schedule;
    setTime('#iu-wd-start',S.weekdays.rangeStart); setTime('#iu-wd-end',S.weekdays.rangeEnd);
    setInput('#iu-wd-in-msg',S.weekdays.inRange.messages); setInput('#iu-wd-in-chron',S.weekdays.inRange.chronological); setInput('#iu-wd-in-sto',S.weekdays.inRange.stories);
    setInput('#iu-wd-out-msg',S.weekdays.outRange.messages); setInput('#iu-wd-out-chron',S.weekdays.outRange.chronological); setInput('#iu-wd-out-sto',S.weekdays.outRange.stories);
    setTime('#iu-we-start',S.weekends.rangeStart); setTime('#iu-we-end',S.weekends.rangeEnd);
    setInput('#iu-we-in-msg',S.weekends.inRange.messages); setInput('#iu-we-in-chron',S.weekends.inRange.chronological); setInput('#iu-we-in-sto',S.weekends.inRange.stories);
    setInput('#iu-we-out-msg',S.weekends.outRange.messages); setInput('#iu-we-out-chron',S.weekends.outRange.chronological); setInput('#iu-we-out-sto',S.weekends.outRange.stories);

    const wdSame=S.weekdays.rangeStart===S.weekdays.rangeEnd;
    const weSame=S.weekends.rangeStart===S.weekends.rangeEnd;
    panel.querySelector('#iu-wd-in').classList.toggle('iu-muted',wdSame);
    panel.querySelector('#iu-we-in').classList.toggle('iu-muted',weSame);
    const weNote=panel.querySelector('#iu-we-note'); if(weNote) weNote.style.display=weSame?'':'none';

    setInput('#iu-ovr-persist',!!settings.persistOverrideAcrossSessions);
    setInput('#iu-debug',!!settings.debug);

    const ov=settings.override||{}; const f=ov.features||{};
    setInput('#iu-ovr-msg',!!f.messages); setInput('#iu-ovr-chron',!!f.chronological); setInput('#iu-ovr-sto',!!f.stories);
  }

  /* ───────── Start ───────── */
  scheduleTick();
  applyPolicyForLocation();
  new MutationObserver(()=>{ if(isRoot() && inSO()) startSOHiding(); else stopSOHiding(); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();
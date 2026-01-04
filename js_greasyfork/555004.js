// ==UserScript==
// @name         Torn Workstats + Tooltip
// @namespace    https://www.torn.com
// @version      1.1
// @description  Workstats badges on UserList/Faction/Company. Queue com concorrência, lazy por visibilidade, re-injeção resiliente, tooltip (lazy) e rate limit por minuto. Sem chamadas ao /profile.
// @author       JohnNash
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/factions.php*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/555004/Torn%20Workstats%20%2B%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/555004/Torn%20Workstats%20%2B%20Tooltip.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** CONFIG ***/
  const CFG = {
    apiKey: GM_getValue('apiKey', ''),
    delayMs: GM_getValue('delayMs', 200),
    wsThreshold: GM_getValue('wsThreshold', 100000),
    maxInFlight: 10,
    heartbeatMs: 2000,
    minuteCap: 8, // ajusta conforme o teu limite
  };

  // Menu
  GM_registerMenuCommand('Set API Key', () => {
    const v = prompt('Enter your Torn API key:', CFG.apiKey || '');
    if (v !== null){ CFG.apiKey = v.trim(); GM_setValue('apiKey', CFG.apiKey); alert('API key saved.'); }
  });
  GM_registerMenuCommand('Set Delay (ms)', () => {
    const v = prompt('Minimum delay between request starts (ms):', String(CFG.delayMs));
    if (v !== null){ const n = Math.max(0, Number(v)); CFG.delayMs = Number.isFinite(n)? n : 80; GM_setValue('delayMs', CFG.delayMs); }
  });
  GM_registerMenuCommand('Set Workstats Threshold', () => {
    const v = prompt('Workstats threshold (for coloring):', String(CFG.wsThreshold));
    if (v !== null){ const n = Math.max(0, Number(v)); CFG.wsThreshold = Number.isFinite(n)? n : 500000; GM_setValue('wsThreshold', CFG.wsThreshold); }
  });

  /*** CSS ***/
  GM_addStyle(`
    .ws-badge{display:inline-block;font-size:11px;padding:1px 4px;border-radius:6px;background:rgba(0,0,0,.15);border:1px solid rgba(0,0,0,.25);line-height:1.1;position:relative;top:-1px;cursor:default}
    .ws-badge[data-level="low"]{color:#b00020}
    .ws-badge[data-level="high"]{color:#1b5e20}
    .ws-spinner{width:10px;height:10px;border:2px solid rgba(0,0,0,.2);border-top-color:rgba(0,0,0,.6);border-radius:50%;display:inline-block;vertical-align:-2px;animation:ws-spin .8s linear infinite}
    @keyframes ws-spin{to{transform:rotate(360deg)}}
    .ws-icon{display:inline-block!important;width:auto!important;height:auto!important;background:none!important;list-style:none!important;margin-bottom:0!important}
    .ws-tip{position:fixed; z-index:2147483646; max-width:280px; background:#101114; color:#fff; border:1px solid rgba(255,255,255,.15);
            border-radius:8px; padding:8px 10px; box-shadow:0 6px 24px rgba(0,0,0,.35); font-size:12px; line-height:1.35; pointer-events:none}
    .ws-tip .ws-tip-title{font-weight:700; margin-bottom:4px; font-size:12px}
    .ws-tip .ws-tip-grid{display:grid; grid-template-columns:auto 1fr; gap:4px 8px}
    .ws-tip .ws-k{opacity:.75}
    ul.big.svg > li.ws-icon{width:auto!important;height:auto!important;overflow:visible!important;margin:0 3px!important;padding:0!important;line-height:1!important;background:none!important}
    ul.big.svg > li.ws-icon .ws-badge{display:inline-block!important}
  `);

  /*** RATE LIMITER (por minuto alinhado ao relógio) ***/
  const RateLimiter = (() => {
    let windowStart = Math.floor(Date.now() / 60000) * 60000;
    let used = 0;
    function resetIfNeeded(now){
      if (now >= windowStart + 60000){
        windowStart = Math.floor(now / 60000) * 60000;
        used = 0;
      }
    }
    function canStart(now){ resetIfNeeded(now); return used < CFG.minuteCap; }
    function reserve(now){ resetIfNeeded(now); used++; }
    function whenNextWindowMs(now){ resetIfNeeded(now); return (windowStart + 60000) - now + 10; }
    function stats(){ const now = Date.now(); resetIfNeeded(now); return { used, cap: CFG.minuteCap, resetInMs: (windowStart + 60000) - now }; }
    return { canStart, reserve, whenNextWindowMs, stats };
  })();

  /*** QUEUE simples com concorrência + rate limit ***/
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const Q = { maxInFlight: CFG.maxInFlight, inFlight: 0, nextStartAt: 0, jobs: [], pumping: false };

  async function scheduleJobStart(job){
    const now = Date.now();
    const delayGap = Math.max(0, Q.nextStartAt - now);
    Q.nextStartAt = now + delayGap + CFG.delayMs;

    let startIn = delayGap;
    const t0 = now + startIn;
    if (!RateLimiter.canStart(t0)){
      const waitMore = RateLimiter.whenNextWindowMs(t0);
      console.info('[WS] Minute cap reached. Pausing queue for ~', Math.ceil(waitMore/1000), 's …');
      startIn += waitMore;
    }
    setTimeout(async () => {
      RateLimiter.reserve(Date.now());
      Q.inFlight++;
      try { await job.fn(); }
      catch(e){ /* ignore */ }
      finally { Q.inFlight--; pumpQueue(); }
    }, startIn);
  }

  function pumpQueue(){
    if (Q.pumping) return;
    Q.pumping = true;
    try{
      while (Q.inFlight < Q.maxInFlight && Q.jobs.length){
        const job = Q.jobs.shift();
        scheduleJobStart(job);
      }
    } finally {
      Q.pumping = false;
    }
  }

  function queuedGet(url, tag='GET'){
    return new Promise((resolve, reject) => {
      Q.jobs.push({
        tag,
        fn: () => new Promise((res, rej) => {
          GM_xmlhttpRequest({
            method:'GET', url,
            onload:r=>{
              if (r.status>=200 && r.status<300){
                try{
                  const data = JSON.parse(r.responseText || '{}');
                  if (data && data.error){ const e = new Error(`Torn API ${data.error.code}: ${data.error.error}`); reject(e); rej(e); return; }
                  resolve(data); res();
                }catch(e){ reject(e); rej(e); }
              } else { const err=new Error(`HTTP ${r.status}`); reject(err); rej(err); }
            },
            onerror:err=>{ reject(err); rej(err); },
            ontimeout:()=>{ const e=new Error('timeout'); reject(e); rej(e); },
          });
        })
      });
      pumpQueue();
    });
  }

  const v2url = (path) => {
    if (!CFG.apiKey) throw new Error('Missing API key.');
    const join = path.includes('?') ? '&' : '?';
    return `https://api.torn.com${path}${join}key=${encodeURIComponent(CFG.apiKey)}`;
  };

  /*** DOM utils ***/
  const formatNum = n => (n==null || Number.isNaN(n)) ? '—' : Number(n).toLocaleString();
  const extractUserIdFromHref = href => { const m=href?.match(/profiles\.php\?XID=(\d+)/i); return m?m[1]:null; };
  const extractUserNameFromLink = (a) => {
    if (!a) return '';
    const t = a.getAttribute('data-placeholder') || a.getAttribute('title') || a.textContent || '';
    const m = t.match(/^(.+?)\s*\[\d+\]/);
    return (m ? m[1] : t).trim();
  };
  function qsaPlus(root, sel){ const arr=[]; if(root.matches && root.matches(sel)) arr.push(root); root.querySelectorAll(sel).forEach(n=>arr.push(n)); return arr; }
  const getPath = (obj, path) => path.split('.').reduce((o,k)=> (o && (k in o) ? o[k] : undefined), obj);
  const pick = (obj, paths) => { for (const p of paths){ const v = getPath(obj, p); if (v !== undefined && v !== null) return v; } return undefined; };

  /*** Selectores ***/
  const ROW_A_SELECTOR = 'li[class^="user"]';
  const LINK_A_SELECTOR = 'a.user.name[href*="/profiles.php?XID="]';
  function findTrayA(row){
    if(!row) return null;
    return row.querySelector('span.user-icons .icons-wrap ul.big.svg:not(.singleicon)') ||
           row.querySelector('span.user-icons ul.big.svg:not(.singleicon)') ||
           row.querySelector('span.user-icons ul.big.svg');
  }

  const ROW_B_SELECTOR = 'li.table-row';
  const LINK_B_SELECTOR = 'a[href*="/profiles.php?XID="]';
  function findTrayB(row){
    if(!row) return null;
    return row.querySelector('div.table-cell.member-icons.icons ul.big.svg');
  }

  const CORP_TRAY_SELECTOR = 'li.status > ul.big.svg';

  /*** API v2 helpers ***/
  async function apiWorkstatsTotal(userId){
    const light = await queuedGet(v2url(`/v2/user/${userId}/hof?selections=working_stats`), `HOF ${userId} lite`).catch(()=>null);
    if (light){
      const val = Number(light?.hof?.working_stats?.value ?? 0);
      if (!Number.isNaN(val)) return val;
    }
    const full = await queuedGet(v2url(`/v2/user/${userId}/hof`), `HOF ${userId} full`);
    return Number(full?.hof?.working_stats?.value ?? 0);
  }

  const detailsCache = new Map();
  async function apiUserDetails(userId){
    // SEM /profile (sem last_action). Só personalstats + hof (networth/working)
    const cached = detailsCache.get(userId);
    if (cached) return cached;

    const pstP  = queuedGet(v2url(`/v2/user/${userId}/personalstats?cat=all`), `PSTATS ${userId}`);
    const hofP  = queuedGet(v2url(`/v2/user/${userId}/hof?selections=working_stats,networth`), `HOF ${userId} lite`)
                   .catch(()=>queuedGet(v2url(`/v2/user/${userId}/hof`), `HOF ${userId} full`));

    const [stats, hof] = await Promise.all([pstP, hofP]);

    const xanax = Number(
      pick(stats, [
        'personalstats.drugs.xanax',
        'personalstats.drugs_taken.xanax',
        'personalstats.drugs.Xanax',
        'personalstats.drugsTaken.xanax',
        'personalstats.xanax'
      ])
    ) || 0;

    const streakCur = Number(
      pick(stats, [
        'personalstats.other.activity.streak.current',
        'personalstats.activity.streak.current',
        'personalstats.activity_streak.current',
        'personalstats.other.activity_streak.current',
        'personalstats.activity.current_streak',
        'personalstats.streaks.activity.current'
      ])
    ) || 0;

    const streakBest = Number(
      pick(stats, [
        'personalstats.other.activity.streak.best',
        'personalstats.activity.streak.best',
        'personalstats.activity_streak.best',
        'personalstats.other.activity_streak.best',
        'personalstats.activity.best_streak',
        'personalstats.streaks.activity.best'
      ])
    ) || 0;

    const networth = Number(
      pick(hof, ['hof.networth.value']) ??
      pick(stats, ['personalstats.networth.total','personalstats.networth_total'])
    ) || 0;

    const working = Number(pick(hof, ['hof.working_stats.value'])) || 0;

    const out = { xanax, networth, streakCur, streakBest, working, ts: Date.now() };
    detailsCache.set(userId, out);
    return out;
  }

  /*** Badge + cache ***/
  const cacheWS = new Map(); // userId -> { total, ts }

  function createBadgeSkeleton(userId, userName){
    const b=document.createElement('span');
    b.className='ws-badge';
    b.dataset.level='low';
    b.dataset.userId = userId;
    if (userName) b.dataset.username = userName;
    b.innerHTML=`<span class="ws-value"><span class="ws-spinner"></span></span>`;
    b.addEventListener('mouseenter', onBadgeEnter);
    b.addEventListener('mouseleave', onBadgeLeave);
    return b;
  }
  function renderWorkstats(badge, total){
    const v=badge.querySelector('.ws-value'); if(v) v.textContent=formatNum(total);
    badge.dataset.level=(Number(total)>=CFG.wsThreshold)?'high':'low';
  }

  /*** Tooltip ***/
  let tipEl = null;
  function ensureTip(){
    if (tipEl) return tipEl;
    tipEl = document.createElement('div'); tipEl.className = 'ws-tip'; tipEl.style.display = 'none'; document.body.appendChild(tipEl);
    return tipEl;
  }
  function positionTip(anchorEl){
    const r = anchorEl.getBoundingClientRect();
    const tip = ensureTip(); const pad = 6;
    const top = Math.max(8, r.bottom + pad);
    const left = Math.min(window.innerWidth - 12 - tip.offsetWidth, Math.max(8, r.left));
    tip.style.top = `${top}px`; tip.style.left = `${left}px`;
  }
  function showTip(html, anchor){ const tip = ensureTip(); tip.innerHTML = html; tip.style.display = 'block'; positionTip(anchor); }
  function hideTip(){ if (tipEl) tipEl.style.display='none'; }

  async function onBadgeEnter(e){
    const badge = e.currentTarget; const userId = badge?.dataset?.userId;
    if (!userId) return;
    const domName = badge.dataset.username || 'User';
    showTip(`<div class="ws-tip-title">Loading…</div>`, badge);
    try {
      const d = await apiUserDetails(userId);
      const html = `
        <div class="ws-tip-title">${domName} [${userId}]</div>
        <div class="ws-tip-grid">
          <div class="ws-k">Xanax Taken</div><div>${formatNum(d.xanax)}</div>
          <div class="ws-k">Networth</div><div>$ ${formatNum(d.networth)}</div>
          <div class="ws-k">Activity Streak</div><div>${formatNum(d.streakCur)}</div>
          <div class="ws-k">Best Streak</div><div>${formatNum(d.streakBest)}</div>
          <div class="ws-k">Working Stats</div><div>${formatNum(d.working)}</div>
        </div>`;
      showTip(html, badge);
    } catch {
      showTip(`<div class="ws-tip-title">${domName} [${userId}]</div><div>Could not load details.</div>`, badge);
    }
  }
  function onBadgeLeave(){ hideTip(); }

  /*** Injeção ***/
  function injectForRow(row, findTray, linkSelector){
    const tray = findTray(row); if (!tray || tray.querySelector('.ws-icon')) return;
    const link = row.querySelector(linkSelector);
    const userId = extractUserIdFromHref(link?.getAttribute('href'));
    if (!userId) return;
    const userName = extractUserNameFromLink(link);
    const badge = createBadgeSkeleton(userId, userName);
    const li = document.createElement('li'); li.className='ws-icon'; li.appendChild(badge); tray.appendChild(li);
    scheduleBadgeFetchWhenVisible(badge, userId);
  }

  function injectIntoCorpTray(tray){
    if (!tray || tray.querySelector('.ws-icon')) return;
    const row = tray.closest('ul.item.icons'); if (!row) return;
    const link = row.querySelector('li.employee a.user.name[href*="/profiles.php?XID="]');
    const userId = extractUserIdFromHref(link?.getAttribute('href')); if (!userId) return;
    const userName = extractUserNameFromLink(link);
    const badge = createBadgeSkeleton(userId, userName);
    const li = document.createElement('li'); li.className='ws-icon'; li.appendChild(badge); tray.appendChild(li);
    scheduleBadgeFetchWhenVisible(badge, userId);
  }

  /*** Lazy fetch por visibilidade ***/
  const seen = new Set();
  const io = new IntersectionObserver((entries)=>{
    for (const en of entries){
      if (!en.isIntersecting) continue;
      const badge = en.target; io.unobserve(badge);
      const userId = badge.dataset.userId; if (!userId || seen.has(userId)) continue;
      seen.add(userId);
      const cached = cacheWS.get(userId);
      if (cached){ renderWorkstats(badge, cached.total); continue; }
      (async()=>{ try{
        const total = await apiWorkstatsTotal(userId);
        cacheWS.set(userId, { total, ts: Date.now() });
        renderWorkstats(badge, total);
      }catch(e){ const v=badge.querySelector('.ws-value'); if(v) v.textContent='⚠'; badge.title='Failed to fetch workstats'; }})();
    }
  }, { root:null, rootMargin:'600px 0px', threshold:0 });

  function scheduleBadgeFetchWhenVisible(badge, userId){
    const cached = cacheWS.get(userId);
    if (cached){ renderWorkstats(badge, cached.total); return; }
    io.observe(badge);
  }

  function scanAndInject(root=document){
    qsaPlus(root, ROW_A_SELECTOR).forEach(row => injectForRow(row, findTrayA, LINK_A_SELECTOR));
    qsaPlus(root, ROW_B_SELECTOR).forEach(row => injectForRow(row, findTrayB, LINK_B_SELECTOR));
    qsaPlus(root, CORP_TRAY_SELECTOR).forEach(injectIntoCorpTray);
  }

  /*** Resiliência ***/
  let rescanPend = false;
  function queueRescan(){
    if (rescanPend) return;
    rescanPend = true;
    setTimeout(()=>{ rescanPend=false; scanAndInject(document); }, 60);
  }

  const obs = new MutationObserver(muts => {
    let shouldRescan = false;
    for (const m of muts) {
      if (m.addedNodes?.length) {
        m.addedNodes.forEach(node => { if (node.nodeType===1) scanAndInject(node); });
      }
      if (m.removedNodes?.length) {
        for (const n of m.removedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.matches?.('li.ws-icon') || n.querySelector?.('li.ws-icon')) {
            shouldRescan = true; break;
          }
        }
      }
      if (shouldRescan) break;
    }
    if (shouldRescan) queueRescan();
  });

  let hbId = null;
  function startHeartbeat(){ if (!hbId) hbId = setInterval(()=>queueRescan(), CFG.heartbeatMs); }
  function stopHeartbeat(){ if (hbId){ clearInterval(hbId); hbId = null; } }

  /*** INIT ***/
  function init(){
    if (!CFG.apiKey) console.warn('[WS] Missing API key. Set it in the Tampermonkey menu.');
    scanAndInject(document);
    obs.observe(document.body, { childList:true, subtree:true });
    if (location.href.includes('/factions.php')) startHeartbeat(); else stopHeartbeat();
    const s = RateLimiter.stats();
    console.log('[WS] Torn Workstats — Simple Row Injector 1.1 active. Concurrency='+CFG.maxInFlight+', Delay='+CFG.delayMs+'ms, Cap='+CFG.minuteCap+'/min, UsedThisMinute='+s.used);
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();

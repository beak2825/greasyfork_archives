// ==UserScript==
// @name         메르헨 방송 탐색기
// @namespace    local.soop.merhen
// @version      0.7.1
// @description  홈 카드(views/빨간불) 1차 감지 
// @match        *://www.sooplive.co.kr/
// @match        *://play.sooplive.co.kr/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/548353/%EB%A9%94%EB%A5%B4%ED%97%A8%20%EB%B0%A9%EC%86%A1%20%ED%83%90%EC%83%89%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/548353/%EB%A9%94%EB%A5%B4%ED%97%A8%20%EB%B0%A9%EC%86%A1%20%ED%83%90%EC%83%89%EA%B8%B0.meta.js
// ==/UserScript==
(function(){
  'use strict';

  // ───────── 설정
  const TARGETS = [ { id: 'nering0117', label: '네링' }, { id: 'dila0107', label: '박디라' } ];
  const GLOBAL_PAUSE_WHEN_OPEN = true;        // 시청 탭 열리면 전역 정지 (기본)
  const AUTO_SCROLL_FOR_NERING = true;        // 홈 즐찾이 길어 가려져 있어도 자동 스크롤로 찾아보기
  const AUTOSCROLL_MAX_STEPS   = 18;          // 최대 스크롤 횟수 (~2초 남짓)
  const AUTOSCROLL_DELAY_MS    = 120;         // 스크롤 단계 간 대기

  const onReady = (fn)=>{ if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); };
  window.__DUO_CLOSED = window.__DUO_CLOSED || false;

  const host = location.host, path = location.pathname, qs = location.search + location.hash;
  const isHome = /^www\.sooplive\.co\.kr$/i.test(host) && path === '/' && top===self;
  const isPlay = /^play\.sooplive\.co\.kr$/i.test(host);
  const hasTag = (k) => new RegExp(`(^|[?#&])${k}(=|&|$)`).test(qs);

  // ───────── GM 래퍼
  function GM_Get(k,d){ try{ const v=GM_getValue(k); return (v===undefined?d:v); }catch{ return d; } }
  function suppress(id, on){ try{ GM_setValue('suppress_'+id, on?1:0); }catch{} }
  function isSuppressed(id){ return !!GM_Get('suppress_'+id,0); }
  function setOpen(id, ts){ try{ GM_setValue('open_'+id, ts|0); }catch{} }
  function isOpen(id){ const t=GM_Get('open_'+id,0); return t && (Date.now()-t)<8000; }

  // ─────────────────────────────────────────────
  // A) 프레임(PLAY) — __duo=1 / __sfbg=1: 라이브 판정 보조 전용
  // ─────────────────────────────────────────────
  if (isPlay && (hasTag('__duo=1') || hasTag('__sfbg=1') || /#__duo=1|#__sfbg=1/.test(qs))) {
    if (window.__DUO_PROBE__) return; window.__DUO_PROBE__ = true;

    const NAT = { fetch: typeof window.fetch==='function' ? window.fetch.bind(window) : undefined, XHR_open: XMLHttpRequest.prototype.open, XHR_send: XMLHttpRequest.prototype.send };
    const DENY = /watch|heartbeat|enter|join|ticket|attend|attendance|gift|charge|purchase|order|live-?stat|statistic|log|analytics|beacon|sock|ws|wss|event|sse|chat|stomp|mqtt|websocket/i;

    function hardBlock(){ try{ window.WebSocket = function(){ throw new Error('duo-blocked: WS'); }; }catch{} try{ window.EventSource = function(){ throw new Error('duo-blocked: ES'); }; }catch{} try{ navigator.sendBeacon = function(){ return false; }; }catch{} try{ window.fetch = function(){ return Promise.reject(new Error('duo-blocked: fetch')); }; }catch{} try{ XMLHttpRequest.prototype.open = function(){ this.__duo_blocked = true; return NAT.XHR_open.apply(this, arguments); }; XMLHttpRequest.prototype.send = function(){ try{ if(this.__duo_blocked){ this.abort(); return; } }catch{} return NAT.XHR_send.apply(this, arguments); }; }catch{} }
    function guardAllowGET(){ try{ window.fetch = function(input, init){ try{ const url=(typeof input==='string')? input : (input && input.url) || ''; const method = (init && (init.method||init.type)) ? String(init.method||init.type).toUpperCase() : 'GET'; if (method!=='GET' || DENY.test(url)) return Promise.reject(new Error('duo-guard: '+method+' '+url)); }catch{} return NAT.fetch ? NAT.fetch.apply(this, arguments) : Promise.reject(new Error('no-native-fetch')); }; }catch{} try{ XMLHttpRequest.prototype.open = function(m,u){ try{ this.__duo_blocked = (String(m||'GET').toUpperCase()!=='GET') || DENY.test(String(u||'')); }catch{ this.__duo_blocked=true; } return NAT.XHR_open.apply(this, arguments); }; XMLHttpRequest.prototype.send = function(){ try{ if(this.__duo_blocked){ this.abort(); return; } }catch{} return NAT.XHR_send.apply(this, arguments); }; }catch{} try{ window.WebSocket = function(){ throw new Error('duo-blocked: WS'); }; }catch{} try{ window.EventSource = function(){ throw new Error('duo-blocked: ES'); }; }catch{} try{ navigator.sendBeacon = function(){ return false; }; }catch{} }

    hardBlock();
    try{ const H = HTMLMediaElement.prototype; H.play = function(){ try{ this.muted=true; this.volume=0; }catch{} try{ this.pause(); }catch{} return Promise.resolve(); }; document.addEventListener('play', e=>{ try{ e.target.muted=true; e.target.volume=0; e.target.pause(); }catch{} }, true); }catch{}

    const seg = path.replace(/^\/+|\/+$/g,'').split('/');
    const bjId = (seg[0]||'').toLowerCase();
    let lastVia = 'init';
    const looksLiveByPath = (pn)=>{ try{ const s = String(pn||location.pathname).replace(/^\/+|\/+$/g,'').split('/'); return s.length>=2 && /^\d{3,}$/.test(s[1]); }catch{ return false; } };
    const getLiveNo = ()=>{
      try{ if (looksLiveByPath(location.pathname)) { lastVia='path'; return location.pathname.replace(/^\/+|\/+$/g,'').split('/')[1]; } }catch{}
      try{ const c=[]; const og=document.querySelector('meta[property="og:url"]'); if(og&&og.content) c.push(og.content); const ln=document.querySelector('link[rel="canonical"]'); if(ln&&(ln.href||ln.getAttribute('href'))) c.push(ln.href||ln.getAttribute('href')); for(const href of c){ try{ const u=new URL(href, location.origin); const p=u.pathname.replace(/^\/+|\/+$/g,'').split('/'); if(p[0]&&p[0].toLowerCase()===bjId && p[1] && /^\d{3,}$/.test(p[1])){ lastVia='meta'; return p[1]; } }catch{} } }catch{}
      try{ const re=/(?:"liveNo"|"live_no"|liveNo|live_no)\s*[:=]\s*(\d{3,})/i; const ss=document.scripts; const L=Math.min(40, ss.length); for(let i=0;i<L;i++){ const t=ss[i].textContent||''; if(!t) continue; const m=re.exec(t); if(m){ lastVia='script'; return m[1]; } } }catch{}
      return null;
    };
    const post = (live, extra)=>{ try{ parent && parent.postMessage({ __MARCHEN_RESULT__: true, id: bjId, live: !!live, via: lastVia, ...extra }, '*'); }catch{} };
    try{ const HP=history.pushState, HR=history.replaceState; const notify=()=>{ if (looksLiveByPath(location.pathname)){ const no=location.pathname.replace(/^\/+|\/+$/g,'').split('/')[1]; lastVia='history'; post(true,{liveNo:no}); } }; history.pushState=function(){ const r=HP.apply(this, arguments); try{ notify(); }catch{} return r; }; history.replaceState=function(){ const r=HR.apply(this, arguments); try{ notify(); }catch{} return r; }; addEventListener('popstate',()=>{ try{ notify(); }catch{} }); }catch{}

    let posted=false; const t0=Date.now();
    const check = ()=>{ if(posted) return; const no=getLiveNo(); if(no){ posted=true; post(true,{liveNo:no}); } else if (Date.now()-t0>8000){ posted=true; post(false); } };
    setInterval(check,170);
    try{ const mo=new MutationObserver(check); mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true}); setTimeout(()=>mo.disconnect(), 8200);}catch{}
    const TEMP_UNLOCK_MS = 1800; setTimeout(()=>{ guardAllowGET(); }, 200); setTimeout(()=>{ hardBlock(); }, 200 + TEMP_UNLOCK_MS);
    setTimeout(check, 260);
    return;
  }

  // A-2) 플레이 일반 시청 탭 — 하트비트 + suppress ON
  if (isPlay && top===self && !hasTag('__duo=1') && !hasTag('__sfbg=1')) {
    try{ const seg = path.replace(/^\/+|\/+$/g,'').split('/'); const bjId = (seg[0]||'').toLowerCase(); if (TARGETS.some(t=>t.id===bjId)) { suppress(bjId, true); setInterval(()=> setOpen(bjId, Date.now()), 1000); addEventListener('beforeunload', ()=>{ setOpen(bjId, 0); }); } }catch{}
  }

  // ─────────────────────────────────────────────
  // B) 홈 컨텍스트 — 패널 + 홈 카드 감지 + (필요시) 자동 스크롤 + 프레임 보조
  // ─────────────────────────────────────────────
  if (!isHome) return; if (window.__DUO_MAIN__) return; window.__DUO_MAIN__ = true;

  const state = new Map(TARGETS.map(t=>[t.id,false]));
  const lastVia = new Map();
  const PERIOD_MS = 1500;

  try{ TARGETS.map(t=>t.id).forEach(id=>{ GM_addValueChangeListener && GM_addValueChangeListener('open_'+id, ()=>{ syncSuppressFromOpen(); paint(); }); GM_addValueChangeListener && GM_addValueChangeListener('suppress_'+id, ()=>{ paint(); }); }); }catch{}

  const hostEl = document.createElement('div'); Object.assign(hostEl.style,{position:'fixed', top:'12px', right:'12px', zIndex:2147483647}); (document.body||document.documentElement).appendChild(hostEl);
  const root = hostEl.attachShadow({mode:'open'});
  const css  = document.createElement('style'); css.textContent = `:host{all:initial} *{box-sizing:border-box}.wrap{background:#0f0f0f;border:1px solid #222;color:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.35);min-width:340px}.hdr{display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid #222}.title{font-weight:900}.brand{font-weight:900;margin-right:4px;background-image:linear-gradient(45deg,#6b4fe9,#f09c5a);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}.hint{opacity:.65;font-size:11px;margin-left:6px}.body{padding:10px}table{width:100%;border-collapse:collapse}th,td{padding:8px 6px;border-bottom:1px solid #222;text-align:left}.dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:8px;background:#777}.on{background:#2ad46b!important} .off{background:#ff6b6b!important}button{all:unset;cursor:pointer;background:#2b5cff;color:#fff;padding:6px 10px;border-radius:8px;font-weight:700}.g{background:#2b2b2b}.dim{opacity:.65;font-size:11px}`;
  const box = document.createElement('div'); box.className='wrap'; box.innerHTML = `
   <div class="hdr" title="Alt+드래그로 이동 · 더블클릭 초기화"><span class="title"><span class="brand">메르헨</span> 방송 탐색기</span><span class="hint">Alt+드래그 이동가능</span><button id="x" class="g" style="margin-left:auto">닫기</button></div>
   <div class="body">
     <table><thead><tr><th>멤버</th><th>상태</th><th>이동</th></tr></thead><tbody id="rows"></tbody></table>
     <div style="display:flex;gap:8px;margin-top:10px;align-items:center"><button id="start">시작</button><button id="stop" class="g">정지</button><span id="stat" style="margin-left:auto;opacity:.8;font-size:12px">대기중</span></div>
     <div id="dbg" class="dim" style="margin-top:6px"></div>
   </div>`;
  root.append(css, box); if (window.__DUO_CLOSED) hostEl.style.display='none';

  addEventListener('keydown', (e)=>{ if(e.altKey && (e.key==='m'||e.key==='M')){ hostEl.style.display = (hostEl.style.display==='none'?'': 'none'); window.__DUO_CLOSED = (hostEl.style.display==='none'); } });
  (function drag(){ const hdr = root.querySelector('.hdr'); let dragging=false,pid=null,dx=0,dy=0; hdr.addEventListener('pointerdown',e=>{ if(!e.altKey) return; dragging=true; pid=e.pointerId; hdr.setPointerCapture(pid); const rc=hostEl.getBoundingClientRect(); if(hostEl.style.right){ hostEl.style.left=rc.left+'px'; hostEl.style.right=''; } hostEl.style.top=rc.top+'px'; dx=e.clientX-(parseFloat(hostEl.style.left)||rc.left); dy=e.clientY-(parseFloat(hostEl.style.top)||rc.top); e.preventDefault(); }); addEventListener('pointermove',e=>{ if(!dragging) return; let nx=e.clientX-dx, ny=e.clientY-dy; const leash=200, maxX=innerWidth-hostEl.offsetWidth+leash, maxY=innerHeight-hostEl.offsetHeight+leash; nx=Math.max(-leash,Math.min(maxX,nx)); ny=Math.max(-leash,Math.min(maxY,ny)); hostEl.style.left=nx+'px'; hostEl.style.top=ny+'px'; }); addEventListener('pointerup',()=>{ if(!dragging) return; dragging=false; try{ hdr.releasePointerCapture(pid);}catch{} pid=null; }); hdr.addEventListener('dblclick',()=>{ hostEl.style.left=''; hostEl.style.top=''; hostEl.style.right='12px'; hostEl.style.top='12px'; }); })();
  root.querySelector('#x').onclick = ()=>{ window.__DUO_CLOSED=true; hostEl.style.display='none'; };

  const $ = (s)=>root.querySelector(s);
  const toPlay = (id)=> `https://play.sooplive.co.kr/${id}/null`;

  // 숨김 프레임 준비
  let f=null; function ensureHiddenFrame(){ if (f && f.isConnected) return f; try{ const pool=document.createElement('div'); Object.assign(pool.style,{position:'fixed',left:'-99999px',top:'-99999px',width:'1px',height:'1px',overflow:'hidden'}); (document.body || document.documentElement).appendChild(pool); f=document.createElement('iframe'); f.name='duo_if'; f.setAttribute('sandbox','allow-scripts allow-same-origin'); f.setAttribute('allow',"autoplay 'none'; camera 'none'; microphone 'none'"); Object.assign(f.style,{width:'1px',height:'1px',border:'0'}); pool.appendChild(f);}catch{} return f; }

  const anyOpen = ()=> TARGETS.some(t=> isOpen(t.id));
  const isPausedByWatching = ()=> GLOBAL_PAUSE_WHEN_OPEN && anyOpen();

  // 홈 카드 감지 — a.live / em.views
  function homeDetectLive(id){ try{ const sel=`a[href*="/${id}"]`; const anchors=[...document.querySelectorAll(sel)]; for(const a of anchors){ try{ if (a.classList && a.classList.contains('live')) return {live:true, via:'home', views: getViews(a)}; const v=getViews(a); if (typeof v==='number' && v>0) return {live:true, via:'home', views:v}; }catch{} } }catch{} return {live:false}; }
  function getViews(a){ try{ const em = a.querySelector('em.views'); if(!em) return null; const n = parseInt(String(em.textContent||'').replace(/[^0-9]/g,''),10); return isFinite(n)?n:null; }catch{ return null; } }

  // 자동 스크롤로 카드 드러내기 (필요할 때만, 제한적)
  let autoscrollBusy=false; function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
  async function revealHomeCard(id){ if (autoscrollBusy || !AUTO_SCROLL_FOR_NERING) return false; autoscrollBusy=true; let ok=false; try{ for(let i=0;i<AUTOSCROLL_MAX_STEPS;i++){ if (document.querySelector(`a[href*="/${id}"]`)) { ok=true; break; } window.scrollTo(0, document.documentElement.scrollHeight); await delay(AUTOSCROLL_DELAY_MS); } } finally { autoscrollBusy=false; } return ok; }

  // UI 렌더
  let running=false; function paint(){ const tb = $('#rows'); tb.innerHTML=''; TARGETS.forEach(t=>{ const live=!!state.get(t.id); const watching=isOpen(t.id); const sup=isSuppressed(t.id); const via=lastVia.get(t.id); const badge = watching ? ' · 참여중' : (sup ? ' · 감시중지' : ''); const viaTxt = live && via ? `<span class="dim">(via ${via})</span>` : ''; const tr=document.createElement('tr'); tr.innerHTML=`<td>${t.label}<div style="font-size:11px;opacity:.7">${t.id}</div></td><td><span class="dot ${live?'on':'off'}"></span>${live?'방송중':'오프라인'}${badge} ${viaTxt}</td><td><button class="go" data-id="${t.id}" data-url="${toPlay(t.id)}">재생</button></td>`; tb.appendChild(tr); }); tb.querySelectorAll('.go').forEach(b=>{ b.onclick=()=>{ const id=b.getAttribute('data-id'); suppress(id,true); try{ if (f) f.src='about:blank'; }catch{} location.assign(b.getAttribute('data-url')); }; }); const paused=isPausedByWatching(); $('#stat').textContent = paused ? '참여중 – 탐색 중지' : (running ? '감시중' : '대기중'); try{ const btnStart=root.querySelector('#start'), btnStop=root.querySelector('#stop'); btnStart.disabled=paused; btnStop.disabled=paused; btnStart.style.opacity=paused?.5:1; btnStop.style.opacity=paused?.5:1; }catch{} }
  paint();

  // 프레임 결과 수신
  addEventListener('message',(e)=>{ const d=e.data||{}; if(!d||!d.__MARCHEN_RESULT__) return; const id=String(d.id||'').toLowerCase(); if(!id) return; if (d.live){ state.set(id,true); if(d.via) lastVia.set(id,d.via); paint(); } try{ $('#dbg').textContent = `last: ${id} → ${d.live?'LIVE':'OFF'}${d.via?(' · via '+d.via):''}${d.liveNo?(' · no '+d.liveNo):''}`; }catch{} });

  function syncSuppressFromOpen(){ TARGETS.forEach(t=>{ const open=isOpen(t.id); const sup=isSuppressed(t.id); if (open && !sup) suppress(t.id,true); if (!open && sup) suppress(t.id,false); }); }

  // 홈 DOM 관찰 + 주기적 카드 스캔 (+ 필요시 자동 스크롤)
  async function scanHome(){ let found=false; let dbg=''; for (const t of TARGETS){ let r=homeDetectLive(t.id); if (!r.live && t.id==='nering0117' && AUTO_SCROLL_FOR_NERING){ const shown = await revealHomeCard(t.id); if (shown) r = homeDetectLive(t.id); }
      if (r.live){ if(!state.get(t.id)){ state.set(t.id,true); lastVia.set(t.id,'home'); } found=true; dbg += `${t.id}:${r.views??''} `; } }
    if(found){ paint(); try{ $('#dbg').textContent = `home: ${dbg.trim()}`; }catch{} }
  }
  onReady(()=>{ scanHome(); try{ const mo=new MutationObserver(()=>scanHome()); mo.observe(document.body,{subtree:true,childList:true,attributes:true,characterData:true}); }catch{} setInterval(scanHome, 2200); });

  // ── 프레임 보조 스캐너
  let timer=null; function tick(){ if (isPausedByWatching()){ try{ if(f) f.src='about:blank'; }catch{} paint(); timer=setTimeout(()=>{ if(running) tick(); }, PERIOD_MS); return; } if (!f || !f.isConnected){ onReady(()=>{ ensureHiddenFrame(); }); timer=setTimeout(()=>{ if(running) tick(); }, 400); $('#stat').textContent='감시중'; return; } syncSuppressFromOpen(); const ids=TARGETS.map(t=>t.id); tick._i = (typeof tick._i==='number'? tick._i : -1); let chosen=null; for(let step=0; step<ids.length; step++){ tick._i=(tick._i+1)%ids.length; const id=ids[tick._i]; if (isSuppressed(id)) continue; if (isOpen(id)) continue; if (state.get(id)) continue; chosen=id; break; } $('#stat').textContent='감시중'; if (!chosen){ paint(); timer=setTimeout(()=>{ if(running) tick(); }, PERIOD_MS); return; } const u=new URL(toPlay(chosen)); u.searchParams.set('__duo','1'); u.searchParams.set('_t', Date.now()); try{ ensureHiddenFrame(); f.src = u.toString() + '#__duo=1'; }catch{} try{ $('#dbg').textContent = `probe → ${u.pathname}`; }catch{} paint(); timer=setTimeout(()=>{ if(running) tick(); }, PERIOD_MS); }

  // 시작/정지
  root.querySelector('#start').onclick=()=>{ if(!running){ running=true; paint(); tick(); } };
  root.querySelector('#stop').onclick = ()=>{ running=false; clearTimeout(timer); paint(); };

  onReady(()=>{ ensureHiddenFrame(); }); setTimeout(()=>{ if(!running) root.querySelector('#start').click(); }, 600);
  if (window.__DUO_CLOSED) hostEl.style.display='none';
})();

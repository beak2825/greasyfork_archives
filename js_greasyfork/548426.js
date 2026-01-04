// ==UserScript==
// @name         WatchLite — Soop 
// @namespace    local.watchlite
// @version      1.7.4-play-global-stable+close
// @description  자동 감지(WebSocket+ChatLayer)
// @match        *://play.sooplive.com/*
// @match        *://play.sooplive.co.kr/*
// @run-at       document-start
// @license      All rights reserved
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548426/WatchLite%20%E2%80%94%20Soop.user.js
// @updateURL https://update.greasyfork.org/scripts/548426/WatchLite%20%E2%80%94%20Soop.meta.js
// ==/UserScript==
(function(){
  'use strict';
  // ▼ 추가: 세션 비활성(닫힘) 플래그 — 새로고침 전까지 유지
  window.__WL_DISABLED__ = false;

  if (!/^play\.sooplive\.(com|co\.kr)$/i.test(location.host)) return;
  if (window.__WL_SOOP_PLAY_GLOBAL_STABLE174__) return;
  window.__WL_SOOP_PLAY_GLOBAL_STABLE174__ = true;

  // ───────── 설정
  const TTL_MS = 20000;           // 최근 포착 20초간은 초록 유지
  const REEVAL_MS = 1000;         // 1초마다 TTL 재평가
  const ALERT_COOLDOWN_MS = 6000; // 같은 아이디 알람 최소 간격

  // ───────── 저장/상태
  const K_IDS='wl.ids', K_SOUND='wl.sound', K_NOTIFY='wl.notify', K_POS='wl.pos.window';
  const load=(k,d)=>{ try{ return GM_getValue(k,d);}catch{ return d; } };
  const save=(k,v)=>{ try{ GM_setValue(k,v);}catch{} };
  const loadIDs=()=>{ const v=load(K_IDS,[]); return Array.isArray(v)? new Set(v.map(s=>String(s).trim().toLowerCase()).filter(Boolean)) : new Set(); };
  const saveIDs=s=>save(K_IDS,[...s]);
  const loadBool=(k,d)=>!!load(k,d); const saveBool=(k,v)=>save(k,!!v);
  let watchSet=loadIDs(), enableSound=loadBool(K_SOUND,true), enableNotify=loadBool(K_NOTIFY,false);

  // ───────── WebAudio 비프음(자동재생 해제)
  const Sound=(function(){
    let ctx=null, unlocked=false, q=[];
    function ensure(){ if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch{} } if(ctx&&ctx.state==='running') unlocked=true; }
    function unlock(){ ensure(); if(!ctx) return; ctx.resume().then(()=>{ unlocked=true; flush(); }).catch(()=>{}); }
    function flush(){ while(q.length){ const a=q.shift(); beep.apply(null,a); } }
    function beep(ms=150, hz=1000, type='square', vol=0.28){
      ensure(); if(!ctx) return; if(!unlocked){ q.push([ms,hz,type,vol]); return; }
      const o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.value=hz; g.gain.value=vol;
      o.connect(g); g.connect(ctx.destination); const t=ctx.currentTime; o.start(t);
      g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001, t+ms/1000); o.stop(t+ms/1000+0.02);
    }
    ['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev, unlock, {once:true,passive:true,capture:true}));
    return {beep,unlock};
  })();

  // ───────── 페이지 컨텍스트 훅(읽기 전용) + 목록 열렸을 땐 내부 호출 금지
  const INJECT_SRC = (()=>{ const code=function(){
    try{
      const idRx=/^[a-z0-9_]{2,}$/i;
      const toIds=(tokens)=>{ const out=new Set();
        const push=v=>{ if(!v) return; const s=String(v).trim().toLowerCase(); if(s&&(idRx.test(s)||s.length>=2)) out.add(s); };
        const dig=o=>{ if(!o) return; if(Array.isArray(o)){ o.forEach(dig); return; }
          if(typeof o!=='object'){ push(o); return; }
          Object.keys(o).forEach(k=>{ const v=o[k]; if(/user(id|name)?|nick|bjid|username|uid/i.test(k)) push(v); if(v && typeof v==='object') dig(v); });
        }; dig(tokens); return [...out];
      };
      function isUserListOpen(){
        try{
          const chat=window.liveView&&window.liveView.Chat;
          const layer=chat&&(chat.chatUserListLayer||chat.userListLayer||chat.userLayer||null);
          if(layer && (layer.isOpen===true || layer.visible===true || layer.opened===true)) return true;
          const el=document.querySelector(['.chat_user_list','.chat-user-list','.userListLayer','.user_list_layer','.viewer_list','#chat_user_list','#user_list_layer','[data-layer="userList"]'].join(','));
          if(el){ const cs=getComputedStyle(el); if(cs && cs.display!=='none' && cs.visibility!=='hidden' && el.offsetWidth>0&&el.offsetHeight>0) return true; }
        }catch{} return false;
      }

      // WebSocket 읽기
      (function hookWS(){
        if(!('WebSocket' in window)) return;
        const Native=window.WebSocket;
        if(Native && !Native.__wlPatched){
          window.WebSocket = new Proxy(Native, {
            construct(Target,args){
              const ws=new Target(...args);
              try{
                ws.addEventListener('message', ev=>{
                  const d=ev.data;
                  const emit=ids=>{ if(ids && ids.length) window.postMessage({__WL__:true,type:'ws_present',ids},'*'); };
                  const parse=s=>{ if(!s) return;
                    try{ const o=JSON.parse(s); const ids=toIds(o); if(ids.length) emit(ids); }
                    catch{ window.postMessage({__WL__:true,type:'ws_text',text:String(s)},'*'); }
                  };
                  if(typeof d==='string') parse(d);
                  else if(d instanceof ArrayBuffer){ try{ const s=new TextDecoder('utf-8').decode(new Uint8Array(d)); parse(s);}catch{} }
                  else if(d instanceof Blob){ try{ const fr=new FileReader(); fr.onload=()=>parse(String(fr.result||'')); fr.readAsText(d);}catch{} }
                });
              }catch{}
              return ws;
            }
          });
          window.WebSocket.__wlPatched=true;
        }
      })();

      // ChatLayer 폴링 (닫혀 있을 때만 가끔 내부 호출)
      ;(function poll(){
        let tick=0;
        const work=()=>{
          try{
            const chat=window.liveView&&window.liveView.Chat;
            const layer=chat&&(chat.chatUserListLayer||chat.userListLayer||chat.userLayer||null);
            const pc=window.liveView&&(window.liveView.playerController||window.liveView.PlayerController||window.liveView.pc);
            const open=isUserListOpen();
            if(!open && pc && pc.sendChUser && (tick%4===0)){ try{ pc.sendChUser(); }catch{} }
            setTimeout(()=>{ try{
              const data=layer&&(layer.userListSeparatedByGrade||layer.userList||layer._userList||null);
              const all=[]; const push=a=>{ (Array.isArray(a)?a:[]).forEach(v=>all.push(v)); };
              if(data){ if(Array.isArray(data)) push(data); else if(typeof data==='object') Object.keys(data).forEach(k=>push(data[k])); }
              const ids=toIds(all); if(ids.length) window.postMessage({__WL__:true,type:'api_present',ids,open},'*');
            }catch{} },300);
          }catch{} tick++;
        };
        setInterval(work,1500); setTimeout(work,800);
      })();

      // SPA 라우팅 통지
      ;(function navSignals(){
        const emit=()=>window.postMessage({__WL__:true,type:'route'},'*');
        const _ps=history.pushState, _rs=history.replaceState;
        history.pushState=function(){ try{ _ps.apply(this,arguments); emit(); }catch(e){ _ps.apply(this,arguments);} };
        history.replaceState=function(){ try{ _rs.apply(this,arguments); emit(); }catch(e){ _rs.apply(this,arguments);} };
        window.addEventListener('popstate',emit);
      })();
    }catch(e){}
  }.toString(); return `(${code})();`; })();
  try{ const s=document.createElement('script'); s.textContent=INJECT_SRC; (document.documentElement||document.head||document.body).appendChild(s); }catch{}

  // ───────── UI (전역 고정, 컴팩트, 하드마운트)
  const ID='wl-play-panel';
  function styleBtn(btn,ghost){ Object.assign(btn.style,{background:ghost?'#2b2b2b':'#2b5cff',color:'#fff',border:'0',borderRadius:'6px',padding:'5px 8px',fontWeight:'700',cursor:'pointer',lineHeight:'1'}); }
  function mkCheck(label,init,set){ const lab=document.createElement('label'); lab.style.display='inline-flex'; lab.style.gap='6px'; lab.style.alignItems='center'; lab.style.cursor='pointer'; const i=document.createElement('input'); i.type='checkbox'; i.checked=init; i.onchange=e=>set(!!e.target.checked); lab.append(i,document.createTextNode(label)); return lab; }

  function createPanel(){
    const wrap=document.createElement('div'); wrap.id=ID;
    Object.assign(wrap.style,{
      position:'fixed', top:'10px', right:'10px', zIndex:'2147483647',
      background:'#111', color:'#fff', border:'1px solid #2a2a2a', borderRadius:'12px',
      boxShadow:'0 8px 24px rgba(0,0,0,.4)', padding:'10px 12px',
      font:'12px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Apple SD Gothic Neo,Noto Sans KR,sans-serif',
      minWidth:'260px', maxWidth:'380px', userSelect:'none', whiteSpace:'normal'
    });

    // header
    const header=document.createElement('div'); header.style.display='flex'; header.style.alignItems='center'; header.style.gap='8px'; header.title='이동: Alt+드래그 (더블클릭: 위치 초기화)';
    const title=document.createElement('div'); title.style.fontWeight='800'; title.textContent='WatchLite (자동 감지)';
    const hint=document.createElement('div'); hint.style.marginLeft='auto'; hint.style.opacity='.6'; hint.style.fontSize='11px'; hint.textContent='이동: Alt+드래그';
    // ▼ 추가: 우측 닫기 버튼 — 누르면 세션 비활성 + 패널 숨김
    const btnClose = document.createElement('button');
    Object.assign(btnClose.style, {
      marginLeft:'8px', background:'transparent', color:'#aaa', border:'0',
      cursor:'pointer', fontSize:'16px', lineHeight:'1'
    });
    btnClose.textContent = '✕';
    btnClose.title = '닫기 (새로고침 전까지 비활성)';
    btnClose.onclick = () => {
      try {
        window.__WL_DISABLED__ = true;      // 세션 비활성
        const p = document.getElementById(ID);
        if (p) p.style.display = 'none';    // 패널 숨김
      } catch {}
    };
    header.append(title,hint,btnClose);

    // row
    const row=document.createElement('div'); row.style.display='flex'; row.style.flexWrap='wrap'; row.style.gap='6px'; row.style.alignItems='center'; row.style.margin='8px 0 6px';
    const input=document.createElement('input');
    Object.assign(input,{type:'text',placeholder:'아이디 추가 (쉼표로 여러 개)'}); Object.assign(input.style,{flex:'1 1 160px',minWidth:'120px',background:'#181818',color:'#fff',border:'1px solid #333',borderRadius:'6px',padding:'6px 8px'});
    const btnAdd=document.createElement('button'); btnAdd.textContent='추가'; styleBtn(btnAdd);
    const btnClr=document.createElement('button'); btnClr.textContent='모두비우기'; styleBtn(btnClr,true);
    const btnFix=document.createElement('button'); btnFix.textContent='표시/복구'; styleBtn(btnFix,true);
    const btnTest=document.createElement('button'); btnTest.textContent='사운드 테스트'; styleBtn(btnTest,true);
    row.append(input,btnAdd,btnClr,btnFix,btnTest);

    // options
    const opts=document.createElement('div'); opts.style.display='flex'; opts.style.flexWrap='wrap'; opts.style.gap='10px'; opts.style.marginTop='6px';
    const chk1=mkCheck('사운드', enableSound, v=>{ enableSound=v; saveBool(K_SOUND,v); if(v){ Sound.unlock(); Sound.beep(160,1100,'square',0.28);} });
    const chk2=mkCheck('알림',  enableNotify, v=>{ enableNotify=v; saveBool(K_NOTIFY,v);} );
    opts.append(chk1,chk2);

    // list
    const list=document.createElement('div'); list.className='list'; list.style.display='flex'; list.style.flexWrap='wrap'; list.style.gap='6px'; list.style.maxWidth='100%';
    function paintList(){
      list.innerHTML='';
      for(const name of [...watchSet].sort()){
        const tag=document.createElement('div'); tag.className='tag'; tag.dataset.name=name;
        Object.assign(tag.style,{display:'inline-flex',gap:'6px',alignItems:'center',border:'1px solid #333',background:'#181818',padding:'4px 8px',borderRadius:'999px'});
        const dot=document.createElement('span'); Object.assign(dot.style,{width:'8px',height:'8px',borderRadius:'50%',background:'#555'});
        const nm=document.createElement('span'); nm.textContent=name; nm.style.fontWeight='700';
        const rm=document.createElement('span'); rm.textContent='×'; rm.style.cursor='pointer'; rm.style.opacity='.7';
        rm.onclick=()=>{ watchSet.delete(name); saveIDs(watchSet); paintList(); };
        tag.append(dot,nm,rm); list.appendChild(tag);
      }
    } paintList();

    // events
    btnAdd.onclick=()=>{ const txt=input.value.trim(); if(!txt) return; for(const raw of txt.split(/[,\s]+/)){ const s=raw.trim().toLowerCase(); if(s) watchSet.add(s); } saveIDs(watchSet); input.value=''; paintList(); };
    btnClr.onclick=()=>{ watchSet.clear(); saveIDs(watchSet); paintList(); };
    btnFix.onclick=()=>{ forceShow(); };
    btnTest.onclick=()=>{ Sound.unlock(); Sound.beep(180,1100,'square',0.28); };

    // drag (전역, ±200px 허용)
    let dragging=false,dx=0,dy=0,pid=null;
    header.addEventListener('pointerdown',e=>{ if(!e.altKey) return; dragging=true; pid=e.pointerId; wrap.setPointerCapture(pid); wrap.style.right='';
      const pos=load(K_POS,null); const r=wrap.getBoundingClientRect();
      wrap.style.left=(pos&&typeof pos.left==='number')?(pos.left+'px'):(r.left+'px');
      wrap.style.top =(pos&&typeof pos.top ==='number')?(pos.top +'px'):(r.top +'px');
      dx=e.clientX-parseFloat(wrap.style.left); dy=e.clientY-parseFloat(wrap.style.top); e.preventDefault();
    });
    window.addEventListener('pointermove',e=>{ if(!dragging) return; const leash=200; const maxX=window.innerWidth-wrap.offsetWidth+leash; const maxY=window.innerHeight-wrap.offsetHeight+leash;
      let nx=e.clientX-dx, ny=e.clientY-dy; nx=Math.max(-leash,Math.min(maxX,nx)); ny=Math.max(-leash,Math.min(maxY,ny));
      wrap.style.left=nx+'px'; wrap.style.top=ny+'px';
    });
    window.addEventListener('pointerup',()=>{ if(!dragging) return; dragging=false; try{ wrap.releasePointerCapture(pid); }catch{} pid=null; const left=parseFloat(wrap.style.left)||0, top=parseFloat(wrap.style.top)||0; save(K_POS,{left,top}); });
    header.addEventListener('dblclick',()=>{ wrap.style.left=''; wrap.style.top=''; wrap.style.right='10px'; wrap.style.top='10px'; save(K_POS,null); });

    // 저장된 위치 적용
    const pos=load(K_POS,null); if(pos && typeof pos.left==='number' && typeof pos.top==='number'){ wrap.style.left=pos.left+'px'; wrap.style.top=pos.top+'px'; wrap.style.right=''; }

    // 유틸
    wrap.paintList = paintList;
    wrap.mark = (name,color)=>{ const t=wrap.querySelector(`.tag[data-name="${CSS.escape(name)}"] span:first-child`); if(t) t.style.background=color||'#555'; };

    // Fail-Safe 표시
    function forceShow(){ wrap.style.display=''; wrap.style.left=''; wrap.style.top=''; wrap.style.right='10px'; wrap.style.top='10px'; save(K_POS,null); if(!wrap.isConnected){ try{ (document.documentElement||document.body).appendChild(wrap); }catch{} } }
    wrap.forceShow = forceShow;

    // 컨텐츠 붙이기
    wrap.append(header, row, opts, list);
    (document.documentElement||document.body).appendChild(wrap);
    return wrap;
  }

  function mountPanel(){
    // ▼ 추가: 닫힘 상태면 재마운트/표시 금지
    if (window.__WL_DISABLED__) return false;
    try{
      const exist=document.getElementById(ID);
      if(exist && exist.isConnected){ exist.style.display=''; return true; }
      createPanel(); return true;
    }catch(e){
      // 간단 복구 박스
      try{
        const panic=document.createElement('div'); panic.id=ID;
        Object.assign(panic.style,{position:'fixed',top:'10px',right:'10px',zIndex:'2147483647',background:'#111',color:'#fff',padding:'10px 12px',borderRadius:'10px',border:'1px solid #2a2a2a',font:'12px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Apple SD Gothic Neo,Noto Sans KR,sans-serif'});
        panic.innerHTML='<b>WatchLite</b> — 패널 복구 필요 <button id="wl-rebuild" style="margin-left:8px;padding:4px 8px;border:0;border-radius:6px;background:#2b5cff;color:#fff;font-weight:700;cursor:pointer;">복구</button>';
        (document.documentElement||document.body).appendChild(panic);
        document.getElementById('wl-rebuild').onclick=()=>{ try{ panic.remove(); }catch{}; createPanel(); };
      }catch{}
      return false;
    }
  }
  function remount(){ try{ const p=document.getElementById(ID); if(p && p.parentElement) p.parentElement.removeChild(p); }catch{}; mountPanel(); }

  // ───────── 부팅/라우팅/감시
  (function boot(){
    mountPanel();
    let n=0; const short=setInterval(()=>{ n++; mountPanel(); if(n>60) clearInterval(short); },50);
    let m=0; const long=setInterval(()=>{ m++; mountPanel(); if(m>1200) clearInterval(long); },50);
    ['DOMContentLoaded','load','pageshow','popstate','hashchange'].forEach(ev=>window.addEventListener(ev, mountPanel));
    window.addEventListener('message', e=>{ if(e && e.data && e.data.__WL__ && e.data.type==='route') mountPanel(); });
    const mo=new MutationObserver(()=>{ const p=document.getElementById(ID); if(!p || !p.isConnected) mountPanel(); });
    mo.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(()=>{ const p=document.getElementById(ID); if(!p) mountPanel(); },2000);
  })();

  // ───────── 존재 집계(안정화 TTL) / 알람 쿨다운
  const seenWS = new Map();   // id -> lastSeenMs
  const seenAPI= new Map();   // id -> lastSeenMs
  let lastUnion = new Set();
  const lastAlertAt = new Map(); // id -> ts

  function computeUnion(){
    const now=Date.now(), u=new Set();
    for(const [id,t] of seenWS){ if(now - t <= TTL_MS) u.add(id); }
    for(const [id,t] of seenAPI){ if(now - t <= TTL_MS) u.add(id); }
    return u;
  }
  function paintMarks(u){
    const panel=document.getElementById(ID);
    if(panel && panel.paintList) panel.paintList();
    // mark dots
    for(const el of (panel?.querySelectorAll?.('.tag')||[])){
      const name=el?.dataset?.name || '';
      const dot=el?.querySelector?.('span:first-child');
      if(!dot) continue;
      dot.style.background = u.has(name) ? '#27c93f' : '#555';
    }
  }

  function diffAndNotify(newU){
    const enters=[], leaves=[];
    watchSet.forEach(id=>{
      const was=lastUnion.has(id), now=newU.has(id);
      if(!was && now) enters.push(id);
      else if(was && !now) leaves.push(id);
    });

    const nowTs = Date.now();
    if(enableSound){
      for(const id of enters){
        const last=lastAlertAt.get(id)||0; if(nowTs-last>ALERT_COOLDOWN_MS){ Sound.beep(160,1200,'square',0.28); lastAlertAt.set(id, nowTs); }
      }
      for(const id of leaves){
        const last=lastAlertAt.get(id)||0; if(nowTs-last>ALERT_COOLDOWN_MS){ Sound.beep(160,800,'sine',0.25); lastAlertAt.set(id, nowTs); }
      }
    }
    if(enableNotify){
      try{
        if(Notification && Notification.permission==='granted'){
          enters.forEach(id=>new Notification(`[WL] 입장: ${id}`));
          leaves.forEach(id=>new Notification(`[WL] 퇴장: ${id}`));
        }else if(Notification && Notification.permission!=='denied'){
          Notification.requestPermission();
        }
      }catch{}
    }
    lastUnion = newU;
  }

  // 메시지 수신: 타임스탬프만 갱신(덮어쓰지 않음)
  window.addEventListener('message', ev=>{
    // ▼ 추가: 닫힘 상태면 전부 무시
    if (window.__WL_DISABLED__) return;

    const d=ev.data||{}; if(!d||!d.__WL__) return;
    const now=Date.now();
    if(d.type==='ws_present'){
      (d.ids||[]).forEach(x=> seenWS.set(String(x).toLowerCase(), now));
      const u=computeUnion(); paintMarks(u); diffAndNotify(u);
    }else if(d.type==='ws_text'){
      const s=String(d.text||'').toLowerCase();
      watchSet.forEach(id=>{
        const rx=new RegExp(`(^|[^a-z0-9_])${id}([^a-z0-9_]|$)`,'i');
        if(rx.test(s)) seenWS.set(id, now);
      });
      const u=computeUnion(); paintMarks(u); diffAndNotify(u);
    }else if(d.type==='api_present'){
      (d.ids||[]).forEach(x=> seenAPI.set(String(x).toLowerCase(), now));
      const u=computeUnion(); paintMarks(u); diffAndNotify(u);
    }
  });

  // TTL 재평가 타이머: 신호가 잠깐 끊겨도 즉시 회색으로 떨어지지 않음
  setInterval(()=>{
    // ▼ 추가: 닫힘 상태면 아무 것도 하지 않음
    if (window.__WL_DISABLED__) return;

    const u=computeUnion();
    // 변화가 있을 때만 업데이트
    let changed=false;
    if(u.size!==lastUnion.size) changed=true;
    else { for(const id of u){ if(!lastUnion.has(id)){ changed=true; break; } } }
    if(changed){ paintMarks(u); diffAndNotify(u); }
  }, REEVAL_MS);

  // ───────── 메뉴
  try{
    GM_registerMenuCommand('패널 다시 마운트', ()=>mountPanel());
    GM_registerMenuCommand('위치 초기화', ()=>{ save(K_POS,null); remount(); });
    GM_registerMenuCommand('사운드 테스트', ()=>{ Sound.unlock(); Sound.beep(180,1100,'square',0.28); });
  }catch{}

})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-09-04
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/ko
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
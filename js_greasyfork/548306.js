// ==UserScript==
// @name         멜더랜드 부검기 (VOD용 1.2)
// @namespace    melderland-chat-tools
// @version      2025-09-16.vod-chip-r9g v.1.3
// @description  VOD 채팅 부검기 멜더랜드
// @match        https://vod.sooplive.co.kr/player/*
// @run-at       document-end
// @license      All rights reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548306/%EB%A9%9C%EB%8D%94%EB%9E%9C%EB%93%9C%20%EB%B6%80%EA%B2%80%EA%B8%B0%20%28VOD%EC%9A%A9%2012%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548306/%EB%A9%9C%EB%8D%94%EB%9E%9C%EB%93%9C%20%EB%B6%80%EA%B2%80%EA%B8%B0%20%28VOD%EC%9A%A9%2012%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
  if (window.__ML_VOD_CHIP_R9G__) return;
  window.__ML_VOD_CHIP_R9G__ = true;

  /* ===== 정책(r9g) =====
   *  - 칩/메뉴는 반드시 채팅 헤더(.chat_title) 안에만 존재
   *  - 그 외(특히 .htmlplayer_wrap / .float_box / .player 내부)에서는 절대 표시하지 않음
   *  - 우상단 플로팅 fallback(#ml-chip-fallback) 완전 제거(생성도 금지)
   *  - 헤더가 없으면 칩 자체를 파기(아예 미표시)
   */

  const KEEPALIVE_MS = 1200;

  function qs(sel, root=document){ return root.querySelector(sel); }

  /* ===== CSS ===== */
  function injectCSS(){
    if (document.getElementById('ml-vod-chip-style')) return;
    const s = document.createElement('style');
    s.id = 'ml-vod-chip-style';
    s.textContent = `
      /* 칩 본체 */
      .ml-wrap{position:relative; z-index:5; display:inline-block;}
      .ml-chip{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:12px;
               font-size:12px;background:#2b2d31;color:#e7e7ea;border:1px solid #3b3e45;cursor:pointer;user-select:none}
      .ml-chip .ml-dot{width:8px;height:8px;border-radius:50%;background:#888;display:inline-block}
      .ml-chip .ml-status-label{display:inline-block !important; visibility:visible !important; width:auto !important; max-width:none !important;
                                white-space:nowrap; color:#e7e7ea !important; font-size:12px !important; line-height:1.2}
      .ml-chip .ml-caret{opacity:.7}

      /* 드롭다운: 전역 오버레이 방지 (낮은 z-index) */
      .ml-menu{position:absolute;right:0;top:36px;min-width:260px;background:#202225;color:#e7e7ea;border:1px solid #3b3e45;border-radius:10px;
               box-shadow:0 6px 20px rgba(0,0,0,.25);display:none;z-index:6;padding:6px}
      .ml-wrap.open .ml-menu{display:block}
      .ml-menu .item{padding:8px 10px;border-radius:8px;line-height:1.4;cursor:pointer}
      .ml-menu .item:hover{background:#2b2f35}
      .ml-menu .sv-sep{height:0;border-top:1px solid #2b3036;margin:6px 0 4px}
      .ml-status{padding:8px 10px;opacity:.8}

      /* 플레이어 영역 내 표시 금지(혹시라도 삽입되면 즉시 숨김) */
      .htmlplayer_wrap [data-melder-ui],
      .htmlplayer_wrap .ml-wrap,
      .float_box [data-melder-ui],
      .float_box .ml-wrap,
      .player [data-melder-ui],
      .player .ml-wrap{ display:none !important }

      /* 구버전 fallback 완전 차단 */
      #ml-chip-fallback{ display:none !important }
    `;
    document.head.appendChild(s);
  }

  /* ===== 상태 표시 ===== */
  let chipWrap=null, dot=null, label=null, menu=null, busy=false;
  const setIdle = ()=>{ if(dot) dot.style.background='#888'; if(label) label.textContent='대기중'; const st=qs('[data-ml="status"]', menu||document); if(st) st.textContent='대기중'; };
  const setBusy = ()=>{ if(dot) dot.style.background='#2ecc71'; if(label) label.textContent='진행중'; const st=qs('[data-ml="status"]', menu||document); if(st) st.textContent='진행중'; };
  function toast(m){
    const t=document.createElement('div'); t.textContent=m;
    t.style.cssText='position:fixed;right:12px;bottom:12px;background:#2b2d31;color:#e7e7ea;border:1px solid #3b3e45;border-radius:8px;padding:8px 10px;z-index:99';
    document.body.appendChild(t); setTimeout(()=>t.remove(),1400);
  }

  /* ===== DOM 생성 ===== */
  function buildChip(){
    const wrap=document.createElement('div');
    wrap.className='ml-wrap';
    wrap.setAttribute('data-melder-ui','');
    wrap.innerHTML=`
      <div class="ml-chip" data-melder-ui>
        <span class="ml-dot"></span><span class="ml-status-label">대기중</span><span class="ml-caret"> ▾</span>
      </div>
      <div class="ml-menu" data-melder-ui>
        <div class="ml-status" data-ml="status">대기중</div>
        <div class="item" data-ml="chat-all">전체 채팅 로그 저장</div>
        <div class="item" data-ml="balloon">전체 별풍선 로그 저장</div>
        <div class="item" data-ml="challenge">전체 도전 미션 로그 저장</div>
        <div class="item" data-ml="battle">전체 대결 미션 로그 저장</div>
        <div class="sv-sep"></div>
        <div class="item" data-ml="chat-id">특정 ID 채팅 로그 저장</div>
        <div class="item" data-ml="chat-me">내 채팅 로그 저장</div>
        <div class="item" data-ml="chat-word">특정 단어 포함 채팅 저장</div>
      </div>`;

    const btn=wrap.querySelector('.ml-chip');
    btn.addEventListener('click', e=>{ e.stopPropagation(); wrap.classList.toggle('open'); }, {capture:true});
    document.addEventListener('click', e=>{ if(!wrap.contains(e.target)) wrap.classList.remove('open'); }, {capture:true});

    chipWrap=wrap; dot=wrap.querySelector('.ml-dot'); label=wrap.querySelector('.ml-status-label'); menu=wrap.querySelector('.ml-menu');
    wireMenu();
    return wrap;
  }

  function destroyChip(){
    if (!chipWrap) return;
    chipWrap.remove();
    chipWrap=dot=label=menu=null;
  }

  /* ===== 헤더 강제 장착(유일 경로) ===== */
  function getHeader(){
    // 우선 chatting_area 하위, 없으면 전역 .chat_title
    return qs('#chatting_area .chat_title') || qs('.chat_title');
  }

  function ensureMountedInHeader(){
    const header=getHeader();

    // 헤더가 없으면 칩 파기(표시 금지)
    if(!header){ destroyChip(); return false; }

    // 칩 없으면 생성
    if(!chipWrap) buildChip();

    // 플레이어 영역 내에 들어가 있으면 즉시 파기
    if(chipWrap.closest('.htmlplayer_wrap, .float_box, .player')){ destroyChip(); return false; }

    // 가능한 <ul>에 부착, 없으면 헤더 바로 아래
    const ul = qs('ul', header);
    const target = ul || header;
    if(chipWrap.parentElement !== target){ target.appendChild(chipWrap); }

    return true;
  }

  /* ===== 부검 로직(기존) ===== */
  let accumulatedTextData=''; let balloonCutoff=1;
  function secondsToHMS(sec){ if(sec<0) return `[00:00:00]`; sec=Math.floor(sec);
    const h=String(Math.floor(sec/3600)).padStart(2,'0'), m=String(Math.floor((sec%3600)/60)).padStart(2,'0'), s=String(sec%60).padStart(2,'0');
    return `[${h}:${m}:${s}]`; }
  function xmlToJson(xml){ let obj={};
    if(xml.nodeType===1){ if(xml.attributes.length>0){ obj['@attributes']={}; for(let j=0;j<xml.attributes.length;j++){ const a=xml.attributes.item(j); obj['@attributes'][a.nodeName]=a.nodeValue; } } }
    else if(xml.nodeType===3 || xml.nodeType===4){ obj=xml.nodeValue; }
    if(xml.hasChildNodes()){ for(let i=0;i<xml.childNodes.length;i++){ const it=xml.childNodes.item(i), name=it.nodeName;
      if(typeof(obj[name])==='undefined'){ obj[name]=xmlToJson(it); }
      else{ if(typeof(obj[name].push)==='undefined'){ const old=obj[name]; obj[name]=[]; obj[name].push(old); } obj[name].push(xmlToJson(it)); } } }
    return obj; }
  function removeTextAfterRoot(json){ if(!json||typeof json!=='object') return json; const ks=Object.keys(json);
    if(ks.length===1 && ks[0]==='root'){ const r=json.root; if(r && Array.isArray(r['#text'])) delete r['#text']; } return json; }
  async function fetchChatData(url){ const res=await fetch(url,{cache:'force-cache'}); const data=await res.text();
    const xmlDoc=new DOMParser().parseFromString(data,'text/xml'); return removeTextAfterRoot(xmlToJson(xmlDoc)); }
  async function retrieveAndLogChatData(url,startTime,cmd,accTime){
    const chat=await fetchChatData(`${url}&startTime=${startTime}`); let text='';
    if(cmd==='getChatLog') text=convertChat(chat,accTime,'','');
    else if(cmd==='getBalloonLog') text=convertBalloon(chat,accTime);
    else if(cmd==='getChallengeMissionLog') text=convertChallenge(chat,accTime);
    else if(cmd==='getBattleMissionLog') text=convertBattle(chat,accTime);
    else if(cmd.startsWith('getChatLogByID_')) text=convertChat(chat,accTime,cmd.split('getChatLogByID_')[1],'');
    else if(cmd.startsWith('getChatLogByWord_')) text=convertChat(chat,accTime,'',cmd.split('getChatLogByWord_')[1]);
    if(text) accumulatedTextData+=text;
  }
  function genFileName(bjid,videoid,cmd){
    let type=''; if(cmd==='getChatLog') type='채팅_전체';
    else if(cmd==='getBalloonLog') type=`별풍선_전체_${balloonCutoff}개이상`;
    else if(cmd==='getChallengeMissionLog') type=`도전미션_전체_${balloonCutoff}개이상`;
    else if(cmd==='getBattleMissionLog') type=`배틀미션_전체_${balloonCutoff}개이상`;
    else if(cmd.startsWith('getChatLogByID_')) type=`채팅_${cmd.split('getChatLogByID_')[1]}`;
    else if(cmd.startsWith('getChatLogByWord_')) type=`채팅_단어_${cmd.split('getChatLogByWord_')[1]}`;
    return `${bjid}_${videoid}_${type}.txt`;
  }
  async function retrieveForDuration(duration,fileInfoKey,cmd,isLast,accTime){
    const url = fileInfoKey.indexOf('clip_')!==-1
      ? `https://vod-normal-kr-cdn-z01.sooplive.co.kr/${fileInfoKey.split('_').join('/')}_c.xml?type=clip&rowKey=${fileInfoKey}_c`
      : `https://videoimg.sooplive.co.kr/php/ChatLoadSplit.php?rowKey=${fileInfoKey}_c`;
    const bjid = vodCore.config.copyright.user_id || vodCore.config.bjId;
    const filename = genFileName(bjid, vodCore.config.titleNo, cmd);
    const step=300; let cur=0;
    while(cur<=duration){
      document.title=`채팅 데이터를 받는 중... ${parseInt((cur+accTime)/vodCore.config.totalFileDuration*100)}%`;
      await retrieveAndLogChatData(url,cur,cmd,accTime);
      cur+=step;
      if(cur>duration && isLast){
        if(accumulatedTextData.length>0) saveFile(accumulatedTextData,filename);
        else alert('저장할 데이터가 없습니다.');
      }
    }
  }
  function saveFile(text, name){ const blob=new Blob([text],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url); }
  function convertChat(json,acc,id,word){
    const root=json.root||{}; const list=root.chat;
    const pick=o=>{ const t=o.t?secondsToHMS(parseFloat(o.t['#text'])+acc):''; const u=o.u?o.u['#text'].split('(')[0]:'';
      const n=o.n?o.n['#cdata-section']:''; const m=o.m?o.m['#cdata-section']:'';
      if(id){ return (id===u)?`${t} ${n}(${u}): ${m}
`:''; }
      if(word){ return m.includes(word)?`${t} ${n}(${u}): ${m}
`:''; }
      return `${t} ${n}(${u}): ${m}
`; };
    if(Array.isArray(list)) return list.map(pick).join(''); else if(typeof list==='object'&&list) return pick(list); return '';
  }
  function convertBalloon(json,acc){ const root=json.root||{}; const list=root.balloon;
    const pick=o=>{ const t=o.t?secondsToHMS(parseFloat(o.t['#text'])+acc):''; const u=o.u?o.u['#text'].split('(')[0]:'';
      const n=o.n?o.n['#cdata-section']:''; const c=o.c?o.c['#text']:''; return (parseInt(c)>=balloonCutoff)?`${t} ${n}(${u}): ${c}
`:''; };
    if(Array.isArray(list)) return list.map(pick).join(''); else if(typeof list==='object'&&list) return pick(list); return '';
  }
  function convertChallenge(json,acc){ const root=json.root||{}; const list=root.challenge_mission;
    const pick=o=>{ const t=o.t?secondsToHMS(parseFloat(o.t['#text'])+acc):''; const u=o.u?o.u['#text'].split('(')[0]:'';
      const n=o.n?o.n['#cdata-section']:''; const c=o.c?o.c['#text']:''; const title=o.title?o.title['#cdata-section']:'';
      return (parseInt(c)>=balloonCutoff)?`${t} ${n}(${u}): ${c}, ${title}
`:''; };
    if(Array.isArray(list)) return list.map(pick).join(''); else if(typeof list==='object'&&list) return pick(list); return '';
  }
  function convertBattle(json,acc){ const root=json.root||{}; const list=root.battle_mission;
    const pick=o=>{ const t=o.t?secondsToHMS(parseFloat(o.t['#text'])+acc):''; const u=o.u?o.u['text']?.split('(')[0]:(o.u?o.u['#text'].split('(')[0]:'');
      const n=o.n?o.n['#cdata-section']:''; const c=o.c?o.c['#text']:''; const title=o.title?o.title['#cdata-section']:'';
      return (parseInt(c)>=balloonCutoff)?`${t} ${n}(${u}): ${c}, ${title}
`:''; };
    if(Array.isArray(list)) return list.map(pick).join(''); else if(typeof list==='object'&&list) return pick(list); return '';
  }
  function waitVodCore(){ return new Promise((res,rej)=>{ let t=0; const it=setInterval(()=>{ t+=500; if(typeof vodCore!=='undefined'&&vodCore){ clearInterval(it); res(vodCore); } if(t>=20000){ clearInterval(it); rej(new Error('vodCore 대기 초과')); } },500); }); }
  async function run(cmd){
    if(busy){ toast('이미 진행 중입니다'); return; }
    try{
      busy=true; setBusy(); accumulatedTextData=''; let acc=0;
      const core = await waitVodCore(); const items=core.fileItems; const n=items.length;
      for(let i=0;i<n;i++){ const it=items[i]; const last=(i===n-1);
        const t0=performance.now(); await retrieveForDuration(it.duration,it.fileInfoKey,cmd,last,acc); acc+=parseInt(it.duration);
        const dt=performance.now()-t0; if(dt<500) await new Promise(r=>setTimeout(r,500-dt));
      }
      document.title='모든 작업이 완료되었습니다.'; toast('저장 완료');
    }catch(e){ console.error(e); toast('오류 발생'); } finally{ busy=false; setIdle(); }
  }

  function wireMenu(){
    menu.addEventListener('click', async e=>{
      const it=e.target.closest('.item'); if(!it) return; chipWrap.classList.remove('open');
      const act=it.getAttribute('data-ml');
      if(act==='chat-all') run('getChatLog');
      else if(act==='balloon'){ const v=prompt('몇 개 이상의 별풍선만 기록할까요?',1); if(parseInt(v)>0){ balloonCutoff=parseInt(v); run('getBalloonLog'); } }
      else if(act==='challenge'){ const v=prompt('몇 개 이상의 별풍선만 기록할까요?',1); if(parseInt(v)>0){ balloonCutoff=parseInt(v); run('getChallengeMissionLog'); } }
      else if(act==='battle'){ const v=prompt('몇 개 이상의 별풍선만 기록할까요?',1); if(parseInt(v)>0){ balloonCutoff=parseInt(v); run('getBattleMissionLog'); } }
      else if(act==='chat-id'){ const id=prompt('ID를 입력하세요',''); if(id && id.trim()){ run(`getChatLogByID_${id.split('(')[0]}`); } }
      else if(act==='chat-me'){ try{ const core=await waitVodCore(); const me=core.config.loginId; if(me){ run(`getChatLogByID_${me.split('(')[0]}`); } else alert('로그인 상태가 아닙니다.'); }catch{ alert('로그인 정보를 찾을 수 없습니다.'); } }
      else if(act==='chat-word'){ const w=prompt('단어를 입력하세요',''); if(w && w.length>0){ run(`getChatLogByWord_${w}`); } }
    }, {capture:true});
  }

  /* ===== 부팅 ===== */
  function boot(){
    injectCSS();
    ensureMountedInHeader();   // 헤더 없으면 미표시
    setIdle();
    // 주기적으로 재장착(헤더가 늦게 생기는 케이스 대비)
    setInterval(()=>{ try{ ensureMountedInHeader(); } catch(_){} }, KEEPALIVE_MS);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();

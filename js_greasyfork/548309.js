// ==UserScript==
// @name         멜더랜드 채팅지원기 (1.61 차단 실시간 픽스2)
// @namespace    melderland-chat-tools
// @version      2025-09-07 1.61
// @description  OPFS 무팝업 실시간 저장. 항목 다운로드
// @match        https://play.sooplive.co.kr/*
// @run-at       document-start
// @inject-into  page
// @license      All rights reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548309/%EB%A9%9C%EB%8D%94%EB%9E%9C%EB%93%9C%20%EC%B1%84%ED%8C%85%EC%A7%80%EC%9B%90%EA%B8%B0%20%28161%20%EC%B0%A8%EB%8B%A8%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%ED%94%BD%EC%8A%A42%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548309/%EB%A9%9C%EB%8D%94%EB%9E%9C%EB%93%9C%20%EC%B1%84%ED%8C%85%EC%A7%80%EC%9B%90%EA%B8%B0%20%28161%20%EC%B0%A8%EB%8B%A8%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%ED%94%BD%EC%8A%A42%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
  if (window.__ML_MELDER_FULL_161__) return;
  window.__ML_MELDER_FULL_161__ = true;

  /* ================= 공통 상수/유틸 ================= */
  const UI_GUARD='[data-melder-ui],.chat_title,.ml-wrap,.ml-ogq-panel,.ml-block-panel,.ml-files-panel';

  // ✅ SOOP 새 UI: 한 줄 = div.chatting-list-item
  const ROW_SEL='.chatting-list-item,.message-container, li,[role="listitem"],.list_item,[data-type="chat"],li[id^="chat_"]';

  const NAME_BTN='button[user_id],button[user_nick],button.name';
  const NAME_TXT='.username .author,.name,.nick,.nickname,.user,.username,.id,.author,.user_id,.user_nick';
  const MSG_SEL='.message-text .msg,.msg,.message,.text,.body,.content,.text-content,.cont,.chat_msg,.cmt,#message-original';

  const EOL = '\r\n';
  const enc = new TextEncoder();
  const pad=n=>String(n).padStart(2,'0');
  const hhmmss=()=>{ const d=new Date(); return [d.getHours(),d.getMinutes(),d.getSeconds()].map(pad).join(':'); };

  const clean = (s) => String(s ?? '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/, '')
    .trim();

  const fmtBytes=b=> (b<1024?`${b} B`:b<1024**2?`${(b/1024).toFixed(1)} KB`:b<1024**3?`${(b/1024**2).toFixed(1)} MB`:`${(b/1024**3).toFixed(1)} GB`);
  const fmtDate = (t)=>{ const d=new Date(t); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };

  function injectCSS(){
    if(document.getElementById('ml-mt-style')) return;
    const s=document.createElement('style'); s.id='ml-mt-style';
    s.textContent=`
      .ml-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 8px;border-radius:10px;
        font-size:12px;background:#2b2d31;color:#e7e7ea;border:1px solid #3b3e45;cursor:pointer;user-select:none}
      .ml-chip .dot{width:8px;height:8px;border-radius:50%;background:#888}
      .ml-menu{position:absolute;right:0;top:34px;min-width:170px;max-width:220px;background:#202225;color:#e7e7ea;
        border:1px solid #3b3e45;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.25);display:none;z-index:2147483646;padding:4px}
      .ml-menu .item{padding:8px;border-radius:8px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
      .ml-menu .item:hover{background:#2b2f35}
      .ml-wrap{position:relative;z-index:2147483600}
      .ml-wrap.open .ml-menu{display:block}
      #ml-floating{position:fixed;right:10px;top:10px;z-index:2147483646}
      .ml-hidden{display:none !important}

      .ml-status{padding:8px;border-radius:8px;background:#1b1d22;border:1px solid #333a;
        line-height:1.35;margin:4px 4px 6px 4px; font-size:12px}

      .ml-files-panel{ position:fixed; z-index:2147483647; background:#1f2126; color:#e7e7ea; border:1px solid #3b3e45;
        border-radius:12px; width:380px; max-width:min(92vw,440px); box-shadow:0 8px 28px rgba(0,0,0,.35); padding:10px; display:none; }
      .ml-files-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; }
      .ml-files-title{ font-size:13px; font-weight:700; }
      .ml-files-list{ max-height:340px; overflow:auto; }
      .ml-file{ display:grid; grid-template-columns: 1fr auto; gap:6px; align-items:center; border:1px solid #3b3e45; border-radius:10px; padding:8px; margin-top:6px; }
      .ml-file .meta{ font-size:12px; opacity:.85 }
      .ml-file .btns{ display:flex; gap:6px; }
      .ml-btn{ padding:6px 8px; font-size:12px; border-radius:8px; background:#2b2f35; border:1px solid #3b3e45; color:#e7e7ea; cursor:pointer; }

      .ml-ogq-panel,.ml-block-panel{ position:fixed; z-index:2147483647; background:#1f2126; color:#e7e7ea; border:1px solid #3b3e45;
        border-radius:10px; box-shadow:0 8px 28px rgba(0,0,0,.35); display:none; }
      .ml-ogq-panel{ width:340px; max-width:min(92vw,420px); padding:8px 8px 12px; }
      .ml-ogq-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; }
      .ml-ogq-title{ font-size:13px; font-weight:700; }
      .ml-ogq-btn2{ padding:6px 8px; font-size:12px; border-radius:8px; background:#2b2f35; border:1px solid #3b3e45; color:#e7e7ea; cursor:pointer; }
      .ml-ogq-grid{ display:flex; flex-wrap:wrap; gap:6px; max-height:260px; overflow:auto; }
      .ml-ogq-emo{ width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px;
        background:#2b2f35; border:1px solid #3b3e45; cursor:pointer; position:relative; }
      .ml-ogq-emo img{ max-width:32px; max-height:32px; }
      .ml-ogq-star{ position:absolute; right:3px; top:3px; font-size:12px; }
      .ml-ogq-empty{ font-size:12px; color:#cbd5e1; padding:8px; }

      .ml-block-panel{ width:320px; max-width:min(90vw,360px); padding:10px }
      .ml-block-panel h4{margin:0 0 8px 0;font-size:14px;cursor:move}
      .ml-block-row{display:flex;gap:6px}
      .ml-block-row input{flex:1;background:#2b2d31;border:1px solid #3b3e45;border-radius:8px;color:#e7e7ea;padding:6px 8px}
      .ml-block-row button{padding:6px 10px;border-radius:8px;background:#2b2f35;border:1px solid #3b3e45;color:#e7e7ea;cursor:pointer}
      .ml-block-list{margin-top:8px;max-height:240px;overflow:auto}
      .ml-tag{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#2b2f35;border:1px solid #3b3e45;border-radius:8px;padding:6px 8px;margin-top:6px}
      .ml-tag .x{cursor:pointer;opacity:.8}
    `;
    document.head.appendChild(s);
  }

  /* ================= 별칭(닉네임) ================= */
  const ALIAS_KEY='ml_aliasmap_v1';
  const PRESET_ALIASES = {};
  const loadAlias = ()=>{ try{ return JSON.parse(localStorage.getItem(ALIAS_KEY)||'{}'); }catch{ return {}; } };
  const saveAlias = (obj)=>{ localStorage.setItem(ALIAS_KEY, JSON.stringify(obj)); schedulePrefsSave(); };
  function getAlias(id){ const key=(id||'').toLowerCase(); const map=loadAlias(); return map[key] ?? PRESET_ALIASES[key] ?? null; }
  window.mlSetAlias = (id, nick)=>{ const map=loadAlias(); map[String(id||'').toLowerCase()] = clean(nick); saveAlias(map); };

  /* ================= 닉↔아이디 매핑(차단 보강) ================= */
  const NICKMAP_KEY='ml_nick2id_v1';
  const loadNickMap = ()=>{ try{ return JSON.parse(localStorage.getItem(NICKMAP_KEY)||'{}'); }catch{ return {}; } };
  let nick2id = loadNickMap();
  const saveNickMap = ()=>{ try{ localStorage.setItem(NICKMAP_KEY, JSON.stringify(nick2id)); schedulePrefsSave(); }catch{} };

  /* ================= 칩 & 메뉴 ================= */
  let chip,dot,label,menu;
  const setIdle = ()=>{ if(dot) dot.style.background='#888'; if(label) label.textContent='대기중'; };
  const setSaving = ()=>{ if(dot) dot.style.background='#2ecc71'; if(label) label.textContent='저장중'; };

  function buildChip(){
    const wrap=document.createElement('div');
    wrap.className='ml-wrap'; wrap.setAttribute('data-melder-ui','');
    wrap.innerHTML=`
      <div class="ml-chip" data-melder-ui title="OPFS 무팝업 실시간 저장">
        <span class="dot"></span><span class="label">대기중</span><span style="opacity:.7"> ▾</span>
      </div>
      <div class="ml-menu" data-melder-ui>
        <div class="ml-status" data-ml="status">상태 불러오는 중…</div>
        <div class="item" data-ml="start">저장 시작</div>
        <div class="item" data-ml="stop">저장 중지</div>
        <div class="item" data-ml="files">저장 파일</div>
        <div class="item" data-ml="block">차단 관리</div>
      </div>`;
    const btn=wrap.querySelector('.ml-chip');
    btn.addEventListener('click',async e=>{
      e.stopPropagation();
      wrap.classList.toggle('open');
      if (wrap.classList.contains('open')) await updateStatusBox();
    },{capture:true});
    document.addEventListener('click',e=>{ if(!wrap.contains(e.target)) wrap.classList.remove('open'); },{capture:true});
    chip=wrap; dot=wrap.querySelector('.dot'); label=wrap.querySelector('.label'); menu=wrap.querySelector('.ml-menu');
    wireMenu();
    return wrap;
  }
  function mountChip(){
    const head=document.querySelector('#chatting_area .chat_title, .chat_title');
    if(head && !head.querySelector('.ml-wrap')) head.appendChild(buildChip());
    if(!head && !document.getElementById('ml-floating')){
      const f=document.createElement('div'); f.id='ml-floating'; f.appendChild(buildChip()); document.body.appendChild(f);
    }
    setIdle();
  }

  /* ================= OPFS 저장 ================= */
  let dirOPFS=null, fileHandle=null, fileSize=0, needNL=false, logOn=false, currentName='';
  let buf=[], timer=null;
  const HEADER_BEG=()=>`----- SOOP Chat Logging start ${new Date().toISOString()} -----${EOL}`;
  const HEADER_END=()=>`----- SOOP Chat Logging end   ${new Date().toISOString()} -----${EOL}`;

  async function getLogsDir(){
    if(!('storage' in navigator) || !navigator.storage?.getDirectory) throw new Error('OPFS not supported');
    await navigator.storage.persist?.();
    const root = await navigator.storage.getDirectory();
    dirOPFS = await root.getDirectoryHandle('SOOP-logs', {create:true});
    return dirOPFS;
  }
  function parseRoom(){ const p=location.pathname.split('/').filter(Boolean); return {bj:p[0]||'unknown'}; }
  function ymd(){ const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
  function getBjInfo(){
    const {bj:id}=parseRoom();
    const cand=['#bj_nick','.bj_nick','.bj_name','.nickname','.user_nick','meta[property="og:title"]'];
    let nick='';
    for(const sel of cand){ const el=document.querySelector(sel); if(!el) continue;
      const txt=(el.content ?? el.textContent ?? '').trim();
      if(txt){ nick = txt.replace(/\s+/g,' ').replace(/ - .*$/,''); break; } }
    if(!nick && document.title){ const m=document.title.match(/^(.+?)(\s*-\s*.*)?$/); if(m) nick=(m[1]||'').trim(); }
    return {id, nick};
  }
  function baseName(){
    const {id, nick}=getBjInfo();
    const safeNick=(nick||id||'unknown').replace(/[\\/:*?"<>|]/g,'').trim();
    const safeId=(id||'unknown').replace(/[\\/:*?"<>|]/g,'').trim();
    return `${safeNick}(${safeId}) ${ymd()}`;
  }
  async function existsInDir(dir, name){ try{ await dir.getFileHandle(name, {create:false}); return true; }catch{ return false; } }
  async function uniqueName(dir, base){
    let name = `${base}.txt`;
    if(!(await existsInDir(dir, name))) return name;
    for(let i=2;i<=999;i++){ const n=`${base} (${i}).txt`; if(!(await existsInDir(dir, n))) return n; }
    const t=new Date().toISOString().replace(/[:.]/g,'-'); return `${base} ${t}.txt`;
  }
  async function openNewFile(){
    const dir = await (dirOPFS || getLogsDir());
    const name = await uniqueName(dir, baseName());
    currentName = name;
    const fh = await dir.getFileHandle(name, {create:true});
    fileHandle = fh;
    const f = await fh.getFile().catch(()=>null);
    fileSize = f?.size||0;
    if(fileSize>0){
      try{ const tail=await f.slice(Math.max(0,fileSize-4),fileSize).text(); if(!/\r?\n$/.test(tail)) needNL=true; }catch{}
    }
    await writeHeader();
    return name;
  }
  async function _w(w,data){
    const blob=data instanceof Blob?data:new Blob([data],{type:'text/plain;charset=utf-8'});
    await w.write(blob);
    const bytes=(data instanceof Blob)?(await blob.arrayBuffer()).byteLength:enc.encode(String(data)).length;
    fileSize+=bytes;
  }
  async function append(text){
    if(!fileHandle||!text) return false;
    const w=await fileHandle.createWritable({keepExistingData:true});
    try{ if(fileSize>0) await w.seek(fileSize); await _w(w,text); return true; } finally{ await w.close(); }
  }
  async function writeHeader(){
    const w=await fileHandle.createWritable({keepExistingData:true});
    try{
      if(fileSize===0){ await _w(w,new Uint8Array([0xEF,0xBB,0xBF])); }
      else{ await w.seek(fileSize); }
      await _w(w,(needNL&&fileSize>0?EOL:'') + HEADER_BEG());
      needNL=false;
    } finally{ await w.close(); }
  }
  async function writeEndMarker(){ try{ await append(HEADER_END()); }catch{} }

  async function readFileInfo(){
    let size=0, dateStr='-';
    try{
      if(fileHandle){
        const f=await fileHandle.getFile();
        size=f.size; dateStr=fmtDate(f.lastModified);
      }else if(currentName){
        const root=await navigator.storage.getDirectory();
        const dir =await root.getDirectoryHandle('SOOP-logs',{create:true});
        const fh  =await dir.getFileHandle(currentName,{create:false});
        const f   =await fh.getFile();
        size=f.size; dateStr=fmtDate(f.lastModified);
      }
    }catch{}
    if(currentName){
      const m=currentName.match(/(\d{4}-\d{2}-\d{2})/);
      if(m) dateStr=m[1];
    }
    return {size, dateStr};
  }

  /* ================= 상태패널(간소화) ================= */
  async function updateStatusBox(){
    try{
      const box = document.querySelector('.ml-menu .ml-status');
      if(!box) return;
      const name = currentName || '(없음)';
      const info = await readFileInfo();
      box.innerHTML = `
        <div class="row"><span class="muted">파일명</span><span>${name}</span></div>
        <div class="row"><span class="muted">날짜</span><span>${info.dateStr || '-'}</span></div>
        <div class="row"><span class="muted">크기</span><span>${fmtBytes(info.size||0)}</span></div>
      `;
    }catch(e){
      const box = document.querySelector('.ml-menu .ml-status');
      if(box) box.textContent = '상태 표시 실패: '+e;
    }
  }

  /* ================= 파일 패널(OPFS 브라우저) ================= */
  let filesPanel=null;
  function placeFilesPanel(){
    if(!filesPanel) return;
    const btn = chip?.querySelector('.ml-chip');
    const r = btn ? btn.getBoundingClientRect() : {left: window.innerWidth - 420, bottom: 0};
    const pad = 8, w = filesPanel.offsetWidth || 380;
    let left = Math.max(pad, Math.min(r.left, window.innerWidth - w - pad));
    let top  = Math.max(pad, r.bottom + pad);
    filesPanel.style.left = `${left}px`; filesPanel.style.top  = `${top}px`;
  }
  async function openFilesPanel(){
    if(filesPanel){ filesPanel.remove(); filesPanel=null; return; }
    filesPanel=document.createElement('div');
    filesPanel.className='ml-files-panel'; filesPanel.setAttribute('data-melder-ui','');
    filesPanel.innerHTML=`
      <div class="ml-files-head">
        <div class="ml-files-title">저장 파일 (OPFS / SOOP-logs)</div>
        <div>
          <button class="ml-btn" data-act="refresh">새로고침</button>
          <button class="ml-btn" data-act="close">닫기</button>
        </div>
      </div>
      <div class="ml-files-list"></div>
    `;
    document.body.appendChild(filesPanel);
    filesPanel.style.display='block';
    placeFilesPanel();
    await refreshFilesList();
    filesPanel.addEventListener('click', async (e)=>{
      const b=e.target.closest('.ml-btn'); if(!b) return;
      const act=b.dataset.act;
      if(act==='close'){ filesPanel.remove(); filesPanel=null; return; }
      if(act==='refresh'){ await refreshFilesList(); return; }
      if(act==='dl' || act==='saveas' || act==='del'){
        const name=b.dataset.name;
        if(act==='dl') await downloadFileByName(name);
        else if(act==='saveas') await saveAsByName(name);
        else if(act==='del') await deleteByName(name);
        await refreshFilesList();
      }
    });
    window.addEventListener('resize', placeFilesPanel, {passive:true});
    window.addEventListener('scroll',  placeFilesPanel, {passive:true});
  }
  async function getDir(){ return await (dirOPFS || getLogsDir()); }
  async function listFiles(){
    const dir = await getDir(); const out=[];
    for await (const [name, handle] of dir.entries()){
      if (handle.kind!=='file') continue;
      const f = await handle.getFile();
      out.push({name, size:f.size, mtime:f.lastModified});
    }
    out.sort((a,b)=>b.mtime-a.mtime);
    return out;
  }
  async function refreshFilesList(){
    const list = filesPanel.querySelector('.ml-files-list'); list.innerHTML='';
    const arr = await listFiles();
    if(!arr.length){ list.innerHTML='<div style="opacity:.8;padding:8px">파일이 없습니다.</div>'; return; }
    arr.forEach(it=>{
      const row=document.createElement('div'); row.className='ml-file';
      const cur = (it.name===currentName) ? `<span class="ml-badge">현재 파일</span>` : '';
      row.innerHTML=`
        <div>
          <div>${it.name}${cur}</div>
          <div class="meta">${fmtBytes(it.size)} · ${fmtDate(it.mtime)}</div>
        </div>
        <div class="btns">
          <button class="ml-btn" data-act="dl" data-name="${it.name}">다운로드</button>
          <button class="ml-btn" data-act="saveas" data-name="${it.name}">경로 지정</button>
          <button class="ml-btn" data-act="del" data-name="${it.name}">삭제</button>
        </div>
      `;
      list.appendChild(row);
    });
  }
  async function downloadFileByName(name){
    const dir = await getDir(); const fh=await dir.getFileHandle(name,{create:false}); const f=await fh.getFile();
    const a=document.createElement('a'); a.href=URL.createObjectURL(f); a.download=name; a.click(); URL.revokeObjectURL(a.href);
  }
  async function saveAsByName(name){
    if(!('showSaveFilePicker' in window)) { alert('이 브라우저는 경로 지정 저장을 지원하지 않습니다.'); return; }
    const dir = await getDir(); const fh=await dir.getFileHandle(name,{create:false}); const f=await fh.getFile();
    const handle = await showSaveFilePicker({ suggestedName:name, types:[{description:'Text', accept:{'text/plain':['.txt']}}] });
    const w = await handle.createWritable(); await w.write(await f.text()); await w.close();
  }
  async function deleteByName(name){
    const dir = await getDir();
    if (name===currentName && logOn){ alert('현재 기록 중인 파일은 삭제할 수 없습니다.'); return; }
    await dir.removeEntry(name);
  }

  /* ================= 즐겨찾기/차단/별칭 OPFS 백업/복구 ================= */
  const PREFS_FILE = '.prefs.json';
  async function loadPrefsFromOPFS(){
    try{
      const root = await navigator.storage.getDirectory();
      const dir  = await root.getDirectoryHandle('SOOP-logs', {create:true});
      const fh   = await dir.getFileHandle(PREFS_FILE, {create:false});
      const f    = await fh.getFile();
      return JSON.parse(await f.text());
    }catch{ return null; }
  }
  async function savePrefsToOPFS(obj){
    try{
      const root = await navigator.storage.getDirectory();
      const dir  = await root.getDirectoryHandle('SOOP-logs', {create:true});
      const fh   = await dir.getFileHandle(PREFS_FILE, {create:true});
      const w    = await fh.createWritable();
      await w.write(JSON.stringify(obj));
      await w.close();
    }catch(e){ console.warn('prefs save fail', e); }
  }
  function readAllPrefsFromLocal(){
    const ogq   = JSON.parse(localStorage.getItem('ml_ogq_favs_v1') || '[]');
    const block = JSON.parse(localStorage.getItem('ml_blocklist_v1') || '[]');
    let alias; try{ alias = JSON.parse(localStorage.getItem('ml_aliasmap_v1') || '{}'); }catch{ alias = {}; }
    let nickmap; try{ nickmap = JSON.parse(localStorage.getItem(NICKMAP_KEY) || '{}'); }catch{ nickmap = {}; }
    return { ogq, block, alias, nickmap };
  }
  let __prefsSaveTimer = null;
  function schedulePrefsSave(){ clearTimeout(__prefsSaveTimer); __prefsSaveTimer = setTimeout(()=> savePrefsToOPFS(readAllPrefsFromLocal()), 300); }
  async function syncFromBackupIfEmpty(){
    const cur = readAllPrefsFromLocal();
    const isEmpty = (!cur.ogq?.length) || (!cur.block?.length && !Object.keys(cur.alias||{}).length);
    if (!isEmpty) return;
    const backup = await loadPrefsFromOPFS(); if (!backup) return;
    if (!cur.ogq?.length && backup.ogq)     localStorage.setItem('ml_ogq_favs_v1', JSON.stringify(backup.ogq));
    if (!cur.block?.length && backup.block) localStorage.setItem('ml_blocklist_v1', JSON.stringify(backup.block));
    if (!Object.keys(cur.alias||{}).length && backup.alias) localStorage.setItem('ml_aliasmap_v1', JSON.stringify(backup.alias));
    if (!Object.keys(cur.nickmap||{}).length && backup.nickmap) localStorage.setItem(NICKMAP_KEY, JSON.stringify(backup.nickmap));
  }

  /* ================= 차단 ================= */
  const BL_KEY='ml_blocklist_v1';
  const blocked=new Set(JSON.parse(localStorage.getItem(BL_KEY)||'[]').map(s=>String(s).toLowerCase()));
  const saveBlock=()=>{ localStorage.setItem(BL_KEY, JSON.stringify([...blocked])); schedulePrefsSave(); };

  const normalizeId = s => (String(s||'').match(/[A-Za-z0-9][A-Za-z0-9._-]{1,30}/)?.[0]||'').toLowerCase();
  const normalizeNk = s => clean(s).toLowerCase();

  let blockPanel=null;

  // ✅ 항상 "줄" 단위로 숨김 (chatting-list-item 우선)
  function rowLine(el){
    if(!el || el.nodeType!==1) return null;
    const line = el.closest?.('.chatting-list-item') || (el.matches?.('.chatting-list-item') ? el : null);
    return line || el;
  }
  function hideLine(el){
    const line = rowLine(el);
    if(line) line.classList.add('ml-hidden');
  }
  function showLine(el){
    const line = rowLine(el);
    if(line) line.classList.remove('ml-hidden');
  }

  function isBlockedUser(u){
    if(!u) return false;
    const id = (u.id||'').toLowerCase();
    const nk = (u.nk||'').toLowerCase();
    const mapped = nk ? nick2id[nk] : '';
    return (id && blocked.has(id)) || (nk && blocked.has(nk)) || (mapped && blocked.has(mapped));
  }

  function applyBlockToExistingRows(){
    try{
      document.querySelectorAll(ROW_SEL).forEach(r=>{
        if(!r || r.nodeType!==1) return;
        if(r.matches(UI_GUARD)) return;
        const u = parseUser(r);
        if(!u) return;
        if(isBlockedUser(u)) hideLine(r);
        else showLine(r);
      });
    }catch{}
  }

  function placeBlockPanel(){
    if (!blockPanel) return;
    const btn = chip?.querySelector('.ml-chip');
    const r = btn ? btn.getBoundingClientRect() : {left: window.innerWidth - 340, bottom: 0};
    const pad = 8, w = blockPanel.offsetWidth || 320;
    let left = Math.max(pad, Math.min(r.left, window.innerWidth - w - pad));
    let top  = Math.max(pad, r.bottom + pad);
    blockPanel.style.left = `${left}px`; blockPanel.style.top  = `${top}px`;
  }
  function enableDrag(panel){
    const header = panel.querySelector('h4'); if (!header) return;
    let dragging=false, sx=0, sy=0, ox=0, oy=0;
    header.addEventListener('mousedown', e=>{
      e.preventDefault(); dragging=true;
      const rect = panel.getBoundingClientRect(); ox=rect.left; oy=rect.top; sx=e.clientX; sy=e.clientY;
      const onMove = (e)=>{
        if(!dragging) return;
        let nx = ox + (e.clientX - sx);
        let ny = oy + (e.clientY - sy);
        const pad=8, w=panel.offsetWidth, h=panel.offsetHeight;
        nx = Math.max(pad, Math.min(nx, window.innerWidth - w - pad));
        ny = Math.max(pad, Math.min(ny, window.innerHeight - h - pad));
        panel.style.left = `${nx}px`; panel.style.top  = `${ny}px`;
      };
      const onUp = ()=>{ dragging=false; document.removeEventListener('mousemove', onMove); };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp, {once:true});
    });
  }
  function showBlockPanel(){
    const exist = document.querySelector('.ml-block-panel');
    if (exist) { exist.remove(); return; }
    blockPanel=document.createElement('div');
    blockPanel.className='ml-block-panel'; blockPanel.setAttribute('data-melder-ui','');
    blockPanel.innerHTML=`
      <h4>차단 관리</h4>
      <div class="ml-block-row">
        <input type="text" placeholder="아이디 또는 닉네임" id="ml-block-inp">
        <button id="ml-block-add">추가</button>
        <button id="ml-block-close">닫기</button>
      </div>
      <div class="ml-block-list" id="ml-block-list"></div>
    `;
    document.body.appendChild(blockPanel);
    const inp=blockPanel.querySelector('#ml-block-inp');
    const list=blockPanel.querySelector('#ml-block-list');

    const render=()=>{
      list.innerHTML='';
      [...blocked].forEach(v=>{
        const el=document.createElement('div'); el.className='ml-tag';
        el.innerHTML=`<span>${v}</span><span class="x" title="해제">✕</span>`;
        el.querySelector('.x').onclick=()=>{
          blocked.delete(v);
          saveBlock();
          render();
          applyBlockToExistingRows();
        };
        list.appendChild(el);
      });
    };
    render();

    blockPanel.querySelector('#ml-block-add').onclick=()=>{
      const raw=inp.value.trim(); if(!raw) return;
      const id=normalizeId(raw);
      const nk=normalizeNk(raw);
      if(id) blocked.add(id);
      if(nk) blocked.add(nk);
      saveBlock();
      inp.value='';
      render();
      applyBlockToExistingRows();
    };
    blockPanel.querySelector('#ml-block-close').onclick=()=>{ blockPanel.remove(); };
    placeBlockPanel(); enableDrag(blockPanel);
    blockPanel.style.display='block';
  }

  function hideIfBlocked(anyNode, user){
    try{
      if(!user) return;
      if(isBlockedUser(user)) hideLine(anyNode);
    }catch{}
  }

  /* ================= 파싱/기록 ================= */
  const toId=s=>(String(s||'').match(/[A-Za-z0-9][A-Za-z0-9._-]{1,30}/)?.[0]||'').toLowerCase();
  const toNk=s=>clean(String(s||''));

  function preferredNick(id, nk){
    const alias = getAlias(id);
    if (alias) return alias;
    if (nk && nk !== id) return nk;
    return nk || id || '-';
  }
  const mkLine = (id, nk, msg) => {
    const body = clean(msg);
    const ltrim = (t) => String(t).replace(/^[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/, '');
    return ltrim(`[${hhmmss()}]${preferredNick(id,nk)}(${id||'-'}): ${body}`) + EOL;
  };

  const recent=new Map(); const DEDUP=2000;
  const rowSeen = new WeakMap();

  // ✅ 유저정보 파서: chatting-list-item 내부도 탐색
  function parseUser(row){
    try{
      const scope = row?.nodeType===1 ? row : null;
      if(!scope) return null;

      let id='', nk='';

      const holder = scope.querySelector?.('[user_id],[data-user-id],button[user_id],a[user_id],button.name[user_id]') || null;
      if (holder){
        id = toId(holder.getAttribute('user_id') || holder.getAttribute('data-user-id') || '');
        nk = toNk(holder.getAttribute('user_nick') || holder.getAttribute('data-user-nick') || '');
        if(!nk) nk = toNk(holder.textContent || '');
      }

      // ✅ 프로필/팝업형 info (닉 + em 실아이디)
      if(!nk){
        const nickEl = scope.querySelector?.('.info .nick, .info span.nick');
        nk = toNk(nickEl?.textContent || '');
      }
      if(!id){
        const idEl = scope.querySelector?.('.info > em, .info em');
        id = toId(idEl?.textContent || '');
      }

      // 기존 fallback
      if (!nk){
        const nameEl = scope.querySelector?.('.username .author, .user_nick, .nickname, .nick, .name, .author, .user');
        nk = toNk(nameEl?.textContent || '');
      }
      if (!id){
        const out=new Set(), push=v=>{ if(v && clean(v)) out.add(clean(v)); };
        scope.querySelectorAll?.(NAME_BTN)?.forEach(b=>{ push(b.getAttribute('user_id')); push(b.getAttribute('data-user-id')); });
        scope.querySelectorAll?.(NAME_TXT)?.forEach(el=>push(el.textContent||''));
        push((scope.innerText||scope.textContent||'').replace(/\s*\n\s*/g,' '));
        for (const s of out){ const i=toId(s); if(i){ id=i; break; } }
      }

      // nick→id 매핑 저장
      if (nk && id){
        const k = nk.toLowerCase();
        if (nick2id[k] !== id){
          nick2id[k] = id;
          saveNickMap();
        }
      }

      if(!id && !nk) return null;
      return {id, nk};
    }catch{ return null; }
  }

  function parseMsgOnly(row){
    try{
      const scope = row?.nodeType===1 ? row : null;
      if(!scope) return '';
      let msg='';

      const t=scope.querySelector?.(MSG_SEL);
      if(t && clean(t.innerText)) msg=clean(t.innerText);

      if(!msg){
        const full=clean((scope.innerText||scope.textContent||'').replace(/\s*\n\s*/g,' '));
        const m=full.match(/^[^:：﹕]{1,24}[:：﹕]\s*(.*)$/);
        if(m) msg=clean(m[1]);
      }
      return msg;
    }catch{ return ''; }
  }

  function parseRow(row){
    const u = parseUser(row);
    if(!u) return null;
    const msg = parseMsgOnly(row); // msg 없어도 차단은 적용
    return {...u, msg};
  }

  async function flush(force=false){
    if(!logOn || !buf.length) return;
    if(!force && buf.length<1) return;
    const chunk=buf.join(''); buf.length=0; await append(chunk);
  }

  function onRow(row){
    const p=parseRow(row);

    // ✅ 차단은 항상
    if(p) hideIfBlocked(row, p);
    if(!p) return;

    const rowKey = `${p.id}||${p.nk}||${p.msg}`;
    if (rowSeen.get(row) === rowKey) return;
    rowSeen.set(row, rowKey);

    // 로그는 msg 있을 때만
    if(!logOn || !p.msg) return;

    const key=`${p.id}||${p.nk}||${p.msg}`; const now=Date.now(); const last=recent.get(key);
    if(last && (now-last)<DEDUP) return; recent.set(key, now);

    buf.push(mkLine(p.id,p.nk,p.msg));
    flush(true).catch(()=>{});
    setSaving();
    if(!timer) timer=setInterval(()=>flush(true),1000);
  }

  /* ================= 종료/탭닫힘 처리 ================= */
  window.addEventListener('pagehide', (e) => {
    if (e.persisted) return;
    if (!logOn) return;
    try { if (buf.length) append(buf.join('')); writeEndMarker(); } catch (err) { console.warn('finalize on tab close failed:', err); }
    finally {
      buf.length = 0; logOn = false; fileHandle = null; fileSize = 0; needNL = false; setIdle();
    }
  }, { capture: true });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); }, { capture: true });
  window.addEventListener('beforeunload', ()=>{ flush(true); if(logOn) writeEndMarker(); }, { capture: true });

  /* ================= OGQ 즐겨찾기 (채팅 입력창 위 별 버튼만) ================= */
  const FKEY='ml_ogq_favs_v1';
  const getFavs = ()=> JSON.parse(localStorage.getItem(FKEY)||'[]');
  const setFavs = (v) => { localStorage.setItem(FKEY, JSON.stringify(v)); schedulePrefsSave(); };
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  function actionBox(){ return document.querySelector('#chatting_area #actionbox .item_box, .chatbox .actionbox .item_box, ul.item_box'); }
  function chatInputRect(){
    const box = document.querySelector('#chatting_area #chat_area, #chat_area') || document.querySelector('#chatting_area');
    const input = document.querySelector('#write_area, textarea[placeholder]');
    return (input || box || document.body).getBoundingClientRect();
  }
  function ensureEmojiOpenSync(){ const c = $('#emoticonContainer'); if(!c || !c.classList.contains('on')) $('#btn_emo')?.click(); }
  async function ensureEmojiOpen(){ ensureEmojiOpenSync(); for(let i=0;i<12;i++){ if($('#emoticonBox')) return $('#emoticonBox'); await sleep(80); } return null; }
  async function switchToOGQRecent(){ const box = await ensureEmojiOpen(); if(!box) return null; const recent = box.querySelector(".tab_area .item_list ul > li[data-type='RECENT'] .ic_clock"); const ogq = box.querySelector(".subTab_area li[data-type='OGQ']"); recent?.click(); await sleep(60); ogq?.click(); await sleep(140); return box; }
  function clickByImgSrc(src){ const box = $('#emoticonBox'); if(!box) return; const a = $$('span > a', box).find(el=>{ const img = el.querySelector('img'); return img && (img.src===src || img.src.startsWith(src) || src.startsWith(img.src)); }); a?.click(); }

  let ogqPanel=null, ogqGrid=null, ogqOpen=false;
  function placeOgqPanel(){ if(!ogqPanel) return; const r = chatInputRect(); const pad = 12; let left = Math.max(pad, Math.min(r.left, window.innerWidth - ogqPanel.offsetWidth - pad)); let top  = Math.max(pad, r.top - ogqPanel.offsetHeight - 8); if(top < pad) { top = r.bottom + 8; } ogqPanel.style.left = `${left}px`; ogqPanel.style.top  = `${top}px`; }
  const rebalanceOgq = ()=> requestAnimationFrame(placeOgqPanel);
  function buildOgqPanel(){ if(ogqPanel) return ogqPanel; ogqPanel = document.createElement('div'); ogqPanel.className = 'ml-ogq-panel'; ogqPanel.setAttribute('data-melder-ui',''); ogqPanel.innerHTML = `
      <div class="ml-ogq-head">
        <div class="ml-ogq-title">OGQ 즐겨찾기</div>
        <div class="ml-ogq-actions">
          <button class="ml-ogq-btn2" data-act="browse">OGQ 목록</button>
          <button class="ml-ogq-btn2" data-act="clear">전체삭제</button>
          <button class="ml-ogq-btn2" data-act="close">닫기</button>
        </div>
      </div>
      <div class="ml-ogq-grid"></div>
    `; ogqGrid = ogqPanel.querySelector('.ml-ogq-grid'); document.body.appendChild(ogqPanel);
    window.addEventListener('resize', rebalanceOgq, {passive:true}); window.addEventListener('scroll',  rebalanceOgq, {passive:true});
    ogqPanel.addEventListener('click', async (e)=>{ const b = e.target.closest('.ml-ogq-btn2'); if(!b) return; const act=b.dataset.act; e.preventDefault(); e.stopPropagation(); if(act==='close'){ toggleOgq(false); } else if(act==='clear'){ setFavs([]); renderFavs(); } else if(act==='browse'){ await openOgqBrowser(); } });
    return ogqPanel;
  }
  function toggleOgq(state){ ogqOpen = (state===undefined) ? !ogqOpen : state; buildOgqPanel(); ogqPanel.style.display = ogqOpen ? 'block' : 'none'; if(ogqOpen){ placeOgqPanel(); renderFavs(); } }
  function renderFavs(){ if(!ogqGrid) return; ogqGrid.innerHTML = ''; const favs = getFavs(); if(!favs.length){ ogqGrid.innerHTML = `<div class="ml-ogq-empty">즐겨찾기가 없습니다. “OGQ 목록”에서 ☆를 눌러 등록하세요.</div>`; return; } favs.forEach(src=>{ const tile = document.createElement('div'); tile.className='ml-ogq-emo'; tile.innerHTML = `<img src="${src}"><span class="ml-ogq-star">★</span>`; tile.onclick = async (e)=>{ e.preventDefault(); e.stopPropagation(); await switchToOGQRecent(); await sleep(60); clickByImgSrc(src); }; ogqGrid.appendChild(tile); }); }
  async function openOgqBrowser(){ const emoBox = await switchToOGQRecent(); if(!emoBox) return; const list = emoBox.querySelector('.emoticon_item'); if(!list) return; ogqGrid.innerHTML = ''; const favs = getFavs(); $$('span > a', list).slice(0, 24).forEach(a=>{ const img = a.querySelector('img'); const src = img?.src||''; const tile = document.createElement('div'); tile.className='ml-ogq-emo'; const starred = favs.includes(src); tile.innerHTML = `<img src="${src}"><span class="ml-ogq-star">${starred?'★':'☆'}</span>`; tile.onclick = (e)=>{ e.preventDefault(); e.stopPropagation(); const star = tile.querySelector('.ml-ogq-star'); const now = getFavs(); if(star.textContent==='☆'){ now.push(src); star.textContent='★'; } else{ const i=now.indexOf(src); if(i>=0) now.splice(i,1); star.textContent='☆'; } setFavs(now); }; ogqGrid.appendChild(tile); }); }
  function mountOgqButton(){
    const box = actionBox(); if(!box) return false;
    if(box.querySelector('.ml-ogq-btn')) return true;
    const li = document.createElement('li'); li.style.margin = '0 3px'; li.setAttribute('data-melder-ui','');
    const a = document.createElement('a'); a.href='#'; a.className='ml-ogq-btn'; a.setAttribute('data-melder-ui',''); a.title='OGQ 즐겨찾기'; a.textContent='★';
    const on = (e)=>{ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); toggleOgq(); };
    a.addEventListener('click', on, {capture:true});
    li.addEventListener('click', on, {capture:true});
    box.appendChild(li); li.appendChild(a);
    return true;
  }

  /* ================= 메뉴 액션 ================= */
  async function startLogging(){ if(logOn) return; await getLogsDir(); const name = await openNewFile(); console.log('[OPFS] logging →', name); logOn=true; setSaving(); updateStatusBox(); }
  async function stopLogging(){ if(!logOn) return; logOn=false; try{ if(buf.length) await append(buf.join('')); buf.length=0; await writeEndMarker(); }catch(e){ console.warn('flush on stop err', e); } if(timer){ clearInterval(timer); timer=null; } fileHandle=null; fileSize=0; needNL=false; setIdle(); updateStatusBox(); }
  function wireMenu(){
    menu.addEventListener('click', async e=>{
      const it=e.target.closest('.item'); if(!it) return;
      const act=it.getAttribute('data-ml'); e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      chip.classList.remove('open');
      if(act==='start') startLogging();
      else if(act==='stop') stopLogging();
      else if(act==='files') openFilesPanel();
      else if(act==='block') showBlockPanel();
    }, {capture:true});
  }

  /* ================= 옵저버(채팅 감지) ================= */
  const pend=new Set(); let raf=0, obs=null;

  // ✅ added node가 "컨테이너(chatting-list-item)"로 들어와도 내부를 찾아서 row로 잡기
  function asRow(node){
    if(!node) return null;
    const el = (node.nodeType===1 ? node : node.parentElement);
    if(!el) return null;

    if(el.matches?.(UI_GUARD)) return null;

    // 1) 본인이 줄이면 바로
    if(el.matches?.('.chatting-list-item')) return el;

    // 2) 자식 안에 줄이 있으면 그걸로
    const innerLine = el.querySelector?.('.chatting-list-item');
    if(innerLine && !innerLine.matches(UI_GUARD)) return innerLine;

    // 3) message-container가 있으면 그 상위 줄로
    const mc = el.closest?.('.message-container') || el.querySelector?.('.message-container');
    if(mc){
      const line = mc.closest?.('.chatting-list-item') || mc;
      if(line && !line.matches(UI_GUARD)) return line;
    }

    // 4) 후원/이벤트 (donation-container)도 줄 기준으로
    const dn = el.closest?.('.donation-container,.donation-bubble,.info-box') || el.querySelector?.('.donation-container,.donation-bubble,.info-box');
    if(dn){
      const line = dn.closest?.('.chatting-list-item') || dn;
      if(line && !line.matches(UI_GUARD)) return line;
    }

    // 5) 마지막 fallback
    const hard = el.closest?.(ROW_SEL) || el.querySelector?.(ROW_SEL);
    if(hard && !hard.matches(UI_GUARD)) return hard;

    return null;
  }

  function enqueue(n){
    const r=asRow(n);
    if(!r) return;
    pend.add(r);
    if(!raf) raf=requestAnimationFrame(flushPend);
  }

  function flushPend(){
    raf=0;
    const arr=[...pend];
    pend.clear();
    arr.forEach(r=>{
      if(r.matches(UI_GUARD)) return;
      onRow(r);
    });
  }

  function attach(root){
    if(obs) obs.disconnect();
    obs=new MutationObserver(ms=>{
      for(const m of ms){
        if(m.type==='childList'){
          m.addedNodes.forEach(n=>enqueue(n));
        } else if(m.type==='characterData'){
          enqueue(m.target);
        }
      }
    });
    obs.observe(root,{childList:true,subtree:true,characterData:true});

    setTimeout(()=>{
      root.querySelectorAll(ROW_SEL).forEach(r=>enqueue(r));
    },200);
  }

  function root(){ return document.querySelector('#chat_area,.chatting_area,[role="list"]') || document.body; }

  /* ================= 프로필/팝업에서 nick↔id 매핑 수집 ================= */
  let mapObs=null;
  function attachNickMapObserver(){
    if(mapObs) mapObs.disconnect();
    mapObs = new MutationObserver(ms=>{
      let changed=false;
      for(const m of ms){
        if(m.type!=='childList') continue;
        for(const n of m.addedNodes){
          if(!n || n.nodeType!==1) continue;
          const rootEl = /** @type {Element} */(n);
          const infos = [];
          if(rootEl.matches?.('.info')) infos.push(rootEl);
          rootEl.querySelectorAll?.('.info')?.forEach(el=>infos.push(el));

          for(const info of infos){
            const nk = clean(info.querySelector('.nick')?.textContent || '');
            const id = (info.querySelector('em')?.textContent || '').trim();
            const tid = toId(id);
            if(nk && tid){
              const k = nk.toLowerCase();
              if(nick2id[k] !== tid){
                nick2id[k] = tid;
                changed=true;
              }
            }
          }
        }
      }
      if(changed){
        saveNickMap();
        applyBlockToExistingRows();
      }
    });
    mapObs.observe(document.body, {childList:true, subtree:true});
  }

  /* ================= 부팅 ================= */
  async function boot(){
    injectCSS();
    await syncFromBackupIfEmpty().catch(()=>{});
    try{ nick2id = loadNickMap(); }catch{}
    attachNickMapObserver();

    const initCore = ()=>{
      mountChip();
      attach(root());
      applyBlockToExistingRows();
    };

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initCore);
    else initCore();

    const tryMount = ()=> { if(mountOgqButton()) ogqObs.disconnect(); };
    const ogqObs = new MutationObserver(tryMount);
    ogqObs.observe(document.body, {childList:true, subtree:true});
    tryMount();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

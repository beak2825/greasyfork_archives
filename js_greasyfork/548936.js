// ==UserScript==
// @name         多页接力刷新 + 指定字符触发统一停刷与单页点击（可设页数/是否等加载完成）
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  可设启动时间与“多开页数”；严格接力刷新（1→2→…→N→1，每300ms），可选“等页面加载完成再刷新”；任一页在span内发现指定字符则全体停刷；仅发现页每300ms点击该span；刷新后自动恢复；手机可用（时分秒纯文本输入）。
// @license MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548936/%E5%A4%9A%E9%A1%B5%E6%8E%A5%E5%8A%9B%E5%88%B7%E6%96%B0%20%2B%20%E6%8C%87%E5%AE%9A%E5%AD%97%E7%AC%A6%E8%A7%A6%E5%8F%91%E7%BB%9F%E4%B8%80%E5%81%9C%E5%88%B7%E4%B8%8E%E5%8D%95%E9%A1%B5%E7%82%B9%E5%87%BB%EF%BC%88%E5%8F%AF%E8%AE%BE%E9%A1%B5%E6%95%B0%E6%98%AF%E5%90%A6%E7%AD%89%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%88%90%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548936/%E5%A4%9A%E9%A1%B5%E6%8E%A5%E5%8A%9B%E5%88%B7%E6%96%B0%20%2B%20%E6%8C%87%E5%AE%9A%E5%AD%97%E7%AC%A6%E8%A7%A6%E5%8F%91%E7%BB%9F%E4%B8%80%E5%81%9C%E5%88%B7%E4%B8%8E%E5%8D%95%E9%A1%B5%E7%82%B9%E5%87%BB%EF%BC%88%E5%8F%AF%E8%AE%BE%E9%A1%B5%E6%95%B0%E6%98%AF%E5%90%A6%E7%AD%89%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%88%90%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*********** 默认参数（可被面板设置覆盖） ***********/
  const DEFAULT_GAP_MS = 300;     // 接力间隔固定为 300ms（如需面板可改，可再加输入框）
  const DEFAULT_PAGES  = 3;       // 默认总页数（含当前页）
  const SCAN_INTERVAL_MS  = 120;
  const CLICK_INTERVAL_MS = 300;

  /*********** Key 与通道 ***********/
  const STATE_KEY = `tmx_state::${location.origin}${location.pathname}`;
  const CHAN_KEY  = `tmx_chan::${location.origin}${location.pathname}`;
  const LEASE_KEY = `tmx_lease::${location.origin}${location.pathname}`;
  const INSTANCE_ID = Math.random().toString(36).slice(2);

  /*********** 状态存取 ***********/
  function readState() { try{const v=localStorage.getItem(STATE_KEY);return v?JSON.parse(v):null;}catch{return null;} }
  function writeState(patch){const cur=readState()||{};const nxt={...cur,...patch};try{localStorage.setItem(STATE_KEY,JSON.stringify(nxt));}catch{} return nxt;}
  function clearState(){ try{localStorage.removeItem(STATE_KEY);}catch{} }

  /*********** 槽位分配（0..N-1） ***********/
  const SLOT_KEY='tmx_slot_index';
  let mySlot = initMySlot();
  function initMySlot(){
    const m = location.hash.match(/tm_slot=(\d+)/);
    if (m){ sessionStorage.setItem(SLOT_KEY, m[1]); return Number(m[1]); }
    const saved = sessionStorage.getItem(SLOT_KEY);
    if (saved!=null) return Number(saved);
    sessionStorage.setItem(SLOT_KEY,'0'); return 0;
  }

  /*********** 广播 ***********/
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel(CHAN_KEY) : null;
  function broadcast(msg){ if (bc) bc.postMessage(msg); else localStorage.setItem(CHAN_KEY, JSON.stringify({...msg,_t:Date.now()})); }
  if (bc){ bc.onmessage = (ev)=>handleMsg(ev.data); }
  else { window.addEventListener('storage',(ev)=>{ if(ev.key!==CHAN_KEY||!ev.newValue) return; try{handleMsg(JSON.parse(ev.newValue));}catch{} }); }

  function handleMsg(data){
    if(!data||typeof data!=='object') return;
    switch(data.type){
      case 'CONFIG':{
        const st = writeState({
          enabled: true,
          keyword: data.keyword,
          startAt: data.startAt,
          found: false,
          finderSlot: null,
          targetPath: null,
          batonId: data.batonId,
          batonActive: true,
          batonSlot: -1,
          nextTickAt: data.startAt,
          slotCount: data.slotCount,
          gapMs: data.gapMs,
          waitForLoad: !!data.waitForLoad
        });
        scheduleFromState(st);
        setStatus('已接收配置：等待启动时间。');
        break;
      }
      case 'BATON':{
        const st = readState();
        if(!st||!st.enabled||st.found||!st.batonActive) break;
        // 同步接力节拍
        if (typeof data.nextTickAt === 'number') {
          writeState({ nextTickAt: data.nextTickAt, batonSlot: data.slot });
        }
        if (data.slot === mySlot) {
          doRefreshAccordingToMode(readState());
        }
        break;
      }
      case 'FOUND':{
        const st = writeState({ found:true, targetPath:data.path||null, finderSlot:data.slot, batonActive:false });
        stopBatonLoop();
        if (st.finderSlot===mySlot && st.targetPath) beginClicking(st.targetPath); else stopClicking();
        setStatus('其它标签页已发现关键词，本页停止刷新与点击。');
        break;
      }
      case 'STOP_ALL':{
        stopAll();
        clearState();
        setStatus('收到全局停止指令。');
        break;
      }
    }
  }

  /*********** UI 面板 ***********/
  createPanel();
  function createPanel(){
    if(document.getElementById('tmx_ctrl')) return;
    const wrap = document.createElement('div');
    wrap.id='tmx_ctrl';
    wrap.style.cssText='position:fixed;right:10px;bottom:10px;z-index:999999;background:rgba(0,0,0,.65);color:#fff;padding:10px;border-radius:10px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.3);backdrop-filter:blur(6px)';
    wrap.innerHTML = `
      <div style="display:flex;gap:6px;align-items:center;max-width:340px">
        <div style="font-weight:600">多页接力刷新</div>
        <button id="tmx_toggle" style="margin-left:auto;border:none;border-radius:8px;padding:4px 8px;cursor:pointer;background:#444;color:#eee">折叠</button>
      </div>
      <div id="tmx_body" style="margin-top:8px">
        <div style="margin-top:6px;">
          <div style="margin-bottom:4px;">关键词（在 <code>span</code> 内出现即触发）</div>
          <input id="tmx_kw" placeholder="例如：立即领取" style="width:100%;padding:6px;border-radius:8px;border:none;outline:none;color:#111"/>
        </div>

        <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>
            <div style="margin-bottom:4px;">启动时间（<code>HH:MM:SS</code>）</div>
            <input id="tmx_time" placeholder="如 14:30:05" inputmode="numeric" pattern="[0-2][0-9]:[0-5][0-9]:[0-5][0-9]" value="00:00:05"
                   style="width:100%;padding:6px;border-radius:8px;border:none;outline:none;color:#111"/>
          </div>
          <div>
            <div style="margin-bottom:4px;">多开页数（≥2）</div>
            <input id="tmx_pages" type="number" min="2" max="10" value="${DEFAULT_PAGES}"
                   style="width:100%;padding:6px;border-radius:8px;border:none;outline:none;color:#111"/>
          </div>
        </div>

        <label style="display:flex;gap:8px;align-items:center;margin-top:10px;user-select:none;cursor:pointer">
          <input id="tmx_waitload" type="checkbox"/>
          <span>等页面加载完成后再刷新</span>
        </label>

        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <button id="tmx_start" style="flex:1;border:none;border-radius:8px;padding:8px 10px;cursor:pointer;background:#35c04a;color:#fff;font-weight:600">启动</button>
          <button id="tmx_stop"  style="flex:1;border:none;border-radius:8px;padding:8px 10px;cursor:pointer;background:#e74c3c;color:#fff;font-weight:600">停止</button>
        </div>
        <div id="tmx_status" style="margin-top:8px;opacity:.9;"></div>
      </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById('tmx_toggle').onclick=()=>{const b=document.getElementById('tmx_body'); b.style.display=b.style.display==='none'?'block':'none';};

    document.getElementById('tmx_start').onclick=()=>{
      const kw = document.getElementById('tmx_kw').value.trim();
      const ts = document.getElementById('tmx_time').value.trim();
      const pages = Math.max(2, Math.min(10, Number(document.getElementById('tmx_pages').value)||DEFAULT_PAGES));
      const waitForLoad = document.getElementById('tmx_waitload').checked;
      if(!kw) return setStatus('请先填写“关键词”。', true);
      const startMs = parseHHMMSS(ts); if(startMs==null) return setStatus('时间格式应为 HH:MM:SS，例如 14:30:05。', true);

      // 在用户手势中打开副本（页数-1个）
      openClones(pages);

      const delay   = msUntilTodayTime(startMs);
      const startAt = Date.now()+delay;
      const batonId = Date.now()+'-'+Math.random().toString(36).slice(2,8);

      writeState({
        enabled:true, keyword:kw, startAt,
        found:false, finderSlot:null, targetPath:null,
        batonId, batonActive:true, batonSlot:-1,
        nextTickAt:startAt,
        slotCount:pages, gapMs:DEFAULT_GAP_MS,
        waitForLoad
      });
      broadcast({ type:'CONFIG', keyword:kw, startAt, batonId, slotCount:pages, gapMs:DEFAULT_GAP_MS, waitForLoad });

      scheduleFromState(readState());
      setStatus(`已启动：将在 ${formatDelay(delay)} 后以 ${pages} 页接力刷新（每棒${DEFAULT_GAP_MS}ms）。`);
    };

    document.getElementById('tmx_stop').onclick=()=>{
      stopAll(); clearState(); broadcast({type:'STOP_ALL'}); setStatus('已手动停止。');
    };
  }

  function setStatus(msg,isErr=false){ const el=document.getElementById('tmx_status'); if(!el) return; el.textContent=msg; el.style.color=isErr?'#ffd1d1':'#d5f8d5'; }

  /*********** 恢复与调度 ***********/
  let scanTimer=null, clickTimer=null, batonTimer=null, stopped=false;

  restoreOnLoad();
  function restoreOnLoad(){
    const st=readState(); if(!st||!st.enabled) return;
    scheduleFromState(st);
    if(st.found){
      stopBatonLoop();
      if(st.finderSlot===mySlot && st.targetPath){ beginClicking(st.targetPath); setStatus('恢复：我是发现者，继续点击目标 span。'); }
      else { stopClicking(); setStatus('恢复：关键词已被发现，本页停止刷新与点击。'); }
    }else{
      setStatus('已恢复：等待启动时间或继续接力。');
    }
  }

  function scheduleFromState(st){
    stopClicking(); stopBatonLoop(); if(scanTimer){clearInterval(scanTimer);scanTimer=null;} stopped=false;
    const delay=Math.max(0,(st.startAt||0)-Date.now());
    setTimeout(()=>{ const s=readState(); if(!s||s.found||!s.enabled) return; startBatonLoop(); startScanForKeyword(s.keyword); }, delay);
    if(delay===0){ startBatonLoop(); startScanForKeyword(st.keyword); }
  }

  /*********** 打开副本（按设定页数） ***********/
  function openClones(pages){
    try{
      const base=stripSlotFromHash(location.href);
      const tasks=[];
      for(let i=1;i<pages;i++){ tasks.push(appendSlot(base,i)); }
      const anchors = tasks.map(url=>{ const a=document.createElement('a'); a.href=url; a.target='_blank'; a.rel='noopener'; document.body.appendChild(a); return a; });
      // 点击方式（成功率高）
      anchors.forEach((a,idx)=>setTimeout(()=>a.click(), idx*80));
      // window.open 兜底
      setTimeout(()=>{ tasks.forEach(url=>{ try{window.open(url,'_blank','noopener');}catch{} }); }, 120+tasks.length*80);
      setTimeout(()=>anchors.forEach(a=>a.remove()), 500);

      // 降级：提供手动按钮
      setTimeout(()=>{
        if(!document.getElementById('tmx_fallback')){
          const box=document.createElement('div');
          box.id='tmx_fallback';
          box.style.cssText='position:fixed;left:10px;bottom:10px;z-index:999999;background:rgba(0,0,0,.7);color:#fff;padding:8px 10px;border-radius:8px;font-size:14px;max-width:90vw';
          const links = tasks.map((u,i)=>`<a href="${u}" target="_blank" rel="noopener" style="background:#409eff;color:#fff;padding:6px 10px;border-radius:8px;text-decoration:none;display:inline-block;margin:4px 6px 0 0">打开副本 ${i+1}</a>`).join('');
          box.innerHTML = `<div style="margin-bottom:6px">⚠️ 可能拦截了多标签打开，如未成功请手动点：</div><div>${links}<button id="tmx_fb_close" style="background:#e74c3c;color:#fff;padding:6px 10px;border:none;border-radius:8px;cursor:pointer;margin-left:6px">关闭</button></div>`;
          document.body.appendChild(box);
          document.getElementById('tmx_fb_close').onclick=()=>box.remove();
        }
      }, 400);
    }catch(e){ console.warn('打开副本失败：', e); }
  }
  function appendSlot(url,idx){ return url.includes('#') ? url+(url.endsWith('#')?'':'&')+`tm_slot=${idx}` : url+`#tm_slot=${idx}`; }
  function stripSlotFromHash(url){
    if(!url.includes('#')) return url;
    const [base, hash] = url.split('#');
    const parts = hash.split('&').filter(p=>!/^tm_slot=\d+/.test(p));
    return parts.length ? base + '#' + parts.join('&') : base;
  }

  /*********** 接力推进（不等待重载） ***********/
  function startBatonLoop(){
    if(batonTimer) return;
    batonTimer = setInterval(()=>{
      const st=readState(); if(!st||!st.enabled||st.found||!st.batonActive) return;
      const now=Date.now(); if(now < (st.nextTickAt||0)) return;
      if(!acquireLease(100)) return;
      try{
        const slotCount = Math.max(2, Number(st.slotCount)||DEFAULT_PAGES);
        const gapMs = Number(st.gapMs)||DEFAULT_GAP_MS;
        const cur = (typeof st.batonSlot==='number') ? st.batonSlot : -1;
        const nxt = (cur<0) ? 0 : ((cur+1)%slotCount);
        const nextAt = (st.nextTickAt||now) + gapMs;

        writeState({ batonSlot:nxt, nextTickAt:nextAt });
        broadcast({ type:'BATON', slot:nxt, nextTickAt:nextAt });

        if (nxt === mySlot && !readState()?.found) {
          doRefreshAccordingToMode(readState());
        }
      }finally{
        releaseLease();
      }
    }, 40);
  }
  function stopBatonLoop(){ if(batonTimer){clearInterval(batonTimer);batonTimer=null;} }
  function acquireLease(ms){
    try{
      const now=Date.now();
      const v=localStorage.getItem(LEASE_KEY);
      if(v){ const o=JSON.parse(v); if(o.until && o.until>now && o.owner!==INSTANCE_ID) return false; }
      localStorage.setItem(LEASE_KEY, JSON.stringify({owner:INSTANCE_ID, until: now+ms}));
      const chk = JSON.parse(localStorage.getItem(LEASE_KEY)||'{}');
      return chk.owner===INSTANCE_ID;
    }catch{ return false; }
  }
  function releaseLease(){
    try{
      const v=localStorage.getItem(LEASE_KEY);
      const o=v?JSON.parse(v):{};
      if(o.owner===INSTANCE_ID) localStorage.setItem(LEASE_KEY, JSON.stringify({owner:INSTANCE_ID, until:0}));
    }catch{}
  }

  // 根据“是否等加载完成”执行刷新
  function doRefreshAccordingToMode(st){
    const wait = !!(st && st.waitForLoad);
    if (!wait) { location.reload(); return; }
    // 等待文档加载完成再刷新（若已完成则立即刷新）
    if (document.readyState === 'complete') { location.reload(); return; }
    const handler = () => { try{ location.reload(); } finally { cleanup(); } };
    const cleanup = ()=>{
      window.removeEventListener('load', handler,true);
      document.removeEventListener('readystatechange', rsHandler,true);
    };
    const rsHandler = () => { if (document.readyState === 'complete') handler(); };
    window.addEventListener('load', handler, true);
    document.addEventListener('readystatechange', rsHandler, true);
    // 兜底：最多等待 8 秒
    setTimeout(()=>{ cleanup(); location.reload(); }, 8000);
  }

  /*********** 扫描 & 发现 ***********/
  function startScanForKeyword(keyword){
    if(!keyword) return;
    const match = (t)=> t!=null && String(t).includes(keyword);
    const mo = new MutationObserver(()=>scan());
    mo.observe(document.documentElement||document.body,{childList:true,subtree:true,characterData:true});
    scanTimer = setInterval(scan, SCAN_INTERVAL_MS);

    function scan(){
      const st=readState();
      if(!st||st.found){ mo.disconnect(); clearInterval(scanTimer); scanTimer=null; return; }
      if(stopped) return;
      const spans = document.querySelectorAll('span');
      for (const sp of spans){
        const txt = (sp.innerText||sp.textContent||'').trim();
        if(match(txt)){
          const path = uniquePath(sp);
          writeState({ found:true, targetPath:path, finderSlot:mySlot, batonActive:false });
          broadcast({ type:'FOUND', slot:mySlot, path, text:txt });
          onFoundLocal(path);
          mo.disconnect(); clearInterval(scanTimer); scanTimer=null;
          break;
        }
      }
    }
  }
  function onFoundLocal(path){
    stopBatonLoop();
    beginClicking(path);
    setStatus('已发现关键词，本页负责点击该 span（每300ms）。其它标签页已停止刷新。');
  }

  /*********** 点击（仅发现者） ***********/
  function beginClicking(path){
    stopClicking(); if(!path) return;
    clickTimer = setInterval(()=>{
      const node = queryByUniquePath(path);
      if (node && node.tagName && node.tagName.toLowerCase()==='span') { try{ node.click(); }catch{} }
    }, CLICK_INTERVAL_MS);
  }
  function stopClicking(){ if(clickTimer){clearInterval(clickTimer);clickTimer=null;} }

  /*********** 停止 ***********/
  function stopAll(){ stopped=true; stopBatonLoop(); if(scanTimer){clearInterval(scanTimer);scanTimer=null;} stopClicking(); writeState({enabled:false,batonActive:false}); }

  /*********** 工具：时间与选择器 ***********/
  function parseHHMMSS(str){
    const m=String(str).match(/^(\d{1,2}):(\d{2}):(\d{2})$/); if(!m) return null;
    const h=+m[1], mi=+m[2], s=+m[3]; if(h<0||h>23||mi<0||mi>59||s<0||s>59) return null;
    return (h*3600+mi*60+s)*1000;
  }
  function msUntilTodayTime(targetMs){
    const now=new Date();
    const todayMs=now.getHours()*3600000+now.getMinutes()*60000+now.getSeconds()*1000+now.getMilliseconds();
    let d=targetMs-todayMs; if(d<0) d+=86400000; return d;
  }
  function formatDelay(ms){ const s=Math.floor(ms/1000); const hh=String(Math.floor(s/3600)).padStart(2,'0'); const mm=String(Math.floor((s%3600)/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); return `${hh}:${mm}:${ss}`; }

  function uniquePath(el){
    if(!el) return ''; if(el.id) return `#${cssEscape(el.id)}`;
    const parts=[]; let node=el;
    while(node&&node.nodeType===1&&node!==document.body){
      let sel=node.nodeName.toLowerCase();
      if(node.className&&typeof node.className==='string'){
        const cn=node.className.trim().split(/\s+/).slice(0,2).map(cssEscape).join('.');
        if(cn) sel+='.'+cn;
      }
      let idx=1,sib=node; while((sib=sib.previousElementSibling)!=null){ if(sib.nodeName===node.nodeName) idx++; }
      sel+=`:nth-of-type(${idx})`;
      parts.unshift(sel);
      node=node.parentElement;
    }
    return parts.length?parts.join(' > '):'span';
  }
  function cssEscape(str){ return String(str).replace(/[^a-zA-Z0-9_-]/g,'\\$&'); }
  function queryByUniquePath(path){ try{ return document.querySelector(path); }catch{ return null; } }

})();

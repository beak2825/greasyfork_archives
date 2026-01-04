// ==UserScript==
// @name         AFK by T.Venera
// @namespace    http://tampermonkey.net/
// @version      1000-7
// @description  Т1
// @author       Tim_Venera
// @match        https://forum.blackrussia.online/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/555351/AFK%20by%20TVenera.user.js
// @updateURL https://update.greasyfork.org/scripts/555351/AFK%20by%20TVenera.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // -----------------------
  // 
  // -----------------------
  const gmGet = (k, def) => GM.getValue(k).then(v => (typeof v === 'undefined' ? def : v));
  const gmSet = (k, v) => GM.setValue(k, v);
  const gmDel = (k) => GM.deleteValue(k);

  async function sha256hex(s) {
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest('SHA-256', enc.encode(s));
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  const DEFAULT_ADMIN_HASH = 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270'; // 

  // -----------------------
  // 
  // -----------------------
  const state = {
    refreshCount: Number(await gmGet('afk:refreshCount', 0)),
    totalFound: Number(await gmGet('afk:totalFound', 0)),
    foundThreads: JSON.parse(await gmGet('afk:foundThreads', '[]')),
    ignoredThreads: JSON.parse(await gmGet('afk:ignoredThreads', '[]')),
    backupHistory: JSON.parse(await gmGet('afk:backupHistory', '[]')),
    interval: Number(await gmGet('afk:interval', 30)),
    autoRefresh: await gmGet('afk:autoRefresh', false),
    soundIndex: Number(await gmGet('afk:soundIndex', 0)),
    soundVolume: Number(await gmGet('afk:soundVolume', 0.75)),
    soundData: await gmGet('afk:soundData', null),
    adminHash: await gmGet('afk:adminHash', null),
    scanningEnabled: await gmGet('afk:scanningEnabled', true),
    displayScope: await gmGet('afk:displayScope', 'twoForums'),
    customPath: await gmGet('afk:customPath', ''),
    layout: JSON.parse(await gmGet('afk:layout', JSON.stringify(['settings','toggle','reload']))),
    customButtons: JSON.parse(await gmGet('afk:customButtons', '[]')),
    logs: JSON.parse(await gmGet('afk:logs', '[]')),
    knownClients: JSON.parse(await gmGet('afk:knownClients', '[]')),
    blockedIds: JSON.parse(await gmGet('afk:blockedIds', '[]')),
    customFuncNames: JSON.parse(await gmGet('afk:customFuncNames', '["Проверить","Обновление","Проверка"]'))
  };

  state.refreshCount++;
  await gmSet('afk:refreshCount', state.refreshCount);

  // -----------------------
  // 
  // -----------------------
  function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function createModal(contentEl){
    const prev = document.querySelector('.afk-modal-overlay'); if (prev) prev.remove();
    const overlay = document.createElement('div'); overlay.className = 'afk-modal-overlay';
    const wrap = document.createElement('div'); wrap.className = 'afk-modal'; wrap.appendChild(contentEl); overlay.appendChild(wrap);
    document.body.appendChild(overlay); return overlay;
  }
  async function pushLog(action, data){
    const logs = JSON.parse(await gmGet('afk:logs','[]')) || [];
    logs.push({ ts: Date.now(), action, data });
    if (logs.length > 5000) logs.splice(0, logs.length-5000);
    await gmSet('afk:logs', JSON.stringify(logs));
  }

  // -----------------------
  // 
  // -----------------------
  const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
  :root{--fg:#e8f6ff;--accent:#4ef7b6;--danger:#ff6b6b;--panel-bg:rgba(6,10,20,0.96);--glass-border:rgba(255,255,255,0.04);}
  #afkContainer{position:fixed; right:18px; bottom:18px; z-index:2147483646; display:flex; flex-direction:column; gap:12px; align-items:flex-end; font-family:Inter,system-ui;}
  .afk-btn{border:none; cursor:grab; padding:10px 14px; border-radius:12px; font-weight:800; color:var(--fg); background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); box-shadow:0 10px 30px rgba(0,0,0,0.45); transition:transform .25s,box-shadow .25s,background .25s; display:inline-flex; align-items:center; gap:8px;}
  .afk-btn:active{cursor:grabbing;}
  .afk-btn:hover{transform:translateY(-4px) scale(1.02);}
  #toggleAFK{min-width:160px;height:52px;border-radius:16px;position:relative;overflow:visible;display:flex;justify-content:center;align-items:center;font-size:15px;}
  #toggleAFK .glow{position:absolute; left:-10%; right:-10%; top:-10%; bottom:-10%; border-radius:20px; pointer-events:none; opacity:0; transform:scale(.96); transition:opacity .9s, transform .9s;}
  #toggleAFK.on{background:linear-gradient(135deg,#a8ffd6,#3bc07b); color:#022217; box-shadow:0 18px 60px rgba(59,192,123,0.18);}
  #toggleAFK.off{background:linear-gradient(135deg,#ffb6b6,#d94d4d); color:#fff; box-shadow:0 18px 60px rgba(217,77,77,0.12);}
  #toggleAFK.on .glow{opacity:1;transform:scale(1.06);background:radial-gradient(circle at 50% 20%, rgba(78,247,182,0.14), rgba(78,247,182,0.03) 25%, transparent 60%);}
  #toggleAFK.off .glow{opacity:1;transform:scale(1.06);background:radial-gradient(circle at 50% 20%, rgba(255,107,107,0.14), rgba(255,107,107,0.03) 25%, transparent 60%);}
  #toggleAFK .mark{font-size:22px;transition:transform .9s cubic-bezier(.2,.9,.2,1), opacity .6s; display:inline-block; margin-right:6px;}
  #afkTimer{position:fixed; top:14px; right:14px; z-index:2147483645; padding:8px 12px; border-radius:18px; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); color:var(--fg); border:1px solid var(--glass-border); font-weight:700; box-shadow:0 8px 28px rgba(0,0,0,0.45); cursor:pointer;}
  #adminCrown{position:fixed; left:12px; top:12px; z-index:2147483647; width:46px; height:46px; border-radius:12px; display:grid; place-items:center; font-size:18px; cursor:pointer; border:1px solid rgba(255,255,255,0.03); background:linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); box-shadow:0 14px 40px rgba(0,0,0,0.5);}
  .afk-settings{position:fixed; right:20px; bottom:86px; z-index:2147483646; width:760px; max-width:calc(100% - 40px); border-radius:14px; padding:12px; background:var(--panel-bg); border:1px solid var(--glass-border); color:var(--fg); box-shadow:0 20px 80px rgba(0,0,0,0.6); display:none; overflow:hidden;}
  .afk-settings .header{display:flex; align-items:center; justify-content:space-between;}
  .afk-settings .tabs{display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;}
  .afk-settings .tabs button{background:transparent; border:1px solid rgba(255,255,255,0.03); padding:8px 10px; border-radius:10px; cursor:pointer; color:var(--fg);}
  .afk-settings .tabs button.active{background:linear-gradient(90deg, rgba(122,252,255,0.06), rgba(255,128,214,0.03)); box-shadow:0 8px 26px rgba(122,252,255,0.03); transform:translateY(-3px);}
  .afk-settings .content{margin-top:12px; max-height:560px; overflow:auto; padding-right:8px; font-size:14px;}
  .section{padding:8px 0;border-bottom:1px dashed rgba(255,255,255,0.03);}
  .small{font-size:13px;color:rgba(255,255,255,0.78);}
  .vk-button{position:fixed; left:14px; bottom:14px; z-index:2147483647; width:64px; height:64px; border-radius:50%; display:grid; place-items:center; cursor:pointer; box-shadow:0 8px 28px rgba(0,0,0,0.45); overflow:hidden; border:1px solid rgba(255,255,255,0.02); background:#fff;}
  .vk-button img{width:100%; height:100%; object-fit:cover; border-radius:50%;}
  .vk-label{position:fixed; left:14px; bottom:84px; z-index:2147483647; font-family:'Inter', sans-serif; font-size:16px; color:var(--accent); animation: floaty 2.6s ease-in-out infinite; text-align:center; pointer-events:none;}
  @keyframes floaty {0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
  .current-item{padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;}
  .afk-modal-overlay{position:fixed; inset:0; z-index:2147483650; display:flex; align-items:center; justify-content:center; background: linear-gradient(0deg, rgba(2,6,12,0.6), rgba(2,6,12,0.4)); }
  .afk-modal{width:min(900px,96%); border-radius:14px; padding:16px; background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.04);}
  `;
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);

  // -----------------------
  // 
  // -----------------------
  const AudioEngine = (function () {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let interval = null, nodes = [], audioEl = null;
    function stopAll(){ if (interval) { clearInterval(interval); interval=null; } try{ nodes.forEach(n=>{ if(n.stop) n.stop(); if(n.disconnect) n.disconnect(); }); }catch(e){} nodes=[]; if (audioEl){ try{ audioEl.pause(); audioEl.currentTime=0; }catch(e){} audioEl=null; } }
    function ensure(){ try{ if (ctx.state==='suspended') ctx.resume(); }catch(e){} }
    function loopOsc(idx, vol){ stopAll(); ensure(); const gain = ctx.createGain(); gain.gain.value = vol; gain.connect(ctx.destination); nodes.push(gain);
      if (idx===0){ interval=setInterval(()=>{ const o=ctx.createOscillator(); o.type='sine'; o.frequency.value=880; const g=ctx.createGain(); o.connect(g); g.connect(gain); const now=ctx.currentTime; g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(1, now+0.01); g.gain.exponentialRampToValueAtTime(0.001, now+0.35); o.start(now); o.stop(now+0.36); nodes.push(o,g); }, 1200); }
      else if (idx===1){ interval=setInterval(()=>{ const now=ctx.currentTime; const o1=ctx.createOscillator(); o1.type='triangle'; o1.frequency.value=660; const o2=ctx.createOscillator(); o2.type='sine'; o2.frequency.value=880; const g1=ctx.createGain(), g2=ctx.createGain(); o1.connect(g1); o2.connect(g2); g1.connect(gain); g2.connect(gain); g1.gain.linearRampToValueAtTime(0.8, now+0.02); g1.gain.exponentialRampToValueAtTime(0.001, now+1.2); g2.gain.linearRampToValueAtTime(0.5, now+0.02); g2.gain.exponentialRampToValueAtTime(0.001, now+1.2); o1.start(now); o2.start(now); o1.stop(now+1.25); o2.stop(now+1.25); nodes.push(o1,o2,g1,g2); },1600); }
      else if (idx===2){ interval=setInterval(()=>{ const now=ctx.currentTime; const o=ctx.createOscillator(); o.type='sine'; o.frequency.value=120; const g=ctx.createGain(); o.connect(g); g.connect(gain); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(1, now+0.01); g.gain.exponentialRampToValueAtTime(0.001, now+0.28); o.start(now); o.stop(now+0.3); nodes.push(o,g); },800); }
      else { interval=setInterval(()=>{ const now=ctx.currentTime; [900,760,620].forEach((f,i)=>{ const o=ctx.createOscillator(); o.type='square'; o.frequency.value=f; const g=ctx.createGain(); o.connect(g); g.connect(gain); const t=now+i*0.12; g.gain.linearRampToValueAtTime(1, t+0.01); g.gain.exponentialRampToValueAtTime(0.001, t+0.3); o.start(t); o.stop(t+0.32); nodes.push(o,g); }); },1800); }
    }

    async function play(indexOrUrl, vol=0.75){
      stopAll();
      try{ if (ctx.state === 'suspended') await ctx.resume(); }catch(e){}
      const soundData = await gmGet('afk:soundData', null);
      if (soundData) {
        audioEl = document.createElement('audio'); audioEl.src = soundData; audioEl.loop = true; audioEl.volume = vol;
        try { await audioEl.play(); } catch(e) {}
        return;
      }
      loopOsc(indexOrUrl || 0, vol);
    }
    return { play, stop: stopAll };
  })();

  // -----------------------
  // 
  // -----------------------
  function inDisplayScope(){
    if (state.displayScope === 'everywhere') return true;
    if (state.displayScope === 'twoForums') {
      const u = location.href;
      return u.includes('/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2332/') ||
             u.includes('/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.2312/');
    }
    if (state.displayScope === 'custom' && state.customPath) return location.href.includes(state.customPath);
    return false;
  }

  // -----------------------
  // 
  // -----------------------
  function ensureSignature(){
    if (!document.getElementById('afkSignature')) {
      const sig = document.createElement('div'); sig.id='afkSignature'; sig.style.position='fixed'; sig.style.left='50%'; sig.style.transform='translateX(-50%)'; sig.style.bottom='6px'; sig.style.zIndex='2147483647'; sig.style.color='rgba(255,255,255,0.75)'; sig.style.fontSize='11px'; sig.style.pointerEvents='none';
      sig.textContent = 'by Tim_Venera';
      document.body.appendChild(sig);
      // shadow host to make casual replacement harder
      const host = document.createElement('div'); host.id='afk_sig_host'; host.style.position='fixed'; host.style.left='-9999px'; host.style.top='-9999px'; try{ const root = host.attachShadow({mode:'closed'}); const s=document.createElement('span'); s.textContent='by Tim_Venera'; root.appendChild(s); document.documentElement.appendChild(host);}catch(e){}
    }
  }
  function ensureVK(){
    if (!document.getElementById('afkVK')) {
      // 
      const host = document.createElement('div'); host.id='afkVK'; host.className='vk-button'; host.style.zIndex='2147483647';
      const img = document.createElement('img'); img.src = 'https://w7.pngwing.com/pngs/995/569/png-transparent-vk-social-media-logo-social-media-logo-social-brand-3d-icon.png'; img.alt='vk';
      host.appendChild(img);
      host.addEventListener('click', ()=> window.open('https://vk.com/imaginemp','_blank'));
      document.body.appendChild(host);
      if (!document.getElementById('afkVKLabel')) {
        const lbl = document.createElement('div'); lbl.id='afkVKLabel'; lbl.className='vk-label'; lbl.innerText='👇 мой вк'; document.body.appendChild(lbl);
      }
    }
  }

  // -----------------------
  // 
  // -----------------------
  function buildMainUI(){
    // 
    const prev = document.getElementById('afkContainer'); if (prev) prev.remove();

    if (!inDisplayScope()) {
      // 
      if (!document.getElementById('afkSettingsQuick')) {
        const quick = document.createElement('button'); quick.id='afkSettingsQuick'; quick.className='afk-btn'; quick.style.position='fixed'; quick.style.top='8px'; quick.style.right='8px'; quick.style.zIndex='2147483650'; quick.style.padding='8px 10px'; quick.innerText='⚙ Скрипт (настройки)'; quick.addEventListener('click', ()=> toggleSettingsPanel()); document.body.appendChild(quick);
      }
      ensureSignature(); ensureVK();
      return;
    } else {
      const q = document.getElementById('afkSettingsQuick'); if (q) q.remove();
    }

    const container = document.createElement('div'); container.id='afkContainer';
    for (const key of state.layout) {
      if (key === 'settings') {
        const b = document.createElement('button'); b.id='settingsButton'; b.className='afk-btn'; b.dataset.key='settings'; b.innerText='⚙️ Настройки'; container.appendChild(b);
      } else if (key === 'toggle') {
        const b = document.createElement('button'); b.id='toggleAFK'; b.className='afk-btn ' + (state.scanningEnabled ? 'on' : 'off'); b.dataset.key='toggle';
        b.innerHTML = `<div class="glow"></div><span class="mark">${state.scanningEnabled ? '✔️' : '❌'}</span><span class="labelText">${state.scanningEnabled ? 'AFK ON' : 'AFK OFF'}</span>`;
        container.appendChild(b);
      } else if (key === 'reload') {
        const b = document.createElement('button'); b.id='reloadBtn'; b.className='afk-btn'; b.dataset.key='reload'; b.innerText='↻ Перезагрузить'; container.appendChild(b);
      } else {
        const cb = state.customButtons.find(x=>x.id===key);
        const label = cb ? cb.label : key;
        const color = cb ? cb.color : '';
        const b = document.createElement('button'); b.className='afk-btn'; b.dataset.key=key; b.dataset.customId = cb ? cb.id : ''; b.innerText = label;
        if (color) b.style.background = color;
        container.appendChild(b);
      }
    }
    document.body.appendChild(container);

    // timer
    let timer = document.getElementById('afkTimer'); if (!timer){ timer = document.createElement('div'); timer.id='afkTimer'; document.body.appendChild(timer); }
    timer.innerText = state.autoRefresh ? `Обновление через ${state.interval}s` : 'Автообновление: выкл';
    timer.addEventListener('click', ()=> { scanDOMForWaiting(); });

    // 
    let crown = document.getElementById('adminCrown'); if (!crown){ crown = document.createElement('div'); crown.id='adminCrown'; crown.title='Admin Panel'; crown.innerHTML='👑'; document.body.appendChild(crown); }
    crown.onclick = openAdminLogin;

    // 
    ensureVK(); ensureSignature();

    attachMainHandlers();
  }

  // -----------------------
  // 
  // -----------------------
  function attachMainHandlers(){
    const container = document.getElementById('afkContainer');
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll('.afk-btn'));
    buttons.forEach(btn => {
      btn.draggable = true;
      btn.addEventListener('dragstart', (e) => { try{ e.dataTransfer.setData('text/plain', btn.dataset.key || btn.dataset.customId || btn.id); }catch(e){} btn.style.opacity='0.5'; });
      btn.addEventListener('dragend', ()=> { btn.style.opacity=''; });
      // click actions
      if (btn.id === 'settingsButton') btn.onclick = ()=> toggleSettingsPanel();
      else if (btn.id === 'toggleAFK') btn.onclick = ()=> setScanning(!state.scanningEnabled);
      else if (btn.id === 'reloadBtn') btn.onclick = ()=> location.reload();
      else btn.onclick = ()=> { alert('Кнопка: ' + (btn.innerText || btn.dataset.key)); };
    });

    container.addEventListener('dragover', (e)=> e.preventDefault());
    container.addEventListener('drop', async (e)=> {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain'); if (!id) return;
      // 
      state.layout = state.layout.filter(k => k !== id);
      // 
      const children = Array.from(container.children);
      let insertIndex = children.length;
      for (let i=0;i<children.length;i++){
        const rect = children[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height/2) { insertIndex = i; break; }
      }
      state.layout.splice(insertIndex, 0, id);
      await gmSet('afk:layout', JSON.stringify(state.layout));
      await pushLog('layout_changed', {layout: state.layout});
      buildMainUI();
      attachMainHandlers();
    });
  }

  // -----------------------
  // 
  // -----------------------
  function isWaitingSpan(node){
    try {
      if (!node || node.nodeType !== 1) return false;
      if (node.tagName.toLowerCase() !== 'span') return false;
      const dir = node.getAttribute('dir') || '';
      if (dir !== 'auto') return false;
      const cls = (node.className || '').split(/\s+/);
      if (!(cls.includes('label') && cls.includes('label--silver'))) return false;
      return (node.textContent || '').trim() === 'Ожидание';
    } catch(e){ return false; }
  }

  async function handleFound(title, url){
    if (!url) return;
    if (state.ignoredThreads.includes(url)) return;
    if (state.foundThreads.includes(url)) return;
    state.foundThreads.push(url);
    state.totalFound++;
    await gmSet('afk:foundThreads', JSON.stringify(state.foundThreads));
    await gmSet('afk:totalFound', state.totalFound);
    updateUIcounts();
    await pushLog('found', {title, url});
    showFoundModal(title, url);
  }

  let activeModal = null;
  function showFoundModal(title, url){
    if (activeModal) return;
    try{ AudioEngine.play(state.soundData || state.soundIndex, state.soundVolume); }catch(e){}
    const content = document.createElement('div'); content.style.width='100%';
    content.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div style="font-weight:900;font-size:16px">Найдена жалоба — Ожидание</div>
      <div style="color:rgba(255,255,255,0.7);font-size:12px">${new Date().toLocaleTimeString()}</div></div>
      <div style="margin-top:8px;font-weight:800">${escapeHtml(title)}</div>
      <div style="margin-top:6px;color:rgba(255,255,255,0.78);font-size:13px">${escapeHtml(url)}</div>
      <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
        <button id="openAndCheck" class="afk-btn">Открыть и проверить</button>
        <button id="seenBtn" class="afk-btn">Увидел / Чекну</button>
        <button id="ignoreBtn" class="afk-btn">Игнорировать</button>
      </div>`;
    const modal = createModal(content); activeModal = modal;
    modal.querySelector('#openAndCheck').onclick = async () => {
      AudioEngine.stop();
      state.ignoredThreads.push(url); state.ignoredThreads = Array.from(new Set(state.ignoredThreads));
      state.foundThreads = state.foundThreads.filter(u=>u!==url);
      await gmSet('afk:ignoredThreads', JSON.stringify(state.ignoredThreads));
      await gmSet('afk:foundThreads', JSON.stringify(state.foundThreads));
      updateUIcounts(); modal.remove(); activeModal = null; window.open(url, '_blank'); await pushLog('openAndCheck',{url});
    };
    modal.querySelector('#seenBtn').onclick = async () => {
      AudioEngine.stop();
      state.foundThreads = state.foundThreads.filter(u=>u!==url);
      await gmSet('afk:foundThreads', JSON.stringify(state.foundThreads));
      updateUIcounts(); modal.remove(); activeModal = null; await pushLog('seen',{url});
    };
    modal.querySelector('#ignoreBtn').onclick = async () => {
      AudioEngine.stop();
      state.ignoredThreads.push(url); state.ignoredThreads = Array.from(new Set(state.ignoredThreads));
      state.foundThreads = state.foundThreads.filter(u=>u!==url);
      await gmSet('afk:ignoredThreads', JSON.stringify(state.ignoredThreads));
      await gmSet('afk:foundThreads', JSON.stringify(state.foundThreads));
      updateUIcounts(); modal.remove(); activeModal = null; await pushLog('ignored',{url});
    };
  }

  // -----------------------
  // 
  // -----------------------
  let observer = null;
  function startObserver(){
    if (observer) return;
    observer = new MutationObserver((mutations)=>{
      for (const m of mutations) {
        const nodes = Array.from(m.addedNodes || []);
        for (const node of nodes) {
          if (!node || node.nodeType !== 1) continue;
          try {
            const spans = node.matches && node.matches('span.label.label--silver[dir="auto"]') ? [node] : Array.from(node.querySelectorAll ? node.querySelectorAll('span.label.label--silver[dir="auto"]') : []);
            for (const s of spans) {
              if (isWaitingSpan(s)) {
                const threadItem = s.closest('div.structItem-cell--main') || s.closest('li') || s.closest('.structItem') || s.parentElement;
                if (!threadItem) continue;
                const link = threadItem.querySelector('a[href*="/threads/"]') || threadItem.querySelector('a');
                if (link) handleFound(link.textContent.trim()||link.getAttribute('title'), new URL(link.getAttribute('href'), location.href).href);
              }
            }
          } catch(e){}
        }
      }
    });
    try{ observer.observe(document.body, {childList:true, subtree:true}); }catch(e){}
  }
  function stopObserver(){ try{ if (observer) observer.disconnect(); observer = null; }catch(e){} }

  function scanDOMForWaiting(){
    const spans = document.querySelectorAll('span.label.label--silver[dir="auto"]');
    for (const s of spans) {
      try {
        if (isWaitingSpan(s)) {
          const threadItem = s.closest('div.structItem-cell--main') || s.closest('li') || s.closest('.structItem') || s.parentElement;
          if (!threadItem) continue;
          const link = threadItem.querySelector('a[href*="/threads/"]') || threadItem.querySelector('a');
          if (link) { handleFound(link.textContent.trim()||link.getAttribute('title'), new URL(link.getAttribute('href'), location.href).href); return true; }
        }
      } catch(e){}
    }
    return false;
  }

  async function fetchAndParsePage(){
    try {
      const resp = await fetch(location.href, { cache:'no-cache', credentials:'include' });
      if (!resp.ok) return false;
      const text = await resp.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const spans = doc.querySelectorAll('span.label.label--silver[dir="auto"]');
      for (const s of spans) {
        if ((s.textContent||'').trim() === 'Ожидание') {
          const threadItem = s.closest('div.structItem-cell--main') || s.closest('li') || s.closest('.structItem') || s.parentElement;
          const link = threadItem ? (threadItem.querySelector('a[href*="/threads/"]') || threadItem.querySelector('a')) : null;
          if (link) {
            const href = new URL(link.getAttribute('href'), location.href).href;
            await handleFound(link.textContent.trim()||link.getAttribute('title'), href); return true;
          }
        }
      }
    } catch(e){}
    return false;
  }

  // -----------------------
  // 
  // -----------------------
  let periodicId = null; let lastScanAt = Date.now();
  async function periodicChecker(){
    if (!state.scanningEnabled) return;
    if (!inDisplayScope()) return;
    if (activeModal) return;
    const found = scanDOMForWaiting();
    if (found) { lastScanAt = Date.now(); return; }
    const now = Date.now();
    if (now - lastScanAt > 4000) {
      const ok = await fetchAndParsePage();
      if (ok) { lastScanAt = Date.now(); return; }
    }
    if (now - lastScanAt > 90000) {
      try { if (state.autoRefresh) location.reload(); else await fetchAndParsePage(); } catch(e){}
      lastScanAt = Date.now();
    }
  }
  function startPeriodic(){ if (!periodicId) periodicId = setInterval(periodicChecker, 2500); }
  function stopPeriodic(){ if (periodicId){ clearInterval(periodicId); periodicId=null; } }

  // -----------------------
  // 
  // -----------------------
  let countdownInterval = null;
  function startCountdown(){
    const te = document.getElementById('afkTimer');
    if (!state.autoRefresh) { if (te) te.innerText = 'Автообновление: выкл'; return; }
    if (countdownInterval) clearInterval(countdownInterval);
    let c = state.interval; if (te) te.innerText = `Обновление через ${c}s`;
    countdownInterval = setInterval(()=>{ c--; if (c<=0){ clearInterval(countdownInterval); countdownInterval=null; if (te) te.innerText='Обновление...'; setTimeout(()=>location.reload(),220); } else if (te) te.innerText = `Обновление через ${c}s`; },1000);
  }
  function stopCountdown(){ if (countdownInterval){ clearInterval(countdownInterval); countdownInterval=null; } const te=document.getElementById('afkTimer'); if (te) te.innerText = state.autoRefresh ? `Обновление через ${state.interval}s` : 'Автообновление: выкл'; }

  // -----------------------
  // 
  // -----------------------
  async function setScanning(enabled){
    state.scanningEnabled = !!enabled;
    await gmSet('afk:scanningEnabled', state.scanningEnabled);
    const toggle = document.getElementById('toggleAFK');
    if (toggle){ toggle.classList.remove('on','off'); toggle.classList.add(state.scanningEnabled ? 'on' : 'off'); const mark = toggle.querySelector('.mark'); const label = toggle.querySelector('.labelText'); if (mark) mark.innerText = state.scanningEnabled ? '✔️' : '❌'; if (label) label.innerText = state.scanningEnabled ? 'AFK ON' : 'AFK OFF'; }
    if (state.scanningEnabled) { startObserver(); startPeriodic(); startCountdown(); } else { stopObserver(); stopPeriodic(); stopCountdown(); AudioEngine.stop(); }
    await pushLog('scanning_toggle', {enabled: state.scanningEnabled});
  }

  // -----------------------
  // 
  // -----------------------
  function updateUIcounts(){
    const panel = document.querySelector('.afk-settings');
    if (panel) {
      const rc = panel.querySelector('#uiRefreshCount'); if (rc) rc.textContent = String(state.refreshCount);
      const tf = panel.querySelector('#uiTotalFound'); if (tf) tf.textContent = String(state.totalFound);
      const q = panel.querySelector('#uiQueue'); if (q) q.textContent = String(state.foundThreads.length);
    }
    const timer = document.getElementById('afkTimer'); if (timer) timer.innerText = state.autoRefresh ? `Обновление через ${state.interval}s` : 'Автообновление: выкл';
  }

  // -----------------------
  // 
  // -----------------------
  function toggleSettingsPanel(){ if (!document.querySelector('.afk-settings')) buildSettingsPanel(); const panel = document.querySelector('.afk-settings'); if (panel.style.display==='none' || !panel.style.display) { panel.style.display='block'; renderSettingsTab('general'); } else panel.style.display='none'; }

  function buildSettingsPanel(){
    if (document.querySelector('.afk-settings')) return;
    const panel = document.createElement('div'); panel.className='afk-settings'; panel.style.display='none';
    panel.innerHTML = `<div class="header"><div style="font-weight:900;font-size:16px">AFK — Настройки</div><div><button id="closeSettings" class="afk-btn">Закрыть</button></div></div>
      <div class="tabs">
        <button data-tab="general" class="active">Общее</button>
        <button data-tab="sounds">Звуки / MP3</button>
        <button data-tab="custom">Кастомизация</button>
        <button data-tab="advanced">Продвинутое</button>
        <button data-tab="about">О скрипте</button>
      </div>
      <div class="content" id="settingsContent"></div>`;
    document.body.appendChild(panel);
    panel.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click', ()=>{
      panel.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderSettingsTab(b.dataset.tab);
    }));
    panel.querySelector('#closeSettings').onclick = ()=> panel.style.display='none';
    renderSettingsTab('general');
  }

  function renderSettingsTab(name){
    const panel = document.querySelector('.afk-settings'); if (!panel) return; const out = panel.querySelector('#settingsContent'); out.innerHTML = '';
    if (name === 'general') {
      out.innerHTML = `
        <div class="section">
          <label><input type="checkbox" id="scanToggle"> Включить AFK-проверку</label>
          <label style="margin-left:12px"><input type="checkbox" id="autoToggle"> Автообновление</label>
        </div>
        <div class="section">Интервал (сек): <input type="number" id="intervalInput" value="${state.interval}" min="5" style="width:90px;">
          <div style="margin-top:8px">Где показывать скрипт:
            <select id="displayScope"><option value="twoForums">Только два форума (жалобы)</option><option value="everywhere">Везде</option><option value="custom">Путь...</option></select>
            <input id="customPath" placeholder="/forums/..." style="width:220px;margin-left:8px;">
          </div>
        </div>
        <div class="section">Найдено тем: <b id="uiTotalFound">${state.totalFound}</b> • В очереди: <b id="uiQueue">${state.foundThreads.length}</b></div>
        <div style="display:flex;gap:8px;margin-top:8px"><button id="saveSettings" class="afk-btn save">Сохранить</button><button id="resetSettings" class="afk-btn warn">Сбросить данные</button><button id="openFoundList" class="afk-btn">Открыть список найденных</button></div>
      `;
      out.querySelector('#scanToggle').checked = state.scanningEnabled;
      out.querySelector('#autoToggle').checked = state.autoRefresh;
      out.querySelector('#displayScope').value = state.displayScope;
      out.querySelector('#customPath').value = state.customPath || '';
      out.querySelector('#intervalInput').value = state.interval;
      out.querySelector('#saveSettings').onclick = async ()=> {
        state.scanningEnabled = !!out.querySelector('#scanToggle').checked;
        state.autoRefresh = !!out.querySelector('#autoToggle').checked;
        const v = Number(out.querySelector('#intervalInput').value) || state.interval; if (v>=5) state.interval = v;
        state.displayScope = out.querySelector('#displayScope').value;
        state.customPath = out.querySelector('#customPath').value || '';
        await gmSet('afk:scanningEnabled', state.scanningEnabled);
        await gmSet('afk:autoRefresh', state.autoRefresh);
        await gmSet('afk:interval', state.interval);
        await gmSet('afk:displayScope', state.displayScope);
        await gmSet('afk:customPath', state.customPath);
        await setScanning(state.scanningEnabled);
        buildMainUI(); startCountdown(); alert('Настройки сохранены.'); pushLog('settings_saved',{state:{scanningEnabled:state.scanningEnabled,autoRefresh:state.autoRefresh,interval:state.interval,displayScope:state.displayScope}});
      };
      out.querySelector('#resetSettings').onclick = async ()=> {
        if (!confirm('Сбросить найденные темы и игнор-лист?')) return;
        state.backupHistory.unshift({ ts: Date.now(), found: state.foundThreads.slice(), ignored: state.ignoredThreads.slice() });
        if (state.backupHistory.length > 20) state.backupHistory.pop();
        await gmSet('afk:backupHistory', JSON.stringify(state.backupHistory));
        state.foundThreads = []; state.ignoredThreads = []; state.totalFound = 0; state.refreshCount = 0; state.scanningEnabled = true;
        await gmSet('afk:foundThreads', JSON.stringify(state.foundThreads));
        await gmSet('afk:ignoredThreads', JSON.stringify(state.ignoredThreads));
        await gmSet('afk:totalFound', state.totalFound);
        await gmSet('afk:refreshCount', state.refreshCount);
        await gmSet('afk:scanningEnabled', state.scanningEnabled);
        await setScanning(true); updateUIcounts(); alert('Данные сброшены.');
      };
      out.querySelector('#openFoundList').onclick = ()=> { const list = state.foundThreads.slice(); if (!list.length) return alert('Список пуст'); const el = document.createElement('div'); el.style.width='100%'; el.innerHTML = `<div style="font-weight:900">Найденные темы</div>`; list.forEach(u=>{ const a=document.createElement('div'); a.style.padding='6px 0'; a.innerText = u; el.appendChild(a); }); createModal(el); };
    }
    else if (name === 'sounds') {
      out.innerHTML = `<div class="section">Выберите встроенный звук: <select id="soundSelect"><option value="0">Short Ding</option><option value="1">Soft Chime</option><option value="2">Bass Pulse</option><option value="3">Arp Melody</option><option value="4">Alert Loop</option></select></div>
        <div class="section">Громкость: <input id="vol" type="range" min="0" max="1" step="0.01" value="${state.soundVolume}"></div>
        <div class="section">Загрузить MP3 или указать URL:<br><input id="mp3file" type="file" accept="audio/*"> <button id="uploadMp3" class="afk-btn">Загрузить</button><br><input id="mp3url" placeholder="https://..." style="width:70%"><button id="saveMp3Url" class="afk-btn">Сохранить URL</button><div class="small" style="margin-top:6px">Текущая: ${state.soundData ? 'MP3 задан' : 'встроенный #' + state.soundIndex}</div></div>
        <div style="display:flex;gap:8px;margin-top:8px"><button id="testSound" class="afk-btn">Тест</button><button id="saveSound" class="afk-btn save">Сохранить</button><button id="stopSound" class="afk-btn warn">Остановить</button></div>`;
      out.querySelector('#soundSelect').value = String(state.soundIndex);
      out.querySelector('#testSound').onclick = ()=> { try{ AudioEngine.play(state.soundData || Number(out.querySelector('#soundSelect').value), Number(out.querySelector('#vol').value)); setTimeout(()=>AudioEngine.stop(), 2000); }catch(e){} };
      out.querySelector('#saveSound').onclick = async ()=> { state.soundIndex = Number(out.querySelector('#soundSelect').value); state.soundVolume = Number(out.querySelector('#vol').value); await gmSet('afk:soundIndex', state.soundIndex); await gmSet('afk:soundVolume', state.soundVolume); alert('Сохранено'); };
      out.querySelector('#stopSound').onclick = ()=> { AudioEngine.stop(); alert('Остановлено'); };
      out.querySelector('#uploadMp3').onclick = async ()=> {
        const f = out.querySelector('#mp3file').files[0];
        if (!f) return alert('Выберите файл');
        const reader = new FileReader();
        reader.onload = async (ev) => { const data = ev.target.result; await gmSet('afk:soundData', data); state.soundData = data; alert('MP3 сохранён (локально)'); pushLog('mp3_upload',{name:f.name,size:f.size}); };
        reader.readAsDataURL(f);
      };
      out.querySelector('#saveMp3Url').onclick = async ()=> {
        const url = out.querySelector('#mp3url').value.trim(); if (!url) return alert('Вставьте URL'); await gmSet('afk:soundData', url); state.soundData = url; alert('URL сохранён');
      };
    }
    else if (name === 'custom') {
      out.innerHTML = `<div class="section"><div style="display:flex;gap:12px;align-items:center"><div style="flex:1"><div style="font-weight:900">Редактор кнопок</div><div class="small">Добавьте/удалите/переупорядочите кнопки. Системные элементы защищены.</div><div style="margin-top:8px"><input id="newButtonLabel" placeholder="Название новой кнопки"><input type="color" id="newButtonColor" class="color-input" value="#7ef0d6"><button id="addButton" class="afk-btn">Добавить</button><button id="saveLayout" class="afk-btn save">Сохранить макет</button><button id="resetLayout" class="afk-btn warn">Откат макета</button></div></div>
        <div style="width:340px"><div style="font-weight:900">Текущий порядок (клик для редактирования):</div><div id="currentOrder" style="margin-top:8px;min-height:140px;padding:8px;border:1px dashed rgba(255,255,255,0.03)"></div></div></div></div>
        <div class="section"><div style="display:flex;gap:8px;align-items:center"><div style="flex:1"><div id="editorTitle" style="font-weight:900">Редактирование: (ничего не выбрано)</div><div class="small">Измените цвет, радиус и тени, затем нажмите Apply или Save.</div><div style="margin-top:8px;display:flex;gap:8px;align-items:center">Цвет: <input id="editColor" type="color" class="color-input" value="#7ef0d6"> Радиус(px): <input id="editRadius" type="number" value="12" style="width:80px"> Тень(px): <input id="editShadow" type="number" value="20" style="width:80px"> <button id="applyBtn" class="afk-btn">Apply</button> <button id="saveBtn" class="afk-btn save">Save</button> <button id="deleteBtn" class="afk-btn warn">Delete</button></div></div><div style="width:200px"><div style="font-weight:900">Preview:</div><div id="previewArea" style="margin-top:8px;padding:12px;border-radius:8px;background:rgba(255,255,255,0.02)"><button id="previewBtnSample" class="afk-btn">BTN</button></div></div></div></div>`;
      const currentOrder = out.querySelector('#currentOrder');
      function renderCurrent(){ currentOrder.innerHTML=''; (state.layout||[]).forEach(key=>{ const div = document.createElement('div'); div.className='current-item'; div.dataset.key=key; let label = key; if (key==='settings') label='Настройки'; else if (key==='toggle') label='AFK Toggle'; else if (key==='reload') label='Перезагрузить'; else { const cb = state.customButtons.find(x=>x.id===key); if (cb) label = cb.label; } div.textContent = label; const edit = document.createElement('button'); edit.className='afk-btn'; edit.style.padding='4px 8px'; edit.innerText='Edit'; div.appendChild(edit); currentOrder.appendChild(div); div.onclick = ()=> selectForEdit(key); edit.onclick = (ev)=>{ ev.stopPropagation(); selectForEdit(key); }; }); }
      renderCurrent();
      out.querySelector('#addButton').onclick = async ()=> { const label = out.querySelector('#newButtonLabel').value.trim(); const color = out.querySelector('#newButtonColor').value; if (!label) return alert('Введите название'); const id = 'btn_' + Date.now(); state.customButtons.push({id,label,color}); state.layout.push(id); await gmSet('afk:customButtons', JSON.stringify(state.customButtons)); await gmSet('afk:layout', JSON.stringify(state.layout)); renderCurrent(); buildMainUI(); attachMainHandlers(); };
      out.querySelector('#saveLayout').onclick = async ()=> { await gmSet('afk:layout', JSON.stringify(state.layout)); await gmSet('afk:customButtons', JSON.stringify(state.customButtons)); alert('Макет сохранён'); buildMainUI(); attachMainHandlers(); };
      out.querySelector('#resetLayout').onclick = async ()=> { if (!confirm('Откатить макет к умолчанию?')) return; state.layout=['settings','toggle','reload']; state.customButtons=[]; await gmSet('afk:layout', JSON.stringify(state.layout)); await gmSet('afk:customButtons', JSON.stringify(state.customButtons)); renderCurrent(); buildMainUI(); attachMainHandlers(); alert('Откат выполнен'); };

      let editingKey = null;
      function selectForEdit(key){ editingKey = key; const title = out.querySelector('#editorTitle'); let color='#7ef0d6', radius=12, shadow=20; if (key==='settings') title.innerText='Ред: Настройки (системная)'; else if (key==='toggle') title.innerText='Ред: AFK Toggle (системная)'; else if (key==='reload') title.innerText='Ред: Перезагрузить (системная)'; else { const cb = state.customButtons.find(x=>x.id===key); if (cb){ title.innerText = 'Ред: ' + cb.label; color = cb.color || color; if (cb.radius) radius = cb.radius; if (cb.shadow) shadow = cb.shadow; } else title.innerText='Ред: ' + key; } out.querySelector('#editColor').value = color; out.querySelector('#editRadius').value = radius; out.querySelector('#editShadow').value = shadow; const sample = out.querySelector('#previewBtnSample'); sample.style.background = color; sample.style.borderRadius = radius + 'px'; sample.style.boxShadow = `0 ${shadow}px ${shadow*2}px rgba(0,0,0,0.35)`; }
      out.querySelector('#applyBtn').onclick = ()=> { const c = out.querySelector('#editColor').value; const r = Number(out.querySelector('#editRadius').value)||12; const s = Number(out.querySelector('#editShadow').value)||20; const sample = out.querySelector('#previewBtnSample'); sample.style.background=c; sample.style.borderRadius=r+'px'; sample.style.boxShadow=`0 ${s}px ${s*2}px rgba(0,0,0,0.35)`; };
      out.querySelector('#saveBtn').onclick = async ()=> { if (!editingKey) return alert('Выберите элемент'); const c = out.querySelector('#editColor').value; const r = Number(out.querySelector('#editRadius').value)||12; const s = Number(out.querySelector('#editShadow').value)||20; if (editingKey==='settings' || editingKey==='toggle' || editingKey==='reload'){ const id='sys_'+editingKey; let cb = state.customButtons.find(x=>x.id===id); if (!cb){ cb = {id,label:editingKey,color:c,radius:r,shadow:s}; state.customButtons.push(cb); } else { cb.color=c; cb.radius=r; cb.shadow=s; } await gmSet('afk:customButtons', JSON.stringify(state.customButtons)); } else { const cb = state.customButtons.find(x=>x.id===editingKey); if (cb){ cb.color=c; cb.radius=r; cb.shadow=s; await gmSet('afk:customButtons', JSON.stringify(state.customButtons)); } else alert('Кнопка не найдена'); } buildMainUI(); attachMainHandlers(); alert('Сохранено'); };
      out.querySelector('#deleteBtn').onclick = async ()=> { if (!editingKey) return alert('Выберите элемент'); if (['settings','toggle','reload','afkVK','afkSignature'].includes(editingKey)) return alert('Системную часть удалять нельзя'); state.layout = state.layout.filter(k=>k!==editingKey); state.customButtons = state.customButtons.filter(b=>b.id!==editingKey); await gmSet('afk:layout', JSON.stringify(state.layout)); await gmSet('afk:customButtons', JSON.stringify(state.customButtons)); renderCurrent(); buildMainUI(); attachMainHandlers(); alert('Удалено'); };
    }
    else if (name === 'advanced') {
      out.innerHTML = `<div class="section"><b>Продвинутое</b></div><div class="section">Защита от недогрузки: включена (fetch & parse fallback)</div>
        <div style="display:flex;gap:8px;margin-top:8px"><button id="runParse" class="afk-btn">Запустить parse</button><button id="exportState" class="afk-btn">Экспорт state</button><button id="clearIgnored" class="afk-btn warn">Очистить ignore-list</button><button id="rebuildUI" class="afk-btn">Перестроить UI</button><button id="forceScan" class="afk-btn">Принудительный scan</button></div>`;
      out.querySelector('#runParse').onclick = async ()=> { const ok = await fetchAndParsePage(); alert(ok?'Parse нашёл темы':'Parse не нашёл'); };
      out.querySelector('#exportState').onclick = ()=> { console.log('AFK state', state); alert('Состояние в консоли'); };
      out.querySelector('#clearIgnored').onclick = async ()=> { if(!confirm('Очистить ignore-list?')) return; state.ignoredThreads=[]; await gmSet('afk:ignoredThreads', JSON.stringify([])); alert('Очистено'); };
      out.querySelector('#rebuildUI').onclick = ()=> { buildMainUI(); alert('UI перестроен'); };
      out.querySelector('#forceScan').onclick = ()=> { scanDOMForWaiting(); alert('Scan выполнен'); };
    }
    else if (name === 'about') {
      out.innerHTML = `<div class="section"><b>AFK-монитор Pro</b></div><div class="small">Версия: 4.3 • Автор: Tim_Venera</div>
        <div class="section" style="margin-top:8px"><div style="display:flex;gap:8px"><button id="openLogs" class="afk-btn">Открыть логи</button><button id="downloadLogs" class="afk-btn">Скачать логи</button><button id="clearLogs" class="afk-btn warn">Очистить логи</button></div></div>`;
      out.querySelector('#openLogs').onclick = async ()=> { const logs = JSON.parse(await gmGet('afk:logs','[]'))||[]; const el = document.createElement('div'); el.style.width='100%'; el.innerHTML = '<div style="font-weight:900">Логи</div>'; logs.slice().reverse().forEach(l=>{ const r=document.createElement('div'); r.style.padding='6px 0'; r.innerText = `[${new Date(l.ts).toLocaleString()}] ${l.action} ${JSON.stringify(l.data||{})}`; el.appendChild(r);}); createModal(el); };
      out.querySelector('#downloadLogs').onclick = async ()=> { const logs = await gmGet('afk:logs','[]'); const blob = new Blob([logs],{type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='afk-logs.json'; a.click(); URL.revokeObjectURL(url); };
      out.querySelector('#clearLogs').onclick = async ()=> { if(!confirm('Очистить логи?')) return; await gmSet('afk:logs', JSON.stringify([])); alert('Очищено'); };
    }
  }

  // -----------------------
  // 
  // -----------------------
  function openAdminLogin(){
    const cont = document.createElement('div'); cont.style.display='flex'; cont.style.flexDirection='column'; cont.style.gap='8px';
    cont.innerHTML = `<div style="font-weight:900">Admin Panel — Вход</div><div style="color:rgba(255,255,255,0.7)">Введите пароль администратора</div>`;
    const input = document.createElement('input'); input.type='password'; input.style.padding='8px';
    const btns = document.createElement('div'); btns.style.display='flex'; btns.style.gap='8px';
    const ok = document.createElement('button'); ok.className='afk-btn'; ok.innerText='Войти';
    const cancel = document.createElement('button'); cancel.className='afk-btn'; cancel.innerText='Отмена';
    btns.appendChild(ok); btns.appendChild(cancel); cont.appendChild(input); cont.appendChild(btns);
    const modal = createModal(cont);
    cancel.onclick = ()=> modal.remove();
    ok.onclick = async ()=> {
      const val = input.value||''; if (!val) { alert('Пароль пустой'); return; }
      const h = await sha256hex(val);
      if ((state.adminHash && h === state.adminHash) || (!state.adminHash && h === DEFAULT_ADMIN_HASH)) { modal.remove(); openAdminPanel(); }
      else alert('Неверный пароль');
    };
  }

  async function openAdminPanel(){
    const cont = document.createElement('div'); cont.style.width='100%'; cont.style.display='flex'; cont.style.flexDirection='column'; cont.style.gap='10px';
    cont.innerHTML = `<div style="font-weight:900;font-size:16px">Admin — Панель</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="afk-btn" data-tab="stats">Статистика</button>
        <button class="afk-btn" data-tab="users">Пользователи</button>
        <button class="afk-btn" data-tab="logs">Журнал</button>
        <button class="afk-btn" data-tab="mod">Модерация</button>
        <button class="afk-btn" data-tab="broadcast">Рассылка</button>
      </div>
      <div id="adminMain" style="margin-top:8px;width:100%;max-height:520px;overflow:auto;"></div>`;
    const modal = createModal(cont);
    const main = modal.querySelector('#adminMain');
    async function renderTab(name){
      main.innerHTML = '';
      if (name === 'stats') {
        const wrap = document.createElement('div'); wrap.innerHTML = `<div><b>Сводка:</b> Обновлено ${state.refreshCount} • Найдено ${state.totalFound} • В очереди ${state.foundThreads.length}</div>`;
        const b1=createBtn('Экспорт логов в консоль'), b2=createBtn('Очистить логи'), b3=createBtn('Экспорт найденных'), b4=createBtn('Сбросить счётчики'), b5=createBtn('Показать бэкапы');
        wrap.appendChild(btnRow([b1,b2,b3,b4,b5])); main.appendChild(wrap);
        b1.onclick = async ()=> { console.log(await gmGet('afk:logs','[]')); alert('Логи в консоли'); };
        b2.onclick = async ()=> { if(!confirm('Очистить логи?')) return; await gmSet('afk:logs', JSON.stringify([])); alert('Очищено'); };
        b3.onclick = async ()=> { console.log(await gmGet('afk:foundThreads','[]')); alert('Found in console'); };
        b4.onclick = async ()=> { if(!confirm('Сбросить счётчики?')) return; state.refreshCount=0; state.totalFound=0; await gmSet('afk:refreshCount',0); await gmSet('afk:totalFound',0); updateUIcounts(); alert('Сброшено'); };
        b5.onclick = async ()=> { console.log(await gmGet('afk:backupHistory','[]')); alert('Backups в консоли'); };
      }
      else if (name === 'users') {
        const wrap = document.createElement('div'); wrap.innerHTML = `<div><b>Пользователи (opt-in announce)</b></div><div class="small">писькафония от тима</div>`;
        const known = JSON.parse(await gmGet('afk:knownClients','[]')) || [];
        const listDiv = document.createElement('div'); listDiv.style.maxHeight='360px'; listDiv.style.overflow='auto'; listDiv.style.marginTop='8px';
        known.slice().reverse().forEach(k=>{ const r=document.createElement('div'); r.style.padding='8px'; r.style.borderBottom='1px dashed rgba(255,255,255,0.03)'; r.innerHTML = `<div style="font-weight:700">${escapeHtml(k.id)}</div><div class="small">UA: ${escapeHtml(k.ua||'')}<br>LastSeen: ${k.lastSeenTs ? new Date(k.lastSeenTs).toLocaleString() : '-'}${k.extra?'<br>'+escapeHtml(JSON.stringify(k.extra)):''}</div>`; listDiv.appendChild(r); });
        const b1=createBtn('Блокировать clientId (локально)'), b2=createBtn('Разблокировать clientId'), b3=createBtn('Экспорт known в консоль'), b4=createBtn('Очистить known'), b5=createBtn('Обновить список');
        wrap.appendChild(btnRow([b1,b2,b3,b4,b5])); wrap.appendChild(listDiv); main.appendChild(wrap);
        b1.onclick = async ()=> { const id=prompt('clientId:'); if(!id) return; const arr = JSON.parse(await gmGet('afk:blockedIds','[]'))||[]; if (!arr.includes(id)) arr.push(id); await gmSet('afk:blockedIds', JSON.stringify(arr)); alert('Добавлено (локально)'); pushLog('admin_block_client',{id}); };
        b2.onclick = async ()=> { const id=prompt('clientId:'); if(!id) return; let arr = JSON.parse(await gmGet('afk:blockedIds','[]'))||[]; arr = arr.filter(x=>x!==id); await gmSet('afk:blockedIds', JSON.stringify(arr)); alert('Удалено'); pushLog('admin_unblock_client',{id}); };
        b3.onclick = ()=> { console.log('Known clients', known); alert('Known -> console'); };
        b4.onclick = async ()=> { if(!confirm('Очистить known?')) return; await gmSet('afk:knownClients', JSON.stringify([])); alert('Очищено'); };
        b5.onclick = async ()=> { renderTab('users'); };
      }
      else if (name === 'logs') {
        const wrap = document.createElement('div'); const logs = JSON.parse(await gmGet('afk:logs','[]'))||[]; const area = document.createElement('div'); area.style.maxHeight='360px'; area.style.overflow='auto';
        logs.slice().reverse().forEach(l=>{ const r=document.createElement('div'); r.style.padding='6px'; r.style.borderBottom='1px dashed rgba(255,255,255,0.03)'; r.innerText = `[${new Date(l.ts).toLocaleString()}] ${l.action} ${JSON.stringify(l.data||{})}`; area.appendChild(r); });
        const bClear = createBtn('Очистить логи'), bDownload = createBtn('Скачать JSON'), bFilter = createBtn('Фильтр'), bSearch = createBtn('Поиск'), bExport = createBtn('Экспорт в консоль');
        wrap.appendChild(btnRow([bClear,bDownload,bFilter,bSearch,bExport])); wrap.appendChild(area); main.appendChild(wrap);
        bClear.onclick = async ()=> { if(!confirm('Очистить логи?')) return; await gmSet('afk:logs', JSON.stringify([])); renderTab('logs'); alert('Очищено'); };
        bDownload.onclick = async ()=> { const logs = await gmGet('afk:logs','[]'); const blob = new Blob([logs],{type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='afk-logs.json'; a.click(); URL.revokeObjectURL(url); };
        bFilter.onclick = async ()=> { const term = prompt('action:'); if(!term) return; const logs = JSON.parse(await gmGet('afk:logs','[]'))||[]; console.log('Filtered', logs.filter(l=>l.action===term)); alert('Result in console'); };
        bSearch.onclick = async ()=> { const term = prompt('search:'); if(!term) return; const logs = JSON.parse(await gmGet('afk:logs','[]'))||[]; console.log('Search', logs.filter(l=>JSON.stringify(l).includes(term))); alert('Result in console'); };
        bExport.onclick = async ()=> { console.log('Logs', logs); alert('Logs -> console'); };
      }
      else if (name === 'mod') {
        const wrap = document.createElement('div'); const b1=createBtn('Блокировать clientId (локально)'), b2=createBtn('Разблокировать clientId'), b3=createBtn('Блокировать IP (локально)'), b4=createBtn('Разблокировать IP'), b5=createBtn('Показать заблокированных');
        wrap.appendChild(btnRow([b1,b2,b3,b4,b5])); main.appendChild(wrap);
        b1.onclick = async ()=> { const id=prompt('clientId:'); if(!id) return; const arr = JSON.parse(await gmGet('afk:blockedIds','[]'))||[]; if(!arr.includes(id)) arr.push(id); await gmSet('afk:blockedIds', JSON.stringify(arr)); alert('Blocked (local)'); pushLog('admin_block_client',{id}); };
        b2.onclick = async ()=> { const id=prompt('clientId:'); if(!id) return; let arr = JSON.parse(await gmGet('afk:blockedIds','[]'))||[]; arr = arr.filter(x=>x!==id); await gmSet('afk:blockedIds', JSON.stringify(arr)); alert('Unblocked'); pushLog('admin_unblock_client',{id}); };
        b3.onclick = async ()=> { const ip=prompt('IP:'); if(!ip) return; const arr = JSON.parse(await gmGet('afk:blockedIPs','[]'))||[]; if(!arr.includes(ip)) arr.push(ip); await gmSet('afk:blockedIPs', JSON.stringify(arr)); alert('IP blocked (local)'); pushLog('admin_block_ip',{ip}); };
        b4.onclick = async ()=> { const ip=prompt('IP:'); if(!ip) return; let arr = JSON.parse(await gmGet('afk:blockedIPs','[]'))||[]; arr = arr.filter(x=>x!==ip); await gmSet('afk:blockedIPs', JSON.stringify(arr)); alert('IP unblocked'); pushLog('admin_unblock_ip',{ip}); };
        b5.onclick = async ()=> { alert('Blocked IDs: '+JSON.stringify(await gmGet('afk:blockedIds','[]'))+'\nBlocked IPs: '+JSON.stringify(await gmGet('afk:blockedIPs','[]'))); };
      }
      else if (name === 'broadcast') {
        const wrap = document.createElement('div'); const ta = document.createElement('textarea'); ta.style.width='100%'; ta.style.height='90px';
        const s1=createBtn('Отправить всем (localStorage)'), s2=createBtn('Запланировать'), s3=createBtn('Показать last'), s4=createBtn('Очистить last'), s5=createBtn('Экспорт в логи');
        wrap.appendChild(ta); wrap.appendChild(btnRow([s1,s2,s3,s4,s5])); main.appendChild(wrap);
        s1.onclick = ()=> { const txt=ta.value.trim(); if(!txt) return alert('Введите текст'); localStorage.setItem('afk:broadcast', JSON.stringify({payload:{type:'admin_broadcast', text: txt, from: location.hostname}, t: Date.now()})); alert('Отправлено локально'); pushLog('admin_broadcast',{text:txt}); };
        s2.onclick = ()=> { const txt=ta.value.trim(); if(!txt) return alert('Введите текст'); const seconds = Number(prompt('Через сколько секунд?', '10'))||0; setTimeout(()=>{ localStorage.setItem('afk:broadcast', JSON.stringify({payload:{type:'admin_broadcast', text: txt, from: location.hostname}, t: Date.now()})); }, seconds*1000); alert('Запланировано'); pushLog('admin_broadcast_scheduled',{text:txt,seconds}); };
        s3.onclick = ()=> { alert('Last broadcast: '+localStorage.getItem('afk:broadcast')); };
        s4.onclick = ()=> { localStorage.removeItem('afk:broadcast'); alert('Очистено'); };
        s5.onclick = async ()=> { pushLog('admin_broadcast_export',{}); alert('Событие записано в логи'); };
      }
    }

    const tabs = cont.querySelectorAll('[data-tab]');
    tabs.forEach(t=>t.addEventListener('click', ()=> { tabs.forEach(x=>x.classList.remove('active')); t.classList.add('active'); renderTab(t.dataset.tab); }));
    renderTab('stats');

    function createBtn(txt){ const b=document.createElement('button'); b.className='afk-btn'; b.innerText=txt; return b; }
    function btnRow(arr){ const r=document.createElement('div'); r.style.display='flex'; r.style.gap='8px'; r.style.marginTop='8px'; arr.forEach(x=>r.appendChild(x)); return r; }
  }

  // -----------------------
  // 
  // -----------------------
  window.addEventListener('storage', async (e) => {
    if (!e.key) return;
    try {
      if (e.key === 'afk:broadcast' && e.newValue) {
        const obj = JSON.parse(e.newValue);
        const txt = obj.payload && obj.payload.text;
        if (txt) {
          const c = document.createElement('div'); c.innerHTML = `<div style="font-weight:900">Админ-сообщение</div><div style="margin-top:8px">${escapeHtml(txt)}</div>`;
          const m = createModal(c);
          setTimeout(()=>{ try{ m.remove(); }catch(e){} }, 15000);
          try{ AudioEngine.play(state.soundData || state.soundIndex, state.soundVolume); setTimeout(()=>AudioEngine.stop(), 2500); }catch(e){}
        }
      }
      if (e.key === 'afk:announce' && e.newValue) {
        const obj = JSON.parse(e.newValue);
        if (obj && obj.clientId) {
          const known = JSON.parse(await gmGet('afk:knownClients','[]')) || [];
          const idx = known.findIndex(k => k.id === obj.clientId);
          const record = { id: obj.clientId, ua: obj.ua, lastSeenTs: Date.now(), extra: obj.extra||{} };
          if (idx === -1) known.push(record); else { known[idx] = {...known[idx], ...record}; }
          await gmSet('afk:knownClients', JSON.stringify(known));
          state.knownClients = known;
          await pushLog('announce_received', {clientId: obj.clientId});
        }
      }
    } catch(e){}
  });

  // -----------------------
  // 
  // -----------------------
  const clientId = (await gmGet('afk:clientId', null)) || ('c_' + Math.random().toString(36).slice(2,10));
  await gmSet('afk:clientId', clientId);
  function announce(){
    try {
      const payload = { clientId, ua: navigator.userAgent, ts: Date.now(), extra: {url: location.href} };
      localStorage.setItem('afk:announce', JSON.stringify(payload));
    } catch(e){}
  }
  announce();
  const announceInterval = setInterval(announce, 20_000);
  window.addEventListener('beforeunload', ()=>{ try{ localStorage.removeItem('afk:announce'); }catch(e){} });

  // -----------------------
  // 
  // -----------------------
  buildMainUI();
  buildSettingsPanel(); //
  setTimeout(()=>{ if (state.scanningEnabled && inDisplayScope()){ startObserver(); startPeriodic(); startCountdown(); } else { stopObserver(); stopPeriodic(); stopCountdown(); } scanDOMForWaiting(); }, 700);

  // 
  setInterval(()=> { if (!document.getElementById('afkContainer') && inDisplayScope()) buildMainUI(); ensureSignature(); ensureVK(); }, 3000);

  // 
  window.__AFK_MONITOR = { state, forceScan: ()=>{ scanDOMForWaiting(); fetchAndParsePage(); }, setScanning: (v)=> setScanning(!!v), playSound: (i)=> AudioEngine.play(i||0,state.soundVolume), stopSound: ()=> AudioEngine.stop(), pushLog };

  console.info('[AFK] Pro v4.3 loaded — ready.');
})();
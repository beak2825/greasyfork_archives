// ==UserScript==
// @name         Anti Anti-AdBlock — Inspector + Whitelist + UA Badge
// @namespace    https://example.com
// @version      6.2
// @description  Безопасный обход анти-AdBlock. Создает отсутствующие заглушки, логирует существующие свойства, предлагает добавить текущий хост в whitelist. Панель draggable/resizable/collapsible. Логотип "Зроблено в Україні".
// @author       You
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549423/Anti%20Anti-AdBlock%20%E2%80%94%20Inspector%20%2B%20Whitelist%20%2B%20UA%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/549423/Anti%20Anti-AdBlock%20%E2%80%94%20Inspector%20%2B%20Whitelist%20%2B%20UA%20Badge.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Storage keys ---
  const STORAGE_ENABLED = 'antiAB_enabled_v6';
  const STORAGE_DISABLED_HOSTS = 'antiAB_disabled_hosts_v6';
  const STORAGE_CREATED_STUBS = 'antiAB_created_stubs_v6';
  const STORAGE_WHITELIST = 'antiAB_whitelist_v6';
  const STORAGE_SUGGEST_THRESHOLD = 'antiAB_suggest_threshold_v6';

  // --- State ---
  let enabled = localStorage.getItem(STORAGE_ENABLED) !== 'false';
  let disabledHosts = JSON.parse(localStorage.getItem(STORAGE_DISABLED_HOSTS) || '{}');
  let createdStubs = JSON.parse(localStorage.getItem(STORAGE_CREATED_STUBS) || '[]');
  let whitelist = JSON.parse(localStorage.getItem(STORAGE_WHITELIST) || '[]');
  let suggestThreshold = parseInt(localStorage.getItem(STORAGE_SUGGEST_THRESHOLD) || '5', 10);

  // --- Keywords for stub creation / scanning ---
  const adKeywords = [
    'adblock','ads','advert','admiral','blockad','popunder','ez_ad',
    'carbonads','zaraz','piwik','matomo','googlead','canrunads','adscore',
    'generatorads','adplugin','postantiadblockinfo','hasadblocker','adtracker'
  ];

  // --- Save helpers ---
  const saveCreatedStubs = () => { try{localStorage.setItem(STORAGE_CREATED_STUBS, JSON.stringify(Array.from(new Set(createdStubs))));}catch(e){} };
  const saveDisabledHosts = () => { try{localStorage.setItem(STORAGE_DISABLED_HOSTS, JSON.stringify(disabledHosts));}catch(e){} };
  const saveEnabled = () => { try{localStorage.setItem(STORAGE_ENABLED, enabled?'true':'false');}catch(e){} };
  const saveWhitelist = () => { try{localStorage.setItem(STORAGE_WHITELIST, JSON.stringify(whitelist));}catch(e){} };
  const saveSuggestThreshold = () => { try{localStorage.setItem(STORAGE_SUGGEST_THRESHOLD, String(suggestThreshold));}catch(e){} };

  // --- Whitelist helpers ---
  const isWhitelisted = (host = location.hostname) => whitelist.includes(host) || whitelist.some(w => host === w || host.endsWith('.'+w));
  const addToWhitelist = host => { if(!whitelist.includes(host)) { whitelist.push(host); saveWhitelist(); } };
  const removeFromWhitelist = host => { whitelist = whitelist.filter(h=>h!==host); saveWhitelist(); };

  // --- Scan existing properties ---
  function scanExistingProperties(){
    try{
      const props = Object.getOwnPropertyNames(window || {});
      const found = [];
      const lowerKeywords = adKeywords.map(k=>k.toLowerCase());
      for(const p of props) if(lowerKeywords.some(k=>p.toLowerCase().includes(k))) found.push(p);
      if(found.length){
        console.group('%c[AntiAB] Found existing properties matching ad keywords','color:#0ea5a6;font-weight:700');
        found.forEach(n=>{try{console.log(n,typeof window[n]!=='undefined'?window[n]:'undefined');}catch(e){console.log(n,'(access error)')}})
        console.groupEnd();
      } else console.log('%c[AntiAB] No existing window properties matched ad keywords.','color:#60a5fa');
      return found;
    } catch(e){console.warn('[AntiAB] scanExistingProperties error', e); return [];}
  }

  const existingPropsFound = scanExistingProperties();

  // --- Stub creation ---
  function safeCreateStub(name){
    try{
      if(typeof unsafeWindow[name]!=='undefined') return false;
      unsafeWindow[name] = {};
      try{unsafeWindow[name].init=function(){}}catch(e){}
      if(!createdStubs.includes(name)){createdStubs.push(name); saveCreatedStubs();}
      return true;
    } catch(e){return false;}
  }
  function createStubsForKeyword(k){
    safeCreateStub(k); safeCreateStub(k.toLowerCase());
    const cap = k.charAt(0).toUpperCase()+k.slice(1); safeCreateStub(cap); safeCreateStub('_'+k);
  }

  function applyBypassOnce(){
    if(!enabled || disabledHosts[location.hostname] || isWhitelisted(location.hostname)) return;
    adKeywords.forEach(createStubsForKeyword);
  }
  function scheduleAttempts(){
    applyBypassOnce();
    [250,800,1800,3500].forEach(t=>setTimeout(applyBypassOnce,t));
  }

  function removeStubs(names){
    const removed = [];
    names.forEach(name=>{
      try{
        if(createdStubs.includes(name)){
          try{delete unsafeWindow[name];}catch(e){unsafeWindow[name]=undefined;}
          removed.push(name); createdStubs=createdStubs.filter(x=>x!==name);
        }
      }catch(e){}
    });
    saveCreatedStubs();
    return removed;
  }

  // --- Notifications ---
  function showNotification(text,bg='#bbf7d0',color='#000'){
    try{
      const el=document.createElement('div'); el.textContent=text;
      Object.assign(el.style,{
        position:'fixed',right:'12px',bottom:'70px',zIndex:2147483647,
        padding:'8px 10px',borderRadius:'6px',background:bg,color:color,
        fontWeight:'700',fontFamily:'Arial, sans-serif',boxShadow:'0 6px 18px rgba(2,6,23,0.5)'
      });
      document.documentElement.appendChild(el);
      setTimeout(()=>el.remove(),2600);
    }catch(e){}
  }

  // --- UI Panel ---
  function createPanel(){
    try{
      const panel=document.createElement('div');
      Object.assign(panel.style,{
        position:'fixed',right:'10px',bottom:'10px',width:'400px',maxWidth:'calc(100%-20px)',
        background:'#0b1220',color:'#e6eef8',borderRadius:'10px',zIndex:2147483647,
        boxShadow:'0 10px 30px rgba(2,6,23,0.6)',fontFamily:'Arial, sans-serif',
        fontSize:'13px',resize:'both',overflow:'auto',minWidth:'240px'
      });

      const header=document.createElement('div');
      Object.assign(header.style,{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 10px',cursor:'move',userSelect:'none'});
      header.innerHTML='<strong>Anti-AdBlock — Inspector</strong>';
      panel.appendChild(header);

      const body=document.createElement('div'); body.style.padding='8px 10px'; panel.appendChild(body);

      const badge=document.createElement('div'); badge.textContent='🇺🇦 Зроблено в Україні'; badge.style.fontWeight='700'; badge.style.marginBottom='8px'; body.appendChild(badge);

      // Status row
      const statusRow=document.createElement('div'); Object.assign(statusRow.style,{display:'flex',justifyContent:'space-between',alignItems:'center'}); body.appendChild(statusRow);
      const statusText=document.createElement('div'); statusText.textContent=enabled?'Status: ON':'Status: OFF'; statusText.style.fontWeight='700'; statusRow.appendChild(statusText);
      const statusDot=document.createElement('div'); Object.assign(statusDot.style,{width:'12px',height:'12px',borderRadius:'50%',background:enabled?'#10b981':'#ef4444'}); statusRow.appendChild(statusDot);

      // Controls
      const toggleBtn=document.createElement('button'); toggleBtn.textContent=enabled?'Turn OFF':'Turn ON';
      Object.assign(toggleBtn.style,{flex:'1',padding:'6px',borderRadius:'6px',border:'none',cursor:'pointer',background:enabled?'#10b981':'#ef4444',color:'#000',fontWeight:'700'});
      body.appendChild(toggleBtn);

      // Pause checkbox
      const pauseChk=document.createElement('input'); pauseChk.type='checkbox'; pauseChk.checked=!!disabledHosts[location.hostname];
      const pauseLabel=document.createElement('label'); pauseLabel.textContent='Pause on this site'; pauseLabel.style.cursor='pointer';
      body.appendChild(pauseChk); body.appendChild(pauseLabel);

      toggleBtn.addEventListener('click',()=>{
        enabled=!enabled; saveEnabled();
        toggleBtn.textContent=enabled?'Turn OFF':'Turn ON';
        toggleBtn.style.background=enabled?'#10b981':'#ef4444';
        statusText.textContent=enabled?'Status: ON':'Status: OFF';
        statusDot.style.background=enabled?'#10b981':'#ef4444';
        if(enabled){scheduleAttempts(); showNotification('Anti-AdBlock active ✅');}else{showNotification('Anti-AdBlock disabled ❌','#fecaca');}
      });

      pauseChk.addEventListener('change',()=>{
        if(pauseChk.checked){disabledHosts[location.hostname]=true; showNotification('Paused on this site','#fecaca');}else{delete disabledHosts[location.hostname]; if(enabled) scheduleAttempts(); showNotification('Activated on this site','#bbf7d0');} saveDisabledHosts();
      });

      // Drag support
      (function makeDraggable(handle,target){
        let isDown=false,startX=0,startY=0,startLeft=0,startTop=0;
        handle.addEventListener('mousedown',e=>{
          isDown=true; startX=e.clientX; startY=e.clientY;
          const rect=target.getBoundingClientRect(); startLeft=rect.left; startTop=rect.top;
          document.body.style.userSelect='none';
          target.style.left=startLeft+'px'; target.style.top=startTop+'px'; target.style.right='auto'; target.style.bottom='auto'; target.style.position='fixed';
        });
        window.addEventListener('mouseup',()=>{isDown=false; document.body.style.userSelect='';});
        window.addEventListener('mousemove',e=>{if(!isDown) return; const dx=e.clientX-startX, dy=e.clientY-startY; target.style.left=(startLeft+dx)+'px'; target.style.top=(startTop+dy)+'px';});
      })(header,panel);

      document.documentElement.appendChild(panel);

    }catch(e){setTimeout(createPanel,300);}
  }

  // --- Run ---
  try{
    scheduleAttempts();
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',createPanel);
    else createPanel();
  }catch(e){console.error('AntiAB error',e);}

})();

// ==UserScript==
// @name         Tinder Fast-Match Unblur + Botón
// @namespace    https://greasyfork.org/users/tu-usuario
// @version      0.3
// @description  Quita el blur de teasers; añade botón fijo y atajo Alt+U.
// @match        https://tinder.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.gotinder.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550306/Tinder%20Fast-Match%20Unblur%20%2B%20Bot%C3%B3n.user.js
// @updateURL https://update.greasyfork.org/scripts/550306/Tinder%20Fast-Match%20Unblur%20%2B%20Bot%C3%B3n.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const API_URL = 'https://api.gotinder.com/v2/fast-match/teasers';
  const TOKEN_KEY = 'TinderWeb/APIToken';
  const BTN_ID = 'gm-unblur-btn';

  // ---- Estilos (botón + quitar blur) ----
  GM_addStyle(`
    #${BTN_ID}{
      position:fixed !important; right:16px !important; bottom:16px !important;
      z-index:2147483647 !important; padding:10px 14px !important;
      border-radius:10px !important; border:1px solid rgba(0,0,0,.2) !important;
      background:#fff !important; color:#111 !important; cursor:pointer !important;
      font: 600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial !important;
      box-shadow:0 4px 16px rgba(0,0,0,.18) !important;
    }
    .gm-unblur{filter:none !important;-webkit-filter:none !important}
  `);

  // ---- Utilidades ----
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  async function waitForBody(max=40){
    for (let i=0;i<max;i++){ if(document.body) return; await sleep(125); }
    throw new Error('No hay <body>');
  }
  async function waitForToken(max=20){
    for (let i=0;i<max;i++){
      let t = localStorage.getItem(TOKEN_KEY);
      try{ if(t && t.startsWith('"')) t = JSON.parse(t); }catch{}
      if (t) return t;
      await sleep(300);
    }
    throw new Error('APIToken no encontrado');
  }
  function gmGetJSON(url, headers){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url, headers,
        onload:r=> (r.status>=200&&r.status<300)
          ? resolve(JSON.parse(r.responseText||'{}'))
          : reject(new Error(`HTTP ${r.status}`)),
        onerror:reject
      });
    });
  }

  // ---- Lógica unblur ----
  function findTeaserElements(){
    const sels = [
      '.Expand.enterAnimationContainer > div:nth-child(1)',
      '[data-testid*="teaser"] div[style*="background-image"]',
      'div[style*="blur("][style*="background-image"]'
    ];
    for (const s of sels){
      const n = Array.from(document.querySelectorAll(s));
      if (n.length) return n;
    }
    return [];
  }
  function applyImages(nodes, urls){
    nodes.forEach((el,i)=>{
      const url = urls[i]; if(!url) return;
      if (el.tagName === 'IMG') el.src = url;
      else el.style.backgroundImage = `url("${url}")`;
      el.classList.add('gm-unblur');
    });
  }
  async function unblur(){
    try{
      const token = await waitForToken();
      const json = await gmGetJSON(API_URL, {'X-Auth-Token': token, 'platform':'android'});
      const urls = (json?.data?.results||[]).map(t=>t?.user?.photos?.[0]?.url).filter(Boolean);
      const nodes = findTeaserElements();
      if(!nodes.length) throw new Error('No hay teasers en DOM');
      applyImages(nodes, urls);
      console.log('[Unblur] OK:', Math.min(nodes.length, urls.length));
    }catch(e){ console.warn('[Unblur] Error:', e.message||e); }
  }

  // ---- Botón persistente + atajo ----
  function ensureButton(){
    if (document.getElementById(BTN_ID)) return;
    const b = document.createElement('button');
    b.id = BTN_ID; b.textContent = 'Unblur Teasers (Alt+U)';
    b.addEventListener('click', unblur);
    document.body.appendChild(b);
  }

  // Atajo teclado
  window.addEventListener('keydown', (e)=>{
    if (e.altKey && (e.key==='u' || e.key==='U')) { e.preventDefault(); unblur(); }
  });

  // Reponer botón si el SPA lo elimina
  const obs = new MutationObserver(()=> ensureButton());
  (async ()=> {
    await waitForBody();
    ensureButton();
    obs.observe(document.documentElement,{childList:true,subtree:true});
    // primer intento automático
    setTimeout(unblur, 1500);
  })();
})();

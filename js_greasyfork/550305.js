// ==UserScript==
// @name         Tinder Fast-Match Unblur (GMXHR)
// @namespace    https://greasyfork.org/users/tu-usuario
// @version      0.2
// @description  Reemplaza el blur de los teasers con la imagen real (evitando CORS).
// @author       tú
// @match        https://tinder.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      api.gotinder.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550305/Tinder%20Fast-Match%20Unblur%20%28GMXHR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550305/Tinder%20Fast-Match%20Unblur%20%28GMXHR%29.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const API_URL = 'https://api.gotinder.com/v2/fast-match/teasers';
  const TOKEN_KEY = 'TinderWeb/APIToken';

  // CSS para eliminar blur con !important
  const css = document.createElement('style');
  css.textContent = `.gm-unblur{filter:none !important;-webkit-filter:none !important}`;
  document.head.appendChild(css);

  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  async function waitForToken(max=15){
    for(let i=0;i<max;i++){
      let t = localStorage.getItem(TOKEN_KEY);
      try{ if(t && t.startsWith('"')) t = JSON.parse(t); }catch{}
      if (t) return t;
      await sleep(500);
    }
    throw new Error('APIToken no encontrado.');
  }

  function gmGetJSON(url, headers){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url, headers,
        onload: r=>{
          if (r.status>=200 && r.status<300){
            try{ resolve(JSON.parse(r.responseText)); }catch(e){ reject(e); }
          } else reject(new Error(`HTTP ${r.status}`));
        },
        onerror: reject
      });
    });
  }

  function findTeaserElements(){
    const sels = [
      '.Expand.enterAnimationContainer > div:nth-child(1)',
      '[data-testid*="teaser"] div[style*="background-image"]',
      'div[style*="blur("][style*="background-image"]'
    ];
    for(const s of sels){
      const n = Array.from(document.querySelectorAll(s));
      if(n.length) return n;
    }
    return [];
  }

  function applyImages(nodes, urls){
    nodes.forEach((el,i)=>{
      const url = urls[i];
      if(!url) return;
      if (el.tagName === 'IMG') el.src = url;
      else el.style.backgroundImage = `url("${url}")`;
      el.classList.add('gm-unblur');
    });
  }

  async function unblur(){
    try{
      const token = await waitForToken();
      const json = await gmGetJSON(API_URL, {
        'X-Auth-Token': token, 'platform': 'android'
      });
      const urls = (json?.data?.results||[])
        .map(t=>t?.user?.photos?.[0]?.url).filter(Boolean);
      const nodes = findTeaserElements();
      if(!nodes.length) throw new Error('No hay teasers en DOM.');
      applyImages(nodes, urls);
      console.log('[Unblur] OK:', Math.min(nodes.length, urls.length));
    }catch(e){ console.warn('[Unblur] Error:', e); }
  }

  // Botón para reintentar
  function addButton(){
    if (document.getElementById('unblur-teasers-btn')) return;
    const b = document.createElement('button');
    b.id='unblur-teasers-btn'; b.textContent='Unblur Teasers';
    Object.assign(b.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:99999,padding:'8px 12px'});
    b.onclick=unblur; document.body.appendChild(b);
  }

  addButton();
  setTimeout(unblur, 1500);
  new MutationObserver(()=> setTimeout(unblur, 800))
    .observe(document.documentElement,{childList:true,subtree:true});
})();

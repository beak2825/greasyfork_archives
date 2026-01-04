// ==UserScript==
// @name        Droidiy Bloxd
// @namespace   Droidiy
// @match       *://bloxd.io/*
// @grant       GM_xmlhttpRequest
// @version     0.1
// @author      burner 4
// @description Uhm
// @downloadURL https://update.greasyfork.org/scripts/554072/Droidiy%20Bloxd.user.js
// @updateURL https://update.greasyfork.org/scripts/554072/Droidiy%20Bloxd.meta.js
// ==/UserScript==
 
(function(){
  'use strict';
 
  // raw URL to the file in Gitea
  const remoteUrlBase = 'https://gitea.com/Burning4u/bloxpoit/raw/branch/main/test-plot.js';
 
  // Add cache-busting param (use commit SHA instead for a permanent solution)
  const remoteUrl = remoteUrlBase + (remoteUrlBase.includes('?') ? '&' : '?') + '_=' + Date.now();
 
  function tryInlineInjection(code){
    try {
      const si = document.createElement('script');
      si.type = 'text/javascript';
      si.textContent = code;
      (document.head || document.documentElement).appendChild(si);
      console.log('[CRISTL] Inline injection succeeded.');
      setTimeout(()=>si.remove(), 1500);
    } catch (e) {
      console.error('[CRISTL] Inline injection failed:', e);
    }
  }
 
  function performInjection(text){
    const looksLikeHtml = /^\s*<!doctype|^\s*<html/i.test(text) || text.includes('<html') || text.length < 20;
    if (looksLikeHtml) {
      console.warn('[CRISTL] Remote response looks like HTML (maybe a viewer or error page). Aborting blob injection. Response snippet:', text.slice(0,200));
      return;
    }
 
    try {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      const blob = new Blob([text], { type: 'text/javascript' });
      s.src = URL.createObjectURL(blob);
      s.onload = () => {
        setTimeout(()=> {
          try { URL.revokeObjectURL(s.src); } catch(e) {}
          s.remove();
        }, 30000);
        console.log('[CRISTL] Script injected via blob URL.');
      };
      s.onerror = () => {
        console.warn('[CRISTL] Blob script failed to load; falling back to inline.');
        tryInlineInjection(text);
        s.remove();
      };
      (document.head || document.documentElement).appendChild(s);
    } catch(err){
      console.warn('[CRISTL] Blob creation/insertion failed, falling back to inline injection.', err);
      tryInlineInjection(text);
    }
  }
 
  console.log('[CRISTL] fetching remote script from:', remoteUrlBase);
 
  GM_xmlhttpRequest({
    method: 'GET',
    url: remoteUrl,
    headers: {
      // try to get freshest copy
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    },
    onload(response){
      try {
        const status = response.status || 0;
        console.log('[CRISTL] GM_xmlhttpRequest status:', status, 'response length:', (response.responseText||'').length);
        if (status < 200 || status >= 300) {
          console.warn('[CRISTL] Unexpected status code; response likely not raw JS. Snippet:', (response.responseText||'').slice(0,300));
          return;
        }
        const text = response.responseText || '';
        // quick sanity: log first 200 chars (helps detect HTML viewer)
        console.log('[CRISTL] response snippet:', text.slice(0,200));
        performInjection(text);
      } catch (e){
        console.error('[CRISTL] Error processing response', e);
      }
    },
    onerror(err){
      console.error('[CRISTL] GM_xmlhttpRequest error', err);
    },
    ontimeout(){
      console.warn('[CRISTL] GM_xmlhttpRequest timeout');
    },
    timeout: 15000
  });

})(); // <-- missing IIFE closer added here

 
// ==UserScript==
// @name         SimpCity & JPG6 — Wiwrutck Redirect Blocker
// @namespace    https://example.local/
// @version      1.1
// @description  Block wiwrutck.com redirects and injected scripts/popups on simpcity/jpg6 sites.
// @match        *://simpcity.su/*
// @match        *://www.simpcity.su/*
// @match        *://simpcity.cr/*
// @match        *://www.simpcity.cr/*
// @match        *://jpg6.su/*
// @match        *://www.jpg6.su/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552999/SimpCity%20%20JPG6%20%E2%80%94%20Wiwrutck%20Redirect%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/552999/SimpCity%20%20JPG6%20%E2%80%94%20Wiwrutck%20Redirect%20Blocker.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const REDIR_DOMAINS = /(wiwrutck\.com|clickpush|clkredirect|redirect|trackingdomain)/i;
  const PARAM_RE = /(?:[?&](?:url|u|link|redir|r|to)=)([^&]+)/i;

  function extractRealTarget(href){
    if(!href) return null;
    try{
      const match = href.match(PARAM_RE);
      if(match && match[1]) {
        const dec = decodeURIComponent(match[1]);
        if(/^https?:\/\//i.test(dec)) return dec;
      }
      const tail = href.split('/').slice(3).join('/');
      const decTail = decodeURIComponent(tail);
      if(/^https?:\/\//i.test(decTail)) return decTail;
    }catch{}
    return null;
  }

  function isRedirector(url){
    try {
      const u = new URL(url, location.href);
      return REDIR_DOMAINS.test(u.hostname);
    } catch {
      return REDIR_DOMAINS.test(url);
    }
  }

  // Block click redirects
  document.addEventListener('click', function(e){
    try{
      let el = e.target;
      while(el && el !== document){
        if(el.tagName === 'A' && el.href){
          const href = el.getAttribute('href') || '';
          if(isRedirector(href)){
            const real = extractRealTarget(href);
            e.preventDefault();
            e.stopImmediatePropagation();
            if(real){
              console.log('[Blocker] Redirect avoided →', real);
              location.href = real;
            } else {
              console.log('[Blocker] Blocked redirector with no real URL:', href);
            }
            return;
          }
        }
        el = el.parentNode;
      }
    }catch{}
  }, true);

  // Remove redirect scripts/iframes as they load
  function clean(root){
    if(!root || root.nodeType!==1) return;
    root.querySelectorAll('script,iframe').forEach(el=>{
      const s = el.src || el.getAttribute('src') || '';
      if(REDIR_DOMAINS.test(s)){
        el.remove();
        console.log('[Blocker] Removed injected redirect element:', s);
      }
    });
    root.querySelectorAll('a[href]').forEach(a=>{
      const href = a.getAttribute('href') || '';
      if(isRedirector(href)){
        const real = extractRealTarget(href);
        if(real) a.setAttribute('href', real);
      }
    });
  }

  const mo = new MutationObserver(muts=>{
    muts.forEach(m=>m.addedNodes.forEach(n=>clean(n)));
  });
  mo.observe(document, {subtree:true, childList:true});
  clean(document);

  console.log('✅ Wiwrutck Redirect Blocker active on', location.hostname);
})();

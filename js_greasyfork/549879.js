// ==UserScript==
// @name         IG Notification → Post Link - Yakl
// @namespace    instagram-link-fred
// @version      3.1
// @description  Per-notification 🔗 to ORIGINAL POST. Works for both "New" and "Old" stories.
// @match        https://www.instagram.com/*
// @run-at       document-end
// @grant        none
// @icon               https://www.google.com/s2/favicons?domain=www.instagram.com&sz=32
// @downloadURL https://update.greasyfork.org/scripts/549879/IG%20Notification%20%E2%86%92%20Post%20Link%20-%20Yakl.user.js
// @updateURL https://update.greasyfork.org/scripts/549879/IG%20Notification%20%E2%86%92%20Post%20Link%20-%20Yakl.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MATCH_RE = /(liked your comment|mentioned you|replied to your comment|replied to|liked a reply)/i;
  const APPLY_MS = 120;

  let textToShortcodes = new Map(); // key → [shortcodes]
  const attached = new WeakSet();
  let applyTimer = null;

  const isTimeish = (s) => /^\s*(?:now|just(?: now)?|\d+\s*[smhd]|less\s+\d+[mh]|[0-9]+d)\s*$/i.test(s || '');

  const norm = (s) =>
    (s || '')
      .replace(/\u2026/g,'...')
      .replace(/\s+/g,' ')
      .trim()
      .toLowerCase();

  const reduce = (s) =>
    norm(s)
      .replace(/(?:and\s+\d+\s+others)/g,'')
      .replace(/\bmore\b/g,'')
      .replace(/@\w+/g,'')
      .replace(/\d+(\.\d+)?[mk]?/g,'')
      .replace(/[^\p{L}\p{N}\s.,!?:/_-]/gu,'')
      .replace(/\s{2,}/g,' ')
      .trim();

  const buildKeys = (text) => {
    const full = norm(text);
    const short = reduce(text);
    const trunc = short.split('...')[0].trim();
    const keys = [full, short];
    if (trunc && trunc.length > 12) keys.push(trunc);
    return Array.from(new Set(keys)).filter(Boolean);
  };

  const scheduleApply = () => {
    if (applyTimer) return;
    applyTimer = setTimeout(() => { applyTimer = null; tryAttach(); }, APPLY_MS);
  };

  const candidateSpans = () =>
    Array.from(document.querySelectorAll('span[dir="auto"]'))
      .filter((span) => MATCH_RE.test(span.textContent || ''));

  const lookupShortcode = (rowText) => {
    const keys = buildKeys(rowText);
    // exact
    for (const k of keys) {
      if (textToShortcodes.has(k)) return textToShortcodes.get(k)[0];
    }
    // soft contains
    for (const [k, arr] of textToShortcodes.entries()) {
      for (const rk of keys) {
        if (rk.includes(k) || k.includes(rk)) return arr[0];
      }
    }
    return null;
  };

  const tryAttach = () => {
    candidateSpans().forEach((span) => {
      if (span.dataset.fredLinkDone === '1') return;
      if (attached.has(span)) return;

      const row = span.closest('a, div') || span.parentElement;
      const pieces = Array.from(row.querySelectorAll('span'))
        .map(el => (el.textContent || '').trim())
        .filter(t => t && !isTimeish(t));
      const fullText = pieces.join(' ').replace(/\s{2,}/g,' ').trim();

      const sc = lookupShortcode(fullText || span.textContent || '');
      if (!sc) return;

      const btn = document.createElement('button');
      btn.textContent = '🔗';
      btn.title = 'Open original post';
      Object.assign(btn.style,{
        marginLeft:'6px',
        border:'none',
        padding:'0 4px',
        borderRadius:'6px',
        background:'transparent',
        cursor:'pointer',
        fontSize:'14px',
        lineHeight:'1'
      });

      const stop = (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };
      btn.addEventListener('click',(e)=>{ stop(e); location.assign(`https://www.instagram.com/p/${sc}/`); },{capture:true});
      btn.addEventListener('mousedown',stop,{capture:true});
      btn.addEventListener('mouseup',stop,{capture:true});

      // Insert before timestamp if possible
      const timeEl = Array.from(row.querySelectorAll('*')).find(el => isTimeish((el.textContent||'').trim()));
      if (timeEl && timeEl.parentElement) {
        timeEl.parentElement.insertBefore(btn,timeEl);
      } else {
        span.appendChild(btn);
      }

      span.dataset.fredLinkDone='1';
      attached.add(span);
      console.log('[IG-PostLink] mapped', fullText, '→', sc);
    });
  };

  // -------- NEW: extractStories + processInbox --------
  const extractStories = (json) => {
    const out = [];
    for (const [k, v] of Object.entries(json || {})) {
      if (!/stories/i.test(k) || !v) continue;
      const arr = Array.isArray(v) ? v : Object.values(v);
      for (const item of arr) out.push(item);
    }
    return out;
  };

  const processInbox = (json) => {
    const items = extractStories(json);
    let newAdded=0;
    for (const n of items) {
      const text = n?.args?.text || '';
      const sc   = n?.args?.media?.[0]?.shortcode || null;
      if (!text || !sc) continue;
      for (const k of buildKeys(text)) {
        if (!textToShortcodes.has(k)) textToShortcodes.set(k,[]);
        const arr = textToShortcodes.get(k);
        if (!arr.includes(sc)) {
          arr.push(sc);
          newAdded++;
        }
      }
    }
    if (newAdded) scheduleApply();
  };

  // Hook XHR
  (function hookXHR(){
    const _open=XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open=function(...a){
      this.addEventListener('load',function(){
        try{
          if(this.responseURL.includes('/api/v1/news/inbox/')){
            processInbox(JSON.parse(this.responseText));
          }
        }catch{}
      });
      return _open.apply(this,a);
    };
  })();

  // Hook fetch
  (function hookFetch(){
    const _fetch=window.fetch;
    window.fetch=async function(...a){
      const res=await _fetch.apply(this,a);
      try{
        const url=(a[0]&&(a[0].url||a[0]))+'';
        if(url.includes('/api/v1/news/inbox/')){
          res.clone().text().then(t=>{ try{processInbox(JSON.parse(t));}catch{} });
        }
      }catch{}
      return res;
    };
  })();

  const mo = new MutationObserver(()=>scheduleApply());
  mo.observe(document.documentElement,{subtree:true,childList:true});

  scheduleApply();
})();

// ==UserScript==
// @name         Anti Popup (Enhanced 90%+ Block • Patch++)
// @namespace    ryza-no-popup-strong
// @version      2.7
// @description  Block popups from window.open/about:blank, target=_blank (links/forms/area), base target, and synthetic clicks
// @license      Ryza License
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551690/Anti%20Popup%20%28Enhanced%2090%25%2B%20Block%20%E2%80%A2%20Patch%2B%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551690/Anti%20Popup%20%28Enhanced%2090%25%2B%20Block%20%E2%80%A2%20Patch%2B%2B%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const WHITELIST = ['accounts.google.com','paypal.com'];

  const isWhite = (url) => {
    try { return WHITELIST.includes(new URL(url, location.href).hostname); }
    catch { return false; }
  };

  /* ---------- 1) Kill window.open (incl. iframe) ---------- */
  const trapOpen = new Proxy(window.open, {
    apply(_, __, args) {
      const url = args?.[0];
      if (!url || isWhite(url)) return null;
      console.warn('[AntiPopup] window.open blocked:', url);
      return null;
    }
  });
  try { Object.defineProperty(window, 'open', { configurable:true, writable:true, value:trapOpen }); }
  catch { window.open = trapOpen; }

  /* Hook iframe created later */
  const origCreateEl = Document.prototype.createElement;
  Document.prototype.createElement = function(...a){
    const el = origCreateEl.apply(this, a);
    if ((a[0]+'').toLowerCase() === 'iframe') {
      setTimeout(()=>{ try { el.contentWindow.open = () => null; } catch{} }, 500);
    }
    return el;
  };

  /* ---------- 2) Neutralize <base target="_blank"> ---------- */
  const neuterBase = (root=document) => {
    root.querySelectorAll('base[target]').forEach(b => b.removeAttribute('target'));
  };

  /* ---------- 3) Sanitize anchors/forms/areas ---------- */
  const sanitizeLink = (a) => {
    if (!a) return;
    const href = a.getAttribute('href') || a.href || '';
    if (!isWhite(href)) a.removeAttribute('target');
    const oc = (a.getAttribute('onclick') || '').toLowerCase();
    if (oc.includes('window.open')) a.removeAttribute('onclick');
  };
  const sanitizeForm = (f) => {
    try {
      const act = f.getAttribute('action') || '';
      if (!isWhite(act)) f.removeAttribute('target');
    } catch {}
  };
  const sanitizeArea = (ar) => {
    const href = ar.getAttribute('href') || '';
    if (!isWhite(href)) ar.removeAttribute('target');
  };

  const sanitizeAll = (root=document) => {
    neuterBase(root);
    root.querySelectorAll('a[target], a[onclick]').forEach(sanitizeLink);
    root.querySelectorAll('form[target]').forEach(sanitizeForm);
    root.querySelectorAll('area[target]').forEach(sanitizeArea);
  };

  /* ---------- 4) Stop synthetic click tricks ---------- */
  const origAclick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function(...args){
    sanitizeLink(this);
    return origAclick.apply(this, args);
  };
  const origFormSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function(...args){
    sanitizeForm(this);
    return origFormSubmit.apply(this, args);
  };

  /* ---------- 5) Pre-click hardening (captures) ---------- */
  const preClick = (e) => {
    // bersihkan tepat sebelum event utama diproses
    neuterBase();
    const a = e.target && (e.target.closest?.('a,area') || null);
    const f = e.target && (e.target.closest?.('form') || null);
    if (a) sanitizeLink(a);
    if (f) sanitizeForm(f);
  };
  ['pointerdown','mousedown','touchstart','click','auxclick'].forEach(ev=>{
    document.addEventListener(ev, preClick, true);
  });

  /* ---------- 6) Observe dynamic injections ---------- */
  new MutationObserver(muts=>{
    for (const m of muts) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.tagName === 'BASE') neuterBase(document);
        if (n.matches?.('a')) sanitizeLink(n);
        if (n.matches?.('form')) sanitizeForm(n);
        if (n.matches?.('area')) sanitizeArea(n);
        if (n.querySelectorAll){
          sanitizeAll(n);
          n.querySelectorAll('iframe').forEach(i=>{ try { i.contentWindow.open = () => null; } catch{} });
        }
      }
    }
  }).observe(document.documentElement, { childList:true, subtree:true });

  /* ---------- 7) Block forced redirects ---------- */
  const oa = window.location.assign.bind(window.location);
  window.location.assign = (url)=>{ if (!isWhite(url)) { console.warn('[AntiPopup] redirect blocked:', url); return; } oa(url); };
  const or = window.location.replace.bind(window.location);
  window.location.replace = (url)=>{ if (!isWhite(url)) { console.warn('[AntiPopup] replace blocked:', url); return; } or(url); };

  // Initial sweep
  sanitizeAll();

  console.log('[AntiPopup+] Patch++ active');
})();
// ==UserScript==
// @name         [EOL] 1337 Toggle (gh_beta&engine_search)
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.1
// @description  ON setzt gh_beta via Redirect auf <suche>?fs=<dynamisch|NULL>&gh_beta=engine_search, OFF setzt …&gh_beta=. Badge grau bei OFF. 1337-Marker vor .filterview bei aktivem Beta. de/at/eu.
// @author       Martin Kaiser
// @match        https://geizhals.de/*
// @match        https://geizhals.at/*
// @match        https://geizhals.eu/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/552178/%5BEOL%5D%201337%20Toggle%20%28gh_betaengine_search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552178/%5BEOL%5D%201337%20Toggle%20%28gh_betaengine_search%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Keys & const ----------
  const LS_STATE   = 'gh_1337_toggle_state'; // 'on' | 'off' (UI-Fallback)
  const SS_PENDING = 'gh1337_pending';       // 'on' | 'off' (Redirect-Flow)
  const SS_RETURN  = 'gh1337_return_url';

  const COOKIE_NAME     = 'gh_beta';
  const CONFCOOKIE_NAME = 'GeizhalsConfcookie';
  const BETA_VALUE      = 'engine_search';
  const MARKER_SELECTOR = '.gh1337-marker';

  // ---------- Domain routing ----------
  const host = location.hostname;
  const tld  = host.endsWith('.de') ? 'de' : host.endsWith('.eu') ? 'eu' : 'at';
  const base = `https://geizhals.${tld}`;

  // fs dynamisch ermitteln: wenn wir NICHT auf /?fs=… sind → "NULL"
  function getDynamicFs() {
    try {
      const url = new URL(location.href);
      const onRoot = url.pathname === '/' || url.pathname === '';
      const fs = url.searchParams.get('fs');
      if (onRoot && fs && String(fs).trim() !== '') {
        return String(fs).trim();
      }
    } catch {}
    return 'NULL';
  }
  function buildToggleUrl(isOn) {
    const fsVal = getDynamicFs(); // z.B. "1234" oder "NULL"
    const gh = isOn ? BETA_VALUE : '';
    return `${base}/?fs=${encodeURIComponent(fsVal)}&gh_beta=${encodeURIComponent(gh)}&gh1337=1`;
  }

  // ---------- Redirect-Flow ----------
  (function handlePendingRedirect() {
    const pending = sessionStorage.getItem(SS_PENDING);
    const ret     = sessionStorage.getItem(SS_RETURN);
    if (!pending || !ret) return;
    setTimeout(() => {
      try {
        sessionStorage.removeItem(SS_PENDING);
        sessionStorage.removeItem(SS_RETURN);
      } catch {}
      location.replace(ret); // zurück ohne neue History-Ebene
    }, 50);
  })();

  // ---------- Cookie helpers ----------
  function getCookieValue(name){
    const m = document.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));
    return m ? m.split('=').slice(1).join('=') : '';
  }
  function safeDecode(v){ try { return decodeURIComponent(v); } catch { return v; } }

  // Beta-Status aus echten Cookies ermitteln:
  function isBetaActiveFromCookies(){
    if (document.cookie.includes(`${COOKIE_NAME}=${BETA_VALUE}`)) return true;
    const confRaw = getCookieValue(CONFCOOKIE_NAME);
    if (!confRaw) return false;
    const d = safeDecode(confRaw);
    if (d.includes('gh_beta&engine_search')) return true;
    if (d.includes('gh_beta=engine_search')) return true;
    if (/(^|&)gh_beta&(?=&|$)/.test(d)) return false; // explizit OFF
    return false;
  }

  // ---------- UI: Toggle + styles ----------
  const css = `
    .gh1337-wrapper{display:inline-flex;align-items:center;gap:6px;margin-right:10px;vertical-align:middle;}
    .gh1337-label{font-size:11px;color:#fff;background:#d00;padding:1px 6px;border-radius:4px;user-select:none;line-height:1.6;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;transition:opacity .2s, filter .2s, background-color .2s;}
    .gh1337-label.is-off{background:#888;color:#eee;}
    .gh1337-switch{position:relative;display:inline-block;width:38px;height:20px;}
    .gh1337-switch input{opacity:0;width:0;height:0;}
    .gh1337-slider{position:absolute;inset:0;cursor:pointer;background:#ccc;transition:.25s;border-radius:20px;}
    .gh1337-slider:before{content:"";position:absolute;height:14px;width:14px;left:3px;bottom:3px;background:#fff;transition:.25s;border-radius:50%;box-shadow:0 1px 2px rgba(0,0,0,.25);}
    .gh1337-switch input:checked + .gh1337-slider{background:#d00;}
    .gh1337-switch input:checked + .gh1337-slider:before{transform:translateX(18px);}
    .gh1337-marker{display:block;}
  `;
  injectCSS(css);

  function tryMountToggle(){
    // Primär-Anchor: Deals; Fallback: Wunschlisten (wls)
    const dealsLink = document.querySelector('a.secondary-nav-item__link[data-t-id="deals"]');
    const wlsLink   = document.querySelector('a.secondary-nav-item__link[data-t-id="wls"]');
    const anchor = dealsLink || wlsLink;
    if (!anchor) return false;

    if (document.querySelector('.gh1337-wrapper')) return true;

    const wrap  = el('span','gh1337-wrapper');
    const badge = el('span','gh1337-label','1337');
    const lab   = el('label','gh1337-switch');
    const input = document.createElement('input');
    input.type = 'checkbox';

    const cookieOn = isBetaActiveFromCookies();
    const lsOn     = (localStorage.getItem(LS_STATE) || 'off') === 'on';
    const isOn     = cookieOn || lsOn;

    input.checked = isOn;
    updateBadgeAppearance(badge, isOn);

    const slider = el('span','gh1337-slider');
    lab.appendChild(input); lab.appendChild(slider);
    wrap.appendChild(badge); wrap.appendChild(lab);

    // links neben Anchor (Deals oder Wunschlisten) einfügen
    const parent = anchor.parentElement || anchor;
    parent.insertBefore(wrap, anchor);

    input.addEventListener('change', () => {
      const nextOn = input.checked;
      localStorage.setItem(LS_STATE, nextOn ? 'on' : 'off');
      updateBadgeAppearance(badge, nextOn);

      // Redirect-Flow vorbereiten & dynamische URL navigieren
      try {
        sessionStorage.setItem(SS_PENDING, nextOn ? 'on' : 'off');
        sessionStorage.setItem(SS_RETURN, location.href);
      } catch {}
      const target = buildToggleUrl(nextOn);
      location.href = target;
    });

    return true;
  }

  if (!tryMountToggle()){
    const mo = new MutationObserver(()=>{ if (tryMountToggle()) mo.disconnect(); });
    mo.observe(document.documentElement, {childList:true,subtree:true});
    setTimeout(()=>tryMountToggle(), 2000);
  }

  function updateBadgeAppearance(badgeEl, on){
    if (!badgeEl) return;
    if (on) badgeEl.classList.remove('is-off');
    else badgeEl.classList.add('is-off');
  }

  // ---------- „1337“-Marker vor .filterview (nur bei aktivem Beta, nur wenn dort nicht schon „1337“) ----------
  function cookieShowsActiveBeta(){ return isBetaActiveFromCookies(); }

  function render1337IfNeeded() {
    if (!cookieShowsActiveBeta()) return;

    const main = document.getElementById('main-content');
    if (!main) return;

    const filter = main.querySelector(':scope > .filterview');
    if (!filter) return;

    const prev = previousNonEmptySibling(filter);
    if (prev) {
      if (prev.nodeType === 3 && prev.textContent.trim() === '1337') return;
      if (prev.nodeType === 1) {
        const elPrev = /** @type {HTMLElement} */(prev);
        if (elPrev.matches(MARKER_SELECTOR)) return;
        if (elPrev.textContent && elPrev.textContent.trim() === '1337') return;
      }
    }

    const marker = el('div','gh1337-marker','1337');
    main.insertBefore(marker, filter);
  }

  const bootTry = () => render1337IfNeeded();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootTry);
  else bootTry();
  const ro = new MutationObserver(() => render1337IfNeeded());
  ro.observe(document.documentElement, { childList: true, subtree: true });

  // ---------- Utils ----------
  function el(tag, cls, text){ const n=document.createElement(tag); if(cls) n.className=cls; if(text!=null) n.textContent=text; return n; }
  function injectCSS(text){ const s=document.createElement('style'); s.textContent=text; document.head.appendChild(s); }
  function previousNonEmptySibling(node){
    let p = node.previousSibling;
    while (p && p.nodeType === 3 && !p.textContent.trim()) p = p.previousSibling;
    return p || null;
  }
})();

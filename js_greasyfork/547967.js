// ==UserScript==
// @name         LS-RP Forums – Love All + Post Counter
// @version      1.0.0
// @description  One-click “Love All” (reaction id 18) for the current LS-RP forum topic page + live post counter.
// @author       blanco (adapted for LS-RP)
// @license      All Rights Reserved
// @match        https://community.ls-rp.com/forums/*
// @grant        none
// @icon         data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>
// @namespace    https://greasyfork.org/users/1496525
// @downloadURL https://update.greasyfork.org/scripts/547967/LS-RP%20Forums%20%E2%80%93%20Love%20All%20%2B%20Post%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/547967/LS-RP%20Forums%20%E2%80%93%20Love%20All%20%2B%20Post%20Counter.meta.js
// ==/UserScript==

// © 2025 blanco. All rights reserved.
// This script is proprietary. You may not copy, modify, distribute, or use any part of it without explicit written permission.

(() => {
  'use strict';

  const CONFIG = {
    reactionId: 18,              // LS-RP "Love" reaction id
    likeDelay: 500,
    likeDelayJitterPct: 0.4,
    badgeBottom: 150,
    counterDebounce: 250,
    maxRetries: 3,
    rateLimitPause: 30000
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const jitter = (ms, pct = CONFIG.likeDelayJitterPct) => {
    const d = ms * pct;
    return Math.max(0, Math.round(ms + (Math.random() * 2 - 1) * d));
  };
  const parseRetryAfter = v => {
    if (!v) return null;
    const n = Number(v);
    if (!Number.isNaN(n)) return n * 1000;
    const t = Date.parse(v);
    const diff = t - Date.now();
    return Number.isFinite(diff) && diff > 0 ? diff : null;
  };

  // Toast notification (kept minimal; why: informs rate limit & completion without blocking)
  const notifEl = (() => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', top: '20px', right: '20px',
      padding: '12px 24px', borderRadius: '6px', fontSize: '16px', zIndex: 10001,
      boxShadow: '0 2px 8px rgba(0,0,0,.18)', opacity: '.98', pointerEvents: 'none',
      maxWidth: '60ch'
    });
    document.body.appendChild(el);
    return el;
  })();
  function showNotification(msg, dur = 3000) {
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    notifEl.style.background = dark ? '#222' : '#f5f5f5';
    notifEl.style.color = dark ? '#fff' : '#222';
    notifEl.textContent = msg;
    notifEl.style.display = 'block';
    setTimeout(() => { notifEl.style.display = 'none'; }, dur);
  }

  // Live post counter
  const badgeEl = (() => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', right: '20px', bottom: `${CONFIG.badgeBottom}px`,
      padding: '8px 16px', borderRadius: '8px', fontSize: '15px', zIndex: 10001,
      boxShadow: '0 2px 8px rgba(0,0,0,.18)', pointerEvents: 'none', userSelect: 'none'
    });
    document.body.appendChild(el);
    return el;
  })();
  function updateBadge() {
    const cnt = document.querySelectorAll('article[id^="elComment_"]').length;
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    badgeEl.style.background = dark ? '#222' : '#f5f5f5';
    badgeEl.style.color = dark ? '#fff' : '#222';
    badgeEl.textContent = `Posts: ${cnt}`;
  }
  const debounce = (fn, wait) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
  const debouncedUpdate = debounce(updateBadge, CONFIG.counterDebounce);
  window.addEventListener('load', updateBadge);
  new MutationObserver(m => { for (const r of m) { if (r.addedNodes.length || r.removedNodes.length) { debouncedUpdate(); break; } } })
    .observe(document.getElementById('elContent') || document.body, { childList: true, subtree: true });

  // Floating action button (why: single-access trigger; keyboard accessible)
  const loveBtn = (() => {
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Love all posts on this page');
    btn.setAttribute('title', 'Love all posts on this page');
    btn.tabIndex = 0;
    Object.assign(btn.style, {
      position: 'fixed', right: '20px', bottom: '80px', zIndex: 10001,
      borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,.18)', padding: '6px', cursor: 'pointer',
      border: 'none'
    });
    const img = document.createElement('img');
    img.src = 'https://i.imgur.com/b7IZU6X.gif';
    img.width = 48;
    img.height = 48;
    img.alt = 'Love All';
    btn.appendChild(img);
    const applyTheme = () => {
      const dark = matchMedia('(prefers-color-scheme: dark)').matches;
      btn.style.background = dark ? '#222' : '#fff';
    };
    applyTheme();
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
    document.body.appendChild(btn);
    return btn;
  })();
  function toggleBtn(disabled, label) {
    loveBtn.style.opacity = disabled ? '0.5' : '1';
    loveBtn.disabled = !!disabled;
    if (label) loveBtn.title = label;
  }

  // Build list of reaction links targeting reactionId for each unreacted post
  function fetchLoveReactionLinks() {
    const seen = new Set();
    const links = [];
    const containers = document.querySelectorAll('span.ipsReact_button[data-action="reactLaunch"]:not(.ipsReact_button_selected):not(.ipsReact_button--selected)');

    containers.forEach(cont => {
      // 1) Try to find a direct reaction link with reaction=CONFIG.reactionId
      let a = cont.querySelector(`a.ipsReact_reaction[data-role="reaction"][href*="do=reactComment"][href*="reaction=${CONFIG.reactionId}"][href*="csrfKey="]`);

      // 2) Fallback: take default reaction link and swap reaction param to CONFIG.reactionId
      if (!a) {
        const def = cont.querySelector('a.ipsReact_reaction[data-role="reaction"][data-defaultreaction][href*="do=reactComment"][href*="csrfKey="]');
        if (def && def.href) {
          try {
            const url = new URL(def.href, location.origin);
            url.searchParams.set('reaction', String(CONFIG.reactionId));
            const fake = document.createElement('a');
            fake.href = url.toString();
            a = fake;
          } catch { /* ignore malformed */ }
        }
      }

      if (a && a.href && a.href.includes('do=reactComment') && a.href.includes('csrfKey=')) {
        if (!seen.has(a.href)) { seen.add(a.href); links.push(a); }
      }
    });

    return links;
  }

  const abortCtrl = new AbortController();
  window.addEventListener('beforeunload', () => abortCtrl.abort());

  async function reactViaAjax(link, attempt = 0) {
    try {
      const r = await fetch(link.href, {
        method: 'GET', credentials: 'include', signal: abortCtrl.signal,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Referer': location.href }
      });
      if (r.status === 429) {
        const ra = parseRetryAfter(r.headers.get('Retry-After'));
        const pause = ra ?? CONFIG.rateLimitPause;
        showNotification(`Rate-limited — pausing ${Math.round(pause / 1000)}s`);
        await sleep(pause);
        return reactViaAjax(link, attempt + 1);
      }
      if (!r.ok) throw new Error(String(r.status));
      return true;
    } catch {
      if (attempt < CONFIG.maxRetries) {
        const backoff = jitter(2 ** attempt * 1000, 0.25);
        await sleep(backoff);
        return reactViaAjax(link, attempt + 1);
      }
      return false;
    }
  }

  async function loveAll() {
    const links = fetchLoveReactionLinks();
    if (!links.length) {
      showNotification('No un-reacted posts found on this page.');
      return;
    }
    toggleBtn(true, `Loving 0 / ${links.length}`);
    let ok = 0, fail = 0;
    for (let i = 0; i < links.length; i++) {
      toggleBtn(true, `Loving ${i + 1} / ${links.length}`);
      (await reactViaAjax(links[i])) ? ok++ : fail++;
    }
    toggleBtn(false, 'Love all posts on this page');
    showNotification(`Finished! ❤ ${ok} ❌ ${fail}`);
  }

  loveBtn.addEventListener('click', loveAll);
  loveBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') loveAll();
  });
})();

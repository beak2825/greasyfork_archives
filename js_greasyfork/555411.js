// ==UserScript==
// @name         Spotify Lyrics: Trad ⇄ Simplified
// @namespace    https://holsoma.github.io/
// @version      1.1.0
// @description  Convert Traditional⇄Simplified Chinese lyrics on Spotify fullscreen lyrics page
// @author       holsoma
// @license      MIT
// @match        https://open.spotify.com/*
// @icon         https://open.spotify.com/favicon.ico
// @homepageURL  https://github.com/yourname/spotify-lyrics-converter
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555411/Spotify%20Lyrics%3A%20Trad%20%E2%87%84%20Simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/555411/Spotify%20Lyrics%3A%20Trad%20%E2%87%84%20Simplified.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG      = '[Lyrics ZH Converter]';
  const SEL_LINE = '[data-testid="lyrics-line"] .MmIREVIj8A2aFVvBZ2Ev';
  const SWEEP_MS = 350;

  // --- Converter (T->CN). Revert uses stored originals.
  let toS = s => s;
  (function setupConverter(){
    try {
      if (window.OpenCC?.t2cn)        { toS = s => OpenCC.t2cn(s); console.log(LOG, 'OpenCC.t2cn active'); }
      else if (window.t2cn)           { toS = s => t2cn(s);        console.log(LOG, 'global t2cn() active'); }
      else if (window.OpenCC?.Converter) { const c = OpenCC.Converter({from:'t',to:'cn'}); toS = s => c(s); console.log(LOG, 'OpenCC.Converter {t→cn} active'); }
      else                            { console.warn(LOG, 'No T→CN converter found; lyrics unchanged.'); }
    } catch (e) { console.warn(LOG, 'Converter setup error:', e); }
  })();

  // --- Cache original Traditional text per line
  function cacheOriginals(scope = document) {
    scope.querySelectorAll(SEL_LINE).forEach(el => {
      if (!el.hasAttribute('data-orig')) el.setAttribute('data-orig', (el.textContent || '').trim());
    });
  }

  // --- Rewrite helper
  function rewrite(toSimplified, scope = document) {
    cacheOriginals(scope);
    let changed = 0;
    scope.querySelectorAll(SEL_LINE).forEach(el => {
      const orig   = el.getAttribute('data-orig') ?? el.textContent ?? '';
      const target = toSimplified ? toS(orig) : orig;
      if (el.textContent !== target) { el.textContent = target; changed++; }
    });
    if (changed) console.log(LOG, `Rewrote ${changed} line(s) → ${toSimplified ? 'Simplified' : 'Traditional'}`);
    return changed;
  }

  // --- State + observers
  let isSimplified = true;
  let lyricsMO = null, pageMO = null, sweepTimer = null, btn = null;

  function hookLyricsObserver() {
    const host = document.querySelector('[data-testid="lyrics-line"]')?.parentElement;
    if (!host) return false;
    if (lyricsMO) lyricsMO.disconnect();

    lyricsMO = new MutationObserver(muts => {
      cacheOriginals(host);
      if (!isSimplified) return;
      // Convert only what changed for efficiency
      muts.forEach(m => {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE) rewrite(true, n);
          });
        } else if (m.type === 'characterData') {
          const el = m.target.parentElement;
          if (el && el.matches(SEL_LINE)) {
            const orig = el.getAttribute('data-orig') ?? el.textContent ?? '';
            const target = toS(orig);
            if (el.textContent !== target) el.textContent = target;
          }
        }
      });
    });
    lyricsMO.observe(host, { subtree: true, childList: true, characterData: true });
    return true;
  }

  function startSweep() {
    if (sweepTimer) return;
    sweepTimer = setInterval(() => {
      cacheOriginals(document);
      if (isSimplified) rewrite(true, document);
    }, SWEEP_MS);
  }
  function stopSweep() { if (sweepTimer) { clearInterval(sweepTimer); sweepTimer = null; } }

  // --- Mount the toggle INSIDE the lyrics container
  function mountToggle() {
    const container = document.querySelector('[data-testid="lyrics-line"]')?.parentElement;
    if (!container) return false;

    // Ensure positioning context so our absolute button sits bottom-right of panel
    const cs = getComputedStyle(container);
    if (cs.position === 'static') container.setAttribute('data-lyricszh-pos', container.style.position = 'relative');

    if (btn && btn.isConnected) btn.remove();
    btn = document.createElement('button');
    btn.textContent = '繁 / 简';
    btn.setAttribute('data-lyricszh-toggle', '1');
    Object.assign(btn.style, {
      position: 'absolute',
      right: '8px',
      bottom: '8px',
      padding: '6px 10px',
      fontSize: '12px',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      color: '#fff',
      background: 'rgba(30,30,30,.55)',
      border: '1px solid rgba(255,255,255,.28)',
      borderRadius: '8px',
      cursor: 'pointer',
      zIndex: 2147483647,
      backdropFilter: 'blur(4px)',
      userSelect: 'none'
    });
    btn.title = 'Toggle Traditional / Simplified (Alt+L)';

    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      isSimplified = !isSimplified;
      if (isSimplified) { rewrite(true);  startSweep();  btn.style.background = 'rgba(30,30,30,.55)'; }
      else              { rewrite(false); stopSweep();   btn.style.background = 'rgba(80,80,80,.55)'; }
    });

    // Initial visual state
    btn.style.background = isSimplified ? 'rgba(30,30,30,.55)' : 'rgba(80,80,80,.55)';

    container.appendChild(btn);
    return true;
  }

  // --- Hotkey: Alt+L
  window.addEventListener('keydown', e => {
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 'l' || e.key === 'L')) {
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      isSimplified = !isSimplified;
      if (isSimplified) { rewrite(true);  startSweep(); }
      else              { rewrite(false); stopSweep(); }
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

  // --- Boot
  function boot() {
    if (!/open\.spotify\.com$/.test(location.hostname)) return;

    if (pageMO) pageMO.disconnect();
    pageMO = new MutationObserver(() => {
      if (document.querySelector(SEL_LINE)) {
        cacheOriginals();
        hookLyricsObserver();
        if (!btn) mountToggle(); else if (!btn.isConnected) mountToggle();
        if (isSimplified) { rewrite(true); startSweep(); }
      }
    });
    pageMO.observe(document.documentElement, { subtree: true, childList: true });

    if (document.querySelector(SEL_LINE)) {
      cacheOriginals();
      hookLyricsObserver();
      mountToggle();
      if (isSimplified) { rewrite(true); startSweep(); }
    }

    // tiny debug
    window.__lyricsZH = {
      mode: () => (isSimplified ? 'Simplified' : 'Traditional'),
      remount: () => mountToggle(),
    };

    console.log(LOG, 'Initialized (anchored toggle).');
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
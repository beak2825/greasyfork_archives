// ==UserScript==
// @name         SpotiDown Helper + Spotify UI Integration
// @namespace    sharmanhall.spotidown.helper
// @version      1.9.0
// @description  Spotify-side buttons that send tracks/playlists to spotidown.app (+ auto flow). On spotidown.app: resolve per-track links in parallel, show counters, bulk-open, clean filenames, retry, persistent UI.
// @match        https://open.spotify.com/*
// @match        https://spotidown.app/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551399/SpotiDown%20Helper%20%2B%20Spotify%20UI%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/551399/SpotiDown%20Helper%20%2B%20Spotify%20UI%20Integration.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***************************************************************************
   *  A) SPOTIFY INTEGRATION (open.spotify.com)
   *     - Adds per-track "Download" pill left of each track row
   *     - Adds page-level "Download via SpotiDown" button on playlist/album
   *     - Sends URL to spotidown.app with query params for auto-behavior
   ***************************************************************************/
  const SPOTIDOWN_BASE = 'https://spotidown.app/';
  const AUTO_FLAGS = { sdh_auto: '1' }; // also supports sdh_open=1 to auto-open after resolve

  function isSpotify() { return location.host === 'open.spotify.com'; }
  function isSpotiDown() { return location.host === 'spotidown.app'; }

  function buildSpotiDownURL(spUrl, extraFlags = {}) {
    const u = new URL(SPOTIDOWN_BASE);
    u.searchParams.set('sdh_url', spUrl);
    Object.entries({...AUTO_FLAGS, ...extraFlags}).forEach(([k,v]) => u.searchParams.set(k, v));
    return u.toString();
  }

  function cssInjectSpotify() {
    if (document.getElementById('sdh-spotify-css')) return;
    const style = document.createElement('style');
    style.id = 'sdh-spotify-css';
    style.textContent = `
      .sdh-row-dl {
        width: 28px; height: 28px; border-radius: 50%;
        border: 0; background:#1fdf64; color:#000; font-weight:700;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer; transform: translateY(-50%); position:absolute; top:50%; right:100%; margin-right:8px;
      }
      .sdh-row-dl:hover { transform: translateY(-50%) scale(1.08); }
      .sdh-page-dl {
        display:inline-flex; align-items:center; gap:8px; padding:8px 10px; border:0;
        border-radius:6px; background:#1fdf64; color:#000; font-weight:700; cursor:pointer;
      }
      .sdh-page-dl:hover { filter:brightness(1.05); }
    `;
    document.head.appendChild(style);
  }

  function getTrackHrefFromRow(row) {
    // Typical structure: row contains an anchor with href /track/{id}
    const a = row.querySelector('a[href*="/track/"]');
    return a ? (new URL(a.href, location.href)).toString() : null;
  }

  function addRowButton(row) {
    if (row.__sdh_dl) return;
    const href = getTrackHrefFromRow(row);
    if (!href) return;

    const btn = document.createElement('button');
    btn.className = 'sdh-row-dl';
    btn.title = 'Download via SpotiDown';
    btn.textContent = '↓';
    // Find a good anchor position: Spotify rows are position:relative; we attach inside
    row.style.position = row.style.position || 'relative';
    row.appendChild(btn);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(buildSpotiDownURL(href, { sdh_open:'1' }), '_blank', 'noopener');
    });

    row.__sdh_dl = true;
  }

  function addPageButton() {
    if (document.getElementById('sdh-page-dl')) return;
    // Try to find the action bar row / header controls area
    const host = document.querySelector('[data-testid="action-bar-row"]') ||
                 document.querySelector('[data-testid="entity-header"]') ||
                 document.querySelector('header') ||
                 document.body;

    const btn = document.createElement('button');
    btn.id = 'sdh-page-dl';
    btn.className = 'sdh-page-dl';
    btn.innerHTML = '↓ Download via SpotiDown';

    btn.addEventListener('click', () => {
      const url = location.href;
      // On playlists/albums/tracks, just send current URL
      window.open(buildSpotiDownURL(url, { sdh_open:'1' }), '_blank', 'noopener');
    });

    host.prepend(btn);
  }

  function scanSpotify() {
    cssInjectSpotify();
    addPageButton();
    // Add per-row button
    document.querySelectorAll('[data-testid="tracklist-row"]').forEach(addRowButton);
    requestAnimationFrame(scanSpotify);
  }

  /***************************************************************************
   *  B) SPOTIDOWN HELPER (spotidown.app)
   *     - Your 1.7.0 core with:
   *         - Toolbar anchored above #download-section (persists across swaps)
   *         - Resolve in parallel, bulk open, retry with fixed counters
   *         - Auto flow if ?sdh_url=... (+ sdh_auto=1, sdh_open=1)
   ***************************************************************************/
  function spotiDownHelper() {
    // ---------- SETTINGS ----------
    const MAX_TRACKS      = 100;        // upper bound to process on the page
    const RESOLVE_POOL    = 3;          // concurrent resolves
    const PACE_MS         = [100, 300]; // delay between resolves
    const OPEN_DELAY_MS   = 500;        // delay between opening resolved links
    const OPEN_MODE       = 'iframe';   // 'tab' | 'iframe' | 'navigate'
    // -------------------------------
    const Stats = { total: 0, resolved: 0, opened: 0, failed: 0 };
    const state = { sectionObserver:null, anchorObserver:null, healTimer:null };

    function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }
    function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
    const pace = () => wait(randInt(PACE_MS[0], PACE_MS[1]));

    // ---------- STABLE MOUNT ----------
    function getToolbarAnchor() {
      const sec = document.getElementById('download-section');
      const parent = sec?.parentElement || document.querySelector('main .container') || document.querySelector('main') || document.body;
      if (!parent) return null;
      let anchor = document.getElementById('sdh-toolbar-anchor');
      if (!anchor) {
        anchor = document.createElement('div');
        anchor.id = 'sdh-toolbar-anchor';
        if (sec && sec.parentElement === parent) parent.insertBefore(anchor, sec);
        else parent.prepend(anchor);
      }
      return anchor;
    }

    function ensureToolbar() {
      const host = getToolbarAnchor();
      if (!host) return null;
      let bar = document.getElementById('sdh-toolbar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'sdh-toolbar';
        bar.innerHTML = `
          <div id="sdh-buttons" style="margin-bottom:8px;"></div>
          <div id="sdh-counters" style="margin:6px 0 10px 0;font-weight:600;">
            <span id="sdh-count-total">Total: 0</span> ·
            <span id="sdh-count-res">Resolved: 0</span> ·
            <span id="sdh-count-open">Opened: 0</span> ·
            <span id="sdh-count-fail">Failed: 0</span>
          </div>`;
        host.appendChild(bar);
      }
      return bar;
    }
    function updateCounters() {
      const t = document.getElementById('sdh-count-total');
      const r = document.getElementById('sdh-count-res');
      const o = document.getElementById('sdh-count-open');
      const f = document.getElementById('sdh-count-fail');
      if (t) t.textContent = `Total: ${Stats.total}`;
      if (r) r.textContent = `Resolved: ${Stats.resolved}`;
      if (o) o.textContent = `Opened: ${Stats.opened}`;
      if (f) f.textContent = `Failed: ${Stats.failed}`;
    }

    function styleBtn(btn, bg = '#28a745') {
      Object.assign(btn.style, {
        display:'inline-block', padding:'6px 10px', margin:'0 6px 6px 0',
        border:'0', borderRadius:'6px', cursor:'pointer', fontWeight:'600',
        fontSize:'12px', boxShadow:'0 1px 2px rgba(0,0,0,.12)', background:bg, color:'#fff'
      });
    }
    function insertButtons() {
      const bar = ensureToolbar();
      if (!bar) return;
      const panel = bar.querySelector('#sdh-buttons');

      if (!document.getElementById('sdh-inline-btn')) {
        const btn = document.createElement('button');
        btn.id = 'sdh-inline-btn';
        btn.textContent = `Resolve Direct Links (up to ${MAX_TRACKS}, ${RESOLVE_POOL}×)`;
        styleBtn(btn);
        btn.addEventListener('click', () => resolveAllParallel().catch(alertStop));
        panel.appendChild(btn);
      }
      if (!document.getElementById('sdh-bulk-btn')) {
        const bulk = document.createElement('button');
        bulk.id = 'sdh-bulk-btn';
        bulk.textContent = 'Download Resolved';
        styleBtn(bulk, '#157347');
        bulk.addEventListener('click', () => bulkOpenResolved().catch(alertStop));
        panel.appendChild(bulk);
      }
    }
    function alertStop(e){ console.warn('[SpotiDown Helper] stopped:', e); alert(`Stopped: ${e.message}`); }

    // ---------- Badges + Retry ----------
    function rowRootFromForm(form) {
      return form.closest('.grid-container') || form.closest('.spotidown') || form.parentElement;
    }
    function ensureBadgeRow(rowRoot) {
      if (!rowRoot) return null;
      let wrap = rowRoot.querySelector('.sdh-badge-wrap');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'sdh-badge-wrap';
        Object.assign(wrap.style, { marginTop:'6px' });
        rowRoot.appendChild(wrap);
      }
      return wrap;
    }
    function setBadge(rowRoot, text, state, retryFn) {
      const wrap = ensureBadgeRow(rowRoot);
      if (!wrap) return;
      wrap.innerHTML = '';
      const badge = document.createElement('span');
      badge.textContent = text;
      Object.assign(badge.style, {
        display:'inline-flex', alignItems:'center', gap:'6px',
        fontSize:'12px', fontWeight:'600', padding:'4px 8px',
        borderRadius:'999px', color:'#fff', marginRight:'6px'
      });
      const colors = { pending:'#6c757d', working:'#0d6efd', resolved:'#198754', opened:'#20c997', failed:'#dc3545' };
      badge.style.background = colors[state] || '#6c757d';
      wrap.appendChild(badge);
      if (retryFn && state === 'failed') {
        const retry = document.createElement('button');
        retry.textContent = 'Retry';
        styleBtn(retry, '#ffc107');
        retry.style.fontSize = '11px';
        retry.addEventListener('click', retryFn);
        wrap.appendChild(retry);
      }
    }

    // ---------- Helpers ----------
    function getTrackForms() { return Array.from(document.getElementsByName('submitspurl')); }
    function getDesiredFilenameFromForm(form) {
      try {
        const encoded = form.querySelector('input[name="data"]')?.value || '';
        const obj = JSON.parse(atob(encoded));
        const name = (obj.name || 'Track').trim();
        const artist = (obj.artist || '').replace(/\//g, '-').trim();
        const nice = artist ? `${name} - ${artist}.mp3` : `${name}.mp3`;
        return nice.replace(/^SpotiDown\.App\s*-\s*/i, '');
      } catch { return 'track.mp3'; }
    }
    async function postFormToTrack(form) {
      const fd = new FormData(form);
      const resp = await fetch('/action/track', { method:'POST', body: fd, credentials:'same-origin' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      if (json.error) throw new Error(json.message || 'Server error');
      return json.data;
    }
    function extractDirectLink(html) {
      const dp = new DOMParser();
      const doc = dp.parseFromString(html, 'text/html');
      let a = doc.querySelector('a#popup[href]');
      if (!a) {
        a = Array.from(doc.querySelectorAll('a[href]')).find(x => {
          const href = (x.getAttribute('href')||'').toLowerCase();
          const t = (x.textContent||'').toLowerCase();
          return href.includes('rapid.spotidown.app') || t.includes('download mp3') || /\.mp3(\?|$)/.test(href);
        });
      }
      return a ? a.getAttribute('href') : null;
    }
    function replaceButtonWithLink(form, href) {
      if (!href) return null;
      const btn = form.querySelector('button.abutton') || form.querySelector('.abutton');
      const a = document.createElement('a');
      a.className = 'abutton is-success is-fullwidth';
      a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.innerHTML = '<span><span>Download Mp3 (Direct)</span></span>';
      a.setAttribute('download', getDesiredFilenameFromForm(form));
      if (btn && btn.parentElement) btn.parentElement.replaceChild(a, btn);
      else form.appendChild(a);
      return a;
    }
    function openOne(href) {
      if (!href) return false;
      if (OPEN_MODE==='tab') window.open(href,'_blank','noopener');
      else if (OPEN_MODE==='iframe'){const f=document.createElement('iframe');f.style.display='none';f.src=href;document.body.appendChild(f);setTimeout(()=>f.remove(),15000);}
      else window.location.href=href;
      return true;
    }

    // ---------- Retries ----------
    function decFailed() { Stats.failed = Math.max(0, Stats.failed - 1); }
    function incResolved() { Stats.resolved++; }
    function incOpened() { Stats.opened++; }

    async function resolveOne(form, row, isRetry=false) {
      setBadge(row, 'Resolving…', 'working');
      try {
        const html = await postFormToTrack(form);
        const href = extractDirectLink(html);
        if (!href) throw new Error('No direct link');
        replaceButtonWithLink(form, href);
        setBadge(row, 'Resolved', 'resolved');
        if (isRetry) { decFailed(); incResolved(); } else incResolved();
        updateCounters();
      } catch(e) {
        if (!isRetry) { Stats.failed++; updateCounters(); }
        setBadge(row, 'Failed', 'failed', () => resolveOne(form, row, true));
      }
    }

    async function retryOpen(row, href) {
      setBadge(row, 'Opening…', 'working');
      try {
        openOne(href);
        decFailed(); incOpened(); updateCounters();
        setBadge(row, 'Opened', 'opened');
      } catch (e) {
        setBadge(row, 'Open failed', 'failed', () => retryOpen(row, href));
      }
    }

    async function resolveAllParallel() {
      const forms = getTrackForms().slice(0, MAX_TRACKS);
      Stats.total = forms.length; updateCounters();
      let index=0;
      async function worker(){
        while(index<forms.length){
          const i=index++; const form=forms[i]; const row=rowRootFromForm(form);
          await resolveOne(form,row); await pace();
        }
      }
      await Promise.all(Array.from({length:RESOLVE_POOL}, worker));
    }

    async function bulkOpenResolved() {
      const forms = getTrackForms().slice(0, MAX_TRACKS);
      for (const f of forms) {
        const row = rowRootFromForm(f);
        const a = f.parentElement?.querySelector('a.abutton[href*="rapid.spotidown.app"]');
        if (!a) continue;
        try {
          setBadge(row,'Opening…','working');
          openOne(a.href);
          incOpened(); updateCounters();
          setBadge(row,'Opened','opened');
        } catch(e) {
          Stats.failed++; updateCounters();
          setBadge(row,'Open failed','failed', () => retryOpen(row, a.href));
        }
        await wait(OPEN_DELAY_MS);
      }
    }

    function watchSection() {
      if (state.anchorObserver) state.anchorObserver.disconnect();
      state.anchorObserver = new MutationObserver(() => { ensureToolbar(); insertButtons(); });
      state.anchorObserver.observe(document.body, { childList:true, subtree:true });

      const sec = document.getElementById('download-section');
      if (state.sectionObserver) state.sectionObserver.disconnect();
      if (sec) {
        state.sectionObserver = new MutationObserver(muts => {
          if (muts.some(m => m.type === 'childList')) { ensureToolbar(); insertButtons(); }
        });
        state.sectionObserver.observe(sec, { childList:true, subtree:false });
      }
    }
    function startSelfHeal() {
      if (state.healTimer) clearInterval(state.healTimer);
      state.healTimer = setInterval(() => {
        if (!document.getElementById('sdh-toolbar')) ensureToolbar();
        insertButtons();
      }, 1500);
    }

    // Auto-flow if query params present
    async function maybeAutoFromParams() {
      const q = new URLSearchParams(location.search);
      const given = q.get('sdh_url');
      if (!given) return;
      // Fill and submit the site's form
      const input = document.getElementById('url') || document.querySelector('input[name="url"]');
      const send  = document.getElementById('send') || Array.from(document.querySelectorAll('button')).find(b => /download/i.test(b.textContent||''));
      if (input && send) {
        input.value = given;
        input.dispatchEvent(new Event('input', { bubbles:true }));
        input.dispatchEvent(new Event('change', { bubbles:true }));
        send.click();
      }
      // After results load, optionally auto resolve/open
      const auto = q.get('sdh_auto') === '1';
      const open = q.get('sdh_open') === '1';
      if (auto || open) {
        // poll for track forms then run
        const t0 = Date.now();
        const poll = setInterval(async () => {
          const forms = getTrackForms();
          if (forms.length || Date.now() - t0 > 20000) {
            clearInterval(poll);
            if (auto) await resolveAllParallel();
            if (open) await bulkOpenResolved();
          }
        }, 800);
      }
    }

    function bootstrap(){
      ensureToolbar(); insertButtons(); updateCounters();
      watchSection(); startSelfHeal();
      maybeAutoFromParams();
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded', bootstrap);} else bootstrap();
    window.addEventListener('hashchange', bootstrap);
    window.addEventListener('popstate', bootstrap);
  }

  // Entrypoints
  if (isSpotify()) {
    scanSpotify();
  } else if (isSpotiDown()) {
    spotiDownHelper();
  }
})();
// ==UserScript==
// @name         SpotiDown Helper
// @namespace    sharmanhall.spotidown.helper
// @version      1.7.0
// @description  Resolve per-track links in parallel, show counters, bulk-open resolved links; clean filenames; retry support; persistent UI across content reloads.
// @match        https://spotidown.app/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotidown.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551394/SpotiDown%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551394/SpotiDown%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- SETTINGS ----------
  const MAX_TRACKS      = 100;        // upper bound to process on the page
  const RESOLVE_POOL    = 3;          // concurrent resolves
  const PACE_MS         = [100, 300]; // delay between resolves
  const OPEN_DELAY_MS   = 500;        // delay between opening resolved links
  const OPEN_MODE       = 'iframe';   // 'tab' | 'iframe' | 'navigate'
  // -------------------------------

  const Stats = { total: 0, resolved: 0, opened: 0, failed: 0 };

  const state = {
    sectionObserver: null,
    anchorObserver: null,
    healTimer: null,
  };

  function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }
  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  const pace = () => wait(randInt(PACE_MS[0], PACE_MS[1]));

  // ---------- STABLE MOUNT POINT ----------
  function getToolbarAnchor() {
    const sec = document.getElementById('download-section');
    const parent = sec?.parentElement || document.querySelector('main .container') || document.querySelector('main') || document.body;
    if (!parent) return null;

    let anchor = document.getElementById('sdh-toolbar-anchor');
    if (!anchor) {
      anchor = document.createElement('div');
      anchor.id = 'sdh-toolbar-anchor';
      // Insert the anchor **before** the section so it survives section replacements
      if (sec && sec.parentElement === parent) {
        parent.insertBefore(anchor, sec);
      } else {
        parent.prepend(anchor);
      }
    }
    return anchor;
  }

  // ---------- TOOLBAR ----------
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
        </div>
      `;
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

  // ---------- BUTTONS ----------
  function styleBtn(btn, bg = '#28a745') {
    Object.assign(btn.style, {
      display:'inline-block', padding:'6px 10px', margin:'0 6px 6px 0',
      border:'0', borderRadius:'6px', cursor:'pointer', fontWeight:'600',
      fontSize:'12px',
      boxShadow:'0 1px 2px rgba(0,0,0,.12)', background:bg, color:'#fff'
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

  // ---------- PER-ROW BADGES + RETRY ----------
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
    const colors = {
      pending:  '#6c757d',
      working:  '#0d6efd',
      resolved: '#198754',
      opened:   '#20c997',
      failed:   '#dc3545'
    };
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

  // ---------- HELPERS ----------
  function getTrackForms() {
    return Array.from(document.getElementsByName('submitspurl'));
  }
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
    const resp = await fetch('/action/track', { method:'POST', body: fd, credentials: 'same-origin' });
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

  // ---------- RETRIES ----------
  function decFailed() { Stats.failed = Math.max(0, Stats.failed - 1); }
  function incResolved() { Stats.resolved++; }
  function incOpened() { Stats.opened++; }

  // Resolve retryable
  async function resolveOne(form, row, isRetry=false) {
    setBadge(row, 'Resolving…', 'working');
    try {
      const html = await postFormToTrack(form);
      const href = extractDirectLink(html);
      if (!href) throw new Error('No direct link');
      replaceButtonWithLink(form, href);
      setBadge(row, 'Resolved', 'resolved');
      if (isRetry) { decFailed(); incResolved(); }
      else incResolved();
      updateCounters();
    } catch(e) {
      if (!isRetry) { Stats.failed++; updateCounters(); }
      setBadge(row, 'Failed', 'failed', () => resolveOne(form, row, true));
    }
  }

  // Open retryable
  async function retryOpen(row, href) {
    setBadge(row, 'Opening…', 'working');
    try {
      openOne(href);
      decFailed();
      incOpened();
      updateCounters();
      setBadge(row, 'Opened', 'opened');
    } catch (e) {
      setBadge(row, 'Open failed', 'failed', () => retryOpen(row, href));
    }
  }

  // ---------- PARALLEL RESOLVER ----------
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

  // ---------- BULK OPEN ----------
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

  // ---------- OBSERVERS / SELF-HEAL ----------
  function watchSection() {
    // Observe body for download-section being added/removed
    if (state.anchorObserver) state.anchorObserver.disconnect();
    state.anchorObserver = new MutationObserver(() => {
      // Recreate toolbar/buttons whenever the section appears/disappears
      ensureToolbar();
      insertButtons();
    });
    state.anchorObserver.observe(document.body, { childList:true, subtree:true });

    // Observe #download-section for innerHTML swaps
    const sec = document.getElementById('download-section');
    if (state.sectionObserver) state.sectionObserver.disconnect();
    if (sec) {
      state.sectionObserver = new MutationObserver(muts => {
        if (muts.some(m => m.type === 'childList')) {
          // After the site swaps content, re-add toolbar/buttons
          ensureToolbar();
          insertButtons();
        }
      });
      state.sectionObserver.observe(sec, { childList:true, subtree:false });
    }
  }

  function startSelfHeal() {
    if (state.healTimer) clearInterval(state.healTimer);
    state.healTimer = setInterval(() => {
      // If toolbar vanished or buttons missing, restore
      if (!document.getElementById('sdh-toolbar')) ensureToolbar();
      insertButtons();
    }, 1500);
  }

  // ---------- BOOTSTRAP ----------
  function bootstrap(){
    ensureToolbar();
    insertButtons();
    updateCounters();
    watchSection();
    startSelfHeal();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
  window.addEventListener('hashchange', bootstrap);
  window.addEventListener('popstate', bootstrap);
})();
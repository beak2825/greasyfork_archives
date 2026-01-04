// ==UserScript==
// @name         TheTVDB Shortcut & Overlay toolkit
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  Adds various floating buttons to make life easier when adding Shows and Movies to TVDB, Also includes a 'One Fill/Click' Series & Movie Creator along with the ability to add 25 episodes in just a couple of clicks.
// @author       GiGo
// @license      MIT
// @match        https://*.thetvdb.com/series/*/seasons/*
// @match        https://thetvdb.com/series/*/seasons/*
// @match        https://*.thetvdb.com/movies/create*
// @match        https://thetvdb.com/movies/create*
// @match        https://*.thetvdb.com/series/create*
// @match        https://thetvdb.com/series/create*
// @match        https://*.thetvdb.com/movies/*/edit*
// @match        https://thetvdb.com/movies/*/edit*
// @match        https://*.thetvdb.com/series/*/edit*
// @match        https://thetvdb.com/series/*/edit*
// @match        https://thetvdb.com/search*
// @match        https://www.thetvdb.com/search*
// @match        https://thetvdb.com/movies/*
// @match        https://www.thetvdb.com/movies/*
// @match        https://thetvdb.com/series/*
// @match        https://www.thetvdb.com/series/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552025/TheTVDB%20Shortcut%20%20Overlay%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/552025/TheTVDB%20Shortcut%20%20Overlay%20toolkit.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ------------------------------
  // SETTINGS
  // ------------------------------
  // Change this if you prefer a different default country label
  const PREFERRED_COUNTRY = 'Great Britain';
  const PREFERRED_VALUE = 'gbr';

  // --- THE DATA BELOW HERE IS EDITABLE, USE THE SCRAPERS I HAVE MADE TO COPY TO THE CLIPBAORD AND PASTE IT BELOW ----
  // --- EDITABLE DATA: up to 25 episodes ---
  const episodes = [
  { name: "Pilot", overview: "Diagnosed with lung cancer, high-school chemistry teacher Walter White teams with ex-student Jesse to cook meth in an RV, using science -- and sudden violence -- to secure their first batch and escape two lethal dealers.", firstAired: "28/09/08", runtime: "" },
  { name: "Cat's in the Bag...", overview: "One body dissolves in acid while another dealer lies captive. Walt and Jesse scramble to erase evidence, and Walt faces whether he can kill to keep the fledgling operation -- and Jesse -- safe.", firstAired: "05/10/08", runtime: "" },
  { name: "...And the Bag's in the River", overview: "Chemo looming, Walt chains wounded Krazy-8 in Jesse's basement, weighing murder against morality. A smashed dinner plate decides his darkest step yet.", firstAired: "12/10/08", runtime: "" },
  { name: "Cancer Man", overview: "Walt's diagnosis rocks the family while flashbacks reveal how Gray Matter upended his career. Resentment nudges him further into crime as Hank's DEA war stories fascinate Walt Jr.", firstAired: "19/10/08", runtime: "" },
  { name: "Gray Matter", overview: "Ex-partners Elliott and Gretchen offer to fund treatment, but pride makes Walt refuse. Cash-strapped, he reignites the meth venture while Skyler digs into Jesse's drug past.", firstAired: "26/10/08", runtime: "" },
  { name: "Crazy Handful of Nothin'", overview: "Shaved and reborn as Heisenberg, Walt crashes Tuco's lair with explosive mercury fulminate, swapping chemistry for intimidation. The violent payoff bankrolls chemo but draws Hank's attention.", firstAired: "02/11/08", runtime: "" },
  { name: "A No-Rough-Stuff-Type Deal", overview: "Under pressure from a dangerous new customer, Walt and Jesse race to expand their operation, hatching an audacious plan for crucial supplies as Walt struggles to keep his double life from collapsing.", firstAired: "09/11/08", runtime: "" }
  ];
  // --- END EDITABLE DATA ---

  // --- THE DATA ABOVE HERE IS EDITABLE, USE THE SCRAPERS I HAVE MADE TO COPY TO THE CLIPBAORD AND PASTE IT ABOVE ----

  // Helper: wait for an element using a selector
  function waitFor(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - t0 > timeout) return reject(new Error('Timed out waiting for ' + selector));
        requestAnimationFrame(check);
      })();
    });
  }

  // Precise episode-row helper: only count multirow-item elements that contain episode fields
  function getEpisodeRows() {
    return Array.from(document.querySelectorAll('.multirow-item'))
      .filter(r => r.querySelector('input[name="name[]"], textarea[name="overview[]"], input[name="date[]"], input[name="runtime[]"]'));
  }

  // wait until number of episode rows >= target or timeout
  function waitForRowCount(targetCount, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const rows = getEpisodeRows();
        if (rows.length >= targetCount) return resolve(rows);
        if (Date.now() - t0 > timeout) return reject(new Error('Timed out waiting for rows: ' + targetCount));
        requestAnimationFrame(check);
      })();
    });
  }

  // Robust ensureRows: retries until desiredTotal episode rows exist (cap 25), dismisses limit modal, retries final clicks
  async function ensureRows(desiredTotal) {
    const MAX_TOTAL = 25;
    const targetDesired = Math.min(Math.max(Number(desiredTotal) || 0, 0), MAX_TOTAL);
    if (targetDesired <= 0) return;

    const getExistingCount = () => getEpisodeRows().length;

    const addSelectors = [
      'button.btn.btn-info.multirow-add',
      'button.multirow-add',
      '.multirow-add',
      'button[type="button"].btn.btn-info',
      'button.btn-info',
      'button'
    ];

    function findByText(text) {
      const candidates = Array.from(document.querySelectorAll('button, a'));
      return candidates.find(el => (el.textContent || '').trim().toLowerCase() === text.toLowerCase()) || null;
    }

    function findAddButton() {
      for (const sel of addSelectors) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) return el;
      }
      const byText = findByText('Add Another') || findByText('Add another') || findByText('Add episode') || findByText('Add');
      if (byText && byText.offsetParent !== null) return byText;
      return null;
    }

    // Try to dismiss limit modal (best-effort)
    function dismissLimitModal() {
      const modalSelectors = ['dialog', '.modal', '.tvdb-modal', '.ui-dialog', '.modal-dialog', '.alert'];
      for (const sel of modalSelectors) {
        const nodes = Array.from(document.querySelectorAll(sel));
        for (const n of nodes) {
          if (!n.offsetParent) continue;
          const txt = (n.textContent || '').replace(/\s+/g, ' ').trim();
          if (/limit reached/i.test(txt) || /unable to add another/i.test(txt)) {
            const ok = Array.from(n.querySelectorAll('button, a')).find(b => /ok|close|dismiss|cancel/i.test((b.textContent||'')));
            if (ok) { try { ok.click(); } catch(e){ ok.dispatchEvent(new MouseEvent('click',{ bubbles:true, cancelable:true })); } }
            else {
              const docOk = Array.from(document.querySelectorAll('button, a')).find(b => /ok|close|dismiss/i.test((b.textContent||'')));
              if (docOk) { try { docOk.click(); } catch(e){ docOk.dispatchEvent(new MouseEvent('click',{ bubbles:true, cancelable:true })); } }
            }
            console.info('ensureRows: dismissed limit modal');
            return true;
          }
        }
      }
      return false;
    }

    // click helper
    async function tryClickAdd(btn) {
      if (!btn) return false;
      try { btn.click(); } catch (e) { btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
      await new Promise(r => setTimeout(r, 220)); // wait for DOM update/modal
      if (dismissLimitModal()) {
        await new Promise(r => setTimeout(r, 260));
        return false; // modal blocked this add
      }
      return true;
    }

    const start = Date.now();
    const TIMEOUT = 15000;
    const MAX_ATTEMPTS = 40;
    let attempts = 0;

    // keep trying until we reach desired rows, timeout, or attempts exhausted
    while (getExistingCount() < targetDesired && (Date.now() - start) < TIMEOUT && attempts < MAX_ATTEMPTS) {
      attempts++;
      const addBtn = findAddButton();
      if (!addBtn) {
        await new Promise(r => setTimeout(r, 180));
        continue;
      }
      await tryClickAdd(addBtn);
      await new Promise(r => setTimeout(r, 120));
    }

    // final verification: if still short, do a final sweep of clicking any visible add buttons a few times
    let finalAttempts = 0;
    while (getExistingCount() < targetDesired && finalAttempts < 6) {
      finalAttempts++;
      const addBtn = findAddButton();
      if (!addBtn) break;
      await tryClickAdd(addBtn);
      await new Promise(r => setTimeout(r, 220));
    }

    const finalCount = getExistingCount();
    if (finalCount < targetDesired) {
      console.warn(`ensureRows: final rows ${finalCount} < requested ${targetDesired}. TheTVDB may have blocked creation or reached account limit.`);
    } else {
      console.info(`ensureRows: created rows: ${finalCount}`);
    }

    await new Promise(r => setTimeout(r, 120));
  }

  // ------------------------------
  // Bulk-add: Insert Fill button
  // ------------------------------
  async function insertFillButton() {
    try {
      // Only show on bulk-add-like pages (series seasons bulk add URLs tend to include "seasons" path)
      if (!location.href.includes('bulkadd') && !/\/seasons\//.test(location.pathname)) return;

      const header = await waitFor('.container, .content, form, .bulk-add-header, #content', 8000).catch(() => null);
      if (!header) {
        console.warn('Fill button: insertion point not found, aborting.');
        return;
      }
      if (document.getElementById('tm-fill-episodes-btn')) return;

      const btn = document.createElement('button');
      btn.id = 'tm-fill-episodes-btn';
      btn.type = 'button';
      btn.textContent = 'Fill episodes';
      Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '2147483000',
        padding: '10px 16px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600'
      });

      btn.addEventListener('click', async () => {
        if (!confirm('Fill up to 25 visible rows with prepared episode data? This will not submit the form.')) return;
        try {
          await ensureRows(episodes.length);
          fillRows();
        } catch (err) {
          console.error(err);
          alert('Error filling rows: ' + err.message);
        }
      });

      document.body.appendChild(btn);
    } catch (err) {
      console.error('Insert Fill button error:', err);
    }
  }

  // Fill function (do not set number input; robust date normalisation to YYYY-MM-DD)
  function fillRows() {
    const rows = getEpisodeRows().slice(0, 25);
    if (!rows.length) {
      alert('No episode rows found. Make sure you are on the TheTVDB bulk-add page and episode rows are visible.');
      return;
    }

    const limit = Math.min(rows.length, episodes.length, 25);

    // helper: try to parse many human dates and return YYYY-MM-DD or '' if unknown
    function toIsoDate(s) {
      if (!s) return '';
      s = String(s).trim();

      const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

      let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
      if (m) {
        let d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
        if (y < 100) { y = (y >= 70 ? 1900 + y : 2000 + y); }
        if (d && mo && y) {
          return `${String(y).padStart(4,'0')}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        }
      }

      m = s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})/);
      if (m) {
        const monthNames = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };
        const d = Number(m[1]);
        const mo = monthNames[m[2].toLowerCase().slice(0,3)];
        let y = Number(m[3]);
        if (y < 100) y = (y >= 70 ? 1900 + y : 2000 + y);
        if (d && mo && y) return `${String(y).padStart(4,'0')}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      }

      m = s.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{2,4})/);
      if (m) {
        const monthNames = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };
        const mo = monthNames[m[1].toLowerCase().slice(0,3)];
        const d = Number(m[2]);
        let y = Number(m[3]);
        if (y < 100) y = (y >= 70 ? 1900 + y : 2000 + y);
        if (d && mo && y) return `${String(y).padStart(4,'0')}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      }

      const parsed = new Date(s);
      if (!Number.isNaN(parsed.getTime())) {
        const dd = String(parsed.getDate()).padStart(2,'0');
        const mm = String(parsed.getMonth() + 1).padStart(2,'0');
        const yy = String(parsed.getFullYear()).padStart(4,'0');
        return `${yy}-${mm}-${dd}`;
      }

      console.warn('toIsoDate: unable to parse date string:', s);
      return '';
    }

    for (let i = 0; i < limit; i++) {
      const row = rows[i];
      const ep = episodes[i];

      // NOTE: intentionally NOT setting the episode number input (TVDB generates it)

      // Name
      const nameInput = row.querySelector('input[name="name[]"]');
      if (nameInput) {
        nameInput.value = ep.name;
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Overview
      const overviewInput = row.querySelector('textarea[name="overview[]"]');
      if (overviewInput) {
        overviewInput.value = ep.overview;
        overviewInput.dispatchEvent(new Event('input', { bubbles: true }));
        overviewInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Date (convert to YYYY-MM-DD for type="date" inputs)
      const dateInput = row.querySelector('input[type="date"][name="date[]"]') || row.querySelector('input[name="date[]"]');
      if (dateInput) {
        const iso = toIsoDate(ep.firstAired);
        if (dateInput.type === 'date') {
          dateInput.value = iso;
        } else {
          dateInput.value = iso || (ep.firstAired || '');
        }
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Runtime
      const runtimeInput = row.querySelector('input[name="runtime[]"]') || row.querySelectorAll('input[type="text"], input[type="number"]')[1] || null;
      if (runtimeInput) {
        runtimeInput.value = ep.runtime;
        runtimeInput.dispatchEvent(new Event('input', { bubbles: true }));
        runtimeInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    alert(`Filled ${limit} row(s). Review values and submit the form manually when ready.`);
  }

  // ------------------------------
  // Create pages: robust body-anchored overview guard
  // ------------------------------
  function startOverviewGuard() {
    const OVERVIEW_SELECTOR = 'textarea#overview, textarea[name="overview"]';
    let currentTA = null;
    let overlayRoot = null;
    let resizeObs = null;

    function createOverlay() {
      if (overlayRoot) return overlayRoot;
      const root = document.createElement('div');
      root.className = 'tm-overview-overlay-root';
      Object.assign(root.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 2147483000,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        transition: 'top 0.08s, left 0.08s'
      });

      const badge = document.createElement('div');
      badge.className = 'tm-overview-badge-root';
      Object.assign(badge.style, {
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        display: 'inline-flex',
        gap: '10px',
        alignItems: 'center',
        pointerEvents: 'none'
      });

      const count = document.createElement('span');
      count.className = 'tm-overview-count';
      count.textContent = '0';
      count.style.minWidth = '36px';
      count.style.textAlign = 'right';

      const status = document.createElement('span');
      status.className = 'tm-overview-status';
      status.textContent = 'OK';
      Object.assign(status.style, {
        background: 'green',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '700'
      });

      badge.appendChild(count);
      badge.appendChild(status);
      root.appendChild(badge);
      document.body.appendChild(root);
      overlayRoot = { root, count, status };
      return overlayRoot;
    }

    function attachTo(textarea) {
      if (!textarea) return;
      if (currentTA === textarea) return;
      detach();

      currentTA = textarea;
      const overlay = createOverlay();

      function update() {
        if (!currentTA) return;
        const len = currentTA.value.length;
        overlay.count.textContent = String(len);
        if (len > 500) {
          overlay.status.textContent = 'OVER 500';
          overlay.status.style.background = '#c62828';
          overlay.root.firstChild.style.background = 'rgba(198,40,40,0.9)';
        } else {
          overlay.status.textContent = 'OK';
          overlay.status.style.background = 'green';
          overlay.root.firstChild.style.background = 'rgba(0,0,0,0.75)';
        }
        const rect = currentTA.getBoundingClientRect();
        const top = Math.max(8, rect.top + window.scrollY - 6);
        const left = Math.min(window.innerWidth - 10 - overlay.root.offsetWidth, rect.right + 8 + window.scrollX);
        overlay.root.style.top = top + 'px';
        overlay.root.style.left = left + 'px';
      }

      const inputHandler = update;
      currentTA.addEventListener('input', inputHandler);
      currentTA.addEventListener('change', inputHandler);

      resizeObs = new ResizeObserver(update);
      resizeObs.observe(currentTA);

      const scrollHandler = () => update();
      window.addEventListener('scroll', scrollHandler, true);
      window.addEventListener('resize', update);

      setTimeout(update, 0);

      currentTA._tmOverviewCleanup = () => {
        currentTA.removeEventListener('input', inputHandler);
        currentTA.removeEventListener('change', inputHandler);
        window.removeEventListener('scroll', scrollHandler, true);
        window.removeEventListener('resize', update);
        if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
        currentTA = null;
      };
    }

    function detach() {
      if (currentTA && currentTA._tmOverviewCleanup) {
        try { currentTA._tmOverviewCleanup(); } catch (e) { /*ignore*/ }
        currentTA._tmOverviewCleanup = null;
      }
    }

    function scanAndAttach() {
      const ta = document.querySelector(OVERVIEW_SELECTOR);
      if (ta) {
        attachTo(ta);
      } else {
        detach();
      }
    }

    scanAndAttach();
    const mo = new MutationObserver(scanAndAttach);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('beforeunload', () => {
      try { mo.disconnect(); } catch(e) {}
      try { detach(); } catch(e) {}
    });
  }

  // Init core filler + guard
  (function initCore() {
    insertFillButton();
    const observer = new MutationObserver(() => insertFillButton());
    observer.observe(document.body, { childList: true, subtree: true });

    if (/\/movies\/create|\/series\/create/.test(location.pathname + location.search)) {
      setTimeout(startOverviewGuard, 250);
    }
  })();

  // ------------------------------
  // Separate module appended: IMDb injector (clipboard + manual paste + toast)
  // Namespaced to avoid collisions with core functions
  // ------------------------------
  (function imdbInjectorModule() {
    // Unique helpers prefixed with imdb_
    async function imdb_readClipboardText() {
      try {
        return await navigator.clipboard.readText();
      } catch (e) {
        console.warn('imdb: Clipboard read failed', e);
        return '';
      }
    }

    function imdb_findIMDbIdInText(text) {
      if (!text) return null;
      const m = text.match(/tt\d{7,8}/);
      return m ? m[0] : null;
    }

    function imdb_showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.textContent = message;
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: type === 'error' ? '#dc3545' : '#28a745',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: 2147483001,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      });
      document.body.appendChild(toast);
      setTimeout(() => {
        try { toast.remove(); } catch (e) {}
      }, 3000);
    }

    function imdb_injectIMDbIdIntoInput(imdbId) {
      const input = document.querySelector('input#imdb.remoteid-unique-multiple, input[name^="remoteid"][id="imdb"], input[name="remoteid[2]"], input#imdb');
      if (!input) return false;
      input.value = imdbId;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    async function imdb_attemptAutoInjectIMDb() {
      // Only attempt on create pages where IMDb field exists
      if (!/\/movies\/create|\/series\/create/.test(location.pathname + location.search)) return;

      // 1) Try clipboard first
      const clipboardText = await imdb_readClipboardText();
      const clipId = imdb_findIMDbIdInText(clipboardText);
      if (clipId) {
        const ok = imdb_injectIMDbIdIntoInput(clipId);
        if (ok) { imdb_showToast(`✅ IMDb ID "${clipId}" pasted from clipboard`, 'success'); return; }
      }

      // 2) Fallback: check if the page already has an IMDb hint text somewhere (some pages show sample)
      const pageText = document.body.innerText || '';
      const pageMatch = imdb_findIMDbIdInText(pageText);
      if (pageMatch) {
        const ok = imdb_injectIMDbIdIntoInput(pageMatch);
        if (ok) { imdb_showToast(`✅ IMDb ID "${pageMatch}" found on page and pasted`, 'success'); return; }
      }

      // 3) No ID found - show a small Paste button so user can choose to paste (also triggers clipboard read)
      imdb_insertPasteIMDbButton();
    }

    function imdb_insertPasteIMDbButton() {
      if (document.getElementById('tm-paste-imdb-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'tm-paste-imdb-btn';
      btn.type = 'button';
      btn.textContent = 'Paste IMDb ID';
      Object.assign(btn.style, {
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 2147483000,
        padding: '10px 16px',
        background: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600'
      });

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Pasting...';
        const txt = await imdb_readClipboardText();
        const id = imdb_findIMDbIdInText(txt);
        if (id) {
          const ok = imdb_injectIMDbIdIntoInput(id);
          if (ok) imdb_showToast(`✅ IMDb ID "${id}" pasted from clipboard`, 'success');
          else imdb_showToast('❌ IMDb input field not found.', 'error');
        } else {
          imdb_showToast('❌ No IMDb ID found in clipboard', 'error');
        }
        btn.remove();
      });

      document.body.appendChild(btn);
    }

    // Initialize IMDb module after core init
    setTimeout(() => {
      imdb_attemptAutoInjectIMDb();
      // keep a light observer for dynamic create pages to re-run injection attempt once
      if (/\/movies\/create|\/series\/create/.test(location.pathname + location.search)) {
        const mo = new MutationObserver((mutations) => {
          const added = mutations.some(m => m.addedNodes && m.addedNodes.length);
          if (!added) return;
          imdb_attemptAutoInjectIMDb();
          mo.disconnect();
        });
        mo.observe(document.body, { childList: true, subtree: true });
      }
    }, 400);

  })();

  // ------------------------------
  // Edit Layout Reflow module (move fieldset + move Save) appended at bottom
  // ------------------------------
  (function editLayoutReflowModule() {
    // Utility: wait for selector to appear
    function waitForSelector(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const t0 = Date.now();
        (function check() {
          const el = document.querySelector(selector);
          if (el) return resolve(el);
          if (Date.now() - t0 > timeout) return reject(new Error('Timed out: ' + selector));
          requestAnimationFrame(check);
        })();
      });
    }

    // Heuristic: find the fieldset that contains "Country" and "Release Date"
    function findTargetFieldset() {
      const fsets = Array.from(document.querySelectorAll('fieldset'));
      for (const f of fsets) {
        const text = (f.textContent || '').toLowerCase();
        if (text.includes('country') && text.includes('release date')) return f;
      }
      return null;
    }

    // Move the identified fieldset to after the "required fields" paragraph
    async function moveFieldset() {
      try {
        const para = await waitForSelector('p.small', 8000).catch(() => null);
        if (!para) return console.warn('Reflow: required-fields paragraph not found');

        const fset = findTargetFieldset();
        if (!fset) return console.warn('Reflow: target fieldset not found');

        if (para.nextElementSibling === fset) return; // already moved

        para.parentNode.insertBefore(fset, para.nextSibling);

        fset.style.transition = 'box-shadow 220ms ease, transform 220ms ease';
        fset.style.boxShadow = '0 8px 26px rgba(0,0,0,0.08)';
        fset.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          fset.style.transform = '';
          fset.style.boxShadow = '';
        }, 420);

        console.info('Reflow: fieldset moved after required-fields paragraph');
      } catch (e) {
        console.warn('Reflow: moveFieldset failed', e);
      }
    }

    // Robust Move Save button: locate POST form's Save and insert before Release Dates heading
    async function moveSaveButton() {
      try {
        const form = await waitForSelector('form[method="POST"], form[action][method="POST"]', 10000).catch(() => null);
        if (!form) return console.warn('Reflow: POST form not found');

        const saveBtn = Array.from(form.querySelectorAll('button, input[type="submit"]'))
          .find(el => {
            const txt = ((el.textContent || el.value || '') + '').trim().toLowerCase();
            const hasClass = ((el.className || '') + '').toLowerCase().includes('btn-success');
            return hasClass || txt === 'save' || txt === 'submit';
          });

        if (!saveBtn) return console.warn('Reflow: Save button inside form not found');

        const releaseH3 = Array.from(document.querySelectorAll('h3')).find(h => (h.textContent || '').trim().toLowerCase() === 'release dates');
        if (!releaseH3) return console.warn('Reflow: Release Dates heading not found');

        // Avoid re-inserting if already adjacent
        if (releaseH3.previousElementSibling === saveBtn) return;

        releaseH3.parentNode.insertBefore(saveBtn, releaseH3);

        saveBtn.style.transition = 'transform 180ms ease, box-shadow 180ms ease';
        saveBtn.style.transform = 'translateY(-6px)';
        saveBtn.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
        setTimeout(() => {
          saveBtn.style.transform = '';
          saveBtn.style.boxShadow = '';
        }, 260);

        console.info('Reflow: moved Save button above Release Dates heading');
      } catch (e) {
        console.warn('Reflow: moveSaveButton failed', e);
      }
    }

    // Apply both moves
    function applyReflow() {
      moveFieldset();
      moveSaveButton();
    }

    // Mutation observer to re-run when the page mutates (SPA/dynamic loads)
    function watchAndApplyReflow() {
      applyReflow();

      const mo = new MutationObserver((mutations) => {
        const added = mutations.some(m => m.addedNodes && m.addedNodes.length);
        if (!added) return;
        applyReflow();
      });

      mo.observe(document.body, { childList: true, subtree: true });

      // Stop observing after 2 minutes (page should be stable by then)
      setTimeout(() => {
        try { mo.disconnect(); } catch (e) {}
      }, 120000);
    }

    // Kick off only on edit pages
    if (/\/movies\/.*\/edit|\/series\/.*\/edit/.test(location.pathname + location.search)) {
      setTimeout(watchAndApplyReflow, 300);
    }

  })();

  // ------------------------------
  // Search page: floating Add Series / Add Movie buttons
  // ------------------------------
  (function addSearchFloatingButtons() {
    const ID_SERIES = 'tm-add-series-btn';
    const ID_MOVIE  = 'tm-add-movie-btn';

    function isSearchPage() {
      return /\/search(?:$|[?#])/.test(location.pathname + location.search);
    }

    function createButton(id, text, href, bottomOffset, bg) {
      if (document.getElementById(id)) return null;
      const btn = document.createElement('a');
      btn.id = id;
      btn.href = href;
      btn.textContent = text;
      btn.setAttribute('role','button');
      btn.style.position = 'fixed';
      btn.style.right = '20px';
      btn.style.bottom = `${bottomOffset}px`;
      btn.style.zIndex = '2147483000';
      btn.style.padding = '10px 16px';
      btn.style.background = bg || '#17a2b8';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.borderRadius = '8px';
      btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '14px';
      btn.style.fontWeight = '700';
      btn.style.textDecoration = 'none';
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.gap = '8px';

      // keep default anchor behaviour; the site will handle navigation
      document.body.appendChild(btn);
      return btn;
    }

    function insertButtonsIfNeeded() {
      if (!isSearchPage()) return;
      if (!document.getElementById(ID_SERIES)) createButton(ID_SERIES, 'Add Series', '/series/create', 80, '#007bff');
      if (!document.getElementById(ID_MOVIE))  createButton(ID_MOVIE,  'Add Movie',  '/movies/create', 140, '#28a745');
    }

    // run once then observe for SPA-rendered changes
    insertButtonsIfNeeded();
    const mo = new MutationObserver((mutations) => {
      const added = mutations.some(m => m.addedNodes && m.addedNodes.length);
      if (!added) return;
      insertButtonsIfNeeded();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // cleanup when navigating away (simple guard)
    window.addEventListener('popstate', () => {
      const s = document.getElementById(ID_SERIES);
      const m = document.getElementById(ID_MOVIE);
      if (s) s.remove();
      if (m) m.remove();
      // re-run insertion in a short while in case SPA navigation lands back on search
      setTimeout(insertButtonsIfNeeded, 250);
    });

    // also remove automatically if user leaves the search path after 2 minutes
    setTimeout(() => {
      if (!isSearchPage()) {
        const s = document.getElementById(ID_SERIES);
        const m = document.getElementById(ID_MOVIE);
        if (s) s.remove();
        if (m) m.remove();
      }
    }, 120000);
  })();

  // ------------------------------
  // Copy TVDB ID Floating Button
  // ------------------------------
  (function copyTvdbIdModule() {
    'use strict';

    // Only run if we find the info list on a detail page
    if (!document.querySelector('#series_basic_info, #movie_basic_info')) return;

    // Find the numeric ID from the info list
    function getTvdbId() {
      const infoBlock = document.querySelector('#series_basic_info, #movie_basic_info');
      if (!infoBlock) return null;

      const items = Array.from(infoBlock.querySelectorAll('li.list-group-item'));
      for (const li of items) {
        const label = li.querySelector('strong')?.textContent || '';
        if (/thetvdb\.com\s+(?:movie|series)\s+id/i.test(label)) {
          return li.querySelector('span')?.textContent.trim() || null;
        }
      }
      return null;
    }

    // Show a temporary toast message
    function showToast(message, success = true) {
      const toast = document.createElement('div');
      toast.textContent = message;
      Object.assign(toast.style, {
        position    : 'fixed',
        bottom      : '20px',
        right       : '20px',
        padding     : '10px 16px',
        background  : success ? '#28a745' : '#dc3545',
        color       : '#fff',
        borderRadius: '6px',
        fontSize    : '14px',
        fontWeight  : '600',
        zIndex      : 2147483001,
        boxShadow   : '0 2px 6px rgba(0,0,0,0.3)',
      });                       // ← Note the comma after the last property
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    // Create and insert the floating “Copy ID” button
    function insertCopyButton(tvdbId) {
      if (!tvdbId || document.getElementById('tm-copy-tvdbid-btn')) return;

      const btn = document.createElement('button');
      btn.id          = 'tm-copy-tvdbid-btn';
      btn.type        = 'button';
      btn.textContent = 'Copy TVDB ID';
        Object.assign(btn.style, {
        position    : 'fixed',
        bottom      : '80px',
        right       : '20px',
        zIndex      : '2147483000',
        padding     : '10px 16px',
        background  : '#007bff',
        color       : '#fff',
        border      : 'none',
        borderRadius: '6px',
        boxShadow   : '0 2px 6px rgba(0,0,0,0.3)',
        cursor      : 'pointer',
        fontSize    : '15px',
        fontWeight  : '600',
      });

      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(tvdbId);
          // use back‐ticks here for template literal
          showToast(`Copied ID ${tvdbId}`);
        } catch (err) {
          console.error('Copy TVDB ID failed:', err);
          showToast('Failed to copy ID', false);
        }
      });

      document.body.appendChild(btn);
    }

    // Kick off
    const id = getTvdbId();
    if (id) insertCopyButton(id);
  })();

  // ------------------------------
  // Preferred Country module (value match "gbr" then text fallback)
  // ------------------------------
  (function preferredCountryModule() {
    const DONE_FLAG = 'tm-preferred-country-applied';

    function isCreatePage() {
      return /\/movies\/create|\/series\/create/.test(location.pathname + location.search);
    }

    function findCountrySelect() {
      return document.querySelector('select[name="country"], select.form-control[name="country"], select#country');
    }

    function optionTextMatches(optText, target) {
      if (!optText || !target) return false;
      return optText.toLowerCase().includes(target.toLowerCase());
    }

    function applyPreferredCountry() {
      const sel = findCountrySelect();
      if (!sel) return false;

      // do not override if user already selected something meaningful
      const current = (sel.value || '').trim();
      if (current && current !== '' && !/^(?:select|choose|none|-)$/.test(current.toLowerCase())) {
        return true;
      }

      // 1) prefer an option by exact value (gbr)
      let matched = Array.from(sel.options).find(o => (o.value || '').toLowerCase() === PREFERRED_VALUE.toLowerCase());

      // 2) fallback: match by visible text containing the preferred country label
      if (!matched) {
        matched = Array.from(sel.options).find(o => optionTextMatches(o.textContent || o.innerText || '', PREFERRED_COUNTRY));
      }

      // 3) final fallback: try exact value equal to the label (case-insensitive)
      if (!matched) {
        matched = Array.from(sel.options).find(o => (o.value || '').toLowerCase() === PREFERRED_COUNTRY.toLowerCase());
      }

      if (matched) {
        sel.value = matched.value;
        sel.dispatchEvent(new Event('input', { bubbles: true }));
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        sel.dataset[ DONE_FLAG ] = '1';
        console.info(`PreferredCountry: set "${matched.textContent.trim()}" (${matched.value}) on country select`);
        return true;
      }

      return false;
    }

    function runOnceWhenReady() {
      if (!isCreatePage()) return;
      // attempt immediately
      if (applyPreferredCountry()) return;
      // wait for select to appear
      waitFor('select[name="country"], select.form-control[name="country"], select#country', 8000)
        .then(() => applyPreferredCountry())
        .catch(() => {/* no country select found within timeout */});
      // observe for dynamic injection and try once more on first insertion
      const mo = new MutationObserver((mutations, obs) => {
        const added = mutations.some(m => m.addedNodes && m.addedNodes.length);
        if (!added) return;
        if (applyPreferredCountry()) obs.disconnect();
      });
      mo.observe(document.body, { childList: true, subtree: true });
      // stop observing after 2 minutes
      setTimeout(() => { try { mo.disconnect(); } catch (e) {} }, 120000);
    }

    // Initial run
    setTimeout(runOnceWhenReady, 300);
    // Also run again on SPA navigation
    window.addEventListener('popstate', () => setTimeout(runOnceWhenReady, 250));
  })();


  (function(){
    'use strict';

    // ── Shared Helpers ──
    function makeOverlay() {
      const ov = document.createElement('div');
      ov.textContent = 'One Click adder';
      Object.assign(ov.style, {
        position:    'fixed',
        top:         '60px',
        right:       '20px',
        width:       '300px',
        maxHeight:   '80vh',
        overflowY:   'auto',
        padding:     '12px',
        background:  'rgba(40,167,69,0.9)',
        border:      '1px solid #ccc',
        borderRadius:'6px',
        boxShadow:   '0 2px 8px rgba(0,0,0,0.2)',
        zIndex:      2147483002,
        fontFamily:  'system-ui',
        fontSize:    '14px'
      });
      return ov;
    }

    function addField(form, labelText, el) {
      el.style.backgroundColor = '#013220';
      el.style.color           = '#ccc';
      el.style.border          = '1px solid #666';
      el.style.padding         = '4px 6px';
      el.style.borderRadius    = '4px';
      el.style.marginBottom    = '6px';
      el.style.width           = '100%';

      const wrap = document.createElement('div');
      wrap.style.margin = '8px 0';

      const lbl = document.createElement('label');
      lbl.textContent    = labelText;
      lbl.style.display  = 'block';
      lbl.style.fontWeight = '600';
      lbl.style.marginBottom = '4px';

      wrap.append(lbl, el);
      form.appendChild(wrap);
    }

    // ── Static Data (declare once) ──
    // ───────────────────────────────────────────────
    // STATIC DATA FOR OVERLAY DROPDOWNS & CHECKBOXES
    // ───────────────────────────────────────────────
    const LANGUAGES = [
      { value: "abk",  text: "Abkhaz (аҧсуа бызшәа)" },
      { value: "aar",  text: "Afar (Afaraf)" },
      { value: "afr",  text: "Afrikaans" },
      { value: "aka",  text: "Akan" },
      { value: "sqi",  text: "Albanian (gjuha shqipe)" },
      { value: "amh",  text: "Amharic (አማርኛ)" },
      { value: "ara",  text: "Arabic (العربية)" },
      { value: "arg",  text: "Aragonese (aragonés)" },
      { value: "hye",  text: "Armenian (Հայերեն)" },
      { value: "asm",  text: "Assamese (অসমীয়া)" },
      { value: "ava",  text: "Avaric (авар мацӀ)" },
      { value: "ave",  text: "Avestan (avesta)" },
      { value: "aym",  text: "Aymara (aymar aru)" },
      { value: "aze",  text: "Azerbaijani (azərbaycan dili)" },
      { value: "bam",  text: "Bambara (bamanankan)" },
      { value: "bak",  text: "Bashkir (башҡорт теле)" },
      { value: "eus",  text: "Basque (euskara)" },
      { value: "bel",  text: "Belarusian (беларуская мова)" },
      { value: "ben",  text: "Bengali (বাংলা)" },
      { value: "bih",  text: "Bihari (भोजपुरी)" },
      { value: "bis",  text: "Bislama" },
      { value: "bos",  text: "Bosnian (bosanski jezik)" },
      { value: "bre",  text: "Breton (brezhoneg)" },
      { value: "bul",  text: "Bulgarian (български език)" },
      { value: "mya",  text: "Burmese" },
      { value: "cat",  text: "Catalan (català)" },
      { value: "cha",  text: "Chamorro (Chamoru)" },
      { value: "che",  text: "Chechen (нохчийн мотт)" },
      { value: "nya",  text: "Chewa (chiCheŵa)" },
      { value: "yue",  text: "Chinese – Cantonese (粵語)" },
      { value: "zho",  text: "Chinese – China (大陆简体)" },
      { value: "zhtw", text: "Chinese – Taiwan (臺灣國語)" },
      { value: "chv",  text: "Chuvash (чӑваш чӗлхи)" },
      { value: "cor",  text: "Cornish (Kernewek)" },
      { value: "cos",  text: "Corsican (corsu)" },
      { value: "cre",  text: "Cree (ᓀᐦᐃᔭᐍᐏᐣ)" },
      { value: "hrv",  text: "Croatian (hrvatski jezik)" },
      { value: "ces",  text: "Czech (čeština)" },
      { value: "dan",  text: "Danish (dansk)" },
      { value: "div",  text: "Divehi (ދިވެހި)" },
      { value: "nld",  text: "Dutch (Nederlands)" },
      { value: "dzo",  text: "Dzongkha (རྫོང་ཁ)" },
      { value: "eng",  text: "English" },
      { value: "epo",  text: "Esperanto" },
      { value: "est",  text: "Estonian (eesti)" },
      { value: "ewe",  text: "Ewe (Eʋegbe)" },
      { value: "fao",  text: "Faroese (føroyskt)" },
      { value: "fij",  text: "Fijian (vosa Vakaviti)" },
      { value: "fin",  text: "Finnish (suomi)" },
      { value: "fra",  text: "French (français)" },
      { value: "ful",  text: "Fula (Fulfulde)" },
      { value: "glg",  text: "Galician (galego)" },
      { value: "kat",  text: "Georgian (ქართული)" },
      { value: "deu",  text: "German (Deutsch)" },
      { value: "ell",  text: "Greek (ελληνική γλώσσα)" },
      { value: "grn",  text: "Guaraní (Avañe'ẽ)" },
      { value: "guj",  text: "Gujarati (ગુજરાતી)" },
      { value: "hat",  text: "Haitian (Kreyòl ayisyen)" },
      { value: "hau",  text: "Hausa (هَوُسَ)" },
      { value: "heb",  text: "Hebrew (עברית)" },
      { value: "her",  text: "Herero (Otjiherero)" },
      { value: "hin",  text: "Hindi (हिन्दी)" },
      { value: "hmo",  text: "Hiri Motu" },
      { value: "hun",  text: "Hungarian (Magyar)" },
      { value: "isl",  text: "Icelandic (Íslenska)" },
      { value: "ido",  text: "Ido" },
      { value: "ibo",  text: "Igbo (Asụsụ Igbo)" },
      { value: "ind",  text: "Indonesian (Bahasa Indonesia)" },
      { value: "ina",  text: "Interlingua" },
      { value: "ile",  text: "Interlingue" },
      { value: "iku",  text: "Inuktitut (ᐃᓄᒃᑎᑐᑦ)" },
      { value: "ipk",  text: "Inupiaq (Iñupiaq)" },
      { value: "gle",  text: "Irish (Gaeilge)" },
      { value: "ita",  text: "Italian (italiano)" },
      { value: "jpn",  text: "Japanese (日本語)" },
      { value: "jav",  text: "Javanese (basa Jawa)" },
      { value: "kal",  text: "Kalaallisut (kalaallisut)" },
      { value: "kan",  text: "Kannada (ಕನ್ನಡ)" },
      { value: "kau",  text: "Kanuri" },
      { value: "kas",  text: "Kashmiri (कश्मीरी)" },
      { value: "kaz",  text: "Kazakh (қазақ тілі)" },
      { value: "khm",  text: "Khmer (ខ្មែរ)" },
      { value: "kik",  text: "Kikuyu (Gĩkũyũ)" },
      { value: "kin",  text: "Kinyarwanda (Ikinyarwanda)" },
      { value: "kir",  text: "Kirghiz (кыргыз тили)" },
      { value: "run",  text: "Kirundi (Ikirundi)" },
      { value: "kom",  text: "Komi (коми кыв)" },
      { value: "kon",  text: "Kongo (KiKongo)" },
      { value: "kor",  text: "Korean (한국어)" },
      { value: "kur",  text: "Kurdish (Kurdî)" },
      { value: "kua",  text: "Kwanyama (Kuanyama)" },
      { value: "lao",  text: "Lao (ພາສາລາວ)" },
      { value: "lat",  text: "Latin (latine)" },
      { value: "lav",  text: "Latvian (latviešu valoda)" },
      { value: "lim",  text: "Limburgish (Limburgs)" },
      { value: "lin",  text: "Lingala (Lingála)" },
      { value: "lit",  text: "Lithuanian (lietuvių kalba)" },
      { value: "lub",  text: "Luba-Katanga" },
      { value: "lug",  text: "Luganda" },
      { value: "ltz",  text: "Luxembourgish (Lëtzebuergesch)" },
      { value: "mkd",  text: "Macedonian (македонски јазик)" },
      { value: "mlg",  text: "Malagasy (Malagasy fiteny)" },
      { value: "msa",  text: "Malay (bahasa Melayu)" },
      { value: "mal",  text: "Malayalam (മലയാളം)" },
      { value: "mlt",  text: "Maltese (Malti)" },
      { value: "glv",  text: "Manx (Gaelg)" },
      { value: "mri",  text: "Māori (te reo Māori)" },
      { value: "mar",  text: "Marathi (मराठी)" },
      { value: "mah",  text: "Marshallese (Kajin M̧ajeļ)" },
      { value: "mon",  text: "Mongolian (монгол)" },
      { value: "nau",  text: "Nauru (Ekakairũ Naoero)" },
      { value: "nav",  text: "Navajo (Diné bizaad)" },
      { value: "ndo",  text: "Ndonga (Owambo)" },
      { value: "nep",  text: "Nepali (नेपाली)" },
      { value: "nde",  text: "North Ndebele (isiNdebele)" },
      { value: "sme",  text: "Northern Sami (Davvisámegiella)" },
      { value: "nor",  text: "Norwegian (Norsk bokmål)" },
      { value: "iii",  text: "Nuosu (Nuosuhxop)" },
      { value: "oci",  text: "Occitan (occitan)" },
      { value: "oji",  text: "Ojibwe (ᐊᓂᔑᓈᐯᒧᐎᓐ)" },
      { value: "chu",  text: "Old Church Slavonic (ѩзыкъ словѣньскъ)" },
      { value: "ori",  text: "Oriya (ଓଡ଼ିଆ)" },
      { value: "orm",  text: "Oromo (Afaan Oromo)" },
      { value: "oss",  text: "Ossetian (ирон æвзаг)" },
      { value: "pli",  text: "Pāli (पाऴि)" },
      { value: "pan",  text: "Panjabi (ਪੰਜਾਬੀ)" },
      { value: "pus",  text: "Pashto (پښتو)" },
      { value: "fas",  text: "Persian (فارسی)" },
      { value: "pol",  text: "Polish (język polski)" },
      { value: "pt",   text: "Portuguese – Brazil (Português – Brasil)" },
      { value: "por",  text: "Portuguese – Portugal (Português – Portugal)" },
      { value: "que",  text: "Quechua (Runa Simi)" },
      { value: "ron",  text: "Romanian (limba română)" },
      { value: "roh",  text: "Romansh (rumantsch grischun)" },
      { value: "rus",  text: "Russian (русский язык)" },
      { value: "smo",  text: "Samoan (gagana fa'a Samoa)" },
      { value: "sag",  text: "Sango (yângâ tî sängö)" },
      { value: "san",  text: "Sanskrit (संस्कृतम्)" },
      { value: "srd",  text: "Sardinian (sardu)" },
      { value: "gla",  text: "Scottish Gaelic (Gàidhlig)" },
      { value: "srp",  text: "Serbian (српски језик)" },
      { value: "sna",  text: "Shona (chiShona)" },
      { value: "snd",  text: "Sindhi (सिन्धी)" },
      { value: "sin",  text: "Sinhala (සිංහල)" },
      { value: "slk",  text: "Slovak (slovenčina)" },
      { value: "slv",  text: "Slovene (slovenski jezik)" },
      { value: "som",  text: "Somali (Soomaaliga)" },
      { value: "nbl",  text: "South Ndebele (isiNdebele)" },
      { value: "sot",  text: "Southern Sotho (Sesotho)" },
      { value: "spa",  text: "Spanish (español)" },
      { value: "sun",  text: "Sundanese (Basa Sunda)" },
      { value: "swa",  text: "Swahili (Kiswahili)" },
      { value: "ssw",  text: "Swati (SiSwati)" },
      { value: "swe",  text: "Swedish (svenska)" },
      { value: "tgl",  text: "Tagalog (Wikang Tagalog)" },
      { value: "tah",  text: "Tahitian (Reo Tahiti)" },
      { value: "tgk",  text: "Tajik (тоҷикӣ)" },
      { value: "tam",  text: "Tamil (தமிழ்)" },
      { value: "tat",  text: "Tatar (татар теле)" },
      { value: "tel",  text: "Telugu (తెలుగు)" },
      { value: "tha",  text: "Thai (ไทย)" },
      { value: "bod",  text: "Tibetan Standard (བོད་ཡིག)" },
      { value: "tir",  text: "Tigrinya (ትግርኛ)" },
      { value: "ton",  text: "Tonga (faka Tonga)" },
      { value: "tso",  text: "Tsonga (Xitsonga)" },
      { value: "tsn",  text: "Tswana (Setswana)" },
      { value: "tur",  text: "Turkish (Türkçe)" },
      { value: "tuk",  text: "Turkmen (Türkmen)" },
      { value: "twi",  text: "Twi" },
      { value: "uig",  text: "Uighur (Uyƣurqə)" },
      { value: "ukr",  text: "Ukrainian (українська мова)" },
      { value: "urd",  text: "Urdu (اردو)" },
      { value: "ven",  text: "Venda (Tshivenḓa)" },
      { value: "vie",  text: "Vietnamese (Tiếng Việt)" },
      { value: "vol",  text: "Volapük" },
      { value: "wln", text: "Walloon (walon)" },
      { value: "cym", text: "Welsh (Cymraeg)" },
      { value: "fry", text: "Western Frisian (Frysk)" },
      { value: "wol", text: "Wolof (Wollof)" },
      { value: "xho", text: "Xhosa (isiXhosa)" },
      { value: "yid", text: "Yiddish (ייִדיש)" },
      { value: "yor", text: "Yoruba (Yorùbá)" },
      { value: "zha", text: "Zhuang (Saɯ cueŋƅ)" },
      { value: "zul", text: "Zulu (isiZulu)" }
    ];

    const ORIGINAL_COUNTRIES = [
      { value: "afg", text: "Afghanistan" },
      { value: "ala", text: "Åland Islands" },
      { value: "alb", text: "Albania" },
      { value: "dza", text: "Algeria" },
      { value: "asm", text: "American Samoa" },
      { value: "and", text: "Andorra" },
      { value: "ago", text: "Angola" },
      { value: "aia", text: "Anguilla" },
      { value: "ata", text: "Antarctica" },
      { value: "atg", text: "Antigua and Barbuda" },
      { value: "arg", text: "Argentina" },
      { value: "arm", text: "Armenia" },
      { value: "abw", text: "Aruba" },
      { value: "aus", text: "Australia" },
      { value: "aut", text: "Austria" },
      { value: "aze", text: "Azerbaijan" },
      { value: "bhs", text: "Bahamas" },
      { value: "bhr", text: "Bahrain" },
      { value: "bgd", text: "Bangladesh" },
      { value: "brb", text: "Barbados" },
      { value: "blr", text: "Belarus" },
      { value: "bel", text: "Belgium" },
      { value: "blz", text: "Belize" },
      { value: "ben", text: "Benin" },
      { value: "bmu", text: "Bermuda" },
      { value: "btn", text: "Bhutan" },
      { value: "bol", text: "Bolivia" },
      { value: "bes", text: "Bonaire, Sint Eustatius and Saba" },
      { value: "bih", text: "Bosnia and Herzegovina" },
      { value: "bwa", text: "Botswana" },
      { value: "bvt", text: "Bouvet Island" },
      { value: "bra", text: "Brazil" },
      { value: "iot", text: "British Indian Ocean Territory" },
      { value: "vgb", text: "British Virgin Islands" },
      { value: "brn", text: "Brunei Darussalam" },
      { value: "bgr", text: "Bulgaria" },
      { value: "bfa", text: "Burkina Faso" },
      { value: "bdi", text: "Burundi" },
      { value: "khm", text: "Cambodia" },
      { value: "cmr", text: "Cameroon" },
      { value: "can", text: "Canada" },
      { value: "cpv", text: "Cape Verde" },
      { value: "cym", text: "Cayman Islands" },
      { value: "caf", text: "Central African Republic" },
      { value: "tcd", text: "Chad" },
      { value: "chl", text: "Chile" },
      { value: "chn", text: "China" },
      { value: "cxr", text: "Christmas Island" },
      { value: "cck", text: "Cocos (Keeling) Islands" },
      { value: "col", text: "Colombia" },
      { value: "com", text: "Comoros" },
      { value: "cod", text: "Congo" },
      { value: "cok", text: "Cook Islands" },
      { value: "cri", text: "Costa Rica" },
      { value: "hrv", text: "Croatia" },
      { value: "cub", text: "Cuba" },
      { value: "cuw", text: "Curaçao" },
      { value: "cyp", text: "Cyprus" },
      { value: "cze", text: "Czech Republic" },
      { value: "dnk", text: "Denmark" },
      { value: "dji", text: "Djibouti" },
      { value: "dma", text: "Dominica" },
      { value: "dom", text: "Dominican Republic" },
      { value: "ecu", text: "Ecuador" },
      { value: "egy", text: "Egypt" },
      { value: "slv", text: "El Salvador" },
      { value: "gnq", text: "Equatorial Guinea" },
      { value: "eri", text: "Eritrea" },
      { value: "est", text: "Estonia" },
      { value: "eth", text: "Ethiopia" },
      { value: "fji", text: "Fiji" },
      { value: "fin", text: "Finland" },
      { value: "fra", text: "France" },
      { value: "guf", text: "French Guiana" },
      { value: "pyf", text: "French Polynesia" },
      { value: "atf", text: "French Southern Territories" },
      { value: "gab", text: "Gabon" },
      { value: "gmb", text: "Gambia" },
      { value: "geo", text: "Georgia" },
      { value: "deu", text: "Germany" },
      { value: "gha", text: "Ghana" },
      { value: "gib", text: "Gibraltar" },
      { value: "gbr", text: "Great Britain" },
      { value: "grc", text: "Greece" },
      { value: "grl", text: "Greenland" },
      { value: "grd", text: "Grenada" },
      { value: "glp", text: "Guadeloupe" },
      { value: "gum", text: "Guam" },
      { value: "gtm", text: "Guatemala" },
      { value: "ggy", text: "Guernsey" },
      { value: "gin", text: "Guinea" },
      { value: "gnb", text: "Guinea-Bissau" },
      { value: "guy", text: "Guyana" },
      { value: "hti", text: "Haiti" },
      { value: "hmd", text: "Heard Island and McDonald Islands" },
      { value: "hnd", text: "Honduras" },
      { value: "hkg", text: "Hong Kong" },
      { value: "hun", text: "Hungary" },
      { value: "isl", text: "Iceland" },
      { value: "ind", text: "India" },
      { value: "idn", text: "Indonesia" },
      { value: "irn", text: "Iran" },
      { value: "irq", text: "Iraq" },
      { value: "irl", text: "Ireland" },
      { value: "imn", text: "Isle of Man" },
      { value: "isr", text: "Israel" },
      { value: "ita", text: "Italy" },
      { value: "jam", text: "Jamaica" },
      { value: "jpn", text: "Japan" },
      { value: "jey", text: "Jersey" },
      { value: "jor", text: "Jordan" },
      { value: "kaz", text: "Kazakhstan" },
      { value: "ken", text: "Kenya" },
      { value: "kir", text: "Kiribati" },
      { value: "unk", text: "Kosovo" },
      { value: "kwt", text: "Kuwait" },
      { value: "kgz", text: "Kyrgyzstan" },
      { value: "lao", text: "Laos" },
      { value: "lva", text: "Latvia" },
      { value: "lbn", text: "Lebanon" },
      { value: "lso", text: "Lesotho" },
      { value: "lbr", text: "Liberia" },
      { value: "lby", text: "Libya" },
      { value: "lie", text: "Liechtenstein" },
      { value: "ltu", text: "Lithuania" },
      { value: "lux", text: "Luxembourg" },
      { value: "mac", text: "Macao" },
      { value: "mkd", text: "Macedonia" },
      { value: "mdg", text: "Madagascar" },
      { value: "mwi", text: "Malawi" },
      { value: "mys", text: "Malaysia" },
      { value: "mdv", text: "Maldives" },
      { value: "mli", text: "Mali" },
      { value: "mlt", text: "Malta" },
      { value: "mhl", text: "Marshall Islands" },
      { value: "mtq", text: "Martinique" },
      { value: "mrt", text: "Mauritania" },
      { value: "mus", text: "Mauritius" },
      { value: "myt", text: "Mayotte" },
      { value: "mex", text: "Mexico" },
      { value: "fsm", text: "Micronesia" },
      { value: "mda", text: "Moldova" },
      { value: "mco", text: "Monaco" },
      { value: "mng", text: "Mongolia" },
      { value: "mne", text: "Montenegro" },
      { value: "msr", text: "Montserrat" },
      { value: "mar", text: "Morocco" },
      { value: "moz", text: "Mozambique" },
      { value: "mmr", text: "Myanmar" },
      { value: "nam", text: "Namibia" },
      { value: "nru", text: "Nauru" },
      { value: "npl", text: "Nepal" },
      { value: "ncl", text: "New Caledonia" },
      { value: "nzl", text: "New Zealand" },
      { value: "nic", text: "Nicaragua" },
      { value: "ner", text: "Niger" },
      { value: "nga", text: "Nigeria" },
      { value: "niu", text: "Niue" },
      { value: "nfk", text: "Norfolk Island" },
      { value: "prk", text: "North Korea" },
      { value: "mnp", text: "Northern Mariana Islands" },
      { value: "nor", text: "Norway" },
      { value: "omn", text: "Oman" },
      { value: "pak", text: "Pakistan" },
      { value: "pse", text: "Palestine, State of" },
      { value: "pan", text: "Panama" },
      { value: "png", text: "Papua New Guinea" },
      { value: "pry", text: "Paraguay" },
      { value: "per", text: "Peru" },
      { value: "phl", text: "Philippines" },
      { value: "pcn", text: "Pitcairn" },
      { value: "pol", text: "Poland" },
      { value: "prt", text: "Portugal" },
      { value: "pri", text: "Puerto Rico" },
      { value: "qat", text: "Qatar" },
      { value: "plw", text: "Republic of Palau" },
      { value: "cog", text: "Republic of the Congo" },
      { value: "reu", text: "Réunion" },
      { value: "rou", text: "Romania" },
      { value: "rus", text: "Russia" },
      { value: "rwa", text: "Rwanda" },
      { value: "blm", text: "Saint Barthélemy" },
      { value: "kna", text: "Saint Christopher and Nevis" },
      { value: "shn", text: "Saint Helena, Ascension and Tristan da Cunha" },
      { value: "lca", text: "Saint Lucia" },
      { value: "maf", text: "Saint Martin" },
      { value: "spm", text: "Saint Pierre and Miquelon" },
      { value: "vct", text: "Saint Vincent and the Grenadines" },
      { value: "wsm", text: "Samoa" },
      { value: "smr", text: "San Marino" },
      { value: "stp", text: "São Tomé and Príncipe" },
      { value: "sau", text: "Saudi Arabia" },
      { value: "sen", text: "Senegal" },
      { value: "srb", text: "Serbia" },
      { value: "syc", text: "Seychelles" },
      { value: "sle", text: "Sierra Leone" },
      { value: "sgp", text: "Singapore" },
      { value: "sxm", text: "Sint Maarten" },
      { value: "svk", text: "Slovakia" },
      { value: "svn", text: "Slovenia" },
      { value: "slb", text: "Solomon Islands" },
      { value: "som", text: "Somali Republic" },
      { value: "zaf", text: "South Africa" },
      { value: "sgs", text: "South Georgia" },
      { value: "kor", text: "South Korea" },
      { value: "ssd", text: "South Sudan" },
      { value: "esp", text: "Spain" },
      { value: "lka", text: "Sri Lanka" },
      { value: "sdn", text: "Sudan" },
      { value: "sur", text: "Suriname" },
      { value: "sjm", text: "Svalbard and Jan Mayen" },
      { value: "swz", text: "Swaziland" },
      { value: "swe", text: "Sweden" },
      { value: "che", text: "Switzerland" },
      { value: "syr", text: "Syrian Arab Republic" },
      { value: "twn", text: "Taiwan" },
      { value: "tjk", text: "Tajikistan" },
      { value: "tza", text: "Tanzania" },
      { value: "tha", text: "Thailand" },
      { value: "flk", text: "The Falkland Islands" },
      { value: "fro", text: "The Faroe Islands" },
      { value: "nld", text: "The Netherlands" },
      { value: "tls", text: "Timor-Leste" },
      { value: "tgo", text: "Togo" },
      { value: "tkl", text: "Tokelau" },
      { value: "ton", text: "Tonga" },
      { value: "tto", text: "Trinidad and Tobago" },
      { value: "tun", text: "Tunisia" },
      { value: "tur", text: "Turkey" },
      { value: "tkm", text: "Turkmenistan" },
      { value: "tca", text: "Turks and Caicos Islands" },
      { value: "tuv", text: "Tuvalu" },
      { value: "uga", text: "Uganda" },
      { value: "ukr", text: "Ukraine" },
      { value: "are", text: "United Arab Emirates" },
      { value: "umi", text: "United States Minor Outlying Islands" },
      { value: "usa", text: "United States of America" },
      { value: "ury", text: "Uruguay" },
      { value: "uzb", text: "Uzbekistan" },
      { value: "vut", text: "Vanuatu" },
      { value: "vat", text: "Vatican City" },
      { value: "ven", text: "Venezuela" },
      { value: "vnm", text: "Vietnam" },
      { value: "vir", text: "Virgin Islands of the United States" },
      { value: "wlf", text: "Wallis and Futuna" },
      { value: "esh", text: "Western Sahara" },
      { value: "yem", text: "Yemen" },
      { value: "yug", text: "Yugoslavia" },
      { value: "zmb", text: "Zambia" },
      { value: "zwe", text: "Zimbabwe" }
    ];

    const GENRES = [
      { value: "19", text: "Action" },
      { value: "18", text: "Adventure" },
      { value: "17", text: "Animation" },
      { value: "27", text: "Anime" },
      { value: "36", text: "Awards Show" },
      { value: "16", text: "Children" },
      { value: "15", text: "Comedy" },
      { value: "14", text: "Crime" },
      { value: "13", text: "Documentary" },
      { value: "12", text: "Drama" },
      { value: "11", text: "Family" },
      { value: "10", text: "Fantasy" },
      { value: "9",  text: "Food" },
      { value: "8",  text: "Game Show" },
      { value: "33", text: "History" },
      { value: "7",  text: "Home and Garden" },
      { value: "6",  text: "Horror" },
      { value: "32", text: "Indie" },
      { value: "35", text: "Martial Arts" },
      { value: "5",  text: "Mini-Series" },
      { value: "29", text: "Musical" },
      { value: "31", text: "Mystery" },
      { value: "4",  text: "News" },
      { value: "30", text: "Podcast" },
      { value: "3",  text: "Reality" },
      { value: "28", text: "Romance" },
      { value: "2",  text: "Science Fiction" },
      { value: "1",  text: "Soap" },
      { value: "21", text: "Sport" },
      { value: "22", text: "Suspense" },
      { value: "23", text: "Talk Show" },
      { value: "24", text: "Thriller" },
      { value: "25", text: "Travel" },
      { value: "34", text: "War" },
      { value: "26", text: "Western" }
    ];

    const STATUS_OPTIONS = [
      { value: "1", text: "Announced" },
      { value: "2", text: "Pre-Production" },
      { value: "3", text: "Filming / Post-Production" },
      { value: "4", text: "Completed" },
      { value: "5", text: "Released" }
    ];

    const SERIES_STATUS_OPTIONS = [
      { value: '1', text: 'Continuing' },
      { value: '2', text: 'Ended' },
      { value: '3', text: 'Upcoming' }
    ];

    // ------------------------------
    // ONE-PAGE Movie Create → Auto-Edit Flow
    // ------------------------------
    ;(function movieOnePageFlow() {
      'use strict';

      const STORAGE_KEY = 'tm_new_movie_data';
      const path       = location.pathname;
      const isCreate   = /^\/movies\/create(?:$|[?\/])/.test(path);
      const isStep2    = /^\/movies\/create-step2/.test(path);
      const isSlug     = /^\/movies\/[^/]+(?:$|[?#])/.test(path) && !isStep2 && !isCreate;
      const isEdit     = /^\/movies\/[^/]+\/edit/.test(path);

      // STEP 1: /movies/create → show overlay
      if (isCreate) {
        const overlay = makeOverlay();
        const form    = document.createElement('form');
        const fields  = {};

        // Title
        const titleIn = document.createElement('input');
        titleIn.type  = 'text';
        addField(form, 'Title', titleIn);
        fields.title = titleIn;

        // Overview w/ 500-char count
        const ov = document.createElement('textarea');
        ov.rows      = 4;
        ov.maxLength = 500;
        addField(form, 'Overview (max 500)', ov);
        fields.overview = ov;
        const badge = document.createElement('div');
        badge.style.cssText = 'text-align:right;font-size:12px;';
        badge.textContent   = '0/500';
        ov.addEventListener('input', () => {
          badge.textContent = `${ov.value.length}/500`;
        });
        form.appendChild(badge);

        // Language (default English)
        const ls = document.createElement('select');
        LANGUAGES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          ls.append(opt);
        });
        ls.value = 'eng';
        addField(form, 'Language', ls);
        fields.language = ls;

        // Original Country (default GBR)
        const cs = document.createElement('select');
        ORIGINAL_COUNTRIES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          cs.append(opt);
        });
        cs.value = 'gbr';
        addField(form, 'Original Country', cs);
        fields.country = cs;

        // Status
        const ss = document.createElement('select');
        STATUS_OPTIONS.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          ss.append(opt);
        });
        ss.value = STATUS_OPTIONS[STATUS_OPTIONS.length - 1].value;
        addField(form, 'Status', ss);
        fields.status = ss;

        // Genres (multi-select)
        const gs = document.createElement('select');
        gs.multiple = true;
        gs.size     = 6;
        GENRES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          gs.append(opt);
        });
        addField(form, 'Genres', gs);
        fields.genres = gs;

        // Release Country
        const rc = document.createElement('select');
        ORIGINAL_COUNTRIES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          rc.append(opt);
        });
        addField(form, 'Release Country', rc);
        fields.releaseCountry = rc;

        // Release Date
        const rd = document.createElement('input');
        rd.type        = 'text';
        rd.placeholder = 'YYYY-MM-DD';
        addField(form, 'Release Date', rd);
        fields.releaseDate = rd;

        // Runtime
        const rt = document.createElement('input');
        rt.type = 'number';
        rt.min  = '0';
        addField(form, 'Runtime (min)', rt);
        fields.runtime = rt;

        // Create & Continue button
        const btn = document.createElement('button');
        btn.type        = 'submit';
        btn.textContent = '▶ Create & Continue';
        Object.assign(btn.style, {
          width      : '100%',
          padding    : '8px',
          marginTop : '10px',
          background : '#007bff',
          color      : '#fff',
          border     : 'none',
          borderRadius: '4px',
          fontWeight : '600',
          cursor     : 'pointer'
        });
        form.appendChild(btn);

        overlay.appendChild(form);
        document.body.appendChild(overlay);

        form.addEventListener('submit', e => {
          e.preventDefault();
          const data = {
            title          : fields.title.value.trim(),
            overview       : fields.overview.value.trim(),
            language       : fields.language.value,
            country        : fields.country.value,
            status         : fields.status.value,
            genres         : Array.from(fields.genres.selectedOptions).map(o => o.value),
            releaseCountry : fields.releaseCountry.value,
            releaseDate    : fields.releaseDate.value,
            runtime        : fields.runtime.value
          };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));

          // fill native Step-1 form
          const t1 = document.querySelector('input.ais-SearchBox-input');
          if (t1) {
            t1.value = data.title;
            t1.dispatchEvent(new Event('input', { bubbles: true }));
          }
          ['overview','language','country','status'].forEach(name => {
            const el = document.querySelector(`[name="${name}"]`);
            if (el) el.value = data[name];
          });

          const cont = document.querySelector('form button.btn-success');
          if (cont) cont.click();
        });

        return;
      }

      // STEP 2: /movies/create-step2 → fill & Save
      if (isStep2 && sessionStorage.getItem(STORAGE_KEY)) {
        const data    = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        const saveBtn = document.querySelector('button.btn.btn-success');
        if (saveBtn) {
          const f2 = saveBtn.closest('form');

          // Name can be a hidden field outside the <form>
          let nameFld = f2.querySelector('input[name="name"]');
          if (!nameFld) {
            nameFld = document.querySelector('input[type="hidden"][name="name"]');
          }
          if (nameFld) {
            nameFld.value = data.title;
            nameFld.dispatchEvent(new Event('input', { bubbles: true }));
          }

          // Overview
          const ovFld = f2.querySelector('textarea[name="overview"]');
          if (ovFld) {
            ovFld.value = data.overview;
            ovFld.dispatchEvent(new Event('input', { bubbles: true }));
          }

          // Language, Country, Status
          [['select[name="language"]', data.language],
           ['select[name="country"]',  data.country],
           ['select[name="status"]',   data.status]
          ].forEach(([sel,val]) => {
            const el = f2.querySelector(sel);
            if (el) el.value = val;
          });

          // Genres checkboxes
          f2.querySelectorAll('input[name="genres[]"]').forEach(chk => {
            chk.checked = data.genres.includes(chk.value);
          });

          saveBtn.click();
        }
        return;
      }


      // SLUG → EDIT redirect
      if (isSlug && sessionStorage.getItem(STORAGE_KEY)) {
        window.location.replace(path.replace(/\/$/, '') + '/edit' + location.search);
        return;
      }

      // FINAL EDIT: fill release, date & runtime → Save
      if (isEdit && sessionStorage.getItem(STORAGE_KEY)) {
        const { releaseCountry, releaseDate, runtime: movieRuntime } =
          JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        sessionStorage.removeItem(STORAGE_KEY);

        console.log('movieOnePageFlow: applying final edit', {
          releaseCountry, releaseDate, movieRuntime
        });

        setTimeout(() => {
          // Release Country
          const rcSel = document.querySelector(
            'select[name="releasecountries[]"], select[name="releasecountries"]'
          );
          if (rcSel) {
            rcSel.value = releaseCountry;
            rcSel.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Release Date
          const rdInput = document.querySelector(
            'input[name="releasedates[]"], input[name="releasedates"]'
          );
          if (rdInput) {
            rdInput.value = releaseDate;
            rdInput.dispatchEvent(new Event('input', { bubbles: true }));
            rdInput.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Runtime
          const rtInput = document.querySelector(
            'input[name="movie_runtime"], input[name="runtime"]'
          );
          if (rtInput) {
            rtInput.value = movieRuntime;
            rtInput.dispatchEvent(new Event('input', { bubbles: true }));
            rtInput.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const saveBtn2 = document.querySelector('button.btn-success, input[type="submit"]');
          if (saveBtn2) {
            console.log('movieOnePageFlow: clicking Save…');
            saveBtn2.click();
          }
        }, 400);
      }

    })();  // end movieOnePageFlow

    // ─────────────────────────────────────────────────────────────────────
    // ONE-PAGE Series Create → Auto-Edit Flow
    // ─────────────────────────────────────────────────────────────────────
    ;(function seriesOnePageFlow() {
      'use strict';

      const STORAGE_KEY = 'tm_new_series_data';
      const path       = location.pathname;
      const isCreate   = /^\/series\/create(?:$|[?\/])/.test(path);
      const isStep2    = /^\/series\/create-step2/.test(path);
      const isSlug     = /^\/series\/[^/]+(?:$|[?#])/.test(path) && !isStep2 && !isCreate;
      const isEdit     = /^\/series\/[^/]+\/edit/.test(path);

      // STEP 1: /series/create → overlay
      if (isCreate) {
        const overlay = makeOverlay();
        const form    = document.createElement('form');
        const fields  = {};

        // Title
        const titleIn = document.createElement('input');
        titleIn.type  = 'text';
        addField(form, 'Title', titleIn);
        fields.title = titleIn;

        // Overview
        const ov = document.createElement('textarea');
        ov.rows      = 4;
        ov.maxLength = 500;
        addField(form, 'Overview (max 500)', ov);
        fields.overview = ov;
        const badge2 = document.createElement('div');
        badge2.style.cssText = 'text-align:right;font-size:12px;';
        badge2.textContent   = '0/500';
        ov.addEventListener('input', () => {
          badge2.textContent = `${ov.value.length}/500`;
        });
        form.appendChild(badge2);

        // Language
        const ls2 = document.createElement('select');
        LANGUAGES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          ls2.append(opt);
        });
        ls2.value = 'eng';
        addField(form, 'Language', ls2);
        fields.language = ls2;

        // Original Country
        const cs2 = document.createElement('select');
        ORIGINAL_COUNTRIES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          cs2.append(opt);
        });
        cs2.value = 'gbr';
        addField(form, 'Original Country', cs2);
        fields.country = cs2;

        // Status (Continuing / Ended / Upcoming)
        const ss2 = document.createElement('select');
        SERIES_STATUS_OPTIONS.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          if (o.value === '3') opt.selected = true;  // default "Upcoming"
          ss2.append(opt);
        });
        addField(form, 'Status', ss2);
        fields.status = ss2;

        // Genres
        const gs2 = document.createElement('select');
        gs2.multiple = true;
        gs2.size     = 6;
        GENRES.forEach(o => {
          const opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.text;
          gs2.append(opt);
        });
        addField(form, 'Genres', gs2);
        fields.genres = gs2;

        // Continue button
        const btn2 = document.createElement('button');
        btn2.type        = 'submit';
        btn2.textContent = '▶ Create & Continue';
        Object.assign(btn2.style, {
          width:'100%',
          padding:'8px',
          marginTop:'10px',
          background:'#007bff',
          color:'#fff',
          border:'none',
          borderRadius:'4px',
          fontWeight:'600',
          cursor:'pointer'
        });
        form.appendChild(btn2);

        overlay.appendChild(form);
        document.body.appendChild(overlay);

        form.addEventListener('submit', e => {
          e.preventDefault();
          const data = {
            title:    fields.title.value.trim(),
            overview: fields.overview.value.trim(),
            language: fields.language.value,
            country:  fields.country.value,
            status:   fields.status.value,
            genres:   Array.from(fields.genres.selectedOptions).map(o => o.value)
          };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));

          // two-step fill Step-1 for series
          const t1s = document.querySelector('input.ais-SearchBox-input');
          if (t1s) {
            t1s.value = data.title;
            t1s.dispatchEvent(new Event('input',{bubbles:true}));
          }
          ['overview','language','country','status'].forEach(name => {
            const el = document.querySelector(`[name="${name}"]`);
            if (el) el.value = data[name];
          });

          document.querySelector('form button.btn-success')?.click();
        });

        return;
      }

      // STEP 2: /series/create-step2 → fill & Save
      if (isStep2 && sessionStorage.getItem(STORAGE_KEY)) {
        const data    = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        const saveBtn = document.querySelector('button.btn.btn-success');
        if (saveBtn) {
          const f2s = saveBtn.closest('form');
          const setVal = (sel,val) => {
            const el = f2s.querySelector(sel);
            if (el) el.value = val;
          };
          setVal('input[name="name"]',       data.title);
          setVal('textarea[name="overview"]', data.overview);
          setVal('select[name="language"]',   data.language);
          setVal('select[name="country"]',    data.country);
          setVal('select[name="status"]',     data.status);

          f2s.querySelectorAll('input[name="genres[]"]').forEach(chk => {
            chk.checked = data.genres.includes(chk.value);
          });

          saveBtn.click();
        }
        return;
      }

      // SLUG → EDIT redirect
      if (isSlug && sessionStorage.getItem(STORAGE_KEY)) {
        window.location.replace(path.replace(/\/$/, '') + '/edit' + location.search);
        return;
      }

      // FINAL EDIT: fill release & runtime → Save
      if (isEdit && sessionStorage.getItem(STORAGE_KEY)) {
        const { releaseCountry, releaseDate, runtime } =
          JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        sessionStorage.removeItem(STORAGE_KEY);

        setTimeout(() => {
          const rc = document.querySelector('select[name="releasecountries[]"]');
          if (rc) rc.value = releaseCountry;
          const rd = document.querySelector('input[name="releasedates[]"]');
          if (rd) rd.value = releaseDate;
          const rt = document.querySelector('input[name="series_runtime"], input[name="movie_runtime"]');
          if (rt) rt.value = runtime;

          document.querySelector('button.btn-success, input[type="submit"]')?.click();
        }, 400);
      }
    })();  // end seriesOnePageFlow
  })();

  // ------------------------------
  // Floating “All Episodes” Button on Series Pages
  // ------------------------------
  ;(function allEpisodesButtonModule() {
    'use strict';

    // only run on /series/:slug pages
    if (!/^\/series\/[^/]+(?:$|[?#])/.test(location.pathname)) return;

    // find the “All Seasons” link in the DOM
    const allLink = document.querySelector('a[href*="/allseasons/"]');
    if (!allLink) return;

    // avoid dupes
    if (document.getElementById('tm-all-episodes-btn')) return;

    // build our button
    const btn = document.createElement('a');
    btn.id          = 'tm-all-episodes-btn';
    btn.href        = allLink.href;
    btn.textContent = 'All Episodes';
    Object.assign(btn.style, {
      position     : 'fixed',
      right        : '20px',
      bottom       : '20px',
      padding      : '10px 14px',
      background   : '#17a2b8',
      color        : '#fff',
      borderRadius : '6px',
      textDecoration: 'none',
      boxShadow    : '0 2px 6px rgba(0,0,0,0.3)',
      zIndex       : '2147483001',
      fontWeight   : '600'
    });

    document.body.appendChild(btn);
  })();

})();
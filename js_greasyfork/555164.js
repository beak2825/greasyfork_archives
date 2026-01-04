// ==UserScript==
// @name         Instagram GhostList
// @namespace    @reinaldyalaratte
// @version      1.3
// @description  Automatically fetch and scroll your Instagram followers/following, and download a ghost list of non-followers
// @license      CC-BY-NC
// @match        https://www.instagram.com/*
// @icon         https://images-platform.99static.com//7hoKrIiYxL8VuIjAjvPJt8B_rbk=/63x55:1588x1580/fit-in/590x590/projects-files/66/6611/661127/3fcadb3b-493d-4b86-8b30-3d38007c3a79.png
// @grant        none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/555164/Instagram%20GhostList.user.js
// @updateURL https://update.greasyfork.org/scripts/555164/Instagram%20GhostList.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  const BTN_ID = 'ig-ghost-final-btn-v1';
  const OVERLAY_ID = 'ig-ghost-final-ov';
  const SESSION_KEY = 'ig_ghost_scan_v1';
  const USER_KEY_PREFIX = 'ig_ghost_saved_v1_';
  const MAX_PHASE_MS = 180000; // 3 min per phase
  const STABLE_LOOPS = 10;
  const POLL_MS = 600;
  const DOWNLOAD_LOCK_PROP = '__ig_ghost_download_lock_v1'; // guard to prevent multi-downloads
  const DOWNLOAD_FLAG_KEY = '__ig_ghost_downloaded_flag_v1'; // sessionStorage flag to prevent repeated downloads across resume calls
  const DOWNLOAD_FLAG_TTL = 60 * 1000; // 60s tolerance window

  /* ---------- HELPERS ---------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const log = (...s) => console.log('[IG-GhostFinal]', ...s);

  function getProfileUsernameFromPath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? parts[0] : null;
  }

  function saveList(username, kind, arr) {
    localStorage.setItem(`${USER_KEY_PREFIX}${username}_${kind}`, JSON.stringify({ ts: Date.now(), data: arr }));
  }
  function loadList(username, kind) {
    try {
      const raw = localStorage.getItem(`${USER_KEY_PREFIX}${username}_${kind}`);
      if (!raw) return null;
      return JSON.parse(raw).data || null;
    } catch (e) { return null; }
  }

  function showOverlay(txt) {
    // --- SUPPRESSION: don't show progress-like messages after session finished ---
    // If message looks like progress / items-collected / fetching and there is no active SESSION_KEY,
    // ignore to avoid stale "0 items collected..." left on screen.
    try {
      const isProgressLike = /items collected|fetching followers|fetching following|items collected\.\.\.|⏳/i.test(txt);
      const sessionActive = !!sessionStorage.getItem(SESSION_KEY);
      if (isProgressLike && !sessionActive) {
        // silently ignore progress messages when no scan session active
        log('Suppressing overlay (stale progress):', txt);
        return;
      }
    } catch (e) { /* ignore */ }

    let o = document.getElementById(OVERLAY_ID);
    if (!o) {
      o = document.createElement('div');
      o.id = OVERLAY_ID;
      Object.assign(o.style, {
        position: 'fixed', left: '50%', top: '12%', transform: 'translateX(-50%)',
        zIndex: 2147483647, background: 'rgba(0,0,0,0.78)', color: '#fff',
        padding: '12px 16px', borderRadius: '10px', fontFamily: 'Inter, Arial, sans-serif',
        whiteSpace: 'pre-wrap', textAlign: 'center', maxWidth: '86vw'
      });
      document.body.appendChild(o);
    }
    o.innerText = txt;
    console.log('[IG-GhostFinal]', txt);
  }
  function removeOverlay() { const e = document.getElementById(OVERLAY_ID); if (e) e.remove(); }

  /* ---------- Find clickable element (multi-strategy) ---------- */
  function findOpenElement(type) {
    const suffix = `/${type}/`;
    // 1) visible anchor ending with suffix
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    const vis = anchors.find(a => (a.getAttribute('href') || '').endsWith(suffix) && a.offsetParent !== null);
    if (vis) return vis;
    // 2) any anchor ending with suffix
    const any = anchors.find(a => (a.getAttribute('href') || '').endsWith(suffix));
    if (any) return any;
    // 3) search textual labels (EN/ID) across a/button/span text
    const keywords = type === 'following' ? ['following', 'mengikuti', 'mengikuti'] : ['followers', 'pengikut', 'pengikut'];
    const candidates = Array.from(document.querySelectorAll('a, button, span, div'));
    for (const c of candidates) {
      try {
        const t = (c.innerText || '').toLowerCase().trim();
        if (!t) continue;
        for (const kw of keywords) {
          if (t === kw || t.includes(kw + ' ') || t.includes(' ' + kw)) return c;
        }
      } catch (e) { }
    }
    return null;
  }

  /* ---------- Detect list container: modal or page ---------- */
  function detectListContainer() {
    // modal dialog
    const dialog = document.querySelector('div[role="dialog"]');
    if (dialog) {
      // prefer a UL inside
      const ul = dialog.querySelector('ul');
      if (ul && ul.querySelectorAll('li').length) return { container: ul, mode: 'modal', dialog };
      // fallback: big scrollable child
      const cand = Array.from(dialog.querySelectorAll('div, section')).find(n => {
        try { return n.querySelectorAll && n.querySelectorAll('a[href^="/"]').length > 4 && n.scrollHeight > n.clientHeight + 10; } catch (e) { return false; }
      });
      if (cand) return { container: cand, mode: 'modal', dialog };
      // last fallback: dialog itself
      return { container: dialog, mode: 'modal', dialog };
    }
    // page form
    const main = document.querySelector('main');
    if (main) {
      const ul = main.querySelector('ul');
      if (ul && ul.querySelectorAll('li').length) return { container: ul, mode: 'page' };
      const cand2 = Array.from(main.querySelectorAll('div, section')).find(n => {
        try { return n.querySelectorAll && n.querySelectorAll('a[href^="/"]').length > 6 && n.scrollHeight > n.clientHeight + 10; } catch (e) { return false; }
      });
      if (cand2) return { container: cand2, mode: 'page' };
    }
    return null;
  }

  /* ---------- Fetch interceptor fallback (collects user nodes) ---------- */
  function hookFetch(collector) {
    if (window.__ig_ghost_hooked_v1) return () => { };
    window.__ig_ghost_hooked_v1 = true;
    const orig = window.fetch;
    window.fetch = function (input, init) {
      return orig(input, init).then(async resp => {
        try {
          const url = (typeof input === 'string') ? input : (input && input.url) || '';
          if (url.includes('/graphql/') || url.includes('/web/friendships/') || url.includes('/followers') || url.includes('/following')) {
            resp.clone().json().then(json => {
              try { extractUsersFromObject(json, collector); } catch (e) { }
            }).catch(() => { /* not json */ });
          }
        } catch (e) { }
        return resp;
      });
    };
    return () => { window.fetch = orig; window.__ig_ghost_hooked_v1 = false; };
  }

  function extractUsersFromObject(obj, collector) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) return obj.forEach(x => extractUsersFromObject(x, collector));
    if (obj.edges && Array.isArray(obj.edges)) {
      obj.edges.forEach(e => {
        const node = e && e.node ? e.node : e;
        if (node && node.username) collector.set((node.username || '').toLowerCase(), { username: node.username, full_name: node.full_name || '', pic: node.profile_pic_url || node.profile_pic_url_hd || '' });
        else if (node && node.user && node.user.username) {
          const un = node.user.username;
          collector.set((un || '').toLowerCase(), { username: un, full_name: node.user.full_name || '', pic: node.user.profile_pic_url || '' });
        }
      });
    }
    if (obj.username && (obj.full_name || obj.profile_pic_url)) collector.set((obj.username || '').toLowerCase(), { username: obj.username, full_name: obj.full_name || '', pic: obj.profile_pic_url || '' });
    Object.keys(obj).forEach(k => {
      try { extractUsersFromObject(obj[k], collector); } catch (e) { }
    });
  }

  /* ---------- Scroll + collect (DOM + fetch-collector) ---------- */
  function findScrollableAncestor(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      try {
        const cs = getComputedStyle(cur);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight + 10) return cur;
      } catch (e) { }
      cur = cur.parentElement;
    }
    return el;
  }

  async function scrollAndCollect(container, expectedCount, fetchCollector) {
    const scrollable = findScrollableAncestor(container) || container;
    const domMap = new Map();
    function pickDom() {
      try {
        const anchors = Array.from(container.querySelectorAll('a[href^="/"]'));
        anchors.forEach(a => {
          const href = (a.getAttribute('href') || '').replace(/\?.*$/, '').trim();
          const m = href.match(/^\/([A-Za-z0-9._]+)\/$/);
          if (m && m[1]) {
            const u = m[1].toLowerCase();
            if (!domMap.has(u)) {
              let display = '';
              const li = a.closest('li') || a.closest('div');
              if (li) {
                const spans = Array.from(li.querySelectorAll('span'));
                for (const s of spans) {
                  const t = (s.textContent || '').trim();
                  if (!t) continue;
                  if (t.replace(/\s/g, '').toLowerCase() === u) continue;
                  if (t.includes('@')) continue;
                  display = t; break;
                }
              }
              domMap.set(u, { username: u, displayName: display });
            }
          }
        });
      } catch (e) { log('pickDom err', e); }
    }

    pickDom();
    const mo = new MutationObserver(() => pickDom());
    try { mo.observe(container, { childList: true, subtree: true }); } catch (e) { }

    let lastCount = -1, stable = 0;
    const start = Date.now();
    while (true) {
      try {
        for (let i = 0; i < 3; i++) {
          try { scrollable.scrollBy({ top: 800 + Math.floor(domMap.size / 8) * 80, left: 0, behavior: 'auto' }); } catch (e) { try { scrollable.scrollTop = scrollable.scrollHeight; } catch (e) { } }
          await sleep(220);
        }
        try { scrollable.dispatchEvent(new WheelEvent('wheel', { deltaY: 1200, bubbles: true })); } catch (e) { }
      } catch (e) { log('scroll err', e); }

      await sleep(POLL_MS + Math.min(800, Math.floor(domMap.size / 12) * 60));
      pickDom();

      const mergedKeys = new Set([...domMap.keys(), ...fetchCollector.keys()]);
      const count = mergedKeys.size;
      const pct = expectedCount ? Math.round((count / expectedCount) * 100) : null;
      showOverlay(pct ? `⏳ ${count}/${expectedCount} (${pct}%)` : `⏳ ${count} items collected...`);

      if (count === lastCount) stable++; else stable = 0;
      lastCount = count;

      if (expectedCount && count >= expectedCount) { log('expected reached', count, expectedCount); break; }
      if (stable >= STABLE_LOOPS && count > 0) { log('stable reached', count); break; }
      if (Date.now() - start > MAX_PHASE_MS) { log('timeout break', count); break; }
    }

    try { mo.disconnect(); } catch (e) { }
    // merge prefer fetchCollector for completeness
    const merged = new Map();
    fetchCollector.forEach((v, k) => merged.set(k, v));
    domMap.forEach((v, k) => { if (!merged.has(k)) merged.set(k, v); });
    return Array.from(merged.values());
  }

  /* ---------- Open list robustly (click or navigate) ---------- */
  async function openListAndGetContainer(type) {
    // If current URL already ends with /type/ use page detection
    if (location.pathname.endsWith(`/${type}/`)) {
      await sleep(500);
      const p = detectListContainer();
      if (p) return p;
    }

    // find clickable element and click, else navigate
    const el = findOpenElement(type);
    if (el) {
      try { el.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch (e) { }
      try { el.click(); } catch (e) { try { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); } catch (e) { } }
      // wait for container
      const start = Date.now();
      while (Date.now() - start < 15000) {
        const p = detectListContainer();
        if (p) return p;
        await sleep(300);
      }
    }

    // fallback: navigate to /username/type/
    const username = getProfileUsernameFromPath();
    if (username) {
      location.href = `https://www.instagram.com/${username}/${type}/`;
      // wait for page render
      const t0 = Date.now();
      while (Date.now() - t0 < 20000) {
        const p = detectListContainer();
        if (p) return p;
        await sleep(350);
      }
    }
    throw new Error(`[OpenList] ${type} container not found`);
  }

  /* ---------- Orchestrator (session across navigation) ---------- */
  async function startFullScan({ force = true } = {}) {
    // Determine username
    const username = getProfileUsernameFromPath();
    if (!username) {
      alert('Buka profil Instagram-mu (https://www.instagram.com/USERNAME/) lalu klik Ghost List.');
      return;
    }

    // session object to carry across navigations (following -> followers)
    const session = { username, step: 'start', origin: location.href, ts: Date.now() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // navigate to following (openListAndGetContainer will handle if already on page)
    location.href = `https://www.instagram.com/${username}/following/`;
  }

  async function resumeIfScanning() {
    const ss = sessionStorage.getItem(SESSION_KEY);
    if (!ss) return;
    let s;
    try { s = JSON.parse(ss); } catch (e) { sessionStorage.removeItem(SESSION_KEY); return; }
    const username = s.username;
    if (!username) { sessionStorage.removeItem(SESSION_KEY); return; }

    // If on following page/ modal
    if (location.pathname.startsWith(`/${username}/following`)) {
      s.step = 'following';
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      try {
        showOverlay('🔄 Fetching following — please keep this tab active...');
        // per-phase fetch collector
        const localFetch = new Map();
        const unhook = hookFetch(localFetch);
        const contInfo = await openListAndGetContainer('following');
        const expected = (function () {
          try {
            const hdr = document.querySelector('header') || document.querySelector('main header');
            if (!hdr) return null;
            let f = null;
            Array.from(hdr.querySelectorAll('a[href]')).forEach(a => {
              const href = a.getAttribute('href') || '';
              const txt = (a.innerText || '').trim();
              if (href.endsWith('/following/')) f = parseInt(txt.replace(/[^\d]/g, '')) || f;
            });
            return f;
          } catch (e) { return null; }
        })();
        const arr = await scrollAndCollect(contInfo.container, expected, localFetch);
        saveList(username, 'following', arr.map(x => (x.username || x).toString().toLowerCase()));
        try { unhook(); } catch (e) { }
      } catch (e) {
        console.warn('Error scraping following', e);
      }
      // move to followers
      s.step = 'followers';
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      location.href = `https://www.instagram.com/${username}/followers/`;
      return;
    }

    // If on followers page
    if (location.pathname.startsWith(`/${username}/followers`)) {
      s.step = 'followers';
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      try {
        showOverlay('🔄 Fetching followers — please keep this tab active...');
        const localFetch = new Map();
        const unhook = hookFetch(localFetch);
        const contInfo = await openListAndGetContainer('followers');
        const expected = (function () {
          try {
            const hdr = document.querySelector('header') || document.querySelector('main header');
            if (!hdr) return null;
            let fr = null;
            Array.from(hdr.querySelectorAll('a[href]')).forEach(a => {
              const href = a.getAttribute('href') || '';
              const txt = (a.innerText || '').trim();
              if (href.endsWith('/followers/')) fr = parseInt(txt.replace(/[^\d]/g, '')) || fr;
            });
            return fr;
          } catch (e) { return null; }
        })();
        const arr = await scrollAndCollect(contInfo.container, expected, localFetch);
        saveList(username, 'followers', arr.map(x => (x.username || x).toString().toLowerCase()));
        try { unhook(); } catch (e) { }
      } catch (e) {
        console.warn('Error scraping followers', e);
      }
      // done - compute result and immediately download
s.step = 'done';
sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));

const following = loadList(username, 'following') || [];
const followers = loadList(username, 'followers') || [];
const notBack = following.filter(u => !followers.includes(u));

if (notBack.length === 0) {
  showOverlay('✅ Tidak ada akun yang tidak followback.');
  await sleep(1500);
  removeOverlay();
} else {
  // ---------- DOWNLOAD GUARD & SINGLE-DOWNLOAD LOGIC ----------
  // Check sessionStorage recent flag (prevents duplicates across resumeIfScanning invocations)
  const flagRaw = sessionStorage.getItem(DOWNLOAD_FLAG_KEY);
  if (flagRaw) {
    try {
      const parsed = JSON.parse(flagRaw);
      const age = Date.now() - (parsed.ts || 0);
      if (age < DOWNLOAD_FLAG_TTL) {
        showOverlay('🔁 Download already triggered recently — skipping duplicate.');
        await sleep(800);
        removeOverlay();
        // cleanup session to prevent repeated attempts
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
    } catch (e) { /* ignore parse errors */ }
  }

  if (window[DOWNLOAD_LOCK_PROP]) {
    // already downloading in another call — skip
    showOverlay('🔁 Download already in progress, skipping duplicate.');
    await sleep(800);
    removeOverlay();
  } else {
    try {
      // set locks/flags early to prevent concurrent resume calls from reaching here
      window[DOWNLOAD_LOCK_PROP] = true; // global in-memory lock
      sessionStorage.setItem(DOWNLOAD_FLAG_KEY, JSON.stringify({ ts: Date.now() })); // mark in sessionStorage (survives small reloads)

      let text = 'Daftar akun tidak follback kamu:\n\n';
      notBack.forEach(u => text += `${u}\n`);

      // reuse anchor if exists
      const linkId = 'ig-ghost-download-link-v1';
      let a = document.getElementById(linkId);
      if (!a) {
        a = document.createElement('a');
        a.id = linkId;
        a.style.display = 'none';
        document.body.appendChild(a);
      }
      const blob = new Blob([text], { type: 'text/plain' });
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = 'ghost_list.txt';

      // give browser a brief moment, then click once, revoke after short delay
      setTimeout(() => {
        try { a.click(); } catch (e) { console.warn('click failed', e); }
        setTimeout(() => {
          try { URL.revokeObjectURL(blobUrl); } catch (e) {}
          // remove anchor node to keep DOM clean
          try { a.remove(); } catch (e) {}
          // clear lock after revoke
          try { delete window[DOWNLOAD_LOCK_PROP]; } catch (e) { window[DOWNLOAD_LOCK_PROP] = false; }
          // leave sessionStorage flag for TTL window to avoid immediate duplicates
        }, 1500);
      }, 200);

      showOverlay(`✅ Selesai — ${notBack.length} akun. File ghost_list.txt diunduh.`);
      await sleep(2000);
      removeOverlay();
    } catch (e) {
      console.error('Download error', e);
      try { delete window[DOWNLOAD_LOCK_PROP]; } catch (ex) { window[DOWNLOAD_LOCK_PROP] = false; }
      // remove session flag to permit retry later
      try { sessionStorage.removeItem(DOWNLOAD_FLAG_KEY); } catch (e2) {}
      showOverlay('❌ Gagal mengunduh file.');
      await sleep(1400);
      removeOverlay();
    }
  }
}

// cleanup session
sessionStorage.removeItem(SESSION_KEY);
return;

    }

    // If session says done and we're at origin profile, show result
    if (s.step === 'done' && location.pathname.startsWith(`/${username}`)) {
      const last = JSON.parse(localStorage.getItem(`${USER_KEY_PREFIX}${username}_last_non`) || 'null') || [];
      removeOverlay();
      // if none — show message but don't download
      if (!last.length) {
        showOverlay('✅ Selesai — tidak ditemukan akun yang tidak followback. (Tidak ada file dibuat)');
        await sleep(1400);
        removeOverlay();
      } else {
        // ---------- PROFILE-PAGE DOWNLOAD (guarded) ----------
        // same download-guard logic as above
        const flagRaw = sessionStorage.getItem(DOWNLOAD_FLAG_KEY);
        if (flagRaw) {
          try {
            const parsed = JSON.parse(flagRaw);
            const age = Date.now() - (parsed.ts || 0);
            if (age < DOWNLOAD_FLAG_TTL) {
              showOverlay('🔁 Download already triggered recently — skipping duplicate.');
              await sleep(800);
              removeOverlay();
              sessionStorage.removeItem(SESSION_KEY);
              return;
            }
          } catch (e) {}
        }

        if (window[DOWNLOAD_LOCK_PROP]) {
          showOverlay('🔁 Download already in progress, skipping duplicate.');
          await sleep(800);
          removeOverlay();
        } else {
          try {
            // set locks early
            window[DOWNLOAD_LOCK_PROP] = true;
            sessionStorage.setItem(DOWNLOAD_FLAG_KEY, JSON.stringify({ ts: Date.now() }));

            let text = 'Daftar akun tidak follback kamu:\n\n';
            last.forEach(u => text += `${u}\n`);
            const linkId = 'ig-ghost-download-link-v1';
            let a = document.getElementById(linkId);
            if (!a) {
              a = document.createElement('a');
              a.id = linkId;
              a.style.display = 'none';
              document.body.appendChild(a);
            }
            const blob = new Blob([text], { type: 'text/plain' });
            const blobUrl = URL.createObjectURL(blob);
            a.href = blobUrl;
            a.download = 'ghost_list.txt';
            setTimeout(() => {
              try { a.click(); } catch (e) {}
              setTimeout(() => {
                try { URL.revokeObjectURL(blobUrl); } catch (e) {}
                try { a.remove(); } catch (e) {}
                try { delete window[DOWNLOAD_LOCK_PROP]; } catch (e) { window[DOWNLOAD_LOCK_PROP] = false; }
                // keep sessionStorage flag for TTL to avoid immediate duplicates
              }, 1500);
            }, 200);
            showOverlay(`✅ Selesai — ${last.length} akun. File ghost_list.txt diunduh.`);
            await sleep(1800);
            removeOverlay();
          } catch (e) {
            console.error('Download error', e);
            try { delete window[DOWNLOAD_LOCK_PROP]; } catch (ex) { window[DOWNLOAD_LOCK_PROP] = false; }
            try { sessionStorage.removeItem(DOWNLOAD_FLAG_KEY); } catch (er) {}
            showOverlay('❌ Gagal mengunduh file.');
            await sleep(1400);
            removeOverlay();
          }
        }
      }
      localStorage.removeItem(`${USER_KEY_PREFIX}${username}_last_non`);
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  /* ---------- UI injection & boot ---------- */
  function injectButton() {
    if (document.getElementById(BTN_ID)) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.innerText = '👻 Ghost List';
    Object.assign(btn.style, {
      position: 'fixed', right: '22px', bottom: '22px', zIndex: 2147483647,
      background: '#ef4444', color: '#fff', border: 'none', padding: '10px 14px',
      borderRadius: '10px', cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
    });
    btn.addEventListener('click', () => startFullScan({ force: true }));
    document.body.appendChild(btn);
  }

  async function startFullScan(opts = {}) {
    // basic checks
    const username = getProfileUsernameFromPath();
    if (!username) {
      alert('Buka profil Instagram-mu (https://www.instagram.com/USERNAME/) lalu klik tombol Ghost List.');
      return;
    }
    // start session and navigate to following page — resumeIfScanning handles rest
    showOverlay('🔄 Memulai scan — membuka following...');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username, step: 'start', origin: location.href, ts: Date.now() }));
    location.href = `https://www.instagram.com/${username}/following/`;
  }

  // bootstrap
  const mo = new MutationObserver(() => injectButton());
  mo.observe(document.documentElement, { childList: true, subtree: true });
  injectButton();
    // if a scan is in progress, resume
  setTimeout(() => resumeIfScanning(), 800);

  // try resume periodically until done
  window.__igGhostInterval = setInterval(() => {
    const stillScanning = sessionStorage.getItem(SESSION_KEY);
    if (stillScanning) {
      resumeIfScanning();
    } else {
      clearInterval(window.__igGhostInterval);
      delete window.__igGhostInterval;
      // tunggu sedikit biar overlay terakhir sempat tampil
      setTimeout(() => removeOverlay(), 2000);
    }
  }, 1200);

})();

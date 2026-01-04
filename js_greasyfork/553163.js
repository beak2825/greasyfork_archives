// ==UserScript==
// @name         CB Image Hash Guard (dHash, includes mod/broadcaster; safe-silence)
// @namespace    aravvn.tools
// @version      2.0.3
// @description  Perceptual hash (dHash) vs. your uploaded references. On match: auto-silence if you’re privileged AND target is not mod/broadcaster; else highlight (now reliably visible). Prevents double analysis via message flag + early URL mark. Upload refs via TM menu.
// @match        https://*.chaturbate.com/*
// @match        https://*.testbed.cb.dev/*
// @run-at       document-idle
// @noframes
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/553163/CB%20Image%20Hash%20Guard%20%28dHash%2C%20includes%20modbroadcaster%3B%20safe-silence%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553163/CB%20Image%20Hash%20Guard%20%28dHash%2C%20includes%20modbroadcaster%3B%20safe-silence%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const DEFAULT_THRESHOLD = 10;   // Hamming distance 0..64
  const COOLDOWN_MS = 15_000;     // global URL cooldown

  const KEY_REFS = 'img_hash_guard_refs';
  const KEY_THR  = 'img_hash_guard_threshold';
  if (GM_getValue(KEY_REFS) == null) GM_setValue(KEY_REFS, []);
  if (GM_getValue(KEY_THR) == null) GM_setValue(KEY_THR, DEFAULT_THRESHOLD);
  const getRefs = () => GM_getValue(KEY_REFS, []);
  const setRefs = (arr) => GM_setValue(KEY_REFS, Array.isArray(arr) ? arr : []);
  const getThr  = () => Number(GM_getValue(KEY_THR, DEFAULT_THRESHOLD)) || DEFAULT_THRESHOLD;
  const setThr  = (n) => GM_setValue(KEY_THR, Math.max(0, Math.min(64, Number(n) || DEFAULT_THRESHOLD)));

  const SEL = {
    rootMessage: 'div[data-testid="chat-message"]',
    usernameContainer: 'div[data-testid="chat-message-username"]',
    username: 'span[data-testid="username"]',
    viewerUsername: '.user_information_header_username, [data-testid="user-information-username"]',
    msgImages: 'img[data-testid="emoticonImg"], img.emoticonImage, picture img',
    msgVideos: 'video',
    msgVideoSources: 'video source',
    // the inner "bubble" wrapper often carries inline gradient/background:
    bubble: '[dm-adjust-bg]'
  };

  // Strong, overlay-style highlight that works even when inline background is set
  const style = document.createElement('style');
  style.textContent = `
    /* When the root message is flagged */
    .imghashguard-flagged {
      position: relative;
      border-left: 4px solid #ff3c3c !important;
      box-shadow: inset 0 0 0 9999px rgba(255,60,60,0.12) !important;
    }
    /* When the inner bubble is flagged */
    [dm-adjust-bg].imghashguard-flagged {
      position: relative;
      border-left: 4px solid #ff3c3c !important;
      box-shadow: inset 0 0 0 9999px rgba(255,60,60,0.12) !important;
    }
  `;
  document.head.appendChild(style);

  const stripTs = (s) => String(s || '').replace(/^[\[]\d{2}:\d{2}[]]\s*/, '').trim();
  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }
  function getRoomFromURL() {
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (!parts[0]) return '';
    if (parts[0] === 'b') return parts[1] || '';
    if (['p','tags','api','auth','proxy'].includes(parts[0])) return '';
    return parts[0];
  }
  function isBroadcasterView() {
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    return parts[0] === 'b' && !!parts[1];
  }
  function waitForSelector(selector, timeout = 5000) {
    return new Promise((resolve) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
    });
  }
  async function fetchIsPrivileged(viewer, room) {
    const url = `${location.origin}/api/ts/chatmessages/user_info/${encodeURIComponent(viewer)}/?room=${encodeURIComponent(room)}`;
    try {
      const res = await fetch(url, { credentials: 'include', headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      return !!(data?.user?.is_mod || data?.user?.is_broadcaster);
    } catch { return false; }
  }
  async function postSilence(username) {
    const room = currentRoom || getRoomFromURL();
    if (!room) return false;
    const url = `${location.origin}/roomsilence/${encodeURIComponent(username)}/${encodeURIComponent(room)}/`;
    const csrf = getCookie('csrftoken') || getCookie('CSRF-TOKEN') || getCookie('XSRF-TOKEN');
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...(csrf ? { 'X-CSRFToken': csrf, 'X-CSRF-Token': csrf } : {}),
      'Referer': `${location.origin}/${encodeURIComponent(room)}/`
    };
    const body = 'source=chat';
    const res = await fetch(url, { method: 'POST', credentials: 'include', headers, body, redirect: 'manual' });
    return res.ok;
  }
  function extractUsernameFromText(text) {
    const t = String(text || '').trim();
    const m = t.match(/([A-Za-z0-9_]+)\s*$/);
    if (m) return m[1];
    const cleaned = t.replace(/^\s*(\[[^\]]*?\]\s*)+/g, '').trim();
    const parts = cleaned.split(/\s+/);
    return parts[parts.length - 1] || '';
  }
  function getUsernameFromRoot(root) {
    const span = root.querySelector(SEL.username);
    if (span && span.textContent) return extractUsernameFromText(stripTs(span.textContent));
    const cont = root.querySelector(SEL.usernameContainer);
    return extractUsernameFromText(cont?.textContent || '');
  }

  // Choose the best visual target to apply the highlight class
  function getHighlightTarget(root) {
    return root.querySelector(SEL.bubble) || root; // prefer inner bubble, else whole message
  }
  function highlightMessage(root) {
    const el = getHighlightTarget(root);
    if (!el) return;
    el.classList.add('imghashguard-flagged');
    root.setAttribute('data-imghashguard-flagged', '1');
  }

  function gmFetchArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve({ buf: res.response, contentType: res.responseHeaders?.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || '' });
          else reject(new Error(`HTTP ${res.status}`));
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout')),
      });
    });
  }
  function guessMime(url, hdrCt) {
    const u = (url || '').toLowerCase();
    if (hdrCt) return hdrCt.split(';')[0].trim();
    if (u.includes('.webp')) return 'image/webp';
    if (u.includes('.gif'))  return 'image/gif';
    if (u.includes('.png'))  return 'image/png';
    if (u.includes('.jpg') || u.includes('.jpeg')) return 'image/jpeg';
    return 'image/*';
  }

  // dHash 8x8 (64-bit)
  async function computeDHashFromBlob(blob, size = 8) {
    const bitmap = await createImageBitmap(blob);
    const w = size + 1, h = size;
    const cnv = ('OffscreenCanvas' in window) ? new OffscreenCanvas(w, h) : document.createElement('canvas');
    cnv.width = w; cnv.height = h;
    const ctx = cnv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bitmap, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h).data;

    const gray = new Array(w * h);
    for (let i = 0, p = 0; i < img.length; i += 4, p++) {
      const r = img[i], g = img[i+1], b = img[i+2];
      gray[p] = (0.299 * r + 0.587 * g + 0.114 * b) | 0;
    }

    let bits = 0n;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < size; x++) {
        const left  = gray[y * w + x];
        const right = gray[y * w + (x + 1)];
        const bit = left > right ? 1n : 0n;
        bits = (bits << 1n) | bit;
      }
    }
    let hex = bits.toString(16);
    return hex.padStart(16, '0');
  }

  function hammingHex(aHex, bHex) {
    const a = BigInt('0x' + aHex);
    const b = BigInt('0x' + bHex);
    let x = a ^ b;
    let cnt = 0;
    while (x) { cnt += Number(x & 1n); x >>= 1n; }
    return cnt;
  }

  // Reference management (menu)
  function addReferencesViaFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', async () => {
      const files = Array.from(input.files || []);
      if (!files.length) { input.remove(); return; }
      const refs = getRefs();
      for (const f of files) {
        try {
          const buf = await f.arrayBuffer();
          const blob = new Blob([buf], { type: f.type || 'image/*' });
          const hashHex = await computeDHashFromBlob(blob, 8);
          const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
          refs.push({ id, name: f.name, mime: f.type, size: f.size, hashHex });
          console.log(`[IMG-HASH-GUARD] Added reference "${f.name}" → ${hashHex}`);
        } catch (e) {
          console.warn('[IMG-HASH-GUARD] Failed to hash', f.name, e);
        }
      }
      setRefs(refs);
      input.remove();
      console.log(`[IMG-HASH-GUARD] Total references: ${refs.length}`);
    }, { once: true });
    input.click();
  }
  GM_registerMenuCommand('Add reference images…', addReferencesViaFilePicker);
  GM_registerMenuCommand(`Set match threshold (now: ${getThr()})`, () => {
    const cur = getThr();
    const v = prompt('Hamming distance threshold (0..64): lower is stricter', String(cur));
    if (v == null) return;
    const n = Math.max(0, Math.min(64, Number(v) || cur));
    setThr(n);
    console.log(`[IMG-HASH-GUARD] Threshold set to ${n}`);
  });
  GM_registerMenuCommand('List references in console', () => {
    const refs = getRefs();
    if (!refs.length) { console.log('[IMG-HASH-GUARD] No references stored.'); return; }
    console.table(refs.map(r => ({ id: r.id, name: r.name, mime: r.mime, size: r.size, hash: r.hashHex })));
  });
  GM_registerMenuCommand('Clear all references', () => {
    if (confirm('Remove all stored reference hashes?')) {
      setRefs([]);
      console.log('[IMG-HASH-GUARD] References cleared.');
    }
  });

  // Cooldown maps
  const processedGlobal = new Map(); // url -> ts
  const isCooldownGlobal = (src) => processedGlobal.has(src) && (Date.now() - processedGlobal.get(src)) < COOLDOWN_MS;
  const markGlobal = (src) => processedGlobal.set(src, Date.now());

  // Per-message URL memory to avoid re-queuing the same URL for the same message
  const msgUrlSeen = new WeakMap(); // Element -> Set<string>
  function msgHasSeen(root, url) {
    const set = msgUrlSeen.get(root);
    return !!(set && set.has(url));
  }
  function msgMarkSeen(root, url) {
    let set = msgUrlSeen.get(root);
    if (!set) { set = new Set(); msgUrlSeen.set(root, set); }
    set.add(url);
  }

  function collectImages(root) {
    const urls = new Set();
    root.querySelectorAll(SEL.msgImages).forEach(i => i.src && urls.add(i.src));
    root.querySelectorAll(SEL.msgVideos).forEach(v => v.poster && urls.add(v.poster));
    root.querySelectorAll(SEL.msgVideoSources).forEach(s => s.src && urls.add(s.src));
    return [...urls];
  }

  async function hashUrlToHex(url) {
    const { buf, contentType } = await gmFetchArrayBuffer(url);
    const mime = guessMime(url, contentType);
    const blob = new Blob([buf], { type: mime || 'image/*' });
    return await computeDHashFromBlob(blob, 8);
  }

  async function analyzeAndAct(root, url) {
    try {
      const refs = getRefs();
      if (!refs.length) return;
      if (!/^https?:\/\//i.test(url)) return;

      // EARLY URL MARKING to avoid races
      if (isCooldownGlobal(url)) return;
      markGlobal(url);
      if (msgHasSeen(root, url)) return;
      msgMarkSeen(root, url);

      const username = getUsernameFromRoot(root);
      if (!username) return;

      const nameWrap = root.querySelector(SEL.usernameContainer);
      if (!nameWrap) return;

      const isTargetModOrBroadcaster = nameWrap.classList.contains('mod') || nameWrap.classList.contains('broadcaster');

      const myHash = await hashUrlToHex(url);

      // Best match among references
      let best = { ref: null, dist: Infinity };
      for (const r of refs) {
        const d = hammingHex(myHash, r.hashHex);
        if (d < best.dist) best = { ref: r, dist: d };
      }

      const thr = getThr();
      console.log(`[IMG-HASH-GUARD] @${username} image ${myHash} → bestDist=${best.dist} (thr=${thr}) ${best.ref ? `vs ${best.ref.name}` : ''}`);

      if (best.dist <= thr) {
        if (isPrivileged && !isTargetModOrBroadcaster) {
          const ok = await postSilence(username);
          console.log(ok
            ? `[IMG-HASH-GUARD] 🤫 Silenced @${username} (hash match ≤ ${thr})`
            : `[IMG-HASH-GUARD] ⚠️ Silence failed @${username}`);
          root.setAttribute('data-imghashguard-silenced', ok ? '1' : '0');
        } else {
          console.log(`[IMG-HASH-GUARD] MATCH → highlight @${username}${isTargetModOrBroadcaster ? ' (target is mod/broadcaster)' : isPrivileged ? '' : ' (not privileged)'} `);
          highlightMessage(root);
        }
      }
    } catch (e) {
      console.warn('[IMG-HASH-GUARD] analyze error', e);
    }
  }

  function handleMsg(root) {
    if (!(root instanceof HTMLElement)) return;

    // MESSAGE-LEVEL FLAG: prevent re-scans on later DOM mutations
    if (root.getAttribute('data-imghashguard-scanned') === '1') return;

    const urls = collectImages(root);
    if (!urls.length) { root.setAttribute('data-imghashguard-scanned', '1'); return; }

    // queue each URL once per message
    urls.forEach(url => analyzeAndAct(root, url));

    // Mark message as scanned so later subtree mutations won’t trigger re-analysis
    root.setAttribute('data-imghashguard-scanned', '1');
  }

  const obs = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
    if (!(n instanceof HTMLElement)) return;
    if (n.matches?.(SEL.rootMessage)) handleMsg(n);
    else n.querySelectorAll?.(SEL.rootMessage).forEach(handleMsg);
  })));

  // Boot
  let currentRoom = '', isPrivileged = false;

  async function start(room) {
    obs.disconnect();
    const viewerEl = await waitForSelector(SEL.viewerUsername, 5000);
    const viewer = viewerEl?.textContent?.trim() || '';
    const viewerNameLc = viewer.toLowerCase();
    isPrivileged = isBroadcasterView() || await fetchIsPrivileged(viewer, room);
    console.log('[IMG-HASH-GUARD] Start', { room, viewer: viewerNameLc, isPrivileged, refs: getRefs().length, thr: getThr() });

    document.querySelectorAll(SEL.rootMessage).forEach(handleMsg);
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function handleEnter() {
    const room = getRoomFromURL();
    if (room && room !== currentRoom) {
      currentRoom = room;
      start(room);
    }
  }

  (() => {
    const _ps = history.pushState, _rs = history.replaceState;
    history.pushState = function (...a) { const r = _ps.apply(this, a); window.dispatchEvent(new Event('locationchange')); return r; };
    history.replaceState = function (...a) { const r = _rs.apply(this, a); window.dispatchEvent(new Event('locationchange')); return r; };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', handleEnter);
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', handleEnter, { once: true });
  else handleEnter();

})();
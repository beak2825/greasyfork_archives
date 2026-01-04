// ==UserScript==
// @name         YT Studio Draft Auto-Register (UI filename, wait + SPA, resend, calm logs)
// @namespace    yt-draft-autoreg
// @version      2.5
// @description  Надсилає videoId + fileName у Apps Script Web App; очікує появу filename (shadow+iframe aware), підтримує udvid/v та SPA, має форс-досилку і приглушує логи.
// @match        https://studio.youtube.com/*
// @run-at       document-start
// @inject-into  page
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551434/YT%20Studio%20Draft%20Auto-Register%20%28UI%20filename%2C%20wait%20%2B%20SPA%2C%20resend%2C%20calm%20logs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551434/YT%20Studio%20Draft%20Auto-Register%20%28UI%20filename%2C%20wait%20%2B%20SPA%2C%20resend%2C%20calm%20logs%29.meta.js
// ==/UserScript==

(function () {
  // ---------- CONFIG ----------
  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxVO3fBsQ9VynxCjSTQBqjRJzqEIUCrW2_w_FjHITggYHtsB22wcnuF1bTrLcNsL0VT/exec';
  const DEBUG        = false;          // true — вмикає консольні логи
  const SEND_TITLE   = false;          // true — надсилати ще й title (див. extractTitleFromDom)
  const WAIT_FN_MS   = 20000;          // макс очікування filename
  const RESEND_WAIT  = 10000;          // додочікування для досилки з fileName
  const MUTATION_DEBOUNCE_MS = 600;    // дебаунс мутацій
  const SEND_COOLDOWN_MS     = 1500;   // кулдаун між реальними відправками

  // ---------- LOG / HUD / TOAST ----------
  const dlog = (...args) => { if (DEBUG) console.log('[DraftReg]', ...args); };

  const hud = document.createElement('div');
  Object.assign(hud.style, {
    position:'fixed', right:'10px', bottom:'10px', zIndex: 999999,
    background:'rgba(0,0,0,.6)', color:'#fff', padding:'6px 10px',
    borderRadius:'8px', fontSize:'12px', fontFamily:'monospace'
  });
  hud.textContent = '[DraftReg] init…';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(hud));
  const setHud = t => { hud.textContent = t; };
  const toast = msg => { try {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position:'fixed', left:'50%', top:'20px', transform:'translateX(-50%)',
      padding:'8px 12px', background:'#222', color:'#fff',
      borderRadius:'6px', zIndex:999999, boxShadow:'0 2px 8px rgba(0,0,0,.3)'
    });
    document.body.appendChild(el); setTimeout(()=>el.remove(), 2000);
  } catch{} };

  // ---------- URL → videoId ----------
  function getVideoIdFromUrl(href) {
    let m = href.match(/\/video\/([A-Za-z0-9_-]{5,})(?:\/(?:edit|metadata|details|analytics))?/);
    if (m) return m[1];
    try {
      const u = new URL(href, location.origin);
      const v = u.searchParams.get('v');
      if (v && /^[A-Za-z0-9_-]{5,}$/.test(v)) return v;
      const ud = u.searchParams.get('udvid');
      if (ud && /^[A-Za-z0-9_-]{5,}$/.test(ud)) return ud;
    } catch {}
    return null;
  }

  // ---------- Shadow + iframe aware пошук вузла за id ----------
  function findByIdDeep(targetId, root = document) {
    try { if (root.getElementById) { const direct = root.getElementById(targetId); if (direct) return direct; } } catch {}
    try {
      const walker = root.createTreeWalker
        ? root.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null)
        : document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
      while (walker.nextNode()) {
        const el = walker.currentNode;
        if (el.id === targetId) return el;
        if (el.shadowRoot) {
          const inside = findByIdDeep(targetId, el.shadowRoot);
          if (inside) return inside;
        }
      }
    } catch {}
    try {
      const frames = (root.querySelectorAll ? root.querySelectorAll('iframe') : document.querySelectorAll('iframe'));
      for (const fr of frames) {
        try {
          const doc = fr.contentDocument || (fr.contentWindow && fr.contentWindow.document);
          if (!doc) continue;
          const hit = findByIdDeep(targetId, doc);
          if (hit) return hit;
        } catch { /* cross-origin */ }
      }
    } catch {}
    return null;
  }

  // ---------- Filename / Title ----------
  function extractFileNameFromDom() {
    const node = findByIdDeep('original-filename'); // строго цей вузол
    if (!node) {
      dlog('#original-filename not found (yet)');
      return null;
    }
    let txt = (node.textContent || node.innerText || '');
    txt = txt
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width
      .replace(/\u00A0/g, ' ')               // NBSP → space
      .replace(/\s+/g, ' ')                  // злиплі пробіли → один
      .trim();
    const m = txt.match(/(.+\.(mp4|mov|mkv|webm|avi|m4v))$/i);
    const file = m ? m[1] : (txt.includes('.') ? txt : null);
    dlog('filename text:', { raw: txt, picked: file });
    return file;
  }

  function extractTitleFromDom() {
    if (!SEND_TITLE) return '';
    try {
      const el =
        document.querySelector('ytcp-mention-textbox #textbox') ||
        document.querySelector('ytcp-textbox#title-text #textbox') ||
        document.querySelector('#textbox');
      let t = el && (el.value || el.textContent || '');
      t = String(t).replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      t = t.replace(/^\|\s*/, ''); // прибрати можливий префікс "| "
      return t;
    } catch { return ''; }
  }

  async function waitForFileName(maxMs = WAIT_FN_MS) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const fn = extractFileNameFromDom();
      if (fn) return fn;
      await new Promise(r => setTimeout(r, 250));
    }
    return null;
  }

  // ---------- Антидублі + антиспам ----------
  function wasSent(id)         { return !!localStorage.getItem('yt_draft_registered_' + id); }
  function wasSentWithFile(id) { return !!localStorage.getItem('yt_draft_registered_' + id + '_withfile'); }
  function markSent(id, withFile) {
    localStorage.setItem('yt_draft_registered_' + id, String(Date.now()));
    if (withFile) localStorage.setItem('yt_draft_registered_' + id + '_withfile', String(Date.now()));
  }
  function clearDraftMarks() {
    const pref = 'yt_draft_registered_';
    const ks = Object.keys(localStorage).filter(k => k.startsWith(pref));
    ks.forEach(k => localStorage.removeItem(k));
    toast(`Cleared ${ks.length} draft marks`);
  }

  let lastHref = '';
  let lastVid = '';
  let inFlight = false;
  let lastSendTs = 0;

  // ---------- Відправка ----------
  function sendPayload(videoId, fileName, title, force=false) {
    if (!WEBAPP_URL || /PASTE_YOUR_EXEC/.test(WEBAPP_URL)) {
      setHud('[DraftReg] ❗ Встав актуальний /exec URL'); return;
    }

    const now = Date.now();
    if (!force && now - lastSendTs < SEND_COOLDOWN_MS) {
      dlog('cooldown, skip send', { videoId });
      return;
    }

    const hasFile  = !!fileName;
    const basicSent = wasSent(videoId);
    const fileSent  = wasSentWithFile(videoId);

    if (!force) {
      if (hasFile && fileSent)  { setHud(`[DraftReg] id=${videoId} (file already sent)`); return; }
      if (!hasFile && basicSent){ setHud(`[DraftReg] id=${videoId} (already sent)`); return; }
    }

    dlog('sending:', { videoId, fileName, title, force });
    const payload = JSON.stringify({
      videoId,
      fileName: fileName || '',
      title: title || '',
      note: force ? 'force-ui' : (hasFile ? 'ui-with-file' : 'ui-auto')
    });

    let sent = false;
    if (navigator.sendBeacon) {
      try {
        const ok = navigator.sendBeacon(
          WEBAPP_URL,
          new Blob([payload], { type:'text/plain;charset=UTF-8' })
        );
        if (ok) sent = true;
      } catch {}
    }
    if (!sent) { try { fetch(WEBAPP_URL, { method:'POST', mode:'no-cors', body: payload }); } catch {} }

    lastSendTs = now;
    markSent(videoId, hasFile);
    toast(`ID збережено: ${videoId}${hasFile?` | ${fileName}`:''}`);
    setHud(`[DraftReg] sent id=${videoId}${hasFile?` | file=${fileName}`:''}${force?' (force)':''}`);
  }

  // ---------- Основний потік ----------
  async function processCurrent(force=false) {
    const href = location.pathname + location.search;
    if (href === lastHref && !force) return;
    if (inFlight) return;
    inFlight = true;
    lastHref = href;

    const id = getVideoIdFromUrl(href);
    if (!id) { inFlight = false; return; }
    if (id === lastVid && !force) { inFlight = false; return; }
    lastVid = id;

    setHud(`[DraftReg] href=${href} | id=${id}`);
    setHud(`[DraftReg] id=${id} | waiting filename…`);

    let fn = await waitForFileName(WAIT_FN_MS);
    const title = extractTitleFromDom();

    if (fn) {
      sendPayload(id, fn, title, force);
      inFlight = false;
      return;
    }

    // 1-й пакет мінімальний
    sendPayload(id, '', title, force);

    // Дочекатись файлу і дослати
    const started = Date.now();
    while (Date.now() - started < RESEND_WAIT && !wasSentWithFile(id)) {
      fn = await waitForFileName(1000);
      if (fn) {
        sendPayload(id, fn, title, true); // форс, щоб обійти "already sent"
        break;
      }
    }

    inFlight = false;
  }

  // ---------- SPA + мутації + хоткеї ----------
  const origPush = history.pushState, origReplace = history.replaceState;
  history.pushState = function(){ const r = origPush.apply(this, arguments); setTimeout(()=>void processCurrent(false), 80); return r; };
  history.replaceState = function(){ const r = origReplace.apply(this, arguments); setTimeout(()=>void processCurrent(false), 80); return r; };
  window.addEventListener('popstate', () => setTimeout(()=>void processCurrent(false), 80));

  new MutationObserver(() => {
    clearTimeout(window.__drT);
    window.__drT = setTimeout(()=>void processCurrent(false), MUTATION_DEBOUNCE_MS);
  }).observe(document.documentElement, { childList:true, subtree:true });

  // Shift+L — відправити; Ctrl+Shift+L — форс; Ctrl+Shift+D — очистити антидублі
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key==='L' || e.key==='л')) { void processCurrent(!!e.ctrlKey); }
    if (e.ctrlKey && e.shiftKey && (e.key==='D' || e.key==='В' || e.key==='в')) { clearDraftMarks(); }
  });

  // Перший запуск
  void processCurrent(false);
})();

// ==UserScript==
// @name         archive.today Archiver - URL Queue Manager
// @namespace    http://archive.today/
// @version      1.4.0
// @description  Automate archiving with smart queue. Export filename now dynamically detects the dominant domain (e.g. instagram, twitter) and username.
// @author       Claude (Anthropic) & Gemini
// @icon         https://archive.is/favicon.ico
// @match        https://archive.ph/*
// @match        https://archive.today/*
// @match        https://archive.is/*
// @match        https://archive.vn/*
// @match        https://archive.fo/*
// @match        https://archive.li/*
// @match        https://archive.md/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549110/archivetoday%20Archiver%20-%20URL%20Queue%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/549110/archivetoday%20Archiver%20-%20URL%20Queue%20Manager.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== CONFIG ===== */
  const ARCHIVE_DOMAINS = [
    'https://archive.ph/', 'https://archive.is/', 'https://archive.today/',
    'https://archive.vn/', 'https://archive.fo/', 'https://archive.li/', 'https://archive.md/'
  ];

  const BASE_WIP_POLL_MS = 90 * 1000;
  const MAX_BACKOFF_EXP = 6;
  const BACKOFF_JITTER_RATIO = 0.12;
  const PROCESS_DELAY = 2000;
  const MIN_REQUEST_DELAY = 2000;
  const MAX_REQUEST_DELAY = 5000;
  const CAPTCHA_CHECK_INTERVAL_MS = 2000;
  const DAILY_LIMIT = 150;
  const ENABLE_DOMAIN_ROTATION = true;

  /* ===== GM Storage Wrappers ===== */
  function gmGet(key, def) { try { const v = GM_getValue(key); return v !== undefined ? v : def; } catch (e) { return def; } }
  function gmSet(key, val) { try { GM_setValue(key, val); } catch (e) {} }
  function gmDelete(key) { try { GM_deleteValue(key); } catch (e) {} }

  /* ===== Utils / Storage ===== */
  function log(...args) { console.log('[ArchiveQueue]', ...args); }
  function dbg(...args) { console.debug('[ArchiveQueue]', ...args); }

  function getQueue() { try { return JSON.parse(gmGet('archiveQueue', '[]')); } catch (e) { return []; } }
  function saveQueue(q) { gmSet('archiveQueue', JSON.stringify(q)); updateOverlay(); }

  function getProcessed() { try { return JSON.parse(gmGet('processedUrls', '[]')); } catch (e) { return []; } }
  function saveProcessed(url) {
    const arr = getProcessed();
    if (!arr.includes(url)) {
      arr.push(url);
      gmSet('processedUrls', JSON.stringify(arr));
      updateDailyStats();
    }
    updateOverlay();
  }

  function getSkipped() { try { return JSON.parse(gmGet('skippedUrls', '[]')); } catch (e) { return []; } }
  function saveSkipped(url) {
    const arr = getSkipped();
    if (!arr.includes(url)) {
      arr.push(url);
      gmSet('skippedUrls', JSON.stringify(arr));
    }
    updateOverlay();
  }

  function getRestricted() { try { return JSON.parse(gmGet('restrictedUrls', '[]')); } catch (e) { return []; } }
  function saveRestricted(url, reason = 'unknown') {
    const arr = getRestricted();
    if (!arr.includes(url)) arr.push(url);
    gmSet('restrictedUrls', JSON.stringify(arr));
    updateOverlay();
  }

  /* ===== Session Flags ===== */
  function getSessionFlag(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }
  function setSessionFlag(key, val) { try { if (val) sessionStorage.setItem(key, val); else sessionStorage.removeItem(key); } catch (e) {} }
  function removeSessionFlag(key) { try { sessionStorage.removeItem(key); } catch (e) {} }

  /* ===== Daily Limit ===== */
  function getDailyStats() {
    try {
      const data = gmGet('aq_daily_stats', '{}');
      const stats = JSON.parse(data);
      const today = new Date().toDateString();
      if (stats.date !== today) return { date: today, processed: 0 };
      return stats;
    } catch (e) { return { date: new Date().toDateString(), processed: 0 }; }
  }
  function updateDailyStats() {
    const stats = getDailyStats();
    stats.processed++;
    gmSet('aq_daily_stats', JSON.stringify(stats));
    updateOverlay();
  }
  function checkDailyLimit() {
    const stats = getDailyStats();
    if (stats.processed >= DAILY_LIMIT) {
      if (!sessionStorage.getItem('aq_limit_alerted')) {
          alert(`Daily limit of ${DAILY_LIMIT} URLs reached.`);
          sessionStorage.setItem('aq_limit_alerted', '1');
      }
      setSessionFlag('processingPaused', '1');
      removeSessionFlag('aq_paused_for_captcha');
      updateOverlay();
      return false;
    }
    return true;
  }

  /* ===== Helpers ===== */
  function getNextDomain() {
    if (!ENABLE_DOMAIN_ROTATION) return ARCHIVE_DOMAINS[0];
    try {
      let index = parseInt(gmGet('aq_domain_index', '0'), 10);
      const domain = ARCHIVE_DOMAINS[index];
      index = (index + 1) % ARCHIVE_DOMAINS.length;
      gmSet('aq_domain_index', String(index));
      return domain;
    } catch (e) { return ARCHIVE_DOMAINS[0]; }
  }
  function humanDelay(min = MIN_REQUEST_DELAY, max = MAX_REQUEST_DELAY) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function detectCaptcha() {
    const body = (document.body?.innerText || '').toLowerCase();
    return (!!document.querySelector('iframe[src*="recaptcha"], .g-recaptcha, [data-sitekey]') || body.includes("i'm not a robot") || body.includes('captcha') || body.includes('security check'));
  }

  function clearForReplace() {
    gmDelete('archiveQueue'); gmDelete('processedUrls'); gmDelete('skippedUrls'); gmDelete('restrictedUrls');
    gmDelete('aq_last_wip_reload'); gmDelete('aq_daily_stats'); gmDelete('aq_domain_index');
    sessionStorage.clear();
  }
  function clearAll() {
    if (!confirm('Clear ALL lists (Queue, Processed, Skipped, Restricted)?')) return;
    clearForReplace();
    location.reload();
  }

  /* ===== UI ===== */
  function createOverlay() {
    if (document.getElementById('aq-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'aq-overlay';
    Object.assign(ov.style, {
      position: 'fixed', top: '18px', right: '18px', zIndex: 999999,
      background: 'rgba(255,255,255,0.97)', border: '1px solid #888',
      padding: '10px', fontFamily: 'sans-serif', fontSize: '13px',
      color: '#222', borderRadius: '8px', boxShadow: '0 4px 18px rgba(0,0,0,0.2)',
      maxWidth: '380px', maxHeight: '80vh', overflowY: 'auto'
    });
    ov.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong>archive.today Queue</strong>
        <span id="aq-close" style="cursor:pointer;font-weight:bold">×</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px">
        <button id="aq-add">Add URLs</button> <button id="aq-edit">Edit Queue</button>
        <button id="aq-resume">Resume</button> <button id="aq-pause">Pause</button>
        <button id="aq-export">Export Restricted</button> <button id="aq-clear">Clear All</button>
        <button id="aq-import-merge">Import (merge)</button> <button id="aq-import-replace">Import (replace)</button>
      </div>
      <div id="aq-input" style="display:none;margin-top:8px">
        <textarea id="aq-text" style="width:100%;height:80px" placeholder="URLs..."></textarea>
        <div style="display:flex;gap:6px;margin-top:6px"><button id="aq-save">Save</button><button id="aq-cancel">Cancel</button></div>
      </div>
      <div id="aq-edit-area" style="display:none;margin-top:8px">
        <textarea id="aq-edit-text" style="width:100%;height:120px"></textarea>
        <div style="display:flex;gap:6px;margin-top:6px"><button id="aq-update">Update</button><button id="aq-edit-cancel">Cancel</button></div>
      </div>
      <pre id="aq-status" style="white-space:pre-wrap;margin-top:8px;padding:8px;background:#f6f6f6;border-radius:6px"></pre>
      <div id="aq-message" style="font-size:12px;color:#b40010;margin-top:6px"></div>
    `;
    document.body.appendChild(ov);

    const gid = (id) => ov.querySelector('#'+id);
    gid('aq-close').onclick = () => ov.style.display = 'none';
    gid('aq-add').onclick = () => { gid('aq-input').style.display='block'; gid('aq-edit-area').style.display='none'; };
    gid('aq-edit').onclick = () => { gid('aq-edit-area').style.display='block'; gid('aq-input').style.display='none'; gid('aq-edit-text').value = getQueue().join('\n'); };
    gid('aq-resume').onclick = () => { removeSessionFlag('processingPaused'); removeSessionFlag('aq_paused_for_captcha'); updateOverlay(); processQueue(); };
    gid('aq-pause').onclick = () => { setSessionFlag('processingPaused', '1'); updateOverlay(); };
    gid('aq-export').onclick = exportRestricted;
    gid('aq-clear').onclick = clearAll;
    gid('aq-save').onclick = saveInput;
    gid('aq-cancel').onclick = () => gid('aq-input').style.display='none';
    gid('aq-update').onclick = updateQueue;
    gid('aq-edit-cancel').onclick = () => gid('aq-edit-area').style.display='none';

    const fi = document.createElement('input'); fi.type='file'; fi.id='aq-file-input'; fi.style.display='none';
    ov.appendChild(fi);
    gid('aq-import-merge').onclick = () => { fi.dataset.mode='merge'; fi.click(); };
    gid('aq-import-replace').onclick = () => { fi.dataset.mode='replace'; fi.click(); };
    fi.onchange = handleFileImport;
    updateOverlay();
  }

  function updateOverlay() {
    const q = getQueue().length;
    const p = getProcessed().length;
    const s = getSkipped().length;
    const r = getRestricted().length;
    const stats = getDailyStats();
    const st = document.getElementById('aq-status');
    if (st) {
      st.textContent = `Queue: ${q}\nProcessed: ${p} | Skipped: ${s}\nRestricted: ${r}\nToday: ${stats.processed}/${DAILY_LIMIT}\nState: ` + (getSessionFlag('aq_processing') ? 'ACTIVE' : 'IDLE');
    }
    const msg = document.getElementById('aq-message');
    if (msg) {
      const captcha = detectCaptcha();
      const paused = !!getSessionFlag('processingPaused');
      const pausedForCaptcha = !!getSessionFlag('aq_paused_for_captcha');
      let text = '';
      if (paused) {
        if (stats.processed >= DAILY_LIMIT) text = `PAUSED - Daily limit reached.`;
        else if (captcha || pausedForCaptcha) text = 'PAUSED - CAPTCHA detected. Auto-resuming...';
        else text = 'PAUSED by user';
      }
      msg.textContent = text;
    }
  }

  function saveInput() { const l=(document.getElementById('aq-text').value||'').split('\n').map(s=>s.trim()).filter(Boolean); if(l.length){saveQueue(getQueue().concat(l)); document.getElementById('aq-input').style.display='none'; updateOverlay(); setTimeout(processQueue, 250);} }
  function updateQueue() { const l=(document.getElementById('aq-edit-text').value||'').split('\n').map(s=>s.trim()).filter(Boolean); saveQueue(l); document.getElementById('aq-edit-area').style.display='none'; updateOverlay(); setTimeout(processQueue, 250); }

  // --- Dynamic Export Logic ---
  function findMostCommonUsername(urls) {
    const counts = {};
    const regex = /instagram\.com\/([^/]+)\/p\//;
    for (const url of urls) {
      const match = url.match(regex);
      if (match && match[1]) {
        const username = match[1];
        counts[username] = (counts[username] || 0) + 1;
      }
    }
    const keys = Object.keys(counts);
    if (!keys.length) return '';
    return keys.reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  function findMostCommonDomain(urls) {
    const counts = {};
    for (const url of urls) {
        try {
            const hostname = new URL(url).hostname.toLowerCase();
            const parts = hostname.split('.');
            let name = parts.length > 1 ? parts[parts.length - 2] : hostname;
            if (name === 'www') name = parts.length > 2 ? parts[parts.length - 3] : 'unknown';

            counts[name] = (counts[name] || 0) + 1;
        } catch(e) {}
    }
    const keys = Object.keys(counts);
    if (!keys.length) return 'domain';
    return keys.reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  function exportRestricted() {
      const arr = getRestricted();
      if(!arr.length) return alert('No restricted URLs.');

      const username = findMostCommonUsername(arr);
      const domain = findMostCommonDomain(arr);
      const date = new Date().toISOString().slice(0, 10);

      let filename = '';
      if (username) {
          filename = `${username}_${domain}-restricted-urls_${date}.txt`;
      } else {
          filename = `${domain}-restricted-urls_${date}.txt`;
      }

      const blob = new Blob([arr.join('\n')], {type:'text/plain'});
      const a = document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=filename;
      a.click();
      URL.revokeObjectURL(a.href);
  }

  function handleFileImport(evt) {
      const f=evt.target.files[0]; if(!f)return; const mode=evt.target.dataset.mode;
      const r=new FileReader(); r.onload=e=>{
          const l=e.target.result.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
          if(!l.length)return alert('Empty file');
          if(mode==='replace' && !confirm('Replace queue?')) return;
          if(mode==='replace') clearForReplace();
          saveQueue(mode==='replace'?l:getQueue().concat(l));
          evt.target.value=''; setTimeout(processQueue,250);
      }; r.readAsText(f);
  }

  /* ===== Logic ===== */
  function startProgressMonitor() {
    let lastStats = { p: getProcessed().length, s: getSkipped().length, r: getRestricted().length };
    setInterval(() => {
        if (!getSessionFlag('aq_paused_for_captcha')) return;
        const cur = { p: getProcessed().length, s: getSkipped().length, r: getRestricted().length };
        if (cur.p !== lastStats.p || cur.s !== lastStats.s || cur.r !== lastStats.r) {
            log('Watchdog: Progress detected. Resuming.');
            lastStats = cur;
            removeSessionFlag('processingPaused'); removeSessionFlag('aq_paused_for_captcha'); updateOverlay(); processQueue();
            return;
        }
        if (location.pathname.startsWith('/wip/') || document.getElementById('SHARE_LONGLINK') || document.querySelector('.THUMBS-BLOCK')) {
            if (!detectCaptcha()) {
                removeSessionFlag('processingPaused'); removeSessionFlag('aq_paused_for_captcha'); updateOverlay(); processQueue();
            }
        }
    }, CAPTCHA_CHECK_INTERVAL_MS);
  }

  function processQueue() {
    if (getSessionFlag('processingPaused')) { updateOverlay(); return; }
    if (!checkDailyLimit()) return;
    if (getSessionFlag('aq_processing')) return;

    const q = getQueue();
    if (!q.length) { setSessionFlag('aq_processing', ''); updateOverlay(); return; }

    const next = q[0];
    const p = getProcessed();
    const s = getSkipped();
    const r = getRestricted();

    if (p.includes(next) || r.includes(next) || s.includes(next)) {
      log('Already handled:', next);
      q.shift(); saveQueue(q);
      setTimeout(processQueue, PROCESS_DELAY);
      return;
    }

    setSessionFlag('aq_processing', '1');
    setSessionFlag('forceSaveUrl', next);
    updateOverlay();

    const nav = getNextDomain() + next;
    setTimeout(() => { window.location.href = nav; }, humanDelay());
  }

  function handlePreCheckPage() {
    const q = getQueue();
    if(!q.length){removeSessionFlag('aq_processing');return;}

    let archiveLink = document.querySelector('a[href^="/?url="]');
    if (!archiveLink) {
        archiveLink = Array.from(document.querySelectorAll('a')).find(e =>
            e.textContent.toLowerCase().includes('archive this url')
        );
    }

    if (archiveLink) {
        log('Pre-check: Found "archive this url" link. Clicking...');
        setSessionFlag('forceSaveUrl', q[0]);
        try { archiveLink.click(); } catch (e) { window.location.href = archiveLink.href || getNextDomain(); }
        return;
    }

    if (document.getElementById('row0')) {
        log('Pre-check: History list (#row0) detected. Handing off to Final handler.');
        handleFinalPage();
        return;
    }

    const txt = document.body.innerText.toLowerCase();
    if(txt.includes('redirected')) { handleFinalPage(); return; }

    setTimeout(processQueue, 3000);
  }

  function handleFinalPage() {
    const q = getQueue();
    if (!q.length) { removeSessionFlag('aq_processing'); return; }
    const current = q[0];
    const body = (document.body.innerText || '').toLowerCase();

    const historyRow = document.getElementById('row0');
    if (historyRow) {
        const titleLink = historyRow.querySelector('.TEXT-BLOCK a');
        const titleText = (titleLink ? titleLink.innerText : '').trim().toLowerCase();

        const redirectLink = historyRow.querySelector('ul > li > a');
        const redirectUrl = (redirectLink ? redirectLink.textContent : '').trim();

        log('History row. Title:', titleText, 'Redirect:', redirectUrl);

        const failKeys = ["post isn't available", "page not found", "login • instagram", "not available"];
        const isGenericRedirect = redirectUrl.includes('instagram.com/p/');

        if (failKeys.some(k => titleText.includes(k)) || isGenericRedirect) {
            log('-> Restricted');
            saveRestricted(current, 'history-fail');
        } else {
            log('-> Skipped');
            saveSkipped(current);
        }

        q.shift(); saveQueue(q);
        removeSessionFlag('forceSaveUrl'); removeSessionFlag('aq_processing');
        setTimeout(processQueue, PROCESS_DELAY);
        return;
    }

    const already = document.querySelector('#DIVALREADY, #DIVALREADY2, div[role="dialog"]');
    if (already && (already.innerText || '').toLowerCase().includes('this page was last archived')) {
        saveSkipped(current);
        q.shift(); saveQueue(q);
        removeSessionFlag('forceSaveUrl'); removeSessionFlag('aq_processing');
        setTimeout(processQueue, PROCESS_DELAY);
        return;
    }

    if (document.getElementById('SHARE_LONGLINK') || document.querySelector('.THUMBS-BLOCK')) {
        saveProcessed(current);
        q.shift(); saveQueue(q);
        removeSessionFlag('forceSaveUrl'); removeSessionFlag('aq_processing');
        setTimeout(processQueue, PROCESS_DELAY);
        return;
    }

    if (body.includes('restricted photo') || body.includes('post isn\'t available') || body.includes('profile may have been removed')) {
        saveRestricted(current, 'restricted-content');
        q.shift(); saveQueue(q);
        removeSessionFlag('forceSaveUrl'); removeSessionFlag('aq_processing');
        setTimeout(processQueue, PROCESS_DELAY);
        return;
    }

    if (body.includes('redirected to')) {
        saveRestricted(current, 'redirected');
        q.shift(); saveQueue(q);
        removeSessionFlag('forceSaveUrl'); removeSessionFlag('aq_processing');
        setTimeout(processQueue, PROCESS_DELAY);
        return;
    }

    const btn = Array.from(document.querySelectorAll('input[type="submit"], button')).find(e => (e.value||e.innerText||'').toLowerCase().includes('save'));
    if (btn) { setTimeout(() => btn.click(), 80); return; }

    log('Unknown -> Restricted');
    saveRestricted(current, 'unknown');
    q.shift(); saveQueue(q);
    removeSessionFlag('aq_processing');
    setTimeout(processQueue, PROCESS_DELAY);
  }

  function handleWipPage() {
      const q=getQueue(); if(!q.length){removeSessionFlag('aq_processing');return;}
      const forced=getSessionFlag('forceSaveUrl');
      const share=document.getElementById('SHARE_LONGLINK');
      if(share){
          if(forced) saveProcessed(forced);
          removeSessionFlag('forceSaveUrl'); removeSessionFlag('aq_processing');
          if(share.querySelector('input')?.value) window.location.href=share.querySelector('input').value;
          else setTimeout(processQueue, PROCESS_DELAY);
          return;
      }
      setTimeout(()=>location.reload(), 15000);
  }

  function handleHomepage() {
      const f=getSessionFlag('forceSaveUrl');
      if(!f){removeSessionFlag('aq_processing'); setTimeout(processQueue,1000); return;}
      const i=document.querySelector('input[name="url"]');
      if(i){ i.value=f; setTimeout(()=>document.querySelector('input[type="submit"]').click(), 100); }
  }

  function mainRouter() {
    createOverlay(); updateOverlay(); startProgressMonitor();
    if (getSessionFlag('processingPaused')) return;
    const path = location.pathname;
    if (path.startsWith('/wip/')) return handleWipPage();
    if (path.length < 2 || path.startsWith('/submit/')) return handleHomepage();
    if (document.querySelector('input[name="url"]')) return handleHomepage();

    if ((document.getElementById('CONTENT') && document.body.innerText.includes('No results')) || document.getElementById('row0')) {
        return handlePreCheckPage();
    }

    if (path.startsWith('/https://') || path.startsWith('/http://')) { handlePreCheckPage(); return; }

    handleFinalPage();
  }

  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', mainRouter);
  else mainRouter();
  setTimeout(() => { if (!getSessionFlag('processingPaused')) processQueue(); }, 1000);

})();
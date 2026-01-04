// ==UserScript==
// @name         Claude Project Downloader (NEW)
// @namespace    https://tampermonkey.net
// @version      1.1
// @description  One-click downloader for all files in a Claude project. Handles both previewable text files and non-previewable binaries (e.g., .xlsx).
// @author       sharmanhall
// @license      All Rights Reserved
// @match        https://claude.ai/*
// @require      https://unpkg.com/fflate/umd/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @connect      *
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIvPjxwb2x5bGluZSBwb2ludHM9IjcgMTAgMTIgMTUgMTcgMTAiLz48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/548977/Claude%20Project%20Downloader%20%28NEW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548977/Claude%20Project%20Downloader%20%28NEW%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let isInitialized = false;

  // -------- Utilities --------
  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function waitForAny(selectors, timeout = 15000) {
    // Resolve when ANY selector matches; reject if none appear within timeout
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const check = () => {
        for (const sel of selectors) {
          const el = q(sel);
          if (el) return resolve({ el, selector: sel });
        }
        if (performance.now() - start >= timeout)
          return reject(new Error(`None of selectors appeared: ${selectors.join(', ')}`));
        requestAnimationFrame(check);
      };
      check();
    });
  }

  function waitUntilGone(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const loop = () => {
        if (!q(selector)) return resolve();
        if (performance.now() - start >= timeout)
          return reject(new Error(`"${selector}" did not disappear`));
        requestAnimationFrame(loop);
      };
      loop();
    });
  }

  async function fetchBytes(url) {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`Download failed (${res.status})`);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  // Try hard to find a download link/button in Claude's file viewer modal
  function findDownloadLink() {
    // Prefer anchors with href + download-ish text
    const anchors = qa('a[href]');
    const dlA = anchors.find(a =>
      /download|save|export/i.test(a.textContent || '') ||
      a.getAttribute('download') !== null ||
      /\.([a-z0-9]{2,5})(\?|$)/i.test(a.getAttribute('href') || '')
    );
    if (dlA) return dlA;

    // Some UIs use buttons that wrap an <a> inside, or have aria-label
    const btns = qa('button, [role="button"]');
    const dlB = btns.find(b => /download|save|export/i.test(b.textContent || b.getAttribute('aria-label') || ''));
    if (dlB) {
      const nestedA = q('a[href]', dlB);
      if (nestedA) return nestedA;
    }
    return null;
  }

  function safeFileName(name, fallback = 'untitled') {
    const cleaned = (name || fallback).replace(/[\\/:*?"<>|]/g, '_').trim();
    return cleaned || fallback;
  }

  // -------- UI scaffold --------
  function initializeDownloaderUI() {
    if (typeof fflate === 'undefined' || typeof saveAs === 'undefined') return;
    if (q('#downloader-corner-container')) return;

    const ICONS = {
      DOWNLOAD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      SPINNER: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
      SUCCESS: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      ERROR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      CANCEL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    };

    const corner = document.createElement('div');
    corner.id = 'downloader-corner-container';
    corner.innerHTML = `<button id="downloader-start-btn" class="downloader-btn"><span class="icon">${ICONS.DOWNLOAD}</span><span>Download project</span></button>`;
    document.body.appendChild(corner);

    const modal = document.createElement('div');
    modal.id = 'downloader-modal-container';
    modal.innerHTML = `
      <div id="downloader-modal-card">
        <div id="downloader-main-status"><span class="icon"></span><span class="text"></span></div>
        <div id="downloader-progress-bar-container"><div class="progress-bar-fill"></div></div>
        <div id="downloader-detail-status"></div>
        <button id="downloader-cancel-btn">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    GM_addStyle(`
      :root{--color-text:#FFF;--color-background:#111;--color-overlay:rgba(10,10,10,.75);--color-border:rgba(255,255,255,.15);--color-progress:#FFF;--color-cancel-text:rgba(255,255,255,.7);--curve:cubic-bezier(.2,.8,.2,1)}
      @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}
      #downloader-corner-container{position:fixed;bottom:25px;right:25px;z-index:9998;display:none}
      #downloader-corner-container.visible{display:block}
      .downloader-btn{display:flex;align-items:center;gap:12px;border:1px solid var(--color-border);border-radius:12px;background:rgba(30,30,30,.85);backdrop-filter:blur(10px);color:var(--color-text);padding:0 24px;cursor:pointer;height:54px;transition:all .3s var(--curve)}
      .downloader-btn:hover{transform:translateY(-3px);background:rgba(40,40,40,.95)}
      .downloader-btn .icon{display:flex;align-items:center;width:20px;height:20px}
      #downloader-modal-container{position:fixed;inset:0;z-index:9999;display:flex;justify-content:center;align-items:center;background:var(--color-overlay);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .4s var(--curve)}
      #downloader-modal-container.active{opacity:1;pointer-events:auto}
      #downloader-modal-card{display:flex;flex-direction:column;align-items:center;gap:18px;background:var(--color-background);padding:40px 56px;border-radius:18px;width:440px;border:1px solid var(--color-border)}
      #downloader-main-status{display:flex;align-items:center;gap:16px;font-size:20px;font-weight:600;color:var(--color-text)}
      #downloader-progress-bar-container{width:100%;height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
      .progress-bar-fill{width:0%;height:100%;background:var(--color-progress);transition:width .25s ease-out}
      #downloader-detail-status{height:20px;font-size:14px;color:rgba(255,255,255,.75);text-align:center;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #downloader-cancel-btn{border:none;background:transparent;color:var(--color-cancel-text);padding:8px 16px;border-radius:8px;cursor:pointer}
      #downloader-cancel-btn:hover{background:rgba(255,255,255,.1);color:#fff}
    `);

    const startBtn = q('#downloader-start-btn');
    const modalIcon = q('#downloader-main-status .icon', modal);
    const modalText = q('#downloader-main-status .text', modal);
    const progressBar = q('.progress-bar-fill', modal);
    const detail = q('#downloader-detail-status', modal);
    const cancelBtn = q('#downloader-cancel-btn', modal);
    let isCancelled = false;
    let closeTimer = null;

    function animateText(el, t) {
      if (el.textContent === t) return;
      el.style.opacity = '0';
      setTimeout(() => { el.textContent = t; el.style.opacity = '1'; }, 150);
    }

    function setUI(state, main = '', sub = '', pct = 0) {
      clearTimeout(closeTimer);
      if (state === 'idle') { modal.classList.remove('active'); return; }
      modal.classList.add('active');

      const ICONS2 = {
        processing: ICONS.SPINNER,
        zipping: ICONS.SPINNER,
        success: ICONS.SUCCESS,
        error: ICONS.ERROR,
        cancelled: ICONS.CANCEL
      };
      modalIcon.innerHTML = ICONS2[state] || '';
      animateText(modalText, main);
      animateText(detail, sub);
      progressBar.style.width = `${pct}%`;
      cancelBtn.style.display = state === 'processing' ? 'block' : 'none';

      if (state === 'success') closeTimer = setTimeout(() => setUI('idle'), 2500);
      if (state === 'cancelled') closeTimer = setTimeout(() => setUI('idle'), 1500);
    }

    cancelBtn.addEventListener('click', () => { isCancelled = true; });

    startBtn.addEventListener('click', async () => {
      try {
        isCancelled = false;
        setUI('processing', 'Preparing…', 'Scanning files…', 0);

        // Find all file tiles/cards in the project Files panel
        const fileButtons = qa('button.rounded-lg').filter(btn => btn.querySelector('h3'));
        if (fileButtons.length === 0) throw new Error('No project files found.');

        const collected = []; // {name, bytesUint8Array} or {name, text}
        for (let i = 0; i < fileButtons.length; i++) {
          if (isCancelled) throw new Error('cancelled');

          const nameRaw = btnText(fileButtons[i].querySelector('h3')) || `untitled-${i + 1}`;
          const fileName = safeFileName(nameRaw);
          setUI('processing', 'Collecting files…', `${i + 1}/${fileButtons.length}: ${fileName}`, (i / fileButtons.length) * 100);

          // Open the viewer
          fileButtons[i].click();

          // Wait for either: text preview, a "no preview" label, or any download link to appear
          const candidates = [
            // typical text preview container(s)
            'div.whitespace-pre-wrap.break-all.font-mono',
            'pre, code[class*="language-"]',
            // "File previews are not supported…" banner/area
            'div:has(> p), div[role="dialog"] p, [data-testid*="preview"] p',
            // download link/button
            'a[href][download], a[href*="."]',
            'button:has(svg), [role="button"]'
          ];

          let previewText = null;
          let fileBytes = null;
          let usedUrl = null;

          try {
            await waitForAny(candidates, 12000);
          } catch (e) {
            // proceed; some dialogs render slowly, we’ll still attempt download link discovery
          }

          // 1) Try to read text preview
          const textEl =
            q('div.whitespace-pre-wrap.break-all.font-mono') ||
            q('pre') || q('code[class*="language-"]');

          if (textEl && (textEl.textContent || '').trim().length > 0) {
            previewText = textEl.textContent;
          } else {
            // 2) If no text preview, try to find a download link
            const link = findDownloadLink();
            if (link) {
              const href = link.getAttribute('href');
              if (href) {
                try {
                  fileBytes = await fetchBytes(href);
                } catch (err) {
                  // CORS blocked or remote signed URL restricted — fallback to .url shortcut
                  usedUrl = href;
                }
              }
            } else {
              // 3) Final fallback: capture the message shown by the dialog
              const msg = qa('div[role="dialog"] p, [role="dialog"] div, div').map(n => n.textContent || '').find(t => /not supported|no preview/i.test(t));
              if (msg) previewText = msg.trim();
            }
          }

          // Close the viewer (try the “X” close if present)
          const closeBtn = q('button:has(svg[aria-hidden="true"]), button[aria-label*="Close"], button[title*="Close"]') ||
                           q('path[d^="M15.1465"]')?.closest('button');
          if (closeBtn) {
            closeBtn.click();
            await waitUntilGone('div[role="dialog"]', 8000).catch(() => {});
          }

          // Store into our bundle
          if (fileBytes) {
            collected.push({ name: fileName, bytes: fileBytes });
          } else if (previewText != null) {
            collected.push({ name: fileName, text: previewText });
          } else if (usedUrl) {
            // .url (Internet Shortcut) – opens the real file when double-clicked on Windows; fine everywhere as a link placeholder
            const urlTxt = `[InternetShortcut]\nURL=${usedUrl}\n`;
            collected.push({ name: fileName + '.url', text: urlTxt });
          } else {
            const note = `No preview and no downloadable link were detected for "${fileName}".`;
            collected.push({ name: fileName + '.txt', text: note });
          }
        }

        // Build ZIP
        setUI('zipping', 'Zipping…', 'Creating ZIP archive…', 100);
        const filesToZip = {};
        const encoder = new TextEncoder();
        for (const f of collected) {
          if (f.bytes) filesToZip[f.name] = f.bytes;
          else filesToZip[f.name] = encoder.encode(f.text || '');
        }
        const zip = fflate.zipSync(filesToZip, { level: 6 });
        const blob = new Blob([zip], { type: 'application/zip' });
        saveAs(blob, 'claude_project_files.zip');
        setUI('success', 'Done', 'Download complete');
      } catch (err) {
        if (err && String(err).toLowerCase().includes('cancelled')) {
          setUI('cancelled', 'Cancelled', 'Operation aborted', 100);
        } else {
          console.error('[Claude Project Downloader] Error:', err);
          setUI('error', 'Error', err?.message || 'Unknown error', 100);
        }
      }
    });

    // helper to keep the floating button visible only when a project page has files
    function sentinel() {
      const visible = !!(q('h2[id^="radix-"]') || q('button.rounded-lg h3'));
      corner.classList.toggle('visible', visible);
    }
    setInterval(sentinel, 1000);

    function btnText(el) { return (el?.textContent || '').trim(); }

    isInitialized = true;
  }

  // init as the SPA navigates
  function bootSentinel() {
    if (!isInitialized) initializeDownloaderUI();
  }
  const obs = new MutationObserver(bootSentinel);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  bootSentinel();
})();
// ==UserScript==
// @name         Claude Project Downloader (NEW)
// @namespace    https://tampermonkey.net
// @version      1.1
// @description  One-click downloader for all files in a Claude project. Handles both previewable text files and non-previewable binaries (e.g., .xlsx).
// @author       sharmanhall
// @license      All Rights Reserved
// @match        https://claude.ai/*
// @require      https://unpkg.com/fflate/umd/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @connect      *
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIvPjxwb2x5bGluZSBwb2ludHM9IjcgMTAgMTIgMTUgMTcgMTAiLz48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyIvPjwvc3ZnPg==
// ==/UserScript==

(function () {
  'use strict';

  let isInitialized = false;

  // -------- Utilities --------
  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function waitForAny(selectors, timeout = 15000) {
    // Resolve when ANY selector matches; reject if none appear within timeout
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const check = () => {
        for (const sel of selectors) {
          const el = q(sel);
          if (el) return resolve({ el, selector: sel });
        }
        if (performance.now() - start >= timeout)
          return reject(new Error(`None of selectors appeared: ${selectors.join(', ')}`));
        requestAnimationFrame(check);
      };
      check();
    });
  }

  function waitUntilGone(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const loop = () => {
        if (!q(selector)) return resolve();
        if (performance.now() - start >= timeout)
          return reject(new Error(`"${selector}" did not disappear`));
        requestAnimationFrame(loop);
      };
      loop();
    });
  }

  async function fetchBytes(url) {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`Download failed (${res.status})`);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  // Try hard to find a download link/button in Claude's file viewer modal
  function findDownloadLink() {
    // Prefer anchors with href + download-ish text
    const anchors = qa('a[href]');
    const dlA = anchors.find(a =>
      /download|save|export/i.test(a.textContent || '') ||
      a.getAttribute('download') !== null ||
      /\.([a-z0-9]{2,5})(\?|$)/i.test(a.getAttribute('href') || '')
    );
    if (dlA) return dlA;

    // Some UIs use buttons that wrap an <a> inside, or have aria-label
    const btns = qa('button, [role="button"]');
    const dlB = btns.find(b => /download|save|export/i.test(b.textContent || b.getAttribute('aria-label') || ''));
    if (dlB) {
      const nestedA = q('a[href]', dlB);
      if (nestedA) return nestedA;
    }
    return null;
  }

  function safeFileName(name, fallback = 'untitled') {
    const cleaned = (name || fallback).replace(/[\\/:*?"<>|]/g, '_').trim();
    return cleaned || fallback;
  }

  // -------- UI scaffold --------
  function initializeDownloaderUI() {
    if (typeof fflate === 'undefined' || typeof saveAs === 'undefined') return;
    if (q('#downloader-corner-container')) return;

    const ICONS = {
      DOWNLOAD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      SPINNER: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
      SUCCESS: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      ERROR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      CANCEL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    };

    const corner = document.createElement('div');
    corner.id = 'downloader-corner-container';
    corner.innerHTML = `<button id="downloader-start-btn" class="downloader-btn"><span class="icon">${ICONS.DOWNLOAD}</span><span>Download project</span></button>`;
    document.body.appendChild(corner);

    const modal = document.createElement('div');
    modal.id = 'downloader-modal-container';
    modal.innerHTML = `
      <div id="downloader-modal-card">
        <div id="downloader-main-status"><span class="icon"></span><span class="text"></span></div>
        <div id="downloader-progress-bar-container"><div class="progress-bar-fill"></div></div>
        <div id="downloader-detail-status"></div>
        <button id="downloader-cancel-btn">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    GM_addStyle(`
      :root{--color-text:#FFF;--color-background:#111;--color-overlay:rgba(10,10,10,.75);--color-border:rgba(255,255,255,.15);--color-progress:#FFF;--color-cancel-text:rgba(255,255,255,.7);--curve:cubic-bezier(.2,.8,.2,1)}
      @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}
      #downloader-corner-container{position:fixed;bottom:25px;right:25px;z-index:9998;display:none}
      #downloader-corner-container.visible{display:block}
      .downloader-btn{display:flex;align-items:center;gap:12px;border:1px solid var(--color-border);border-radius:12px;background:rgba(30,30,30,.85);backdrop-filter:blur(10px);color:var(--color-text);padding:0 24px;cursor:pointer;height:54px;transition:all .3s var(--curve)}
      .downloader-btn:hover{transform:translateY(-3px);background:rgba(40,40,40,.95)}
      .downloader-btn .icon{display:flex;align-items:center;width:20px;height:20px}
      #downloader-modal-container{position:fixed;inset:0;z-index:9999;display:flex;justify-content:center;align-items:center;background:var(--color-overlay);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .4s var(--curve)}
      #downloader-modal-container.active{opacity:1;pointer-events:auto}
      #downloader-modal-card{display:flex;flex-direction:column;align-items:center;gap:18px;background:var(--color-background);padding:40px 56px;border-radius:18px;width:440px;border:1px solid var(--color-border)}
      #downloader-main-status{display:flex;align-items:center;gap:16px;font-size:20px;font-weight:600;color:var(--color-text)}
      #downloader-progress-bar-container{width:100%;height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
      .progress-bar-fill{width:0%;height:100%;background:var(--color-progress);transition:width .25s ease-out}
      #downloader-detail-status{height:20px;font-size:14px;color:rgba(255,255,255,.75);text-align:center;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #downloader-cancel-btn{border:none;background:transparent;color:var(--color-cancel-text);padding:8px 16px;border-radius:8px;cursor:pointer}
      #downloader-cancel-btn:hover{background:rgba(255,255,255,.1);color:#fff}
    `);

    const startBtn = q('#downloader-start-btn');
    const modalIcon = q('#downloader-main-status .icon', modal);
    const modalText = q('#downloader-main-status .text', modal);
    const progressBar = q('.progress-bar-fill', modal);
    const detail = q('#downloader-detail-status', modal);
    const cancelBtn = q('#downloader-cancel-btn', modal);
    let isCancelled = false;
    let closeTimer = null;

    function animateText(el, t) {
      if (el.textContent === t) return;
      el.style.opacity = '0';
      setTimeout(() => { el.textContent = t; el.style.opacity = '1'; }, 150);
    }

    function setUI(state, main = '', sub = '', pct = 0) {
      clearTimeout(closeTimer);
      if (state === 'idle') { modal.classList.remove('active'); return; }
      modal.classList.add('active');

      const ICONS2 = {
        processing: ICONS.SPINNER,
        zipping: ICONS.SPINNER,
        success: ICONS.SUCCESS,
        error: ICONS.ERROR,
        cancelled: ICONS.CANCEL
      };
      modalIcon.innerHTML = ICONS2[state] || '';
      animateText(modalText, main);
      animateText(detail, sub);
      progressBar.style.width = `${pct}%`;
      cancelBtn.style.display = state === 'processing' ? 'block' : 'none';

      if (state === 'success') closeTimer = setTimeout(() => setUI('idle'), 2500);
      if (state === 'cancelled') closeTimer = setTimeout(() => setUI('idle'), 1500);
    }

    cancelBtn.addEventListener('click', () => { isCancelled = true; });

    startBtn.addEventListener('click', async () => {
      try {
        isCancelled = false;
        setUI('processing', 'Preparing…', 'Scanning files…', 0);

        // Find all file tiles/cards in the project Files panel
        const fileButtons = qa('button.rounded-lg').filter(btn => btn.querySelector('h3'));
        if (fileButtons.length === 0) throw new Error('No project files found.');

        const collected = []; // {name, bytesUint8Array} or {name, text}
        for (let i = 0; i < fileButtons.length; i++) {
          if (isCancelled) throw new Error('cancelled');

          const nameRaw = btnText(fileButtons[i].querySelector('h3')) || `untitled-${i + 1}`;
          const fileName = safeFileName(nameRaw);
          setUI('processing', 'Collecting files…', `${i + 1}/${fileButtons.length}: ${fileName}`, (i / fileButtons.length) * 100);

          // Open the viewer
          fileButtons[i].click();

          // Wait for either: text preview, a "no preview" label, or any download link to appear
          const candidates = [
            // typical text preview container(s)
            'div.whitespace-pre-wrap.break-all.font-mono',
            'pre, code[class*="language-"]',
            // "File previews are not supported…" banner/area
            'div:has(> p), div[role="dialog"] p, [data-testid*="preview"] p',
            // download link/button
            'a[href][download], a[href*="."]',
            'button:has(svg), [role="button"]'
          ];

          let previewText = null;
          let fileBytes = null;
          let usedUrl = null;

          try {
            await waitForAny(candidates, 12000);
          } catch (e) {
            // proceed; some dialogs render slowly, we’ll still attempt download link discovery
          }

          // 1) Try to read text preview
          const textEl =
            q('div.whitespace-pre-wrap.break-all.font-mono') ||
            q('pre') || q('code[class*="language-"]');

          if (textEl && (textEl.textContent || '').trim().length > 0) {
            previewText = textEl.textContent;
          } else {
            // 2) If no text preview, try to find a download link
            const link = findDownloadLink();
            if (link) {
              const href = link.getAttribute('href');
              if (href) {
                try {
                  fileBytes = await fetchBytes(href);
                } catch (err) {
                  // CORS blocked or remote signed URL restricted — fallback to .url shortcut
                  usedUrl = href;
                }
              }
            } else {
              // 3) Final fallback: capture the message shown by the dialog
              const msg = qa('div[role="dialog"] p, [role="dialog"] div, div').map(n => n.textContent || '').find(t => /not supported|no preview/i.test(t));
              if (msg) previewText = msg.trim();
            }
          }

          // Close the viewer (try the “X” close if present)
          const closeBtn = q('button:has(svg[aria-hidden="true"]), button[aria-label*="Close"], button[title*="Close"]') ||
                           q('path[d^="M15.1465"]')?.closest('button');
          if (closeBtn) {
            closeBtn.click();
            await waitUntilGone('div[role="dialog"]', 8000).catch(() => {});
          }

          // Store into our bundle
          if (fileBytes) {
            collected.push({ name: fileName, bytes: fileBytes });
          } else if (previewText != null) {
            collected.push({ name: fileName, text: previewText });
          } else if (usedUrl) {
            // .url (Internet Shortcut) – opens the real file when double-clicked on Windows; fine everywhere as a link placeholder
            const urlTxt = `[InternetShortcut]\nURL=${usedUrl}\n`;
            collected.push({ name: fileName + '.url', text: urlTxt });
          } else {
            const note = `No preview and no downloadable link were detected for "${fileName}".`;
            collected.push({ name: fileName + '.txt', text: note });
          }
        }

        // Build ZIP
        setUI('zipping', 'Zipping…', 'Creating ZIP archive…', 100);
        const filesToZip = {};
        const encoder = new TextEncoder();
        for (const f of collected) {
          if (f.bytes) filesToZip[f.name] = f.bytes;
          else filesToZip[f.name] = encoder.encode(f.text || '');
        }
        const zip = fflate.zipSync(filesToZip, { level: 6 });
        const blob = new Blob([zip], { type: 'application/zip' });
        saveAs(blob, 'claude_project_files.zip');
        setUI('success', 'Done', 'Download complete');
      } catch (err) {
        if (err && String(err).toLowerCase().includes('cancelled')) {
          setUI('cancelled', 'Cancelled', 'Operation aborted', 100);
        } else {
          console.error('[Claude Project Downloader] Error:', err);
          setUI('error', 'Error', err?.message || 'Unknown error', 100);
        }
      }
    });

    // helper to keep the floating button visible only when a project page has files
    function sentinel() {
      const visible = !!(q('h2[id^="radix-"]') || q('button.rounded-lg h3'));
      corner.classList.toggle('visible', visible);
    }
    setInterval(sentinel, 1000);

    function btnText(el) { return (el?.textContent || '').trim(); }

    isInitialized = true;
  }

  // init as the SPA navigates
  function bootSentinel() {
    if (!isInitialized) initializeDownloaderUI();
  }
  const obs = new MutationObserver(bootSentinel);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  bootSentinel();
})();

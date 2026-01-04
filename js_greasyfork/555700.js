// ==UserScript==
// @name         TEMU PDP — Main Media + Review Videos Capture + GDrive Push
// @namespace    https://markg.dev/userscripts/temu-main-media
// @version      2.3.0
// @description  Capture main product images + main video from TEMU PDP + up to 10 review videos by PASSIVELY listening to /reviews/list. After PDP capture, auto-opens review popup and SMART auto-scrolls it. GUI: Subfolder + PUSH + STOP always visible; Settings (GAS URL + Folder ID) + Advanced tools (Capture, Listen, CSV/JSON, Download, Clear, stats) are toggleable.
// @author       You
// @match        https://www.temu.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      temu.com
// @connect      www.temu.com
// @connect      media.temu.com
// @connect      pthumbnail.temu.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/555700/TEMU%20PDP%20%E2%80%94%20Main%20Media%20%2B%20Review%20Videos%20Capture%20%2B%20GDrive%20Push.user.js
// @updateURL https://update.greasyfork.org/scripts/555700/TEMU%20PDP%20%E2%80%94%20Main%20Media%20%2B%20Review%20Videos%20Capture%20%2B%20GDrive%20Push.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ================== STATE ================== **/
  const S = {
    items: [],                 // {type:'image'|'video', url, filename}
    auto: true,                // auto-capture PDP media when container appears
    containerXPath: "//*[@id='leftContent']/div[1]/div[2]/div/div/ol",

    reviewMaxVideos: 10,       // target review video count
    reviewUrls: new Set(),     // unique review video URLs
    reviewListening: false,    // whether we're in "listen" mode
    reviewFlowStarted: false,  // auto-start only once per PDP

    scrollTimer: null          // auto-scroll timer
  };

  /** ================== SETTINGS (PERSISTED) ================== **/
  const SETTINGS_KEYS = {
    webappUrl: 'mg_temu_media_webapp_url',
    folderId:  'mg_temu_media_folder_id',
    subfolder: 'mg_temu_media_subfolder'
  };

  S.settings = {
    webappUrl: GM_getValue(SETTINGS_KEYS.webappUrl, ''),
    folderId:  GM_getValue(SETTINGS_KEYS.folderId,  ''),
    subfolder: GM_getValue(SETTINGS_KEYS.subfolder, '')
  };

  function saveSettingsFromGUI() {
    const webapp = document.getElementById('mg-webapp-url');
    const folder = document.getElementById('mg-folder-id');
    const sub    = document.getElementById('mg-subfolder');

    if (webapp) S.settings.webappUrl = webapp.value.trim();
    if (folder) S.settings.folderId  = folder.value.trim();
    if (sub)    S.settings.subfolder = sub.value.trim();

    GM_setValue(SETTINGS_KEYS.webappUrl, S.settings.webappUrl);
    GM_setValue(SETTINGS_KEYS.folderId,  S.settings.folderId);
    GM_setValue(SETTINGS_KEYS.subfolder, S.settings.subfolder);
  }

  // ORIGINAL XPATH HINTS FOR POPUP
  const REVIEW_SCROLL_XPATH = "//*[@id='reviewContent']/div[6]/div[2]";
  const REVIEW_BUTTON_XPATH = "//*[@id='reviewContent']/div[5]/span[2]";

  /** ================ HELPERS ================== **/
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function xFind(xpath, root) {
    const ctx = root || document;
    try {
      const r = document.evaluate(xpath, ctx, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return r.singleNodeValue || null;
    } catch (_) {
      return null;
    }
  }

  function bestFromSrcset(srcset) {
    if (!srcset) return null;
    const parts = srcset.split(',').map(s => s.trim());
    const last = parts[parts.length - 1];
    if (!last) return null;
    const url = last.split(' ')[0];
    return url || null;
  }

  function normalizeTemuUrl(u) {
    if (!u) return null;
    try {
      const url = new URL(u, location.href);
      const drop = ["width", "height", "size", "format", "quality", "compress", "webp", "q", "h", "w"];
      drop.forEach(k => url.searchParams.delete(k));
      return url.toString();
    } catch (_) {
      return u;
    }
  }

  function filenameFromUrl(url, ix, extFallback) {
    const idx = ix.toString().padStart(2, '0');
    try {
      const u = new URL(url);
      const baseRaw = u.pathname.split('/').pop() || '';
      const base = baseRaw.split('?')[0] || '';
      if (base && base.includes('.')) {
        return idx + '_' + base;
      }
      return idx + '_temu.' + extFallback;
    } catch (_) {
      return idx + '_temu.' + extFallback;
    }
  }

  function productSlug() {
    const t = document.title || 'temu';
    const s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s.slice(0, 60) || 'temu';
  }

  function toCSV(rows) {
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const header = ['type', 'url', 'filename'];
    const lines = [header.map(esc).join(',')];
    rows.forEach(r => {
      lines.push([r.type, r.url, r.filename].map(esc).join(','));
    });
    return lines.join('\n');
  }

  function dedupeByUrl(list) {
    const seen = new Set();
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      const key = x.type + '|' + x.url;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(x);
    }
    return out;
  }

  /** ================ CORE PDP CAPTURE ================ **/
  function captureFromContainer(container) {
    const out = [];

    // IMAGES only inside the exact container
    const imgs = $$('img', container);
    let imgIx = 1;
    imgs.forEach(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || null;
      const srcset = img.getAttribute('srcset');
      let url = bestFromSrcset(srcset) || src;
      if (!url) return;
      url = normalizeTemuUrl(url);

      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      if (w && h && (w < 80 || h < 80)) return; // skip tiny icons/logos

      out.push({
        type: 'image',
        url: url,
        filename: productSlug() + '_img_' + filenameFromUrl(url, imgIx++, 'jpg')
      });
    });

    // MAIN VIDEO only inside this container (if any)
    const videos = $$('video', container);
    let vidIx = 1;
    videos.forEach(v => {
      const srcEl = $('source[src]', v);
      let vurl = (srcEl && srcEl.getAttribute('src')) || v.getAttribute('src') || null;

      // Fallback to og:video only if video src is blob (player style)
      if (!vurl || vurl.startsWith('blob:')) {
        const og = $('meta[property="og:video"], meta[name="og:video"]');
        if (og && og.content) vurl = og.content;
      }
      if (!vurl || vurl.startsWith('blob:')) return;

      vurl = normalizeTemuUrl(vurl);

      out.push({
        type: 'video',
        url: vurl,
        filename: productSlug() + '_vid_' + filenameFromUrl(vurl, vidIx++, 'mp4')
      });
    });

    return dedupeByUrl(out);
  }

  /** ============ REVIEW POPUP HELPERS (CLICK + SMART SCROLL) ============ **/

  function clickReviewButton() {
    const btn = xFind(REVIEW_BUTTON_XPATH);
    if (btn) {
      btn.click();
      log('Clicked reviews button to open popup.');
      return true;
    } else {
      log('Reviews button not found (xpath reviewContent/div[5]/span[2]). You can open it manually once.');
      return false;
    }
  }

  function findScrollableReviewContainer() {
    // 0) Try original xpath first
    let el = xFind(REVIEW_SCROLL_XPATH);
    if (el && el.scrollHeight > el.clientHeight + 20) return el;

    // 1) Try inside #reviewContent (popup root)
    const root = document.getElementById('reviewContent');
    if (root) {
      const divs = root.querySelectorAll('div');
      let best = null;
      for (let i = 0; i < divs.length; i++) {
        const d = divs[i];
        const scrollable = d.scrollHeight > d.clientHeight + 20;
        const tallEnough = d.clientHeight > 200;
        if (!scrollable || !tallEnough) continue;

        const cls = (d.className || '').toLowerCase();
        if (cls.includes('review') || cls.includes('list') || cls.includes('content')) {
          return d;
        }
        if (!best) best = d;
      }
      if (best) return best;
    }

    // 2) Fallback – any visible scrollable DIV on the page
    const allDivs = document.querySelectorAll('div');
    let candidate = null;
    for (let i = 0; i < allDivs.length; i++) {
      const d = allDivs[i];
      const rect = d.getBoundingClientRect();
      if (rect.height < 150 || rect.width < 300) continue;

      const scrollable = d.scrollHeight > d.clientHeight + 20;
      if (!scrollable) continue;

      candidate = d;
      break;
    }

    return candidate;
  }

  function startAutoScrollForReviews() {
    if (S.scrollTimer) return;

    S.scrollTimer = setInterval(function () {
      if (!S.reviewListening) return;

      const popup = findScrollableReviewContainer();
      if (popup) {
        popup.scrollTop = popup.scrollHeight;
        log('Auto-scroll tick (popup) — scrollTop=' + popup.scrollTop);
      } else {
        // Fallback: scroll the main window, in case popup scroll is tied to body
        window.scrollBy(0, 400);
        log('Auto-scroll tick (window fallback).');
      }
    }, 2000); // 2s interval to avoid hammering Temu
    log('Auto-scroll for review popup started (every 2s).');
  }

  function stopAutoScroll() {
    if (S.scrollTimer) {
      clearInterval(S.scrollTimer);
      S.scrollTimer = null;
      log('Auto-scroll for review popup stopped.');
    }
  }

  /** ============ REVIEW VIDEOS — PASSIVE LISTENER ============ **/

  function isReviewListUrl(url) {
    if (!url) return false;
    try {
      const u = new URL(url, location.href);
      return /\/reviews\/list/i.test(u.pathname);
    } catch (_) {
      return /reviews\/list/i.test(String(url));
    }
  }

  function handleReviewJson(json, url) {
    if (!S.reviewListening) return;
    if (!json) return;

    const arr = json.data;
    if (!Array.isArray(arr) || !arr.length) {
      log('Review JSON has no data array or is empty for ' + (url || ''));
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (S.reviewUrls.size >= S.reviewMaxVideos) break;

      const rev = arr[i];
      const v = rev && rev.video;
      const vurl = v && v.url;
      if (!vurl) continue;

      const norm = normalizeTemuUrl(vurl);
      if (!norm) continue;
      if (S.reviewUrls.has(norm)) continue;

      S.reviewUrls.add(norm);
      const idx = S.reviewUrls.size;
      const entry = {
        type: 'video',
        url: norm,
        filename: productSlug() + '_rev_' + String(idx).padStart(2, '0') + '.mp4'
      };

      S.items = dedupeByUrl(S.items.concat([entry]));
      refreshCounts();
      disableActionButtons(false);
      log('Captured review video #' + idx + ' via /reviews/list');
    }

    if (S.reviewUrls.size >= S.reviewMaxVideos) {
      log('Reached max review videos (' + S.reviewMaxVideos + '). Stopping listener + auto-scroll.');
      S.reviewListening = false;
      stopAutoScroll();
    } else {
      log('Current review videos: ' + S.reviewUrls.size + ' (target ' + S.reviewMaxVideos + '). Waiting for next /reviews/list from Temu...');
    }
  }

  // Listen for messages from page context (patched fetch / XHR)
  window.addEventListener('message', function (e) {
    const m = e && e.data;
    if (!m || !m.__mgTemuReview || !m.body) return;
    try {
      const json = JSON.parse(m.body);
      handleReviewJson(json, m.url || '');
    } catch (_) {
      // ignore JSON parse errors
    }
  });

  // Patch page's fetch via unsafeWindow
  (function patchPageFetch() {
    const uw = unsafeWindow || window;
    if (!uw || !uw.fetch) return;

    const origFetch = uw.fetch;
    uw.fetch = function () {
      const args = arguments;
      const input = args[0];
      let url = '';

      if (typeof input === 'string') url = input;
      else if (input && typeof input === 'object' && input.url) url = input.url;

      const isReview = isReviewListUrl(url);

      const p = origFetch.apply(this, args);
      if (!isReview) return p;

      return p.then(function (resp) {
        try {
          const clone = resp.clone();
          clone.text().then(function (txt) {
            window.postMessage({ __mgTemuReview: true, url: url, body: txt }, '*');
          }).catch(function () { });
        } catch (_) { }
        return resp;
      });
    };
  })();

  // Patch page's XMLHttpRequest via unsafeWindow
  (function patchPageXHR() {
    const uw = unsafeWindow || window;
    const OrigXHR = uw.XMLHttpRequest;
    if (!OrigXHR) return;

    function WrappedXHR() {
      const xhr = new OrigXHR();
      let url = '';

      const origOpen = xhr.open;
      xhr.open = function () {
        url = arguments[1] || '';
        return origOpen.apply(xhr, arguments);
      };

      xhr.addEventListener('load', function () {
        if (!isReviewListUrl(url)) return;
        try {
          const txt = xhr.responseText;
          if (!txt) return;
          window.postMessage({ __mgTemuReview: true, url: url, body: txt }, '*');
        } catch (_) { }
      });

      return xhr;
    }

    uw.XMLHttpRequest = WrappedXHR;
  })();

  /** ================ GUI ================ **/
  function buildGUI() {
    if ($('#mg-temu-gui')) return;

    GM_addStyle(
      ''
      + '#mg-temu-gui {'
      + '  position: fixed; z-index: 999999; right: 16px; bottom: 16px;'
      + '  width: 360px; background: #0f172a; color: #e5e7eb; font: 12px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;'
      + '  border: 1px solid #1f2937; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.35);'
      + '  user-select: none; overflow: hidden;'
      + '}'
      + '#mg-temu-gui header {'
      + '  padding: 10px 12px; background: #111827; cursor: move; display: flex; align-items: center; justify-content: space-between;'
      + '}'
      + '#mg-temu-gui header .title { font-weight: 700; font-size: 12px; }'
      + '#mg-temu-gui .body { padding: 10px 12px; }'
      + '#mg-temu-gui .row { display: flex; gap: 8px; margin-bottom: 8px; }'
      + '#mg-temu-gui .row > button {'
      + '  flex: 1; background: #1f2937; border: 1px solid #374151; color: #e5e7eb; padding: 8px 10px; border-radius: 10px;'
      + '}'
      + '#mg-temu-gui button { cursor: pointer; font-weight: 600; }'
      + '#mg-temu-gui button:disabled { opacity: .5; cursor: not-allowed; }'
      + '#mg-temu-gui .settings-block label { display:block; font-size:11px; margin-bottom:2px; color:#9ca3af; }'
      + '#mg-temu-gui .settings-block input { width:100%; box-sizing:border-box; padding:6px 8px; border-radius:8px; border:1px solid #374151; background:#020617; color:#e5e7eb; font-size:11px; }'
      + '#mg-temu-gui .stats { display: flex; gap: 8px; margin-bottom: 8px; }'
      + '#mg-temu-gui .stat { flex: 1; background: #0b1220; border: 1px solid #1f2937; padding: 8px; border-radius: 10px; text-align: center; }'
      + '#mg-temu-gui .stat b { display: block; font-size: 14px; margin-bottom: 2px; }'
      + '#mg-temu-gui .log { background: #0b1220; border: 1px solid #1f2937; padding: 8px; border-radius: 10px; max-height: 110px; overflow: auto; white-space: pre-wrap; }'
      + '#mg-temu-gui .footer { padding: 8px 12px; background: #0b1220; color: #9ca3af; font-size: 11px; text-align: center; }'
      + '#mg-temu-gui .chip { display:inline-block; padding:2px 6px; border:1px solid #374151; border-radius:999px; font-size:11px; margin-left:6px; color:#9ca3af; }'
      + '#mg-temu-gui .panel { margin-bottom: 8px; }'
      + '#mg-temu-gui .panel.hidden { display:none; }'
    );

    const el = document.createElement('div');
    el.id = 'mg-temu-gui';
    el.innerHTML =
      ''
      + '<header>'
      + '  <div class="title">TEMU — PDP + Review Media</div>'
      + '  <div class="chip">Passive /reviews/list</div>'
      + '</header>'
      + '<div class="body">'

      // ALWAYS VISIBLE: subfolder + PUSH + STOP
      + '  <div class="settings-block" style="margin-bottom:8px;">'
      + '    <label>Subfolder Name</label>'
      + '    <input id="mg-subfolder" type="text" placeholder="TEMU-REVIEWS">'
      + '  </div>'

      + '  <div class="row">'
      + '    <button id="mg-push-gdrive">PUSH TO GDRIVE</button>'
      + '    <button id="mg-stop-all">STOP</button>'
      + '  </div>'

      // Toggles
      + '  <div class="row">'
      + '    <button id="mg-toggle-settings">SHOW SETTINGS</button>'
      + '    <button id="mg-toggle-adv">SHOW TOOLS</button>'
      + '  </div>'

      // SETTINGS PANEL (WebApp + Folder ID)
      + '  <div class="panel hidden" id="mg-settings-panel">'
      + '    <div class="settings-block" style="margin-bottom:8px;">'
      + '      <label>GAS Web App URL</label>'
      + '      <input id="mg-webapp-url" type="text" placeholder="https://script.google.com/macros/s/....../exec">'
      + '    </div>'
      + '    <div class="settings-block" style="margin-bottom:8px;">'
      + '      <label>Parent Drive Folder ID</label>'
      + '      <input id="mg-folder-id" type="text" placeholder="1JGioS5u...">'
      + '    </div>'
      + '    <div class="row">'
      + '      <button id="mg-save-settings">SAVE SETTINGS</button>'
      + '    </div>'
      + '  </div>'

      // ADVANCED PANEL: stats + capture + listen + CSV/JSON + download + clear
      + '  <div class="panel hidden" id="mg-adv-panel">'
      + '    <div class="stats">'
      + '      <div class="stat"><b id="mg-count-total">0</b>Total</div>'
      + '      <div class="stat"><b id="mg-count-img">0</b>Images</div>'
      + '      <div class="stat"><b id="mg-count-vid">0</b>Videos</div>'
      + '    </div>'

      + '    <div class="row">'
      + '      <button id="mg-capture">CAPTURE PDP</button>'
      + '      <button id="mg-cap-reviews">LISTEN+SCROLL</button>'
      + '    </div>'

      + '    <div class="row">'
      + '      <button id="mg-copy-csv" disabled>COPY CSV</button>'
      + '      <button id="mg-copy-json" disabled>COPY JSON</button>'
      + '    </div>'

      + '    <div class="row">'
      + '      <button id="mg-download" disabled>DOWNLOAD ALL</button>'
      + '      <button id="mg-clear" disabled>CLEAR</button>'
      + '    </div>'
      + '  </div>'

      + '  <div class="log" id="mg-log">Ready.</div>'
      + '</div>'
      + '<div class="footer">PDP scope: //*[@id="leftContent"]/div[1]/div[2]/div/div/ol</div>';

    if (!document.body) return;
    document.body.appendChild(el);

    makeDraggable(el.querySelector('header'), el);

    // Pre-fill inputs from stored settings
    const webappInput = document.getElementById('mg-webapp-url');
    const folderInput = document.getElementById('mg-folder-id');
    const subInput    = document.getElementById('mg-subfolder');

    if (webappInput) webappInput.value = S.settings.webappUrl || '';
    if (folderInput) folderInput.value = S.settings.folderId  || '';
    if (subInput)    subInput.value    = S.settings.subfolder || '';

    // SETTINGS toggle
    const panelSettings = document.getElementById('mg-settings-panel');
    const btnToggleSettings = document.getElementById('mg-toggle-settings');
    btnToggleSettings.addEventListener('click', function () {
      const isHidden = panelSettings.classList.contains('hidden');
      panelSettings.classList.toggle('hidden', !isHidden === false);
      panelSettings.classList.toggle('hidden', !isHidden ? true : false);
    });
    // fix toggle text
    btnToggleSettings.addEventListener('click', function () {
      const hidden = panelSettings.classList.contains('hidden');
      btnToggleSettings.textContent = hidden ? 'SHOW SETTINGS' : 'HIDE SETTINGS';
    });
    // initialize text
    btnToggleSettings.textContent = 'SHOW SETTINGS';

    // ADVANCED toggle
    const panelAdv = document.getElementById('mg-adv-panel');
    const btnToggleAdv = document.getElementById('mg-toggle-adv');
    btnToggleAdv.addEventListener('click', function () {
      const hidden = panelAdv.classList.contains('hidden');
      panelAdv.classList.toggle('hidden', !hidden === false);
      panelAdv.classList.toggle('hidden', !hidden ? true : false);
    });
    btnToggleAdv.addEventListener('click', function () {
      const hidden = panelAdv.classList.contains('hidden');
      btnToggleAdv.textContent = hidden ? 'SHOW TOOLS' : 'HIDE TOOLS';
    });
    btnToggleAdv.textContent = 'SHOW TOOLS';

    // SAVE SETTINGS
    $('#mg-save-settings').addEventListener('click', function () {
      saveSettingsFromGUI();
      log('Settings saved.');
    });

    // PUSH TO GDRIVE (also saves latest inputs)
    $('#mg-push-gdrive').addEventListener('click', function () {
      saveSettingsFromGUI();
      pushToGDrive();
    });

    // STOP (auto-scroll + listening)
    $('#mg-stop-all').addEventListener('click', function () {
      stopReviewFlow();
    });

    // ADVANCED tools
    $('#mg-capture').addEventListener('click', doCapturePDP);
    $('#mg-cap-reviews').addEventListener('click', function () {
      startReviewFlow(true);
    });

    $('#mg-copy-csv').addEventListener('click', function () {
      GM_setClipboard(toCSV(S.items), 'text');
      log('Copied CSV (' + S.items.length + ' rows)');
    });

    $('#mg-copy-json').addEventListener('click', function () {
      GM_setClipboard(JSON.stringify(S.items, null, 2), 'text');
      log('Copied JSON (' + S.items.length + ' items)');
    });

    $('#mg-download').addEventListener('click', async function () {
      disableActionButtons(true);
      log('Downloading ' + S.items.length + ' file(s)...');
      for (let i = 0; i < S.items.length; i++) {
        const it = S.items[i];
        try {
          await gmDownload(it.url, it.filename);
          log('✔ ' + it.filename);
        } catch (err) {
          const msg = err && err.message ? err.message : 'download failed';
          log('✖ ' + it.filename + ' — ' + msg);
        }
      }
      disableActionButtons(false);
      log('Download batch completed.');
    });

    $('#mg-clear').addEventListener('click', function () {
      S.items = [];
      S.reviewUrls = new Set();
      refreshCounts();
      disableActionButtons(true, true);
      log('Cleared all items and review URLs.');
    });

    refreshCounts();
    disableActionButtons(true, true);
  }

  function makeDraggable(handle, panel) {
    let ox = 0;
    let oy = 0;
    let px = 0;
    let py = 0;
    let dragging = false;

    handle.addEventListener('mousedown', function (e) {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      const rect = panel.getBoundingClientRect();
      ox = rect.left;
      oy = rect.top;
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      panel.style.left = (ox + dx) + 'px';
      panel.style.top = (oy + dy) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });

    window.addEventListener('mouseup', function () {
      dragging = false;
    });
  }

  function gmDownload(url, name) {
    return new Promise(function (resolve, reject) {
      GM_download({
        url: url,
        name: name,
        onload: function () {
          resolve();
        },
        ontimeout: function () {
          reject(new Error('timeout'));
        },
        onerror: function () {
          reject(new Error('error'));
        }
      });
    });
  }

  function refreshCounts() {
    const total = S.items.length;
    let imgs = 0;
    let vids = 0;
    for (let i = 0; i < S.items.length; i++) {
      const t = S.items[i].type;
      if (t === 'image') imgs++;
      if (t === 'video') vids++;
    }
    const totEl = $('#mg-count-total');
    const imgEl = $('#mg-count-img');
    const vidEl = $('#mg-count-vid');
    if (totEl) totEl.textContent = String(total);
    if (imgEl) imgEl.textContent = String(imgs);
    if (vidEl) vidEl.textContent = String(vids);
  }

  function disableActionButtons(disabled, includeClear) {
    const copyCsv = $('#mg-copy-csv');
    const copyJson = $('#mg-copy-json');
    const dl = $('#mg-download');
    const clear = $('#mg-clear');
    const hasItems = S.items.length > 0;

    if (copyCsv) copyCsv.disabled = disabled || !hasItems;
    if (copyJson) copyJson.disabled = disabled || !hasItems;
    if (dl) dl.disabled = disabled || !hasItems;

    if (clear) {
      if (includeClear) {
        clear.disabled = disabled || !hasItems ? true : false;
      } else {
        clear.disabled = !hasItems;
      }
    }
  }

  function log(msg) {
    const el = $('#mg-log');
    if (!el) return;
    el.textContent += '\n' + msg;
    el.scrollTop = el.scrollHeight;
  }

  /** ========== PUSH TO GDRIVE (GAS WEB APP) ========== **/
  function pushToGDrive() {
    if (!S.items.length) {
      log('No items to push.');
      return;
    }

    if (!S.settings.webappUrl || !S.settings.folderId || !S.settings.subfolder) {
      log('Missing Web App URL / Folder ID / Subfolder. Open SETTINGS, fill them, and SAVE.');
      return;
    }

    const payload = {
      action: 'SAVE_MEDIA_LIST',
      source: 'TEMU',
      productUrl: location.href,
      productTitle: document.title || '',
      folderId: S.settings.folderId,
      subfolder: S.settings.subfolder,
      items: S.items
    };

    log('Pushing ' + S.items.length + ' item(s) to GDrive subfolder "' + S.settings.subfolder + '" ...');

    GM_xmlhttpRequest({
      method: 'POST',
      url: S.settings.webappUrl,
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      onload: function (res) {
        log('GAS response: ' + res.status + ' ' + (res.responseText || ''));
      },
      onerror: function (err) {
        log('GAS request error: ' + (err && err.error || 'unknown'));
      }
    });
  }

  /** ================ ORCHESTRATION ================ **/

  function startReviewFlow(reset) {
    if (reset) {
      // reset review videos but keep PDP items
      S.reviewUrls = new Set();
      S.items = S.items.filter(x => !(x.type === 'video' && /_rev_/.test(x.filename)));
      refreshCounts();
    }

    S.reviewListening = true;
    S.reviewFlowStarted = true;
    log('Starting review listener + auto-scroll.');

    clickReviewButton();
    // Give popup a moment to render before starting scroll
    setTimeout(startAutoScrollForReviews, 1200);
  }

  function stopReviewFlow() {
    S.reviewListening = false;
    stopAutoScroll();
    log('STOP pressed. Auto-scroll and listening are now OFF.');
  }

  function doCapturePDP() {
    const container = xFind(S.containerXPath);
    if (!container) {
      log('PDP container not found yet. Wait for page to fully render thumbnails, then try again.');
      refreshCounts();
      return;
    }
    const captured = captureFromContainer(container);
    if (!captured.length) {
      log('No PDP media found in the target container.');
      return;
    }
    S.items = dedupeByUrl(captured.concat(S.items));
    refreshCounts();
    disableActionButtons(false);
    log('Captured ' + captured.length + ' PDP media item(s) from container.');

    // After capturing main PDP images + video, automatically start review flow (once)
    if (!S.reviewFlowStarted) {
      startReviewFlow(true);
    }
  }

  function startObserver() {
    const obs = new MutationObserver(function () {
      if (!S.auto) return;
      const container = xFind(S.containerXPath);
      if (container && !container.__mgCapturedOnce) {
        container.__mgCapturedOnce = true;
        setTimeout(function () {
          doCapturePDP();
        }, 400);
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  /** ================ INIT ================ **/
  function init() {
    buildGUI();
    startObserver();
    if (S.auto && xFind(S.containerXPath)) {
      setTimeout(function () {
        doCapturePDP();
      }, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

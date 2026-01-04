// ==UserScript==

// @name         Webpage to EPUB — Mobile optimized

// @namespace    http://tampermonkey.net/

// @version      2.1

// @description  Extract main article using Readability + heuristics, strong filtering, cover selection (detected/upload/URL), mobile-friendly UI, draggable small button, generates EPUB with images. Tampermonkey compatible.

// @author       Ifrit Raen

// @license      MIT

// @match        *://*/*

// @grant        none

// @require      https://unpkg.com/@mozilla/readability@0.4.4/Readability.js

// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js

// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js



// @downloadURL https://update.greasyfork.org/scripts/551195/Webpage%20to%20EPUB%20%E2%80%94%20Mobile%20optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/551195/Webpage%20to%20EPUB%20%E2%80%94%20Mobile%20optimized.meta.js
// ==/UserScript==



(function () {

  'use strict';



  /************************************************************************

   *  CONFIG

   ************************************************************************/

  const CONFIG = {

    minImageArea: 1200 * 300,         // minimal pixel area to consider an image candidate

    corsProxy: 'https://cors.bridged.cc/', // fallback proxy if CORS blocks image fetch; set to null to disable

    publisher: 'Saved with Web→EPUB',

    language: 'en',

    maxImageCandidates: 18,

    debug: false,

    buttonSize: 44,                   // px (draggable)

    persistButtonPositionKey: 'we_epub_btn_pos_v1',

    tapMaxMovement: 7,                // px: movement threshold to consider a tap vs drag

    tapMaxDuration: 300               // ms: max duration for a tap

  };



  /************************************************************************

   *  HELPERS

   ************************************************************************/

  function dbg(...args) { if (CONFIG.debug) console.log('[Web→EPUB]', ...args); }



  function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2, 9); }



  function safeFilename(name) {

    return (name || 'webpage').replace(/[\/\\?%*:|"<>]/g, '_').substr(0, 200);

  }



  // robust cross-browser UUID generator fallback

  function generateUUID() {

    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {

      try { return crypto.randomUUID(); } catch (e) { /* fallback below */ }

    }

    // fallback implementation

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

      const r = (Math.random() * 16) | 0;

      const v = c === 'x' ? r : (r & 0x3) | 0x8;

      return v.toString(16);

    });

  }



  function createEl(html) {

    const div = document.createElement('div');

    div.innerHTML = html.trim();

    return div.firstChild;

  }



  function escapeXml(str) {

    if (!str) return '';

    return str.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

  }



  async function fetchAsArrayBuffer(url, useProxyIfFail = true) {

    try {

      const res = await fetch(url);

      if (!res.ok) throw new Error('Fetch failed ' + res.status);

      return await res.arrayBuffer();

    } catch (err) {

      dbg('Direct fetch failed for', url, err);

      if (useProxyIfFail && CONFIG.corsProxy) {

        try {

          // If proxy looks like it expects full URL appended directly, don't add extra slash

          const proxyPrefix = CONFIG.corsProxy;

          const sep = proxyPrefix.endsWith('/') ? '' : '/';

          const proxyUrl = proxyPrefix + sep + url;

          const res2 = await fetch(proxyUrl);

          if (!res2.ok) throw new Error('Proxy fetch failed ' + res2.status);

          return await res2.arrayBuffer();

        } catch (err2) {

          dbg('Proxy fetch failed', err2);

          throw err2;

        }

      } else {

        throw err;

      }

    }

  }



  /************************************************************************

   *  STYLES + UI

   ************************************************************************/

  const FLOAT_ID = 'we-epub-float-v2';

  const MODAL_ID = 'we-epub-modal-v2';

  function insertStyles() {

    if (document.getElementById('we-epub-styles')) return;

    const style = document.createElement('style');

    style.id = 'we-epub-styles';

    style.textContent = `

#${FLOAT_ID} {

  position: fixed;

  width: ${CONFIG.buttonSize}px;

  height: ${CONFIG.buttonSize}px;

  border-radius: 50%;

  background: linear-gradient(135deg,#2b8cff,#6a5cff);

  box-shadow: 0 6px 18px rgba(0,0,0,0.28);

  display:flex;

  align-items:center;

  justify-content:center;

  z-index:2147483646;

  color:white;

  font-weight:700;

  font-family:system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;

  -webkit-tap-highlight-color: transparent;

  touch-action: none;

  user-select:none;

}

#${FLOAT_ID} .icon { font-size: 16px; transform: translateY(-1px); pointer-events:none; }

#${FLOAT_ID}:active { transform: scale(0.98); }



/* Modal */

#${MODAL_ID} {

  position: fixed;

  left:0; right:0; top:0; bottom:0;

  z-index:2147483647;

  display:none;

  align-items:stretch;

  justify-content:center;

  background: rgba(0,0,0,0.35);

  -webkit-overflow-scrolling: touch;

}

#${MODAL_ID} .panel {

  margin:auto;

  width: min(980px, 96%);

  /* ensure panel doesn't extend to top/bottom toolbar area: leave at least 2x buttonSize free */

  max-height: calc(100vh - (${CONFIG.buttonSize * 2}px) - 40px);

  background: #fff;

  border-radius: 12px;

  overflow:auto;

  padding: 12px;

  box-shadow: 0 12px 30px rgba(0,0,0,0.3);

  display:flex;

  flex-direction:column;

}

#${MODAL_ID} header { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;}

#${MODAL_ID} header h2 { margin:0; font-size:15px; }

#${MODAL_ID} .close-btn { background:transparent; border:none; font-size:20px; }

#${MODAL_ID} .content { flex:1 1 auto; overflow:auto; padding:6px 2px; }

#${MODAL_ID} .images-grid { display:flex; flex-wrap:wrap; gap:8px; overflow:auto; /* show scrollbar if more than two rows */ max-height: calc((120px + 48px) * 2); }

#${MODAL_ID} .img-card { border:1px solid #e6e6e6; border-radius:8px; padding:6px; width: calc(50% - 8px); box-sizing:border-box; text-align:center; font-size:12px; }

@media(min-width:520px){ #${MODAL_ID} .img-card { width: calc(33.333% - 8px); } }

#${MODAL_ID} .img-card img { max-width:100%; height:120px; object-fit:cover; border-radius:6px; display:block; margin:0 auto 6px; }

#${MODAL_ID} .controls { display:flex; flex-direction:column; gap:8px; margin-top:8px; }

#${MODAL_ID} .actions { display:flex; gap:8px; justify-content: flex-end; margin-top:12px; }

#${MODAL_ID} button.btn { padding:8px 12px; border-radius:8px; border: none; background:#2b8cff; color: white; font-weight:600; font-size:14px; }

#${MODAL_ID} button.ghost { background:transparent; color:#444; border:1px solid #ddd; }

#${MODAL_ID} input[type="file"] { display:block; }

#${MODAL_ID} label.small { font-size:12px; color:#666; }

#${MODAL_ID} .meta-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

#${MODAL_ID} .progress { height:6px; background:#eee; border-radius:6px; overflow:hidden; }

#${MODAL_ID} .progress > i { display:block; height:100%; width:0%; background:linear-gradient(90deg,#2b8cff,#6a5cff); }

#${MODAL_ID} input[type="text"], input[type="url"] { padding:8px; border-radius:6px; border:1px solid #ddd; width:100%; box-sizing:border-box;}

#${MODAL_ID} .preview { border:1px solid #eee; padding:8px; border-radius:8px; max-height:220px; overflow:auto; background:#fafafa; font-size:14px; color:#111; }



/* Paste area */

#we-cover-paste-area { border:1px dashed #ddd; border-radius:8px; padding:8px; min-height:44px; display:flex; align-items:center; gap:8px; cursor:text; }

#we-cover-paste-area[contenteditable="true"]:empty:before { content: attr(data-placeholder); color:#999; font-size:13px; }

#we-cover-paste-preview { max-height:80px; max-width:120px; border-radius:6px; object-fit:cover; border:1px solid #eee; }

#we-cover-paste-controls { display:flex; gap:8px; align-items:center; }



`;

    document.head.appendChild(style);

  }



  /************************************************************************

   *  Floating Button (small + draggable + tap detection)

   ************************************************************************/

  function addFloatingButton() {

    if (document.getElementById(FLOAT_ID)) return;

    insertStyles();



    const btn = document.createElement('div');

    btn.id = FLOAT_ID;

    btn.innerHTML = `<span class="icon">EP</span>`;



    // initial placement: try load from storage

    const saved = localStorage.getItem(CONFIG.persistButtonPositionKey);

    if (saved) {

        try {

            const pos = JSON.parse(saved);

            if (pos.left && pos.top) {

                btn.style.left = pos.left;

                btn.style.top = pos.top;

                btn.style.position = 'fixed';

            } else {

                positionDefault(btn);

            }

        } catch (e) {

            positionDefault(btn);

        }

    } else {

        positionDefault(btn);

    }

    document.body.appendChild(btn);



    // Drag + Tap handling

    let dragging = false;

    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    let touchStartTime = 0;

    let moved = false;

    let isPointerDownOnButton = false; // NEW FLAG



    function pointerStart(clientX, clientY) {

        const rect = btn.getBoundingClientRect();

        origLeft = rect.left;

        origTop = rect.top;

        startX = clientX;

        startY = clientY;

        touchStartTime = Date.now();

        moved = false;

    }



    function pointerMove(clientX, clientY) {

        const dx = clientX - startX;

        const dy = clientY - startY;

        if (Math.abs(dx) > CONFIG.tapMaxMovement || Math.abs(dy) > CONFIG.tapMaxMovement) {

            moved = true;

            dragging = true;

            const left = origLeft + dx;

            const top = origTop + dy;

            btn.style.left = Math.max(4, Math.min(window.innerWidth - btn.offsetWidth - 4, left)) + 'px';

            btn.style.top = Math.max(4, Math.min(window.innerHeight - btn.offsetHeight - 4, top)) + 'px';

            btn.style.right = '';

            btn.style.bottom = '';

            btn.style.position = 'fixed';

        }

    }



    function pointerEnd() {

        const duration = Date.now() - touchStartTime;

        if (!moved && duration <= CONFIG.tapMaxDuration) {

            openModal(); // treat as tap

        } else {

            // save position after drag

            const rect = btn.getBoundingClientRect();

            try {

                localStorage.setItem(CONFIG.persistButtonPositionKey, JSON.stringify({ left: rect.left + 'px', top: rect.top + 'px' }));

            } catch (e) { /* ignore */ }

        }

        dragging = false;

        moved = false;

    }



    // Touch events

    btn.addEventListener('touchstart', (e) => {

        const t = e.touches[0];

        isPointerDownOnButton = true; // NEW

        pointerStart(t.clientX, t.clientY);

        e.stopPropagation();

    }, { passive: false });



    document.addEventListener('touchmove', (e) => {

        if (!isPointerDownOnButton) return; // NEW CHECK

        if (typeof e.touches === 'undefined' || e.touches.length === 0) return;

        const t = e.touches[0];

        pointerMove(t.clientX, t.clientY);

        if (dragging) e.preventDefault();

    }, { passive: false });



    document.addEventListener('touchend', () => {

        if (!isPointerDownOnButton) return; // NEW CHECK

        pointerEnd();

        isPointerDownOnButton = false; // RESET

    });



    // Mouse events

    btn.addEventListener('mousedown', (e) => {

        isPointerDownOnButton = true; // NEW

        pointerStart(e.clientX, e.clientY);

        e.preventDefault();

    });



    document.addEventListener('mousemove', (e) => {

        if (!isPointerDownOnButton) return; // NEW CHECK

        pointerMove(e.clientX, e.clientY);

    });



    document.addEventListener('mouseup', () => {

        if (!isPointerDownOnButton) return; // NEW CHECK

        pointerEnd();

        isPointerDownOnButton = false; // RESET

    });



    // Fallback click (keyboard/accessibility)

    btn.addEventListener('click', (e) => {

        if (!moved) openModal();

    });

}



function positionDefault(el) {

    el.style.right = '14px';

    el.style.bottom = '14px';

    el.style.position = 'fixed';

}



  /************************************************************************

   *  Modal UI

   ************************************************************************/

  // store pasted cover blob in closure variable for use during generation

  let __we_pasted_cover = null; // { blob, name?, type? }



  function addModal() {

    if (document.getElementById(MODAL_ID)) return;

    insertStyles();



    const modal = createEl(`

<div id="${MODAL_ID}">

  <div class="panel" role="dialog" aria-modal="true">

    <header>

      <h2>Create EPUB — ${location.hostname.replace(/^www\\./,'')}</h2>

      <div>

        <button class="close-btn" title="Close">&times;</button>

      </div>

    </header>

    <div class="content">

      <div class="meta-row">

        <div style="flex:1">

          <label class="small">Title</label>

          <input id="we-title" type="text" placeholder="Title">

        </div>

        <div style="width:140px">

          <label class="small">Author</label>

          <input id="we-author" type="text" placeholder="Author">

        </div>

      </div>



      <div style="margin-top:10px">

        <label class="small">Detected article preview</label>

        <div id="we-preview" class="preview"></div>

      </div>



      <div style="margin-top:10px">

        <label class="small">Detected images (pick one for cover)</label>

        <div class="images-grid" id="we-images"></div>



        <div style="margin-top:8px" class="controls">

          <label class="small">Or upload a local image for cover</label>

          <input id="we-cover-upload" type="file" accept="image/*">



          <label class="small">Or paste image from clipboard (Ctrl+V / long-press → Paste)</label>

          <div id="we-cover-paste-area" contenteditable="true" data-placeholder="Click here and press Ctrl+V, or long-press and paste on mobile.">

            <img id="we-cover-paste-preview" alt="" style="display:none">

            <div id="we-cover-paste-controls" style="margin-left:6px">

              <button id="we-cover-clear" type="button" class="ghost" style="display:none">Clear</button>

            </div>

          </div>



          <label class="small">Or paste image URL</label>

          <input id="we-cover-url" type="url" placeholder="https://example.com/cover.jpg">

          <div style="display:flex; gap:8px; align-items:center; margin-top:6px;">

            <input id="we-use-proxy" type="checkbox" checked> <label class="small">Use proxy if CORS blocks image fetch</label>

          </div>

        </div>

      </div>



      <div style="margin-top:10px">

        <label class="small">Options</label>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">

          <label><input id="we-include-images" type="checkbox" checked> Include images</label>

          <label><input id="we-single-chapter" type="checkbox" checked> Single chapter</label>

          <label title="Remove common noise like author boxes"> <input id="we-strong-filter" type="checkbox" checked> Strong filtering</label>

        </div>

      </div>



      <div style="margin-top:10px">

        <div class="progress" id="we-progress" aria-hidden="true" style="display:none"><i></i></div>

        <div id="we-log" style="font-size:12px;color:#666;margin-top:6px;min-height:18px;"></div>

      </div>

    </div>



    <div class="actions">

      <button class="btn ghost" id="we-cancel">Close</button>

      <button class="btn" id="we-generate">Generate EPUB</button>

    </div>

  </div>

</div>

`);

    document.body.appendChild(modal);



    // event bindings

    modal.querySelector('.close-btn').addEventListener('click', closeModal);

    modal.querySelector('#we-cancel').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { if (e.target.id === MODAL_ID) closeModal(); });



    document.getElementById('we-generate').addEventListener('click', onGenerateClicked);



    // paste handling for cover - allow both clicking into area and global paste when modal open

    const pasteArea = document.getElementById('we-cover-paste-area');

    const pastePreview = document.getElementById('we-cover-paste-preview');

    const clearBtn = document.getElementById('we-cover-clear');



    function clearPastedCover() {

      __we_pasted_cover = null;

      pastePreview.style.display = 'none';

      pastePreview.src = '';

      clearBtn.style.display = 'none';

      // keep contenteditable empty visually

      pasteArea.innerText = '';

    }



    clearBtn.addEventListener('click', (ev) => { ev.preventDefault(); clearPastedCover(); });



    async function handlePasteEvent(e) {

      try {

        if (!document.getElementById(MODAL_ID) || document.getElementById(MODAL_ID).style.display !== 'flex') return; // only when modal open

        const items = (e.clipboardData && e.clipboardData.items) || [];

        for (let i = 0; i < items.length; i++) {

          const item = items[i];

          if (item.kind === 'file' && item.type && item.type.startsWith('image')) {

            const blob = item.getAsFile();

            if (blob) {

              __we_pasted_cover = { blob, type: blob.type || 'image/png', name: blob.name || 'pasted.png' };

              const url = URL.createObjectURL(blob);

              pastePreview.src = url;

              pastePreview.style.display = 'block';

              clearBtn.style.display = 'inline-block';

              // show filename or remove placeholder text

              pasteArea.dataset.placeholder = '';

              e.preventDefault();

              return; // take first image only

            }

          }

        }

        // fallback: if clipboard has html or text with image URL, try to detect and show preview

        if (e.clipboardData) {

          const text = e.clipboardData.getData('text/plain') || e.clipboardData.getData('text/html');

          if (text && text.trim().match(/^https?:\/\/\S+\.(jpe?g|png|gif|webp|svg)(\?\S*)?$/i)) {

            const url = text.trim();

            pastePreview.src = url;

            pastePreview.style.display = 'block';

            clearBtn.style.display = 'inline-block';

            // store as URL (we'll fetch later using proxy if necessary)

            __we_pasted_cover = { url };

            e.preventDefault();

          }

        }

      } catch (err) { dbg('paste err', err); }

    }



    // attach event listeners

    pasteArea.addEventListener('paste', handlePasteEvent);

    // also listen on document while modal open to catch global paste events (e.g., user presses Ctrl+V without focusing area)

    document.addEventListener('paste', handlePasteEvent);



    // clicking area focuses it (helpful on mobile to bring up paste option)

    pasteArea.addEventListener('click', () => { pasteArea.focus(); });

  }



  function openModal() {

    addModal();

    const modal = document.getElementById(MODAL_ID);

    modal.style.display = 'flex';

    // populate fields

    populatePreviewAndImages();

  }



  function closeModal() {

    const modal = document.getElementById(MODAL_ID);

    if (modal) modal.style.display = 'none';

  }



  /************************************************************************

   *  Content extraction + STRONG FILTERING

   ************************************************************************/

  function extractArticle() {

    try {

      const docClone = document.cloneNode(true);

      docClone.querySelectorAll('script, style, noscript, link[rel="preload"]').forEach(n => n.remove());

      const parsed = new Readability(docClone).parse();

      return parsed;

    } catch (e) {

      dbg('Readability error', e);

      return null;

    }

  }



  // Compute link density and remove nodes with high link ratio (common ad/sidebar pattern)

  function removeHighLinkDensityNodes(container) {

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, null, false);

    const toRemove = [];

    while (walker.nextNode()) {

      const el = walker.currentNode;

      if (el.tagName && ['P','DIV','SECTION','ARTICLE','ASIDE'].includes(el.tagName)) {

        const links = el.querySelectorAll('a').length;

        const text = el.textContent || '';

        const textLen = text.trim().length;

        if (textLen > 0 && links / (textLen / 100) > 1.2) { // heuristic: too many links relative to text

          toRemove.push(el);

        }

      }

    }

    toRemove.forEach(n => n.remove());

  }



  // Remove common ad-like selectors & tiny nodes

  function removeNoiseSelectors(container) {

    const selectors = [

      'nav', 'header', 'footer', 'aside', 'form', 'iframe', 'noscript',

      '[role="navigation"]', '[role="complementary"]',

      '.advert', '.ads', '.ad', '.adsbygoogle', '[id*="ad-"]', '[class*="ad-"]',

      '.share', '.sharing', '.social', '.related', '.related-articles', '.promo',

      '.cookie', '.cookies', '.newsletter', '.subscribe', '.subscribe-box',

      '.breadcrumb', '.breadcrumbs', '.comments', '#comments', '.comment'

    ];

    selectors.forEach(sel => {

      container.querySelectorAll(sel).forEach(n => n.remove());

    });



    // Remove tiny blocks (under 30 chars) that don't contain images

    container.querySelectorAll('div, p, section').forEach(n => {

      const text = (n.textContent || '').trim();

      if ((text.length < 30) && !n.querySelector('img') && !n.querySelector('video')) {

        const imgs = n.querySelectorAll('img').length;

        if (imgs === 0) n.remove();

      }

    });

  }



  function strongFilter(htmlString) {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = htmlString;

    removeNoiseSelectors(wrapper);

    removeHighLinkDensityNodes(wrapper);

    wrapper.querySelectorAll('*').forEach(el => {

      [...el.attributes].forEach(attr => {

        if (/^on/i.test(attr.name) || /analytics|tracking/.test(attr.name)) el.removeAttribute(attr.name);

      });

    });

    wrapper.querySelectorAll('img').forEach(img => {

      const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy') || '';

      if (src && !/^https?:\/\//i.test(src)) {

        try {

          img.setAttribute('src', new URL(src, location.href).href);

        } catch (e) { /* ignore */ }

      }

    });

    return wrapper.innerHTML;

  }



  function postProcessContent(htmlString) {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = htmlString;



    wrapper.querySelectorAll('form, nav, header, footer, aside, .breadcrumb, .breadcrumbs, .nav, .sidebar, .advertisement, .ads').forEach(n => n.remove());

    wrapper.querySelectorAll('*').forEach(el => {

      [...el.attributes].forEach(attr => {

        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);

      });

    });

    wrapper.querySelectorAll('img').forEach(img => {

      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';

      if (src && !/^https?:\/\//i.test(src)) {

        try {

          const abs = new URL(src, location.href).href;

          img.setAttribute('src', abs);

        } catch (e) { /* ignore */ }

      }

    });

    return wrapper.innerHTML;

  }



  /************************************************************************

   *  IMAGE DETECTION & MAPPING

   ************************************************************************/

  async function detectImages(articleHTML) {

    const doc = document.implementation.createHTMLDocument('imgdetector');

    doc.body.innerHTML = articleHTML || '';

    const imgs = Array.from(doc.querySelectorAll('img'))

      .map(img => img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy') || '')

      .filter(Boolean);



    const pageImgs = Array.from(document.images).map(i => i.src).filter(Boolean);



    let candidates = Array.from(new Set([...imgs, ...pageImgs]));



    const checked = [];

    for (let i = 0; i < candidates.length && checked.length < CONFIG.maxImageCandidates; i++) {

      const src = candidates[i];

      if (!src) continue;

      try {

        const el = document.createElement('img');

        el.style.position = 'fixed';

        el.style.left = '-9999px';

        el.style.width = 'auto';

        el.style.height = 'auto';

        el.src = src;

        document.body.appendChild(el);

        const meta = await new Promise((resolve) => {

          let finished = false;

          const t = setTimeout(() => {

            if (!finished) { finished = true; resolve({ src, w: el.naturalWidth || 0, h: el.naturalHeight || 0, ok:false }); }

          }, 2500);

          el.onload = () => {

            if (!finished) { finished = true; clearTimeout(t); resolve({ src, w: el.naturalWidth, h: el.naturalHeight, ok:true }); }

          };

          el.onerror = () => {

            if (!finished) { finished = true; clearTimeout(t); resolve({ src, w: el.naturalWidth || 0, h: el.naturalHeight || 0, ok:false }); }

          };

        });

        document.body.removeChild(el);

        if (meta.w * meta.h >= CONFIG.minImageArea) checked.push(meta.src);

      } catch (e) {

        dbg('img detect err', e);

      }

    }

    return checked;

  }



  /************************************************************************

   *  EPUB ASSEMBLY

   ************************************************************************/

  function makeContainerXml() {

    return `<?xml version="1.0" encoding="UTF-8"?>

<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">

  <rootfiles>

    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>

  </rootfiles>

</container>`;

  }



  function makeOpf(metadata, manifestItems, spineItems) {

    const nowISO = new Date().toISOString();

    const manifest = manifestItems.map(m => `    <item id="${m.id}" href="${m.href}" media-type="${m['media-type']}"/>`).join('\n');

    const spine = spineItems.map(s => `    <itemref idref="${s}"/>`).join('\n');

    return `<?xml version="1.0" encoding="utf-8"?>

<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">

  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">

    <dc:title>${escapeXml(metadata.title)}</dc:title>

    <dc:language>${metadata.language}</dc:language>

    <dc:identifier id="BookId">urn:uuid:${metadata.uuid}</dc:identifier>

    <dc:creator>${escapeXml(metadata.creator)}</dc:creator>

    <dc:publisher>${escapeXml(metadata.publisher)}</dc:publisher>

    <dc:date>${nowISO}</dc:date>

  </metadata>

  <manifest>

${manifest}

    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>

  </manifest>

  <spine toc="ncx">

${spine}

  </spine>

</package>`;

  }



  function makeNcx(metadata, navPoints) {

    const nav = navPoints.map((n, i) => `

    <navPoint id="navPoint-${i+1}" playOrder="${i+1}">

      <navLabel><text>${escapeXml(n.label)}</text></navLabel>

      <content src="${n.src}"/>

    </navPoint>`).join('\n');

    return `<?xml version="1.0" encoding="utf-8"?>

<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">

  <head>

    <meta name="dtb:uid" content="urn:uuid:${metadata.uuid}"/>

    <meta name="dtb:depth" content="1"/>

  </head>

  <docTitle><text>${escapeXml(metadata.title)}</text></docTitle>

  <docAuthor><text>${escapeXml(metadata.creator)}</text></docAuthor>

  <navMap>

${nav}

  </navMap>

</ncx>`;

  }



  function wrapAsXHtml(title, htmlContent) {

    return `<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"

  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

  <head>

    <title>${escapeXml(title)}</title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <style type="text/css">

      body { font-family: serif; line-height:1.5; padding: 1em; color:#111; }

      img { max-width:100%; height:auto; display:block; margin:0.5em auto; }

      figure { margin: 0; padding:0; }

      figcaption { font-size:0.9em; color:#555; text-align:center; margin-bottom:8px; }

    </style>

  </head>

  <body>

    <h1>${escapeXml(title)}</h1>

    ${htmlContent}

  </body>

</html>`;

  }



  async function collectImagesToEmbed(imageSources, includeImages, coverBlobPromise, useProxy) {

    const images = [];

    // cover first if provided

    if (coverBlobPromise) {

      try {

        const cover = await coverBlobPromise;

        if (cover) images.push({ filename: 'images/cover' + (cover.ext ? '.' + cover.ext : '.jpg'), arrayBuffer: cover.ab, 'media-type': cover.mime, cover: true, originalSrc: cover.originalSrc || null });

      } catch (e) {

        dbg('cover fetch failed', e);

      }

    }



    if (!includeImages) return images;



    const seen = new Set();

    for (const src of imageSources) {

      if (!src || seen.has(src)) continue;

      seen.add(src);

      try {

        const ab = await fetchAsArrayBuffer(src, useProxy);

        const extMatch = src.split('?')[0].match(/\.(jpe?g|png|gif|webp|svg)$/i);

        const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

        const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'jpg' ? 'image/jpeg' : 'image/' + ext);

        images.push({ filename: 'images/' + uid('img-') + '.' + ext, arrayBuffer: ab, 'media-type': mime, originalSrc: src });

      } catch (e) {

        dbg('failed to fetch image', src, e);

      }

    }

    return images;

  }



  /************************************************************************

   *  Populate preview & images

   ************************************************************************/

  function populatePreviewAndImages() {

    const titleInput = document.getElementById('we-title');

    const authorInput = document.getElementById('we-author');

    const preview = document.getElementById('we-preview');

    const imagesGrid = document.getElementById('we-images');



    const article = extractArticle();

    if (!article) {

      titleInput.value = document.title || '';

      authorInput.value = '';

      preview.innerHTML = `<i style="color:#999">Could not extract article content on this page.</i>`;

      imagesGrid.innerHTML = `<div style="color:#999">No images detected.</div>`;

      return;

    }



    titleInput.value = article.title || document.title || '';

    authorInput.value = article.byline || '';



    const strong = document.getElementById('we-strong-filter') ? document.getElementById('we-strong-filter').checked : true;

    const previewHtml = strong ? strongFilter(article.excerpt || article.textContent.slice(0, 800)) : postProcessContent(article.excerpt || article.textContent.slice(0, 800));

    preview.innerHTML = previewHtml;



    imagesGrid.innerHTML = `<div style="color:#777">Detecting images…</div>`;

    detectImages(article.content || '').then(list => {

      imagesGrid.innerHTML = '';

      if (!list.length) {

        imagesGrid.innerHTML = `<div style="color:#999">No large images detected.</div>`;

        return;

      }

      list.forEach((src, idx) => {

        const card = document.createElement('div');

        card.className = 'img-card';

        const id = uid('radio-');

        card.innerHTML = `

          <img src="${src}" alt="img-${idx}" crossorigin="anonymous">

          <div style="display:flex; gap:8px; align-items:center; justify-content:center">

            <input type="radio" name="we-cover" id="${id}" value="${encodeURIComponent(src)}">

            <label for="${id}" style="font-size:12px">Use as cover</label>

          </div>

        `;

        imagesGrid.appendChild(card);

      });

    }).catch(err => {

      dbg('detectImages failed', err);

      imagesGrid.innerHTML = `<div style="color:#999">Image detection failed.</div>`;

    });

  }



  /************************************************************************

   *  Zip / generate handler

   ************************************************************************/

  async function onGenerateClicked() {

    const genBtn = document.getElementById('we-generate');

    const log = document.getElementById('we-log');

    const progress = document.getElementById('we-progress');

    genBtn.disabled = true;

    log.textContent = 'Preparing…';

    progress.style.display = 'block'; progress.querySelector('i').style.width = '8%';



    try {

      const title = document.getElementById('we-title').value || document.title || 'webpage';

      const author = document.getElementById('we-author').value || '';

      const includeImages = document.getElementById('we-include-images').checked;

      const singleChapter = document.getElementById('we-single-chapter').checked;

      const strongFiltering = document.getElementById('we-strong-filter').checked;

      const useProxy = document.getElementById('we-use-proxy').checked;



      const article = extractArticle();

      if (!article) throw new Error('Could not extract article content. Try again on a simpler article page.');



      progress.querySelector('i').style.width = '20%';



      // cover selection

      const selectedRadio = document.querySelector('input[name="we-cover"]:checked');

      const coverUploadFile = document.getElementById('we-cover-upload').files && document.getElementById('we-cover-upload').files[0];

      const coverUrl = document.getElementById('we-cover-url').value.trim();



      let coverBlobPromise = null;

      if (coverUploadFile) {

        coverBlobPromise = (async () => {

          const fr = new FileReader();

          return new Promise((resolve, reject) => {

            fr.onload = () => {

              const ab = fr.result;

              const ext = (coverUploadFile.name.split('.').pop() || 'jpg').toLowerCase();

              const mime = coverUploadFile.type || (ext === 'png' ? 'image/png' : 'image/jpeg');

              resolve({ ext, ab, mime, originalSrc: null });

            };

            fr.onerror = () => reject(new Error('Failed to read upload'));

            fr.readAsArrayBuffer(coverUploadFile);

          });

        })();

      } else if (coverUrl) {

        coverBlobPromise = (async () => {

          const ab = await fetchAsArrayBuffer(coverUrl, useProxy);

          const extMatch = coverUrl.split('?')[0].match(/\.(jpe?g|png|gif|webp|svg)$/i);

          const ext = extMatch ? extMatch[1] : 'jpg';

          const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'jpg' ? 'image/jpeg' : 'image/' + ext);

          return { ext, ab, mime, originalSrc: coverUrl };

        })();

      } else if (selectedRadio) {

        const src = decodeURIComponent(selectedRadio.value);

        coverBlobPromise = (async () => {

          const ab = await fetchAsArrayBuffer(src, useProxy);

          const extMatch = src.split('?')[0].match(/\.(jpe?g|png|gif|webp|svg)$/i);

          const ext = extMatch ? extMatch[1] : 'jpg';

          const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'jpg' ? 'image/jpeg' : 'image/' + ext);

          return { ext, ab, mime, originalSrc: src };

        })();

      } else if (__we_pasted_cover) {

        // If user pasted an image, use it as cover. __we_pasted_cover may be { blob } or { url }

        if (__we_pasted_cover.blob) {

          coverBlobPromise = (async () => {

            const blob = __we_pasted_cover.blob;

            const ab = await blob.arrayBuffer();

            const mime = blob.type || 'image/png';

            const ext = mime.split('/')[1] ? mime.split('/')[1].split('+')[0] : 'png';

            return { ext, ab, mime, originalSrc: null };

          })();

        } else if (__we_pasted_cover.url) {

          const pastedUrl = __we_pasted_cover.url;

          coverBlobPromise = (async () => {

            const ab = await fetchAsArrayBuffer(pastedUrl, useProxy);

            const extMatch = pastedUrl.split('?')[0].match(/\.(jpe?g|png|gif|webp|svg)$/i);

            const ext = extMatch ? extMatch[1] : 'jpg';

            const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'jpg' ? 'image/jpeg' : 'image/' + ext);

            return { ext, ab, mime, originalSrc: pastedUrl };

          })();

        }

      } else {

        coverBlobPromise = null;

      }



      progress.querySelector('i').style.width = '30%';

      log.textContent = 'Collecting images…';



      // sanitize content

      const rawContent = article.content || '';

      const sanitizedContent = strongFiltering ? strongFilter(rawContent) : postProcessContent(rawContent);



      // find image srcs in sanitized content preserving order

      const tmpDoc = document.implementation.createHTMLDocument('san');

      tmpDoc.body.innerHTML = sanitizedContent;

      const articleImgSrcs = Array.from(tmpDoc.querySelectorAll('img')).map(i => i.src).filter(Boolean);



      // collect images to embed (cover + article images)

      const imagesToEmbed = await collectImagesToEmbed(articleImgSrcs, includeImages, coverBlobPromise, useProxy);

      progress.querySelector('i').style.width = '55%';

      log.textContent = `Embedding ${imagesToEmbed.length} images (if any)…`;



      // build mapping from originalSrc -> internal filename

      const srcMap = {};

      imagesToEmbed.forEach(img => {

        if (img.originalSrc) srcMap[img.originalSrc] = img.filename;

        if (img.cover && img.originalSrc) srcMap[img.originalSrc] = img.filename;

      });



      // filename base mapping fallback

      for (const img of imagesToEmbed) {

        if (!img.originalSrc) continue;

        const base = img.originalSrc.split('?')[0].split('/').pop();

        if (base) {

          srcMap[base] = img.filename;

        }

      }



      // Replace image src in content with internal refs

      let finalContent = sanitizedContent;

      Object.keys(srcMap).forEach(orig => {

        try {

          const decoded = decodeURIComponent(orig);

          finalContent = finalContent.split(orig).join(srcMap[orig]);

          if (decoded !== orig) finalContent = finalContent.split(decoded).join(srcMap[orig]);

        } catch (e) {

          finalContent = finalContent.split(orig).join(srcMap[orig]);

        }

      });



      // fallback: replace by base filename occurrences

      imagesToEmbed.forEach(img => {

        try {

          const base = img.originalSrc ? img.originalSrc.split('?')[0].split('/').pop() : null;

          if (base) finalContent = finalContent.split(base).join(img.filename);

        } catch (e) { /* ignore */ }

      });



      progress.querySelector('i').style.width = '70%';



      // Build EPUB zip

      const zip = new JSZip();

      zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

      zip.folder('META-INF').file('container.xml', makeContainerXml());

      const oebps = zip.folder('OEBPS');



      // images folder

      const imagesFolder = oebps.folder('images');

      const manifestItems = [];

      const spineItems = [];



      // add images to zip and manifest

      for (const img of imagesToEmbed) {

        const fname = img.filename.replace(/^images\//i, '');

        imagesFolder.file(fname, img.arrayBuffer || img.ab);

        const mediaType = img['media-type'] || img.mime || 'image/jpeg';

        const id = uid('img-');

        manifestItems.push({ id, href: 'images/' + fname, 'media-type': mediaType });

        if (img.cover) manifestItems.push({ id: 'cover', href: 'images/' + fname, 'media-type': mediaType });

      }



      // create chapter(s)

      const textFolder = oebps.folder('text');

      if (singleChapter) {

        textFolder.file('chapter1.xhtml', wrapAsXHtml(title, finalContent));

        manifestItems.push({ id: 'chap1', href: 'text/chapter1.xhtml', 'media-type': 'application/xhtml+xml' });

        spineItems.push('chap1');

      } else {

        const docTmp = document.implementation.createHTMLDocument('split');

        docTmp.body.innerHTML = finalContent;

        const sections = [];

        let current = { title: title, html: '' };

        Array.from(docTmp.body.childNodes).forEach(node => {

          if (node.nodeType === 1 && /^H[12]$/i.test(node.tagName)) {

            sections.push(current);

            current = { title: node.textContent.trim() || ('Part ' + (sections.length + 1)), html: '' };

          } else {

            current.html += node.outerHTML || node.textContent || '';

          }

        });

        sections.push(current);

        sections.forEach((s, i) => {

          const fname = `text/chapter${i + 1}.xhtml`;

          textFolder.file(`chapter${i + 1}.xhtml`, wrapAsXHtml(s.title, s.html));

          manifestItems.push({ id: `chap${i + 1}`, href: `text/chapter${i + 1}.xhtml`, 'media-type': 'application/xhtml+xml' });

          spineItems.push(`chap${i + 1}`);

        });

      }



      // add content.opf and toc.ncx

      const metadata = {

        title,

        creator: author,

        publisher: CONFIG.publisher,

        language: CONFIG.language,

        uuid: generateUUID()

      };



      // write styles (optional small file)

      oebps.file('styles.css', 'body{font-family:serif;}');



      oebps.file('content.opf', makeOpf(metadata, manifestItems, spineItems));



      const navPoints = spineItems.map((s, idx) => ({ label: title + (idx ? ' - ' + (idx + 1) : ''), src: `text/chapter${idx + 1}.xhtml` }));

      oebps.file('toc.ncx', makeNcx(metadata, navPoints));



      progress.querySelector('i').style.width = '85%';

      log.textContent = 'Zipping and generating EPUB…';



      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' }, (meta) => {

        const p = Math.floor(meta.percent);

        progress.querySelector('i').style.width = Math.min(95, 85 + (p / 100) * 10) + '%';

      });



      const safe = safeFilename(title);

      saveAs(blob, `${safe}.epub`);

      progress.querySelector('i').style.width = '100%';

      log.textContent = 'Done — EPUB downloaded.';

    } catch (err) {

      dbg('generate err', err);

      const logEl = document.getElementById('we-log');

      if (logEl) logEl.textContent = 'Error: ' + (err.message || String(err));

      else console.error(err);

    } finally {

      const genBtn = document.getElementById('we-generate');

      if (genBtn) genBtn.disabled = false;

      setTimeout(() => {

        const pbar = document.getElementById('we-progress');

        if (pbar) pbar.style.display = 'none';

      }, 1500);

    }

  }



  /************************************************************************

   *  Boot

   ************************************************************************/

  function boot() {

    try {

      addFloatingButton();

      addModal();

    } catch (e) {

      dbg('boot error', e);

    }

  }



  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', boot);

  } else {

    boot();

  }



})();


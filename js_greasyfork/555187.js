// ==UserScript==
// @name         DailyBoats Gallery Fix (Lightbox)
// @namespace    https://github.com/FairlyIncognito/DailyBoatsGalleryFix
// @version      1.0.1
// @description  Replaces "open image in same tab" with a proper lightbox gallery (keyboard + touch + captions + preload).
// @match        https://dailyboats.com/*
// @run-at       document-idle
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555187/DailyBoats%20Gallery%20Fix%20%28Lightbox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555187/DailyBoats%20Gallery%20Fix%20%28Lightbox%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Config (edit if their HTML changes) ---
  const selector = '.boat-images a[href$=".jpg"], .boat-images a[href$=".jpeg"], .boat-images a[href$=".png"]';
  const closeOnBackdrop = true;

  // Runs once DOM is stable; if content is injected later, MutationObserver below rebinds
  function initGallery() {
    const links = Array.from(document.querySelectorAll(selector));
    if (!links.length) return;

    // Prevent double init
    if (document.querySelector('.gf-overlay')) return;

    const items = links.map(a => ({
      src: a.href,
      caption: a.getAttribute('title') || (a.querySelector('img')?.getAttribute('alt')) || ''
    }));

    // Inject styles
    const css = `
      .gf-overlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:2147483000}
      .gf-overlay.is-open{display:flex}
      .gf-wrap{position:relative;max-width:min(96vw,1400px);max-height:90vh;width:fit-content}
      .gf-img{max-width:96vw;max-height:80vh;display:block;margin:auto;box-shadow:0 10px 40px rgba(0,0,0,.5);border-radius:8px}
      .gf-ui{position:absolute;left:0;right:0;top:100%;display:flex;justify-content:space-between;align-items:center;color:#eee;font:14px/1.4 system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin-top:.5rem}
      .gf-caption{flex:1;opacity:.9;word-break:break-word;padding-right:.5rem}
      .gf-ctr{opacity:.7;white-space:nowrap}
      .gf-btn{position:absolute;top:50%;transform:translateY(-50%);border:none;background:rgba(0,0,0,.35);color:#fff;font-size:28px;width:42px;height:64px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center}
      .gf-btn:hover{background:rgba(255,255,255,.18)}
      .gf-prev{left:-56px}
      .gf-next{right:-56px}
      @media (max-width: 768px){ .gf-prev{left:6px} .gf-next{right:6px} }
      .gf-close{position:absolute;top:-48px;right:0;border:none;background:rgba(0,0,0,.35);color:#fff;width:40px;height:40px;border-radius:999px;font-size:22px;cursor:pointer}
      .gf-close:hover{background:rgba(255,255,255,.18)}
      .gf-hint{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);color:#aaa;font:12px system-ui}
      .gf-hide-scroll{overflow:hidden!important;touch-action:none}
      .gf-zoomable{cursor:zoom-in}
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Overlay DOM
    const overlay = document.createElement('div');
    overlay.className = 'gf-overlay';
    overlay.innerHTML = `
      <div class="gf-wrap" role="dialog" aria-modal="true">
        <img class="gf-img gf-zoomable" alt="">
        <button class="gf-btn gf-prev" aria-label="Previous">‹</button>
        <button class="gf-btn gf-next" aria-label="Next">›</button>
        <button class="gf-close" aria-label="Close">×</button>
        <div class="gf-ui">
          <div class="gf-caption"></div>
          <div class="gf-ctr"></div>
        </div>
        <div class="gf-hint">← / → to navigate • Esc to close</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('.gf-img');
    const capEl = overlay.querySelector('.gf-caption');
    const ctrEl = overlay.querySelector('.gf-ctr');
    const btnPrev = overlay.querySelector('.gf-prev');
    const btnNext = overlay.querySelector('.gf-next');
    const btnClose = overlay.querySelector('.gf-close');

    // State
    let idx = 0;
    let touchStartX = 0;
    let zoom = 1;
    let panX = 0, panY = 0;
    let isPanning = false;
    let startPanX = 0, startPanY = 0;

    // Helpers
    const clamp = i => (i + items.length) % items.length;
    const preload = i => { const n = new Image(); n.src = items[clamp(i)].src; };

    function resetZoom() {
      zoom = 1; panX = 0; panY = 0;
      imgEl.style.transform = '';
      imgEl.classList.add('gf-zoomable');
    }
    function applyTransform() {
      imgEl.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }

    function show(i) {
      idx = clamp(i);
      const it = items[idx];
      resetZoom();
      imgEl.src = '';
      imgEl.alt = it.caption || '';
      overlay.style.cursor = 'progress';
      const tmp = new Image();
      tmp.onload = () => {
        imgEl.src = tmp.src;
        overlay.style.cursor = '';
      };
      tmp.src = it.src;
      capEl.textContent = it.caption || '';
      ctrEl.textContent = `${idx + 1} / ${items.length}`;
      preload(idx + 1); preload(idx - 1);
    }

    function open(i) {
      document.documentElement.classList.add('gf-hide-scroll');
      overlay.classList.add('is-open');
      show(i);
      window.addEventListener('keydown', onKey);
    }
    function close() {
      overlay.classList.remove('is-open');
      document.documentElement.classList.remove('gf-hide-scroll');
      window.removeEventListener('keydown', onKey);
    }
    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }
    function onKey(e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if ((e.key === '+' || e.key === '=')) { zoom = Math.min(zoom + 0.25, 5); applyTransform(); imgEl.classList.remove('gf-zoomable'); }
      else if ((e.key === '-' || e.key === '_')) { zoom = Math.max(zoom - 0.25, 1); if (zoom === 1) { resetZoom(); } else applyTransform(); }
      else if (e.key.toLowerCase() === 'z') { resetZoom(); }
    }

    // Bind triggers
    links.forEach((a, i) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        open(i);
      }, { passive: false });
    });

    // Buttons
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);
    btnClose.addEventListener('click', close);

    // Backdrop click
    if (closeOnBackdrop) {
      overlay.addEventListener('click', (e) => {
        const wrap = overlay.querySelector('.gf-wrap');
        if (!wrap.contains(e.target)) close();
      });
    }

    // Touch swipe
    overlay.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) return; // ignore pinch for swipe
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    }, { passive: true });

    // Mouse wheel zoom (ctrl+wheel and plain wheel)
    overlay.addEventListener('wheel', (e) => {
      if (!overlay.classList.contains('is-open')) return;
      if (e.ctrlKey || Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 0.25;
        const prevZoom = zoom;
        zoom = Math.min(5, Math.max(1, zoom + delta));
        if (zoom !== prevZoom) {
          imgEl.classList.remove('gf-zoomable');
          applyTransform();
        }
        if (zoom === 1) resetZoom();
      }
    }, { passive: false });

    // Drag to pan when zoomed
    imgEl.addEventListener('mousedown', (e) => {
      if (zoom <= 1) return;
      isPanning = true;
      startPanX = e.clientX - panX;
      startPanY = e.clientY - panY;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      panX = e.clientX - startPanX;
      panY = e.clientY - startPanY;
      applyTransform();
    });
    window.addEventListener('mouseup', () => { isPanning = false; });

    console.log('[GalleryFix] Ready. Found', items.length, 'images.');
  }

  // Initial run + observe late-loaded content
  const ready = () => initGallery();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }

  // Re-run if new thumbnails are injected later
  const mo = new MutationObserver(() => {
    // Only (re)init if overlay not present AND images exist
    if (!document.querySelector('.gf-overlay') && document.querySelector(selector)) {
      initGallery();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

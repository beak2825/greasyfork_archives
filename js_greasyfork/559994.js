// ==UserScript==
// @name         Picviewer Simple
// @version      1.1
// @description  Simple image viewer — hover icon or double click opens a minimal zoom+rotate viewer.
// @author       almahmud
// @homepageURL    https://thealmahmud.blogspot.com/
// @namespace https://greasyfork.org/users/1238578
// @license      GPL-2.0
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @icon        https://i.ibb.co.com/CKS9K5v2/picviewer-simple.png
// @downloadURL https://update.greasyfork.org/scripts/559994/Picviewer%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/559994/Picviewer%20Simple.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Config ----------
  const ICON_SIZE = 22;    // px
  const ICON_RAISE_PX = 8; //
  const RIGHT_OFFSET = 8;  //
  const GLOBAL_Z = 2147483647;

  // Viewer config
  const ZOOM_STEP = 0.12;
  const ZOOM_MIN = 0.1;
  const ZOOM_MAX = 8;
  const ROTATE_STEP = 90;

  // ---------- Viewer overlay & UI  ----------
  const overlay = document.createElement('div');
  overlay.id = 'pv-overlay-simple';
  overlay.tabIndex = -1;
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.85)',
    zIndex: String(GLOBAL_Z - 1),
    backdropFilter: 'blur(2px)'
  });

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'relative',
    maxWidth: '95vw',
    maxHeight: '95vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  });

  const vimg = document.createElement('img');
  Object.assign(vimg.style, {
    maxWidth: '92vw',
    maxHeight: '80vh',
    transition: 'transform 0.12s ease',
    cursor: 'grab',
    userSelect: 'none',
    // keep image below controls
    position: 'relative',
    zIndex: '0'
  });

  // Controls look
  const controls = document.createElement('div');
  Object.assign(controls.style, {
    marginTop: '10px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    padding: '6px 8px',
    borderRadius: '6px',
    zIndex: String(GLOBAL_Z),
    pointerEvents: 'auto',
    color: '#fff',
    fontSize: '13px'
  });

  function makeBtn(text, title) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.title = title || text;
    Object.assign(b.style, {
      background: 'rgba(255,255,255,0.06)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '6px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    });
    b.addEventListener('mouseenter', () => b.style.filter = 'brightness(1.06)');
    b.addEventListener('mouseleave', () => b.style.filter = 'none');
    return b;
  }

  const btnZoomIn = makeBtn('+', 'Zoom in (+)');
  const btnZoomOut = makeBtn('−', 'Zoom out (-)');
  const btnRotateLeft = makeBtn('⟲', 'Rotate left ([)');
  const btnRotateRight = makeBtn('⟳', 'Rotate right (])');
  const btnReset = makeBtn('Reset', 'Reset (0)');
  const btnClose = makeBtn('Close', 'Close (Esc)');

  controls.append(btnZoomOut, btnZoomIn, btnRotateLeft, btnRotateRight, btnReset, btnClose);

  panel.appendChild(vimg);
  panel.appendChild(controls);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  // Viewer state & helpers
  let scale = 1, rotation = 0, viewerOpen = false;
  function applyTransform() { vimg.style.transform = `rotate(${rotation}deg) scale(${scale})`; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function openViewer(src) {
    vimg.src = src;
    scale = 1;
    rotation = 0;
    applyTransform();
    overlay.style.display = 'flex';
    viewerOpen = true;
    setTimeout(() => overlay.focus && overlay.focus(), 0);
  }
  function closeViewer() {
    overlay.style.display = 'none';
    viewerOpen = false;
    vimg.src = '';
  }
  function zoomBy(delta) {
    scale = clamp(parseFloat((scale + delta).toFixed(3)), ZOOM_MIN, ZOOM_MAX);
    applyTransform();
  }
  function rotateBy(deg) {
    rotation = (rotation + deg) % 360;
    applyTransform();
  }

  // Controls events
  btnZoomIn.addEventListener('click', () => zoomBy(ZOOM_STEP));
  btnZoomOut.addEventListener('click', () => zoomBy(-ZOOM_STEP));
  btnRotateLeft.addEventListener('click', () => rotateBy(-ROTATE_STEP));
  btnRotateRight.addEventListener('click', () => rotateBy(ROTATE_STEP));
  btnReset.addEventListener('click', () => { scale = 1; rotation = 0; applyTransform(); });
  btnClose.addEventListener('click', closeViewer);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeViewer(); });
  overlay.addEventListener('wheel', (e) => { if (!viewerOpen) return; e.preventDefault(); zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP); }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!viewerOpen) return;
    const a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
    if (e.key === 'Escape') closeViewer();
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(ZOOM_STEP); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomBy(-ZOOM_STEP); }
    else if (e.key === '[') { e.preventDefault(); rotateBy(-ROTATE_STEP); }
    else if (e.key === ']') { e.preventDefault(); rotateBy(ROTATE_STEP); }
    else if (e.key === '0') { e.preventDefault(); scale = 1; rotation = 0; applyTransform(); }
  });

  // ---------- Small magnifier icon per-image ----------
  const icons = new WeakMap(); // img -> { icon, handlers }

  const baseStyle = document.createElement('style');
  baseStyle.textContent = `
    .pv-mini-icon {
      position: absolute;
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.14);
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      z-index: ${GLOBAL_Z};
      pointer-events: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.22);
    }
    .pv-mini-icon.show { opacity: 0.92; pointer-events: auto; }
    .pv-mini-icon svg { width: 12px; height: 12px; stroke-width: 1.6; }
  `;
  document.head.appendChild(baseStyle);

  function makeSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>`;
  }

  function positionIconFor(img, icon) {
    const rect = img.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) { icon.style.display = 'none'; return; }
    icon.style.display = '';
    const inset = 6;
    const top = Math.max(0, rect.top + window.scrollY + inset - ICON_RAISE_PX);
    const left = Math.max(0, rect.left + window.scrollX + rect.width - ICON_SIZE - inset + RIGHT_OFFSET);
    icon.style.top = top + 'px';
    icon.style.left = left + 'px';
  }

  function addIcon(img) {
    if (!img || icons.has(img)) return;
    // create icon
    const icon = document.createElement('div');
    icon.className = 'pv-mini-icon';
    icon.innerHTML = makeSVG();
    icon.style.position = 'absolute';
    icon.style.width = ICON_SIZE + 'px';
    icon.style.height = ICON_SIZE + 'px';
    document.body.appendChild(icon);

    const show = () => { positionIconFor(img, icon); icon.classList.add('show'); };
    const hide = () => { icon.classList.remove('show'); };

    img.addEventListener('mouseenter', show, { passive: true });
    img.addEventListener('mouseleave', hide, { passive: true });

    // keep icon visible while hovering the icon itself
    icon.addEventListener('mouseenter', show);
    icon.addEventListener('mouseleave', hide);

    // click opens viewer and prevent navigation
    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
      if (src) openViewer(src);
    };
    icon.addEventListener('click', onClick);

    icons.set(img, { icon, show, hide, onClick });
    // initial position
    positionIconFor(img, icon);
  }

  function removeIcon(img) {
    const ent = icons.get(img);
    if (!ent) return;
    try {
      img.removeEventListener('mouseenter', ent.show);
      img.removeEventListener('mouseleave', ent.hide);
      ent.icon.removeEventListener('mouseenter', ent.show);
      ent.icon.removeEventListener('mouseleave', ent.hide);
      ent.icon.removeEventListener('click', ent.onClick);
      if (ent.icon.parentNode) ent.icon.parentNode.removeChild(ent.icon);
    } catch (err) {}
    icons.delete(img);
  }

  function scanAndAttach(root = document) {
    const imgs = root.querySelectorAll ? root.querySelectorAll('img') : [];
    for (const im of imgs) addIcon(im);
  }

  // initial scan
  scanAndAttach(document);

  // keep icons positioned on scroll/resize
  let scheduled = false;
  function updateAll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      for (const im of document.images || []) {
        const ent = icons.get(im);
        if (ent) positionIconFor(im, ent.icon);
      }
    });
  }
  window.addEventListener('scroll', updateAll, true);
  window.addEventListener('resize', updateAll);

  // Mutation observer for dynamic images
  const mo = new MutationObserver((records) => {
    for (const rec of records) {
      for (const n of rec.addedNodes) {
        if (!(n instanceof Element)) continue;
        if (n.tagName === 'IMG') addIcon(n);
        else {
          const imgs = n.querySelectorAll && n.querySelectorAll('img');
          if (imgs) for (const im of imgs) addIcon(im);
        }
      }
      for (const n of rec.removedNodes) {
        if (!(n instanceof Element)) continue;
        if (n.tagName === 'IMG') removeIcon(n);
        else {
          const imgs = n.querySelectorAll && n.querySelectorAll('img');
          if (imgs) for (const im of imgs) removeIcon(im);
        }
      }
    }
    updateAll();
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // dblclick still opens viewer
  document.addEventListener('dblclick', (e) => {
    const im = e.target && (e.target.tagName === 'IMG' ? e.target : e.target.closest && e.target.closest('img'));
    if (!im) return;
    const src = im.currentSrc || im.src || im.getAttribute('data-src') || im.getAttribute('data-original');
    if (!src) return;
    openViewer(src);
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });

  // periodic cleanup for removed images
  setInterval(() => {
    for (const im of Array.from(document.images || [])) {
      if (!document.body.contains(im)) removeIcon(im);
    }
  }, 7000);

  // expose debug API
  window.PicViewer = { open: openViewer, close: closeViewer };

})();
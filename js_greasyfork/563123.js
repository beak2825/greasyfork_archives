// ==UserScript==
// @name         Kraland – Forum cartouche (compact)
// @namespace    https://kraland.org/
// @version      2026.01.18.2
// @description  Forum Kraland : cartouche utilisateur compact, stable, sans reflow (avatar, nom, drapeau, labels, badge)
// @author       Th3rD
// @match        *://www.kraland.org/forum/*
// @icon         http://img7.kraland.org/2/mat/25/2514.gif
// @run-at       document-idle
// @license MIT
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563123/Kraland%20%E2%80%93%20Forum%20cartouche%20%28compact%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563123/Kraland%20%E2%80%93%20Forum%20cartouche%20%28compact%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'tm-cartouche-style-compact';
  const OBS_OPTS = { childList: true, subtree: true };

  const CSS = `
.cartouche{display:flex!important;flex-direction:column!important;align-items:center!important;gap:6px!important}
.tm-avatar,.tm-flag{display:flex;justify-content:center}
.tm-name{display:flex;justify-content:center;text-align:center;line-height:1.15}
.tm-name strong a{font-size:13px;font-weight:600;letter-spacing:.15px;text-shadow:0 1px 2px rgba(0,0,0,.35);max-width:160px;display:inline-block;white-space:normal;overflow-wrap:anywhere;opacity:.95}
.tm-name strong img{display:inline-block;vertical-align:middle;margin:0 3px;opacity:.9}
.tm-flag img[src*="/world/logo"]{filter:drop-shadow(0 1px 1px rgba(0,0,0,.25));opacity:.95}
.tm-labels{display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:-2px}
.tm-labels .label{margin:0!important}
.tm-badge{display:inline-flex;align-items:center;gap:8px;font-size:9.5px;line-height:1.2;color:rgba(255,255,255,.92);text-align:left;max-width:210px;padding:4px 12px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);box-shadow:0 1px 2px rgba(0,0,0,.25);overflow-wrap:anywhere;hyphens:auto}
.tm-badge img{width:18px;height:18px;object-fit:contain;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35));flex:0 0 auto}
.tm-badge span{display:inline-block;max-width:170px;overflow-wrap:anywhere;hyphens:auto}
`;

  // Inject CSS once (handles soft navigation)
  if (!document.getElementById(STYLE_ID)) {
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  const qs = (r, s) => r.querySelector(s);
  const qsa = (r, s) => Array.from(r.querySelectorAll(s));
  const rm = (n) => n?.remove?.() ?? n?.parentNode?.removeChild?.(n);
  const src = (img) => (img?.getAttribute('src') || img?.src || '');
  const tip = (img) => ((img?.getAttribute('data-original-title') || img?.getAttribute('title') || '')).trim();
  const isFlag = (img) => src(img).includes('/world/logo');
  const cap1 = (t) => (t = (t || '').trim()) ? t[0].toUpperCase() + t.slice(1) : '';
  const dim = (img) => {
    const w = parseInt(img?.getAttribute?.('width') || '', 10) || img?.naturalWidth || img?.width || 0;
    const h = parseInt(img?.getAttribute?.('height') || '', 10) || img?.naturalHeight || img?.height || 0;
    return { w, h };
  };
  const ensure = (c, cls) => qs(c, `:scope > .${cls}`) || c.appendChild(Object.assign(document.createElement('div'), { className: cls }));

  // Only hoist safe wrappers (prevents moving a larger container)
  const moveChildOrSelf = (root, wrap, node) => {
    wrap.textContent = '';
    if (!node) return;
    const p = node.parentElement;
    const wrapperOk = p && p.parentElement === root && /^(A|SPAN)$/.test(p.tagName);
    wrap.appendChild(wrapperOk ? p : node);
  };

  const removeNodeOrWrapperIfDirect = (root, node) => {
    if (!node) return;
    const p = node.parentElement;
    rm(p && p.parentElement === root ? p : node);
  };

  const pickRole = (c) => {
    const imgs = qsa(c, 'img')
      .filter(i => !isFlag(i) && !i.closest('strong'))
      .map(i => ({ i, t: tip(i), ...dim(i) }))
      .filter(x => x.t && x.w && x.h && x.w <= 32 && x.h <= 32)
      .sort((a, b) => (a.w * a.h) - (b.w * b.h));
    return imgs[0]?.i || null;
  };

  const renderBadge = (c, text, iconSrc) => {
    text = (text || '').trim();
    let b = qs(c, ':scope > .tm-badge');
    if (!text) { if (b) rm(b); return null; }
    if (!b) { b = document.createElement('div'); b.className = 'tm-badge'; c.appendChild(b); }

    const current = (b.dataset.t || '') + '|' + (b.dataset.s || '');
    const next = text + '|' + (iconSrc || '');
    if (current === next) return b;

    b.dataset.t = text;
    b.dataset.s = iconSrc || '';
    b.textContent = '';

    if (iconSrc) {
      const im = document.createElement('img');
      im.src = iconSrc;
      im.alt = '';
      b.appendChild(im);
    }
    const sp = document.createElement('span');
    sp.textContent = text;
    b.appendChild(sp);
    return b;
  };

  const handleLabels = (c) => {
    const labels = qsa(c, ':scope > span.label');
    const existing = qs(c, ':scope > .tm-labels');
    if (!labels.length) return existing || null;

    const wrap = existing || c.appendChild(Object.assign(document.createElement('div'), { className: 'tm-labels' }));
    wrap.textContent = '';
    labels.forEach(l => { l.textContent = cap1(l.textContent); wrap.appendChild(l); });
    return wrap;
  };

  const cleanupSmall = (c, keep) => {
    qsa(c, 'img').forEach(img => {
      if (keep.has(img) || img.closest('strong') || isFlag(img)) return;
      const { w, h } = dim(img);
      if (w && h && w <= 32 && h <= 32) {
        const p = img.parentElement;
        rm(p && p.parentElement === c ? p : img);
      }
    });
  };

  const signature = (c, grade, roleSrc) => ([
    !!qs(c, ':scope > .tm-avatar img'),
    (qs(c, ':scope > .tm-name')?.textContent || '').trim(),
    !!qs(c, ':scope > .tm-flag img'),
    (qs(c, ':scope > .tm-labels')?.textContent || '').trim(),
    (grade || '').trim(),
    (roleSrc || '').trim()
  ].join('|'));

  const enhance = (c) => {
    const strong = qs(c, 'strong');
    if (!strong || !qs(strong, 'a')) return;

    // Fast bail if nothing changed since last pass (prevents pointless DOM moves)
    // (We compute a cheap preSig based on current DOM; if it matches, skip.)
    // Note: this stays intentionally lightweight.
    const preName = (qs(c, ':scope > .tm-name')?.textContent || qs(c, 'strong')?.textContent || '').trim();
    const preSig = [
      !!qs(c, ':scope > .tm-avatar img'),
      preName,
      !!qs(c, ':scope > .tm-flag img'),
      (qs(c, ':scope > .tm-labels')?.textContent || '').trim(),
      (c.dataset.tmGrade || '').trim(),
      (c.dataset.tmRoleSrc || '').trim()
    ].join('|');
    if (c.dataset.tmSig === preSig) return;

    const userInfo = c.closest('.user-info');
    const avatar = userInfo && (
      qs(userInfo, ':scope > img.avatar') ||
      qs(userInfo, ':scope > img.img-thumbnail') ||
      qs(userInfo, 'img.avatar') ||
      qs(userInfo, 'img.img-thumbnail')
    );

    const avatarW = ensure(c, 'tm-avatar');
    const nameW = ensure(c, 'tm-name');
    const flagW = ensure(c, 'tm-flag');

    if (!nameW.contains(strong)) nameW.appendChild(strong);

    if (avatar && !avatar.closest('.tm-avatar')) {
      avatarW.textContent = '';
      avatarW.appendChild(avatar);
    }

    const allImgs = qsa(c, 'img');
    const flagImg = allImgs.find(isFlag) || null;
    moveChildOrSelf(c, flagW, flagImg);

    // Role: extract info, then REMOVE the original icon to avoid duplicates
    const roleImg = pickRole(c);
    const grade = (roleImg ? tip(roleImg) : (c.dataset.tmGrade || '')).trim();
    const roleSrc = (roleImg ? src(roleImg) : (c.dataset.tmRoleSrc || '')).trim();

    if (roleImg && grade) c.dataset.tmGrade = grade;
    if (roleImg && roleSrc) c.dataset.tmRoleSrc = roleSrc;

    // Kill the original role icon (the "logo en trop" culprit)
    if (roleImg) removeNodeOrWrapperIfDirect(c, roleImg);

    const labelsW = handleLabels(c);
    const badgeW = renderBadge(c, grade, roleSrc);

    // Cleanup: keep only the flag image (role icon is now removed)
    const keep = new Set();
    if (flagImg) keep.add(flagImg);
    cleanupSmall(c, keep);

    // Final order
    [avatarW, nameW, flagW, labelsW, badgeW].filter(Boolean).forEach(el => c.appendChild(el));

    // Stable signature post-order
    c.dataset.tmSig = signature(c, grade, roleSrc);
  };

  const run = () => qsa(document, '.cartouche').forEach(enhance);

  let obs = null;
  let scheduled = false;

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (obs) obs.disconnect();
      try { run(); }
      finally { if (obs) obs.observe(document.body, OBS_OPTS); }
    });
  };

  obs = new MutationObserver(schedule);
  obs.observe(document.body, OBS_OPTS);
  run();
})();

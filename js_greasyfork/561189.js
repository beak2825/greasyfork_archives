// ==UserScript==
// @name         Global Video Filter Overlay (Sharpen/Blur + Levels + DN)
// @namespace    gvf
// @author       Silverfredy
// @version      1.0.2
// @description  Global HTML5 video filter with overlay UI (SL/SR/BL/WL/DN), hotkeys, fullscreen-safe overlay, and global persistent settings across all sites (Tampermonkey GM storage).
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/561189/Global%20Video%20Filter%20Overlay%20%28SharpenBlur%20%2B%20Levels%20%2B%20DN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561189/Global%20Video%20Filter%20Overlay%20%28SharpenBlur%20%2B%20Levels%20%2B%20DN%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  if (window.__GLOBAL_VIDEO_FILTER__) return;
  window.__GLOBAL_VIDEO_FILTER__ = true;

  const STYLE_ID = 'global-video-filter-style';
  const SVG_ID   = 'global-video-filter-svg';
  const svgNS    = 'http://www.w3.org/2000/svg';

  // -------------------------
  // GLOBAL STORAGE (Tampermonkey) + live sync across tabs
  // -------------------------
  const K = {
    SL: 'gvf_sl', // -2..+2 step 0.1 (snap0)
    SR: 'gvf_sr', // -2..+2 step 0.1 (snap0) -> abs used
    BL: 'gvf_bl', // -2..+2 step 0.1 (snap0)
    WL: 'gvf_wl', // -2..+2 step 0.1 (snap0)
    DN: 'gvf_dn', // -1.5..+1.5 step 0.1 (snap0)

    HB: 'gvf_hotkey_b', // enabled (tone chain)
    HD: 'gvf_hotkey_d', // darkMoody
    HO: 'gvf_hotkey_o', // tealOrange
    HV: 'gvf_hotkey_v', // vibrantSat
    HH: 'gvf_hotkey_h', // iconsShown
  };

  const hasGM = (typeof GM_getValue === 'function') && (typeof GM_setValue === 'function');

  function storeGet(key, fallback) {
    try {
      if (hasGM) return GM_getValue(key, fallback);
    } catch (_) {}
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : raw;
    } catch (_) {}
    return fallback;
  }

  function storeSet(key, val) {
    try {
      if (hasGM) { GM_setValue(key, val); return; }
    } catch (_) {}
    try { localStorage.setItem(key, String(val)); } catch (_) {}
  }

  // live sync (if available)
  function storeWatch(key, onChange) {
    if (typeof GM_addValueChangeListener !== 'function') return;
    try {
      GM_addValueChangeListener(key, (_name, _old, newVal, remote) => {
        if (!remote) return;
        onChange(newVal);
      });
    } catch (_) {}
  }

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function roundTo(n, step) { return Math.round(n / step) * step; }
  function snapZero(n, eps) { return Math.abs(n) <= eps ? 0 : n; }
  function asNum(v, fb) {
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : fb;
  }
  function asBool(v, fb) {
    if (typeof v === 'boolean') return v;
    if (v === 'true') return true;
    if (v === 'false') return false;
    return fb;
  }

  // -------------------------
  // Hotkeys state (persisted)
  // -------------------------
  let enabled     = asBool(storeGet(K.HB, true), true);   // CTRL+ALT+B (tone chain)
  let darkMoody   = asBool(storeGet(K.HD, true), true);   // CTRL+ALT+D
  let tealOrange  = asBool(storeGet(K.HO, false), false); // CTRL+ALT+O
  let vibrantSat  = asBool(storeGet(K.HV, false), false); // CTRL+ALT+V
  let iconsShown  = asBool(storeGet(K.HH, false), false); // CTRL+ALT+H

  // -------------------------
  // Sliders (persisted, global)
  // -------------------------
  let sl = clamp(asNum(storeGet(K.SL, 0.0), 0.0), -2, 2);     // sharpen/blur
  let sr = clamp(asNum(storeGet(K.SR, 1.0), 1.0), -2, 2);     // radius signed -> abs
  let bl = clamp(asNum(storeGet(K.BL, 0.0), 0.0), -2, 2);     // black level
  let wl = clamp(asNum(storeGet(K.WL, 0.0), 0.0), -2, 2);     // white level
  let dn = clamp(asNum(storeGet(K.DN, 0.6), 0.6), -1.5, 1.5); // denoise/texture

  function getSL() { return snapZero(roundTo(clamp(sl, -2, 2), 0.1), 0.05); }
  function getSR() { return snapZero(roundTo(clamp(sr, -2, 2), 0.1), 0.05); }
  function getSRAbs() { return Math.max(0.1, Math.abs(getSR())); }
  function getBL() { return snapZero(roundTo(clamp(bl, -2, 2), 0.1), 0.05); }
  function getWL() { return snapZero(roundTo(clamp(wl, -2, 2), 0.1), 0.05); }
  function getDN() { return snapZero(roundTo(clamp(dn, -1.5, 1.5), 0.1), 0.05); }

  function getSharpenA() { return Math.max(0, getSL()) * 1.0; }       // 0..2
  function getBlurSigma() { return Math.max(0, -getSL()) * 1.0; }     // 0..2

  function blackToOffset(v) { return clamp(v, -2, 2) * 0.04; }        // -0.08..+0.08
  function whiteToHiAdj(v) { return clamp(v, -2, 2) * 0.06; }         // -0.12..+0.12 (highlights)
  function dnToMix(v) {
    // DN -1.5..+1.5 => mix magnitude 0..0.65 (safe)
    const mag = Math.min(0.65, Math.abs(v) * 0.43);
    return { sign: v >= 0 ? 1 : -1, mag };
  }
  function dnToSigma(v) {
    // smoothing/texture uses its own blur sigma
    return Math.max(0.2, Math.abs(v) * 1.1);
  }

  // -------------------------
  // Overlay (per video)
  // -------------------------
  const overlays = new WeakMap(); // video -> overlay div
  const fsWraps  = new WeakMap(); // video -> wrapper div
  let rafScheduled = false;

  function getFsEl() {
    return document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement
      || null;
  }

  function stopEvent(e) {
    e.stopPropagation();
    // don’t call preventDefault globally; range needs default behavior
  }

  function mkOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'gvf-overlay';
    overlay.style.cssText = `
      position: fixed;
      display: none;
      flex-direction: column;
      gap: 6px;
      z-index: 2147483647;
      pointer-events: auto;
      opacity: 0.95;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      transform: translateZ(0);
      user-select: none;
    `;

    const row = document.createElement('div');
    row.style.cssText = `display:flex; gap:6px; align-items:center;`;

    const mkBtn = (key, label) => {
      const el = document.createElement('div');
      el.dataset.key = key;
      el.textContent = label;
      el.style.cssText = `
        width: 24px; height: 24px;
        border-radius: 6px;
        background: rgba(0,0,0,0.92);
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.14) inset;
        text-shadow: 0 1px 1px rgba(0,0,0,0.6);
      `;
      return el;
    };

    row.appendChild(mkBtn('b', 'B'));
    row.appendChild(mkBtn('d', 'D'));
    row.appendChild(mkBtn('o', 'O'));
    row.appendChild(mkBtn('v', 'V'));
    overlay.appendChild(row);

    function mkSliderRow(labelText, min, max, step, getVal, setVal, storeKey) {
      const wrap = document.createElement('div');
      wrap.style.cssText = `
        display:flex;
        align-items:center;
        gap:8px;
        padding: 6px 8px;
        border-radius: 10px;
        background: rgba(0,0,0,0.92);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.12) inset;
      `;

      const lbl = document.createElement('div');
      lbl.textContent = labelText;
      lbl.style.cssText = `
        min-width: 30px;
        text-align:center;
        font-size: 11px;
        font-weight: 900;
        color: #cfcfcf;
      `;

      const rng = document.createElement('input');
      rng.type = 'range';
      rng.min = String(min);
      rng.max = String(max);
      rng.step = String(step);
      rng.value = String(getVal());
      rng.className = `gvf-${labelText}-range`;
      rng.style.cssText = `width: 150px; height: 18px; accent-color: #fff;`;

      const val = document.createElement('div');
      val.className = `gvf-${labelText}-val`;
      val.textContent = Number(getVal()).toFixed(1);
      val.style.cssText = `
        width: 46px;
        text-align:right;
        font-size: 11px;
        font-weight: 900;
        color: #ededed;
      `;

      // Prevent sites from hijacking slider drag/click
      const events = [
        'pointerdown','pointermove','pointerup',
        'mousedown','mousemove','mouseup',
        'touchstart','touchmove','touchend',
        'wheel','keydown','keyup','click'
      ];
      events.forEach(ev => rng.addEventListener(ev, stopEvent, { passive: ev.startsWith('touch') || ev === 'wheel' }));

      rng.addEventListener('input', () => {
        const raw = parseFloat(rng.value);
        let v = clamp(raw, min, max);

        // snap-to-0 for ALL sliders
        v = snapZero(roundTo(v, step), 0.05);

        setVal(v);
        storeSet(storeKey, v);

        rng.value = String(v);
        val.textContent = Number(v).toFixed(1);

        applyFilter();
      });

      wrap.appendChild(lbl);
      wrap.appendChild(rng);
      wrap.appendChild(val);
      return wrap;
    }

    // SL/SR/BL/WL + DN
    overlay.appendChild(mkSliderRow('SL', -2, 2, 0.1, getSL, (v)=>{ sl=v; }, K.SL));
    overlay.appendChild(mkSliderRow('SR', -2, 2, 0.1, getSR, (v)=>{ sr=v; }, K.SR));
    overlay.appendChild(mkSliderRow('BL', -2, 2, 0.1, getBL, (v)=>{ bl=v; }, K.BL));
    overlay.appendChild(mkSliderRow('WL', -2, 2, 0.1, getWL, (v)=>{ wl=v; }, K.WL));
    overlay.appendChild(mkSliderRow('DN', -1.5, 1.5, 0.1, getDN, (v)=>{ dn=v; }, K.DN));

    (document.body || document.documentElement).appendChild(overlay);
    return overlay;
  }

  function updateOverlayState(overlay) {
    if (!iconsShown) { overlay.style.display = 'none'; return; }
    overlay.style.display = 'flex';

    const state = { b: !!enabled, d: !!darkMoody, o: !!tealOrange, v: !!vibrantSat };
    overlay.querySelectorAll('[data-key]').forEach(el => {
      const on = !!state[el.dataset.key];
      el.style.color = on ? '#fff' : '#666';
      el.style.background = on ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.92)';
    });

    const setPair = (name, v) => {
      const r = overlay.querySelector(`.gvf-${name}-range`);
      const t = overlay.querySelector(`.gvf-${name}-val`);
      if (r) r.value = String(v);
      if (t) t.textContent = Number(v).toFixed(1);
    };

    setPair('SL', getSL());
    setPair('SR', getSR());
    setPair('BL', getBL());
    setPair('WL', getWL());
    setPair('DN', getDN());
  }

  // -------------------------
  // Fullscreen wrapper redirect (keep overlays visible)
  // -------------------------
  function ensureFsWrapper(video) {
    if (fsWraps.has(video)) return fsWraps.get(video);
    if (!video || !video.parentNode) return null;

    const parent = video.parentNode;
    const wrap = document.createElement('div');
    wrap.className = 'gvf-fs-wrap';
    wrap.style.cssText = `
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100%;
      max-width: 100%;
      background: black;
    `;

    const ph = document.createComment('gvf-video-placeholder');
    parent.insertBefore(ph, video);
    parent.insertBefore(wrap, video);
    wrap.appendChild(video);

    wrap.__gvfPlaceholder = ph;
    fsWraps.set(video, wrap);
    return wrap;
  }

  function restoreFromFsWrapper(video) {
    const wrap = fsWraps.get(video);
    if (!wrap) return;
    const ph = wrap.__gvfPlaceholder;
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(video, ph);
      ph.parentNode.removeChild(ph);
    }
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    fsWraps.delete(video);
  }

  function patchFullscreenRequest(video) {
    if (!video || video.__gvfFsPatched) return;
    video.__gvfFsPatched = true;

    // iOS Safari native fullscreen cannot keep overlays
    if (typeof video.webkitEnterFullscreen === 'function') return;

    const origReq = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
    if (!origReq) return;

    const callWrapFs = async () => {
      const wrap = ensureFsWrapper(video);
      if (!wrap) return origReq.call(video);

      const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen || wrap.msRequestFullscreen;
      if (req) return req.call(wrap);
      return origReq.call(video);
    };

    if (video.requestFullscreen) {
      const _orig = video.requestFullscreen.bind(video);
      video.requestFullscreen = function () { return callWrapFs() || _orig(); };
    }
    if (video.webkitRequestFullscreen) {
      const _orig = video.webkitRequestFullscreen.bind(video);
      video.webkitRequestFullscreen = function () { return callWrapFs() || _orig(); };
    }
    if (video.msRequestFullscreen) {
      const _orig = video.msRequestFullscreen.bind(video);
      video.msRequestFullscreen = function () { return callWrapFs() || _orig(); };
    }
  }

  function getOverlayContainer(video) {
    const fsEl = getFsEl();
    const wrap = fsWraps.get(video);

    if (fsEl && wrap && fsEl === wrap) return wrap;
    if (fsEl && (fsEl === video || (fsEl.contains && fsEl.contains(video)))) return fsEl;
    return document.body || document.documentElement;
  }

  function positionOverlay(video, overlay) {
    if (!iconsShown) return;

    const fsEl = getFsEl();
    const container = getOverlayContainer(video);
    if (overlay.parentNode !== container) container.appendChild(overlay);

    const isWrapFs = fsEl && container === fsEl && container.classList && container.classList.contains('gvf-fs-wrap');
    overlay.style.position = isWrapFs ? 'absolute' : 'fixed';

    const r = video.getBoundingClientRect();
    if (!r || r.width < 40 || r.height < 40) { overlay.style.display = 'none'; return; }

    if (!fsEl) {
      if (r.bottom < 0 || r.right < 0 || r.top > (window.innerHeight || 0) || r.left > (window.innerWidth || 0)) {
        overlay.style.display = 'none';
        return;
      }
    }

    overlay.style.display = 'flex';

    if (isWrapFs) {
      const cr = container.getBoundingClientRect();
      overlay.style.top = `${Math.round((r.top - cr.top) + 10)}px`;
      overlay.style.left = `${Math.round((r.left - cr.left) + r.width - 10)}px`;
      overlay.style.transform = 'translateX(-100%) translateZ(0)';
    } else {
      overlay.style.top = `${Math.round(r.top + 10)}px`;
      overlay.style.left = `${Math.round(r.left + r.width - 10)}px`;
      overlay.style.transform = 'translateX(-100%) translateZ(0)';
    }
  }

  function ensureOverlays() {
    document.querySelectorAll('video').forEach(v => {
      patchFullscreenRequest(v);
      if (!overlays.has(v)) overlays.set(v, mkOverlay());
    });
  }

  function updateAllOverlays() {
    ensureOverlays();
    document.querySelectorAll('video').forEach(v => {
      const overlay = overlays.get(v);
      if (!overlay) return;
      updateOverlayState(overlay);
      positionOverlay(v, overlay);
    });
  }

  function scheduleOverlayUpdate() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      updateAllOverlays();
    });
  }

  function onFsChange() {
    const fsEl = getFsEl();
    if (!fsEl) {
      document.querySelectorAll('video').forEach(v => {
        if (fsWraps.has(v)) restoreFromFsWrapper(v);
      });
    }
    scheduleOverlayUpdate();
  }

  // -------------------------
  // SVG filter building
  // -------------------------
  function mkGamma(ch, amp, exp, off) {
    const f = document.createElementNS(svgNS, ch);
    f.setAttribute('type', 'gamma');
    f.setAttribute('amplitude', amp);
    f.setAttribute('exponent', exp);
    f.setAttribute('offset', off);
    return f;
  }

  function mkOffsetCT(inId, outId, offset) {
    const ct = document.createElementNS(svgNS, 'feComponentTransfer');
    ct.setAttribute('in', inId);
    ct.setAttribute('result', outId);
    ct.appendChild(mkGamma('feFuncR', '1.0', '1.0', String(offset)));
    ct.appendChild(mkGamma('feFuncG', '1.0', '1.0', String(offset)));
    ct.appendChild(mkGamma('feFuncB', '1.0', '1.0', String(offset)));
    return ct;
  }

  // WL: highlight knee curve via tableValues
  function mkHighlightsTableCT(inId, outId, hiAdj) {
    const knee = 0.78;
    const steps = 17;
    const vals = [];
    for (let i = 0; i < steps; i++) {
      const x = i / (steps - 1);
      let y = x;
      if (x > knee) {
        const t = (x - knee) / (1 - knee);
        y = x + hiAdj * t;
      }
      y = clamp(y, 0, 1);
      vals.push(y.toFixed(4));
    }

    const ct = document.createElementNS(svgNS, 'feComponentTransfer');
    ct.setAttribute('in', inId);
    ct.setAttribute('result', outId);

    const mkTable = (tag) => {
      const f = document.createElementNS(svgNS, tag);
      f.setAttribute('type', 'table');
      f.setAttribute('tableValues', vals.join(' '));
      return f;
    };

    ct.appendChild(mkTable('feFuncR'));
    ct.appendChild(mkTable('feFuncG'));
    ct.appendChild(mkTable('feFuncB'));
    return ct;
  }

  // DN: blend source with blurred image (positive = denoise, negative = texture boost)
  function mkDNStage(inId, outId, dnVal) {
    const { sign, mag } = dnToMix(dnVal);
    if (mag <= 0) return null;

    const sigma = dnToSigma(dnVal);

    // blur for DN
    const blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('in', inId);
    blur.setAttribute('stdDeviation', String(sigma.toFixed(3)));
    blur.setAttribute('result', `${outId}_dnblur`);

    // arithmetic composite:
    // denoise: out = (1-mag)*src + mag*blur  -> k2=(1-mag) k3=mag
    // texture: out = (1+mag)*src - mag*blur  -> k2=(1+mag) k3=-mag
    const comp = document.createElementNS(svgNS, 'feComposite');
    comp.setAttribute('in', inId);
    comp.setAttribute('in2', `${outId}_dnblur`);
    comp.setAttribute('operator', 'arithmetic');
    comp.setAttribute('k1', '0');
    comp.setAttribute('k4', '0');

    if (sign >= 0) {
      comp.setAttribute('k2', String((1 - mag).toFixed(4)));
      comp.setAttribute('k3', String((mag).toFixed(4)));
    } else {
      comp.setAttribute('k2', String((1 + mag).toFixed(4)));
      comp.setAttribute('k3', String((-mag).toFixed(4)));
    }
    comp.setAttribute('result', outId);

    return { blur, comp };
  }

  function buildFilter(svg, id, opts, radius, sharpenA, blurSigma, blackOffset, whiteAdj, dnVal) {
    const { moody, teal, vib } = opts;

    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', id);
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    let last = 'SourceGraphic';

    // Sharpen/Blur stage
    if (blurSigma > 0) {
      const b = document.createElementNS(svgNS, 'feGaussianBlur');
      b.setAttribute('in', last);
      b.setAttribute('stdDeviation', String(radius));
      b.setAttribute('result', 'r0');
      filter.appendChild(b);
      last = 'r0';
    } else if (sharpenA > 0) {
      const blur = document.createElementNS(svgNS, 'feGaussianBlur');
      blur.setAttribute('in', 'SourceGraphic');
      blur.setAttribute('stdDeviation', String(radius));
      blur.setAttribute('result', 'blur');
      filter.appendChild(blur);

      const comp = document.createElementNS(svgNS, 'feComposite');
      comp.setAttribute('in', 'SourceGraphic');
      comp.setAttribute('in2', 'blur');
      comp.setAttribute('operator', 'arithmetic');
      comp.setAttribute('k1', '0');
      comp.setAttribute('k2', String(1 + sharpenA));
      comp.setAttribute('k3', String(-sharpenA));
      comp.setAttribute('k4', '0');
      comp.setAttribute('result', 'r0');
      filter.appendChild(comp);

      last = 'r0';
    } else {
      // neutral
      last = 'SourceGraphic';
    }

    // DN stage (global)
    const dnStage = mkDNStage(last, 'r_dn', dnVal);
    if (dnStage) {
      filter.appendChild(dnStage.blur);
      filter.appendChild(dnStage.comp);
      last = 'r_dn';
    }

    // Black Level
    if (blackOffset !== 0) {
      filter.appendChild(mkOffsetCT(last, 'r_bl', blackOffset));
      last = 'r_bl';
    }

    // White Level
    if (whiteAdj !== 0) {
      filter.appendChild(mkHighlightsTableCT(last, 'r_wl', whiteAdj));
      last = 'r_wl';
    }

    // Dark & Moody
    if (moody) {
      const ct = document.createElementNS(svgNS, 'feComponentTransfer');
      ct.setAttribute('in', last);
      ct.setAttribute('result', 'r1');

      ct.appendChild(mkGamma('feFuncR', '0.96', '1.14', '-0.015'));
      ct.appendChild(mkGamma('feFuncG', '0.96', '1.13', '-0.015'));
      ct.appendChild(mkGamma('feFuncB', '0.97', '1.11', '-0.015'));
      filter.appendChild(ct);

      const sat = document.createElementNS(svgNS, 'feColorMatrix');
      sat.setAttribute('type', 'saturate');
      sat.setAttribute('values', '0.90');
      sat.setAttribute('in', 'r1');
      sat.setAttribute('result', 'r2');
      filter.appendChild(sat);

      last = 'r2';
    }

    // Teal & Orange
    if (teal) {
      const cool = document.createElementNS(svgNS, 'feColorMatrix');
      cool.setAttribute('type', 'matrix');
      cool.setAttribute('values',
        '0.96 0.02 0.00 0 0 ' +
        '0.02 1.02 0.02 0 0 ' +
        '0.00 0.04 1.06 0 0 ' +
        '0    0    0    1 0'
      );
      cool.setAttribute('in', last);
      cool.setAttribute('result', 'r3');
      filter.appendChild(cool);

      const warm = document.createElementNS(svgNS, 'feColorMatrix');
      warm.setAttribute('type', 'matrix');
      warm.setAttribute('values',
        '1.10 0.02 0.00 0 0 ' +
        '0.02 1.00 0.00 0 0 ' +
        '0.00 0.00 0.90 0 0 ' +
        '0    0    0    1 0'
      );
      warm.setAttribute('in', 'r3');
      warm.setAttribute('result', 'r4');
      filter.appendChild(warm);

      const pop = document.createElementNS(svgNS, 'feColorMatrix');
      pop.setAttribute('type', 'saturate');
      pop.setAttribute('values', '1.08');
      pop.setAttribute('in', 'r4');
      pop.setAttribute('result', 'r4b');
      filter.appendChild(pop);

      last = 'r4b';
    }

    // Vibrant
    if (vib) {
      const vSat = document.createElementNS(svgNS, 'feColorMatrix');
      vSat.setAttribute('type', 'saturate');
      vSat.setAttribute('values', '1.35');
      vSat.setAttribute('in', last);
      vSat.setAttribute('result', 'r5');
      filter.appendChild(vSat);
      last = 'r5';
    }

    const merge = document.createElementNS(svgNS, 'feMerge');
    const n1 = document.createElementNS(svgNS, 'feMergeNode');
    n1.setAttribute('in', last);
    merge.appendChild(n1);
    filter.appendChild(merge);

    svg.appendChild(filter);
  }

  function ensureSvgFilter() {
    const SL  = Number(getSL().toFixed(1));
    const SR  = Number(getSR().toFixed(1));
    const R   = Number(getSRAbs().toFixed(1));
    const A   = Number(getSharpenA().toFixed(3));
    const BS  = Number(getBlurSigma().toFixed(3));
    const BL  = Number(getBL().toFixed(1));
    const WL  = Number(getWL().toFixed(1));
    const DN  = Number(getDN().toFixed(1));

    const want = `${SL}|${SR}|${R}|${A}|${BS}|${BL}|${WL}|${DN}`;

    const existing = document.getElementById(SVG_ID);
    if (existing) {
      const has = existing.getAttribute('data-params') || '';
      if (has === want) return;
      existing.remove();
    }

    const svg = document.createElementNS(svgNS, 'svg');
    svg.id = SVG_ID;
    svg.setAttribute('data-params', want);
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.left = '-9999px';
    svg.style.top  = '-9999px';

    const blackOffset = blackToOffset(BL);
    const whiteAdj    = whiteToHiAdj(WL);

    buildFilter(svg, 'gvf_s',    { moody:false, teal:false, vib:false }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_sm',   { moody:true,  teal:false, vib:false }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_st',   { moody:false, teal:true,  vib:false }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_sv',   { moody:false, teal:false, vib:true  }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_smt',  { moody:true,  teal:true,  vib:false }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_smv',  { moody:true,  teal:false, vib:true  }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_stv',  { moody:false, teal:true,  vib:true  }, R, A, BS, blackOffset, whiteAdj, DN);
    buildFilter(svg, 'gvf_smtv', { moody:true,  teal:true,  vib:true  }, R, A, BS, blackOffset, whiteAdj, DN);

    (document.body || document.documentElement).appendChild(svg);
  }

  function pickComboId() {
    const m = !!darkMoody;
    const t = !!tealOrange;
    const v = !!vibrantSat;

    if (m && t && v) return 'gvf_smtv';
    if (m && t && !v) return 'gvf_smt';
    if (m && !t && v) return 'gvf_smv';
    if (!m && t && v) return 'gvf_stv';
    if (m && !t && !v) return 'gvf_sm';
    if (!m && t && !v) return 'gvf_st';
    if (!m && !t && v) return 'gvf_sv';
    return 'gvf_s';
  }

  function applyFilter() {
    let style = document.getElementById(STYLE_ID);

    // If everything is off, remove style
    if (!enabled && !darkMoody && !tealOrange && !vibrantSat) {
      if (style) style.remove();
      scheduleOverlayUpdate();
      return;
    }

    ensureSvgFilter();

    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    // Tone chain (B): small but visible
    const tone = enabled ? ' brightness(1.02) contrast(1.05) saturate(1.21)' : '';

    // IMPORTANT: apply to video only (stable everywhere)
    style.textContent = `
      video {
        filter: url("#${pickComboId()}")${tone} !important;
      }
    `;

    scheduleOverlayUpdate();
  }

  // -------------------------
  // watchers: global sync across tabs/windows + reapply
  // -------------------------
  function installGlobalSync() {
    storeWatch(K.SL, (v)=>{ sl = clamp(asNum(v, sl), -2, 2); applyFilter(); });
    storeWatch(K.SR, (v)=>{ sr = clamp(asNum(v, sr), -2, 2); applyFilter(); });
    storeWatch(K.BL, (v)=>{ bl = clamp(asNum(v, bl), -2, 2); applyFilter(); });
    storeWatch(K.WL, (v)=>{ wl = clamp(asNum(v, wl), -2, 2); applyFilter(); });
    storeWatch(K.DN, (v)=>{ dn = clamp(asNum(v, dn), -1.5, 1.5); applyFilter(); });

    storeWatch(K.HB, (v)=>{ enabled     = asBool(v, enabled); applyFilter(); });
    storeWatch(K.HD, (v)=>{ darkMoody   = asBool(v, darkMoody); applyFilter(); });
    storeWatch(K.HO, (v)=>{ tealOrange  = asBool(v, tealOrange); applyFilter(); });
    storeWatch(K.HV, (v)=>{ vibrantSat  = asBool(v, vibrantSat); applyFilter(); });
    storeWatch(K.HH, (v)=>{ iconsShown  = asBool(v, iconsShown); scheduleOverlayUpdate(); });
  }

  // -------------------------
  // Init + hotkeys + observers
  // -------------------------
  function init() {
    installGlobalSync();
    applyFilter();

    document.addEventListener('keydown', (e) => {
      if (!e.ctrlKey || !e.altKey) return;

      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.isComposing) return;

      const k = (e.key || '').toLowerCase();
      switch (k) {
        case 'b':
          enabled = !enabled; storeSet(K.HB, enabled);
          break;
        case 'd':
          darkMoody = !darkMoody; storeSet(K.HD, darkMoody);
          break;
        case 'o':
          tealOrange = !tealOrange; storeSet(K.HO, tealOrange);
          break;
        case 'v':
          vibrantSat = !vibrantSat; storeSet(K.HV, vibrantSat);
          break;
        case 'h':
          iconsShown = !iconsShown; storeSet(K.HH, iconsShown);
          scheduleOverlayUpdate();
          e.preventDefault();
          return;
        default:
          return;
      }

      e.preventDefault();
      applyFilter();
    }, true);

    window.addEventListener('scroll', scheduleOverlayUpdate, { passive: true });
    window.addEventListener('resize', scheduleOverlayUpdate, { passive: true });

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);

    // Track new videos
    new MutationObserver(() => {
      scheduleOverlayUpdate();
    }).observe(document.documentElement, { childList: true, subtree: true });

    // Create overlays hidden, but ready
    scheduleOverlayUpdate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

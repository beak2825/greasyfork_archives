// ==UserScript==
// @name         z/place Overlay
// @namespace    zplace-overlay
// @version      2.1
// @description  Affiche avec transparence, ancré à (x,y) sur #place-canvas (500x500). Auto-détection. IMG par défaut + fallback CANVAS (alpha:true).
// @match        https://place.zevent.fr/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548509/zplace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/548509/zplace%20Overlay.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CANVAS_ID = 'place-canvas';
  const cfg = {
    url: 'https://exemple.com/ton_patch.png', // ← ton PNG (transparent)
    opacity: 0.9,      // opacité globale (multiplie l’alpha du PNG)
    anchorX: 0,        // coords monde (px) coin haut-gauche
    anchorY: 0,
    renderMode: 'img'  // 'img' (par défaut) ou 'canvas' (fallback alpha:true)
  };

  const $ = (s, r=document) => r.querySelector(s);

  function waitForCanvas() {
    return new Promise(resolve => {
      const c0 = document.getElementById(CANVAS_ID);
      if (c0) return resolve(c0);
      const mo = new MutationObserver(() => {
        const c = document.getElementById(CANVAS_ID);
        if (c) { mo.disconnect(); resolve(c); }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  // Détecte un upscale entier s (2..8) tel que (nw/s, nh/s) ≤ monde (500x500) et divise proprement
  function detectIntUpscale(nw, nh, worldW, worldH, maxS = 8) {
    for (let s = maxS; s >= 2; s--) {
      if (nw % s === 0 && nh % s === 0) {
        const w1 = nw / s, h1 = nh / s;
        if (w1 <= worldW && h1 <= worldH) return s;
      }
    }
    return 1;
  }

  function install(canvas) {
    const parent = canvas.parentElement || canvas.offsetParent || document.body;
    const worldW = canvas.width;   // 500
    const worldH = canvas.height;  // 500

    // Calque overlay (même parent ⇒ hérite pan/zoom via transform du canvas que l’on copie)
    const layer = document.createElement('div');
    Object.assign(layer.style, {
      position: 'absolute',
      left: '0', top: '0',
      width: '0', height: '0',
      pointerEvents: 'none',
      zIndex: '2147483647',
      imageRendering: 'pixelated',
      background: 'transparent',
      mixBlendMode: 'normal', // pas de blend exotique
      transformOrigin: '0 0'
    });
    parent.appendChild(layer);

    // Wrapper pour compenser l’upscale (scale(1/s)) tout en gardant l’alpha
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'absolute',
      left: '0', top: '0',
      width: '100%', height: '100%',
      transformOrigin: '0 0',
      background: 'transparent',
      mixBlendMode: 'normal'
    });
    layer.appendChild(wrap);

    // Deux modes de rendu : IMG (par défaut) ou CANVAS (alpha:true)
    const img = document.createElement('img');
    const over = document.createElement('canvas');
    let ctx = null;

    function useIMG() {
      // Nettoyage canvas si existait
      over.remove();
      ctx = null;

      Object.assign(img.style, {
        position: 'absolute',
        left: '0', top: '0',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        opacity: String(cfg.opacity),
        background: 'transparent',
        mixBlendMode: 'normal'
      });
      wrap.appendChild(img);
    }

    function useCANVAS() {
      // Nettoyage img si existait
      img.remove();

      over.width = worldW;  // buffer monde
      over.height = worldH;
      Object.assign(over.style, {
        position: 'absolute',
        left: '0', top: '0',
        width: '100%', height: '100%',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        background: 'transparent'
      });
      wrap.appendChild(over);
      // Contexte avec alpha = true
      ctx = over.getContext('2d', { alpha: true });
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    // Synchronise la boîte et le transform avec le canvas
    function syncBox() {
      const cs = getComputedStyle(canvas);

      // Boîte CSS identique
      const l = cs.left !== 'auto' ? cs.left : canvas.offsetLeft + 'px';
      const t = cs.top  !== 'auto' ? cs.top  : canvas.offsetTop  + 'px';
      layer.style.left   = l;
      layer.style.top    = t;
      layer.style.width  = canvas.clientWidth  + 'px';
      layer.style.height = canvas.clientHeight + 'px';

      // Transform du canvas (pan/zoom)
      layer.style.transform       = cs.transform || 'none';
      layer.style.transformOrigin = cs.transformOrigin || '0 0';

      // Si IMG prêt
      if (cfg.renderMode === 'img' && img.naturalWidth && img.naturalHeight) {
        const s = detectIntUpscale(img.naturalWidth, img.naturalHeight, worldW, worldH);
        wrap.style.transform = `scale(${1 / s})`; // compense upscale
        // taille native, placée en coords monde → on pré-multiplie par s AVANT le scale(1/s)
        img.style.width  = img.naturalWidth + 'px';
        img.style.height = img.naturalHeight + 'px';
        img.style.left   = (cfg.anchorX * s) + 'px';
        img.style.top    = (cfg.anchorY * s) + 'px';
      }

      // Si CANVAS prêt
      if (cfg.renderMode === 'canvas' && ctx && img.naturalWidth && img.naturalHeight) {
        const s = detectIntUpscale(img.naturalWidth, img.naturalHeight, worldW, worldH);
        wrap.style.transform = `scale(${1 / s})`;
        // on dessine l’image à sa taille native aux coords (anchorX*s, anchorY*s)
        ctx.clearRect(0, 0, over.width, over.height);
        ctx.globalAlpha = Math.max(0, Math.min(1, cfg.opacity)); // alpha globale * alpha PNG
        // dessiner sans redimensionner (préserve la transparence telle quelle)
        ctx.drawImage(img, cfg.anchorX * s, cfg.anchorY * s);
      }
    }

    // Observers
    new ResizeObserver(syncBox).observe(canvas);
    const mo1 = new MutationObserver(syncBox);
    mo1.observe(canvas, { attributes: true, attributeFilter: ['style','class'] });
    if (parent) {
      const mo2 = new MutationObserver(syncBox);
      mo2.observe(parent, { attributes: true, attributeFilter: ['style','class'] });
    }
    window.addEventListener('resize', syncBox);
    let lastT = '';
    (function tick(){
      const t = getComputedStyle(canvas).transform || 'none';
      if (t !== lastT) { lastT = t; syncBox(); }
      requestAnimationFrame(tick);
    })();

    // Chargement robuste (CORS puis fallback)
    function load(url) {
      if (!url) return;
      const bust = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
      const tryLoad = cors => new Promise((ok, ko) => {
        const t = new Image();
        if (cors) t.crossOrigin = 'anonymous';
        t.onload = () => ok(t);
        t.onerror = ko;
        t.src = bust;
      });

      // on reste en <img> par défaut (respecte alpha). Si souci, tu mettras renderMode:'canvas'
      tryLoad(true)
        .then(im => { img.src = im.src; syncBox(); })
        .catch(() => tryLoad(false).then(im => { img.src = im.src; syncBox(); })
        .catch(e => console.error('[overlay] image error', e)));
    }

    // Démarrage en mode IMG (alpha natif), UI simple pour basculer si besoin
    useIMG();

    // Mini UI
    (function ui() {
      const box = document.createElement('div');
      Object.assign(box.style, {
        position: 'fixed', top: '10px', left: '10px',
        padding: '8px', background: 'rgba(0,0,0,.6)', color: '#fff',
        font: '12px/1 sans-serif', borderRadius: '8px', zIndex: '2147483647', userSelect: 'none'
      });
      box.innerHTML = `
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
          <strong>Patch overlay</strong>
          <button id="zpo-x" style="margin-left:auto">×</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin:4px 0">
          <input id="zpo-url" type="text" placeholder="URL PNG…" style="width:260px">
          <button id="zpo-load">charger</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin:4px 0">
          <span>opacité</span>
          <input id="zpo-op" type="range" min="0" max="1" step="0.01" style="width:160px">
          <span id="zpo-opv" style="width:34px;text-align:right"></span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin:4px 0">
          <span>anchor</span>
          <label>x <input id="zpo-ax" type="number" step="1" style="width:70px"></label>
          <label>y <input id="zpo-ay" type="number" step="1" style="width:70px"></label>
          <span style="opacity:.8">(px monde)</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin:4px 0">
          <span>mode</span>
          <select id="zpo-mode">
            <option value="img">img (recommandé)</option>
            <option value="canvas">canvas (fallback alpha)</option>
          </select>
        </div>
      `;
      document.body.appendChild(box);
      const q = s => box.querySelector(s);
      q('#zpo-url').value = cfg.url;
      q('#zpo-op').value = cfg.opacity;
      q('#zpo-opv').textContent = cfg.opacity.toFixed(2);
      q('#zpo-ax').value = cfg.anchorX;
      q('#zpo-ay').value = cfg.anchorY;
      q('#zpo-mode').value = cfg.renderMode;

      q('#zpo-load').addEventListener('click', () => { cfg.url = q('#zpo-url').value.trim(); load(cfg.url); });
      q('#zpo-op').addEventListener('input', e => { cfg.opacity = Number(e.target.value); if (cfg.renderMode==='img') img.style.opacity = String(cfg.opacity); syncBox(); });
      q('#zpo-ax').addEventListener('change', e => { cfg.anchorX = Math.max(0, Math.min(worldW, Math.round(Number(e.target.value)||0))); syncBox(); });
      q('#zpo-ay').addEventListener('change', e => { cfg.anchorY = Math.max(0, Math.min(worldH, Math.round(Number(e.target.value)||0))); syncBox(); });
      q('#zpo-mode').addEventListener('change', e => {
        cfg.renderMode = e.target.value;
        if (cfg.renderMode === 'img') { useIMG(); load(cfg.url); }
        else { useCANVAS(); load(cfg.url); }
      });
      q('#zpo-x').addEventListener('click', () => box.remove());
    })();

    // Go
    img.addEventListener('load', syncBox);
    load(cfg.url);
    syncBox();
  }

  waitForCanvas().then(install);
})();

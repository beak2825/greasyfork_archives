// ==UserScript==
// @name         HentaiHeroes / ComixHarem Image Grid Viewer (Right Click)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Right-click on a girl image to open all stages at once in a fullscreen grid.
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @match        http*://*.gayharem.com/*
// @match        http*://*.comixharem.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562385/HentaiHeroes%20%20ComixHarem%20Image%20Grid%20Viewer%20%28Right%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562385/HentaiHeroes%20%20ComixHarem%20Image%20Grid%20Viewer%20%28Right%20Click%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const $ = window.jQuery || null;

  /* =========================
     CDN / CONFIG
  ========================== */
  const imageExt = '-1200x.webp';

  const haremHead = (() => {
    if (document.body && document.body.id === 'hh_gay') return 'https://gh1';
    if (document.body && document.body.id === 'hh_comix') return 'https://ch';
    return 'https://hh2';
  })();

  /* =========================
     CSS DO GRID OVERLAY
  ========================== */
  const style = document.createElement('style');
  style.textContent = `
    #hhiv-grid {
      position: fixed;
      inset: 0;
      z-index: 99999999;
      background: rgba(0,0,0,0.93);
      display: none;
      overflow-y: auto;
    }
    #hhiv-grid .close {
      position: fixed;
      top: 16px;
      right: 20px;
      font-size: 28px;
      color: #fff;
      cursor: pointer;
      z-index: 2;
    }
    #hhiv-grid .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      padding: 24px;
    }
    #hhiv-grid img {
      width: 100%;
      border-radius: 12px;
      background: #111;
      cursor: zoom-in;
    }
    #hhiv-grid img:hover {
      outline: 3px solid #ff00ff;
    }
  `;
  document.head.appendChild(style);

  /* =========================
     HTML DO GRID
  ========================== */
  const overlay = document.createElement('div');
  overlay.id = 'hhiv-grid';
  overlay.innerHTML = `
    <div class="close">✕</div>
    <div class="grid"></div>
  `;
  document.body.appendChild(overlay);

  const grid = overlay.querySelector('.grid');
  const closeBtn = overlay.querySelector('.close');

  closeBtn.onclick = () => closeGrid();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeGrid();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGrid();
  });

  function closeGrid() {
    overlay.style.display = 'none';
    grid.innerHTML = '';
  }

  /* =========================
     UTILITÁRIOS
  ========================== */
  function extractGirlId(src) {
    if (!src) return null;
    const clean = src.split('?')[0];
    const match = clean.match(/pictures\/girls\/(\d+)\//);
    return match ? match[1] : null;
  }

  async function headOk(url) {
    try {
      const r = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return r && r.ok;
    } catch {
      return false;
    }
  }

  async function findMaxStage(girlId) {
    for (let g = 6; g >= 0; g--) {
      const url = `${haremHead}.hh-content.com/pictures/girls/${girlId}/ava${g}${imageExt}`;
      if (await headOk(url)) return g;
    }
    return 0;
  }

  /* =========================
     ABRIR GRID
  ========================== */
  async function openGridForGirl(girlId) {
    if (!girlId) return;

    grid.innerHTML = '';
    overlay.style.display = 'block';

    const maxStage = await findMaxStage(girlId);

    for (let i = 0; i <= maxStage; i++) {
      const src = `${haremHead}.hh-content.com/pictures/girls/${girlId}/ava${i}${imageExt}`;
      const img = document.createElement('img');
      img.src = src;
      img.title = `Stage ${i}`;
      img.onclick = () => window.open(src, '_blank');
      grid.appendChild(img);
    }
  }

  /* =========================
     BOTÃO DIREITO (CAPTURE)
  ========================== */
  document.addEventListener(
    'contextmenu',
    function (e) {
      const img = e.target.closest('img');
      if (!img) return;

      const girlId = extractGirlId(img.src || img.getAttribute('src'));
      if (!girlId) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      openGridForGirl(girlId);
    },
    true // CAPTURE PHASE — ignora bloqueio do jogo
  );

})();
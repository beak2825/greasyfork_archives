// ==UserScript==
// @name         Instant-Gaming - Ajoute bouton GO à gauche de la barre de recherche
// @name:en         Instant-Gaming - Adds GO button to the left of the search bar
// @namespace    https://tampermonkey.net/
// @version      1.3
// @match        https://www.instant-gaming.com/*
// @run-at       document-idle
// @grant        none
// @description        Script visant à ajouter un bouton GO à gauche de la barre de recherche
// @description:en        Script to add a GO button to the left of the search bar
// @downloadURL https://update.greasyfork.org/scripts/559052/Instant-Gaming%20-%20Ajoute%20bouton%20GO%20%C3%A0%20gauche%20de%20la%20barre%20de%20recherche.user.js
// @updateURL https://update.greasyfork.org/scripts/559052/Instant-Gaming%20-%20Ajoute%20bouton%20GO%20%C3%A0%20gauche%20de%20la%20barre%20de%20recherche.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BTN_ID = 'tm-ig-go-left-input';

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
  }

  function submitSearch() {
    const form = document.getElementById('ig-search-form');
    if (!form) return;
    if (form.requestSubmit) form.requestSubmit();
    else form.submit();
  }

  function getOrCreateBtn() {
    let btn = document.getElementById(BTN_ID);
    if (btn) return btn;

    btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.textContent = 'GO';
    btn.title = 'Lancer la recherche';

    btn.style.cssText = `
      position:fixed;
      z-index:999999;
      width:34px;
      height:34px;
      border-radius:9999px;
      border:2px solid #fff;
      background:transparent;
      color:#fff;
      font-size:12px;
      font-weight:800;
      line-height:1;
      display:none;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      padding:0;
      user-select:none;
    `;

    btn.addEventListener('click', submitSearch);
    document.body.appendChild(btn);
    return btn;
  }

  function computeAndPlace() {
    const closeBtn = document.querySelector('#ig-search > div.close-search');
    const input = document.getElementById('ig-header-search-box-input');
    const btn = getOrCreateBtn();

    // Contrainte demandée : visible seulement quand le close est visible
    if (!isVisible(closeBtn) || !input) {
      btn.style.display = 'none';
      return false;
    }

    const rIn = input.getBoundingClientRect();
    const gap = 10;
    const size = 34;

    btn.style.left = `${Math.round(rIn.left - gap - size)}px`;
    btn.style.top  = `${Math.round(rIn.top + (rIn.height / 2) - (size / 2))}px`;
    btn.style.display = 'flex';
    return true;
  }

  let rafOn = false;
  function rafLoop() {
    rafOn = true;
    const keep = computeAndPlace();
    if (keep) requestAnimationFrame(rafLoop);
    else rafOn = false;
  }

  function kick() {
    if (!rafOn) requestAnimationFrame(rafLoop);
  }

  // 1) Observer DOM + changements de classes/styles (c’est ça qui manquait)
  new MutationObserver(kick).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'aria-expanded', 'aria-hidden']
  });

  // 2) Kick immédiat au clic sur l’icône d’ouverture (et aussi sur le close)
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t) return;
    if (t.closest('.icon-search-input') || t.closest('#ig-search > div.close-search')) kick();
  }, true);

  // 3) Scroll/resize
  window.addEventListener('resize', kick, { passive: true });
  window.addEventListener('scroll', kick, { passive: true });

  kick();
})();

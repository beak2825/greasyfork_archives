// ==UserScript==
// @name         BetGenius API
// @namespace    bg-jump
// @version      1.1
// @author       JV
// @license      MIT
// @description  Najdi eventId ve vloženém iframe / URL a otevři API multisportgametracker
// @match        https://coolbet.betstream.betgenius.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549232/BetGenius%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/549232/BetGenius%20API.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getParams(u) {
    return Object.fromEntries(new URL(u, location.href).searchParams.entries());
  }

  function findEventId() {
    // 1) z iframe
    const ifr = [...document.querySelectorAll('iframe')]
      .find(f => /betstream-view|tennisscorecentre/i.test(f.src));
    if (ifr) {
      const p = getParams(ifr.src);
      if (p.eventId) return p.eventId;
    }
    // 2) z aktuální URL (fallback)
    const pHere = getParams(location.href);
    return pHere.eventId || pHere.fixtureId || null;
  }

  function buildApiUrl(eventId) {
    const country = getParams(location.href).country || 'CZ';
    return `https://coolbet.betstream.betgenius.com/widget-data/multisportgametracker?productName=coolbet&region=&country=${encodeURIComponent(country)}&fixtureId=${encodeURIComponent(eventId)}&activeContent=teamStats`;
  }

  function addBtn() {
    const id = findEventId();
    if (!id) return;

    const btn = document.createElement('button');
    btn.textContent = '→ Open BetGenius API';
    Object.assign(btn.style, {
      position: 'fixed', zIndex: 999999, top: '12px', right: '12px',
      padding: '8px 12px', borderRadius: '8px', border: '1px solid #999',
      background: '#fff', cursor: 'pointer', fontFamily: 'system-ui'
    });
    btn.onclick = () => window.open(buildApiUrl(id), '_blank');
    document.body.appendChild(btn);
  }

  // Zkus hned a ještě jednou po chvilce (kvůli lazy iframům)
  addBtn();
  setTimeout(addBtn, 1500);
})();

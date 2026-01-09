// ==UserScript==
// @name         NBF -> Infobasket button (match-center)
// @namespace    tampermonkey-nbf-infobasket
// @version      1.4
// @description  Tlačítko API basket
// @license      MIT
// @author       JV
// @match        https://nbf.kz/en/match/*
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561973/NBF%20-%3E%20Infobasket%20button%20%28match-center%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561973/NBF%20-%3E%20Infobasket%20button%20%28match-center%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_HOST = 'reg.infobasket.su';
  const TARGET_PATH = '/Widget/GetOnlineStatus/';
  const ANCHOR_SELECTOR = '.match-center';
  const RE_7DIGIT = /\b\d{7}\b/;

  let lastGamesParam = null;
  let lastStatusUrl = null;

  function normalizeGames(gamesValue) {
    const s = String(gamesValue ?? '').trim();
    const ids = (s.match(/\d+/g) || []).filter(x => x.length === 7);
    if (!ids.length) return null;

    const seen = new Set();
    const uniq = ids.filter(x => (seen.has(x) ? false : (seen.add(x), true)));
    return uniq.join(',');
  }

  function tryCapture(urlLike) {
    try {
      const url = new URL(String(urlLike), location.href);
      if (url.hostname !== TARGET_HOST) return false;
      if (!url.pathname.startsWith(TARGET_PATH)) return false;

      const games = url.searchParams.get('games');
      if (!games || !RE_7DIGIT.test(games)) return true;

      const normalized = normalizeGames(games);
      if (!normalized) return true;

      lastGamesParam = normalized;

      const out = new URL('https://' + TARGET_HOST + TARGET_PATH);
      out.searchParams.set('games', lastGamesParam);
      lastStatusUrl = out.toString();

      showButton();
      return true;
    } catch {
      return false;
    }
  }

  // --- Network hooks ---
  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const input = args[0];
    if (typeof input === 'string') tryCapture(input);
    else if (input && input.url) tryCapture(input.url);
    return origFetch.apply(this, args);
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    tryCapture(url);
    return origOpen.call(this, method, url, ...rest);
  };

  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e && e.name) tryCapture(e.name);
      }
    });
    po.observe({ entryTypes: ['resource'] });
  } catch {}

  // --- UI ---
  GM_addStyle(`
    #nbfInfobasketBtnWrap {
      display: none;
      margin: 10px 0;
      width: 100%;
      text-align: center;
    }
    #nbfInfobasketBtn {
      border: 0;
      border-radius: 10px;
      padding: 16px 24px;
      cursor: pointer;
      font-size: 13px;
      background: #111827;
      color: #fff;
      box-shadow: 0 6px 16px rgba(0,0,0,.15);
      opacity: .95;
    }
    #nbfInfobasketBtn:hover { opacity: 1; }
  `);

  let mounted = false;
  let wrap, btn;

  function mountIfPossible() {
    if (mounted) return true;

    const anchor = document.querySelector(ANCHOR_SELECTOR);
    if (!anchor || !anchor.parentNode) return false;

    wrap = document.createElement('div');
    wrap.id = 'nbfInfobasketBtnWrap';

    btn = document.createElement('button');
    btn.id = 'nbfInfobasketBtn';
    btn.textContent = 'API OnlineStatus';
    btn.addEventListener('click', () => {
      if (!lastStatusUrl) return;
      window.open(lastStatusUrl, '_blank', 'noopener,noreferrer');
    });

    wrap.appendChild(btn);

    // insert above .match-center
    anchor.parentNode.insertBefore(wrap, anchor);

    mounted = true;
    return true;
  }

  function showButton() {
    mountIfPossible();
    if (wrap) {
      wrap.style.display = 'block';
      btn.title = lastGamesParam ? `games=${lastGamesParam}` : '';
    }
  }

  const t = setInterval(() => {
    if (mountIfPossible()) clearInterval(t);
  }, 200);

  document.addEventListener('DOMContentLoaded', mountIfPossible);
})();
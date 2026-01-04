// ==UserScript==
// @name        Alternative Search Engines 2.2
// @description Adds quick links to run the same search on Google, Bing, DuckDuckGo, Yandex, Mojeek.
// @namespace   https://mekineer.com
// @license     GPL-3.0-or-later
// @version     0.4.0.1
// @grant       none
//
// Overlay script with multi-engine jump links. Adapted/finished with help from ChatGPT (Nova, GPT-5.1 Thinking).
// @match       *://www.google.*/*
// @match       *://duckduckgo.com/*
// @match       *://www.bing.com/*
// @match       *://yandex.*/*
// @match       *://www.mojeek.com/*
// @downloadURL https://update.greasyfork.org/scripts/557168/Alternative%20Search%20Engines%2022.user.js
// @updateURL https://update.greasyfork.org/scripts/557168/Alternative%20Search%20Engines%2022.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BOX_ID = 'alt-search-engines-overlay';

  // Engines + their base URL + query parameter name
  const ENGINES = {
    Google:     { url: 'https://www.google.com/search',   param: 'q'    },
    Bing:       { url: 'https://www.bing.com/search',     param: 'q'    },
    DuckDuckGo: { url: 'https://duckduckgo.com/',         param: 'q'    },
    Yandex:     { url: 'https://yandex.com/search/',      param: 'text' },
    Mojeek:     { url: 'https://www.mojeek.com/search',   param: 'q'    }
  };

  function detectCurrentEngine() {
    const h = location.hostname;
    if (/google\./.test(h))       return 'Google';
    if (/bing\.com$/.test(h))     return 'Bing';
    if (/duckduckgo\.com$/.test(h)) return 'DuckDuckGo';
    if (/yandex\./.test(h))       return 'Yandex';
    if (/mojeek\.com$/.test(h))   return 'Mojeek';
    return null;
  }

  function getCurrentQuery() {
    const url = new URL(location.href);
    const hostEngine = detectCurrentEngine();
    if (!hostEngine) return '';

    // Map which param we should read from the current engine
    let paramName = 'q';
    if (hostEngine === 'Yandex') paramName = 'text';

    // try param; fall back to other common ones just in case
    return (
      url.searchParams.get(paramName) ||
      url.searchParams.get('q') ||
      url.searchParams.get('text') ||
      ''
    );
  }

  function openOnEngine(engineName) {
    const cfg = ENGINES[engineName];
    if (!cfg) return;

    const q = getCurrentQuery();
    if (!q) return;

    const url = new URL(cfg.url);
    url.searchParams.set(cfg.param, q);
    window.open(url.toString(), '_self');
  }

  function createOverlay() {
    if (document.getElementById(BOX_ID)) return;

    const current = detectCurrentEngine();
    if (!current) return;

    const box = document.createElement('div');
    box.id = BOX_ID;

    // Basic styling: top-right overlay, small & unobtrusive
    Object.assign(box.style, {
      position: 'fixed',
      top: '6px',
      right: '10px',           // change to 'left' if you prefer
      zIndex: '2147483647',
      fontSize: '11px',
      fontFamily: 'Verdana, sans-serif',
      background: 'rgba(255,255,255,0.92)',
      color: '#555',
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: '4px',
      padding: '3px 6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      lineHeight: '1.4',
      whiteSpace: 'nowrap'
    });

    const label = document.createElement('span');
    label.textContent = 'Search also: ';
    box.appendChild(label);

    const engineNames = Object.keys(ENGINES);
    engineNames.forEach((name, idx) => {
      if (name === current) return; // don’t link to itself

      const link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.textContent = name;
      link.style.cursor = 'pointer';
      link.style.margin = '0 2px';
      link.style.textDecoration = 'underline';
      link.style.color = '#1a73e8';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        openOnEngine(name);
      });

      box.appendChild(link);

      // Separator dot between links
      const remaining = engineNames.filter(n => n !== current);
      if (idx < engineNames.length - 1 && name !== remaining[remaining.length - 1]) {
        const sep = document.createElement('span');
        sep.textContent = '·';
        sep.style.margin = '0 2px';
        box.appendChild(sep);
      }
    });

    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createOverlay);
  } else {
    createOverlay();
  }
})();
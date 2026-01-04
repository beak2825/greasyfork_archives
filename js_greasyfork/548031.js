// ==UserScript==
// @name         GOG Game Page - ITAD & PCGW with Icons + Clean Asterisk Search
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds ITAD and PCGamingWiki links to GOG game page with icons + asterisk that performs a clean PCGW search (simplified title without subtitles or editions)
// @author       -
// @match        https://www.gog.com/*/game/*
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548031/GOG%20Game%20Page%20-%20ITAD%20%20PCGW%20with%20Icons%20%2B%20Clean%20Asterisk%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/548031/GOG%20Game%20Page%20-%20ITAD%20%20PCGW%20with%20Icons%20%2B%20Clean%20Asterisk%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const itadIconUrl = 'https://isthereanydeal.com/favicon.png';
  const pcgwIconUrl = 'https://static.pcgamingwiki.com/favicons/pcgamingwiki.png';

  // To override certain titles to PCGW
    const manualSlugOverrides = {
    'the witcher 3: wild hunt - game of the year edition': 'The_Witcher_3:_Wild_Hunt',
    'the elder scrolls v skyrim special edition': 'The_Elder_Scrolls_V:_Skyrim_Special_Edition',
  };

  const slugify = str =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');

  function toPCGWTitle(str) {
    return str
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('_');
  }

  // Simplify the title for searching * (without subtitles, editions, etc.)
    function simplifyTitleForSearch(title) {
    let simple = title.split(/[:\-–(]/)[0]; // coupe à :, -, –, (
    simple = simple.replace(/Edition|Game\s*of\s*the\s*Year|GOTY|Remastered|Definitive|Complete|HD|Deluxe/gi, '');
    return simple.trim();
  }

  function waitForTitle(maxMs = 5000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const check = () => {
        const titleEl = document.querySelector('h1.game-title, .productcard-basics__title');
        if (titleEl) resolve(titleEl);
        else {
          elapsed += interval;
          if (elapsed >= maxMs) reject('Title not found');
          else setTimeout(check, interval);
        }
      };
      check();
    });
  }

  function makeLinkWithIcon(url, label, iconUrl) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.style.marginRight = '12px';
    a.style.display = 'inline-flex';
    a.style.alignItems = 'center';
    a.style.textDecoration = 'none';
    a.style.color = '#0a84ff';
    a.style.fontWeight = '500';

    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = '';
    img.style.width = '16px';
    img.style.height = '16px';
    img.style.marginRight = '6px';

    a.appendChild(img);
    a.appendChild(document.createTextNode(label));

    a.addEventListener('mouseenter', () => (a.style.textDecoration = 'underline'));
    a.addEventListener('mouseleave', () => (a.style.textDecoration = 'none'));

    return a;
  }

  waitForTitle()
    .then(titleEl => {
      const title = titleEl.textContent.trim();
      const titleLower = title.toLowerCase();

      const slugFull = slugify(title);
      const pcgwSlug = manualSlugOverrides[titleLower] || toPCGWTitle(title);

      const itadUrl = `https://isthereanydeal.com/game/${slugFull}/info/`;
      const pcgwUrl = `https://www.pcgamingwiki.com/wiki/${pcgwSlug}`;

      // Use of simplified title for search *
      const simpleTitle = simplifyTitleForSearch(title);
      const pcgwSearchUrl = `https://www.pcgamingwiki.com/wiki/Special:Search?search=${encodeURIComponent(simpleTitle)}`;

      const container = document.createElement('div');
      container.style.marginTop = '8px';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.4em';

      const itadLink = makeLinkWithIcon(itadUrl, 'IsThereAnyDeal', itadIconUrl);
      const pcgwLink = makeLinkWithIcon(pcgwUrl, 'PCGamingWiki', pcgwIconUrl);

      const asteriskWrapper = document.createElement('span');
      asteriskWrapper.style.marginLeft = '6px';

      const asterisk = document.createElement('a');
      asterisk.href = pcgwSearchUrl;
      asterisk.textContent = '*';
      asterisk.title = 'Approximate search on PCGamingWiki';
      asterisk.target = '_blank';
      asterisk.style.color = '#0a84ff';
      asterisk.style.fontWeight = '700';
      asterisk.style.textDecoration = 'none';
      asterisk.style.cursor = 'pointer';

      asterisk.addEventListener('mouseenter', () => (asterisk.style.textDecoration = 'underline'));
      asterisk.addEventListener('mouseleave', () => (asterisk.style.textDecoration = 'none'));

      asteriskWrapper.appendChild(asterisk);

      container.appendChild(itadLink);
      container.appendChild(pcgwLink);
      container.appendChild(asteriskWrapper);

      titleEl.parentNode.insertBefore(container, titleEl.nextSibling);
    })
    .catch(err => {
      console.warn('Script error ITAD/PCGW :', err);
    });
})();

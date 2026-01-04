// ==UserScript==
// @name         Strava Club Activity - filtr lokalizacji (Gdynia/Sopot/Gdańsk)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Pokazuje tylko aktywności z Gdyni, Sopotu, Gdańska na stronie feedu klubu Strava
// @author       JOUKI
// @match        https://www.strava.com/clubs/*/recent_activity
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552810/Strava%20Club%20Activity%20-%20filtr%20lokalizacji%20%28GdyniaSopotGda%C5%84sk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552810/Strava%20Club%20Activity%20-%20filtr%20lokalizacji%20%28GdyniaSopotGda%C5%84sk%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let filterOn = true; // startowo filtr jest aktywny
  let cities = ['Gdynia', 'Sopot', 'Gdańsk'];

  // uproszczenie porównań (bez polskich znaków, bez case’u)
  const normalize = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // usuń diakrytyki

  function createUI() {
    if (document.getElementById('local-filter-box')) return;

    const box = document.createElement('div');
    box.id = 'local-filter-box';
    box.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 9999;
      background: #fff;
      border: 1px solid #ccc;
      padding: 8px;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      font-family: sans-serif;
      font-size: 12px;
    `;

    const label = document.createElement('div');
    label.textContent = 'Miasta (przecinkami):';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = cities.join(', ');
    input.placeholder = 'np. Gdynia, Sopot, Gdańsk';
    input.style.cssText = `
      width: 240px;
      font-size: 12px;
      padding: 4px 6px;
      margin-bottom: 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: block;
    `;
    input.onchange = () => {
      cities = input.value
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      filterActivities();
    };

    const btn = document.createElement('button');
    btn.textContent = '🚫 Pokaż tylko wskazane miasta';
    btn.style.cssText = `
      background: #fc4c02;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      width: 100%;
    `;
    btn.onclick = () => {
      filterOn = !filterOn;
      btn.textContent = filterOn ? '🚫 Ukrywam wskazane miasta' : '👁️ Pokazuję wszystkie miasta';
      filterActivities();
    };

    box.appendChild(label);
    box.appendChild(input);
    box.appendChild(btn);
    document.body.appendChild(box);
  }

  function isLocalLocationText(locText) {
    if (!locText) return false;
    const normLoc = normalize(locText);
    // przygotuj też wersje miast bez ogonków
    const normCities = cities.map((c) => normalize(c));
    return normCities.some((city) => normLoc.includes(city));
  }

  function filterActivities() {
    // Każda karta aktywności (feed-entry-…)
    const entries = document.querySelectorAll('div[id^="feed-entry-"]');

    entries.forEach((entry) => {
      // lokalizacja: span[data-testid="location"]
      const locEl = entry.querySelector('[data-testid="location"]');
      if (!locEl) {
        // jeśli nie ma pola lokalizacji (np. posty bez miejsca) – decyzja:
        // ukryj, gdy filtrOn aktywny
        if (filterOn) entry.style.display = 'none';
        else entry.style.display = '';
        return;
      }
      const locText = locEl.textContent.trim();
      const isLocal = isLocalLocationText(locText);

      if (filterOn && !isLocal) {
        entry.style.display = 'none';
      } else {
        entry.style.display = '';
      }
    });
  }

  function init() {
    createUI();
    filterActivities();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Opcjonalnie: lekki observer tylko na kontener feedu (bez całego body)
  const feedContainer = document.querySelector('[data-testid="web-feed-entry"]')?.closest('.juEyw')?.parentElement || document.body;
  const observer = new MutationObserver((mutations) => {
    // reaguj tylko, gdy doszły nowe feed-entry-*
    const hasNewEntry = mutations.some((m) =>
      [...m.addedNodes].some(
        (n) => n.nodeType === 1 && (n.id?.startsWith?.('feed-entry-') || n.querySelector?.('div[id^="feed-entry-"]'))
      )
    );
    if (hasNewEntry) filterActivities();
  });
  observer.observe(feedContainer, { childList: true, subtree: true });
})();
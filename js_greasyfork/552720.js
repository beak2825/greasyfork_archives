// ==UserScript==
// @name         Netflix Extended Genres
// @namespace    TMW_MODS
// @version      1.0
// @description  Adds Netflix’s standard genres + secret categories dynamically from netflix-codes.com (auto-sync 🔥)
// @author       TMW-MODS
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      netflix-codes.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552720/Netflix%20Extended%20Genres.user.js
// @updateURL https://update.greasyfork.org/scripts/552720/Netflix%20Extended%20Genres.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const FIXED_WIDTH = 900;
  const FIXED_HEIGHT = 570;
  const ACTIVE_COLOR = '#e50914';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // === 1️⃣ Standard Netflix Genres (fixed inside the script) ===
  const STANDARD_GENRES = [
    { name: "Adventure Movies", id: 7442 },
    { name: "Action", id: 801362 },
    { name: "Anime", id: 3063 },
    { name: "Blockbusters", id: 90139 },
    { name: "German", id: 58886 },
    { name: "Documentaries", id: 2243108 },
    { name: "Dramas", id: 5763 },
    { name: "European", id: 89708 },
    { name: "Fantasy", id: 9744 },
    { name: "Halloween", id: 82120786 },
    { name: "Horror", id: 8711 },
    { name: "Independent", id: 7077 },
    { name: "International", id: 78367 },
    { name: "Kids & Family", id: 783 },
    { name: "Comedies", id: 6548 },
    { name: "Crime", id: 5824 },
    { name: "Short Films", id: 3345391 },
    { name: "Music & Musicals", id: 52852 },
    { name: "Award-winning Titles", id: 89844 },
    { name: "Romantic Movies", id: 8883 },
    { name: "Sci-Fi", id: 3276033 },
    { name: "Sports", id: 4370 },
    { name: "Stand-up Comedy", id: 11559 },
    { name: "Thrillers", id: 8933 }
  ];

  // === 2️⃣ Live Secret Codes from netflix-codes.com ===
  function fetchText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText);
          else reject(new Error("HTTP " + res.status));
        },
        onerror: (err) => reject(err)
      });
    });
  }

  function parseSecretGenres(htmlText) {
    const dom = new DOMParser().parseFromString(htmlText, 'text/html');
    const pinks = Array.from(dom.querySelectorAll('.text-pink-700'));
    const results = [];

    for (const pink of pinks) {
      const id = parseInt(pink.textContent.trim());
      const nameElem = pink.parentElement.querySelector('.ml-2');
      if (!id || !nameElem) continue;
      const name = nameElem.textContent.trim();
      if (!name || /^\d/.test(name)) continue;
      results.push({ id, name });
    }

    console.log(`✅ Parsed ${results.length} Secret Codes`);
    return results;
  }

  async function loadSecretCodes() {
    try {
      const html = await fetchText('https://www.netflix-codes.com/');
      return parseSecretGenres(html);
    } catch (err) {
      console.warn('⚠️ Error while loading secret codes:', err);
      return [];
    }
  }

  // === 3️⃣ Build the Genre Menu ===
  function getDropdown() {
    return $('.sub-header .nfDropDown.theme-lakira');
  }

  function renderColumns(container, items) {
    container.innerHTML = '';
    const perCol = Math.ceil(items.length / 3);
    for (let i = 0; i < 3; i++) {
      const ul = document.createElement('ul');
      ul.className = 'sub-menu-list multi-column';
      ul.style.cssText = `flex:1; overflow:visible;`;
      ul.innerHTML = items
        .slice(i * perCol, (i + 1) * perCol)
        .map(it => `<li class="sub-menu-item"><a href="/browse/genre/${it.id}" class="sub-menu-link">${it.name}</a></li>`)
        .join('');
      container.appendChild(ul);
    }
  }

  function buildAZBar(onChange) {
    const wrap = document.createElement('div');
    wrap.className = 'tmw-azbar';
    wrap.style.cssText = `
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(25px,1fr));
      gap:8px;
      padding:6px 8px 10px 8px;
      border-bottom:1px solid rgba(255,255,255,0.2);
      width:${FIXED_WIDTH}px;
      margin:auto;
      text-align:center;
    `;
    const letters = ['All'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    letters.forEach(letter => {
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.className = 'tmw-azbtn';
      btn.style.cssText = `
        background:none; border:none; color:inherit;
        text-decoration:underline; cursor:pointer;
        padding:2px 6px; transition:color 0.2s ease;
      `;
      btn.addEventListener('mouseenter', () => (btn.style.color = '#aaa'));
      btn.addEventListener('mouseleave', () => {
        if (!btn.classList.contains('active')) btn.style.color = 'inherit';
      });
      btn.addEventListener('click', () => onChange(letter));
      wrap.appendChild(btn);
    });
    return wrap;
  }

  async function injectMergedList(dropdown) {
    const menu = dropdown.querySelector('.sub-menu');
    if (!menu || $('.tmw-az-section', menu)) return;

    const section = document.createElement('div');
    section.className = 'tmw-az-section';
    section.style.cssText = `
      width:${FIXED_WIDTH}px;
      height:${FIXED_HEIGHT}px;
      overflow-y:auto;
      overflow-x:hidden;
      margin:auto;
    `;

    const style = document.createElement('style');
    style.textContent = `
      .tmw-az-section::-webkit-scrollbar { width:8px; }
      .tmw-az-section::-webkit-scrollbar-thumb {
        background:#666; border-radius:10px;
      }
      .tmw-az-section::-webkit-scrollbar-thumb:hover { background:#999; }
    `;
    document.head.appendChild(style);

    const secret = await loadSecretCodes();

    const merged = [...STANDARD_GENRES, ...secret].filter(
      (v, i, a) => a.findIndex(t => t.name.toLowerCase() === v.name.toLowerCase()) === i
    );

    const sorted = merged.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

    const colWrap = document.createElement('div');
    colWrap.className = 'tmw-columns';
    colWrap.style.cssText = `
      display:flex; flex-direction:row;
      gap:10px; flex-wrap:nowrap;
      width:${FIXED_WIDTH}px; margin:auto;
    `;

    const onFilterChange = letter => {
      const list = letter === 'All'
        ? sorted
        : sorted.filter(x => x.name.toUpperCase().startsWith(letter.toUpperCase()));
      renderColumns(colWrap, list);
      $all('.tmw-azbtn', section).forEach(b => {
        b.classList.remove('active');
        b.style.color = 'inherit';
      });
      const active = $all('.tmw-azbtn', section).find(b => b.textContent === letter);
      if (active) {
        active.classList.add('active');
        active.style.color = ACTIVE_COLOR;
      }
    };

    const azbar = buildAZBar(onFilterChange);
    section.appendChild(azbar);
    section.appendChild(colWrap);
    onFilterChange('All');

    menu.innerHTML = '';
    menu.appendChild(section);
  }

  async function run() {
    const dropdown = getDropdown();
    if (!dropdown) return;
    await injectMergedList(dropdown);
  }

  const mo = new MutationObserver(() => run());
  mo.observe(document.body, { childList: true, subtree: true });
  run();
})();
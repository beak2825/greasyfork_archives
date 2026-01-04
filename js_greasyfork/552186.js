// ==UserScript==
// @name:en         Author.Today → Flibusta & SearchFloor
// @name         Author.Today → Flibusta & SearchFloor
// @namespace    https://author.today/
// @version      1.0.2
// @description  Добавляет под обложкой панель поиска на Flibusta и SearchFloor
// @description:en Adds a search bar on Flibusta and SearchFloor under the cover
// @match        https://author.today/work/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552186/AuthorToday%20%E2%86%92%20Flibusta%20%20SearchFloor.user.js
// @updateURL https://update.greasyfork.org/scripts/552186/AuthorToday%20%E2%86%92%20Flibusta%20%20SearchFloor.meta.js
// ==/UserScript==


(async function () {
  'use strict';

  async function initPanel() {
    if (!/\/work\/\d+/.test(location.pathname)) return;

    // Удаляем предыдущую панель
    document.querySelector('#at-flibusta-panel')?.remove();

    const waitFor = sel => new Promise(resolve => {
      const check = () => {
        const el = document.querySelector(sel);
        if (el) return resolve(el);
        requestAnimationFrame(check);
      };
      check();
    });

    const titleEl = await waitFor('h1.book-title');
    const bookTitle = titleEl?.textContent.trim();
    if (!bookTitle) return console.warn('❌ Нет названия книги');

    const authors = [...document.querySelectorAll('.book-authors a')]
      .map(a => a.textContent.trim())
      .filter(Boolean);

    const seriesEl = document.querySelector('.book-meta-panel a[href*="/work/series/"]');
    const seriesName = seriesEl?.textContent.trim();

    const flibustaMirrors = [
      'https://flibusta.is',
      'https://flibusta.net'
    ];

    async function getWorkingFlibusta() {
      for (const url of flibustaMirrors) {
        try {
          await fetch(url, { method: 'HEAD', mode: 'no-cors' });
          return url;
        } catch {}
      }
      return flibustaMirrors[0];
    }

    const cachedMirror = localStorage.getItem('flibustaMirror');
    const flibustaBase = cachedMirror || await getWorkingFlibusta();
    if (!cachedMirror) localStorage.setItem('flibustaMirror', flibustaBase);

    const searchfloorBase = 'https://searchfloor.org/search/';

    function makeIconLink(title, url, iconUrl, size = 18) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.title = title;
      a.style.display = 'inline-flex';
      a.style.alignItems = 'center';
      a.style.justifyContent = 'center';
      a.style.width = `${size}px`;
      a.style.height = `${size}px`;
      a.style.marginLeft = '6px';
      a.style.borderRadius = '4px';
      a.style.background = '#fff';
      a.style.boxShadow = '0 0 2px rgba(0,0,0,0.15)';
      a.style.transition = 'transform .12s ease';
      a.onmouseenter = () => (a.style.transform = 'scale(1.15)');
      a.onmouseleave = () => (a.style.transform = 'scale(1)');
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = title;
      img.style.width = `${size - 4}px`;
      img.style.height = `${size - 4}px`;
      img.style.borderRadius = '3px';
      img.referrerPolicy = 'no-referrer';
      a.append(img);
      return a;
    }

    function makeRow(label, flibustaUrl, searchUrl) {
      const row = document.createElement('div');
      row.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3px 0;
        font: inherit;
        color: inherit;
        text-align: left;
      `;

      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      labelEl.style.lineHeight = '1.3';
      labelEl.style.display = 'flex';
      labelEl.style.alignItems = 'center';
      labelEl.style.fontWeight = /^📖|^📚/.test(label) ? '500' : '400';
      labelEl.style.flex = '1';
      labelEl.style.overflow = 'hidden';
      labelEl.style.textOverflow = 'ellipsis';
      labelEl.style.whiteSpace = 'nowrap';

      const icons = document.createElement('div');
      icons.style.display = 'flex';
      icons.style.flexShrink = '0';
      icons.style.alignItems = 'center';

      icons.append(
        makeIconLink('Flibusta', flibustaUrl, 'https://flibusta.is/sites/default/files/bluebreeze_favicon.ico'),
        makeIconLink('SearchFloor', searchUrl, 'https://searchfloor.org/static/favicon.png')
      );

      row.append(labelEl, icons);
      return row;
    }

    const actionPanel = document.querySelector('.book-action-panel');
    if (!actionPanel) return;

    const container = document.createElement('div');
    container.id = 'at-flibusta-panel';
    container.style.cssText = `
      margin-top: 10px;
      padding: 8px 10px;
      border-radius: 6px;
      background: #fafafa;
      border: 1px solid #e5e5e5;
      font-family: inherit;
      font-size: 13px;
      color: inherit;
      text-align: left;
    `;

    container.append(
      makeRow(
        `📖 ${bookTitle}`,
        `${flibustaBase}/booksearch?ask=${encodeURIComponent(bookTitle)}`,
        `${searchfloorBase}${encodeURIComponent(bookTitle)}`
      )
    );

    if (seriesName) {
      container.append(
        makeRow(
          `📚 ${seriesName}`,
          `${flibustaBase}/booksearch?ask=${encodeURIComponent(seriesName)}`,
          `${searchfloorBase}${encodeURIComponent(seriesName)}`
        )
      );
    }

    authors.forEach(author => {
      container.append(
        makeRow(
          `👤 ${author}`,
          `${flibustaBase}/booksearch?ask=${encodeURIComponent(author)}`,
          `${searchfloorBase}${encodeURIComponent(author)}`
        )
      );
    });

    actionPanel.append(container);
  }

  // --- Перехват навигации SPA ---
  function hookSpaNavigation() {
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    const trigger = () => {
      setTimeout(() => {
        if (/\/work\/\d+/.test(location.pathname)) {
          console.log('🔁 Обнаружен переход → обновляем панель');
          initPanel();
        }
      }, 400); // небольшая задержка, чтобы контент успел подгрузиться
    };

    history.pushState = function (...args) {
      _pushState.apply(this, args);
      trigger();
    };
    history.replaceState = function (...args) {
      _replaceState.apply(this, args);
      trigger();
    };
    window.addEventListener('popstate', trigger);
  }

  hookSpaNavigation();
  initPanel();
})();

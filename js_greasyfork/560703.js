// ==UserScript==
// @name         e621 Search Sorter
// @namespace    e621-search-sorter
// @version      1.2
// @description  Adds a post sorter under the search bar
// @match        https://e621.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560703/e621%20Search%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/560703/e621%20Search%20Sorter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForSearch() {
    const searchSection = document.querySelector('.post-search');
    if (!searchSection) {
      requestAnimationFrame(waitForSearch);
      return;
    }

    if (document.getElementById('tm-sorter-container')) return;

    // scoped styles
    if (!document.getElementById('tm-sorter-style')) {
      const style = document.createElement('style');
      style.id = 'tm-sorter-style';
      style.textContent = `
        .tm-sorter-select,
        .tm-sorter-button {
          font-family: "Segoe UI Supro", "Segoe UI", system-ui, sans-serif;
          border-radius: 0px;
        }
      `;
      document.head.appendChild(style);
    }

    const container = document.createElement('div');
    container.id = 'tm-sorter-container';
    container.style.marginTop = '8px';
    container.style.display = 'flex';
    container.style.gap = '6px';
    container.style.alignItems = 'center';

    const metricSelect = document.createElement('select');
    metricSelect.className = 'tm-sorter-select';
    metricSelect.innerHTML = `
      <option value="score">Score</option>
      <option value="favcount">Favorites</option>
      <option value="comment_count">Comments</option>
    `;

    const directionSelect = document.createElement('select');
    directionSelect.className = 'tm-sorter-select';
    directionSelect.innerHTML = `
      <option value="desc">Descending</option>
      <option value="asc">Ascending</option>
    `;

    const applyButton = document.createElement('button');
    applyButton.className = 'tm-sorter-button';
    applyButton.type = 'button';
    applyButton.textContent = 'Apply';

    applyButton.addEventListener('click', () => {
      const textarea = document.getElementById('tags');
      if (!textarea) return;

      const metric = metricSelect.value;
      const direction = directionSelect.value;

      if (direction === 'asc') {
        const ok = confirm(
          '\nascending warning!!\n\n' +
          'this could possibly expose u to content u don\'t want to see...\n\n' +
          'are u sure u want to proceed??'
        );
        if (!ok) return;
      }

      let orderTag = `order:${metric}`;
      if (direction === 'asc') {
        orderTag += '_asc';
      }

      let tags = textarea.value.trim();

      tags = tags
        .split(/\s+/)
        .filter(t => !t.startsWith('order:'))
        .join(' ');

      textarea.value = (tags + ' ' + orderTag).trim();

      const form = textarea.closest('form');
      if (form) form.submit();
    });

    container.appendChild(metricSelect);
    container.appendChild(directionSelect);
    container.appendChild(applyButton);

    searchSection.appendChild(container);
  }

  waitForSearch();
})();
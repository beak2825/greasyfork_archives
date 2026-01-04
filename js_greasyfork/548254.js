// ==UserScript==
// @name         AniList Sort by Chapters Toggle 
// @namespace    anilist-sort-chapters
// @version      1.5
// @description  Sort a single AniList manga list by total chapters; click button to toggle ascending/descending. 
// @match        https://anilist.co/user/*/mangalist*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548254/AniList%20Sort%20by%20Chapters%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/548254/AniList%20Sort%20by%20Chapters%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID = 'chapterSortBtn';
  let ascending = true; // start short → long

  function addButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const headerRow = document.querySelector('.list-head.row');
    if (!headerRow) return;

    const chapHeader = headerRow.querySelector('.progress'); // first .progress = Chapters
    if (!chapHeader) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.textContent = 'Sort by Chapters ↑';
    Object.assign(btn.style, {
      marginLeft: '0.5em',
      padding: '0.3em 0.6em',
      fontSize: '0.85rem',
      cursor: 'pointer',
    });

    btn.addEventListener('click', () => {
      sortByChapters();
      ascending = !ascending; // flip order
      btn.textContent = ascending
        ? 'Sort by Chapters ↑'
        : 'Sort by Chapters ↓';
    });

    chapHeader.appendChild(btn);
    console.log('Sort button added');
  }

  function sortByChapters() {
    const listContainer = document.querySelector('.list-entries');
    if (!listContainer) return;

    const entries = Array.from(listContainer.querySelectorAll('.row.entry'));
    if (!entries.length) return;

    const getTotalChapters = (entry) => {
      const progDiv = entry.querySelector('.progress');
      if (!progDiv) return 0;

      const text = progDiv.childNodes[0]?.textContent?.trim() || '';

      // Case 1: "12/100" → match 100
      let match = text.match(/\/(\d+)/);
      if (match) return parseInt(match[1], 10);

      // Case 2: "100" → parse whole thing
      match = text.match(/^(\d+)$/);
      if (match) return parseInt(match[1], 10);

      return 0;
    };

    const sorted = entries
      .map((e) => ({ el: e, total: getTotalChapters(e) }))
      .sort((a, b) => (ascending ? a.total - b.total : b.total - a.total))
      .map((o) => o.el);

    sorted.forEach((el) => listContainer.appendChild(el));
    console.log(`List sorted by chapters (${ascending ? '↑' : '↓'})`);
  }

  // SPA observer
  const observer = new MutationObserver(addButton);
  observer.observe(document.body, { childList: true, subtree: true });

  addButton();
})();
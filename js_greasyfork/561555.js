// ==UserScript==
// @name         Audible to MAM Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add buttons to search MAM for Audible books + IT/ES search
// @author       You
// @match        https://www.audible.com/*
// @match        https://www.audible.es/*
// @match        https://www.audible.co.uk/*
// @match        https://www.audible.fr/*
// @match        https://www.audible.de/*
// @match        https://www.audible.it/*
// @match        https://www.audible.ca/*
// @match        https://www.audible.com.au/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561555/Audible%20to%20MAM%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561555/Audible%20to%20MAM%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function extractBookInfo(bookElement) {
    try {
      const titleElement = bookElement.querySelector('h3.bc-heading a, h2.bc-heading');
      if (!titleElement) return null;

      let title = titleElement.textContent.trim();
      const fontElements = titleElement.querySelectorAll('font');
      if (fontElements.length > 0) {
        title = fontElements[fontElements.length - 1].textContent.trim();
      }

      const colonIndex = title.indexOf(':');
      if (colonIndex > 0) {
        const left = title.substring(0, colonIndex).trim();
        const right = title.substring(colonIndex + 1).trim();
        const looksLikeSeriesBlock = /\b(series|book|volume)\b/i.test(left);
        title = looksLikeSeriesBlock ? right : left;
      }

      // fallback from image alt if heading is missing/ambiguous
      if (!title || title.toLowerCase() === 'book 1' || title.toLowerCase() === 'book 2') {
        const img = bookElement.querySelector('img[alt*="Audiobook By"]');
        if (img && img.alt) {
          const alt = img.alt;
          const byIdx = alt.indexOf(' Audiobook By ');
          if (byIdx > 0) {
            title = alt.substring(0, byIdx).trim();
          }
        }
      }

      const authorElement = bookElement.querySelector('.authorLabel a');
      if (!authorElement) return null;

      let authorText = authorElement.textContent.trim();
      const authorFontElements = authorElement.querySelectorAll('font');
      if (authorFontElements.length > 0) {
        authorText = authorFontElements[authorFontElements.length - 1].textContent.trim();
      }

      const nameParts = authorText.split(' ');
      const lastName = nameParts[nameParts.length - 1].toLowerCase();

      return {
        title: title,
        author: authorText,
        authorLastName: lastName,
      };
    } catch (error) {
      console.error('error extracting book info:', error);
      return null;
    }
  }

  function createAudibleMultiSearchButton(title, author) {
    const query = encodeURIComponent(`${title} ${author}`);
    const esUrl = `https://www.audible.es/search?keywords=${query}`;
    const itUrl = `https://www.audible.it/search?keywords=${query}`;
    const site = window.location.hostname;

    const container = document.createElement('span');
    container.classList.add('audible-multi-search-button');

    function makeBtn(label, url, t) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.title = t;
      btn.style.cssText = `
        margin-left: 6px;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        vertical-align: middle;
        background: #a6a6a6;
      `;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, '_blank');
      });
      return btn;
    }

    if (site.endsWith('audible.com')) {
      container.appendChild(makeBtn('IT', itUrl, `Search Audible.it for "${title} ${author}"`));
      container.appendChild(makeBtn('ES', esUrl, `Search Audible.es for "${title} ${author}"`));
    } else if (site.endsWith('audible.it')) {
      container.appendChild(makeBtn('ES', esUrl, `Search Audible.es for "${title} ${author}"`));
    } else if (site.endsWith('audible.es')) {
      container.appendChild(makeBtn('IT', itUrl, `Search Audible.it for "${title} ${author}"`));
    }
    return container;
  }

  function createSearchURL(title, authorLastName) {
    const query = encodeURIComponent(`${title} ${authorLastName}`);
    return `https://www.myanonamouse.net/tor/browse.php?tor%5Btext%5D=${query}&tor%5BsrchIn%5D%5Btitle%5D=true&tor%5BsrchIn%5D%5Bauthor%5D=true&tor%5BsrchIn%5D%5Bseries%5D=true&tor%5BsearchType%5D=all&tor%5BsearchIn%5D=torrents&tor%5Bcat%5D%5B%5D=0&tor%5BbrowseFlagsHideVsShow%5D=0&tor%5Bunit%5D=1&tor%5BsortType%5D=dateDesc&tor%5BstartNumber%5D=0&thumbnail=true`;
  }

  function createMAMButton(bookInfo) {
    const button = document.createElement('button');
    button.innerHTML = '🔍 MAM';
    button.title = `Search MyAnonaMouse for "${bookInfo.title} ${bookInfo.authorLastName}"`;
    button.style.cssText = `
      background: #179b7c;
      color: white;
      border: none;
      padding: 4px 8px;
      margin: 2px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      vertical-align: middle;
    `;
    button.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const searchURL = createSearchURL(bookInfo.title, bookInfo.authorLastName);
      window.open(searchURL, '_blank');
    });

    return button;
  }

  function addButtonsToBooks() {
    const bookItems = document.querySelectorAll('.productListItem');

    bookItems.forEach((bookItem) => {
      const bookInfo = extractBookInfo(bookItem);
      if (!bookInfo) return;

      let mamButton = bookItem.querySelector('.mam-search-button');
      if (!mamButton) {
        let insertLocation = bookItem.querySelector('.authorLabel');
        if (!insertLocation) insertLocation = bookItem.querySelector('h3.bc-heading');
        if (!insertLocation) insertLocation = bookItem.querySelector('.bc-list-item');
        if (insertLocation) {
          mamButton = createMAMButton(bookInfo);
          mamButton.classList.add('mam-search-button');
          insertLocation.parentNode.insertBefore(mamButton, insertLocation.nextSibling);
        }
      }

      if (mamButton && !mamButton.nextSibling?.classList?.contains('audible-multi-search-button')) {
        const multiButton = createAudibleMultiSearchButton(bookInfo.title, bookInfo.author);
        mamButton.parentNode.insertBefore(multiButton, mamButton.nextSibling);
      }
    });
  }

  function observeChanges() {
    const observer = new MutationObserver(function (mutations) {
      let shouldAddButtons = false;
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) shouldAddButtons = true;
      });
      if (shouldAddButtons) setTimeout(addButtonsToBooks, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    addButtonsToBooks();
    observeChanges();
    const intervalId = setInterval(addButtonsToBooks, 3000);
    setTimeout(() => clearInterval(intervalId), 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

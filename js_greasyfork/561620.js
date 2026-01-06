// ==UserScript==
// @name        Ao3 Fanfiction Randomiser
// @description Opens a random fanfiction from any AO3 list.
// @namespace   Ao3
// @match       http*://archiveofourown.org/users/*/bookmarks*
// @match       http*://archiveofourown.org/bookmarks*
// @match       http*://archiveofourown.org/works*
// @grant       none
// @version     1.2.2
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561620/Ao3%20Fanfiction%20Randomiser.user.js
// @updateURL https://update.greasyfork.org/scripts/561620/Ao3%20Fanfiction%20Randomiser.meta.js
// ==/UserScript==

/** @const {number} */
const FICS_PER_PAGE = 20;

/** @const {string} */
const STORAGE_KEY = 'ao3RandomiserTrigger';

(function() {
  'use strict';

  if (localStorage.getItem(STORAGE_KEY) === '1') {
    localStorage.removeItem(STORAGE_KEY);
    const link = getRandomFanficLink();
    if (link) {
      link.click();
    }
    return;
  }

  const button = createRandomButton();
  injectButton(button);
})();

/**
 * Creates the "Open Random Fanfiction" button.
 * @return {!HTMLButtonElement}
 */
function createRandomButton() {
  const button = document.createElement('button');
  button.textContent = 'Open Random Fanfiction';
  button.addEventListener('click', navigateToRandomPage);
  return button;
}

/**
 * Inserts the button into the AO3 navigation bar.
 * @param {!HTMLButtonElement} button
 */
function injectButton(button) {
  const navItem = document.querySelector('ul[role="navigation"] li');
  if (!navItem) {
    return;
  }
  navItem.append(' ', button);
}

/**
 * Navigates to a random page while preserving filters.
 */
function navigateToRandomPage() {
  const maxPage = getFinalBookmarkPageNumber();
  const page = getRandomInt(maxPage) + 1;

  localStorage.setItem(STORAGE_KEY, '1');

  const url = new URL(window.location.href);
  const base = url.origin + url.pathname;

  const filters = url.pathname.includes('/users/')
      ? `?page=${page}`
      : buildUpdatedFilters(page);

  window.location.href = `${base}${filters}`;
}

/**
 * Builds a query string with a new page number while preserving filters.
 * @param {number} pageNumber
 * @return {string}
 */
function buildUpdatedFilters(pageNumber) {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  params.set('page', pageNumber);
  return `?${params.toString()}`;
}

/**
 * Returns the last available bookmark page number.
 * @return {number}
 */
function getFinalBookmarkPageNumber() {
  const pagination = document.querySelector('.pagination.actions.pagy');
  if (!pagination) {
    return 1;
  }

  const nodes = pagination.childNodes;
  const lastPageNode = nodes[nodes.length - 2];

  const pageNumber = parseInt(lastPageNode?.textContent, 10);
  return Number.isFinite(pageNumber) ? pageNumber : 1;
}

/**
 * Returns a random fanfic or series link from the current page.
 * @return {?HTMLAnchorElement}
 */
function getRandomFanficLink() {
  const links = [...document.querySelectorAll("h4.heading a")]
    .filter(a => a.href.includes("/works/") || a.href.includes("/series/"));

  return links[getRandomInt(Math.min(links.length, FICS_PER_PAGE))];
}

/**
 * Returns an integer in the range [0, max).
 * @param {number} max
 * @return {number}
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

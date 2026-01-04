// ==UserScript==
// @name        Y Combinator Hacker News Job Posts Adblock
// @version     1.4
// @match       https://news.ycombinator.com/*
// @exclude     https://news.ycombinator.com/user*
// @author      Dave121
// @description Removes ads on https://news.ycombinator.com/
// @license     GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @namespace   https://greasyfork.org/en/users/102920-dave121
// @downloadURL https://update.greasyfork.org/scripts/556198/Y%20Combinator%20Hacker%20News%20Job%20Posts%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/556198/Y%20Combinator%20Hacker%20News%20Job%20Posts%20Adblock.meta.js
// ==/UserScript==

// do you wish to re-number the posts after the removed ads?
const FIX_NUMBERING = false;

// Select all "athing" rows
const rows = document.querySelectorAll('tr.thing, tr.athing');

// Filter rows that do NOT contain a vote arrow (i.e., job posts)
const filteredRows = [...rows].filter(row => !row.querySelector('td.votelinks'));

// Remove both the "athing" and its subtext row
filteredRows.forEach(row => {
  // remove the main row
  const next = row.nextElementSibling;
  row.remove();

  // remove its detail row (age | hide | comments)
  if (next && !next.classList.contains('athing')) {
    next.remove();
  }
});


if (FIX_NUMBERING) {
  document
    .querySelectorAll('span.rank')
    .forEach?.((s, i) => s.textContent && (s.textContent = `${i + 1}.`));
}
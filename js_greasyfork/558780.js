// ==UserScript==
// @name         GC World Challenge Helper
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.3
// @description  Highlights rows that have unmatched scores in GC's World Challenges.
// @author       sanjix
// @match        https://www.grundos.cafe/games/challenges/current/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558780/GC%20World%20Challenge%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558780/GC%20World%20Challenge%20Helper.meta.js
// ==/UserScript==

var rows = document.querySelectorAll('.wc-score-table tbody tr');
rows.forEach((row) => {
  var tally = parseInt(row.children[1].textContent);
  var scores = parseInt(row.children[5].textContent);
  if (tally != scores) {
    row.classList.add('unmatched');
  }
});

var odds = document.querySelectorAll('.wc-score-table tbody tr:nth-child(odd).unmatched');
var evens = document.querySelectorAll('.wc-score-table tbody tr:nth-child(even).unmatched');

odds.forEach((row) => {
    row.style.backgroundColor = 'lightblue';
});
evens.forEach((row) => {
    row.style.backgroundColor = 'rgba(173, 216, 230, 0.57)';
});
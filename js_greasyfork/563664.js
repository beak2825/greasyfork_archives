// ==UserScript==
// @name        BC: list artists
// @namespace   userscript1
// @match       https://*.bandcamp.com/*
// @grant       none
// @version     0.1.2
// @author      -
// @description extract artists from track titles
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/563664/BC%3A%20list%20artists.user.js
// @updateURL https://update.greasyfork.org/scripts/563664/BC%3A%20list%20artists.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let artists = [];
  const titles = document.querySelectorAll('#track_table .title');
  titles.forEach(t => {
    t = t.textContent.trim();
    t = t.substr(0, t.lastIndexOf('-'))
    t.split(/, | & /).forEach(s => {
      s = s.trim();
      if (s != '') {
        artists.push(s);
      }
    });
  });

  if (artists.length == 0) { return; }

  let unique_artists = [...new Set(artists)];

  let target = document.querySelector('div.middleColumn');
  if (!target) { return; }
  let elm = document.createElement('textarea');
  elm.style.cssText='width: 100%; max-width: 100%; height: 10em; white-space: pre;';
  elm.textContent = unique_artists.join('\n');
  target.appendChild(elm);

})();
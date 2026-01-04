// ==UserScript==
// @name         Add anchor links to headings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes every title a clickable #anchor, (almost) how it was originally intended.
// @author       Baerbeisser
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549276/Add%20anchor%20links%20to%20headings.user.js
// @updateURL https://update.greasyfork.org/scripts/549276/Add%20anchor%20links%20to%20headings.meta.js
// ==/UserScript==

// SPDX-License-Identifier: MIT

(function() {
  'use strict';
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    if (!heading.querySelector('a[href]') && !heading.closest('a[href]')) {
      const title = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      const anchor = document.createElement('a');
      anchor.href = `#${title}`;
      anchor.id = title;
      anchor.style.color = 'inherit'; // inherit the color of the parent element
      anchor.style.textDecoration = 'none'; // prevent underline
      anchor.textContent = heading.textContent;
      heading.innerHTML = '';
      heading.appendChild(anchor);
    }
  });
})();
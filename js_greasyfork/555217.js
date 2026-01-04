// ==UserScript==
// @name         ft css
// @description  Hide articles with podcast/deals tags, Sponsored Post author, the Featured section, all sidebars, and branded widgets
// @match        https://www.ft.com/*
// @version 0.0.1.20251108181306
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/555217/ft%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/555217/ft%20css.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
blockquote {
display: none !important;
}
    `;
  document.head.appendChild(style);
})();
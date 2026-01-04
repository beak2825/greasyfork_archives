// ==UserScript==
// @name         archive ft css
// @description  a
// @match        https://archive.ph/*
// @version 0.0.1.20251018073738
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/552979/archive%20ft%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/552979/archive%20ft%20css.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
blockquote {
    /*display: none !important;*/
    visibility: hidden;
}
  `;
  document.head.appendChild(style);
})();
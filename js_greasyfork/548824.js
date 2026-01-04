// ==UserScript==
// @name        searchmysite css
// @description a
// @match       https://searchmysite.net/*
// @run-at      document-start
// @version 0.0.1.20250908134901
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/548824/searchmysite%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/548824/searchmysite%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
html {
    color-scheme: light dark !important;
}

* {
    color: revert !important;
    background-color: revert !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
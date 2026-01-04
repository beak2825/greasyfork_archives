// ==UserScript==
// @name        xcancel css
// @description a
// @match       https://xcancel.com/*
// @run-at      document-end
// @version 0.0.1.20251108073807
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/548791/xcancel%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/548791/xcancel%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
a.tweet-stat {
    color: var(--grey);
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
// ==UserScript==
// @name         pinterest css
// @description  a
// @match        https://www.pinterest.com/*
// @version 0.0.1.20251018165458
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/553023/pinterest%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/553023/pinterest%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
style.id = 'pinterestCssStyleId';

    style.textContent = `
div:has(> div > div > div[data-test-id="main-pin-hover-overlay"]) {
display: none !important;
}
        `;
    document.head.appendChild(style);
})();
// ==UserScript==
// @name         docs x css
// @description  a
// @match        https://docs.x.com/*
// @version 0.0.1.20251112113128
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/555610/docs%20x%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/555610/docs%20x%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
    style.textContent = `
* {
color: revert !important;
background: revert !important;
}
        `;
    document.head.appendChild(style);
})();
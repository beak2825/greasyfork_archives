// ==UserScript==
// @name         Bazaar Scroll Remover
// @namespace    https://torn.com/
// @version      1.0
// @description  Overrides overflow-x:hidden for .list__lkOUv.opened__gmF7S
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561522/Bazaar%20Scroll%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/561522/Bazaar%20Scroll%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
.list___lkOUV {
    position: absolute;
    right: 500%;
    overflow-x: visible !important;
    left: auto;
}

.opened___gmF7S {
    position: absolute;
    right: 500%;
    overflow-x: visible !important;
    left: auto;
}

    `;
    document.documentElement.appendChild(style);
})();

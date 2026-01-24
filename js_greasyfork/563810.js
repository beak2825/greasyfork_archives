// ==UserScript==
// @name         Montagane Parfums Sold Out Item Remover
// @namespace    http://tampermonkey.net/
// @version      2025-08-17
// @description  Removes fragrances that are sold out from the montagane parfums fragrance listing.
// @author       Blottoboxer
// @license MIT
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637

// @match        https://www.montagneparfums.com/fragrance*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=montagneparfums.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563810/Montagane%20Parfums%20Sold%20Out%20Item%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/563810/Montagane%20Parfums%20Sold%20Out%20Item%20Remover.meta.js
// ==/UserScript==
/* global onElementReady */

onElementReady("div .ProductList-item .sold-out", { findOnce: false }, (el) => {
    el.remove();
})
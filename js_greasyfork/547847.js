// ==UserScript==
// @name         MAL forum - collapse quotes
// @namespace    pepe
// @version      2025-08-30
// @description  conversation will be easier to follow by collapsing long quote chains into smaller preview snippets
// @match        https://myanimelist.net/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547847/MAL%20forum%20-%20collapse%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/547847/MAL%20forum%20-%20collapse%20quotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const icon = (style='') => `<svg style="height:2.5em; width:2.5em; ${style}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 9l6 6 6-6"/>
</svg>`

    document.querySelectorAll('.quotetext').forEach(el => {
        if (el?.scrollHeight > 300) {
            el.outerHTML =
`<div class="collapsible">
  <div class="collapsible__content" data-height="${el.scrollHeight}">
    ${el.outerHTML}
  </div>
  <label class="collapsible__header ${el.classList.value}">
    <input type="checkbox" class="collapsible__toggle">
    <span class="show-more-text" style="display:flex; align-items: center;">Read More ${icon()}</span>
    <span class="show-less-text" style="display:flex; align-items: center;">Read Less ${icon('transform: rotate(180deg);')}</span>
  </label>
</div>`
        }
    });

GM_addStyle(`
/* expand style */

.collapsible__header {
  display: block;
  cursor: pointer;
  font-weight: bold;
}

.collapsible__toggle {
  display: none;
}

/* expand logic */

.collapsible__content {
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.collapsible:has(.collapsible__toggle:checked) .collapsible__content {
  /* max-height: calc-size(fit-content); can skip data-height when this gets added */
  max-height: attr(data-height px);
}

.collapsible:has(.collapsible__toggle:checked) .show-more-text {
  display: none!important;
}
.collapsible:has(.collapsible__toggle:not(:checked)) .show-less-text {
  display: none!important;
}
`)
    
})();
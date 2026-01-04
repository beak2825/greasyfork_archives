// ==UserScript==
// @name         Trakt.tv | Enhanced List Preview Posters
// @description  Makes the posters of list preview stacks/shelves link to the respective title summary pages instead of the list page and adds corner rating indicators for rated titles. See README for details.
// @version      1.0.5
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550075/Trakttv%20%7C%20Enhanced%20List%20Preview%20Posters.user.js
// @updateURL https://update.greasyfork.org/scripts/550075/Trakttv%20%7C%20Enhanced%20List%20Preview%20Posters.meta.js
// ==/UserScript==

/* README
### General
- The [Trakt.tv | Bug Fixes and Optimizations](brzmp0a9.md) userscript fixes some rating related issues and enables (more) reliable updates of the list-preview-poster rating indicators.
*/


'use strict';

let $;


addStyles();

document.addEventListener('turbo:load', () => {
  $ ??= unsafeWindow.jQuery;
  if (!$) return;

  unsafeWindow.ratingOverlay = ratingOverlay;

  addLinksToPosters();

  $(document).off('ajaxSuccess.userscript12944').on('ajaxSuccess.userscript12944', (_evt, _xhr, opt) => {
    if (opt.url.endsWith('/popular_lists')) {
      addLinksToPosters();
      unsafeWindow.addOverlays();
    }
  });
}, { capture: true });


function ratingOverlay($e, rating) { // addOverlays() natively calls ratingOverlay() for list preview posters (with wrong selection) and handles .corner-rating removal if necessary
  if (!$e.length) {
    const $prevSelection = $e.end();
    if ($prevSelection.closest('.personal-list').length && $prevSelection.hasClass('poster')) $e = $prevSelection;
  }
  if (!$e.find('.corner-rating').length) {
    $e.prepend(`<div class="corner-rating corner-rating-${rating}"><div class="text">${rating}</div></div>`);
  }
}

function addLinksToPosters() {
  $('.personal-list .poster[data-url]:not(:has(> a))').each(function() {
    $(this).children().wrapAll(`<a href="${$(this).attr('data-url')}"></a>`);
  });
};
unsafeWindow.userscriptAddLinksToListPreviewPosters = addLinksToPosters; // exposed for "Trakt.tv | All-in-One Lists View" userscript


function addStyles() {
  GM_addStyle(`
@media not (767px < width <= 991px) {
  .personal-list .poster .corner-rating {
    border-width: 0 24px 24px 0 !important;
  }
  .personal-list .poster .corner-rating > .text {
    height: 24px !important;
    width: 12px !important;
    right: -18px !important;
    font-size: 11px !important;
    line-height: 11px !important;
  }
}

.personal-list .poster.dropped-show .dropped-badge-wrapper {
  top: 50% !important; /* otherwise covers up summary page anchor tag */
  height: auto !important;
}
  `);
}
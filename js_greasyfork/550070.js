// ==UserScript==
// @name         Trakt.tv | Average Season And Episode Ratings
// @description  Shows the average general and personal rating of the seasons of a show and the episodes of a season. You can see the averages for all episodes of a show on its /seasons/all page. See README for details.
// @version      1.0.4
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
// @downloadURL https://update.greasyfork.org/scripts/550070/Trakttv%20%7C%20Average%20Season%20And%20Episode%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/550070/Trakttv%20%7C%20Average%20Season%20And%20Episode%20Ratings.meta.js
// ==/UserScript==

/* README
> Based on Tusky's [Trakt Average Season Rating](https://greasyfork.org/scripts/30728) userscript.

### General
- The general ratings average is weighted by votes, to account for the inaccurate ratings of unreleased seasons/episodes.
- Specials are always excluded, except on the specials season page.
- Only visible (i.e. not hidden by a filter) items are used for the calculation of the averages and changes to those filters trigger a recalculation.
*/


'use strict';

let $;
const numFormatCompact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
numFormatCompact.formatTLC = (n) => numFormatCompact.format(n).toLowerCase();


addStyles();

document.addEventListener('turbo:load', () => {
  if (!location.pathname.startsWith('/shows/') || location.pathname.includes('/episodes/')) return;

  $ ??= unsafeWindow.jQuery;
  if (!$) return;

  const $grid = $('#seasons-episodes-sortable'),
        $summaryUserRating = $('#summary-ratings-wrapper .summary-user-rating'),
        $traktRating = $('#summary-ratings-wrapper .trakt-rating');
  if (!$grid.length || !$summaryUserRating.length || !$traktRating.length) return;
  const avgRatings = unsafeWindow.userscriptAvgSeasonEpisodeRatings = {};
  let items;

  $summaryUserRating[0].mutObs = new MutationObserver(() => { // .summary-user-rating mutations occur frequently and are caused by all sorts of things
    if (!$summaryUserRating.hasClass('popover-on')) {
      updatePersRatingElem($summaryUserRating, avgRatings.personal);
    }
  });

  updatePersRatingElem($summaryUserRating);
  updateGenRatingElem($traktRating);

  const filterSpecials = !location.pathname.endsWith('/seasons/0');
  $grid.on('arrangeComplete', () => {
    if ($grid.data('isotope')) {
      items = $grid.data('isotope').filteredItems.filter((i) => filterSpecials ? i.element.dataset.seasonNumber !== '0' : true);
      avgRatings.personal = calcAvgPersRating(items);
      avgRatings.general = calcAvgGenRating(items);
      updatePersRatingElem($summaryUserRating, avgRatings.personal);
      updateGenRatingElem($traktRating, avgRatings.general);
    }
  });

  $(document).off('ajaxSuccess.userscript32985').on('ajaxSuccess.userscript32985', (_evt, _xhr, opt) => {
    if (items && /\/ratings\/(seasons|episodes)\.json$|\/rate/.test(opt.url)) { // title was (un)rated OR cached personal ratings (and .corner-ratings) were updated
      avgRatings.personal = calcAvgPersRating(items);
      updatePersRatingElem($summaryUserRating, avgRatings.personal);
    }
  });
}, { capture: true });


function calcAvgPersRating(items) {
  const persRatings = items.map((i) => +$(i.element).find('.corner-rating > .text').text()).filter(Boolean);
  return {
    average: persRatings.length ? persRatings.reduce((acc, persRating) => acc + persRating, 0) / persRatings.length : undefined,
    votes: persRatings.length,
  };
}

function calcAvgGenRating(items) {
  const genRatingsVotesSum = items.reduce((acc, i) => acc + i.sortData.votes, 0);
  return {
    average: genRatingsVotesSum ? items.reduce((acc, i) => acc + (i.sortData.percentage * (i.sortData.votes / genRatingsVotesSum)), 0) : undefined,
    votes: genRatingsVotesSum,
  };
}

function updatePersRatingElem($summaryUserRating, avgPersRating) {
  $summaryUserRating[0].mutObs.disconnect();
  $summaryUserRating
    .find('.rating')
    .each(function() {
      const rating = $(this).parent().prev().attr('class').match(/rating-(\d+)/)?.[1];
      if (rating) $(this).html(`${rating}<div class="votes">${unsafeWindow.ratingsText?.[rating] ?? ''}</div>`);
    });
  $summaryUserRating
    .find('.number > .votes')
    .removeClass('alt')
    .text(`avg: ${avgPersRating?.average ? `${avgPersRating.average.toFixed(1)}` : '--'} ` +
          `(${avgPersRating?.votes !== undefined ? numFormatCompact.formatTLC(avgPersRating.votes) : '--'} v.)`);
  $summaryUserRating[0].mutObs.observe($summaryUserRating[0], { subtree: true, childList: true });
}

function updateGenRatingElem($traktRating, avgGenRating) {
  if (!$traktRating.has('.rating .votes').length) {
    $traktRating
      .find('.votes')
      .clone()
      .appendTo($traktRating.find('.rating'))
      .text((_i, text) => `(${text.match(/^.*? v/)?.[0] ?? '0 v'}.)`);
  }
  $traktRating
    .find('.number > .votes')
    .text(`avg: ${avgGenRating?.average ? `${Math.round(avgGenRating.average)}` : '--'}% ` +
          `(${avgGenRating?.votes !== undefined ? numFormatCompact.formatTLC(avgGenRating.votes) : '--'} v.)`);
}


function addStyles() {
  GM_addStyle(`
#summary-ratings-wrapper .ratings .rating {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
}
#summary-ratings-wrapper .ratings .rating .votes {
  margin-left: 7px !important;
  color: #fff !important;
}
  `);
}
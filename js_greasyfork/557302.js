// ==UserScript==
// @name         Trakt.tv | Bug Fixes and Optimizations
// @description  A large collection of bug fixes and optimizations for trakt.tv, organized into ~30 independent sections, each with a comment detailing which specific issues are being addressed. Also contains some minor feature patches. See README for details.
// @version      0.7.8
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
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/557302/Trakttv%20%7C%20Bug%20Fixes%20and%20Optimizations.user.js
// @updateURL https://update.greasyfork.org/scripts/557302/Trakttv%20%7C%20Bug%20Fixes%20and%20Optimizations.meta.js
// ==/UserScript==

/* README
### General
- Please take a look at [the code](../dist/brzmp0a9.user.js) and glimpse over the comments for each section to get an idea as to what exactly you can expect from this script.
- Notably there are also a handful of feature patches included, all of them too minor to warrant a separate userscript:
  - make the "add to list" buttons on grid pages (e.g. /trending) color-coded:<br>
      [![light blue](https://img.shields.io/badge/%20-%20-008ada?style=flat-square&labelColor=008ada)](#) = is on watchlist,
      [![dark blue](https://img.shields.io/badge/%20-%20-0066a0?style=flat-square&labelColor=0066a0)](#) = is on personal list,
      [![50/50](https://img.shields.io/badge/%20-%20-0066a0?style=flat-square&labelColor=008ada)](#) = is on both
  - change the default sorting on /people pages from "released" to "popularity"
  - grey out usernames of deleted profiles in the comments
  - append `(@<userslug>)` to usernames in comments (Trakt allows users to set a "Display Name", separate from the username/slug. This becomes a problem in comment replies
      which always reference the person/comment they are replying to with an `@<userslug>` prefix, which sometimes turns long reply chains into a game of matching pairs..), currently not supported in FF
  - some custom hotkeys and gestures as displayed below

### Hotkeys/Gestures (Custom and Native)
- ***[CUSTOM]*** `alt + 1/2/3/4/5/6/7`: change header-search-category, 1 for "Shows & Movies", 2 for "Shows", ..., 7 for "Users", also expands header-search if collapsed
- ***[CUSTOM]*** `swipe in from left edge`: display title sidebar on mobile devices
- `meta(win)/ctrl + left click`: open in new tab instead of redirect (applies to header search results + "view watched history" button on title summary pages)
- `/`: expand header-search
- `w`: show filter-by-streaming-services modal
- `t`: show filter-by-terms modal
- `a`: toggle advanced-filters
- `m`: toggle manage-list mode (with item move, delete etc.)
- `r`: toggle reorder-lists mode (change list-rank on /lists page)
- `esc`: collapse header-search, hide popover, hide modal (check-in, watch-now, filter-by-terms)
- `enter`: redirect to selected header-search result, submit (advanced filters selection, date-time-picker input etc.)
- `ctrl + enter`: save note, submit comment
- `arrow-left/right OR p/n OR swipe right/left on fanart`: page navigation (e.g. prev/next episode, prev/next results page)
- `arrow-up/down`: header-search results navigation
*/


/* BUG REPORTS
- items in "most watched shows and movies" section on profile page lack data-source-counts and data-source-slugs attrs for watch-now modal
- progress > dropped > toggle grid-view button => triggers GET /settings/grid_view/progress_dropped/1 or /0 and results in 400 resp but works for watched and collected
- There's no safeguarding against naming personal lists either "liked" or "collaborations". Leads to inaccessible lists, as list url (even when using id) always points to e.g. /lists/liked
- ratings distribution data is sometimes malformed (length of 11 with first index having value 1/2) e.g. /movies/oppenheimer-2023/stats, only affects movs + shows
- trakt api studio slugs only work with /search?studios= if no hyphens are included (meaning studio name is one single word) (why include slugs in response at all if deprecated?)
- network info in .additional-stats of /seasons/all pages is invalid, seems to always be some memory address instead of the actual network name, only affects free users
    <li class="stat"><label>Networks</label>#&lt;Network:0x00007fcf800876c0&gt;, #&lt;Network:0x00007fcf80087580&gt;, #&lt;Network:0x00007fcf80087440&gt;</li>
- "view progress" data for alternate seasons is nonsense (can be e.g. some random special episode or the show itself, not sure about the pattern) /shows/attack-on-titan/seasons/alternate/2848
- /discover/comments/reviews/lists /shouts/lists and /all/lists all return the same list comments
- somehow ascending/descending sort directions seem to consistently be inverted across the entire website
- The switch between mobile and tablet layout is controlled with media queries like max-width: 767px and min-width: 768px, which cause the page layout to break at a window width of
    767px < width < 768px. At least in Chrome there's no rounding to the nearest integer. A switch to operators like <= and > would cover that edge case as well.
- "Progress" -> "Dropped" 1. doesn't allow for sorting by dropped date 2. still has a working "drop show" button despite shows already having been dropped
- "allow comments" setting of lists can be bypassed with manual post request (/comments page is available regardless of setting + this even works for deleted user profiles)
- appending a second date (which one doesn't matter) to the /shows-movies calendar url like /calendars/my/shows-movies/2024-10-14/2024-10-16 returns a view for all days until 2030
*/


'use strict';

// FINISHED
/////////////////////////////////////////////////////////////////////////////////////////////

// swipe gestures prevent scrolling in title stats section (with external ratings, number of comments, etc.) on mobile layout because it's not set as excluded element
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  if (!unsafeWindow.jQuery) return;
  const subDescs = Object.getOwnPropertyDescriptors(unsafeWindow.jQuery.fn.swipe),
        desc = Object.getOwnPropertyDescriptor(unsafeWindow.jQuery.fn, 'swipe'),
        oldValue = desc.value;
  desc.value = function(...args) {
    if (this.attr('id') === 'summary-wrapper') args[0].excludedElements = '#summary-ratings-wrapper .stats';
    return oldValue.apply(this, args);
  };
  Object.defineProperty(unsafeWindow.jQuery.fn, 'swipe', desc);
  Object.entries(subDescs).forEach(([k, v]) => !['length', 'name', 'prototype'].includes(k) && Object.defineProperty(unsafeWindow.jQuery.fn.swipe, k, v));
});


// hearts of rating popover can line-wrap on mobile-layout, which can result in an incorrect rating getting set
GM_addStyle(`
.popover .rating-hearts {
  min-width: max-content;
}
`);


// list-aware colors for list buttons of grid-items: "is on watchlist" (light blue) vs "is on personal list" (dark blue), 50/50 if both are true
GM_addStyle(`
.grid-item .actions .list.selected.watchlist .base {
  background: #008ada !important;
}
.grid-item .actions .list.selected.personal .base {
  background: #0066a0 !important;
}
.grid-item .actions .list.selected.watchlist.personal .base {
  background: linear-gradient(90deg, #008ada 50%, #0066a0 50%) !important;
}
`);


// Sort the titles on /people pages by descending (they say asc but it's actually desc) "popularity" instead of "released" on initial page load (arguably the more relevant sort order).
document.addEventListener('turbo:load', () => {
  if (/^\/people\/[^\/]+$/.test(location.pathname) && !location.search) history.replaceState({}, document.title, location.pathname + '?sort=popularity,asc');
}, { capture: true });


// - displays userslug next to username in comments (useful as the "reply to" references in comments use @userslug which can differ from the display name)
// - grey out usernames of deleted profiles in comments
GM_addStyle(`
@supports (color: attr(data-color type(<color>))) {
  .comment-wrapper[data-user-slug] {
    --userslug: attr(data-user-slug);
  }
  .comment-wrapper[data-user-slug] .user-name :is(.username, .type + strong)::after {
    content: " (@" var(--userslug) ")";
  }
  .comment-wrapper[data-user-slug] .user-name {
    max-width: calc(100% - 40px) !important;
  }
  .comment-wrapper[data-user-slug] .user-name > h4 {
    white-space: nowrap;
    overflow-x: clip;
    text-overflow: ellipsis;
  }
}

.comment-wrapper[data-user-slug] .user-name .type + strong {
  color: #aaa !important;
}
`);


// when closing the "add to list" popover the "close" tooltip doesn't get destroyed,
// same with poster tooltips of progress grid-items on /dashboard and /progress pages when marking title as watched with auto-refresh turned on
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  if (!unsafeWindow.jQuery) return;
  const subDescs = Object.getOwnPropertyDescriptors(unsafeWindow.jQuery.fn.tooltip),
        desc = Object.getOwnPropertyDescriptor(unsafeWindow.jQuery.fn, 'tooltip'),
        oldValue = desc.value;
  desc.value = function(...args) {
    if (args[0]?.container && this.closest('.popover, #ondeck-wrapper, #progress-grid-wrapper').length) delete args[0].container;
    return oldValue.apply(this, args);
  };
  Object.defineProperty(unsafeWindow.jQuery.fn, 'tooltip', desc);
  Object.entries(subDescs).forEach(([k, v]) => !['length', 'name', 'prototype'].includes(k) && Object.defineProperty(unsafeWindow.jQuery.fn.tooltip, k, v));
});


// allows for displaying the sidebar of a title on mobile devices by swiping in from the left edge
GM_addStyle(`
@media (width <= 767px) {
  #info-wrapper .sticky-wrapper {
    display: block !important;
  }
  #info-wrapper .sidebar {
    position: fixed;
    top: 0 !important;
    left: 0;
    z-index: 20;
    width: 40%;
    padding: calc(10px + var(--header-height)) 10px 0;
    height: 100%;
    background-color: rgb(29 29 29 / 96%);
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s;
    margin: revert !important;
  }
  #info-wrapper.with-mobile-sidebar .sidebar {
    transform: translateX(0);
  }
}
`);
window.addEventListener('turbo:load', () => {
  const $infoWrapper = unsafeWindow.jQuery('body.touch-device #info-wrapper:has(.sidebar)');
  $infoWrapper.swipe({
    excludedElements: '#summary-ratings-wrapper .stats, #info-wrapper .season-links .links, #actors .posters',
    swipeRight: (_evt, _direction, _distance, _duration, _fingerCount, fingerData) => fingerData[0].start.x < 50 && $infoWrapper.addClass('with-mobile-sidebar'),
    swipeLeft: (_evt, _direction, _distance, _duration, _fingerCount, _fingerData) => $infoWrapper.removeClass('with-mobile-sidebar'),
  });
});


// adds hotkeys for changing header-search-category: alt + 1 for "Shows & Movies", alt + 2 for "Shows", ..., alt + 7 for "Users", also expands header-search if collapsed
window.addEventListener('turbo:load', () => {
  document.querySelectorAll('#header-search-type .dropdown-menu li:has(~ .divider) a').forEach((el, i) => {
    unsafeWindow.Mousetrap.bind(`alt+${i+1}`, () => el.click());
    unsafeWindow.Mousetrap(document.getElementById('header-search-query')).bind(`alt+${i+1}`, () => el.click());
  });
});


// add "open in background tab" on middle-click / ctrl+enter support where missing to mimic anchor tag behavior
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  const $ = unsafeWindow.jQuery;
  if (!$) return;

  // open watched-history page of title in bg tab on "view history" middle click
  $(document).on('auxclick', '.btn-watch .view-all', function(evt) {
    evt.preventDefault();
    GM_openInTab(location.origin + $(this).attr('data-url'), { setParent: true });
  });

  // open header-search-results in bg tab on middle click
  $(document).on('mousedown mouseup', '#header-search-autocomplete-results .selected', function(evt) {
    if (evt.which === 2 && !$(evt.target).closest('a').length) { // ignore events from watch-now links
      if (evt.type === 'mousedown') evt.preventDefault();
      else {
        unsafeWindow.searchModifierKey = true;
        $(this).trigger('click');
      }
    }
  });
});
// allow for ctrl + enter to open selected header-search-result in bg tab as native meta + enter hotkey doesn't work on windows
document.addEventListener('keydown', (evt) => {
  if (evt.ctrlKey && evt.key === 'Enter' && evt.target.closest?.('#header-search-query')) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      keyCode: 13,
      metaKey: true,
      bubbles: true,
      cancelable: true,
    }));
  }
}, { capture: true });


/* RATING BUGS
- .mobile-poster .corner-rating doesn't get updated/added until after the next page reload (unlike .sidebar poster .corner-rating)
- if(ratings && ratings[id]) ratings[id] = stars; doesn't work if title is/was unrated, so rating doesn't get cached in ratings object, which in turn causes various issues:
    - it's not possible to rate and then unrate at title without prior page reload (hearts gauge is wrong as well)
    - when adding a watched entry and rating a title in quick succession, the former calls cacheUserData() which calls addOverlays() which
        uses stale ratings data from local storage, as the server-side ratings were only updated after cacheUserData() had already been called,
        and therefore incorrectly removes the .sidebar .corner-rating, which was just added by the rating action
- Why is ratings object getting updated (when it works) before ajaxSuccess? Could lead to incorrect local ratings data if ajax call fails. Should in general wait for ajaxSuccess for overlays etc.
- When rating a title it can happen that just before the popover gets closed, a mouseover event fires on a different rating-heart, then .summary-user-rating doesn't get updated properly,
    because in the else branch of the hearts.on('click', ...) callback, only ratedText.html() is called and not ratingText.hide() + ratedText.show(),
    as it is done (in reverse) for the "if (remove)" branch (this is usually not an issue because the mouseover callback handles the .show() and .hide() correctly, except for that edge case)
- cached ratings in local storage are not directly updated, can result in glitches upon next page reload and incorrect rating indicators before the next page reload,
    if addOverlays() is called after rating a title as that uses the stale cached ratings data from local storage, which can happen in a number of different scenarios, for example:
    - title was just rated on its summary page and then the checkin modal gets opened and closed with esc => wipes rating indicators
    - title gets rated on summary page, user scrolls down all the way to the #related-items section => dynamic fetching of items => addOverlays() => wiped rating indicators
*/
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  const $ = unsafeWindow.jQuery;
  if (!$) return;

  $(document).on('ajaxSuccess', (_evt, _xhr, opt) => {
    if (opt.url.endsWith('/rate')) {
      const params = new URLSearchParams(opt.data),
            [type, id, stars] = ['type', 'trakt_id', 'stars'].map((key) => params.get(key));

      unsafeWindow[type + 's'].ratings[id] = stars;
      unsafeWindow.compressedCache.set(`ratings_${type}s`, unsafeWindow[type + 's'].ratings);

      unsafeWindow.addOverlays(); // does the same as what's commented out below, has some overhead, but also updates list-preview-poster rating indicators from "Enhanced List Preview Posters" userscript
      // const $summaryUserRating = $('#summary-ratings-wrapper .summary-user-rating');
      // if (opt.url.startsWith($summaryUserRating.attr('data-url'))) {
      //   const $posters = $(':is(#summary-wrapper .mobile-poster, #info-wrapper .sidebar) .poster');
      //   $posters.find('.corner-rating').remove();
      //   unsafeWindow.ratingOverlay($posters, stars);

      //   $summaryUserRating
      //     .find('.rating-text').hide()
      //     .end().find('.rated-text').show();
      // }
    } else if (opt.url.endsWith('/rate/remove')) {
      const params = new URLSearchParams(opt.data),
            type = params.get('type');

      unsafeWindow.compressedCache.set(`ratings_${type}s`, unsafeWindow[type + 's'].ratings); // ratings object already gets updated correctly

      unsafeWindow.addOverlays();
      // const $summaryUserRating = $('#summary-ratings-wrapper .summary-user-rating');
      // if (opt.url.startsWith($summaryUserRating.attr('data-url'))) {
      //   const $posters = $(':is(#summary-wrapper .mobile-poster, #info-wrapper .sidebar) .poster');
      //   $posters.find('.corner-rating').remove();
      // }
    }
  });
});


// long urls in list descriptions can break layout on pages with list-rows
GM_addStyle(`
.personal-list .list-description {
  overflow-wrap: anywhere;
}
`);


// - advanced-filters networks dropdown menu is too unresponsive (takes several seconds to load or to process query), can be fixed by tweaking chosen.js options
// - chosen.js (used for all dropdown menus of advanced filters) is not supported on mobile devices, seeing as there is no native fallback to the plugin and as it seems to (for the most part)
//     work just fine on mobile devices, the least invasive way to restore function there is by spoofing the user agent during the chosen.js setup, to pass the browser_is_supported() check
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  if (!unsafeWindow.jQuery) return;
  const subDescs = Object.getOwnPropertyDescriptors(unsafeWindow.jQuery.fn.chosen),
        desc = Object.getOwnPropertyDescriptor(unsafeWindow.jQuery.fn, 'chosen'),
        oldValue = desc.value;
  desc.value = function(...args) {
    if (this.attr('id') === 'filter-network_ids') args[0].max_shown_results = 200;

    if (/iP(od|hone)|IEMobile|Windows Phone|BlackBerry|BB10|Android.*Mobile/i.test(unsafeWindow.navigator.userAgent)) {
      Object.defineProperty(unsafeWindow.navigator, 'userAgent', { // shadowing works as real userAgent lives on prototype
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        configurable: true,
      });
      try {
        return oldValue.apply(this, args);
      } finally {
        delete unsafeWindow.navigator.userAgent;
      }
    } else {
      return oldValue.apply(this, args);
    }
  };
  Object.defineProperty(unsafeWindow.jQuery.fn, 'chosen', desc);
  Object.entries(subDescs).forEach(([k, v]) => !['length', 'name', 'prototype'].includes(k) && Object.defineProperty(unsafeWindow.jQuery.fn.chosen, k, v));
});


// like list button with 1k+ likes goes from e.g. 1,234 to 2 upon liking because of parseInt(number.html())
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  const $ = unsafeWindow.jQuery;
  if (!$) return;

  $(document).on('ajaxSend', (_evt1, _xhr1, opt1) => {
    if (/\/lists\/[\d]+\/like/.test(opt1.url)) {
      const id = new URLSearchParams(opt1.data).get('trakt_id'),
            $countNumber = $(`[data-list-id="${id}"] > .like .count-number`),
            oldLikeCount = $countNumber.text(),
            remove = opt1.url.includes('/remove');

      $(document).one('ajaxSuccess', (_evt2, _xhr2, opt2) => {
        if (opt1.url === opt2.url) $countNumber.text(unsafeWindow.numeral(oldLikeCount)[remove ? 'subtract' : 'add'](1).format('0,0'));
      });
    }
  })
});


// The items of the #activity (people that are watching the title right now) and #actors sections on title summary pages have a number of absolute static inline styles (set upon page load)
// to control width and height. Window resizing breaks the layout of those sections in various ways (sizing, overlaps etc) and can cause the "+n more" btn to be outdated.
// The following overrides these inline styles to size and position the respective elems dynamically.
GM_addStyle(`
#activity .users-wrapper {
  width: 100%;
  padding-bottom: 15px !important;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 10px;
  counter-reset: plusMoreCounter attr(data-count type(<number>));
}
#activity .users-wrapper .plus-more {
  grid-area: 1 / -2 / 2 / -1;
  display: grid;
  place-content: center;
  position: revert !important;
  height: revert !important;
  width: revert !important;
}
#activity .users-wrapper .plus-more .text {
  position: relative !important;
}
@supports (color: attr(data-color type(<color>))) {
  #activity .users-wrapper .plus-more .text {
    display: none;
  }
  #activity .users-wrapper .plus-more::after {
    content: "+" counter(plusMoreCounter) "\\Amore";
    white-space: pre;
    line-height: 1;
    font-weight: var(--headings-font-weight);
    font-family: var(--headings-font-family);
    font-size: 16px;
  }
}
#activity .users-wrapper .row {
  grid-area: 1 / 1 / 2 / -1;
  display: grid;
  grid-template-columns: subgrid;
  row-gap: 10px;
  max-height: revert !important;
  margin: revert !important;
}
#activity .users-wrapper .row::before,
#activity .users-wrapper .row::after {
  content: revert !important;
}
#activity .users-wrapper .row > div {
  counter-increment: plusMoreCounter -1;
  width: revert !important;
  padding: revert !important;
}
#activity .users-wrapper .row > div img {
  aspect-ratio: 1; /* for bg while img is loading */
  margin-bottom: revert !important;
}
@media (width <= 767px) {
  #activity .users-wrapper {
    padding-bottom: 10px !important;
  }
}
@media (width <= 991px) {
  #activity .users-wrapper .row > :nth-child(n + 6) {
    display: none;
  }
}
@media (991px < width <= 1200px) {
  #activity .users-wrapper {
    grid-template-columns: repeat(9, 1fr);
  }
  #activity .users-wrapper .row > :nth-child(n + 9),
  #activity .users-wrapper:not(:has(> .row > :nth-child(9))) .plus-more {
    display: none;
  }
}
@media (width > 1200px) {
  #activity .users-wrapper {
    grid-template-columns: repeat(12, 1fr);
  }
  #activity .users-wrapper .row > :nth-child(n + 12),
  #activity .users-wrapper:not(:has(> .row > :nth-child(12))) .plus-more {
    display: none;
  }
}
#activity .users-wrapper .row:has(+ .plus-more[style*="display: none;"]) > div,
#activity .users-wrapper .row:not(:has(+ .plus-more)) > :nth-child(-n + 12) { /* downsizing with 7-12 items (no btn in that case) */
  display: block;
}


#actors .posters {
  container-type: inline-size;
}
#actors .posters ul {
  width: max-content !important;
  display: flex;
  --gap: 10px;
  gap: var(--gap);
}
#actors .posters ul li {
  width: calc((100cqi - ((var(--visible-items) - 1) * var(--gap))) / var(--visible-items)) !important;
}
#actors .posters ul li :is(.poster, .titles) {
  margin-right: revert !important;
}
@media (width <= 767px) {
  #actors .posters ul {
    --gap: 0px;
    --visible-items: 4;
  }
}
@media (767px < width <= 991px) {
  #actors .posters ul {
    --visible-items: 6;
  }
}
@media (991px < width <= 1200px) {
  #actors .posters ul {
    --visible-items: 8;
  }
}
@media (1200px < width) {
  #actors .posters ul {
    --visible-items: 10;
  }
}
.actor-tooltip {
  margin-top: 5px;
  margin-left: revert !important;
}
`);


// .readmore elems on a user's /lists page (list descriptions) lack data-sortable attr, also getSortableGrid() is undefined in that scope, which prevents the readmore afterToggle and blockProcessed
// callbacks from working as intended, resulting in text overflow when clicking on "read more" (or gaps when clicking on "read less") AFTER isotope instance has been initialized (due to sorting/filtering)
const optimizedRenderReadmore = () => {
  const $readmore = unsafeWindow.jQuery('.readmore:not([id^="rmjs-"])').filter((_i, e) => unsafeWindow.jQuery(e).height() > 350); // height() filtering because readmore plugin is prone to layout thrashing
  $readmore.readmore({
    embedCSS: false,
    collapsedHeight: 300,
    speed: 200,
    moreLink: '<a href="#">Read more...</a>',
    lessLink: '<a href="#">Read less...</a>',
    afterToggle: (_trigger, $el, _expanded) => $el.closest('#sortable-grid').length && unsafeWindow.$grid?.isotope(),
  });
  requestAnimationFrame(() => unsafeWindow.$grid?.isotope());
};
Object.defineProperty(unsafeWindow, 'renderReadmore', {
  get: () => optimizedRenderReadmore,
  set: () => {}, // native renderReadmore() gets assigned on turbo:load
  configurable: true,
});


// replaces malihu scrollbars on season and episode pages (bar with links to other seasons/episodes) with regular css scrollbars because malihu scrollbars: are less responsive, don't support panning,
// "all" link gets cut off on tablet and mobile-layout if lots of items present, fixed inline width messes up layout when resizing, touch scrolling is jerky and doesn't work directly on scrollbar
GM_addStyle(`
#info-wrapper .season-links .links {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.2s;
  width: revert !important;
}
#info-wrapper .season-links .links:hover {
  scrollbar-color: rgb(102 102 102 / 0.4) transparent;
}
#info-wrapper .season-links .links > ul {
  width: max-content !important;
}
`);
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  if (unsafeWindow.jQuery) unsafeWindow.jQuery.fn.mCustomScrollbar = function() { return this; }; // malihu scrollbars are not used anywhere else
});
document.addEventListener('turbo:load', () => {
  document.querySelector('#info-wrapper .season-links .links .selected')?.scrollIntoView({ block: 'nearest', inline: 'start' });
}, { capture: true });


// The filter dropdown menu on /people pages has three hidden display type entries [seasons, episodes, people] which have the .selected class and are therefore included in the count for the
// .filter-counter indicator (=> off by three), despite not actually being accessible and having no effect on the filtered titles, as only shows and movies are listed on /people pages.
document.addEventListener('turbo:load', () => {
  if (/^\/people\/[^\/]+$/.test(location.pathname)) unsafeWindow.jQuery?.('#filter-fade-hide .dropdown-menu li.typer:is(.season, .episode, .person) a.selected').removeClass('selected');
}, { capture: true });


// on click handler for csv btn throws as this one (unlike the other feed btns) is not intended to have a popover
window.addEventListener('turbo:load', () => unsafeWindow.jQuery?.('.feed-icon.csv').off('click'));


// on single-comment-view pages .above-comment has a variable height depending on its content, .above-comment-bg (full-width bg bar up top underneath .above-comment)
// however always has the same fixed height, so .above-comment and its own bg sometimes extend beyond .above-comment-bg
GM_addStyle(`
@media (767px < width) {
  body.comments:has(#read) {
    overflow-x: clip !important;
  }
  body.comments #read > .comment-wrapper > .above-comment::before,
  body.comments #read > .comment-wrapper > .above-comment::after {
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    background-color: inherit;
    width: 100vw;
  }
  body.comments #read > .comment-wrapper > .above-comment::before {
    right: 100%;
  }
  body.comments #read > .comment-wrapper > .above-comment::after {
    left: 100%;
  }
}
`);


// prevent comments on discover page from being cut off at the bottom on mobile-layout
GM_addStyle(`
@media (width <= 767px) {
  body.discover .comment-wrapper .comment {
    padding-bottom: 30px !important;
  }
}
`);


// Set #links-wrapper (category selection on user and settings pages) height to a fixed 40px with dynamic vertical spacing for the links, to prevent both
// vertical overflow (with scrollbar) inside the #links-wrapper and overlap with the #watching-now-wrapper when there's a horizontal scrollbar.
GM_addStyle(`
#links-wrapper {
  height: 40px !important;
}
#links-wrapper .container {
  height: 100% !important;
  display: flex !important;
  align-items: center;
}
#links-wrapper .container a {
  line-height: inherit !important;
}
`);


// - watch-now buttons of "today" column in "upcoming schedule" section of dashboard lack data-source-counts attr which makes them throw on click
// - when marking an episode as watched on the dashboard's "up next" section with activated auto-refresh, no poster tooltip gets added to the new grid-item because posterGridTooltips() doesn't get called
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  unsafeWindow.jQuery?.(document).on('ajaxSuccess', (_evt, _xhr, opt) => {
    if (opt.url.endsWith('/dashboard/schedule')) unsafeWindow.jQuery('#schedule-wrapper .btn-watch-now:not([data-source-counts])').attr('data-source-counts', '{}');
    if (/\/(dashboard\/on_deck|progress_item\/watched)\/\d+$/.test(opt.url)) unsafeWindow.posterGridTooltips?.();
  });
});


// There's horizontal overflow on the body in a variety of different scenarios, too many to handle individually (e.g. many charts after downsizing and mobile-layout pages in general).
GM_addStyle(`
body {
  overflow-x: clip !important;
}
`);


// - add missing margin to "add comment" button on tablet-layout comment pages
// - fix styling of mobile layout "add comment" button on the watchlist comment page (default selectors don't cover that one specific edge case)
GM_addStyle(`
@media (767px < width < 992px) {
  .comment-wrapper.list.keep-inline .interactions {
    margin-left: revert !important;
  }
}

@media (width <= 767px) {
  body.watchlist_comments .comment-wrapper.lists {
    padding-left: 10px;
  }
  body.watchlist_comments .comment-wrapper.lists .count-text {
    display: none;
  }
}
`);


// add missing dark-mode bg color for focused dropdown-menu anchor tags (e.g. after mouse-middle-click), otherwise defaults to white from light-mode
GM_addStyle(`
  .dark-knight .dropdown-menu a:focus {
    background-color: #222 !important;
  }
`);


// Adds a scrollbar to the #summary-ratings-wrapper on title pages (bar up top with ratings, plays, watchers etc.), which usually only allows for panning. This is handled per row on mobile-layout,
// where by default you can only scroll the whole container as one. Also prevents the text-shadow of the rating icons from getting cut off at the top.
GM_addStyle(`
#summary-ratings-wrapper > .container {
  padding-top: revert !important;
}
@media (width <= 767px) {
  #summary-ratings-wrapper {
    border-top: revert !important;
  }
  #summary-ratings-wrapper .ul-wrapper {
    padding: revert !important;
    margin-bottom: revert !important;
  }
  #summary-ratings-wrapper .ul-wrapper ul {
    height: 50px;
    line-height: 39px;
    overflow-x: auto;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.2s;
  }
  #summary-ratings-wrapper .ul-wrapper ul:hover {
    scrollbar-width: thin;
    scrollbar-color: rgb(102 102 102 / 0.4) transparent;
  }
  #summary-ratings-wrapper .ul-wrapper ul.ratings {
    padding: 0 10px !important;
    border-block: solid 1px #333;
  }
  #summary-ratings-wrapper .ul-wrapper ul.stats {
    margin: 0 10px !important;
    padding: 0 !important;
    border-top: revert !important;
  }
  #summary-ratings-wrapper .ul-wrapper ul li {
    vertical-align: -37%;
  }
}
@media (767px < width) {
  #summary-ratings-wrapper .ul-wrapper {
    height: 60px;
    line-height: 49px;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.2s;
    padding-bottom: revert !important;
    margin-bottom: revert !important;
  }
  #summary-ratings-wrapper .ul-wrapper:hover {
    scrollbar-width: thin;
    scrollbar-color: rgb(102 102 102 / 0.4) transparent;
  }
  #summary-ratings-wrapper .ul-wrapper li {
    vertical-align: -33%;
  }
}
`);


// Fix for missing event listeners on mobile-layout "expand options" btns for the grids on user, list and settings pages, if window was downsized after initial page load.
document.addEventListener('click', (evt) => {
  if (evt.target.closest('.toggle-feeds')) {
    evt.stopPropagation();
    document.querySelector('.toggle-feeds-wrapper')?.classList.toggle('open');
  } else if (evt.target.closest('.toggle-subnav-options')) {
    evt.stopPropagation();
    document.querySelector('.toggle-subnav-wrapper')?.classList.toggle('open');
  }
}, { capture: true });


// Make added Array.prototype props/functions non-enumerable. Otherwise causes issues with for..in loops and the props also get listed as event listeners in chrome dev tools.
((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  ['remove', 'intersection', 'move', 'uniq'].forEach((fnName) => {
    const desc = Object.getOwnPropertyDescriptor(Array.prototype, fnName);
    if (desc) {
      desc.enumerable = false;
      Object.defineProperty(Array.prototype, fnName, desc);
    }
  });
});


// Fix table overflow on /releases pages for mobile and tablet-layout.
GM_addStyle(`
body.releases .panel-body {
  overflow-x: auto !important;
  scrollbar-width: thin;
  scrollbar-color: #666 #333;
}
body.releases .panel-body tr :is(th, td):last-of-type {
  min-width: revert !important;
}
`);


// Fix incorrect and inconsistent application of grayscale filter on summary pages of dropped shows, for example by default
// fanart is in grayscale on title summary pages, but not on title summary subpages (/stats, /comments, /lists, /credits, /seasons/all),
// it's the opposite for the images inside of watch-now buttons (not their bg color though) and profile pictures and emoji in the comment sections are also handled inconsistently.
GM_addStyle(`
body.shows :is(#comments, .sidebar .streaming-links) img {
  filter: none !important;
}
body.shows #summary-wrapper:has(> .summary .poster.dropped-show) :is(.full-screenshot, .delta, img) {
  filter: grayscale(100%) !important;
}
`);


// Add missing margin between #actors section and #episodes header on mobile-layout season pages. Seems like the <br class="visible-xs"> spacer from show summary pages is missing here.
GM_addStyle(`
@media (width <= 767px) {
  body.season #episodes {
    margin-top: 35px !important;
  }
}
`);

// FIXED
/////////////////////////////////////////////////////////////////////////////////////////////

// people search results (including header search and both with the standard and experimental search engine) sort order is not great,
// well known people tend to be ranked much lower than other people with the same or a similar name,
// e.g. right now "Will Smith" ranks 15th, after 14 other "Will Smith"s and "Jack Black" ranks 5th after three other "Jack Black"s and a "Black Jack"
// @require      https://cdn.jsdelivr.net/gh/stdlib-js/string-base-distances-levenshtein@v0.2.2-umd/browser.js
// if (isSearchPeoplePage) {
//   ((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
//     const $ = unsafeWindow.jQuery;
//     if (!$) return;

//     const query = $('#filter-query').val().trim().toLowerCase(),
//           $peopleGridItems = $('.frame.people .grid-item[data-type="person"]'),
//           $container = $peopleGridItems.first().parent();
//     if (!query || $peopleGridItems.length < 2) return;

//     const getMatchScore = (name, query) => {
//       if (name === query) return 5;
//       if (name.endsWith(query)) return 4; // search for surname is more likely
//       if (name.startsWith(query)) return 3;
//       if (query.split(' ').filter(Boolean).every((queryPart) => name.includes(queryPart))) return 2;
//       return 1 / window.levenshteinDistance(name, query);
//     }

//     $peopleGridItems.each(function() {
//       const name = $(this).find('meta[itemprop="name"]').attr('content').toLowerCase(),
//             hasImg = $(this).find('.titles').hasClass('has-worded-image');
//       $(this)
//         .prop('matchScore', getMatchScore(name, query))
//         .prop('hasImg', hasImg);
//     }).sort((a, b) => {
//       const hasImgA = $(a).prop('hasImg'),
//             hasImgB = $(b).prop('hasImg');
//       if (hasImgA !== hasImgB) return hasImgB - hasImgA;

//       const scoreA = $(a).prop('matchScore'),
//             scoreB = $(b).prop('matchScore');
//       if (scoreA !== scoreB) return scoreB - scoreA;

//       const idA = +$(a).attr('data-person-id'),
//             idB = +$(b).attr('data-person-id');
//       return idA - idB;
//     });

//     $container.prepend($peopleGridItems);
//   });
// }
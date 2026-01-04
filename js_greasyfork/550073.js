// ==UserScript==
// @name         Trakt.tv | All-in-One Lists View
// @description  Adds a button for appending your lists from the /collaborations, /liked and /liked/official pages on the main "Personal Lists" page for easier access and management of all your lists in one place. Essentially an alternative to the lists category dropdown menu. See README for details.
// @version      1.0.8
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
// @downloadURL https://update.greasyfork.org/scripts/550073/Trakttv%20%7C%20All-in-One%20Lists%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/550073/Trakttv%20%7C%20All-in-One%20Lists%20View.meta.js
// ==/UserScript==

/* README
### General
- Sorting, filtering and list actions (unlike, delete etc.) should work as usual. Also works on /lists pages of other users.
- The [Trakt.tv | Bug Fixes and Optimizations](brzmp0a9.md) userscript contains an improved/fixed `renderReadmore()` function (for "Read more/less..." buttons of long list descriptions),
    which greatly speeds up the rendering of the appended lists.
*/


'use strict';

addStyles();

document.addEventListener('turbo:load', () => {
  if (!/^\/users\/[^\/]+\/lists$/.test(location.pathname)) return;

  const $ = unsafeWindow.jQuery;
  if (!$) return;


  const $sortableGrid = $('#sortable-grid'),
        $spacer = $sortableGrid.children().length ? $(`<hr id="all-in-one-lists-view-spacer">`).insertAfter($sortableGrid) : undefined,
        $btn = $(`<button id="all-in-one-lists-view-btn" type="button">All-in-One Lists View</button>`).insertAfter($spacer ?? $sortableGrid);

  $btn.on('click', async () => {
    $btn.text('Loading...').prop('disabled', true);

    const fetchListElems = async (pathSuffix) => fetch(location.pathname + pathSuffix).then((r) => r.text())
                                                   .then((r) => $(new DOMParser().parseFromString(r, 'text/html')).find('.personal-list'));
    let $fetchedLists = $((await Promise.all(['/collaborations', '/liked', '/liked/official'].map(fetchListElems))).flatMap(($listElems) => $listElems.get()));

    const $personalLists = $('.personal-list'),
          personalListsIds = $personalLists.map((_i, e) => $(e).attr('data-list-id')).get();
    $fetchedLists = $fetchedLists.filter((_i, e) => !personalListsIds.includes($(e).attr('data-list-id'))); // duplicate removal because a user can like his own personal lists

    if (!$fetchedLists.length) {
      $btn.text('No other lists found.')
      return;
    }

    const rankOffset = +$personalLists.last().attr('data-rank');
    $fetchedLists.each((i, e) => $(e).attr('data-rank', rankOffset + i + 1));

    $fetchedLists
      .find('.btn-list-progress').click(function() {
        unsafeWindow.showLoading();
        const dataListId = $(this).attr('data-list-id');
        if(dataListId && unsafeWindow.userSettings?.user.vip) unsafeWindow.redirect(unsafeWindow.userURL('progress?list=' + dataListId));
        else unsafeWindow.redirect('/vip/list-progress');
      })
      .end().find('.btn-list-subscribe').click(function() {
        unsafeWindow.showLoading();
        const dataListId = $(this).attr('data-list-id');
        if(dataListId && unsafeWindow.userSettings?.user.vip) {
          $.post(`/lists/${dataListId}/subscribe`, function(response) {
            unsafeWindow.redirect(response.url);
          }).fail(function() {
            unsafeWindow.hideLoading();
            unsafeWindow.toastr.error('Doh! We ran into some sort of error.');
          });
        }
        else unsafeWindow.redirect('/vip/calendars');
      })
      .end().find('.collaborations-deny').on('ajax:success', function(_e, response) {
        $('#collaborations-deny-' + response.id).children().addClass('trakt-icon-delete-thick');
        $('#collaborations-approve-' + response.id).addClass('off');
        $('#collaborations-block-' + response.id).addClass('off');
      });

    const $btnListEditLists = $('#btn-list-edit-lists');
    if ($btnListEditLists.hasClass('active')) $btnListEditLists.trigger('click');
    $btnListEditLists.hide();

    $sortableGrid.append($fetchedLists);
    $spacer?.remove();
    $btn.remove();

    unsafeWindow.genericTooltips();
    unsafeWindow.vipTooltips();
    unsafeWindow.shareIcons();
    unsafeWindow.convertEmojis();
    unsafeWindow.userscriptAddLinksToListPreviewPosters?.();
    unsafeWindow.addOverlays();
    unsafeWindow.$grid?.isotope('insert', $fetchedLists); // isotope instance is only initialized after first filtering/sorting action
    unsafeWindow.updateListsCount();
    unsafeWindow.lazyLoadImages();
    unsafeWindow.renderReadmore();
  });
}, { capture: true });


function addStyles() {
  GM_addStyle(`
#all-in-one-lists-view-btn {
  margin: 20px auto 0;
  padding: 8px 16px;
  border-radius: var(--btn-radius);
  border: 1px solid hsl(0deg 0% 20% / 65%);
  background-color: #fff;
  color: #333;
  font-size: 18px;
  font-weight: var(--headings-font-weight);
  font-family: var(--headings-font-family);
  transition: all 0.2s;
}
#all-in-one-lists-view-btn:hover {
  color: var(--brand-primary);
}
#all-in-one-lists-view-btn:active {
  background-color: #ccc;
}
body.dark-knight #all-in-one-lists-view-btn {
  border: none;
  background-color: #333;
  color: #fff;
}
body.dark-knight #all-in-one-lists-view-btn:hover {
  background-color: var(--brand-primary);
}
body.dark-knight #all-in-one-lists-view-btn:active {
  background-color: #666;
}

@media (min-width: 768px) {
  body:has(> .bottom[id*="content-page"]) #all-in-one-lists-view-btn {
    margin-bottom: -20px;
  }
}

:is(#all-in-one-lists-view-btn, #all-in-one-lists-view-spacer) {
  display: block !important;
}
body:has(#btn-list-edit-lists.active) :is(#all-in-one-lists-view-btn, #all-in-one-lists-view-spacer) {
  display: none !important;
}
  `);
}
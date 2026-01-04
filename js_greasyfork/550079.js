// ==UserScript==
// @name         Trakt.tv | Partial VIP Unlock
// @description  Unlocks some vip features: adding titles to maxed-out lists, advanced filters, "more" buttons on dashboard, faster page navigation, bulk list management, rewatching, custom calendars, advanced list progress and more. Also hides some vip advertisements. See README for details.
// @version      2.0.1
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
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/550079/Trakttv%20%7C%20Partial%20VIP%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/550079/Trakttv%20%7C%20Partial%20VIP%20Unlock.meta.js
// ==/UserScript==

/* README
### Full Unlock
- "more" buttons on dashboard
- ~2x faster page navigation with Hotwire's Turbo (Allows for partial page updates instead of full page reloads when navigating, might break userscripts from other devs who didn't account for this.
    Also imo it's nothing short of embarassing for them to think it's good idea to intentionally slow down their website for free users. There's a reason they don't have it listed amongst the vip perks..)
- bulk list actions: reset ranks, copy, move, delete (Item selection is filter based, so if you're filtering a list by genre then the bulk list actions will only apply to titles with that genre.
    In fact although the native gui only allows for filtering by type, genre and terms, most other filters from the regular advanced filters work as well, just directly modify the search params in the url.)
- rewatching
- vip badge (Appends a special "Director" badge to your username. It's usually reserved for team members like Trakt's co-founders Sean and Justin. See https://trakt.tv/users/sean for how it looks.)
- all vip settings from the `/settings` page: calendar autoscroll, limit dashboard "up next" episodes to watch-now favorites, only show watch-now icon if title is available on favorites, rewatching settings
- filter-by-terms
- watch-now modal country selection

### Partial Unlock
- adding an item to maxed-out lists (See the "List Limits Bypass" section down below, it's kind of like the second example, just automated. So if you've got a list with >= 100 items,
    you can now directly add a new item to it using the regular ui elems. How long that takes depends on the size of that list, if it's 1000 items you're looking at about 45s until completion..
    Hefty, but it works. Mind you that this is very much experimental and I can only emphasize the importance of backups here.)
- advanced filters (no saved filters, though you can always just save the url of a search with its specific parameters as a bookmark.. works all them same)
- custom calendars (get generated and work, but are not listed in sidebar and can't be deleted, so you have to save the url of the custom calendar or "regenerate" it on the `/lists` page)
- advanced list progress (From my understanding the idea is to filter your `/progress/watched` and `/progress/dropped` pages by the shows on a specific list. As this script also unlocks
    the filter-by-terms function which on the `/progress` pages happens to have regex support, it's possible to just OR all titles of watched shows on a list to get the same result.
    Drawbacks of this are that you can't use filter-by-terms anymore, active filters are turned off in the process (e.g. hide completed), and that shows with the same name can lead to incorrect results.)
- ~~ical/rss feeds + csv exports~~ => [How anyone can create data exports of arbitrary private user accounts](https://github.com/trakt/trakt-api/issues/636)<br>
    (Makes their [privacy policy](https://trakt.tv/privacy) and "You're not the product. We never sell your data." mantra read like a bad joke, nevermind the fact that they failed to make any sort of public
    announcement about this, didn't notify the affected users and didn't produce an incident report, so god knowns on what scale this was exploited. And all I got in return was getting ghosted. Twice.)

### Related Userscripts
Of the ~14 Trakt.tv userscripts I've got, there are another three which (in part) replicate a vip feature in some way:
- [Trakt.tv \| Custom Profile Image](2dz6ub1t.md)
- [Trakt.tv \| Enhanced Title Metadata](fyk2l3vj.md)
- [Trakt.tv \| Scheduled E-Mail Data Exports](2hc6zfyy.md)

Though you can always just install the [Trakt.tv \| Megascript](zzzzzzzz.md) instead.

### List Limits Bypass
Credit for this one goes to [SET19724](https://github.com/SET19724) who pointed out some inconsistencies with the unlocked bulk list actions in an issue.
Turns out with those it's possible to bypass the imposed limits for both the number of lists and items per list:

***Example 1:***<br>
You've got your number of lists maxed out (2 by default). If you now want another list you can just go to any existing list (doesn't have to be your own) with 1-100 items,
then use the "copy to new list" option and it creates a new list for you, which you can then edit and use however you want. Rinse and repeat. It works at least all the way up to 15 lists,
I didn't push it any further. The "copied from..." text is not added if you use one of your own lists as source.<br>
***=> "new list" target option of bulk list actions doesn't enforce max. list limit; source needs to have 1-100 items***

***Example 2:***<br>
Ever since they introduced the 100 items per list limit (watchlist included) I've been adding new titles to overflow lists (`watchlist2`, `watchlist3` etc).
Let's say `watchlist` + `watchlist2` have 99 items each and `watchlist3` has 100 items. I can now do a bulk move from `watchlist3` to `watchlist2`,
followed by a bulk move from `watchlist2` to `watchlist`, to accumulate all 298 items on that list. Ranks are preserved this way as the new items always get appeded.
You can grow lists to arbitrary(ish, at ~4100 items I get 400 responses) sizes by sequentially merging them with target lists that have <= 99 items.<br>
***=> copy/move bulk list actions don't enforce max. item limit on target list; target needs to already exist and have <= 99 items***

Please don't draw any attention to this. I'd also suggest you make use of the [Trakt.tv \| Scheduled E-Mail Data Exports](2hc6zfyy.md) userscript, just in case.

### Semi-Private Notes in Comments
Trakt supports markdown syntax in comments, including reference-style links which you can misuse as a semi-private notes container like `[//]: # (hidden text goes here)`.
The raw markdown is of course still accessible to anyone through the Trakt api and the `/comments/<comment-id>.json` endpoint (you yourself can also see the raw version when editing),
but the content is not rendered in the classic and new web versions, in fact a comment can appear to be completely empty this way. I found this interesting because it's a relatively elegant way to
work around the max. limit for private notes (currently 100), as the note-comments are still stored directly on your Trakt account on a per-title basis and can easily be accessed on arbitrary
platforms, including ones that don't support userscripts. It's probably advisable to disguise the note-comments by always adding some generic one-liner.

### Filter-By-Terms Regex
The filter-by-terms (also called "Filter by Title") function works either server or client-side, depending on whether the exact place you're using it from is paginated or not.
The `/users/<userslug>/lists`, `/seasons` and `/people` pages are all not paginated, so there the filtering is done client-side, with the input being interpreted as a case-insensitive regular expression.
All other places where the filter-by-terms function is available are paginated and therefore use server-side filtering, those usually don't allow for regular expressions, with the exception of
the `/progress` page and list pages. The input is matched against:
- list title and description for `/users/<userslug>/lists` pages
- episode title for `/seasons` pages
- title and character name for `/people` pages
- episode and show title for `/progress` pages
- title name for list pages
*/


'use strict';

let $, compressedCache, Cookies, toastr;
const userslug = document.cookie.match(/(?:^|; )trakt_userslug=([^;]*)/)?.[1],
      token = null; // atob(GM_info.script.icon.split(',')[1]).match(/<!-- (.*?) -->/)[1];

const gmStorage = { ...(GM_getValue('vipUnlock')) };
GM_setValue('vipUnlock', gmStorage);

const logger = {
  _defaults: {
    title: GM_info.script.name.replace('Trakt.tv', 'Userscript'),
    toast: true,
    toastrOpt: { positionClass: 'toast-top-right', timeOut: 10000, progressBar: true },
    toastrStyles: '#toast-container#toast-container a { color: #fff !important; border-bottom: dotted 1px #fff; }',
  },
  _print(fnConsole, fnToastr, msg = '', opt = {}) {
    const { title = this._defaults.title, toast = this._defaults.toast, toastrOpt, toastrStyles = '', consoleStyles = '', data } = opt,
          fullToastrMsg = `${msg}${data !== undefined ? ' See console for details.' : ''}<style>${this._defaults.toastrStyles + toastrStyles}</style>`;
    console[fnConsole](`%c${title}: ${msg}`, consoleStyles, ...(data !== undefined ? [data] : []));
    if (toast) toastr[fnToastr](fullToastrMsg, title, { ...this._defaults.toastrOpt, ...toastrOpt });
  },
  info(msg, opt) { this._print('info', 'info', msg, opt) },
  success(msg, opt) { this._print('info', 'success', msg, { consoleStyles: 'color:#00c853;', ...opt }) },
  warning(msg, opt) { this._print('warn', 'warning', msg, opt) },
  error(msg, opt) { this._print('error', 'error', msg, opt) },
};


addStyles();

document.addEventListener('turbo:load', async () => {
  $ ??= unsafeWindow.jQuery;
  compressedCache ??= unsafeWindow.compressedCache;
  Cookies ??= unsafeWindow.Cookies;
  toastr ??= unsafeWindow.toastr;
  if (!$ || !compressedCache || !Cookies || !toastr) return;


  $('body').removeAttr('data-turbo');
  unsafeWindow.actionList = addToListPopupOverride;
  document.querySelectorAll('.quick-icons .list, .btn-summary.btn-list, .btn-summary.btn-list .side-btn .icon-add').forEach((el) => el.addEventListener('click', addToListBtnOverride));

  patchUserSettings();
  if (token) $('body:not(.dashboard) .feed-icon.csv').attr('href', location.pathname + '.csv?slurm=' + token + location.search.replace('?', '&'));

  $(document).off('ajaxSuccess.userscript38793').on('ajaxSuccess.userscript38793', (_evt, _xhr, opt) => {
    if (opt.url.endsWith('/settings.json')) patchUserSettings();

    if (token && /\/dashboard\/(on_deck|recently_watched)$/.test(opt.url)) {
      $('.feed-icon.csv[href="/vip/csv"]').attr('href', function() {
        return $(this).prev().attr('data-path') + '.csv?' + ['slurm=' + token, $(this).prev().attr('data-query')].join('&');
      });
    }
  });


  $('.frame-wrapper .sidenav.advanced-filters .buttons')
    .addClass('vip')
    .find('.btn.vip')
    .text('').removeClass('vip').removeAttr('href')
    .addClass('disabled disabled-init').attr('id', 'filter-apply').attr('data-apply-text', 'Apply Filters')
    .before('<a class="btn btn-close-2024" id="filter-close" style="display: inline-block !important; visibility: visible !important;">Close</a>')
    .append('<span class="text">Configure Filters</span><span class="icon fa-solid fa-check"></span>');


  if (/^\/users\/[^\/]+\/progress(?!\/playback)/.test(location.pathname) && /list=\d+/.test(location.search) && !location.search.includes('terms=')) {
    unsafeWindow.showLoading?.();
    const searchParams = new URLSearchParams(location.search),
          listId = searchParams.get('list'),
          listDoc = await fetch('/lists/' + listId).then((r) => fetch(r.url + '?display=show&hide=unwatched&limit=10000')).then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')),
          watchedShowsOnListTitles = [...listDoc.querySelectorAll('.grid-item')].map((e) => e.querySelector('.titles-link')?.textContent).filter(Boolean);

    searchParams.append('terms', `^${watchedShowsOnListTitles.join('$|^')}$`);
    ['airing', 'completed', 'ended', 'not-completed', 'rewatching'].forEach((cookieSuffix) => {
      Cookies.remove('filter-hide-progress-' + cookieSuffix, { path: '/' });
      Cookies.remove('filter-hide-progress-' + cookieSuffix, { path: '/users/' + Cookies.get('trakt_userslug') });
    });
    location.search = searchParams.toString();
  }
}, { capture: true });

///////////////////////////////////////////////////////////////////////////////////////////////

function patchUserSettings() {
  const userSettings = compressedCache.get('settings');

  if (userSettings && (!userSettings.user.vip || (token && userSettings.account.token !== token))) {
    userSettings.user.vip = true;
    if (token) userSettings.account.token = token;
    compressedCache.set('settings', userSettings);
    if (unsafeWindow.userSettings) unsafeWindow.userSettings = userSettings;
  }
}

const getTempListId = async () => { // would need a second one for some bulk copy/move actions
  if (!gmStorage.tempList1Id || !compressedCache.get('lists')[gmStorage.tempList1Id]) {
    const favsListId = Object.values(compressedCache.get('lists')).find((l) => l.name === 'Favorites').ids.trakt;
    const resp1 = await fetch(`/lists/${favsListId}/copy_items/0`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': unsafeWindow.csrfToken },
      body: new URLSearchParams({ 'order[]': '', sort_by: 'rank', sort_how: 'asc' }),
    });
    if (!resp1.ok) { logger.error('Failed to create temp list.', { data: resp1 }); return; }
    const tempListId = (await resp1.json()).id;
    logger.info(`Created temp list: id=${tempListId}.`, { data: resp1 });

    const resp2 = await fetch('/lists/' + tempListId, {
      method: 'POST',
      headers: { 'X-CSRF-Token': unsafeWindow.csrfToken },
      body: new URLSearchParams({
        authenticity_token: unsafeWindow.csrfToken,
        _method: 'put',
        name: `temp1_${tempListId}`,
        description: 'Needed for the list limits bypass of the "Partial VIP Unlock" userscript. Keep it empty. You can edit the list title and description if you want. ' +
                     'If you delete it another one will be created on the next attempted list limits bypass.',
        privacy_hidden: 'private',
        privacy: 'private',
        existing_collaborator_ids: '',
        allow_comments_hidden: 1,
        allow_comments: 1,
        display_numbers_hidden: 1,
        display_numbers: 1,
        default_sort_by: 'rank',
        default_sort_how: 'asc',
      }),
    });
    if (!resp2.ok) { logger.error('Failed to update temp list metadata.', { data: resp2 }); return; }
    logger.info('Updated temp list metadata.', { data: resp2 });

    gmStorage.tempList1Id = tempListId;
    GM_setValue('vipUnlock', gmStorage);
  }
  return gmStorage.tempList1Id;
}

async function addToListPopupOverride($gridItem, $li, isRemoval) {
  $li.addClass('spinner').find('.icon').addClass('fa-spin');
  const itemUrl = $gridItem.attr('data-url'),
        itemType = $gridItem.attr('data-type'),
        itemId = +$gridItem.attr(`data-${itemType}-id`),
        targetListId = +$li.attr('data-list-id') || Object.values(compressedCache.get('lists')).find((l) => l.name === 'Watchlist').ids.trakt,
        targetListType = $li.attr('data-list-type'),
        targetListItemCount = +$li.attr('data-item-count');

  try {
    if ($li.hasClass('maxed-out') && !isRemoval) {
      const durationEstimate = (45 / 1000) * targetListItemCount;
      logger.info(`Target list is maxed-out, attempting bypass.. This will take about <strong>${~~(durationEstimate / 60)}m${~~(durationEstimate % 60)}s</strong>.`,
                  { toastrOpt: { timeOut: durationEstimate * 1000 } });

      const tempListId = await getTempListId(),
            cachedLists = compressedCache.get('lists');
      if (cachedLists[tempListId] && cachedLists[tempListId].item_count > 0) { logger.error(`Temp list is not empty. Aborting..`, { data: cachedLists[tempListId] }); return; }
      const resp1 = await fetch(itemUrl + '/list', {
        method: 'POST',
        headers: { 'X-CSRF-Token': unsafeWindow.csrfToken },
        body: new URLSearchParams({ type: itemType, trakt_id: itemId, list_id: tempListId }),
      });
      if (!resp1.ok) { logger.error(`Failed to add item to temp list: id=${tempListId}.`, { data: resp1 }); return; }
      logger.info('Added item to temp list.');

      for (const [list1Id, list2Id] of [[targetListId, tempListId], [tempListId, targetListId]]) {
        const list1AllItemIds = await fetch('/lists/' + list1Id).then((r) => r.text())
          .then((r) => new DOMParser().parseFromString(r, 'text/html').querySelector('#listable-all-item-ids').value.split(',').map(Number));
        if (!list1AllItemIds || !list1AllItemIds.length) { logger.error(`Failed to fetch all list item ids for list: id=${list1Id}.`); return; }

        const resp2 = await fetch(`/lists/${list1Id}/move_items/${list2Id}`, {
          method: 'POST',
          headers: { 'X-CSRF-Token': unsafeWindow.csrfToken },
          body: ((usp) => { list1AllItemIds.forEach((id) => usp.append('order[]', id)); return usp; })(new URLSearchParams({ sort_by: 'rank', sort_how: 'asc' })),
        });
        if (!resp2.ok) { logger.error(`Failed to move all items from ${list1Id === targetListId ? 'target to temp' : 'temp to target'} list.`, { data: resp2 }); return; }
        logger.info(`Moved all items from ${list1Id === targetListId ? 'target to temp' : 'temp to target'} list.`);
      }

      logger.success(`Success. Item was added to <a href="/lists/${targetListId}"><strong>target list</strong></a>.`);
    } else {
      const resp = await fetch(`${itemUrl}/${/(watchlist|favorites|recommendations)/.test(targetListType) ? targetListType : 'list'}${isRemoval ? '/remove' : ''}`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': unsafeWindow.csrfToken },
        body: new URLSearchParams({ type: itemType, trakt_id: itemId, list_id: targetListId }),
      });
      if (!resp.ok) { await resp.json().then((r) => logger.error('Failed to add item to list.' + (r.message ? ' Response: ' + r.message : ''), { data: resp })); return; }
      logger.success('Success. ' + (await resp.json()).message);
    }

    $li.toggleClass('selected');
    return true;
  } finally {
    $li.removeClass('spinner').find('.icon').removeClass('fa-spin');
  }
}

async function addToListBtnOverride(evt) {
  evt.stopImmediatePropagation();
  evt.preventDefault();
  if(unsafeWindow.listPopupPressed) { unsafeWindow.listPopupPressed = false; return; }

  const isSideBtn = $(this).hasClass('side-btn') || $(this).parent().hasClass('side-btn'),
        isSummaryMode = $(this).hasClass('btn-list'),
        $gridItem = isSideBtn ? $(this).closest('.btn-summary') : isSummaryMode ? $(this) : $(this).closest('.grid-item'),
        itemUrl = $gridItem.attr('data-url'),
        itemType = $gridItem.attr('data-type'),
        itemId = +$gridItem.attr(`data-${itemType}-id`),
        hasLists = Object.values(compressedCache.get('lists') ?? {}).some((l) => l.type === 'list'),
        listPopupAction = (unsafeWindow.isPersonPage && isSummaryMode || $gridItem.attr('data-type') === 'person') ? 'list' : unsafeWindow.userSettings.browsing.list_popup_action;

  if(unsafeWindow.isPersonPage && isSummaryMode || hasLists && (listPopupAction !== 'watchlist' || $(this).hasClass('selected')) || isSideBtn) {
    unsafeWindow.actionListPopup(isSideBtn ? $gridItem : $(this));
  } else {
    $gridItem.find('.loading').show();
    const isRemoval = $(this).hasClass('selected'),
          watchListData = Object.values(compressedCache.get('lists')).find((l) => l.name === 'Watchlist'),
          $pseudoLi = $(`<li class="${watchListData.item_count >= unsafeWindow.userSettings.limits.watchlist.item_count ? 'maxed-out' : ''} ${isRemoval ? 'selected' : ''}" ` +
                        `data-list-id="${watchListData.ids.trakt}" data-list-type="watchlist" data-item-count="${watchListData.item_count}"></li>`);

    const wasSuccessful = await addToListPopupOverride($gridItem, $pseudoLi, isRemoval);
    if (wasSuccessful) {
      $(`[data-${itemType}-id="${itemId}"]:is(.btn-summary.btn-list, [data-type="${itemType}"]) .list`)[isRemoval ? 'removeClass' : 'addClass']('selected');
      unsafeWindow.cacheUserData();
    };
    $gridItem.find('.loading').hide();
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////

function addStyles() {
  GM_addStyle(`
#top-nav .btn-vip,
.dropdown-menu.for-sortable > li > a.vip-only,
.alert-vip-required {
  display: none !important;
}

.popover:not(.copy-list) ul.lists li.maxed-out:not(.selected) {
  text-decoration: line-through dashed 2px;
}
  `);

  if (userslug) {
    GM_addStyle(`
:is(#avatar-wrapper h1, .comment-wrapper .user-name) [href="/users/${userslug}"]::after,
#results-top-wrapper [href="/users/${userslug}"] + h1::after {
  content: "DIRECTOR" !important; /* competes with " (@userslug)" suffix from other script */
  font-weight: var(--headings-font-weight);
  font-family: var(--headings-font-family);
  background-color: var(--brand-vip);
  display: inline-block;
  text-shadow: none;
  line-height: 1;
  vertical-align: middle;
  color: #fff;
}
#avatar-wrapper h1 [href="/users/${userslug}"]::after,
#results-top-wrapper [href="/users/${userslug}"] + h1::after {
  margin: 0px 0px 5px 10px;
  padding: 5px 6px 5px 28px;
  font-size: 16px;
  letter-spacing: 1px;
  border-radius: 20px 0px 0px 20px;
  background-image: url("/assets/logos/logomark.circle.white-8541834d655f22f06c0e1707bf263e8d5be59657dba152298297dffffb1f0a11.svg");
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 3px center;
}
.comment-wrapper .user-name [href="/users/${userslug}"]::after {
  margin: -3px 0 0 5px;
  padding: 2px 4px;
  font-size: 11px;
  letter-spacing: 0;
  border-radius: 2px;
}
@media (width <= 767px) and (orientation: portrait) {
  #avatar-wrapper h1 [href="/users/${userslug}"]::after,
  #results-top-wrapper [href="/users/${userslug}"] + h1::after {
    margin: 0px 0px 3px 7px;
    padding: 3px 5px 3px 23px;
    font-size: 14px;
    background-size: 14px;
  }
}

.personal-list .comment-wrapper .user-name [href="/users/${userslug}"] {
  white-space: nowrap;
}
    `);
  }
}
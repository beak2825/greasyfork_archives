// ==UserScript==
// @name         Trakt.tv | Nested Header Navigation Menus
// @description  Adds 150+ dropdown menus with a total of 1000+ entries to the header navigation bar for one-click access to just about any page on the entire website. See README for details.
// @version      1.1.0
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
// @downloadURL https://update.greasyfork.org/scripts/550077/Trakttv%20%7C%20Nested%20Header%20Navigation%20Menus.user.js
// @updateURL https://update.greasyfork.org/scripts/550077/Trakttv%20%7C%20Nested%20Header%20Navigation%20Menus.meta.js
// ==/UserScript==

/* README
> Based on sergeyhist's [Trakt.tv Hidden Items](https://github.com/sergeyhist/trakt-scripts/blob/main/Legacy/trakt-hidden.user.js) userscript.

### General
- Amongst the added submenus is one called "Quick Actions" which allows for clearing the search history and re-caching progress and browser data. Usually those options are hidden in the advanced settings menu.
*/


'use strict';

const userslug = document.cookie.match(/(?:^|; )trakt_userslug=([^;]*)/)?.[1];

const menuTemplates = {
  historySorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Watched Date', href: '/added' },
      { text: 'Plays', href: '/plays' },
      { text: 'Time Spent', href: '/time' },
      { text: 'Title', href: '/title' },
      { text: 'Release Date', href: '/released' },
      { text: 'Runtime', href: '/runtime' },
      { text: 'Popularity', href: '/popularity' },
      { text: 'Percentage', href: '/percentage' },
      { text: 'Votes', href: '/votes' },
    ]),
  }),
  progressSorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Watched Date', href: '/added' },
      { text: 'Completion %', href: '/completed' },
      { text: 'Episodes Left', href: '/episodes' },
      { text: 'Time Left', href: '/time' },
      { text: 'Plays', href: '/plays' },
      { text: 'Release Date', href: '/released' },
      { text: 'Premiere Date', href: '/premiered' },
      { text: 'Title', href: '/title' },
      { text: 'Popularity', href: '/popularity' },
      { text: 'Episode Runtime', href: '/runtime' },
      { text: 'Total Runtime', href: '/total-runtime' },
      { text: 'Random', href: '/random' },
    ]),
  }),
  librarySorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Added Date', href: '/added' },
      { text: 'Title', href: '/title' },
      { text: 'Release Date', href: '/released' },
      ...(/\/shows/.test(hrefPrefix) ? [
        { text: 'Episode Count', href: '/episodes' },
      ] : []),
      ...(!/\/episodes/.test(hrefPrefix) ? [
        { text: 'Runtime', href: '/runtime' },
        { text: 'Popularity', href: '/popularity' },
      ] : []),
      { text: 'Percentage', href: '/percentage' },
      { text: 'Votes', href: '/votes' },
    ]),
  }),
  ratingSelection: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'RATING' },
      { text: 'All Ratings', href: '/all', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/all', submenuAnchorIndexes) },
      { text: '10 - Totally Ninja!', href: '/10', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/10', submenuAnchorIndexes) },
      { text: '9 - Superb', href: '/9', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/9', submenuAnchorIndexes) },
      { text: '8 - Great', href: '/8', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/8', submenuAnchorIndexes) },
      { text: '7 - Good', href: '/7', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/7', submenuAnchorIndexes) },
      { text: '6 - Fair', href: '/6', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/6', submenuAnchorIndexes) },
      { text: '5 - Meh', href: '/5', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/5', submenuAnchorIndexes) },
      { text: '4 - Poor', href: '/4', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/4', submenuAnchorIndexes) },
      { text: '3 - Bad', href: '/3', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/3', submenuAnchorIndexes) },
      { text: '2 - Terrible', href: '/2', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/2', submenuAnchorIndexes) },
      { text: '1 - Weak Sauce :(', href: '/1', submenu: menuTemplates.ratingsSorting(hrefPrefix + '/1', submenuAnchorIndexes) },
    ]),
  }),
  ratingsSorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Rated Date', href: '/added' },
      { text: 'Rating', href: '/rating' },
      ...(!/\/ratings\/all/.test(hrefPrefix) ? [
        { text: 'Title', href: '/title' },
        { text: 'Release Date', href: '/released' },
        ...(/\/(movies|shows)/.test(hrefPrefix) ? [
          { text: 'Runtime', href: '/runtime' },
          { text: 'Popularity', href: '/popularity' },
        ] : []),
        { text: 'Percentage', href: '/percentage' },
        { text: 'Votes', href: '/votes' },
      ] : []),
    ]),
  }),
  listsViewSorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      ...(/\/lists\?/.test(hrefPrefix) ? [
        { text: 'Rank', href: 'rank' },
      ] : []),
      ...(/\/liked/.test(hrefPrefix) ? [
        { text: 'Like Date', href: 'liked' },
      ] : []),
      { text: 'Updated Date', href: 'updated' },
      { text: 'Title', href: 'title' },
      { text: 'Likes', href: 'likes' },
      { text: 'Comments', href: 'comments' },
      { text: 'Items', href: 'items' },
      { text: 'Random', href: 'random' },
    ]),
  }),
  listSorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Rank', href: 'rank' },
      { text: 'Added Date', href: 'added' },
      { text: 'Title', href: 'title' },
      { text: 'Release Date', href: 'released' },
      { text: 'Runtime', href: 'runtime' },
      { text: 'Popularity', href: 'popularity' },
      { text: 'Random', href: 'random' },
      {},
      { text: 'Trakt Percentage', href: 'percentage' },
      { text: 'Trakt Votes', href: 'votes' },
      ...(/\/watchlist\?sort=/.test(hrefPrefix) && userslug ? [
        { text: 'Rotten Tomatoes <em>(mdb)</em>', href: `https://mdblist.com/watchlist/${userslug}?sort=rtomatoes&sortorder=asc`, useHrefPrefix: false },
        { text: 'Metacritic <em>(mdb)</em>', href: `https://mdblist.com/watchlist/${userslug}?sort=metacritic&sortorder=asc`, useHrefPrefix: false },
        { text: 'MyAnimeList <em>(mdb)</em>', href: `https://mdblist.com/watchlist/${userslug}?sort=myanimelist&sortorder=asc`, useHrefPrefix: false },
      ] : []),
      {},
      { text: 'My Rating', href: 'my_rating' },
      { text: 'Watched Date', href: 'watched' },
      { text: 'Collected Date', href: 'collected' },
    ]),
  }),
  commentType: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'TYPE' },
      { text: 'All Types', href: '/all', submenu: menuTemplates.commentSorting(hrefPrefix + '/all', submenuAnchorIndexes) },
      { text: 'Movies', href: '/movies', submenu: menuTemplates.commentSorting(hrefPrefix + '/movies', submenuAnchorIndexes) },
      { text: 'Shows', href: '/shows', submenu: menuTemplates.commentSorting(hrefPrefix + '/shows', submenuAnchorIndexes) },
      { text: 'Seasons', href: '/seasons', submenu: menuTemplates.commentSorting(hrefPrefix + '/seasons', submenuAnchorIndexes) },
      { text: 'Episodes', href: '/episodes', submenu: menuTemplates.commentSorting(hrefPrefix + '/episodes', submenuAnchorIndexes) },
      { text: 'Lists', href: '/lists', submenu: menuTemplates.commentSorting(hrefPrefix + '/lists', submenuAnchorIndexes) },
    ]),
  }),
  commentSorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Added Date', href: '/added' },
      { text: 'Reactions <em>(30 Days)</em>', href: '/likes_30' }, // TODO change href once/if they switch to /reactions_30
      { text: 'Reactions <em>(All Time)</em>', href: '/likes' },
      { text: 'Replies <em>(30 Days)</em>', href: '/replies_30' },
      { text: 'Replies <em>(All Time)</em>', href: '/replies' },
      { text: 'Plays', href: '/plays' },
      { text: 'Rating', href: '/rating' },
    ]),
  }),
  hiddenItemsSorting: (hrefPrefix, [anchorIndex = 1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'SORT BY' },
      { text: 'Title', href: '/title' },
      { text: 'Date', href: '/data' },
    ]),
  }),
  showsMoviesCatTimePeriod: (hrefPrefix, [anchorIndex = -1, ...submenuAnchorIndexes] = []) => ({
    hrefPrefix,
    entries: ((arr) => arr.with(anchorIndex, { ...arr.at(anchorIndex), anchor: true }))([
      { text: 'PERIOD' },
      { text: 'Day', href: '/daily' },
      { text: 'Week', href: '/weekly' },
      { text: 'Month', href: '/monthly' },
      ...(!/\/streaming/.test(hrefPrefix) ? [
        { text: 'All Time', href: '/all' },
      ] : []),
    ]),
  }),
};

const menus = {
  '.btn-profile a[href$="/history"]': {
    hrefPrefix: '/users/me/history',
    entries: [
      { text: 'TYPE' },
      { text: 'All Types', href: '/all', anchor: true },
      { text: 'Movies', href: '/movies', submenu: menuTemplates.historySorting('/users/me/history/movies') },
      { text: 'Shows', href: '/shows', submenu: menuTemplates.historySorting('/users/me/history/shows') },
      { text: 'Episodes', href: '/episodes', submenu: menuTemplates.historySorting('/users/me/history/episodes') },
    ],
  },
  '.btn-profile a[href$="/library"]': {
    hrefPrefix: '/users/me/library',
    entries: [
      { text: 'TYPE' },
      { text: 'All Types', href: '/all', anchor: true },
      { text: 'Movies', href: '/movies', submenu: menuTemplates.librarySorting('/users/me/library/movies') },
      { text: 'Shows', href: '/shows', submenu: menuTemplates.librarySorting('/users/me/library/shows') },
      { text: 'Episodes', href: '/episodes', submenu: menuTemplates.librarySorting('/users/me/library/episodes') },
    ],
  },
  '.btn-profile a[href$="/progress"]': {
    hrefPrefix: '/users/me/progress',
    entries: [
      { text: 'SHOWS' },
      { text: 'Watched', href: '/watched', anchor: true, submenu: menuTemplates.progressSorting('/users/me/progress/watched') },
      { text: 'Dropped', href: '/dropped', submenu: menuTemplates.progressSorting('/users/me/progress/dropped') },
      { text: 'Library', href: '/library', submenu: menuTemplates.progressSorting('/users/me/progress/library') },
      ...(unsafeWindow.userscriptPlaybackProgressManager ? [
        {},
        { text: 'PLAYBACK' },
        { text: 'All Types', href: '/playback' },
        { text: 'Movies', href: '/playback/movies' },
        { text: 'Episodes', href: '/playback/episodes' },
      ] : []),
    ],
  },
  '.btn-profile a[href$="/ratings"]': {
    hrefPrefix: '/users/me/ratings',
    entries: [
      { text: 'TYPE' },
      { text: 'All Types', href: '/all', anchor: true, submenu: menuTemplates.ratingSelection('/users/me/ratings/all') },
      { text: 'Movies', href: '/movies', submenu: menuTemplates.ratingSelection('/users/me/ratings/movies', [ , 4]) },
      { text: 'Shows', href: '/shows', submenu: menuTemplates.ratingSelection('/users/me/ratings/shows', [ , 4]) },
      { text: 'Seasons', href: '/seasons', submenu: menuTemplates.ratingSelection('/users/me/ratings/seasons', [ , -1]) },
      { text: 'Episodes', href: '/episodes', submenu: menuTemplates.ratingSelection('/users/me/ratings/episodes', [ , -1]) },
    ],
  },
  '.btn-profile a[href$="/lists"]': {
    hrefPrefix: '/users/me/lists',
    entries: [
      { text: 'Watchlist', href: '/users/me/watchlist', useHrefPrefix: false, submenu: {
        hrefPrefix: '/users/me/watchlist?display=',
        entries: [
          { text: 'TYPE' },
          { text: 'All Types', href: '/users/me/watchlist', useHrefPrefix: false, anchor: true, submenu: menuTemplates.listSorting('/users/me/watchlist?sort=', [3]) },
          { text: 'Movies', href: 'movie', submenu: menuTemplates.listSorting('/users/me/watchlist?display=movie&sort=', [3]) },
          { text: 'Shows', href: 'show', submenu: menuTemplates.listSorting('/users/me/watchlist?display=show&sort=', [3]) },
          { text: 'Seasons', href: 'season', submenu: menuTemplates.listSorting('/users/me/watchlist?display=season&sort=', [3]) },
          { text: 'Episodes', href: 'episode', submenu: menuTemplates.listSorting('/users/me/watchlist?display=episode&sort=', [3]) },
        ],
      }},
      { text: 'Favorites', href: '/users/me/favorites', useHrefPrefix: false, submenu: {
        hrefPrefix: '/users/me/favorites?display=',
        entries: [
          { text: 'TYPE' },
          { text: 'All Types', href: '/users/me/favorites', useHrefPrefix: false, anchor: true, submenu: menuTemplates.listSorting('/users/me/favorites?sort=', [3]) },
          { text: 'Movies', href: 'movie', submenu: menuTemplates.listSorting('/users/me/favorites?display=movie&sort=', [3]) },
          { text: 'Shows', href: 'show', submenu: menuTemplates.listSorting('/users/me/favorites?display=show&sort=', [3]) },
        ],
      }},
      {},
      { text: 'YOUR LISTS' },
      { text: 'Personal Lists', href: '', submenu: menuTemplates.listsViewSorting('/users/me/lists?sort=') },
      { text: 'Collaborations', href: '/collaborations', submenu: menuTemplates.listsViewSorting('/users/me/lists/collaborations?sort=') },
      {},
      { text: 'LIKED LISTS' },
      { text: 'Personal Lists', href: '/liked', submenu: menuTemplates.listsViewSorting('/users/me/lists/liked?sort=') },
      { text: 'Official Lists', href: '/liked/official', submenu: menuTemplates.listsViewSorting('/users/me/lists/liked/official?sort=') },
    ],
  },
  '.btn-profile a[href$="/comments"]': {
    hrefPrefix: '/users/me/comments',
    entries: [
      { text: 'YOUR COMMENTS' },
      { text: 'All Comments', href: '/all', anchor: true, submenu: menuTemplates.commentType('/users/me/comments/all') },
      { text: 'Reviews', href: '/reviews', submenu: menuTemplates.commentType('/users/me/comments/reviews') },
      { text: 'Shouts', href: '/shouts', submenu: menuTemplates.commentType('/users/me/comments/shouts') },
      { text: 'Replies', href: '/replies', submenu: menuTemplates.commentType('/users/me/comments/replies') },
      {},
      { text: 'REACTIONS' },
      { text: 'All Comments', href: '/liked/all', submenu: menuTemplates.commentType('/users/me/comments/liked/all', [-1, -1]) },
      { text: 'Reviews', href: '/liked/reviews', submenu: menuTemplates.commentType('/users/me/comments/liked/reviews', [-1, -1]) },
      { text: 'Shouts', href: '/liked/shouts', submenu: menuTemplates.commentType('/users/me/comments/liked/shouts', [-1, -1]) },
      { text: 'Replies', href: '/liked/replies', submenu: menuTemplates.commentType('/users/me/comments/liked/replies', [-1, -1]) },
    ],
  },
  '.btn-profile a[href$="/notes"]': {
    hrefPrefix: '/users/me/notes',
    entries: [
      { text: 'All Types', href: '/all' },
      {},
      { text: 'MEDIA ITEMS' },
      { text: 'Movies', href: '/movies' },
      { text: 'Shows', href: '/shows' },
      { text: 'Seasons', href: '/seasons' },
      { text: 'Episodes', href: '/episodes' },
      { text: 'People', href: '/people' },
      {},
      { text: 'YOUR ACTIVITIES' },
      { text: 'History', href: '/history' },
      { text: 'Library', href: '/collection' }, // TODO switch to /library once /users/me/notes/library works
      { text: 'Ratings', href: '/ratings' },
    ],
  },
  '.btn-profile a[href$="/network"]': {
    hrefPrefix: '/users/me/network',
    entries: [
      { text: 'Following', href: '/following/added' },
      { text: 'Following <em>(Pending)</em>', href: '/following_pending/added' },
      { text: 'Followers', href: '/followers/added' },
    ],
  },
  '.btn-profile a[href="/widgets"]': {
    hrefPrefix: '/widgets',
    entries: [
      { text: 'Watched', href: '/watched' },
      { text: 'Library', href: '/library' },
      { text: 'Profile', href: '/profile' },
    ],
  },
  '.btn-profile a:contains("Quick Actions")': {
    entries: [
      { text: '<span class="toggle-dark-mode">Toggle Dark Mode<span class="right fa-solid fa-moon"></span></span>', onclick: 'toggleDarkMode(); return false;' },
      { text: 'Clear Search History', onclick: 'showLoading(); $.post(`/users/me/clear_search_history`).done(() => { toastr.success(`Your search history was cleared.`); cacheUserData(true); }).always(hideLoading); return false;' },
      { text: 'Re-cache Progress Data', onclick: 'showLoading(); $.post(`/users/me/reset_progress_cache`).done(() => { toastr.success(`Your progress cache will be updated in a few minutes.`); }).always(hideLoading); return false;' },
      { text: 'Re-cache Browser Data', onclick: 'window.reopenOverlays = [null]; window.afterLoadingBottomMessage = `Your browser data is reset!`; showLoading(`Please wait for the caching to fully complete.`); resetUserData(); return false;' },
    ],
  },
  '.btn-profile a[href="/settings"]': {
    hrefPrefix: '/settings',
    entries: [
      { text: 'Advanced', href: '/advanced' },
      { text: 'Your API Apps', href: '/oauth/applications', useHrefPrefix: false, submenu: {
        entries: [
          { text: '<span class="hidden-xs left fa fa-book"></span>API Docs', href: '/b/api-docs' },
          { text: '<span class="hidden-xs left fa fa-github"></span>Developer Forum', href: '/b/dev-forum' },
          { text: '<span class="hidden-xs left fa trakt-icon-trakt"></span>Branding', href: '/branding' },
          { text: '<span class="hidden-xs left fa fa-plus-circle"></span>New Application', href: '/oauth/applications/new' },
        ],
      }},
      { text: 'Connected Apps', href: '/oauth/authorized_applications', useHrefPrefix: false, submenu: {
        entries: [
          { text: 'Activate Device', href: '/activate' },
        ],
      }},
      { text: 'Reports', href: '/reports', submenu: {
        hrefPrefix: '/reports',
        entries: [
          { text: 'STATUS' },
          { text: 'All Reports', href: '/all', anchor: true },
          { text: 'Approved', href: '/approved' },
          { text: 'Paused', href: '/paused' },
          { text: 'Rejected', href: '/rejected' },
          { text: 'Pending', href: '/pending' },
        ],
      }},
      { text: 'Hidden Items', href: '/hidden', submenu: {
        hrefPrefix: '/settings/hidden',
        entries: [
          { text: 'Dropped Shows', href: '/dropped', submenu: menuTemplates.hiddenItemsSorting('/settings/hidden/dropped') },
          {},
          { text: 'Progress', href: '/watched', submenu: menuTemplates.hiddenItemsSorting('/settings/hidden/watched') },
          { text: 'Library', href: '/collected', submenu: menuTemplates.hiddenItemsSorting('/settings/hidden/collected') }, // TODO switch to library once /settings/hidden/library works
          { text: 'Calendar', href: '/calendars', submenu: menuTemplates.hiddenItemsSorting('/settings/hidden/calendars') },
          {},
          { text: 'Rewatching', href: '/rewatching', submenu: menuTemplates.hiddenItemsSorting('/settings/hidden/rewatching') },
          { text: 'Blocked Users', href: '/comments', submenu: menuTemplates.hiddenItemsSorting('/settings/hidden/comments') },
        ],
      }},
      { text: 'Plex Sync', href: '/plex' },
      { text: 'Streaming Sync', href: '/scrobblers' },
      { text: 'Notifications', href: '/notifications' },
      { text: 'Sharing', href: '/sharing' },
      { text: 'Data', href: '/data' },
      { text: 'General', href: '', anchor: true, submenu: {
        hrefPrefix: '/settings',
        entries: [
          { text: 'Change Password', href: '#password' },
          { text: 'Appearance', href: '#appearance' },
          { text: 'Search', href: '#search' },
          { text: 'Progress', href: '#progress' },
          { text: 'Profile', href: '#profile' },
          { text: 'Year in Review', href: '#yir' },
          { text: 'Calendars', href: '#calendars' },
          { text: 'Dashboard', href: '#dashboard' },
          { text: 'Spoilers', href: '#spoilers' },
          { text: 'Watch Now', href: '#watchnow' },
          { text: 'Rewatching', href: '#rewatching' },
          { text: 'Global', href: '#global' },
          { text: 'Date & Time', href: '#datetime' },
          { text: 'Account', href: '#account', anchor: true },
        ],
      }},
    ],
  },
  ':is(.btn-mobile-links, .links-wrapper) a[href^="/shows"]': {
    hrefPrefix: '/shows',
    entries: [
      { text: 'Trending', href: '/trending' },
      { text: 'Recommendations', href: '/recommendations' },
      { text: 'Streaming Charts', href: '/streaming', submenu: menuTemplates.showsMoviesCatTimePeriod('/shows/streaming', [1]) },
      { text: 'Anticipated', href: '/anticipated' },
      { text: 'Popular', href: '/popular' },
      { text: 'Favorited', href: '/favorited', submenu: menuTemplates.showsMoviesCatTimePeriod('/shows/favorited') },
      { text: 'Watched', href: '/watched', submenu: menuTemplates.showsMoviesCatTimePeriod('/shows/watched') },
      { text: 'Libraries', href: '/library', submenu: menuTemplates.showsMoviesCatTimePeriod('/shows/library') },
    ],
  },
  ':is(.btn-mobile-links, .links-wrapper) a[href^="/movies"]': {
    hrefPrefix: '/movies',
    entries: [
      { text: 'Trending', href: '/trending' },
      { text: 'Recommendations', href: '/recommendations' },
      { text: 'Streaming Charts', href: '/streaming', submenu: menuTemplates.showsMoviesCatTimePeriod('/movies/streaming', [1]) },
      { text: 'Anticipated', href: '/anticipated' },
      { text: 'Popular', href: '/popular' },
      { text: 'Favorited', href: '/favorited', submenu: menuTemplates.showsMoviesCatTimePeriod('/movies/favorited') },
      { text: 'Watched', href: '/watched', submenu: menuTemplates.showsMoviesCatTimePeriod('/movies/watched') },
      { text: 'Libraries', href: '/library', submenu: menuTemplates.showsMoviesCatTimePeriod('/movies/library') },
      { text: 'Box Office', href: '/boxoffice' },
    ],
  },
  ':is(.btn-mobile-links, .links-wrapper) a[href="/calendars"]': {
    hrefPrefix: '/calendars',
    entries: [
      { text: 'Personal', href: '/my/shows-movies', submenu: {
        hrefPrefix: '/calendars/my',
        entries: [
          { text: 'Shows & Movies', href: '/shows-movies' },
          { text: 'Shows', href: '/shows' },
          { text: 'Premieres', href: '/premieres' },
          { text: 'New Shows', href: '/new-shows' },
          { text: 'Finales', href: '/finales' },
          { text: 'Movies', href: '/movies' },
          { text: 'Streaming', href: '/streaming' },
          { text: 'DVD & Blu-ray', href: '/dvd' },
        ],
      }},
      { text: 'General', href: '/shows', submenu: {
        hrefPrefix: '/calendars',
        entries: [
          { text: 'Shows', href: '/shows' },
          { text: 'Premieres', href: '/premieres' },
          { text: 'New Shows', href: '/new-shows' },
          { text: 'Finales', href: '/finales' },
          { text: 'Movies', href: '/movies' },
          { text: 'Streaming', href: '/streaming' },
          { text: 'DVD & Blu-ray', href: '/dvd' },
        ],
      }},
    ],
  },
  ':is(.btn-mobile-links, .links-wrapper) a[href="/discover"]': {
    hrefPrefix: '/discover',
    entries: [
      { text: 'Trends', href: '#trends' },
      { text: 'Featured Lists', href: '#lists' },
      { text: 'Summer TV Shows', href: '#featured-shows' },
      { text: 'Comments', href: '#comments' },
    ],
  },
  ':is(.btn-mobile-links, .btn-tablet-links, .links-wrapper) a[href="/apps"]': {
    hrefPrefix: '/apps',
    entries: [
      { text: 'Android <em>(official)</em>', href: "/a/trakt-android", useHrefPrefix: false, anchor: true },
      { text: 'iOS <em>(official)</em>', href: "/a/trakt-ios", useHrefPrefix: false },
      { text: 'Android & iOS <em>(3rd Party)</em>', href: "#community-apps" },
      { text: 'Android TV <em>(official)</em>', href: "/a/trakt-android-tv", useHrefPrefix: false },
      { text: 'tvOS <em>(official)</em>', href: "/a/trakt-tvos", useHrefPrefix: false },
      {},
      { text: 'INTEGRATIONS' },
      { text: 'Media Centers', href: "#watching-wrapper" },
      { text: 'Plex Sync', href: "#plex-scrobblers-wrapper" },
      { text: 'Streaming Sync', href: "#streaming-scrobbler-wrapper" },
    ],
  },
  ':is(.btn-mobile-links, .btn-tablet-links, .links-wrapper) a[href="https://forums.trakt.tv"]': {
    hrefPrefix: 'https://forums.trakt.tv',
    entries: [
      { text: 'Latest', href: '/latest' },
      { text: 'Top', href: '/top', submenu: {
        hrefPrefix: 'https://forums.trakt.tv/top?period=',
        entries: [
          { text: 'PERIOD' },
          { text: 'Day', href: 'daily', anchor: true },
          { text: 'Week', href: 'weekly' },
          { text: 'Month', href: 'monthly' },
          { text: 'Quarter', href: 'quarterly' },
          { text: 'Year', href: 'yearly' },
          { text: 'All Time', href: 'all' },
        ],
      }},
      { text: 'Categories', href: '/categories', submenu: {
        hrefPrefix: 'https://forums.trakt.tv',
        entries: [
          { text: 'Announcements', href: '/c/announcements' },
          { text: 'Discussions', href: '/c/discussions', submenu: {
            hrefPrefix: 'https://forums.trakt.tv/c/discussions',
            entries: [
              { text: 'General', href: '/general' },
              { text: 'TV Shows', href: '/tv-shows' },
              { text: 'Movies', href: '/movies' },
              { text: 'Off Topic', href: '/off-topic' },
            ],
          }},
          { text: 'Trakt', href: '/c/trakt', submenu: {
            hrefPrefix: 'https://forums.trakt.tv/c/trakt',
            entries: [
              { text: 'Product Updates', href: '/product-updates' },
              { text: 'Questions & Help', href: '/questions' },
              { text: 'Feature Requests', href: '/feature-requests' },
              { text: 'Lite', href: '/trakt-lite', anchor: true },
              { text: 'Release Notes', href: '/release-notes' },
              { text: 'VIP Beta Features', href: '/vip-beta-features' },
              { text: 'How To', href: '/how-to' },
            ],
          }},
          { text: '3rd Party', href: '/c/3rd-party', submenu: {
            hrefPrefix: 'https://forums.trakt.tv/c/3rd-party',
            entries: [
              { text: 'Media Centers', href: '/media-centers' },
              { text: 'Mobile Apps', href: '/mobile-apps' },
              { text: 'Other', href: '/other', anchor: true },
            ],
          }},
          { text: 'Support', href: '/c/support', submenu: {
            hrefPrefix: 'https://forums.trakt.tv/c/support',
            entries: [
              { text: 'Tutorials', href: '/tutorials' },
              { text: 'VIP Features', href: '/vip-features' },
              { text: 'Features', href: '/support-features' },
              { text: 'FAQ', href: '/faq', anchor: true },
            ],
          }},
        ],
      }},
      {},
      { text: 'EXTERNAL' },
      { text: '<span class="left fa fa-reddit-alien"></span>r/trakt', href: 'https://reddit.com/r/trakt', useHrefPrefix: false, submenu: {
        hrefPrefix: 'https://reddit.com/r/trakt',
        entries: [
          { text: 'SORT BY' },
          { text: 'Best', href: '/best' },
          { text: 'Hot', href: '/hot' },
          { text: 'New', href: '/new' },
          { text: 'Top', href: '/top', submenu: {
            hrefPrefix: 'https://reddit.com/r/trakt/top?t=',
            entries: [
              { text: 'PERIOD' },
              { text: 'Hour', href: 'hour' },
              { text: 'Day', href: 'day' },
              { text: 'Week', href: 'week', anchor: true },
              { text: 'Month', href: 'month' },
              { text: 'Year', href: 'year' },
              { text: 'All Time', href: 'all' },
            ],
          }},
          { text: 'Rising', href: '/rising', anchor: true },
        ],
      }},
      { text: '<span class="left fa-brands fa-twitter"></span>Twitter', href: 'https://twitter.com/trakt', useHrefPrefix: false },
      { text: '<span class="left fa-brands fa-mastodon"></span>Mastodon', href: 'https://ruby.social/@trakt', useHrefPrefix: false },
    ],
  },
};

///////////////////////////////////////////////////////////////////////////////////////////////

const buildMenuHtml = ({ hrefPrefix, entries }) =>
  entries.reduce((acc, { text, href, useHrefPrefix = true, onclick, submenu }, i) =>
    acc + (
      text !== undefined && (href !== undefined || onclick !== undefined) ?
        `<li${submenu ? ' class="with-ul-menu"' : ''}>` +
          `<a href="${useHrefPrefix && hrefPrefix ? hrefPrefix : ''}${href ?? '#'}"${onclick ? ` onclick="${onclick}"` : ''}>${text}</a>${submenu ? buildMenuHtml(submenu) : ''}` +
        `</li>` :
      text !== undefined ? `<li class="dropdown-header">${text}</li>` :
      '<li class="divider"></li>'
    ), `<ul class="menu" style="top: calc(-10px - ${Math.max(entries.findIndex((e) => e.anchor), 0) * 100}%)">`) + '</ul>';
const menuSelectorsAndHtml = Object.entries(menus).map(([targetSelector, menu]) => [targetSelector, buildMenuHtml(menu)]);


addStyles();

window.addEventListener('turbo:load', () => {
  const $ = unsafeWindow.jQuery;
  if (!$) return;


  const $topNav = $('#top-nav');

  $topNav.find('.links-wrapper > a').wrap('<div class="with-solid-bg"></div>');
  $topNav.find('.links-wrapper a[href="/apps"]')
    .next().remove()
    .end().parent().removeClass('with-top-arrow').addClass('with-solid-bg');
  $topNav.find('.btn-mobile-links li:has(> a[href="/apps"])')
    .next().remove()
    .end().unwrap();
  $topNav.find('li.dark-knight')
    .removeClass('dark-knight').html('<a href="#" onclick="return false;">Quick Actions</a>')
    .before('<li class="divider"></li>').next().remove();
  $topNav.find('.btn-profile li:has(> a.yir-loader)')
    .wrapAll('<li class="with-ul-menu"><ul class="menu" style="top: -10px;"></ul></li>')
    .parent().before('<a href="#" onclick="return false;">Stats</a>')
  $topNav.find('a[href="https://forums.trakt.tv"]').removeAttr('target');

  menuSelectorsAndHtml.forEach(([targetSelector, menuHtml]) => $topNav.find(targetSelector).closest('li, div').addClass('with-ul-menu').append(menuHtml));


  const $withUlMenu = $topNav.find(':is(.user-wrapper, .links-wrapper) .with-ul-menu');

  $withUlMenu.off('click mouseover mouseout').on('touchend', function(evt) { // TODO :hover state gets set on second touchend
    evt.stopPropagation();
    if ($(evt.originalEvent.target).closest($(this).children().first()).length) {
      if (!$(this).hasClass('selected')) {
        evt.preventDefault();
        $withUlMenu.not($(this).parents()).removeClass('selected');
        $(this).addClass('selected');
      } else {
        $(this).removeClass('selected');
      }
    }
  });
  $('body').on('touchend', () => $withUlMenu.removeClass('selected'));
});

///////////////////////////////////////////////////////////////////////////////////////////////

function addStyles() {
  GM_addStyle(`
#top-nav :is(.user-wrapper, .links-wrapper) > .with-ul-menu {
  border-radius: 8px 8px 0 0 !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) > .with-ul-menu > a {
  transition: color .2s !important;
}
#top-nav#top-nav :is(.user-wrapper, .links-wrapper) > .with-ul-menu > a:hover {
  color: var(--brand-primary-300) !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) ul {
  height: max-content;
  width: max-content !important;
  overflow-y: revert !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) > .with-ul-menu > ul {
  top: 100% !important;
  min-width: max(130px, 100%) !important;
}
#top-nav .links-wrapper > .with-ul-menu > ul {
  border-radius: 8px 0 8px 8px !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) ul ul {
  min-width: 100px !important;
  border-radius: 8px !important;
  border-top: revert !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) :is(ul a, .dropdown-header) {
  padding: 6px 16px !important;
  font-size: 14px !important;
  margin: revert !important;
  text-shadow: revert !important;
}
@media (width <= 767px) {
  #top-nav :is(.user-wrapper, .links-wrapper) :is(ul a, .dropdown-header) {
    padding: 6px 12px !important;
  }
}
#top-nav#top-nav :is(.user-wrapper, .links-wrapper) ul a,
#top-nav .user-wrapper :is(.btn-mobile-links, .btn-tablet-links) > .icon {
  color: #fff !important; /* light mode override */
}
#top-nav#top-nav :is(.user-wrapper, .links-wrapper) ul a:hover {
  background-color: rgb(from var(--brand-primary) r g b / 92%) !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) .dropdown-header {
  font-weight: bold;
  text-transform: uppercase;
}
#top-nav :is(.user-wrapper, .links-wrapper) span.left {
  width: 18px;
  margin-right: 8px;
  text-align: center;
}
#top-nav :is(.user-wrapper, .links-wrapper) span.right {
  margin-left: 8px;
}
body.dark-knight #top-nav#top-nav .btn-profile a:has(> span.toggle-dark-mode):not(:hover) {
  color: var(--brand-secondary) !important;
}
#top-nav .user-wrapper .btn > .menu {
  cursor: initial; /* .btns set cursor: pointer; which is inheritable => applies to .dividers */
}


#top-nav :is(.user-wrapper, .links-wrapper) li > a:has(+ ul)::after {
  content: "\\25B6";
  display: inline-block;
  float: right;
  margin-left: 10px;
  transform: scale(0.75) rotate(0deg);
  transition: transform 0.2s;
}
#top-nav :is(.user-wrapper, .links-wrapper) :is(:hover, .selected) > a::after {
  transform: rotate(180deg) scale(1);
}


#top-nav :is(.user-wrapper, .links-wrapper) ul {
  display: none !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) :is(:hover, .selected) > ul {
  display: block !important;
}


#top-nav :is(.user-wrapper, .links-wrapper) ul ul {
  --menu-columns: 5;
  --menu-overlap: min(97%, calc((100vw - 155px * var(--menu-columns)) / var(--menu-columns) + 100%));
  right: var(--menu-overlap) !important;
}
@media (767px < width <= 991px) {
  #top-nav .links-wrapper ul ul {
    --menu-columns: 3;
  }
  #top-nav .links-wrapper ul ul ul ul {
    left: var(--menu-overlap) !important;
    right: revert !important;
  }
  #top-nav .links-wrapper ul ul ul a::after {
    transform: scale(0.75) rotate(180deg);
  }
  #top-nav .links-wrapper ul ul ul :is(:hover, .selected) > a::after {
    transform: rotate(0deg) scale(1);
  }
}
@media (width <= 767px) {
  #top-nav :is(.user-wrapper, .links-wrapper) ul ul {
    --menu-columns: 3;
  }
  #top-nav :is(.user-wrapper, .links-wrapper) ul ul ul ul {
    left: var(--menu-overlap) !important;
    right: revert !important;
  }
  #top-nav :is(.user-wrapper, .links-wrapper) ul ul ul a::after {
    transform: scale(0.75) rotate(180deg);
  }
  #top-nav :is(.user-wrapper, .links-wrapper) ul ul ul :is(:hover, .selected) > a::after {
    transform: rotate(0deg) scale(1);
  }
}


#top-nav :is(.user-wrapper, .links-wrapper) ul,
#top-nav :is(.user-wrapper, .links-wrapper) > .with-ul-menu:is(:hover, .selected) {
  --nesting-depth: 0;
  z-index: var(--nesting-depth);
  background-color: hsl(0deg 0% calc(20% + var(--nesting-depth) * 2.5%) / 92%) !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) .divider {
  background-color: hsl(0deg 0% calc(27% + var(--nesting-depth) * 2.5%)) !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) :is(.dropdown-header, em) {
  color: hsl(0deg 0% calc(57% + var(--nesting-depth) * 2.5%)) !important;
}
#top-nav :is(.user-wrapper, .links-wrapper) ul ul {
  --nesting-depth: 1;
}
#top-nav :is(.user-wrapper, .links-wrapper) ul ul ul {
  --nesting-depth: 2;
}
#top-nav :is(.user-wrapper, .links-wrapper) ul ul ul ul {
  --nesting-depth: 3;
}
#top-nav :is(.user-wrapper, .links-wrapper) ul ul ul ul ul {
  --nesting-depth: 4;
}
  `);
}
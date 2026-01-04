// ==UserScript==
// @name         Trakt.tv | Megascript
// @description  All 13 userscripts from my "Trakt.tv Userscript Collection" repo merged into one for convenience. See README for details.
// @version      2025-12-22_02-32
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @resource     anidap         https://anidap.se/logo.png
// @resource     cineby         https://www.cineby.gd/logo.png
// @resource     dmm            https://raw.githubusercontent.com/debridmediamanager/debrid-media-manager/main/dmm-logo.svg
// @resource     gojolive       https://db.onlinewebfonts.com/t/65e1ae41ad95e8bed2ac45adc765795a.woff2
// @resource     hexa           https://hexa.su/hexa-logo.png
// @resource     knaben         data:image/svg+xml,%3Csvg%20onmouseenter%3D%22this.querySelectorAll('%3Anth-child(-n%2B9)').forEach((c%2Ci)%3D%26gt%3B%7Bc.style.transition%3D'none'%3Bc.style.transform%3D'translate(0%2C-70%25)'%3BsetTimeout(()%3D%26gt%3B%7Bc.style.transition%3D'transform%201s%20cubic-bezier(.5%2C.25%2C.27%2C.1)'%3Bc.style.transform%3D'translate(0%2C0)'%7D%2C50*(i%253%2B~~(i%2F3)))%7D)%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201862%20804%22%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M1470.91%20273.76h280.14v100.1h-280.14z%22%2F%3E%3Cpath%20fill%3D%22%23bababa%22%20d%3D%22M955.67%20273.76h499.85v100.1H955.67z%22%2F%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M653.56%20273.76h285.63v100.1H653.56z%22%2F%3E%3Cpath%20fill%3D%22%23bababa%22%20d%3D%22M1470.91%20160.32h280.14v96.76h-280.14z%22%2F%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M955.67%20160.32h499.85v96.76H955.67z%22%2F%3E%3Cpath%20fill%3D%22%23bababa%22%20d%3D%22M653.56%20160.32h285.63v96.76H653.56z%22%2F%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M1362.54%2040.2h281.94v101.77h-281.94z%22%2F%3E%3Cpath%20fill%3D%22%23bababa%22%20d%3D%22M1062.98%2040.2h281.94v101.77h-281.94z%22%2F%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M763.42%2040.2h281.94v101.77H763.42z%22%2F%3E%3Cpath%20fill%3D%22%23bababa%22%20d%3D%22M74.48%200h413.36v62.95H74.48zm0%2062.95h60.35v72.75H74.48zm136.41%200h37.2v72.75h-37.2zm107.47%200h37.2v72.75h-37.2zm111.61%200h57.87v72.75h-57.87zM74.48%20135.47h413.36v97.93H74.48z%22%2F%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M74.48%20233.16h502.74v140.7H74.48z%22%2F%3E%3Cpath%20fill%3D%22%23bababa%22%20d%3D%22M0%20391.991v.078L106.988%20644.12H1713.04v-2.908L1862%20492.251V391.95H.097Z%22%2F%3E%3Cpath%20fill%3D%22%237a7a7a%22%20d%3D%22M1713.489%20642.07H105.417l67.882%20159.92h1380.269Z%22%2F%3E%3C%2Fsvg%3E
// @resource     kuroiru        https://kuroiru.co/logo/stuff/letter-small.png
// @resource     miruro         https://www.miruro.to/assets/miruro-text-transparent-white-DRs0RmF1.png
// @resource     oracleofbacon  https://oracleofbacon.org/center_list.php
// @resource     pstream        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMC4wMDggMTcuNDA1Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDE4LjY3NDgpIHNjYWxlKDAuMDAzMzMzIC0wLjAwMzMzMykiIGZpbGw9IiM4NTg5ZmYiPjxwYXRoIGQ9Ik0zOTEwIDU1MjcgYy0zMyAtNCAtMTQ1IC0xNyAtMjUwIC0yOCAtNjQ1IC03MyAtOTAwIC0xODcgLTkwMCAtNDA1IGwwIC04OSAxNTQgLTIgYzIwOSAtMiAyMjUgLTE3IDM4MSAtMzU0IDE4NiAtMzk5IDMzNyAtNDkxIDU1NyAtMzQxIDEwMyA3MCAxNzYgNjcgMjUyIC05IDE0MyAtMTQyIC0xNSAtMzQyIC0zMjAgLTQwNCBsLTEyMyAtMjUgMTg1IC0zOTMgYzEwMSAtMjE3IDE4OSAtMzk2IDE5NCAtMzk4IDYgLTMgODcgNiAxODIgMjAgNDk5IDcxIDExNjAgLTI5NiA5NzIgLTU0MSAtNzcgLTEwMSAtMTgzIC0xMDAgLTMwNyAyIC0xODYgMTU0IC00MDcgMjIzIC02MTAgMTg4IC0xMjMgLTIxIC0xMTkgLTkgLTgwIC0yNzQgNDAgLTI3MyAxOCAtNzAxIC00OCAtOTE2IC0yNSAtODIgMjUyIC05OSA0NjMgLTI4IDY1NSAyMjAgMTE0NiA3NDggMTMzMCAxNDMwIDQ0IDE2NSA0NiAyMDEgNTMgMTIwNiBsOCAxMDM1IC02NyA2NiBjLTE4NSAxODMgLTEzNzYgMzM2IC0yMDI2IDI2MHogbTEwNzggLTEyMTkgYzExOCAtODEgMjA0IC04NCAzMTIgLTEwIDIzOSAxNjMgNDUzIC03MyAyNDAgLTI2NSAtMjQxIC0yMTggLTcwMyAtMTc4IC04MzIgNzEgLTkzIDE3OSAxMDUgMzIzIDI4MCAyMDR6Ii8+PHBhdGggZD0iTTI0MTAgNDU5MSBjLTk1MCAtMjAxIC0yNDA0IC0xMDE1IC0yNDA5IC0xMzQ4IC0xIC02OSA3NzEgLTE3MDcgODg1IC0xODc4IDQyMiAtNjMzIDExODUgLTk4NCAxOTI0IC04ODYgMjIxIDI5IDI5MyA2OCA0ODIgMjY0IDU3NSA1OTQgNzI3IDE0NjYgMzkwIDIyMzIgLTIzMSA1MjUgLTc0OSAxNjAwIC03ODUgMTYzMCAtNTcgNDggLTIxNCA0NCAtNDg3IC0xNHogbTU3OSAtMTEyMiBjMTE0IC01NCAxNDUgLTE4OCA2NCAtMjgxIC00OCAtNTYgLTYwIC01OCAtMjY1IC00NyAtMTAyIDYgLTE3NyAtNDIgLTIyOSAtMTQzIC05NSAtMTg3IC0zMzkgLTE0NSAtMzM5IDU3IDAgMjkxIDQ4MiA1NTAgNzY5IDQxNHogbS0xMzE5IC02MzAgYzIxNSAtMTA2IDg1IC0zNTAgLTE3MyAtMzI2IC0xNDQgMTMgLTIwOSAtMjEgLTI3MCAtMTQwIC0xMDIgLTE5NyAtMzgxIC0xMTkgLTMzOSA5NCA1OSAyOTUgNTA2IDUwOCA3ODIgMzcyeiBtMTQ3MiAtNTc3IGMyMTYgLTIxNyAtMjg3IC03ODkgLTc4NiAtODk1IC00NzMgLTEwMCAtOTA5IDEyNyAtNjU0IDM0MSA3MSA2MCA5MyA2MiAyMjYgMjIgMzQ4IC0xMDYgNzM5IDc3IDkwMyA0MjMgODMgMTc3IDIwMSAyMTggMzExIDEwOXoiLz48L2c+PC9zdmc+
// @resource     scenenzbs      https://img.house-of-usenet.com/fd4bd542330506d41778e81860f29435c7f8795a7bbefbd9d297b7d79d5a067b.webp
// @resource     stremio        https://web.stremio.com/images/stremio_symbol.png
// @require      https://cdn.jsdelivr.net/gh/stdlib-js/string-base-distances-levenshtein@v0.2.2-umd/browser.js#sha256-0SIsWI8h2EJjO46eyuxL1XnuGNhycW/o0yxyw/U+jrU=
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.2.0/dist/chartjs-plugin-zoom.min.js
// @require      https://cdn.jsdelivr.net/npm/croner@9.0.0/dist/croner.umd.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @connect      celeb.gate.cc
// @connect      fanart.tv
// @connect      forvo.com
// @connect      kuroiru.co
// @connect      moviemaps.org
// @connect      walter-r2.trakt.tv
// @downloadURL https://update.greasyfork.org/scripts/557305/Trakttv%20%7C%20Megascript.user.js
// @updateURL https://update.greasyfork.org/scripts/557305/Trakttv%20%7C%20Megascript.meta.js
// ==/UserScript==

/* README
### General
- You can disable individual modules by setting the corresponding script-id to `false` in the userscript storage tab *(note: only displayed after first run)*.
- Each enabled module will conflict with the corresponding standalone userscript. Either uninstall the standalone version (suggested) or disable the respective module.
- As VIP user you should disable: `2dz6ub1t`, `fyk2l3vj`, `x70tru7b`, `2hc6zfyy`
- This userscript is automatically generated. YMMV.

| *NAME* | *SCRIPT_ID* |
| :----- | :---------- |
| [Trakt.tv \| Actor Pronunciation Helper](71cd9s61.md#StickyHeader) | `71cd9s61` |
| [Trakt.tv \| All-in-One Lists View](p2o98x5r.md#StickyHeader) | `p2o98x5r` |
| [Trakt.tv \| Average Season And Episode Ratings](yl9xlca7.md#StickyHeader) | `yl9xlca7` |
| [Trakt.tv \| Bug Fixes and Optimizations](brzmp0a9.md#StickyHeader) | `brzmp0a9` |
| [Trakt.tv \| Charts - Ratings Distribution](pmdf6nr9.md#StickyHeader) | `pmdf6nr9` |
| [Trakt.tv \| Charts - Seasons](cs1u5z40.md#StickyHeader) | `cs1u5z40` |
| [Trakt.tv \| Custom Links (Watch-Now + External)](wkt34fcz.md#StickyHeader) | `wkt34fcz` |
| [Trakt.tv \| Custom Profile Image](2dz6ub1t.md#StickyHeader) | `2dz6ub1t` |
| [Trakt.tv \| Enhanced List Preview Posters](kji85iek.md#StickyHeader) | `kji85iek` |
| [Trakt.tv \| Enhanced Title Metadata](fyk2l3vj.md#StickyHeader) | `fyk2l3vj` |
| [Trakt.tv \| Nested Header Navigation Menus](txw82860.md#StickyHeader) | `txw82860` |
| [Trakt.tv \| Partial VIP Unlock](x70tru7b.md#StickyHeader) | `x70tru7b` |
| [Trakt.tv \| Scheduled E-Mail Data Exports](2hc6zfyy.md#StickyHeader) | `2hc6zfyy` |
*/


/* [Trakt.tv | Custom Profile Image]
A custom profile image for free users. Like the vip feature, except this one only works locally. Uses the native set/reset buttons and changes the dashboard + settings background as well.
*/

/* [Trakt.tv | Scheduled E-Mail Data Exports]
Automatic trakt.tv backups for free users. On every trakt.tv visit a background e-mail data export is triggered, if one is overdue based on the specified cron expression (defaults to weekly).

### General
- You might want to consider the use of an e-mail filter, so as to e.g. automatically move the data export e-mails to a dedicated trakt-tv-data-exports folder.
- If you don't like the success toasts, you can turn them off by setting `toastOnSuccess` to `false` in the userscript storage tab *(note: only displayed after first run)*, there you can
    also specify your own [cron expression](https://crontab.guru/examples.html). E-Mail data exports have a cooldown period of 24 hours, there is no point in going below that with your cron expression.
*/

/* [Trakt.tv | Actor Pronunciation Helper]
Adds a button on /people pages for fetching an audio recording of that person's name with the correct pronunciation from https://forvo.com
*/

/* [Trakt.tv | Bug Fixes and Optimizations]
A large collection of bug fixes and optimizations for trakt.tv, organized into ~30 independent sections, each with a comment detailing which specific issues are being addressed. Also contains some minor feature patches.

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

/* [Trakt.tv | Charts - Seasons]
Adds a line chart to /seasons pages which shows the ratings (personal + general) and the number of watchers and comments for each individual episode.

### General
- Clicking on the individual data points takes you to the summary page of the respective episode (or the comment page for comment data points).
- For charts with more than eight episodes, you can also zoom in by highlighting a section of the x-axis with your mouse. You can zoom out again by clicking anywhere inside the chart.
- This script won't work (well) on mobile devices and the chart is no beauty on light mode either. Basically the whole thing needs an overhaul and is not even close to being finished,
    but the core functionality is there and it might be while until I get back to it, which is why I'm putting it out there as it is right now.
*/

/* [Trakt.tv | Enhanced Title Metadata]
Adds links of filtered search results to the metadata section (languages, genres, networks, studios, writers, certification, year) on title summary pages, similar to the vip feature. Also adds a country flag and allows for "combined" searches by clicking on the labels.

> Based on sergeyhist's [Trakt.tv Clickable Info](https://github.com/sergeyhist/trakt-scripts/blob/main/trakt-info.user.js) userscript.

### General
- By clicking on the label for languages, genres, networks, studios and writers, you can make a search for all their respective values combined, ANDed for genres, languages and writers,
    ORed for networks and studios. For example if the genres are "Crime" and "Drama", then a label search will return a selection of other titles that also have the genres "Crime" AND "Drama".
- The writers label search was mostly added as an example of how to search for filmography intersections with trakt's search engine (there's no official tutorial about this,
    just some vague one liner in the api docs about how `+ - && || ! ( ) { } [ ] ^ " ~ * ? : /` have "special meaning" when used in a query).
    It's much more interesting with actors e.g. [Movies with Will Smith and Alan Tudyk](https://trakt.tv/search/movies?query=%22Will%20Smith%22+%22Alan%20Tudyk%22&fields=people).
- The title's certification links to the respective `/parentalguide` imdb page (which contains descriptions of nude scenes, graphic content etc.).
- The title's year links to the search page for other titles from the same year.
- The search results default to either the "movies" or "shows" search category depending on the type of the current title.
- A "+ n more" button is added for networks when needed (some anime have more than a dozen listed).
- Installing the [Trakt.tv | Partial VIP Unlock](x70tru7b.md) userscript will allow free users to further modify the applied advanced filters on the linked search pages.
- This script won't work for vip users.
*/

/* [Trakt.tv | Enhanced List Preview Posters]
Makes the posters of list preview stacks/shelves link to the respective title summary pages instead of the list page and adds corner rating indicators for rated titles.

### General
- The [Trakt.tv | Bug Fixes and Optimizations](brzmp0a9.md) userscript fixes some rating related issues and enables (more) reliable updates of the list-preview-poster rating indicators.
*/

/* [Trakt.tv | All-in-One Lists View]
Adds a button for appending your lists from the /collaborations, /liked and /liked/official pages on the main "Personal Lists" page for easier access and management of all your lists in one place. Essentially an alternative to the lists category dropdown menu.

### General
- Sorting, filtering and list actions (unlike, delete etc.) should work as usual. Also works on /lists pages of other users.
- The [Trakt.tv | Bug Fixes and Optimizations](brzmp0a9.md) userscript contains an improved/fixed `renderReadmore()` function (for "Read more/less..." buttons of long list descriptions),
    which greatly speeds up the rendering of the appended lists.
*/

/* [Trakt.tv | Charts - Ratings Distribution]
Adds a ratings distribution (number of users who rated a title 1/10, 2/10 etc.) chart to title summary pages. Also allows for rating the title by clicking on the bars of the chart.
*/

/* [Trakt.tv | Nested Header Navigation Menus]
Adds 150+ dropdown menus with a total of 1000+ entries to the header navigation bar for one-click access to just about any page on the entire website.

> Based on sergeyhist's [Trakt.tv Hidden Items](https://github.com/sergeyhist/trakt-scripts/blob/main/Legacy/trakt-hidden.user.js) userscript.

### General
- Amongst the added submenus is one called "Quick Actions" which allows for clearing the search history and re-caching progress and browser data. Usually those options are hidden in the advanced settings menu.
*/

/* [Trakt.tv | Custom Links (Watch-Now + External)]
Adds custom links to all the "Watch-Now" and "External" sections (for titles and people). The ~35 defaults include Letterboxd, Stremio, streaming sites (e.g. P-Stream, Hexa), torrent aggregators (e.g. EXT, Knaben), various anime sites (both for streaming and tracking) and much more. Easily customizable.

> Based on Tusky's [Trakt Watchlist Downloader](https://greasyfork.org/scripts/17991) with some sites/features/ideas borrowed from Accus1958's
> [trakt.tv Streaming Services Integration](https://greasyfork.org/scripts/486706), JourneyOver's [External links on Trakt](https://greasyfork.org/en/scripts/547223),
> sergeyhist's [Watch Now Alternative](https://github.com/sergeyhist/trakt-watch-now-alternative) and Tanase Gabriel's [Trakt.tv Universal Search](https://greasyfork.org/en/scripts/508020) userscripts.

### General
- `maxSidebarWnLinks` controls how many watch-now links are visible in the watch-now preview of the sidebar. The default is `4` and can be modfied
    in the userscript storage tab *(note: only displayed after first run)*. There you can also modify `torrentResolution` which defaults to `1080p` and
    is used for the query of the torrent and usenet links. Additionally `includeNsfwLinks` controls the visibility of the NSFW links and defaults to `false`.
    For modifications beyond that you'll have to mess with the actual config arrays, which will disable automatic updates of the userscript. *(note: If I ever find the time I'll implement
    a proper gui-based way to toggle, reorder and configure the links. I haven't done so yet, because it adds a decent amount of complexity while providing no real benefit to me personally.)*
- Nearly all links are direct links to e.g. individual episodes, as opposed to search links, anime included.
- There's a "fix" for anime which default to the "wrong" episode group (aka. "alternate seasons"). For example "Solo Leveling" is listed with its second season being part of the first,
    and the episodes for "Cowboy Bebop" are all out of order, which would otherwise mess up direct linking to streaming sites. Trakt uses whichever grouping is used by TMDB and they have some,
    to put it nicely, "questionable" and very much rigid rules regarding e.g. what exactly constitutes a season, the "Attack on Titan" finale being part of the specials is a prime example..
- Some urls are constructed dynamically on click. That means there might be a small delay before the page opens. The resolved url is then also set as href, so on a second click
    the element behaves just like a regular link. A dynamic link is also resolved on right click, so you can e.g. do a double right click with a small delay in between
    to use the "open in incognito window" option like you can with a regular link.
- Some links are configured to only be added if certain conditions are met, e.g. anime links are only added for titles where "anime" is included in the genres.
- I only included anime streaming sites which used some sort of known external id (e.g. mal, anilist) and an episode number for their episode urls, to allow for direct linking.
    One of these is "Kuroiru", an anime aggregator which contains more direct episode links to other popular anime streaming sites like HiAnime or AnimeKai.
- Usually watch-now buttons of grid-items are only displayed if the title has been released and is available for streaming in your selected watch-now country.
    This script changes that by unhiding all watch-now buttons and color coding them as to the title's digital release status. White means the title is available for streaming
    in your selected watch-now country, light-grey means the title is available for streaming in another country and dark-grey means that the title is not available for streaming anywhere.
- A scrollable plot summary is added to the watch-now modal. The watch-now modal and the sidebar are also made scrollable.
- The mobile-layout sidebar from the screenshots is part of the [Trakt.tv | Bug Fixes and Optimizations](brzmp0a9.md) userscript.

### Default Custom Links
#### Watch-Now
- [EXT](https://ext.to) [Torrent Aggregator]
- [Stremio](https://www.stremio.com) [Debrid]
- [Kuroiru](https://kuroiru.co) [Anime Aggregator]
- [GOJO.LIVE](https://animetsu.cc) [Anime Streaming]
- [AniDap](https://anidap.se) [Anime Streaming]
- [Miruro](https://www.miruro.to) [Anime Streaming]
- [Knaben Database](https://knaben.org) [Torrent Aggregator]
- [P-Stream](https://pstream.mov) [Streaming]
- [Cineby](https://www.cineby.gd) [Streaming]
- [Hexa](https://hexa.su) [Streaming]
- [FMOVIES+](https://www.fmovies.gd) [Streaming]
- [SceneNZBs](https://scenenzbs.com) [Usenet Indexer]
- [Debrid Media Manager](https://debridmediamanager.com) [Debrid]

#### External
- [Reddit](https://www.reddit.com) (discussions)
- [Letterboxd](https://letterboxd.com) (popular movie tracking site; lots of users, lists and reviews)
- [ReverseTV](https://reversetv.enzon19.com) ("Where have I seen each cast member before?")
- [MovieMaps](https://moviemaps.org) (interactive map of filming locations)
- [Fandom](https://www.fandom.com) (fan-made encyclopedias)
- [AZNude](https://www.aznude.com) (NSFW; for titles and people)
- [CelebGate](https://celeb.gate.cc) (NSFW; people only)
- [Rule 34](https://rule34.xxx) (NSFW; titles only)
- [MyAnimeList](https://myanimelist.net) (anime tracking site)
- [AniList](https://anilist.co) (anime tracking site)
- [AniDB](https://anidb.net) (anime tracking site)
- [LiveChart](https://www.livechart.me) (anime tracking site)
- [TheTVDB](https://thetvdb.com) (similar to TMDB and IMDb)
- [TVmaze](https://www.tvmaze.com) (tv show tracking site)
- [YouTube Trailer](https://www.youtube.com) (season trailers are preferred)
- [YouTube Interviews](https://www.youtube.com) (e.g. actors in talkshows)
- [Rotten Tomatoes](https://www.rottentomatoes.com) (ratings/reviews from professional critics)
- [Metacritic](https://www.metacritic.com) (ratings/reviews from professional critics)
- [Spotify](https://open.spotify.com) (soundtracks)
- [MediUX](https://mediux.pro) (similar to fanart.tv)
- [YouGlish](https://youglish.com) ("How do I pronounce this actors's name?")
- [Oracle of Bacon](https://oracleofbacon.org) ([Six Degrees of Kevin Bacon](https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon))
*/

/* [Trakt.tv | Partial VIP Unlock]
Unlocks some vip features: adding titles to maxed-out lists, advanced filters, "more" buttons on dashboard, faster page navigation, bulk list management, rewatching, custom calendars, advanced list progress and more. Also hides some vip advertisements.

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

/* [Trakt.tv | Average Season And Episode Ratings]
Shows the average general and personal rating of the seasons of a show and the episodes of a season. You can see the averages for all episodes of a show on its /seasons/all page.

> Based on Tusky's [Trakt Average Season Rating](https://greasyfork.org/scripts/30728) userscript.

### General
- The general ratings average is weighted by votes, to account for the inaccurate ratings of unreleased seasons/episodes.
- Specials are always excluded, except on the specials season page.
- Only visible (i.e. not hidden by a filter) items are used for the calculation of the averages and changes to those filters trigger a recalculation.
*/


'use strict';

const gmStorage = { '2dz6ub1t': true, '2hc6zfyy': true, '71cd9s61': true, 'brzmp0a9': true, 'cs1u5z40': true, 'fyk2l3vj': true, 'kji85iek': true, 'p2o98x5r': true, 'pmdf6nr9': true, 'txw82860': true, 'wkt34fcz': true, 'x70tru7b': true, 'yl9xlca7': true, ...(GM_getValue('megascript')) };
GM_setValue('megascript', gmStorage);


gmStorage['2dz6ub1t'] && (async () => {
'use strict';

let $, toastr;

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

const gmStorage = { ...(GM_getValue('customProfileImage')) };
GM_setValue('customProfileImage', gmStorage);


let styles = addStyles();

window.addEventListener('turbo:load', () => {
  if (!/^\/(shows|movies|users|dashboard|settings|oauth\/(authorized_)?applications)/.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  if (!$ || !toastr) return;

  const $coverWrapper = $('body.is-self #cover-wrapper'),
        $btnSetProfileImage = $('body.is-self #btn-set-profile-image'),
        $fullScreenshot = $('body:is(.shows, .movies) #summary-wrapper > .full-screenshot');

  if (gmStorage.imgUrl && $coverWrapper.length && $btnSetProfileImage.length) addUserPageElems($coverWrapper, $btnSetProfileImage);

  if ($fullScreenshot.length) {
    if ($fullScreenshot.attr('style')) addTitlePageElems($fullScreenshot);
    else {
      new MutationObserver((_muts, mutObs) => {
        mutObs.disconnect();
        addTitlePageElems($fullScreenshot);
      }).observe($fullScreenshot[0], { attributeFilter: ['style'] }); // native logic for selection of bg img (fanart vs screenshot) is quite complex
    }
  }
});


function addUserPageElems($coverWrapper, $btnSetProfileImage) {
  if ($coverWrapper.has('a.selected:contains("Profile")').length) {
    $coverWrapper.removeClass('slim')
      .find('> .poster-bg-wrapper').removeClass('poster-bg-wrapper').addClass('shade');

    if (!$coverWrapper.find('> #watching-now-wrapper').length) {
      $coverWrapper.find('> .container').before(
        `<div class="hidden-xs" id="fanart-info">` +
          `<a href="${gmStorage.info.url}">${gmStorage.info.title} <span class="year">${gmStorage.info.year}</span></a>` +
        `</div>`
      );
    }
  } else {
    $coverWrapper.find('> .poster-bg-wrapper').removeClass('poster-bg-wrapper').addClass('shadow-full-width');
  }

  $btnSetProfileImage.popover('destroy').popover({
    trigger: 'manual',
    container: 'body',
    placement: 'bottom',
    html: true,
    template:
      `<div class="popover remove reset-profile-image" role="tooltip">` +
        `<div class="arrow"></div>` +
        `<h3 class="popover-title"></h3>` +
        `<div class="popover-content"></div>` +
      `</div>`,
    title: 'Reset Profile Image?',
    content:
      `<button class="btn btn-primary less-rounded">Yes</button>` +
      `<button class="btn btn-cancel less-rounded" onclick="$(this).closest('.popover').popover('hide');">No</button>`,
  }).on('click', function() { $(this).popover('show'); })
    .find('.btn-text').text('Reset Profile Image');

  $('body').on('click', '.reset-profile-image .btn-primary', () => {
    ['imgUrl', 'info'].forEach((prop) => delete gmStorage[prop]);
    GM_setValue('customProfileImage', gmStorage);
    styles?.remove();
    logger.success('Custom profile image has been reset.');

    $btnSetProfileImage.popover('destroy').popover({
      trigger: 'hover',
      container: 'body',
      placement: 'bottom',
      html: true,
      template:
        `<div class="popover set-profile-image" role="tooltip">` +
          `<div class="arrow"></div>` +
          `<h3 class="popover-title"></h3>` +
          `<div class="popover-content"></div>` +
        `</div>`,
      content:
        `Showcase your favorite movie, show, season or episode and make it your profile header image! Here's how:<br><br>` +
        `<ol>` +
          `<li>Go to any <b>movie</b>, <b>show</b>, <b>season</b>, or <b>episode</b> page.</li>` +
          `<li>Click <b>Set Profile Image</b> in the sidebar.</li>` +
        `</ol>`,
    }).off('click')
      .find('.btn-text').text('Set Profile Image');

    $coverWrapper.addClass('slim')
      .find('> :is(.shade, .shadow-full-width)').removeClass('shade shadow-full-width').addClass('poster-bg-wrapper')
      .end().find('> #fanart-info').remove();
  });
}


function addTitlePageElems($fullScreenshot) {
  const fanartUrl = $fullScreenshot.css('background-image').match(/url\("?(?!.+?placeholders)(.+?)"?\)/)?.[1],
        $setProfImgBtns = $('[href="/vip/cover"]');

  const deactivateSetProfImgBtns = (reasonId) => {
    $setProfImgBtns.has('.fa')
      .parent().addClass('locked')
      .find('.text').unwrap()
      .append(`<div class="under-action">${['No fanart available', 'Already set'][reasonId]}</div>`);
    $setProfImgBtns.not(':has(.fa)')
      .off('click').on('click', (evt) => evt.preventDefault())
      .css({ 'color': '#bbb' })
      .find('.text').wrap('<s></s>');
  };

  if (!fanartUrl) deactivateSetProfImgBtns(0);
  else if (fanartUrl === gmStorage.imgUrl) deactivateSetProfImgBtns(1);
  else {
    $setProfImgBtns.on('click', (evt) => {
      evt.preventDefault();
      deactivateSetProfImgBtns(1);

      gmStorage.imgUrl = fanartUrl;
      gmStorage.info = {
        url: location.pathname,
        title: $('head title').text().match(/(.+?)(?: \([0-9]{4}\))? - Trakt/)[1],
        year: $('#summary-wrapper .year').text(),
      };
      GM_setValue('customProfileImage', gmStorage);
      styles?.remove();
      styles = addStyles();
      logger.success('Fanart is now set as custom profile image. Click here to see how it looks.', { toastrOpt: { onclick() { location.href = '/users/me'; } } });
    });
  }
}


function addStyles() {
  if (gmStorage.imgUrl) {
    return GM_addStyle(`
body.users.is-self #cover-wrapper:not(:has(> #watching-now-wrapper)) > .full-bg {
  background-image: url("${gmStorage.imgUrl}") !important;
}
@media (width <= 767px) and (orientation: portrait) {
  body.users.is-self #cover-wrapper:not(:has(> #watching-now-wrapper)) > .container {
    background-color: revert !important;
  }
}

body:is(.dashboard, .settings, .authorized_applications, .applications) #results-top-wrapper .poster-bg {
  background-image: url("${gmStorage.imgUrl}") !important;
  background-size: cover !important;
  background-position: 50% 20% !important;
  opacity: 0.7 !important;
  filter: revert !important;
}
  `);
  }
}
})();


gmStorage['2hc6zfyy'] && (async () => {
/* global Cron */

'use strict';

let $, toastr, userslug;

const gmStorage = { toastOnSuccess: true, cronExpr: '@weekly', lastRun: {}, ...(GM_getValue('scheduledEmailDataExports')) };
GM_setValue('scheduledEmailDataExports', gmStorage);

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
  success(msg, opt) { this._print('info', 'success', msg, { consoleStyles: 'color:#00c853;', toast: gmStorage.toastOnSuccess, ...opt }) },
  warning(msg, opt) { this._print('warn', 'warning', msg, opt) },
  error(msg, opt) { this._print('error', 'error', msg, opt) },
};

let cron;
try {
  cron = new Cron(gmStorage.cronExpr, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
} catch (err) {
  logger.error('Invalid cron expression. Exiting..', { data: err });
}


cron && window.addEventListener('turbo:load', async () => {
  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  userslug ??= unsafeWindow.Cookies?.get('trakt_userslug');
  if (!$ || !toastr || !userslug) return;

  const dateNow = new Date();

  if (!gmStorage.lastRun[userslug] || cron.nextRun(gmStorage.lastRun[userslug]) <= dateNow) {
    const realLastRun = await fetch('/settings/data').then((r) => r.text())
      .then((r) => $(new DOMParser().parseFromString(r, 'text/html')).find('#exporters .alert-success .format-date').attr('data-date'));

    if (realLastRun && cron.nextRun(realLastRun) > dateNow) {
      gmStorage.lastRun[userslug] = realLastRun;
      GM_setValue('scheduledEmailDataExports', gmStorage);
      return;
    }

    $.post('/settings/export_data').done(() => {
      gmStorage.lastRun[userslug] = dateNow.toISOString();
      GM_setValue('scheduledEmailDataExports', gmStorage);
      logger.success('Success. Your data export is processing. You will receive an e-mail when it is ready.');
    }).fail((xhr) => {
      if (xhr.status === 409) {
        gmStorage.lastRun[userslug] = dateNow.toISOString();
        GM_setValue('scheduledEmailDataExports', gmStorage);
        logger.warning(`Failed. Cooldown from previous export is still active. Will retry on next scheduled data export at: ${cron.nextRun(gmStorage.lastRun[userslug]).toISOString()}`);
      } else {
        logger.error(`Failed with status: ${xhr.status}. Reload page to try again.`, { data: xhr });
      }
    });
  }
});
})();


gmStorage['71cd9s61'] && (async () => {
'use strict';

let $, toastr;

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

document.addEventListener('turbo:load', () => {
  if (!/^\/people\/[^\/]+(\/lists.*)?$/.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  if (!$ || !toastr) return;

  $(`<button id="btn-pronounce-name">` +
      `<div class="audio-animation fade">` +
        `<div class="bar-1"></div>` +
        `<div class="bar-2"></div>` +
        `<div class="bar-3"></div>` +
      `</div>` +
      `<div class="fa fa-volume fade in"></div>` +
    `</button>`
  ).appendTo($('#summary-wrapper .mobile-title h1')).tooltip({
    title: 'Pronounce Name',
    container: 'body',
    placement: 'top',
    html: true,
  }).one('click', async function() {
    $(this).tooltip('hide');

    const $btnPronounceName = $(this),
          name = $('body > [itemtype$="Person"] > meta[itemprop="name"]').attr('content') ?? $('#summary-wrapper .mobile-title > :last-child').text(); // fallback for /people/<slug>/lists pages

    unsafeWindow.showLoading?.();
    const fullNameAudio = await fetchAudio(name);
    const audios = fullNameAudio ? [fullNameAudio] : await Promise.all(name.split(/\s+/).map((namePart) => {
      return /^\w\.?$/.test(namePart) ? new SpeechSynthesisUtterance(namePart) : fetchAudio(namePart).then((res) => res ?? new SpeechSynthesisUtterance(namePart));
    }));
    unsafeWindow.hideLoading?.();

    if (audios.some((audio) => audio instanceof SpeechSynthesisUtterance)) {
      audios.forEach((audio) => { if (audio instanceof SpeechSynthesisUtterance) audio.lang = 'en-US'; });
      logger.warning(`Could not find a full pronunciation for "${name}" on ` +
                     `<a href="https://forvo.com/search/${encodeURIComponent(name)}" target="_blank"><strong>forvo.com</strong></a>. Falling back to TTS..`);
    }

    ['ended', 'end'].forEach((type) => {
      audios.slice(1).forEach((audio, i) => {
        audios[i]?.addEventListener(type, () => audio.play ? audio.play() : speechSynthesis.speak(audio));
      });
      audios.at(-1).addEventListener(type, () => {
        $btnPronounceName.find('.audio-animation').removeClass('in');
        setTimeout(() => $btnPronounceName.find('.fa').addClass('in'), 150);
      });
    });

    playAudios(audios, $btnPronounceName);
    $btnPronounceName.on('click', () => playAudios(audios, $btnPronounceName));
  });
}, { capture: true });


async function fetchAudio(query) {
  const resp = await GM.xmlHttpRequest({ url: `https://forvo.com/search/${encodeURIComponent(query)}` }),
        doc = new DOMParser().parseFromString(resp.responseText, 'text/html'),
        audioHttpHost = $(doc).find('body > script').text().match(/_AUDIO_HTTP_HOST='(.+?)'/)?.[1],
        audioPathsRaw = $(doc).find('[onclick^="Play"]').attr('onclick')?.match(/Play\([0-9]+,'(.*?)','(.*?)',(?:true|false),'(.*?)','(.*?)'/)?.slice(1),
        audioPaths = audioPathsRaw?.map((pathRaw, i) => pathRaw && ['/mp3/', '/ogg/', '/audios/mp3/', '/audios/ogg/'][i] + atob(pathRaw)).filter(Boolean).reverse();

  return audioPaths?.length ? $('<audio>' + audioPaths.map((path) => {
    return `<source src="https://${audioHttpHost}${path}" type="${path.endsWith('mp3') ? 'audio/mpeg' : 'audio/ogg; codecs=vorbis'}" />`;
  }).join('') + '</audio>')[0] : null;
}

function playAudios(audios, $btnPronounceName) {
  $btnPronounceName.find('.fa').removeClass('in');
  setTimeout(() => {
    $btnPronounceName.find('.audio-animation').addClass('in');
    audios.forEach((audio) => audio.load?.()); // for repeated playback; currentTime = 0 doesn't work for some audio files
    speechSynthesis.cancel();
    audios[0].play ? audios[0].play() : speechSynthesis.speak(audios[0]);
  }, 150);
}


function addStyles() {
  GM_addStyle(`
#btn-pronounce-name {
  margin: 0 0 2px 7px;
  position: relative;
  height: 20px;
  width: 20px;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  background-color: transparent;
}

#btn-pronounce-name .fa {
  position: absolute;
  font-size: 16px;
  color: #aaa;
}
#btn-pronounce-name:hover .fa {
  color: var(--link-color);
}

#btn-pronounce-name .audio-animation {
  position: absolute;
  height: 75%;
  width: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

#btn-pronounce-name .audio-animation [class^="bar-"] {
  flex: 1;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(180deg, rgb(255 0 0), rgb(155 66 200));
  transform: scaleY(0.2);
}

#btn-pronounce-name .in .bar-1 { animation: lineWave-1 .4s .3s infinite alternate; }
#btn-pronounce-name .in .bar-2 { animation: lineWave-2 .3s .2s infinite alternate; }
#btn-pronounce-name .in .bar-3 { animation: lineWave-3 .35s .25s infinite alternate; }

@keyframes lineWave-1 { from { transform: scaleY(0.24); } to { transform: scaleY(0.85); } }
@keyframes lineWave-2 { from { transform: scaleY(0.27); } to { transform: scaleY(0.98); } }
@keyframes lineWave-3 { from { transform: scaleY(0.24); } to { transform: scaleY(0.80); } }
  `);
}
})();


gmStorage['brzmp0a9'] && (async () => {
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
})();


gmStorage['cs1u5z40'] && (async () => {
/* global Chart */

'use strict';

let $, traktApiModule;
let $grid, isSeasonChart, filterSpecials, labelsCallback, chart, datasetsData, firstRunDelay;

Chart.defaults.borderColor = 'rgb(44 44 44 / 0.5)';
const numFormatCompact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
numFormatCompact.formatTLC = (n) => numFormatCompact.format(n).toLowerCase();


addStyles();

document.addEventListener('turbo:load', async () => {
  if (!/^\/shows\/[^/]+\/seasons\/[^/]+$/.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$) return;

  $grid = $('#seasons-episodes-sortable');
  if (!$grid.length) return;
  isSeasonChart = location.pathname.includes('/seasons/');
  filterSpecials = !location.pathname.includes('/seasons/0');
  labelsCallback = isSeasonChart ? (e) => `${e.seasonNum}x${String(e.episodeNum).padStart(2, '0')} ${e.watched ? '\u2714' : '\u2718'}` : (e) => `S. ${e.seasonNum} ${e.watched ? (e.watched == 100 ? '\u2714' : `(${e.watched}%)`) : '\u2718'}`;
  chart = null;
  datasetsData = [];
  firstRunDelay = true;
  if (!isSeasonChart && +$('.season-count').text().split(' ')[0] < 4 ||
      location.pathname.includes('/alternate/') && location.pathname.split('/').filter(Boolean).length < 6) return;

  $grid.on('arrangeComplete', () => {
    if ($grid.data('isotope')) {
      if (!chart) initializeChart();
      else updateChart();
    }
  });
  $(document).off('ajaxSuccess.userscript48372').on('ajaxSuccess.userscript48372', (_evt, _xhr, opt) => {
    if (opt.url.includes('/rate') && chart) updateChart();
  });
}, { capture: true });


function initializeChart() {
  const canvas = $('<div id="seasons-episodes-chart-wrapper"><canvas></canvas></div>').insertBefore($grid).children()[0];

  chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: getChartData(),
    options: getChartOptions(),
  });

  const intObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        intObs.disconnect();
        if (!document.hidden) updateChart();
        else $(document).one('visibilitychange', updateChart);
      };
    });
  }, { threshold: 1.0 });
  intObs.observe(canvas);

  canvas.addEventListener('click', (event) => { // TODO integrate into chart options
    const points = chart.getElementsAtEventForMode(event, 'nearest', { axis: 'x', intersect: false }, true);
    if (!points.length) return;
    const closestPoint = points.sort((p1, p2) => Math.abs(p1.element.y - event.layerY) - Math.abs(p2.element.y - event.layerY))[0];

    if (Math.abs(closestPoint.element.y - event.layerY) < 10) {
      const url = `${datasetsData[closestPoint.index].urlFull}${closestPoint.datasetIndex === 3 ? '/comments' : ''}`;
      GM_openInTab(url, { active: true });
    } else {
      if (chart.isZoomedOrPanned()) {
        chart.resetZoom('active');
      }
    }
  });
}

async function updateChart() {
  const newDatasetsData = await getDatasetsData();
  if (JSON.stringify(datasetsData) !== JSON.stringify(newDatasetsData)) {
    datasetsData = newDatasetsData;
    chart.data = getChartData();
    chart.options = getChartOptions();
    chart.update();
    if (firstRunDelay) firstRunDelay = false;
  }
}

function getDatasetsData() {
  const datasetsData = $grid.data('isotope').filteredItems.filter((i) => filterSpecials ? i.element.dataset.seasonNumber !== '0' : true).map(async (i) => {
    const itemData = {
      generalRating: i.sortData.percentage,
      votes: i.sortData.votes,
      watchers: i.sortData.watchers,
      episodeNum: i.element.dataset.number || null,
      seasonNum: i.element.dataset.seasonNumber,
      urlFull: $(i.element).find('meta[itemprop="url"]').attr('content'),
      personalRating: $(i.element).find('.corner-rating > .text').text() || null,
      watched: $(i.element).find('a.watch.selected').attr('data-percentage') ?? 0,
      releaseDate: $(i.element).find('.percentage').attr('data-earliest-release-date'),
    };

    if (isSeasonChart) {
      itemData.mainTitle = $(i.element).find('.under-info .main-title').text();
      itemData.comments = $(i.element).find('.episode-stats > a[data-original-title="Comments"]').text() || 0;
    } else {
      itemData.mainTitle = $(i.element).find('div[data-type="season"] .titles-link h3').text();
      if (traktApiModule) { // TODO
        const respJSON = await traktApiModule.seasons.comments({ id: i.element.dataset.showId, season: itemData.seasonNum, pagination: true, limit: 1 });
        itemData.comments = respJSON.pagination.item_count;
      } else {
        const resp = await fetch(i.element.dataset.url + '.json');
        if (!resp.ok) throw new Error(`XHR for: ${resp.url} failed with status: ${resp.status}`);
        itemData.comments = (await resp.json()).stats.comment_count;
      }
    }

    return itemData;
  });
  return Promise.all(isSeasonChart ? datasetsData : datasetsData.reverse());
}


function getGradientY(context, callerID, yAxisID, ...colors) {
  if (!context) return colors.pop().color;
  const {ctx, chartArea, scales} = context.chart;
  if (!chartArea) return;
  ctx[callerID] ??= { };

  if (!ctx[callerID].gradient || ctx[callerID].height !== chartArea.height ||
      ctx[callerID].yAxisMin !== scales[yAxisID].min || ctx[callerID].yAxisMax !== scales[yAxisID].max) {
    ctx[callerID].height = chartArea.height;
    ctx[callerID].yAxisMin = scales[yAxisID].min;
    ctx[callerID].yAxisMax = scales[yAxisID].max;

    let newBottom = scales[yAxisID].max - scales[yAxisID].min;
    newBottom = newBottom ? scales[yAxisID].max / newBottom : 1;
    newBottom = chartArea.bottom * newBottom;

    ctx[callerID].gradient = ctx.createLinearGradient(0, newBottom, 0, chartArea.top);
    colors.forEach((c) => ctx[callerID].gradient.addColorStop(c.offset, c.color));
  }
  return ctx[callerID].gradient;
}

function getChartData() {
  return {
    labels: datasetsData.map(labelsCallback),
    datasets: [
      {
        label: 'Personal Rating',
        data: datasetsData.map((e) => e.personalRating ? e.personalRating * 10 : null),
        yAxisID: 'yAxisRating',
        borderColor: (context) => getGradientY(context, '_ratingPersonal', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(175 2 0)' }),
        backgroundColor: (context) => getGradientY(context, '_ratingPersonal', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(175 2 0)' }),
      },
      {
        label: 'General Rating',
        data: datasetsData.map((e) => e.generalRating),
        yAxisID: 'yAxisRating',
        fill: {
          target: '-1',
          above: `rgb(255 0 0 / ${$('body').hasClass('dark-knight') ? 0.15 : 0.3})`,
          below: `rgb(0 255 0 / ${$('body').hasClass('dark-knight') ? 0.15 : 0.3})`,
        },
        borderColor: (context) => getGradientY(context, '_ratingGeneral', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(225 31 117)' }),
        backgroundColor: (context) => getGradientY(context, '_ratingGeneral', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(225 31 117)' }),
      },
      {
        label: 'Watchers',
        data: datasetsData.map((e) => e.watchers),
        yAxisID: 'yAxisWatchers',
        borderColor: (context) => getGradientY(context, '_watchers', 'yAxisWatchers',
          { offset: 0, color: 'rgb(154 67 201 / 0.2)' },
          { offset: 1, color: 'rgb(154 67 201)' }),
        backgroundColor: (context) => getGradientY(context, '_watchers', 'yAxisWatchers',
          { offset: 0, color: 'rgb(154 67 201 / 0.2)' },
          { offset: 1, color: 'rgb(154 67 201)' }),
      },
      {
        label: 'Comments',
        data: datasetsData.map((e) => e.comments),
        yAxisID: 'yAxisComments',
        borderColor: (context) => getGradientY(context, '_comments', 'yAxisComments',
          { offset: 0, color: 'rgb(54 157 226 / 0.2)' },
          { offset: 1, color: 'rgb(54 157 226)' }),
        backgroundColor: (context) => getGradientY(context, '_comments', 'yAxisComments',
          { offset: 0, color: 'rgb(54 157 226 / 0.2)' },
          { offset: 1, color: 'rgb(54 157 226)' }),
      },
    ],
  };
}

function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    animation: {
      delay: (context) => (context.type === 'data' && context.mode === 'default') ?
        (firstRunDelay ? 500 : 0) + context.dataIndex * (750 / Math.max(datasetsData.length - 1, 1)) + context.datasetIndex * 100 : 0,
    },
    scales: {
      x: {
        offset: true,
      },
      yAxisRating: {
        type: 'linear',
        position: 'left',
        offset: true,
        suggestedMin: 60,
        max: 100,
        title: {
          display: true,
          text: 'Rating',
        },
        grid: {
          color: (context) => !(context.tick.value % 10) ? 'rgb(55 55 55)' : Chart.defaults.borderColor,
        },
        ticks: {
          callback: (tickValue) => `${tickValue}%`,
        },
      },
      yAxisWatchers: {
        type: 'linear',
        position: 'right',
        offset: true,
        min: 0,
        suggestedMax: 10,
        title: {
          display: true,
          text: 'Watchers',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (tickValue) => numFormatCompact.formatTLC(tickValue),
        }
      },
      yAxisComments: {
        type: 'linear',
        position: 'right',
        offset: true,
        min: 0,
        suggestedMax: 10,
        title: {
          display: true,
          text: 'Comments',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      tooltip: {
        usePointStyle: true,
        boxPadding: 5,
        backgroundColor: 'rgb(0 0 0 / 0.5)',
        caretSize: 10,
        padding: {
          x: 18,
          y: 6,
        },
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        callbacks: {
          title: (tooltipItems) => {
            let mainTitle = datasetsData[tooltipItems[0].parsed.x].mainTitle;
            mainTitle = mainTitle.length > 20 ? mainTitle.slice(0, 20).trim() + '...' : mainTitle;
            return `${tooltipItems[0].label}${mainTitle ? `\n${mainTitle}` : ''}`;
          },
          label: (tooltipItem) => {
            const x = tooltipItem.parsed.x,
                  y = tooltipItem.parsed.y,
                  avgRatings = unsafeWindow.userscriptAvgSeasonEpisodeRatings;

            if (tooltipItem.datasetIndex === 0) {
              return `${y / 10}` +
                     `${avgRatings?.personal?.average ? `  (avg: ${avgRatings.personal.average.toFixed(1)})` : ''}`;
            } else if (tooltipItem.datasetIndex === 1) {
              return `${y}%  (${numFormatCompact.formatTLC(datasetsData[x].votes)} v.)` +
                     `${avgRatings?.general ? `  (avg: ${avgRatings.general.average ? Math.round(avgRatings.general.average) : '--'}%)` : ''}`;
            } else if (tooltipItem.datasetIndex === 2) {
              return `${numFormatCompact.formatTLC(y)}${datasetsData[0].watchers ? `  (${Math.round(y * 100 / datasetsData[0].watchers)}%)`: ''}`;
            } else {
              return `${y}`;
            }
          },
          labelColor: (tooltipItem) => {
            return {
              borderColor: tooltipItem.dataset.borderColor(),
              backgroundColor: tooltipItem.dataset.backgroundColor(),
            };
          },
          footer: (tooltipItems) => {
            const releaseDate = datasetsData[tooltipItems[0].parsed.x].releaseDate;
            return releaseDate ? unsafeWindow.formatDate?.(releaseDate) || releaseDate : undefined;
          },
        },
      },
      legend: {
        labels: {
          usePointStyle: true,
          filter: (legendItem, chartData) => chartData.datasets[legendItem.datasetIndex].data.some((v) => v !== null),
        },
      },
      filler: {
        propagate: false,
      },
      zoom: {
        zoom: {
          mode: 'x',
          drag: {
            enabled: true,
            threshold: 0,
          },
        },
        limits: {
          x: {
            minRange: 8,
          },
        },
      },
    },
  };
}


function addStyles() {
  GM_addStyle(`
#seasons-episodes-chart-wrapper {
  position: relative;
  margin-top: 20px;
  width: 100%;
  height: 250px;
}
@media (width <= 767px) {
  #seasons-episodes-chart-wrapper {
    margin-left: -10px;
    margin-right: -10px;
    width: calc(100% + 20px);
  }
}
@media (991px < width) {
  #seasons-episodes-chart-wrapper {
    height: 300px;
  }
}
  `);
}
})();


gmStorage['fyk2l3vj'] && (async () => {
'use strict';

let $, toastr, traktApiModule;

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

const gmStorage = { ...(GM_getValue('enhancedTitleMetadata')) };
GM_setValue('enhancedTitleMetadata', gmStorage);


addStyles();

document.addEventListener('turbo:load', async () => {
  if (!/^\/(shows|movies)\//.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$ || !toastr) return;

  const $additionalStatsLi = $('#overview .additional-stats > li'),
        pathSplit = location.pathname.split('/').filter(Boolean);
  if (!$additionalStatsLi.length) return;


  // YEAR
  const $year = $('#summary-wrapper .year');
  if ($year.parent().is('a')) $year.insertAfter($year.parent()); // year is part of link to title summary page on e.g. /comments pages
  $year.wrapAll(`<a href="/search/${pathSplit[0]}?years=${$year.text().slice(0, 4)}-${$year.text().slice(-4)}"></a>`); // year range on /seasons/all


  // CERTIFICATION
  const $certification = $('#summary-wrapper div.certification');
  $certification.wrap(`<a href="${$('#external-link-imdb').attr('href').split('/episodes')[0]}/parentalguide"></a>`);


  // WRITERS
  const $writers = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase() === 'writers');
  $writers.find('label').wrap(`<a href="/search/${pathSplit[0]}?query=%22${$writers.find('a:not(.writers-expand)').get().map((e) => e.textContent).join('%22+%22')}%22&fields=people"></a>`);


  // GENRES
  const $genres = $additionalStatsLi.filter(':has([itemprop="genre"])'),
        matchingGenres = [];
  $genres.find('[itemprop="genre"]').each((i, e) => {
    matchingGenres[i] = $(e).text().toLowerCase().replaceAll(' ', '-');
    $(e).wrap(`<a href="/search/${pathSplit[0]}?genres=${matchingGenres[i]}"></a>`);
  });
  if (matchingGenres.length > 1) $genres.find('label').wrap(`<a href="/search/${pathSplit[0]}?genres=+${matchingGenres.join(',+')}"></a>`);


  // COUNTRY
  const $country = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase() === 'country'); // countryOfOrigin + name meta tags are unreliable
  let matchingCountry; // also used for networks and studios
  if ($country.length) {
    const allCountriesMap = await getAllCountriesMap(),
          countryText = $country.contents().get(-1)?.textContent;

    matchingCountry = allCountriesMap[countryText];
    if (matchingCountry) {
      // flags seem to only be available for countries that are also watch-now countries (~139)
      const countryFlag = unsafeWindow.watchnowAllCountries?.[matchingCountry]?.image;
      if (countryFlag) $country.children().last().after(`<img class="country-flag" src="${countryFlag}">`);

      $country.contents().filter((_, e) => !$(e).is('meta, label')).wrapAll(`<a href="/search/${pathSplit[0]}?countries=${matchingCountry}"></a>`);
    } else {
      gmStorage.allCountriesMap = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match title country. Cached countries have been cleared. Reload page to try again.`);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // LANGUAGES
  const $languages = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase().startsWith('language')),
        matchingLanguages = {}; // also used for networks and studios
  if ($languages.length) {
    const allLanugagesArrSorted = await getAllLanguagesArrSorted(),
          allLanugagesMap = Object.fromEntries(allLanugagesArrSorted);
    let languagesText = $languages.contents().get(-1).textContent;

    allLanugagesArrSorted.forEach(([id, name], i) => {
      const regExp = new RegExp(`${RegExp.escape(name)}(, |$)`);
      if (regExp.test(languagesText)) {
        matchingLanguages[languagesText.indexOf(name)] = id;
        languagesText = languagesText.replace(regExp, (m) => ' '.repeat(m.length));
      }
    });

    if (!languagesText.trim()) {
      const matchingLanguagesIds = Object.values(matchingLanguages);

      $languages.contents().last().replaceWith(
        matchingLanguagesIds
          .map((id) => `<a href="/search/${pathSplit[0]}?languages=${id}">${allLanugagesMap[id]}</a>`)
          .join(', ')
      );

      if (matchingLanguagesIds.length > 1) $languages.find('label').wrap(`<a href="/search/${pathSplit[0]}?languages=+${matchingLanguagesIds.join(',+')}"></a>`);
    } else {
      gmStorage.allLanguagesArrSorted = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match all title languages (ORIGINAL: ${$languages.contents().get(-1).textContent} REMAINDER: ${languagesText.trim()}). ` +
                   `Cached languages have been cleared. Reload page to try again.`);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // NETWORKS
  const $networks = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase().startsWith('network')), // .stat class is unreliable
        $networkAlt = $additionalStatsLi.filter((_, e) => /airs|aired|premiered/i.test($(e).find('label').text())).first(); // can have one network as suffix
  if ($networks.length && pathSplit[3] !== 'all') { // network names on /seasons/all are invalid (memory addresses instead of names)
    const matchingNetworks = {},
          allNetworksArrSorted = await getAllNetworksArrSorted(),
          allNetworksMap = Object.fromEntries(allNetworksArrSorted);
    let networksText = $networks.contents().get(-1).textContent; // text is not sanitized and can contain tabs and stray spaces from network names

    allNetworksArrSorted.forEach(([id, { name, countryId }], i) => {
      const regExp = new RegExp(`${RegExp.escape(name)}(, |$)`);
      if (regExp.test(networksText) && (
        // !countryId || // TODO
        countryId === matchingCountry || Object.hasOwn(matchingLanguages, countryId) ||
        name !== allNetworksArrSorted[i+1]?.[1].name
      )) {
        matchingNetworks[networksText.indexOf(name)] = id;
        networksText = networksText.replace(regExp, (m) => ' '.repeat(m.length));
      }
    });

    if (!networksText.trim()) {
      const matchingNetworksIds = Object.values(matchingNetworks);

      $networks.contents().last().replaceWith(
        matchingNetworksIds
          .map((id) => `<a href="/search/shows?network_ids=${id}">${allNetworksMap[id].name}${allNetworksMap[id].countryId ? ` (${allNetworksMap[id].countryId.toUpperCase()})` : ''}</a>`)
          .join('')
      );

      if (matchingNetworksIds.length > 1) {
        $networks.find('label').wrap(`<a href="/search/shows?network_ids=${matchingNetworksIds.join(',')}"></a>`);

        $(`<a href onclick="$(this).hide(); $(this).next().show(); return false;"> + ${matchingNetworksIds.length - 1} more</a>`)
          .insertAfter($networks.children().eq(1))
          .nextAll().wrapAll(`<span style="display: none;"></span>`);
      }

      $networks.find('a:not(:has(label), [onclick])').slice(1).before(', '); // comma insertion done here because nextAll() doesn't support text nodes
    } else {
      gmStorage.allNetworksArrSorted = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match all title networks (ORIGINAL: ${$networks.contents().get(-1).textContent} REMAINDER: ${networksText.trim()}). ` +
                   `Cached networks have been cleared. Reload page to try again.`);
    }
  } else if ($networkAlt.text().includes(' on ') && pathSplit[3] !== 'all') {
    const allNetworksArrSorted = await getAllNetworksArrSorted(),
          networkText = $networkAlt.contents().last().text().split(' on ')[1];

    const matchingNetwork = networkText ? allNetworksArrSorted.find(([id, { name, countryId }], i) =>
      new RegExp(`${RegExp.escape(name)}(, |$)`).test(networkText) && (
        // !countryId || // TODO
        countryId === matchingCountry || Object.hasOwn(matchingLanguages, countryId) ||
        name !== allNetworksArrSorted[i+1]?.[1].name
      )
    ) : null;

    if (matchingNetwork) {
      $networkAlt.contents().last().remove();
      $networkAlt.append(` on <a href="/search/shows?network_ids=${matchingNetwork[0]}">${matchingNetwork[1].name}` +
                         `${matchingNetwork[1].countryId ? ` (${matchingNetwork[1].countryId.toUpperCase()})` : ''}</a>`)
    } else {
      gmStorage.allNetworksArrSorted = null;
      GM_setValue('enhancedTitleMetadata', gmStorage);
      logger.error(`Failed to match title network (${networkText}). Cached networks have been cleared. Reload page to try again.`);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // STUDIOS
  const $studios = $additionalStatsLi.filter((_, e) => $(e).find('label').text().toLowerCase().startsWith('studio'));
  if ($studios.length) {
    if (traktApiModule) {
      let hasRun = false;

      const matchStudioFromElemContext = async function(evt) {
        if (hasRun) return;
        hasRun = true;
        evt?.preventDefault();

        unsafeWindow.showLoading?.();
        const dataStudios = await traktApiModule[pathSplit[0]].studios({ id: $('.summary-user-rating').attr(`data-${pathSplit[0].slice(0, -1)}-id`) }), // has the same order as $studios
              allStudioIdsJoined = dataStudios.map((studio) => studio.ids.trakt).join();
        unsafeWindow.hideLoading?.();

        if (evt) {
          const url = `/search/${pathSplit[0]}?studio_ids=${$(this).find('label').length ? allStudioIdsJoined : dataStudios[0].ids.trakt}`;
          if (evt.type === 'click') location.href = url;
          else if (evt.originalEvent.button === 1) GM_openInTab(location.origin + url, { setParent: true });
        }

        $studios.children().eq(0).attr('href', `/search/${pathSplit[0]}?studio_ids=${allStudioIdsJoined}`);
        $studios.children().eq(1).attr('href', `/search/${pathSplit[0]}?studio_ids=${dataStudios[0].ids.trakt}`);
        $studios.find('.studios-more').html(dataStudios.slice(1).map((studio) => `, <a href="${studio.ids.trakt}">${studio.name}</a>`));
      }

      // wrap names with unresolved anchor tags to minimize api requests
      $studios.find('label').wrap($(`<a href="#"></a>`).one('click auxclick', matchStudioFromElemContext));
      $studios.contents().eq(1).wrap($(`<a href="#"></a>`).one('click auxclick', matchStudioFromElemContext));
      $studios.find('.studios-expand').one('click', () => matchStudioFromElemContext());
    } else {
      const matchingStudios = new Set(),
            $studiosMore = $studios.find('.studios-more'),
            $studiosExpand = $studios.find('.studios-expand'),
            studiosMoreSplit = $studiosMore.text().split(', ').slice(1),
            studiosMoreCount = +$studiosExpand.text().match(/\d+/)?.[0] || null;

      // use studio search endpoint from advanced filters modal (~250.000 studios total; several thousand studio names contain commas; returns max. of 1000 results per request sorted lexicographically)
      const queryStudioNameMatches = (query) => {
        return fetch('/autocomplete/studios?query=' + encodeURIComponent(query))
          .then((r) => r.json())
          .then((r) => Object.fromEntries(
            r.map(({ label: name, value: studioId, tag: countryId }) => [name, +studioId, countryId?.toLowerCase() ?? null])
             .sort(([nameA, studioIdA, countryIdA], [nameB, studioIdB, countryIdB]) => nameA === nameB
                   ? (countryIdA && (countryIdA === matchingCountry || Object.hasOwn(matchingLanguages, countryIdA))) -
                     (countryIdB && (countryIdB === matchingCountry || Object.hasOwn(matchingLanguages, countryIdB))) ||
                     // (countryIdB && 1) - (countryIdA && 1) || // TODO
                     studioIdB - studioIdA // the lower the studio id, the more major the studio tends to be
                   : 0)
          ));
      };

      // executed from the context of an unresolved anchor tag (no lookup on page load to minimize api requests)
      const matchStudioFromElemContext = async function(evt) {
        evt?.preventDefault();
        $(this).off();

        unsafeWindow.showLoading?.();
        const studioName = $(this).text(),
              queryResult = await queryStudioNameMatches(studioName),
              studioId = queryResult[studioName];
        unsafeWindow.hideLoading?.();

        if (studioId) {
          matchingStudios.add(studioId);
          const url = `/search/${pathSplit[0]}?studio_ids=${studioId}`;

          if (evt) {
            if (evt.type === 'click') location.href = url;
            else if (evt.originalEvent.button === 1) GM_openInTab(location.origin + url, { setParent: true });
          }
          $(this).attr('href', url);
        } else {
          logger.error('Failed to match title studio: ' + studioName, { data: queryResult });
        }
      };

      // algorithm to deal with getting ids for a list of studio names, separated by commas, which by themseves can contain commas:
      // for split(', ') part at index i try to find longest possible match in part's result list by looking for results[parts(i)], then results[parts(i) + parts(i+1)] etc. longest match wins
      const matchStudiosMoreSplit = async () => {
        if (matchingStudios.size > 1) return;

        unsafeWindow.showLoading?.();
        const partsQueryResults = await Promise.all(studiosMoreSplit.map((part) => queryStudioNameMatches(part).then((results) => [part, results])));
        let consumedUntilIndex = -1;
        unsafeWindow.hideLoading?.();

        $studiosMore.html(partsQueryResults.map(([part, results], i) => {
          if (i <= consumedUntilIndex) return null;

          let longestMatch;
          for (let j = i; j < partsQueryResults.length; j++) {
            if (j !== i) part += ', ' + partsQueryResults[j][0];
            if (results[part]) {
              consumedUntilIndex = j;
              longestMatch = [part, results[part]];
            }
          };
          if (longestMatch) {
            matchingStudios.add(longestMatch[1]);
            return `, <a href="/search/${pathSplit[0]}?studio_ids=${longestMatch[1]}">${longestMatch[0]}</a>`;
          } else {
            logger.error('Failed to match all title studios. Could not match: ' + partsQueryResults[i][0], { data: results });
            throw new Error('Failed to match all title studios.'); // don't mutate original elem
          }
        }).join(''));
      }

      $studios.contents().eq(1).wrap($(`<a href="#"></a>`).on('click auxclick', matchStudioFromElemContext));

      if (studiosMoreCount) {
        // matchStudiosMoreSplit() always works, but it's overkill in most cases as only a small subset of studios have names containing commas
        if (studiosMoreCount === 1) {
          $studiosMore
            .text(', ')
            .append($(`<a href="#">${studiosMoreSplit.join(', ')}</a>`).on('click auxclick', matchStudioFromElemContext));
        } else if (studiosMoreCount === studiosMoreSplit.length) {
          $studiosMore.empty();
          studiosMoreSplit.forEach((part) => $studiosMore.append(', ', $(`<a href="#">${part}</a>`).on('click auxclick', matchStudioFromElemContext)));
        } else {
          $studiosExpand.one('click', matchStudiosMoreSplit);
        }

        $studios.find('label')
          .wrap(`<a href="#"></a>`)
          .parent()
          .on('click auxclick', async function(evt) {
            evt.preventDefault();
            $(this).off();

            await Promise.all([...$studios.find('a[href="#"]:not(:has(label), .studios-expand)').get().map((e) => matchStudioFromElemContext.call(e)), matchStudiosMoreSplit()]);
            const url = `/search/${pathSplit[0]}?studio_ids=${Array.from(matchingStudios).join(',')}`;

            if (evt.type === 'click') location.href = url;
            else if (evt.originalEvent.button === 1) GM_openInTab(location.origin + url, { setParent: true });
            $(this).attr('href', url);
          });
      }
    }
  }
}, { capture: true });

///////////////////////////////////////////////////////////////////////////////////////////////

async function getAllCountriesMap() { // ~235
  if (!gmStorage.allCountriesMap) {
    const doc = await fetch('/search/movies').then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')); // movie countries are superset of show countries

    gmStorage.allCountriesMap = JSON.stringify(Object.fromEntries(
      $(doc).find('#filter-countries').children().get()
        .map((e) => [$(e).text(), $(e).attr('value').toLowerCase()])
    ));
    GM_setValue('enhancedTitleMetadata', gmStorage);
  }
  return JSON.parse(gmStorage.allCountriesMap);
}

async function getAllLanguagesArrSorted() { // ~179
  if (!gmStorage.allLanguagesArrSorted) {
    const doc = await fetch('/search/movies').then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')); // movie langs are superset of show langs

    gmStorage.allLanguagesArrSorted = JSON.stringify(
      $(doc).find('#filter-languages').children().get()
        .map((e) => [$(e).attr('value'), $(e).text()])
        .sort(([, nameA], [, nameB]) => nameB.length - nameA.length) // ensure longest names get matched first, necessary because language names can include other language names and commas
    );
    GM_setValue('enhancedTitleMetadata', gmStorage);
  }
  return JSON.parse(gmStorage.allLanguagesArrSorted);
}

async function getAllNetworksArrSorted() { // ~4000; trakt api only returns one network (not full list) and only the name, not id
  if (!gmStorage.allNetworksArrSorted) {
    const doc = await fetch('/search/shows').then((r) => r.text()).then((r) => new DOMParser().parseFromString(r, 'text/html')),
          collator = new Intl.Collator();

    gmStorage.allNetworksArrSorted = JSON.stringify(
      $(doc).find('#filter-network_ids').children().get()
        .map((e) => $(e).text() ? [+$(e).attr('value'), { name: $(e).text(), countryId: $(e).attr('data-tag')?.toLowerCase() }] : null) // names can contain leading/trailing whitespace (even tabs)
        .filter(Boolean)
        .sort(([networkIdA, { name: nameA, countryId: countryIdA }], [networkIdB, { name: nameB, countryId: countryIdB }]) => {
          return nameB.length - nameA.length || // ensure longest names get matched first, necessary because network names can include names of other networks and commas
            collator.compare(nameA, nameB) || // make sure all those with the same name are neighbors
            (countryIdB && 1) - (countryIdA && 1) || // prioritize those with country code
            networkIdB - networkIdA; // the lower the network id, the more major the network tends to be
        })
    );
    GM_setValue('enhancedTitleMetadata', gmStorage);
  }
  return JSON.parse(gmStorage.allNetworksArrSorted);
}

///////////////////////////////////////////////////////////////////////////////////////////////

function addStyles() {
  GM_addStyle(`
#overview .additional-stats .country-flag {
  width: 20px !important;
  margin: -2px 5px 0 0 !important;
  transition: transform .5s ease;
}
#overview .additional-stats a:hover > .country-flag {
  transform: scale(1.1);
}

:is(#info-wrapper .additional-stats a > label, #summary-wrapper a > .year):hover {
  color: var(--link-color) !important;
  cursor: pointer !important;
}
#summary-wrapper a:has(> .certification):hover {
  color: #fff !important;
}
  `);
}
})();


gmStorage['kji85iek'] && (async () => {
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
})();


gmStorage['p2o98x5r'] && (async () => {
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
})();


gmStorage['pmdf6nr9'] && (async () => {
/* global Chart */

'use strict';

let $, traktApiModule;
const numFormatCompact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
numFormatCompact.formatTLC = (n) => numFormatCompact.format(n).toLowerCase();


addStyles();

document.addEventListener('turbo:load', async () => {
  if (!/^\/(shows|movies)\//.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$) return;

  const $summaryWrapper = $('#summary-wrapper'),
        $summaryRatingsWrapper = $summaryWrapper.find('#summary-ratings-wrapper'),
        statsPath = $summaryRatingsWrapper.find('.trakt-rating > a').attr('href');
  if (!statsPath) return;

  const $canvas = $(`<div id="ratings-distribution-chart-wrapper"><canvas></canvas></div>`)
                    .appendTo($summaryWrapper.find('.shadow-base'))
                    .find('canvas');
  const [ratingsData, fanartBrightness] = await Promise.all([getRatingsData(statsPath), getFanartBrightness($summaryWrapper)]);

  const newChart = () => {
    new Chart($canvas[0].getContext('2d'), {
      type: 'bar',
      data: getChartData(ratingsData, fanartBrightness),
      options: getChartOptions(ratingsData, $summaryRatingsWrapper),
    });
  };
  if (!document.hidden) newChart();
  else $(document).one('visibilitychange', newChart);
}, { capture: true });


async function getRatingsData(statsPath) {
  let ratingsData;
  if (traktApiModule) {
    const statsPathSplit = statsPath.split('/').slice(1, -1),
          id = isNaN(statsPathSplit[1]) ? statsPathSplit[1] : $('.summary-user-rating').attr(`data-${statsPathSplit[0].slice(0, -1)}-id`), // /shows/1883 numeric slugs are interpreted as trakt-id by api
          resp = await traktApiModule[(statsPathSplit[4] ?? statsPathSplit[2] ?? statsPathSplit[0])].ratings({ id, season: statsPathSplit[3], episode: statsPathSplit[5] });
    ratingsData = { distribution: Object.values(resp.distribution), votes: resp.votes };
  } else {
    const resp = await fetch(statsPath),
          statsDoc = new DOMParser().parseFromString(await resp.text(), 'text/html'),
          ratDist = JSON.parse($(statsDoc).find('#charts-wrapper script').text().match(/ratingsDistribution = (\[.*\])/)[1]);
    ratingsData = { distribution: ratDist, votes: $('#summary-ratings-wrapper').data('vote-count') };
  }

  if (ratingsData.distribution.length === 11) { // bg logging of titles with malformed (length = 11, [0] === 1 or more, only movs/shows no seasons/eps) ratings distribution data e.g. /shows/chainsaw-man
    // GM_setValue(statsPath, ratingsData.distribution.toString());
    console.warn(GM_info.script.name.replace('Trakt.tv', 'Userscript') + ': Malformed ratings distribution data.', ratingsData.distribution.toString());
    ratingsData.distribution.shift();
  }

  return ratingsData;
}

function getFanartBrightness($summaryWrapper) {
  const $fullScreenshot = $summaryWrapper.find('> .full-screenshot');

  const onBgImgSet = async () => {
    const url = $fullScreenshot.css('background-image').match(/https.*webp/)?.[0];
    if (!url) return 0.5;

    const resp = await GM.xmlHttpRequest({ url, responseType: 'blob', fetch: true });
    if (resp.status !== 200) throw new Error(`XHR for: ${resp.finalUrl} failed with status: ${resp.status}`);

    const blobUrl = URL.createObjectURL(resp.response),
          img = new Image();
    img.src = blobUrl;
    await img.decode();
    URL.revokeObjectURL(blobUrl);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const cropWidth = img.naturalWidth / 4, cropHeight = img.naturalHeight / 4,
          data = ctx.getImageData(3*cropWidth, 2*cropHeight, cropWidth, cropHeight).data;
    let sum = 0, px = data.length / 16;
    for (let i = 0; i < data.length; i += 16) {
      sum += (0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2]) / 255;
    }
    return sum / px;
  }

  if ($fullScreenshot.attr('style')) return onBgImgSet();
  else {
    return new Promise((res) => {
      new MutationObserver((_mutations, mutObs) => {
        mutObs.disconnect();
        res(onBgImgSet());
      }).observe($fullScreenshot[0], { attributeFilter: ['style'] });
    });
  }
}


function getGradientY(context, callerId, yAxisId, ...colors) {
  if (!context) return colors.pop().color;
  const {ctx, chartArea, scales} = context.chart;
  if (!chartArea) return;

  ctx[callerId] ??= {};
  if (!ctx[callerId].gradient ||
      ctx[callerId].height !== chartArea.height ||
      ctx[callerId].yAxisMin !== scales[yAxisId].min ||
      ctx[callerId].yAxisMax !== scales[yAxisId].max) {
    let newBottom = scales[yAxisId].max - scales[yAxisId].min;
    newBottom = newBottom ? scales[yAxisId].max / newBottom : 1;
    newBottom = chartArea.bottom * newBottom;

    ctx[callerId].gradient = ctx.createLinearGradient(0, newBottom, 0, chartArea.top);
    colors.forEach((c) => ctx[callerId].gradient.addColorStop(c.offset, c.color));

    ctx[callerId].height = chartArea.height;
    ctx[callerId].yAxisMin = scales[yAxisId].min;
    ctx[callerId].yAxisMax = scales[yAxisId].max;
  }
  return ctx[callerId].gradient;
}

function getChartData(ratingsData, fanartBrightness) {
  return {
    labels: [...Array(10)].map((_, i) => String(i + 1)),
    datasets: [{
      label: 'Votes',
      data: ratingsData.distribution,
      categoryPercentage: 1,
      barPercentage: 0.97,
      backgroundColor: `rgba(${Array(3).fill(Math.min(fanartBrightness+0.35, 1)*255).join(', ')}, ${Math.min(fanartBrightness+0.3, 0.7)})`,
      hoverBackgroundColor: (context) => getGradientY(context, '_votes', 'y',
        { offset: 0, color: `rgba(155, 66, 200, ${Math.min(fanartBrightness+0.3, 0.7)})` },
        { offset: 0.9, color: `rgba(255, 0, 0, ${Math.min(fanartBrightness+0.3, 0.7)})` }),
    }],
  };
}

function getChartOptions(ratingsData, $summaryRatingsWrapper) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    minBarLength: 2,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      delay: (context) => (context.type === 'data' && context.mode === 'default') ? 250 + context.dataIndex * (750 / (ratingsData.distribution.length - 1)) : 0,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        suggestedMax: 10,
      },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        caretSize: 10,
        padding: {
          x: 12,
          y: 5,
        },
        titleAlign: 'center',
        titleMarginBottom: 2,
        titleFont: {
          weight: 'bold',
        },
        bodyAlign: 'center',
        bodyColor: 'rgb(170, 170, 170)',
        bodyFont: {
          size: 11,
        },
        footerAlign: 'center',
        footerColor: (context) => `hsl(0, ${context.tooltip.dataPoints[0].parsed.x * 11}%, 35%)`, // approximation
        footerMarginTop: 2,
        footerFont: {
          size: 18,
        },
        callbacks: {
          title: (tooltipItems) => {
            const label = tooltipItems[0].label;
            return `${label} - ${unsafeWindow.ratingsText?.[label]}`;
          },
          label: (tooltipItem) => {
            const y = tooltipItem.parsed.y;
            return `${ratingsData.votes > 0 ? (y*100 / ratingsData.votes).toFixed(1) : '--'}% (${numFormatCompact.formatTLC(y)} v.)`;
          },
          footer: (tooltipItems) => {
            const personalRating = $summaryRatingsWrapper.find('.summary-user-rating > :not([style="display: none;"]) > [class*="rating-"]').first().attr('class')?.match(/rating-(\d+)/)?.[1];
            return tooltipItems[0].parsed.x === personalRating - 1 ? '\u2764' : '';
          },
        },
      },
      legend: {
        display: false,
      },
    },
    onClick: (_evt, activeElems) => {
      if (!activeElems.length) return;

      const rating = activeElems[0].index + 1;
      $summaryRatingsWrapper.find('.summary-user-rating:not(.popover-on)').trigger('click');
      setTimeout(() => $(`.needsclick.rating-${rating}`).trigger('mouseover').trigger('click'), 500);
    },
  };
}


function addStyles() {
  GM_addStyle(`
#summary-wrapper {
  container-type: inline-size;
  --rat-dist-chart-width: 28cqi;
}
#summary-wrapper .shadow-base {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
#ratings-distribution-chart-wrapper {
  position: relative;
  z-index: 30;
  height: 100%;
  width: var(--rat-dist-chart-width);
}
#summary-wrapper:has(#summary-ratings-wrapper) .summary .mobile-title {
  padding-right: calc(var(--rat-dist-chart-width) - ((100cqi - 100%) / 2) + 5px) !important;
}
@media (width <= 767px) {
  #ratings-distribution-chart-wrapper {
    height: 65%;
  }
}


#summary-wrapper .summary .mobile-title .year {
  white-space: nowrap;
}
#summary-wrapper .summary .mobile-title .year::after {
  content: "\\2060";
}
  `);
}
})();


gmStorage['txw82860'] && (async () => {
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
})();


gmStorage['wkt34fcz'] && (async () => {
/* global levenshteinDistance */

'use strict';

const customLinkHelperFns = {
  encodeRfc3986: (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()),
  getDefaultTorrentQuery: (i) =>
    `${customLinkHelperFns.encodeRfc3986(i.title)}${i.type === 'movies' ? ` ${i.year}` : ''}` +
    `${i.season !== undefined ? ` s${String(i.season).padStart(2, '0')}${i.episode ? `e${String(i.episode).padStart(2, '0')}` : ''}` : ''}`,
  getDefaultDirectStreamingPath: (i) => `/${i.type === 'movies' ? `movie/${i.ids.tmdb}` : `tv/${i.ids.tmdb}/${i.season !== undefined ? i.season : '1'}/${i.episode ? i.episode : '1'}`}`,
  getWnInnerHtml: ({ btnStyle = '', img, imgStyle = '', text, textStyle = '' }) =>
    `<div class="icon btn-custom" style="${btnStyle}">` +
      (img ? `<img class="lazy" src="${GM_getResourceURL(img)}" style="${text ? 'max-width: 35%; ' : ''}${imgStyle}">` : '') +
      (text ? `<div class="text" style="${img ? 'max-width: 65%; ' : ''}${textStyle}">${text}</div>` : '') +
    `</div>`,
  getWnCategoryHtml: (category) => `[${watchNowCategories[category]}]`,
  getDdgFaviconHtml: (site, style = '') => `<img src="https://icons.duckduckgo.com/ip3/${site}.ico" style="${style}">`,
  getFaBrandsHtml: (brand, style = '') => `<i class="fa-brands fa-${brand}" style="${style}"></i>`,
  isAdultFemale: (i) => /female|non_binary/.test(i.gender) && i.birthday && Date.now() - new Date(i.birthday) > 18 * 365.25 * 24 * 60 * 60 * 1000,
  fetchAnimeId: (i, site) =>
    `fetch('https://arm.haglund.dev/api/v2/themoviedb?id=${i.ids.tmdb}').then((r) => r.json())` + // cached on disk for 6 hours
      `.then((arr) => arr.map((e) => (e.levDist = userscriptLevDist('${i.ids.slug}${i.season > 1 ? `-${i.season_title.toLowerCase().replaceAll(/[ '"]/g, '-')}` : ''}', e['anime-planet'] ?? ''), e))` +
                        `.sort((a, b) => a.levDist - b.levDist)` +
                        `.find((e) => e['${site}'])?.['${site}'])`,
  fetchWikidataClaim: (i, claimId) => // only for movies + shows
    `fetch('https://query.wikidata.org/sparql?format=json&query=${customLinkHelperFns.encodeRfc3986( // cached on disk for 5 mins
      `SELECT ?value WHERE { ` +
        `?item wdt:${i.type === 'movies' ? 'P4947' : 'P4983'} "${i.ids.tmdb}" . ` +
        `?item wdt:P31/wdt:P279* wd:${i.type === 'movies' ? 'Q11424' : 'Q5398426'} . ` +
        `?item wdt:${claimId} ?value . ` +
      `} LIMIT 1`
    )}').then((r) => r.json())` +
      `.then((r) => r.results.bindings[0]?.value?.value)`,
  hideNativeExternalLink: (idSuffix) => `#external-link-${idSuffix} { display: none !important; }`,
  getDdgTopResultRedirectUrl: (site, query) => `https://duckduckgo.com/?q=%5Csite%3A${site} ${customLinkHelperFns.encodeRfc3986(query)}`,
};

const watchNowCategories = {
  animeAggregator: 'Anime Aggregator',
  animeStreaming: 'Anime Streaming',
  debrid: 'Debrid',
  streaming: 'Streaming',
  torrentAggregator: 'Torrent Aggregator',
  usenetIndexer: 'Usenet Indexer',
};

const customWatchNowLinks = [
  { // https://ext.to/advanced/
    buildHref: (i) => `https://ext.to/browse/?q=${customLinkHelperFns.getDefaultTorrentQuery(i)} ${customLinkHelperFns.encodeRfc3986(gmStorage.torrentResolution)} 265${/shows|seasons/.test(i.type) ? '&sort=size&order=desc' : '&sort=seeds&order=desc'}&with_adult=1`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #242730;', text: 'EXT', textStyle: 'background-image: linear-gradient(90deg, #3990f6 48.2%, #2c67a6 48.2% 66.2%, #3990f6 66.2%); background-clip: text; color: transparent; font-size: 50cqi; font-weight: 850; letter-spacing: -0.5px; padding-right: 3%;' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('torrentAggregator'),
  },
  { // to open in desktop app use: buildHref: (i) => `stremio:///detail/...
    buildHref: (i) => `https://web.stremio.com/#/detail/${i.type === 'movies' ? `movie/${i.ids.imdb}/${i.ids.imdb}` : `series/${i.ids.imdb}${i.type === 'seasons' ? `?season=${i.season}` : i.type === 'episodes' ? customLinkHelperFns.encodeRfc3986(`/${i.ids.imdb}:${i.season}:${i.episode}`) : ''}`}`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #19163a;', img: 'stremio', text: 'Stremio' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('debrid'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'myanimelist')}` +
      `.then((id) => id ?? userscriptGmXhrCustomLinks({ url: 'https://kuroiru.co/backend/search', method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: 'q=${customLinkHelperFns.encodeRfc3986(i.title)}', responseType: 'json' }).then((r) => r.response[0]?.id))` +
      `.then((id) => 'https://kuroiru.co/anime/' + id + '/ep${i.episode ?? '1'}')`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #191919;', img: 'kuroiru' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('animeAggregator'),
    includeIf: (i) => i.genres.includes('anime'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'anilist')}.then((id) => 'https://animetsu.cc' + (id ? '/watch/' + id + '?ep=${i.episode ?? '1'}&subType=dub&server=' : '/search?query=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #111;', text: 'GOJO.LIVE', textStyle: 'font-family: GangOfThree; font-size: 18cqi;' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('animeStreaming'),
    includeIf: (i) => i.genres.includes('anime'),
    addStyles: `@font-face { font-family: "GangOfThree"; src: url("${GM_getResourceURL('gojolive')}") format("woff2"); font-display: block; }`,
  },
  { // type=dub is bugged
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'anilist')}.then((id) => 'https://anidap.se' + (id ? '/watch?ep=${i.episode ?? '1'}&type=dub&provider=&id=' + id : '/search?q=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #1f2728;', img: 'anidap', imgStyle: 'transform: scale(2.2);' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('animeStreaming'),
    includeIf: (i) => i.genres.includes('anime'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'anilist')}.then((id) => 'https://www.miruro.to' + (id ? '/watch/' + id + '/episode-${i.episode ?? '1'}' : '/search?query=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #0e0e0e;', img: 'miruro' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('animeStreaming'),
    includeIf: (i) => i.genres.includes('anime'),
  },
  {
    buildHref: (i) => `https://knaben.org/search/${customLinkHelperFns.getDefaultTorrentQuery(i)} ${customLinkHelperFns.encodeRfc3986(gmStorage.torrentResolution)} (265|av1)/${i.type === 'movies' ? '3000000' : i.genres.includes('anime') ? '6000000' : '2000000'}/1/seeders`,
    innerHtml: `<div class="icon btn-custom" style="background: #323537; flex-direction: column;">${GM_getResourceText('knaben').replace('<svg', '<svg style="max-height: 79%;"')}<div class="text" style="font-family: system-ui; font-size: 10cqi; letter-spacing: 0.3px;">KNABEN DATABASE</div></div>`,
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('torrentAggregator'),
  },
  {
    buildHref: (i) => `https://iframe.pstream.mov/embed/tmdb-${i.type === 'movies' ? `movie-${i.ids.tmdb}` : `tv-${i.ids.tmdb}/${i.season !== undefined ? i.season : '1'}/${i.episode ? i.episode : '1'}`}`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #110d1b;', img: 'pstream', text: 'P-Stream', textStyle: 'font-size: 11cqi;' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('streaming'),
  },
  {
    buildHref: (i) => `https://www.cineby.gd${customLinkHelperFns.getDefaultDirectStreamingPath(i)}?play=true`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #440000;', img: 'cineby', text: 'Cineby', textStyle: 'font-family: system-ui; font-size: 17cqi;' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('streaming'),
  },
  {
    buildHref: (i) => `https://hexa.su/watch${customLinkHelperFns.getDefaultDirectStreamingPath(i)}`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #111317;', img: 'hexa' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('streaming'),
  },
  {
    buildHref: (i) => `https://www.fmovies.gd/watch${customLinkHelperFns.getDefaultDirectStreamingPath(i)}`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #18252b;', text: 'FMOVIES+', textStyle: 'background-image: linear-gradient(to right, rgb(13 202 240), rgb(13 202 240 / 35%)); background-clip: text; color: transparent; font-family: system-ui; font-size: 15cqi; font-weight: 800; letter-spacing: 0.3px; border: 2px solid rgb(13 202 240 / 25%); border-radius: 5px; padding: 5%;' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('streaming'),
  },
  { // https://scenenzbs.com/search#adv-subtabs
    buildHref: (i) => `https://scenenzbs.com/search/${customLinkHelperFns.getDefaultTorrentQuery(i)} ${customLinkHelperFns.encodeRfc3986(gmStorage.torrentResolution)} (265|av1)`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #212529;', img: 'scenenzbs', imgStyle: 'transform: scale(1.8) translateY(-1px);' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('usenetIndexer'),
  },
  {
    buildHref: (i) => `https://x.debridmediamanager.com/${i.ids.imdb}`,
    innerHtml: customLinkHelperFns.getWnInnerHtml({ btnStyle: 'background: #2e3e51;', img: 'dmm', imgStyle: 'transform: scale(1.7);', text: 'Debrid<br>Media<br>Manager', textStyle: 'font-size: 12cqi;' }),
    tooltipHtml: customLinkHelperFns.getWnCategoryHtml('debrid'),
  },
];

const customExternalLinks = [
  {
    buildHref: (i) => `/${/seasons|episodes/.test(i.type) ? 'shows' : i.type}/${i.ids.slug}${i.season !== undefined ? `/seasons/${i.season}${i.episode ? `/episodes/${i.episode}` : ''}` : ''}/wikipedia`,
    innerHtml: customLinkHelperFns.getFaBrandsHtml('wikipedia-w'),
    tooltipHtml: 'Wikipedia',
    addStyles: customLinkHelperFns.hideNativeExternalLink('wikipedia'),
  },
  {
    buildHref: (i) => `https://duckduckgo.com/?q=site%3Areddit.com Discussion ${customLinkHelperFns.encodeRfc3986(i.title)}${i.type === 'movies' ? ` ${i.year}` : ''}${i.season !== undefined ? ` Season ${i.season}${i.episode ? ` Episode ${i.episode}` : ''}` : ''}`,
    innerHtml: customLinkHelperFns.getFaBrandsHtml('reddit'),
    tooltipHtml: 'Reddit',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => `https://letterboxd.com/tmdb/${i.ids.tmdb}`,
    innerHtml: customLinkHelperFns.getFaBrandsHtml('letterboxd'),
    tooltipHtml: 'Letterboxd',
    includeIf: (i) => i.type === 'movies',
  },
  {
    buildHref: (i) => `https://reversetv.enzon19.com/${/seasons|episodes/.test(i.type) ? 'shows' : i.type}/${i.ids.slug}${i.season !== undefined ? `/seasons/${i.season_old ?? i.season}${i.episode ? `/episodes/${i.episode_old ?? i.episode}` : ''}` : ''}`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('reversetv.enzon19.com', '--extra-filters: invert(1);'),
    tooltipHtml: 'ReverseTV',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => `userscriptGmXhrCustomLinks({ url: 'https://moviemaps.org/ajax/search?token=${customLinkHelperFns.encodeRfc3986(i.title)}&max_matches=1&use_similar=1', responseType: 'json' })` +
      `.then((r) => 'https://moviemaps.org' + (r.response[0]?.url ?? '/search?q=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: `<i class="fa-regular fa-map"></i>`,
    tooltipHtml: 'MovieMaps',
    includeIf: (i) => i.type !== 'people' && !['animation', 'anime'].some((g) => i.genres.includes(g)),
  },
  {
    buildHref: (i) => customLinkHelperFns.getDdgTopResultRedirectUrl('fandom.com', i.title),
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('fandom.com', '--extra-filters: invert(1);'),
    tooltipHtml: 'Fandom',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => `https://aznude.com/search.html?q=${customLinkHelperFns.encodeRfc3986(i.name ?? i.title)}`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('aznude.com', 'transform: scale(1.1);'),
    tooltipHtml: 'AZNude',
    includeIf: (i) => gmStorage.includeNsfwLinks && (i.type === 'people' && customLinkHelperFns.isAdultFemale(i) || i.type !== 'people' && !['animation', 'anime'].some((g) => i.genres.includes(g))),
  },
  {
    buildHref: (i) => `userscriptGmXhrCustomLinks({ url: 'https://celeb.gate.cc/search.json?q=${customLinkHelperFns.encodeRfc3986(i.name)}', responseType: 'json' })` +
      `.then((r) => 'https://celeb.gate.cc/' + (r.response[0] ? r.response[0].url + '?s=i.clicks.total&cdir=desc#images' : 'search?q=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: '<img src="https://celeb.gate.cc/assets/logo.png" style="--extra-filters: brightness(1.1);">',
    tooltipHtml: 'CelebGate',
    includeIf: (i) => gmStorage.includeNsfwLinks && i.type === 'people' && customLinkHelperFns.isAdultFemale(i),
  },
  {
    buildHref: (i) => `https://rule34.xxx/index.php?page=post&s=list&tags=sort:score ${i.title.toLowerCase().replaceAll(/[^a-z0-9-:; ]/g, '').replaceAll(' ', '_')}`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('rule34.xxx'),
    tooltipHtml: 'Rule 34',
    includeIf: (i) => gmStorage.includeNsfwLinks && i.type !== 'people',
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'myanimelist')}.then((id) => 'https://myanimelist.net' + (id ? '/anime/' + id ${i.episode ? `+ '/x/episode/${i.episode}'` : ''}: '/search/all?q=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('myanimelist.net'),
    tooltipHtml: 'MyAnimeList',
    includeIf: (i) => i.genres?.includes('anime'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'anilist')}.then((id) => 'https://anilist.co' + (id ? '/anime/' + id : '/search/anime?search=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('anilist.co'),
    tooltipHtml: 'AniList',
    includeIf: (i) => i.genres?.includes('anime'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'anidb')}.then((id) => 'https://anidb.net/anime/' + (id ?? '?adb.search=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('anidb.net'),
    tooltipHtml: 'AniDB',
    includeIf: (i) => i.genres?.includes('anime'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchAnimeId(i, 'livechart')}.then((id) => 'https://livechart.me' + (id ? '/anime/' + id : '/search?q=${customLinkHelperFns.encodeRfc3986(i.title)}'))`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('livechart.me'),
    tooltipHtml: 'LiveChart',
    includeIf: (i) => i.genres?.includes('anime'),
  },
  {
    buildHref: (i) => `https://www.themoviedb.org/${i.type === 'people' ? 'person' : i.type === 'movies' ? 'movie' : 'tv'}/${i.ids.tmdb}${i.season !== undefined ? `/season/${i.season}${i.episode ? `/episode/${i.episode}` : ''}` : ''}`,
    innerHtml: '<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg">',
    tooltipHtml: 'TMDB',
    addStyles: customLinkHelperFns.hideNativeExternalLink('tmdb'),
  },
  {
    buildHref: (i) => `https://www.imdb.com/${i.type === 'people' ? 'name' : 'title'}/${i.episode_ids?.imdb ?? i.ids.imdb}${i.season && !i.episode ? `/episodes/?season=${i.season}` : ''}`,
    innerHtml: customLinkHelperFns.getFaBrandsHtml('imdb', 'font-size: 24px;'),
    tooltipHtml: 'IMDb',
    addStyles: customLinkHelperFns.hideNativeExternalLink('imdb'),
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchWikidataClaim(i, i.type === 'movies' ? 'P12196' : 'P4835')}.then((id) => id ? 'https://www.thetvdb.com/dereferrer/${i.type === 'movies' ? 'movie' : 'series'}/' + id : '${customLinkHelperFns.getDdgTopResultRedirectUrl('thetvdb.com', i.title)}')`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('thetvdb.com'),
    tooltipHtml: 'TheTVDB',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => i.type === 'people' ?
      `fetch('https://api.tvmaze.com/search/people?q=${customLinkHelperFns.encodeRfc3986(i.name)}').then((r) => r.json()).then((r) => r[0]?.person.url ?? 'https://www.tvmaze.com/search?q=${customLinkHelperFns.encodeRfc3986(i.name)}')` :
      `fetch('https://api.tvmaze.com/lookup/shows?imdb=${i.ids.imdb}').then((r) => ${!i.season ?
        `r.url.replace('api.', '')` :
        `fetch(r.url + '${i.episode ? `/episodebynumber?season=${i.season}&number=${i.episode}` : `/seasons`}').then((r2) => r2.json()).then((r2) => r2${i.episode ? '' : `[${i.season-1}]`}.url)`})`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('tvmaze.com'),
    tooltipHtml: 'TVmaze',
    includeIf: (i) => /shows|seasons|episodes|people/.test(i.type),
  },
  {
    buildHref: (i) => i.season_trailer ?? (i.type !== 'episodes' ? i.trailer : null) ?? customLinkHelperFns.getDdgTopResultRedirectUrl('youtube.com', `${i.title}${i.type === 'movies' ? ` ${i.year}` : ''}${i.season ? ` Season ${i.season}` : ''} Official Trailer`),
    innerHtml: customLinkHelperFns.getFaBrandsHtml('youtube'),
    tooltipHtml: 'YouTube Trailer',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => `https://www.youtube.com/results?search_query=${customLinkHelperFns.encodeRfc3986(i.name)} Interview`,
    innerHtml: customLinkHelperFns.getFaBrandsHtml('youtube'),
    tooltipHtml: 'YouTube Interviews',
    includeIf: (i) => i.type === 'people',
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchWikidataClaim(i, 'P1258')}.then((id) => id ? ` +
      `'https://www.rottentomatoes.com/' + id ${i.season ? `+ '/s${String(i.season).padStart(2, '0')}${i.episode ? `/e${String(i.episode).padStart(2, '0')}` : ''}'` : ''}: ` +
      `'${customLinkHelperFns.getDdgTopResultRedirectUrl('rottentomatoes.com', i.title + (i.season ? ` Season ${i.season}${i.episode ? ` Episode ${i.episode}` : ''}` : ''))}')`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('rottentomatoes.com', '--extra-filters: brightness(1.15) contrast(1.3);'),
    tooltipHtml: 'Rotten Tomatoes',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => `${customLinkHelperFns.fetchWikidataClaim(i, 'P1712')}.then((id) => id ? ` +
      `'https://www.metacritic.com/' + id ${i.season ? `+ '/season-${i.season}${i.episode ? `/episode-${i.episode}-${i.episode_title.toLowerCase().replaceAll(/[^a-z0-9- ]/g, '').replaceAll(' ', '-')}` : ''}'` : ''}: ` +
      `'${customLinkHelperFns.getDdgTopResultRedirectUrl('metacritic.com', i.title + (i.season ? ` Season ${i.season}${i.episode ? ` Episode ${i.episode}` : ''}` : ''))}')`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('metacritic.com'),
    tooltipHtml: 'Metacritic',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => $(`.btn-watch-now[data-url="${i.item_url}"] ~ .external #external-link-justwatch`).attr('href') ?? $('#powered_by_url').attr('value'),
    innerHtml: '<i class="fa-kit fa-justwatch"></i>',
    tooltipHtml: 'JustWatch',
    includeIf: (i) => i.type !== 'people' && $(`.btn-watch-now[data-url="${i.item_url}"] ~ .external #external-link-justwatch, #watch-now-content[data-url="${i.item_url}"] > #powered_by_url`).length,
    addStyles: customLinkHelperFns.hideNativeExternalLink('justwatch'),
  },
  {
    buildHref: (i) => `https://open.spotify.com/search/${customLinkHelperFns.encodeRfc3986(i.title)} Soundtrack`,
    innerHtml: customLinkHelperFns.getFaBrandsHtml('spotify'),
    tooltipHtml: 'Spotify',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => i.type === 'movies' ?
      `https://fanart.tv/movie/${i.ids.tmdb}` :
      `fetch('https://api.tvmaze.com/lookup/shows?imdb=${i.ids.imdb}').then((r) => r.ok ? ` +
        `r.json().then((r) => 'https://fanart.tv/series/' + r.externals.thetvdb) : ` +
        `userscriptGmXhrCustomLinks({ url: 'https://fanart.tv/api/search.php?section=tv&s=${customLinkHelperFns.encodeRfc3986(i.title)}', responseType: 'json' }).then((r) => r.response[0]?.link))`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('fanart.tv'),
    tooltipHtml: 'Fanart.tv',
    includeIf: (i) => i.type !== 'people',
    addStyles: customLinkHelperFns.hideNativeExternalLink('fanart'),
  },
  {
    buildHref: (i) => `https://mediux.pro/${i.type === 'movies' ? 'movies' : 'shows'}/${i.ids.tmdb}`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('mediux.pro'),
    tooltipHtml: 'MediUX',
    includeIf: (i) => i.type !== 'people',
  },
  {
    buildHref: (i) => `https://youglish.com/pronounce/${customLinkHelperFns.encodeRfc3986(i.name)}/english`,
    innerHtml: customLinkHelperFns.getDdgFaviconHtml('youglish.com'),
    tooltipHtml: 'YouGlish',
    includeIf: (i) => i.type === 'people',
  },
  {
    buildHref: (i) => [...new DOMParser().parseFromString(GM_getResourceText('oracleofbacon'), 'text/html').querySelectorAll('#main .top-1000 li')].some((li) => li.textContent.split('(')[0].trim() === i.name) ?
      'https://oracleofbacon.org/graph.php?who=' + customLinkHelperFns.encodeRfc3986(i.name) :
      `https://oracleofbacon.org/movielinks.php?a=Kevin+Bacon&b=${customLinkHelperFns.encodeRfc3986(i.name)}&use_using=1&u0=on&u1=on&use_role_types=1&rt0=on&rt1=on&rt3=on&company=&use_genres=1&g0=on&g4=on&g8=on&g12=on&g20=on&g24=on&g1=on&g5=on&g9=on&g13=on&g21=on&g25=on&g2=on&g10=on&g14=on&g18=on&g22=on&g26=on&g3=on&g7=on&g11=on&g15=on&g19=on&g27=on`,
    innerHtml: `<i class="fa-regular fa-chart-network"></i>`,
    tooltipHtml: 'Oracle of Bacon',
    includeIf: (i) => i.type === 'people',
  },
  {
    buildHref: (i) => i.homepage,
    innerHtml: '<i class="fa-light fa-clapperboard-play"></i>',
    tooltipHtml: 'Official Site',
    includeIf: (i) => i.homepage,
    addStyles: customLinkHelperFns.hideNativeExternalLink('official'),
  },
  {
    buildHref: (i) => $('#external-link-instagram').attr('href'),
    innerHtml: customLinkHelperFns.getFaBrandsHtml('instagram'),
    tooltipHtml: 'Instagram',
    includeIf: (i) => $(`:is(.btn-watch-now, .poster[data-person-id])[data-url="${i.item_url}"] ~ .external #external-link-instagram`).length,
    addStyles: customLinkHelperFns.hideNativeExternalLink('instagram'),
  },
  {
    buildHref: (i) => $('#external-link-twitter').attr('href'),
    innerHtml: customLinkHelperFns.getFaBrandsHtml('x-twitter'),
    includeIf: (i) => $(`:is(.btn-watch-now, .poster[data-person-id])[data-url="${i.item_url}"] ~ .external #external-link-twitter`).length,
    addStyles: customLinkHelperFns.hideNativeExternalLink('twitter'),
  },
  {
    buildHref: (i) => $('#external-link-facebook').attr('href'),
    innerHtml: customLinkHelperFns.getFaBrandsHtml('facebook'),
    tooltipHtml: 'Facebook',
    includeIf: (i) => $(`:is(.btn-watch-now, .poster[data-person-id])[data-url="${i.item_url}"] ~ .external #external-link-facebook`).length,
    addStyles: customLinkHelperFns.hideNativeExternalLink('facebook'),
  },
];

///////////////////////////////////////////////////////////////////////////////////////////////

let $, traktApiModule;
unsafeWindow.userscriptLevDist = levenshteinDistance;
unsafeWindow.userscriptGmOpenInTab = GM_openInTab;
unsafeWindow.userscriptGmXhrCustomLinks = GM.xmlHttpRequest;
unsafeWindow.userscriptItemDataCache = {};

const gmStorage = { maxSidebarWnLinks: 4, torrentResolution: '1080p', includeNsfwLinks: false, ...(GM_getValue('customLinks')) };
GM_setValue('customLinks', gmStorage);


addStyles();

document.addEventListener('turbo:load', async () => {
  $ ??= unsafeWindow.jQuery;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$) return;

  const $watchNowContent = $('#watch-now-content'),
        $searchResults = $('#header-search-autocomplete-results'),
        itemUrl = $('.notable-summary').attr('data-url') || $('.sidebar').attr('data-url');

  $(document).off('ajaxSuccess.userscript83278').on('ajaxSuccess.userscript83278', (_evt, _xhr, opt) => {
    if ($watchNowContent.length && opt.url.includes('/streaming_links?country=')) addCustomLinksToModal($watchNowContent);
    if ($searchResults.length && /^\/search\/autocomplete(?!\/(people|lists|users))/.test(opt.url)) addWatchNowLinksToSearchResults($searchResults);
  });

  if (/^\/(movies|shows|seasons|episodes|people)\/[^\/]+$/.test(itemUrl)) { // regex filters list + alternate season itemUrls
    const pathBeforeFetch = location.pathname,
          itemData = await getItemData(itemUrl);

    if (pathBeforeFetch === location.pathname) {
      addExternalLinksToSidebar(itemData);
      addExternalLinksToAdditionalStats(itemData);
      if (itemData.type !== 'people') {
        addWatchNowLinksToSidebar(itemData);
        addWatchNowLinksToActionButtons(itemData);
      }
    }
  }
}, { capture: true });

///////////////////////////////////////////////////////////////////////////////////////////////

const getCustomLinkHtml = (l, itemData, innerHtmlOverride) => {
  const buildHref = l.buildHref(itemData);
  return `<a ${!/\)\.then\(/.test(buildHref) ? `href="${buildHref}"` : `href="javascript:void(0);" ` +
    `onclick="event.preventDefault(); ` +
             `$(this).removeAttr('onclick onauxclick'); ` +
             `${buildHref}.then((href) => { $(this).attr('href', href); userscriptGmOpenInTab(href, { active: true, setParent: true }); });" ` +
    `onauxclick="event.preventDefault(); ` +
             `$(this).removeAttr('onclick onauxclick'); ` +
             `${buildHref}.then((href) => { $(this).attr('href', href); if (event.button === 1) userscriptGmOpenInTab(href, { setParent: true }); });"`} ` +
    `target="_blank" rel="noreferrer" data-original-title="${l.tooltipHtml ?? ''}">${innerHtmlOverride ?? l.innerHtml}</a>`;
};

function addExternalLinksToSidebar(itemData) {
  $(customExternalLinks
    .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
    .map((l) => getCustomLinkHtml(l, itemData))
    .join('')
   ).prependTo('#info-wrapper .sidebar .external > li').tooltip({
    container: 'body',
    placement: 'bottom',
    html: true,
  });
}

function addExternalLinksToAdditionalStats(itemData) {
  $(customExternalLinks
    .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
    .map((l) => getCustomLinkHtml(l, itemData, $(l.innerHtml).attr('alt') ?? l.tooltipHtml) + ', ')
    .join('')
  ).insertAfter('.additional-stats.with-external-links label:contains("Links")');
}

function addWatchNowLinksToSidebar(itemData) {
  const $sidebar = $('#info-wrapper .sidebar');

  if ($sidebar.has('.btn-watch-now').length && !$sidebar.has('.streaming-links').length) {
    $sidebar.find('.btn-watch-now').before(
      `<div class="streaming-links">` +
        `<div class="sources"></div>` +
      `</div>`
    );
  }

  $(customWatchNowLinks
    .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
    .map((l) => getCustomLinkHtml(l, itemData))
    .join('')
  ).prependTo($sidebar.find('.streaming-links .sources'))
   .attr('data-container', 'body').attr('data-html', 'true').tooltip(); // loadWatchnowModal() calls $('.streaming-links a').tooltip('destroy').tooltip({ html: true })
}

function addWatchNowLinksToActionButtons(itemData) {
  const $actionButtons = $('#overview .action-buttons');

  if ($actionButtons.length && !$actionButtons.has('.btn-watch-now').length) {
    const $sidebarBtnWatchNow = $('#info-wrapper .sidebar .btn-watch-now'),
          dataSourceCounts = $sidebarBtnWatchNow.attr('data-source-counts'),
          itemUrl = $sidebarBtnWatchNow.attr('data-url');
    if (!dataSourceCounts || !itemUrl) return;

    $actionButtons.prepend(
      `<div class="streaming-links">` +
        `<div class="sources"></div>` +
      `</div>` +
      `<a class="btn btn-block btn-summary btn-watch-now visible-xs selected" data-source-counts="${dataSourceCounts}" data-target="#watch-now-modal" data-toggle="modal" data-url="${itemUrl}" href="#">` +
        `<i class="fa fa-fw fa-solid fa-play"></i>` +
        `<div class="text">` +
          `<div class="main-info">Watch Now</div>` +
          `<div class="under-info">0 streaming services</div>` +
        `</div>` +
      `</a>`
    );
  }

  $(customWatchNowLinks
    .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
    .map((l) => getCustomLinkHtml(l, itemData))
    .join('')
  ).prependTo($actionButtons.find('.sources'))
   .attr('data-html', 'true').tooltip();
}

async function addWatchNowLinksToSearchResults($searchResults) {
  $searchResults.find('> .search-result:not([data-type="people"])').each(async function() { // search-by-id endpoints can return people
    const itemData = await getItemData($(this).attr('data-url'));

    if (!$(this).has('.streaming-links').length) {
      $(this).append(
        `<div class="streaming-links">` +
          `<div class="sources"></div>` +
        `</div>`
      );
    }

    $(customWatchNowLinks
      .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
      .map((l) => getCustomLinkHtml(l, itemData))
      .join('')
    ).prependTo($(this).find('.streaming-links .sources')).tooltip({
      placement: 'bottom',
      html: true,
    }).on('click', (evt) => evt.stopPropagation()); // native click handler on .search-result
  });
}

async function addCustomLinksToModal($watchNowContent) {
  const itemData = await getItemData($watchNowContent.attr('data-url'));

  $watchNowContent.find('> .streaming-links').prepend(
    `<div class="title">Custom Links</div>` +
    `<div class="section external"></div>` +
    `<div class="section"></div>` +
    ($watchNowContent.has('.no-links').length ? `<div class="title"></div>` : '')
  ).end().find('> .title-wrapper .titles').append(
    `<div class="overview">${itemData.episode_overview ?? itemData.season_overview ?? itemData.overview ?? 'No overview available.'}</div>`
  );

  $(customExternalLinks
    .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
    .map((l) => getCustomLinkHtml(l, itemData))
    .join('')
  ).appendTo($watchNowContent.find('.section.external')).tooltip({
    placement: 'bottom',
    html: true,
  });

  $(customWatchNowLinks
    .filter((l) => l.includeIf ? l.includeIf(itemData) : true)
    .map((l) => getCustomLinkHtml(l, itemData, l.innerHtml + (l.tooltipHtml ? `<div class="price">${l.tooltipHtml}</div>` : '')))
    .join('')
  ).appendTo($watchNowContent.find('.section.external + .section'));
}

///////////////////////////////////////////////////////////////////////////////////////////////

const getItemDataFromTraktApi = async (itemUrl) => {
  const itemUrlSplit = itemUrl.split('/').filter(Boolean),
        type = itemUrlSplit[0];
  let itemDoc, $notableSummary, showData, seasonData, episodeData;

  // itemUrlSplit[1] is trakt-id for seasons + eps and slug for shows + movs + people, can be numeric for shows e.g. /shows/1883 which gets interpreted as trakt-id by api
  if (type === 'seasons' || type === 'shows' && !isNaN(itemUrlSplit[1])) {
    const resp = await fetch(itemUrl);
    if (!resp.ok) throw new Error(`getItemData: Fetching ${resp.url} failed with status: ${resp.status}`);
    itemDoc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    $notableSummary = $(itemDoc).find('.notable-summary');
  }

  if (type === 'episodes') {
    [{ show: showData, episode: episodeData }] = await traktApiModule.search.id({ id_type: 'trakt', id: itemUrlSplit[1], type: 'episode', extended: 'full' }); // doesn't work with slugs and doesn't support type: 'season'
    seasonData = await traktApiModule.seasons.season.info({ id: showData.ids.trakt, season: episodeData.season, extended: 'full' });
  };
  const itemData = {
    item_url: itemUrl,
    type,
    ...(type !== 'episodes' && {
      ...(await traktApiModule[type === 'seasons' ? 'shows' : type].summary({ id: $notableSummary?.attr('data-show-id') ?? itemUrlSplit[1], extended: 'full' })), // cached on disk for 8 hours
    }),
    ...(type === 'seasons' && {
      season: +$notableSummary.attr('data-season-number'),
      season_title: $(itemDoc).find('#level-up-link[href*="/seasons/"]').text() || $(itemDoc).find('#summary-wrapper .mobile-title h1').contents()[0]?.textContent.trim(),
      season_overview: $(itemDoc).find('#overview #overview').text() || null,
      season_trailer: $(itemDoc).find('#overview .affiliate-links .trailer').attr('href') || null,
    }),
    ...(type === 'episodes' && {
      ...showData,
      season: seasonData.number,
      season_title: seasonData.title,
      season_original_title: seasonData.original_title,
      season_ids: seasonData.ids,
      season_first_aired: seasonData.first_aired,
      season_overview: seasonData.overview,
      season_episode_count: seasonData.episode_count,
      episode: episodeData.number,
      episode_title: episodeData.title,
      episode_original_title: episodeData.original_title,
      episode_ids: episodeData.ids,
      episode_first_aired: episodeData.first_aired,
      episode_overview: episodeData.overview,
      episode_type: episodeData.episode_type,
    }),
  };
  return itemData;
}

const getItemDataFromSummaryPage = async (itemUrl) => {
  let itemDoc, itemDoc2;

  const resp = await fetch(itemUrl);
  if (!resp.ok) throw new Error(`getItemData: Fetching ${resp.url} failed with status: ${resp.status}`);
  itemDoc = new DOMParser().parseFromString(await resp.text(), 'text/html');

  if (resp.url.includes('/seasons/')) {
    const resp2 = await fetch(resp.url.split('/seasons/')[0]);
    if (!resp2.ok) throw new Error(`getItemData: Fetching ${resp2.url} failed with status: ${resp2.status}`);
    itemDoc2 = new DOMParser().parseFromString(await resp2.text(), 'text/html');
  }

  const type = itemUrl.split('/').filter(Boolean)[0],
        $notableSummary = $(itemDoc).find('.notable-summary'),
        $additionalStatsLi = $(itemDoc).find('.additional-stats > li'),
        $additionalStatsLi2 = itemDoc2 ? $(itemDoc2).find('.additional-stats > li') : undefined,
        filterStatsElemsByLabel = (labelText, $statsElems = $additionalStatsLi) => $statsElems.filter((_, e) => $(e).find('label').text().toLowerCase() === labelText);

  const itemData = {
    item_url: itemUrl,
    type,
    ids: {
      trakt: +($notableSummary.attr('data-movie-id') ?? $notableSummary.attr('data-show-id') ?? $notableSummary.attr('data-person-id')),
      imdb: $(itemDoc2 ?? itemDoc).find('#external-link-imdb').attr('href')?.match(/(?:tt|nm)\d+/)?.[0],
      tmdb: +$(itemDoc).find('#external-link-tmdb').attr('href')?.match(/\d+/)?.[0] || null,
      slug: resp.url.split('/')[4],
    },
    homepage: $(itemDoc2 ?? itemDoc).find('#external-link-official').attr('href') ?? null,
    ...(type !== 'people' && {
      title: $(itemDoc).find(':is(body > [itemtype$="Movie"], body > [itemtype$="TVSeries"], body > [itemtype] > [itemtype$="TVSeries"]) > meta[itemprop="name"]').attr('content')?.match(/(.+?)(?: \(\d{4}\))?$/)?.[1],
      original_title: filterStatsElemsByLabel('original title', $additionalStatsLi2).contents().get(-1)?.textContent,
      year: +$(itemDoc2 ?? itemDoc).find('#summary-wrapper .mobile-title .year')[0]?.textContent || null,
      genres: $additionalStatsLi.find('[itemprop="genre"]').map((_, e) => $(e).text().toLowerCase()).get(),
      overview: $(itemDoc2 ?? itemDoc).find('#overview #overview').text() || null,
      trailer: $(itemDoc2 ?? itemDoc).find('#overview .affiliate-links .trailer').attr('href') || null,
    }),
    ...(/seasons|episodes/.test(type) && {
      season: +$notableSummary.attr('data-season-number'),
      season_title: $(itemDoc).find('#level-up-link[href*="/seasons/"]').text() || $(itemDoc).find('#summary-wrapper .mobile-title h1').contents()[0]?.textContent.trim(),
    }),
    ...(type === 'seasons' && {
      season_overview: $(itemDoc).find('#overview #overview').text() || null,
      season_trailer: $(itemDoc).find('#overview .affiliate-links .trailer').attr('href') || null,
    }),
    ...(type === 'episodes' && {
      episode: +$notableSummary.attr('data-episode-number'),
      episode_title: $(itemDoc).find('body > [itemtype$="TVEpisode"] > meta[itemprop="name"]').attr('content'),
      episode_overview: $(itemDoc).find('#overview #overview').text() || null,
      episode_ids: {
        imdb: $(itemDoc).find('#external-link-imdb').attr('href')?.match(/tt\d+/)?.[0],
      },
    }),
    ...(type === 'people' && {
      name: $(itemDoc).find('body > [itemtype$="Person"] > meta[itemprop="name"]').attr('content'),
      gender: filterStatsElemsByLabel('gender').contents().get(-1)?.textContent.toLowerCase().replace('-', '_'),
      birthday: filterStatsElemsByLabel('birthday').children().last().attr('data-date'),
    }),
  };
  if (Object.hasOwn(itemData, 'original_title')) itemData.original_title ??= itemData.title;
  return itemData;
}

const verifyEpisodeGroup = async (itemData) => { // some anime don't default to the "correct" episode group e.g. /shows/cowboy-bebop (eps out of order), /shows/solo-leveling (1 instead of 2 seasons)
  const showData = await fetch(`https://api.tvmaze.com/lookup/shows?imdb=${itemData.ids.imdb}`) // max 20 calls / 10s; cached on disk for 1 hour
                           .then((r) => r.ok ? fetch(r.url + '?embed[]=episodes&embed[]=seasons') : null)
                           .then((r) => r?.ok ? r.json() : null);
  const episodeData = showData?._embedded.episodes.find((ep) => ep.name.trim().toLowerCase() === itemData.episode_title.trim().toLowerCase());

  if (episodeData && (itemData.season !== episodeData.season || itemData.episode !== episodeData.number)) { // ep group used by tvmaze is usually the "correct" one
    itemData.season_old = itemData.season;
    itemData.episode_old = itemData.episode;
    itemData.season = episodeData.season;
    itemData.episode = episodeData.number;
    itemData.season_title = showData._embedded.seasons.find((s) => s.number == episodeData.season).name || `Season ${episodeData.season}`;
    ['season_original_title', 'season_ids', 'season_first_aired', 'season_episode_count'].forEach((prop) => delete itemData[prop]);
  }
  return itemData;
}

async function getItemData(itemUrl) {
  return (unsafeWindow.userscriptItemDataCache[itemUrl] ??= await (
    (traktApiModule ? getItemDataFromTraktApi : getItemDataFromSummaryPage)(itemUrl)
      .then((i) => i.type === 'episodes' && i.genres.includes('anime') ? verifyEpisodeGroup(i) : i)
  ));
}

///////////////////////////////////////////////////////////////////////////////////////////////

function addStyles() {
  GM_addStyle(`
#info-wrapper .additional-stats.with-external-links .visible-xs {
  font-size: 0;
  user-select: none;
}
#info-wrapper .additional-stats.with-external-links .visible-xs > :is(label, a) {
  font-size: 14px;
  user-select: text;
}
#info-wrapper .additional-stats.with-external-links .visible-xs > a:has(+ a)::after {
  content: ", ";
}


.no-watchnow-sources:not([data-url^="/people"], [data-url^="/lists"]) {
  display: block !important;
}
[data-source-counts] > .fa-play::before {
  transition: color 0.3s;
}
[data-source-counts] > .fa-play::before {
  color: #777 !important;
}
[data-source-counts*="'${document.cookie.match(/(?:^|; )watchnow_country=([^;]*)/)?.[1] ?? new Intl.Locale(navigator.language).region}'" i] > .fa-play::before {
  color: #ccc !important;
}
:is([data-source-counts="{}"], [data-source-counts="{'none':1}"]) > .fa-play::before {
  color: #333 !important;
}
[data-source-counts] > .fa-play:hover::before {
  color: #fff !important;
}


#info-wrapper :is(.sidebar, .action-buttons) .streaming-links a:is(:nth-child(3n), :nth-child(4n)) {
  display: inline-block !important;
}
#info-wrapper .sidebar .streaming-links a:nth-child(n+${gmStorage.maxSidebarWnLinks + 1} of a),
#info-wrapper .action-buttons .streaming-links a:nth-child(n+3 of a),
#header-search-autocomplete-results .streaming-links a:nth-child(n+3 of a) {
  display: none !important;
}


.streaming-links a > .icon.btn-custom {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 3%;
  padding: 4% 6% !important;
  border-width: 0px !important;
  overflow: hidden;
  container-type: inline-size;
}
.streaming-links a:hover > .icon.btn-custom {
  filter: contrast(1.2);
}
.streaming-links .icon.btn-custom > img {
  max-height: 100%;
  object-fit: contain;
}
.streaming-links .icon.btn-custom > .text {
  position: revert;
  transform: revert;
  -webkit-transform: revert;
  max-height: revert;
  padding: revert;
  overflow: revert;
  text-transform: revert;
  white-space: pre;
  font-size: 14cqi;
}


:is(#info-wrapper .sidebar, #watch-now-content) .external a {
  height: 27px;
  padding: 3px 5px !important;
  line-height: 18px !important;
  font-size: 14px !important;
  vertical-align: middle;
  color: #ccc !important;
  background-color: #333 !important;
  border: solid 1px #333 !important;
  border-radius: 3px !important;
  width: revert !important;
}
:is(#info-wrapper .sidebar, #watch-now-content) .external a:has(> *) {
  padding: 1.5px !important;
}
:is(#info-wrapper .sidebar, #watch-now-content) .external a > :is(div, i) {
  padding: 0 2px !important;
  font-size: 19px;
  vertical-align: -5px;
}
:is(#info-wrapper .sidebar, #watch-now-content) .external a > img {
  height: 100%;
  border-radius: inherit;
  filter: grayscale(1) var(--extra-filters, grayscale(1));
}
:is(#info-wrapper .sidebar, #watch-now-content) .external a:hover {
  color: #fff !important;
  background-color: #555 !important;
}
:is(#info-wrapper .sidebar, #watch-now-content) .external a:hover > img {
  filter: grayscale(1) var(--extra-filters, grayscale(1)) brightness(1.3);
}


#watch-now-content .title-wrapper {
  margin-bottom: revert !important;
}
#watch-now-content .title-wrapper .titles {
  padding-bottom: revert !important;
}
#watch-now-content .title-wrapper .titles .overview {
  height: 60px;
  margin-top: 5px;
  padding: 5px 0 10px;
  mask: linear-gradient(to bottom, transparent, white 5px 45px, transparent);
  overflow-y: auto;
  scrollbar-width: none;
  color: #ccc;
}


#watch-now-modal {
  top: 35px !important;
  max-height: calc(100% - 70px);
  flex-direction: column;
}
#watch-now-modal[style*="display: block;"] {
  display: flex !important;
}
#watch-now-content {
  display: contents;
}
#watch-now-content .streaming-links {
  margin: 10px 0 !important;
  mask: linear-gradient(to bottom, transparent, white 10px calc(100% - 10px), transparent);
  overflow: auto;
  scrollbar-width: none;
}
#watch-now-content .title {
  margin: 10px 0 15px !important;
}
#watch-now-content .section.external {
  margin: 0 30px 15px !important;
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}
#watch-now-content .section:not(.external) a {
  padding-bottom: 10px !important;
}
@media (width <= 767px) {
  #watch-now-content .section.external {
    margin: 0 15px 15px !important;
  }
}


@media (767px < width) {
  #info-wrapper .sidebar:has(> .external) {
    height: calc(100vh - 25px - var(--header-height));
    overflow: auto;
    scrollbar-width: none;
  }
}


${customWatchNowLinks.concat(customExternalLinks).map((l) => l.addStyles).filter(Boolean).join('\n')}
  `); // font data-uris are so long that everything below them doesn't get shown in style tag
}
})();


gmStorage['x70tru7b'] && (async () => {
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
})();


gmStorage['yl9xlca7'] && (async () => {
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
})();
// ==UserScript==
// @name         Newgrounds: Disable Infinite Scroll
// @namespace    861ddd094884eac5bea7a3b12e074f34
// @version      1.6.1
// @description  Disable infinite scroll in favor of restoring page navigation buttons for Newgrounds
// @author       Anonymous, Claude 4.5 Sonnet, GitHub Copilot (Claude 4.5 Haiku, GPT 5-mini Thinking)
// @match        https://www.newgrounds.com/art
// @match        https://www.newgrounds.com/art?*
// @match        https://www.newgrounds.com/art/*
// @exclude      https://www.newgrounds.com/art/view/*
// @match        https://www.newgrounds.com/games
// @match        https://www.newgrounds.com/games?*
// @match        https://www.newgrounds.com/games/*
// @match        https://www.newgrounds.com/movies
// @match        https://www.newgrounds.com/movies?*
// @match        https://www.newgrounds.com/movies/*
// @match        https://www.newgrounds.com/audio
// @match        https://www.newgrounds.com/audio?*
// @match        https://www.newgrounds.com/audio/*
// @exclude      https://www.newgrounds.com/audio/listen/*
// @match        https://www.newgrounds.com/series
// @match        https://www.newgrounds.com/series?*
// @match        https://www.newgrounds.com/series/browse/*
// @match        https://www.newgrounds.com/collections
// @match        https://www.newgrounds.com/collections?*
// @match        https://www.newgrounds.com/collections/browse/*
// @match        https://www.newgrounds.com/playlists
// @match        https://www.newgrounds.com/playlists?*
// @match        https://www.newgrounds.com/playlists/browse/*
// @match        https://www.newgrounds.com/search/*
// @match        https://www.newgrounds.com/collab*
// @match        https://*.newgrounds.com/art
// @match        https://*.newgrounds.com/art?*
// @match        https://*.newgrounds.com/art/tree*
// @match        https://*.newgrounds.com/games
// @match        https://*.newgrounds.com/games?*
// @match        https://*.newgrounds.com/movies
// @match        https://*.newgrounds.com/movies?*
// @match        https://*.newgrounds.com/audio
// @match        https://*.newgrounds.com/audio?*
// @match        https://*.newgrounds.com/audio/tree*
// @match        https://*.newgrounds.com/favorites/*
// @grant        none
// @iconURL      https://greasyfork.s3.us-east-2.amazonaws.com/0m3whdf19wgz78r38ded13q6lucz
// @license      MIT-0
// @homepageURL  https://greasyfork.org/en/scripts/558817-newgrounds-disable-infinite-scroll
// @supportURL   https://greasyfork.org/en/scripts/558817-newgrounds-disable-infinite-scroll/feedback
// @downloadURL https://update.greasyfork.org/scripts/558817/Newgrounds%3A%20Disable%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/558817/Newgrounds%3A%20Disable%20Infinite%20Scroll.meta.js
// ==/UserScript==

//
/// ✔️ FEATURES
//
// Supported pages:
// - category browse/search (movies, games, art, audio)
// - playlists, collections and series browse/search
// - blog and forum search (global and per user)
// - user upload and favorite galleries
// - userbase search
// - collabinator / help wanted
// - artist scout pages
//
// Keyboard shortcuts for page navigation:
//    ┌──────────┬────────────────┐
//    │ Action   │ Key bindings   │
//    ├──────────┼────────────────┤
//    │ Previous │ A, Left Arrow  │
//    │ Next     │ D, Right Arrow │
//    └──────────┴────────────────┘
//

//
/// 📋️ TODO
//
// Enhancements (nice-to-haves):
// - Items that require DOM parsing to get post ID to offset from for next page
//   - Support logged in user feed of favorite artists' uploads
//     https://www.newgrounds.com/social/feeds/show/favorite-artists*
//   - Support Community News pages (user news is natively paginated)
//     https://www.newgrounds.com/news
//     https://www.newgrounds.com/news/*
//
// Bug fixes:
// - If less items than expected are returned in the list, prevent next
//   page buttons from being created and nav events from being executed.
//   If we're on the first page, prevent pagination buttons from being
//   created *at all.*
//
// Outstanding questions:
// - Is there a dedicated 'shared creations' list accessible from a
//   user profile, and if so, can it be supported?
//

//
/// 📜 CHANGELOG
//
// v1.6.1       Improve and refine page support
//              - match additional category pages when they are filtered
//              - exclude item view pages
// v1.6         Enhancements, fixes and cleanup
//              - Update games offset
//              - Support artist scout pages
//              - Consolidate conditionals
//              - Document flow
// v1.5         Enhancements, fixes and cleanup
//              - support collabinator page
//              - fix init loop bug (uncaught reference)
//              - circumvent onclick highjacking by site
//              - improvements to readability, commenting
//              - accidentally several semicolons!! 😱😭
// v1.4.3       Minor improvements; debug logging, readability
// v1.4.2       Various improvements and bug fixes
//              - improvements to readability, logging, commenting
//              - fix browser-native key events being caught
//                  and suppressed (e.g. alt+arrow)
//              - fix pagination elements being duplicated or
//                 missing when the search summary page is involved
//                 in partial page rewrites
//              - fix major bug where browse/search pages weren't detected
// v1.4.1       Readability improvements
// v1.4         Support playlists, collections and series browse categories,
//                as well as those search types.
// v1.3         Support user favorites gallery pages
// v1.2         Support user upload gallery pages
// v1.1         Add navigational keyboard shortcuts
// v1.0         Initial release
//

//
/// 🙇‍♀️ CREDITS
//
// Thanks to 14HourLunchBreak on Newgrounds for the script's icon graphic
// Source:  https://www.newgrounds.com/art/view/14hourlunchbreak/pixel-ng-tank
// License: https://creativecommons.org/licenses/by-nc/3.0/
//

(function() {
    'use strict';

    const DEBUG = true;

    let FIRST_INIT = true;
    let PATH = window.location.pathname;
    let PARAMS = new URLSearchParams(window.location.search);
    const FQDN = window.location.hostname;
    const DOMAIN = FQDN.split('.');

    const pathMap = {
        '/movies': 20,
        '/games': 20,
        '/audio': 30,
        '/art': 28,
    };
    const ITEMS_PER_PAGE = Object.entries(pathMap).find(
        ([str]) => PATH.startsWith(str)
    )?.[1];

    const ENDPOINTS = {
        'media': ['/art', '/games', '/movies', '/audio'],
        'playlists': ['/series', '/collections', '/playlists'],
        'scouts': ['/art/tree', '/audio/tree'],
    }

    let NAVIGATION_TYPE;
    if (isUserPage()
        || PATH.startsWith('/search/conduct')
        || startsWithMany(PATH, ENDPOINTS['playlists'])
        || startsWithMany(PATH, ['/collab', '/art/tree'])
    ) {
        NAVIGATION_TYPE = 'page';
    } else if (startsWithMany(PATH, ENDPOINTS['media'])) {
        NAVIGATION_TYPE = 'offset';
    }

    //////
    // CIRCUMVENTION
    ///////////////////

    // when a user changes search category: the page intercepts the click,
    // an AJAX call fetches the remote source, the DOM is rewriteen, and
    // history is updated. we patch the history update prototype to
    // re-initialize the script, as if we did a fresh page load.
    //   ref: https://stackoverflow.com/a/64927639/2272443
    window.history.pushState = new Proxy(window.history.pushState, {
        apply: (target, thisArg, argArray) => {
            if (DEBUG) console.debug('Intercepted manual history write');

            if (DEBUG) console.debug('Writing manual history event');
            let output = target.apply(thisArg, argArray);
            PATH = window.location.pathname; // refresh state
            PARAMS = new URLSearchParams(window.location.search);

            if (DEBUG) console.debug('Removing pagination elements');
            document.getElementById('ng-pagination')?.remove();

            if (DEBUG) console.debug('Re-initializing userscript');
            init();

            return output;
        },
    });

    function disableInfiniteScroll() {
        let w = window;

        // Aggressively prevent scroll-based loading
        if (FIRST_INIT) {
            w.addEventListener('scroll', function(e) {
                e.stopImmediatePropagation();
            }, true);
        }

        // Circumvent scroll boundary detection
        if (w.ngutils) {
            // Remove event listener
            if (w.ngutils.event) {
                if (DEBUG) console.debug('Remvoing scroll boundry detection\'s event listener')
                w.ngutils.event.removeListener('ngutils.element.whenOnscreen');
            }
            // noop its function just to be sure
            if (DEBUG) console.debug('nooping scroll boundry detection\'s function')
            if (w.ngutils.element && w.ngutils.element.whenOnscreen) {
                w.ngutils.element.whenOnscreen = function() {
                    return;
                };
            }
        }
    }

    //////
    // HELPERS
    /////////////

    // https://stackoverflow.com/a/25937397/2272443
    // https://gist.github.com/zenparsing/5dffde82d9acef19e43c
    function dedent(callSite, ...args) {
        function format(str) {
            let size = -1;
            return str.replace(/\n(\s+)/g, (m, m1) => {
                if (size < 0) size = m1.replace(/\t/g, "    ").length;
                return "\n" + m1.slice(Math.min(m1.length, size));
            });
        }

        if (typeof callSite === "string") return format(callSite);
        if (typeof callSite === "function") {
            return (...args) => format(callSite(...args));
        }

        let output = callSite
            .slice(0, args.length + 1)
            .map((text, i) => (i === 0 ? '' : args[i - 1]) + text)
            .join('');

        return format(output);
    }

    // .startsWith() but accepting an array of strings to check
    function startsWithMany(str, arr) {
        return arr.some(s => str.startsWith(s));
    }

    // Differentiate various user galleries from browse pages
    function isUserPage() {
        return (DOMAIN.length > 2 && !DOMAIN[0].startsWith('www'));
    }

    function styleElement(element, style) {
        for (const [key, value] of Object.entries(style)) {
            element.style[key] = value;
        }; return element;
    }

    //////
    // FUNCTIONS
    ///////////////

    // Parse query string to get current page
    function getCurrentPage() {
        if (DEBUG) console.debug('Trying to discern current page number...');

        let page;
        if (NAVIGATION_TYPE === 'page') {
            page = parseInt(PARAMS.get('page')) || 1;
        } else if (NAVIGATION_TYPE === 'offset') {
            const offset = parseInt(PARAMS.get('offset')) || 0;
            page = Math.floor(offset / ITEMS_PER_PAGE) + 1;
        }

        if (typeof page !== 'number'
            || (isNaN(page) || page < 0)
        ) {
            console.error('Unable to discern current page!');
            return false;
        } else {
            if (DEBUG) console.debug('Current page:', page);
            return page; // is typeof number
        }
    }

    //
    // KEYBOARD SHORTCUT NAVIGATION
    //

    function redirect(source, n) {
        if (NAVIGATION_TYPE === 'page') {
            PARAMS.set('page', n.toString());
        } else if (NAVIGATION_TYPE === 'offset') {
            const offset = (n - 1) * ITEMS_PER_PAGE;
            PARAMS.set('offset', offset.toString());
        }

        const queryString = PARAMS.toString()
        const dest = (queryString)
            ? `${PATH}?${queryString}`
            : PATH;
        if (DEBUG) console.debug(`Navigating via ${source} to`, dest);
        window.location.href = dest;
    }

    // Keybind handlers
    function navigate(direction) {
        if (DEBUG) console.debug('Running keybind navigation logic...');

        const currentPage = getCurrentPage();
        if (!currentPage) return;

        const dest = (direction === 'previous')
            ? (currentPage - 1)
            : (currentPage + 1);
        if (dest < 1) return;

        redirect('keybind', dest);
    }

    document.addEventListener('keydown', function(e) {
        // ignore modifiers
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

        // ignore when input field is focused
        if (e.target.getAttribute('role') === 'search'
            || e.target.tagName === 'INPUT'
            || e.target.tagName === 'TEXTAREA'
        ) {
            if (DEBUG) console.debug('Input field focused; ignoring nav event.');
            return;
        }

        const key = (e.key || '').toLowerCase();
        if (key === 'arrowleft' || key === 'a') {
            if (DEBUG) console.debug('Caught key:', key);
            e.preventDefault();
            navigate('previous');
        } else if (key === 'arrowright' || key === 'd') {
            if (DEBUG) console.debug('Caught key:', key);
            e.preventDefault();
            navigate('next');
        }
    });

    //
    // PAGINATION
    //

    function getLoadMoreElement() {
        let e;
        let d = document;
        if (PATH.startsWith('/search/conduct')
            || PATH.startsWith('/collab')
        ) {
            e = d.querySelector('*[id$="-load-more"]');
        } else if (isUserPage() && PATH.startsWith('/favorites')) {
            e = d.querySelector('*[id^="usersfavoritescomponents-load-more"]');
        } else if (startsWithMany(PATH, ENDPOINTS['scouts'])) {
            e = d.querySelector('div[id^="scroll-"]');
        } else if (startsWithMany(PATH, ENDPOINTS['media'])) {
            e = isUserPage()
                ? d.querySelector('li[id$="_scroll_more"]')
                : d.getElementById('load-more-items');
        } else if (startsWithMany(PATH, ENDPOINTS['playlists'])) {
            e = d.querySelector('li[id^="playlists"]');
        }

        if (DEBUG) {
            if (typeof e !== 'undefined' && e !== null) {
                console.debug('Found "load more" element: ', e);
            } else {
                console.debug('Unable to find "load more" element.');
            }
        }

        return e;
    }

    // Detect insertion point for pagination elements
    function getListContainer() {
        let d = document;
        let listContainer;
        if (DEBUG) console.debug('Looking for pagination insertion point...');
        if (startsWithMany(PATH, ENDPOINTS['scouts'])) {
            listContainer = d.querySelectorAll('div[class="pod"]')[1];
        } else if (startsWithMany(PATH, ENDPOINTS['media'])) {
            if (isUserPage()) {
                listContainer = d.querySelector('div[id$="_browse"]');
            } else {
                listContainer = d.querySelector('div[id^="content-results-"]');
            }
        } else if (PATH.startsWith('/search/conduct')) {
            listContainer = d.querySelector(
                'div[id^="search_results_container_"]'
            );
        } else if (
            (isUserPage() && PATH.startsWith('/favorites'))
            || startsWithMany(PATH, ENDPOINTS['playlists'])
        ) {
            listContainer = d.querySelectorAll('div[class="pod-body"]')[1];
        } else if (PATH.startsWith('/collab')) {
            listContainer = d.querySelector('div[id="collab-index-inner"]');
        }
        return listContainer;
    }

    // Build page number buttons with ellipses separating distant pages
    // Shows 1 2 3 ... x y z where y is the current page
    function paginate(currentPage, btnLimit) {
        const pageSet = new Set();

        const container = document.createElement('div');
        container.id = 'ng-pagination';
        container.style.cssText = dedent
            `text-align: center;
            padding: 20px;
            clear: both;`;

        if (currentPage > 1) {
            const prevBtn = createButton('← Previous', currentPage - 1, {});
            container.appendChild(prevBtn);
        }

        const range = Math.floor(btnLimit / 2);
        for (let i = 1; i <= btnLimit; i++)
            pageSet.add(i);
        for (let i = currentPage - range; i <= currentPage + range; i++)
            if (i >= 1) pageSet.add(i);

        let j = 0;
        const pageArray = Array.from(pageSet).sort((a, b) => a - b);
        for (const page of pageArray) {
            if (page > j + 1) {
                const span = createSpan('⋯', {});
                container.appendChild(span);
            } else if (page === currentPage) {
                const span = createSpan(page.toString(), {});
                container.appendChild(span);
            } else {
                const btn = createButton(page.toString(), page, {});
                container.appendChild(btn);
            }; j = page;
        }

        if (currentPage < Math.max(...pageSet)) {
            const nextBtn = createButton('Next →', currentPage + 1, {});
            container.appendChild(nextBtn);
        }

        return container;
    }

    function createSpan(text, style) {
        let span = document.createElement('span');
        span.textContent = text;
        span.style.margin = '0 5px';
        span.style.color = '#fda238';
        span.style.fontSize = '0.9em';
        span = styleElement(span, style);
        return span;
    }

    function createButton(text, page, style) {
        let btn = document.createElement('button');
        btn.textContent = text;
        btn.dataset.ngPage = page;
        btn.style.cssText = dedent
            `margin: 0 5px;
            padding: 8px 15px;
            cursor: pointer;
            background:
                linear-gradient(
                    to bottom,
                    #34393D 0%,
                    #34393D 60%,
                    #4E575E 70%,
                    #4E575E 100%
                );
            color: #fda238;
            font-weight: bold;`;
        btn = styleElement(btn, style);
        btn.addEventListener('click', handleButtonClick, true);
        return btn;
    }

    function handleButtonClick(e) {
        PARAMS = new URLSearchParams(window.location.search);
        PATH = window.location.pathname;

        // Prevent all propagation and site-dictated behaviors
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        const page = parseInt(e.currentTarget.dataset.ngPage);
        if (DEBUG) console.debug('Button clicked, navigating to page:', page);
        redirect('button', page);
    }

    //
    // MAIN
    //

    function init() {
        if (DEBUG) console.debug('Initializing userscript')

        // Invoke again, in case JS still loading
        disableInfiniteScroll();

        if (DEBUG) console.debug('Searching for "load more" element...');
        getLoadMoreElement()?.remove();

        // Insert pagination elements
        const listContainer = getListContainer();
        if (typeof listContainer !== 'undefined' && listContainer !== null) {
            const currentPage = getCurrentPage();
            if (DEBUG) console.debug('Creating pagination elements...')
            const pagination = paginate(currentPage, 3);
            if (DEBUG) console.debug('Pagination element created: ', pagination);
            // NOTE: implementation detail of Node.insertBefore's referenceNode
            //   says that passing null results in element insertion at the
            //   end of the target node's children.
            // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
            if (DEBUG) console.debug('Inserting pagination elements (after last child of): ', listContainer.parentNode);
            listContainer.parentNode.insertBefore(pagination, null);
        } else if (listContainer === null) {
            console.error('listContainer: ', null);
            return;
        } else if (
            typeof listContainer === 'undefined'
            && document.readyState !== 'complete'
        ) {
            if (DEBUG) {
                console.debug('listContainer: ', undefined);
                console.debug('Page may not be finished loading; retrying...');
            }
            FIRST_INIT = false;
            setTimeout(waitForDOM, 500);
        } else {
            console.error('Unable to find pagination insertion point!');
        }

        FIRST_INIT = false;
    }

    function waitForDOM() {
        // Aggressively try to disable infinite scroll
        if (FIRST_INIT) disableInfiniteScroll();

        // Wait for jQuery/ngutils libraries to be available
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 500);
            });
        } else {
            init();
        }
    }; waitForDOM();
})();
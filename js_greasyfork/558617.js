// ==UserScript==
// @name            booru navigational keybinds
// @namespace       861ddd094884eac5bea7a3b12e074f34
// @version         3.7
// @description     Page navigation keyboard shortcuts for booru-type imageboards such as dervisions of Danbooru/Gelbooru, custom artist portals
// @author          Anonymous, Claude 4.5 Sonnet, GitHub Copilot (Claude 4.5 Haiku)
// @match           https://rule34.xxx/index.php?page=post&s=list*
// @match           https://rule34.xxx/index.php?page=favorites&s=view&id=*
// @match           https://rule34.xxx/index.php?page=comment&s=list*
// @match           https://yande.re/post
// @match           https://yande.re/post?tags=*
// @match           https://yande.re/post?page=*
// @match           https://yande.re/comment*
// @match           https://yande.re/note*
// @match           https://rule34.us/index.php?r=posts/index*
// @match           https://rule34.us/index.php?r=posts%2Findex*
// @exclude         https://rule34.us/index.php?r=posts/view*
// @match           https://rule34.us/index.php?r=favorites/view*
// @match           https://rule34.us/index.php?r=favorites%2Fview*
// @match           https://rule34.us/index.php?r=comments/list*
// @match           https://rule34.us/index.php?r=comments%2Flist*
// @match           https://gelbooru.com/index.php?page=post&s=list*
// @match           https://gelbooru.com/index.php?page=favorites&s=view&id=*
// @match           https://gelbooru.com/index.php?page=comment&s=list*
// @match           https://www.zerochan.net/*
// @exclude         https://www.zerochan.net/pm*
// @exclude         https://www.zerochan.net/moe
// @exclude         https://www.zerochan.net/faq
// @exclude         https://www.zerochan.net/about
// @exclude         https://www.zerochan.net/privacy
// @exclude         https://www.zerochan.net/api
// @exclude         https://www.zerochan.net/upload3
// @exclude         https://www.zerochan.net/forum
// @exclude         https://www.zerochan.net/options*
// @exclude         https://www.zerochan.net/report*
// @match           https://anime-pictures.net/posts?page=*
// @match           https://anime-pictures.net/posts?favorite_by=*
// @match           https://anime-pictures.net/posts?user=*
// @match           https://anime-pictures.net/stars?page=*
// @match           https://konachan.net/post
// @match           https://konachan.net/post?tags=*
// @match           https://konachan.net/post?page=*
// @match           https://konachan.net/comment*
// @match           https://konachan.net/note*
// @match           https://kusowanka.com/
// @match           https://kusowanka.com/?page=*
// @match           https://kusowanka.com/search/*
// @match           https://kusowanka.com/tag*
// @match           https://kusowanka.com/parod*
// @match           https://kusowanka.com/artist*
// @match           https://kusowanka.com/character*
// @match           https://kusowanka.com/metadata*
// @match           https://tbib.org/index.php?page=post&s=list*
// @match           https://tbib.org/index.php?page=favorites&s=view&id=*
// @match           https://*.booru.org/index.php?page=post&s=list*
// @match           https://*.booru.org/index.php?page=favorites&s=view&id=*
// @match           https://*.booru.org/index.php?page=comment&s=list*
// @match           https://safebooru.org/index.php?page=post&s=list*
// @match           https://safebooru.org/index.php?page=favorites&s=view&id=*
// @match           https://safebooru.com/index.php?page=comment&s=list*
// @match           https://xbooru.com/index.php?page=post&s=list*
// @match           https://xbooru.com/index.php?page=favorites&s=view&id=*
// @match           https://xbooru.com/index.php?page=comment&s=list*
// @match           https://realbooru.com/index.php?page=post&s=list*
// @match           https://realbooru.com/index.php?page=favorites&s=view&id=*
// @match           https://realbooru.com/index.php?page=comment&s=list*
// @match           https://derpibooru.org/*
// @exclude         https://derpibooru.org/conversations*
// @exclude         https://derpibooru.org/profiles/*/reports*
// @exclude         https://derpibooru.org/filters
// @exclude         https://derpibooru.org/settings*
// @exclude         https://derpibooru.org/*/new
// @exclude         https://derpibooru.org/pages/*
// @exclude         https://derpibooru.org/staff
// @match           https://twibooru.org/*
// @exclude         https://twibooru.org/conversations*
// @exclude         https://twiibooru.org/profiles/*/reports*
// @exclude         https://twibooru.org/filters
// @exclude         https://twibooru.org/settings*
// @exclude         https://twibooru.org/*/new
// @exclude         https://twibooru.org/pages/*
// @exclude         https://twibooru.org/staff
// @match           https://manebooru.art/*
// @exclude         https://manebooru.art/conversations*
// @exclude         https://manebooru.art/profiles/*/reports*
// @exclude         https://manebooru.art/filters
// @exclude         https://manebooru.art/settings*
// @exclude         https://manebooru.art/*/new
// @exclude         https://manebooru.art/pages/*
// @exclude         https://manebooru.art/staff
// @match           http://browse.minitokyo.net/gallery*
// @match           http://gallery.minitokyo.net/*
// @match           https://inkbunny.net/submissionsviewall.php*
// @match           https://inkbunny.net/usersviewall.php*
// @match           https://inkbunny.net/gallery/*
// @match           https://inkbunny.net/scraps/*
// @match           https://hypnohub.net/index.php?page=post&s=list*
// @match           https://hypnohub.net/index.php?page=favorites&s=view&id=*
// @match           https://hypnohub.net/index.php?page=comment&s=list*
// @match           https://booru.eu/post/list*
// @match           https://booru.eu/comment/list*
// @match           https://rule34vault.com/*
// @exclude         https://rule34vault.com/trends*
// @exclude         https://rule34vault.com/comments*
// @exclude         https://rule34vault.com/u/*?tab=subs
// @exclude         https://rule34vault.com/u/*?tab=comments
// @exclude         https://rule34vault.com/account*
// @exclude         https://rule34vault.com/post/*
// @exclude         https://rule34vault.com/dmca
// @exclude         https://rule34vault.com/terms
// @exclude         https://rule34vault.com/contact-us
// @exclude         https://rule34vault.com/upgrade-to-premium
// @match           https://rule34.xyz/*
// @exclude         https://rule34.xyz/trends*
// @exclude         https://rule34.xyz/comments*
// @exclude         https://rule34.xyz/u/*?tab=subs
// @exclude         https://rule34.xyz/u/*?tab=comments
// @exclude         https://rule34.xyz/account*
// @exclude         https://rule34.xyz/post/*
// @exclude         https://rule34.xyz/dmca
// @exclude         https://rule34.xyz/terms
// @exclude         https://rule34.xyz/contact-us
// @exclude         https://rule34.xyz/upgrade-to-premium
// @match           https://rule34.world/*
// @exclude         https://rule34.world/trends*
// @exclude         https://rule34.world/comments*
// @exclude         https://rule34.world/u/*?tab=subs
// @exclude         https://rule34.world/u/*?tab=comments
// @exclude         https://rule34.world/account*
// @exclude         https://rule34.world/post/*
// @exclude         https://rule34.world/dmca
// @exclude         https://rule34.world/terms
// @exclude         https://rule34.world/contact-us
// @exclude         https://rule34.world/upgrade-to-premium
// @match           https://furry34.com/*
// @exclude         https://furry34.com/trends*
// @exclude         https://furry34.com/comments*
// @exclude         https://furry34.com/u/*?tab=subs
// @exclude         https://furry34.com/u/*?tab=comments
// @exclude         https://furry34.com/account*
// @exclude         https://furry34.com/post/*
// @exclude         https://furry34.com/dmca
// @exclude         https://furry34.com/terms
// @exclude         https://furry34.com/contact-us
// @exclude         https://furry34.com/upgrade-to-premium
// @match           https://www.hentai-foundry.com/categories/*/pictures*
// @match           https://www.hentai-foundry.com/pictures/recent*
// @match           https://www.hentai-foundry.com/pictures/featured*
// @match           https://www.hentai-foundry.com/pictures/popular*
// @match           https://www.hentai-foundry.com/pictures/random*
// @match           https://www.hentai-foundry.com/pictures/user/*
// @match           https://www.hentai-foundry.com/pictures/tagged/*
// @match           https://shimmie.shishnet.org/post/list*
// @match           https://shimmie.shishnet.org/comment/list*
// @match           https://furbooru.org/*
// @exclude         https://furbooru.org/conversations*
// @exclude         https://furbooru.org/profiles/*/reports*
// @exclude         https://furbooru.org/filters
// @exclude         https://furbooru.org/settings*
// @exclude         https://furbooru.org/*/new
// @exclude         https://furbooru.org/pages/*
// @exclude         https://furbooru.org/staff
// @match           https://e-shuushuu.net/
// @match           https://e-shuushuu.net/?page=*
// @match           https://e-shuushuu.net/search/results/*
// @match           https://e-shuushuu.net/top.php*
// @grant           none
// @homepageURL     https://greasyfork.org/en/scripts/558617-booru-keybinds
// @supportURL      https://greasyfork.org/en/scripts/558617-booru-keybinds/feedback
// @license         MIT-0
// @downloadURL https://update.greasyfork.org/scripts/558617/booru%20navigational%20keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/558617/booru%20navigational%20keybinds.meta.js
// ==/UserScript==

//
// FEATURES
// - Keyboard shortcuts:
//   - Use A/D or left/right arrow keys to navigate through pages instead of clicking buttons!
//   - Use W/S or up/down arrow keys for navigating through history.
// - Page types supported:
//   - Minimally works with browse and search page types across all supported sites.
//   - Extended page type support is spotty and may include user uploads/favorites and more.
//

//
// IMPLEMENTATION NOTES
// - tbib.org has no global comments list and doesn't seem to be derived from gelbooru
//   software anymore, despite diverging from the booru.org network.
//

//
// CHANGELOG
// v3.7         Enhancements and fixes
//              - Add site support for e-shuushuu.net
//              - Add site support for furbooru.org (another philomena instance)
//              - Fix site support for domains that have multi-part TLDs
// v3.6         Enhancements and fixes
//              - Add site support for shimmie testbed (for testing of latest shimmie2 code)
//              - Add page support for recent comments list on rule34.xxx, Gelbooru- and Danbooru-based sites
//              - Add page support for recent notes list on Danbooru-based sites (yande.re, kondachan.net)
//              - Add page support for booru-on-rails(-like) instances' activity listing (same as posts)
//              - Exclude additional pages for booru-on-rails(-like) instances
//              - Fix InkBunny search
//              - Fix frontpage kusowanka.com navigation
// v3.5.1       Enhancements
//              - Support InkBunny pages for user scraps
//              - Support W/S or up/down arrow keys for navigating through history
// v3.5         Support new sites and fix bugs
//              - Add support for hentai-foundry.com
//              - Fix zerochan navigation from frontpage
// v3.4.1       Various bugfixes
//              - Fix rule34vault.com and furry34.com support
//              - Fix rule34.us user favorites page nagivation
//              - Fix navigation for anime-pictures.net
//              - Optimize code with shorthand
// v3.4         Add A/D navigational keybind alternatives for 60% keyboard users
// v3.3         Add support for rule34vault.com, rule34.xyz, rule34.world, furry34.com
// v3.2         Various improvements
//              - Convert remaining URIs matched by regex to globular
//              - Add support for InkBunny user gallery pages
//              - Fix browser-native key events being caught and suppressed (e.g. alt+arrow)
// v3.1         Various improvements
//              - Auto-detect sites running booru-on-rails and derivatives
//              - Move to globular URI matching for more sites
//              - Support more pages across already supported sites
//              - Add in-code URI evaluation for enhanced exclusion logic e.g. zerochan post pages
// v3.0.1       Bugfixes, and improvements to Minitokyo handling
// v3.0         Add support for booru.eu
// v2.6         Add support for minitokyo.net, inkbunny.net, and hypnohub.net
// v2.4         Add support for derpibooru.org, twibooru.org, and manebooru.art
// v2.3         Add support for tbib.org, safebooru.org, xbooru.com, realbooru.com, and booru.org
// v2.2         Add support for zerochan.net, anime-pictures.net, konachan.net, and kusomanka.com
// v2.1         Add support for rule34.us and gelbooru.com
// v2.0         Add support for yande.re
// v1.0         Initial release with support for rule34.xxx
//

//
// TODO
// - Functional enhancements
//   - Support FurAffinity.net
//     (something weird going on where using gallery pagination buttons
//      break our keybinds. also, requires implementaiton of alternates
//      for route site types)
//   - Support luscious.net
//     (when infinite scroll is disabled)
//   - Support rule34.dev
//   - Support weasyl.com
//     (requires reading DOM to update cursor/ID offset)
//   - Support thehentaiworld.com
//     (something weird going on where our keybinds navigate to posts)
//   - Support W/D keybinds for sites that natively implement arrow keys
//     - rule34hentai.net
//     - kemono.cr
//     - rule34.paheal.net
//     - nozomi.la
//       (requires JS call to key_typed_in_body() for search page nav)
// - Nice-to-haves
//   - Add 'last page' detection
//   - Briefly change the cursor to visually indicate when a requested nav
//     event fails or is rejected
// - Refinement and refactoring
//   - Rewrite 'gallery' page type into abstraction supporting multiple page
//     route exceptions similar to PAGE_PATHS, but for path index instead of
//     page minimum.
//   - Refactor getAlternateMinimum() to return default site minimum.
//   - zerochan and Hentai-Foundry post pages ought to be excluded
//     https://www.zerochan.net/[1-9][0-9]+
//     https://www.hentai-foundry.com/pictures/user/USERNAME/POST_NUMBER/POST_TITLE
// - Testing
//   - Disable "Booru Hotkeys" Firefox extension and check the full list of
//     presently planned & supported sites to see which *really* do support
//     primary and alternate nav keybinds

(function() {
    'use strict';

    const DEBUG = false;

    // for domains that use page numbers in an url parameter
    // { domain: [parameter, first page] }
    const PAGE_DOMAINS = {
        'yande.re': ['page', 1],
        'rule34.us': ['page', 1],
        'zerochan.net': ['p', 1],
        'anime-pictures.net': ['page', 0],
        'konachan.net': ['page', 1],
        'kusowanka.com': ['page', 1],
        'derpibooru.org': ['page', 1],
        'twibooru.org': ['page', 1],
        'manebooru.art': ['page', 1],
        'minitokyo.net': ['page', 1],
        'inkbunny.net': ['page', 1],
        'rule34vault.com': ['page', 1],
        'rule34.xyz': ['page', 1],
        'rule34.world': ['page', 1],
        'furry34.com': ['page', 1],
        'furbooru.org': ['page', 1],
        'e-shuushuu.net': ['page', 1],
    };
    // path exceptions to the site minimums above
    // { domain: [ [{ param key: param value }, minimum page # ], ... ]}
    const PAGE_PATHS = {
        'rule34.us': [
            [{ 'r': 'favorites/view' }, 0],
            [{ 'r': 'comments/list' }, 0],
        ]
    }
    // for domains that put item count in an url parameter
    // { domain: items per page }
    const PID_DOMAINS = {
        'rule34.xxx': 42,
        'gelbooru.com': 42,
        'tbib.org': 42,
        'booru.org': 20,
        'safebooru.org': 42,
        'xbooru.com': 42,
        'realbooru.com': 42,
        'hypnohub.net': 42,
    };
    // offset exceptions to the site minimums above
    // { domain: [{ param key: param value, ... }, items per page ]}
    const ALT_OFFSETS = {
        'rule34.xxx': [[{ 'page': 'comment', 's': 'list' }, 15]],
        'hypnohub.net': [[{ 'page': 'comment', 's': 'list' }, 10]],
        'safebooru.org': [[{ 'page': 'comment', 's': 'list' }, 10]],
        'xbooru.com': [[{ 'page': 'comment', 's': 'list' }, 10]],
        'realbooru.com': [[{ 'page': 'comment', 's': 'list' }, 10]],
        'gelbooru.com': [[{ 'page': 'comment', 's': 'list' }, 10]],
        'booru.org': [[{ 'page': 'comment', 's': 'list' }, 15]],
    }

    // for domains that put page count in a route (such as shimmie)
    // { domain: [minimum page, indexed page position, page param name] }
    const ROUTE_DOMAINS = {
        'booru.eu': [1, -1, ''],
        'hentai-foundry.com': [1, -1, 'page'],
        'shishnet.org': [1, -1, ''],
    }

    /// fallback hardcoding for if autodetection of site software fails
    // booru-on-rails and derivatives (philomena)
    const BOR_SITES = [
        'derpibooru.org',
        'twibooru.org',
        'manebooru.art',
        'furbooru.org',
    ];
    // rule34.world operations
    const R34WORLD_SITES = [
        'rule34vault.com',
        'rule34.xyz',
        'rule34.world'
    ];

    let PATH = window.location.pathname;
    let PARAMS = new URLSearchParams(window.location.search);
    const FQDN = window.location.hostname;
    let DOMAIN = FQDN;
    const domain_parts = FQDN.split('.');
    if (domain_parts.length >= 3 && domain_parts[0] === 'www') {
        DOMAIN = (
            domain_parts[domain_parts.length - 2]
            + '.' + domain_parts[domain_parts.length - 1]
        );
    }

    // .startsWith() but accepting an array of strings to check
    function startsWithMany(str, arr) {
        return arr.some(s => str.startsWith(s));
    }

    function detectPaginationType() {
        if (DOMAIN === 'inkbunny.net'
            && startsWithMany(PATH, ['/gallery/', '/scraps/'])
        ) {
            return 'gallery';
        } else if (DOMAIN in PID_DOMAINS) {
            return 'pid';
        } else if (DOMAIN in PAGE_DOMAINS) {
            return 'page';
        } else if (DOMAIN in ROUTE_DOMAINS) {
            return 'route';
        }
        return null;
    }

    function isPathExcluded() {
        // in place of using regex for a host match exclusion,
        // ^https:\/\/www\.zerochan\.net\/[1-9][0-9]+
        if (DOMAIN === 'zerochan.net'
            && PATH.substring(1)
            && !isNaN(parseInt(PATH.substring(1)))
        ) {
            return true;
        }
        return false;
    }

    function getAlternateMinimum(config, site) {
        if (!(site in config)) return null;

        let response = null;

        // test each set of param combinations to alternates
        for (const element of config[site]) {
            const params = element[0];
            var isCompleteMatch = true;
            // test each set of param key-value pairs
            for (const [key, value] of Object.entries(element[0])) {
                if (!PARAMS.has(key) || PARAMS.get(key) !== value) {
                    isCompleteMatch = false;
                    break;
                }
            }

            if (!isCompleteMatch) {
                // if all sets fail, continue to next proposed alternate
                continue;
            } else {
                // otherwise, bubble up the alternate
                response = element[1];
                break;
            }
        }

        // no test needed since default is null
        return response;
    }

    function getCurrentPage(type) {
        if (type === 'pid') {
            // assume parameter is named 'pid' and first item is 0
            return parseInt(PARAMS.get(type)) || 0;
        } else if (type === 'page') {
            // retrieve parameter name from configuration
            // if no such param was passed, return known first page for domain
            const alternateMin = getAlternateMinimum(PAGE_PATHS, DOMAIN);
            const defaultMin = (alternateMin !== null )
                ? alternateMin : PAGE_DOMAINS[DOMAIN][1];
            return parseInt(
                PARAMS.get(PAGE_DOMAINS[DOMAIN][0])
            ) || defaultMin;
        } else if (type === 'route') {
            let pathParts = PATH.split('/');
            const defaultMin = ROUTE_DOMAINS[DOMAIN][0];
            const pathOffset = ROUTE_DOMAINS[DOMAIN][1];
            let pathIndex = (pathOffset < 0)
                ? pathParts.length + pathOffset
                : pathOffset;
            const current = parseInt(pathParts[pathIndex]);
            if (isNaN(current)) {
                return defaultMin;
            } else {
                return current;
            }
        } else if (type === 'gallery') {
            // special snowflake inkbunny puts its page number at position -2
            // e.x. /pageName/USERNAME/PAGE/HASH
            let pathParts = PATH.split('/');
            return parseInt(
                pathParts[pathParts.length - 2]
            ) || PAGE_DOMAINS[DOMAIN][1];
        }
    }

    function calculatePreviousPage(type, current, pageLength) {
        if (type === 'pid') {
            if (current > 0) {
                return Math.max(0, current - pageLength);
            } else {
                if (DEBUG) console.debug(`(current=${current}) <= 0`);
                return false;
            }
        } else if (type === 'page') {
            const alternateMin = getAlternateMinimum(PAGE_PATHS, DOMAIN);
            const minPage = (alternateMin !== null)
                ? alternateMin : PAGE_DOMAINS[DOMAIN][1];
            if (current > minPage) {
                return (current - 1);
            } else {
                if (DEBUG) console.debug(`(current=${current}) <= (minPage=${minPage})`);
                return false;
            }
        } else if (['route', 'gallery'].includes(type)) {
            // TODO: check ROUTE_DOMAINS
            if (current > 1) {
                return (current - 1);
            } else {
                if (DEBUG) console.debug(`(current=${current}) <= 1`);
                return false;
            }
        }
    }

    function calculateNextPage(type, current, pageLength) {
        if (type === 'pid') {
            if (DEBUG) console.debug(`nextPage = ${current} + ${pageLength}`);
            return (current + pageLength);
        } else if (['page', 'route', 'gallery'].includes(type)) {
            if (DEBUG) console.debug(`nextPage = ${current} + 1`);
            return (current + 1);
        }
    }

    function updateQuery(type, dest) {
        const pageNo = dest.toString();
        if (type === 'pid') {
            // assume parameter is named 'pid'
            PARAMS.set(type, pageNo);
        } else if (type === 'page') {
            const pageKey = PAGE_DOMAINS[DOMAIN][0];
            PARAMS.set(pageKey, pageNo);
        } else if (type === 'route') {
            let pathParts = PATH.split('/');
            const pathOffset = ROUTE_DOMAINS[DOMAIN][1];
            let pathIndex = (pathOffset < 0)
                ? pathParts.length + pathOffset
                : pathOffset;
            if (!isNaN(parseInt(pathParts[pathIndex]))) {
                pathParts[pathIndex] = pageNo;
            } else {
                if (pathParts[pathIndex] === '') pathParts.pop();
                const pageRouteName = ROUTE_DOMAINS[DOMAIN][2];
                if (pageRouteName) pathParts.push(pageRouteName);
                pathParts.push(pageNo);
            }
            PATH = pathParts.join('/');
        } else if (type === 'gallery') {
            // for /pageName/USERNAME/PAGE/HASH, replace PAGE at position -2
            let pathParts = PATH.split('/');
            pathParts[pathParts.length - 2] = pageNo;
            PATH = pathParts.join('/');
        }
        return true;
    }

    function reformatUri() {
        // redirect booru-on-rails frontpage to listing page on navigation
        const footer = document.querySelector('#serving_info');
        if (((typeof BOR_SITES === 'object'
                && BOR_SITES.includes(DOMAIN))
            || (footer !== null
                && footer.tagName === 'DIV'
                && (footer.textContent.includes('booru-on-rails')
                    || footer.textContent.includes('philomena'))))
            && (PATH === '/' || PATH.startsWith('/activity'))
        ) PATH = (DOMAIN == 'twibooru.org') ? '/posts' : '/images';

        // remove unsupported query string parameters
        // that break navigation when we alter the page param
        if ((typeof R34WORLD_SITES === 'object'
                && R34WORLD_SITES.includes(DOMAIN))
            && PARAMS.has('cursor')
        ) PARAMS.delete('cursor');

        // if there are parameters and we've modified them,
        // reconstruct the search string
        return (PARAMS.size)
            ? [PATH, PARAMS.toString()]
            : [PATH, ''];
    }

    function navigate(type, direction) {
        PATH = window.location.pathname;
        PARAMS = new URLSearchParams(window.location.search);

        let current = null;
        current = getCurrentPage(type);
        if (DEBUG) console.debug(`currentPage = ${current}`);

        let offset = null;
        if (type === 'pid') {
            const alternate = getAlternateMinimum(ALT_OFFSETS, DOMAIN);
            offset = (alternate !== null)
                ? alternate : PID_DOMAINS[DOMAIN];
            if (DEBUG) console.debug(`offset = ${offset}`);
        }

        let dest = null;
        if (direction === 'previous') {
            dest = calculatePreviousPage(type, current, offset);
        } else if (direction === 'next') {
            dest = calculateNextPage(type, current, offset);
        }
        // test specifically for false (0 is a valid page number!!)
        if (dest !== 0 && !dest) return false;
        if (DEBUG) console.debug(`dest = ${dest}`);

        updateQuery(type, dest);
        const newTrail = reformatUri().join('?');
        window.location.href = window.location.origin + newTrail;
        return true;
    }

    // function isKeybindExcluded(key) {
    //     if ((['gelbooru.com', 'booru.org'].includes(DOMAIN))
    //         && (key == 'a' || key == 'd')
    //     ) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    const SITE_TYPE = detectPaginationType();

    document.addEventListener('keydown', function(e) {
        // don't trigger on modifier combinations
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

        // don't trigger when an input field has focus
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)
            || e.target.getAttribute('role') == 'search' // zerochan
        ) return;

        // don't trigger on sites that partially implement our bindings
        // NOTE: native navigation via these keybinds is broken XD
        // if (isKeybindExcluded(e.key.toLowerCase())) return;

        let response;
        const key = (e.key || '').toLowerCase();
        if (key === 'arrowleft' || key === 'a') {
            e.preventDefault();
            response = navigate(SITE_TYPE, 'previous');
        } else if (key === 'arrowright' || key === 'd') {
            e.preventDefault();
            response = navigate(SITE_TYPE, 'next');
        } else if (key === 'arrowup' || key === 'w') {
            e.preventDefault();
            history.back();
        } else if (key === 'arrowdown' || key === 's') {
            e.preventDefault();
            history.forward();
        }

        if (typeof response === 'undefined' || !response) {
            console.error(
                'booru navigational keybinds: Keybind caught, but '
                + 'failed to navigate!'
            );
        }
    });

    if (isPathExcluded()) return false;

    if (!SITE_TYPE) {
        console.error('booru navigational keybinds: Failed to initialize!');
        return false;
    } else {
        console.log(
            `booru navigational keybinds loaded (in ${SITE_TYPE} mode): `
            + 'Use ← → arrow keys to navigate gallery pages.'
        );
    }
})();
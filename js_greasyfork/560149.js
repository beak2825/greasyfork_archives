// ==UserScript==
// @name         Redirect Medium Anywhere to scribe.rip
// @version      0.6
// @author       abd3lraouf
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace    https://github.com/abd3lraouf
// @description  Auto-redirect Medium articles (not homepages) to scribe.rip
// @homepageURL  https://github.com/abd3lraouf/medium-to-scribe
// @supportURL   https://github.com/abd3lraouf/medium-to-scribe/issues
// @downloadURL https://update.greasyfork.org/scripts/560149/Redirect%20Medium%20Anywhere%20to%20scriberip.user.js
// @updateURL https://update.greasyfork.org/scripts/560149/Redirect%20Medium%20Anywhere%20to%20scriberip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIBE_HOST = 'scribe.rip';
    const OBSERVER_TIMEOUT_MS = 5000;

    // Already on scribe.rip, nothing to do
    if (location.hostname === SCRIBE_HOST) return;

    // Non-article path patterns to skip
    const NON_ARTICLE_PATTERNS = [
        /^\/tagged\//,
        /^\/search/,
        /^\/me\//,
        /^\/@[\w-]+\/?$/,  // Author profile pages (not their articles)
        /^\/archive/,
        /^\/latest/,
        /^\/popular/,
        /^\/topics/,
        /^\/membership/,
        /^\/plans/,
        /^\/about/,
        /^\/collections\//,
        /^\/tag\//,
    ];

    // Medium fingerprints in page HTML
    const MEDIUM_FINGERPRINTS = [
        '__GRAPHQL_URI__',
        '"publisher":{"@id":"https://medium.com/"',
        '"@id":"https://medium.com/#publisher"',
    ];

    /**
     * Check if current URL path looks like a Medium article
     */
    function isArticlePath() {
        const path = location.pathname;

        // Skip root/homepage
        if (path === '/' || path === '') return false;

        // Skip known non-article paths
        if (NON_ARTICLE_PATTERNS.some(pattern => pattern.test(path))) return false;

        const slug = path.split('/').pop();

        // Medium articles end with 10-12 char hex ID (e.g., -8d0b952e2853)
        const hasArticleId = /[a-f0-9]{10,12}$/i.test(slug);

        // Fallback: long slugs are likely articles
        const hasLongSlug = slug.length > 20;

        return hasArticleId || hasLongSlug;
    }

    /**
     * Check if page HTML contains Medium fingerprints
     */
    function isMediumPage(html) {
        return MEDIUM_FINGERPRINTS.some(fp => html.includes(fp));
    }

    /**
     * Redirect to scribe.rip equivalent URL
     */
    function redirectToScribe() {
        const scribeUrl = `https://${SCRIBE_HOST}${location.pathname}${location.search}${location.hash}`;
        location.replace(scribeUrl);
    }

    // Early exit if path doesn't look like an article
    if (!isArticlePath()) return;

    let redirected = false;

    const observer = new MutationObserver(() => {
        if (redirected) return;

        if (isMediumPage(document.documentElement.innerHTML)) {
            redirected = true;
            observer.disconnect();
            redirectToScribe();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // Stop observing after timeout to avoid resource waste on non-Medium sites
    setTimeout(() => {
        if (!redirected) {
            observer.disconnect();
        }
    }, OBSERVER_TIMEOUT_MS);
})();

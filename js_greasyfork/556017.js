// ==UserScript==
// @name		Netflix Tile Fix
// @namespace	http://tampermonkey.net/
// @version     0.92
// @description Open Netflix's non-link tiles in new tabs with "title" URLs instead of "watch" on middle click, ignoring regular links.
// @author      Murat Malatya
// @match		https://www.netflix.com/*
// @grant		none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556017/Netflix%20Tile%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/556017/Netflix%20Tile%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractNetflixId(element) {
        const allElements = [element, ...element.querySelectorAll('*')];
        for (const el of allElements) {
            const ctx = el.getAttribute('data-ui-tracking-context');
            if (ctx) {
                try {
                    const parsed = JSON.parse(decodeURIComponent(ctx));
                    if (parsed.video_id) {
                        return parsed.video_id;
                    }
                }
                catch (e) {
                }
            }
        }
        return null;
    }

    function isNetflixRecommendation(element) {
        if (element.closest('.ptrack-content')) {
            return true;
        }
        return false;
    }

    function handleMouseDown(event) {
        if (event.button !== 1) {
            return;
        }

        const target = event.target;
        let element = target;
        let maxDepth = 10;

        while (element && maxDepth > 0) {
            if (element.tagName === 'A' && element.href) {
                return;
            }

            if (isNetflixRecommendation(element)) {
                const netflixId = extractNetflixId(element);
                if (netflixId) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    const titleUrl = `https://www.netflix.com/title/${netflixId}`;
                    window.open(titleUrl, '_blank');
                    return;
                }
            }

            element = element.parentElement;
            maxDepth--;
        }
    }

    document.addEventListener('mousedown', handleMouseDown, {
        capture: true,
        passive: false
    });
})();
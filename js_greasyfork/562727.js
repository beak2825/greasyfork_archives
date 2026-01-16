// ==UserScript==
// @name         Reddit Link Onion Replacer
// @description  Replace all reddit links with equivalent onions to avoid blocks.
// @namespace    ashfbiabef
// @license      MIT
// @version      1.1
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562727/Reddit%20Link%20Onion%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/562727/Reddit%20Link%20Onion%20Replacer.meta.js
// ==/UserScript==

const oldRedditUrl = 'https://old.reddittorjg6rue252oqsxryoxengawnmo46qy4kyii5wtqnwfj4ooad.onion/';
const redditRegex = /^https?:\/\/(www\.)?reddit.com\//;

new MutationObserver(() => {
    document.querySelectorAll('a[href*="reddit.com"]').forEach((e) => {
        const href = e.getAttribute('href');
        if (href && href.match(redditRegex)) {
            e.setAttribute('href', href.replace(redditRegex, oldRedditUrl));
        }
    });
}).observe(document, { childList: true, subtree: true, attributeFilter: ["href"] });

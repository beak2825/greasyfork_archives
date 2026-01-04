// ==UserScript==
// @name         Hide AI-Generated Posts (MyReadingManga)
// @namespace    r.arvie
// @version      1.2
// @description  Hides AI-generated posts on MyReadingManga
// @match        https://myreadingmanga.info/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555363/Hide%20AI-Generated%20Posts%20%28MyReadingManga%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555363/Hide%20AI-Generated%20Posts%20%28MyReadingManga%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAIGeneratedPosts() {
        document.querySelectorAll('article').forEach(article => {
            if (article.className.includes('tag-ai-generate')) {
                article.style.display = 'none';
            }
        });
    }

    hideAIGeneratedPosts();

    const observer = new MutationObserver(hideAIGeneratedPosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();

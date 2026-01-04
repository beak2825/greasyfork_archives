// ==UserScript==
// @name         Remove Medium member-only stories
// @namespace    dev.263
// @version      1.0.0
// @description  Removes Medium stories that are marked as "Member-only" from the homepage and other listing pages.
// @author       Bastian Bräu
// @match        https://medium.com/*
// @grant        none
// @license      ISC
// @homepageURL  https://github.com/b263/user-scripts
// @supportURL   https://github.com/b263/user-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/559839/Remove%20Medium%20member-only%20stories.user.js
// @updateURL https://update.greasyfork.org/scripts/559839/Remove%20Medium%20member-only%20stories.meta.js
// ==/UserScript==

function run() {
  document.querySelectorAll('article').forEach(article => {
    if (article.innerText.includes('Member-only')) {
      article.parentNode.removeChild(article);
    }
  });
}

setInterval(run, 500);

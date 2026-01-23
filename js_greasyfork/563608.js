// ==UserScript==
// @name         Azure DevOps PR Title Cleaner
// @namespace    https://greasyfork.org/users/1548493-aleksa-jankovic
// @version      1.0.0
// @description  Simplify Azure DevOps PR tab titles to "PR: <title>"
// @author       AleksaJankovic
// @license      MIT
// @match        https://*.visualstudio.com/*/_git/*/pullrequest/*
// @match        https://dev.azure.com/*/*/_git/*/pullrequest/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563608/Azure%20DevOps%20PR%20Title%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/563608/Azure%20DevOps%20PR%20Title%20Cleaner.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PR_TITLE_REGEX = /^Pull request\s+\d+\s*:\s*(.+)$/i;

  function rewriteTitle() {
    const current = document.title;
    const match = current.match(PR_TITLE_REGEX);

    if (match && match[1]) {
      const newTitle = `PR: ${match[1].trim()}`;
      if (document.title !== newTitle) {
        document.title = newTitle;
      }
    }
  }

  // Initial attempt
  rewriteTitle();

  // Azure DevOps updates title dynamically, so observe changes
  const observer = new MutationObserver(rewriteTitle);
  observer.observe(document.querySelector('title'), {
    childList: true,
  });
})();
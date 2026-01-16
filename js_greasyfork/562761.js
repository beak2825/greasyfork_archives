// ==UserScript==
// @name         Inkbunny Remove Blocked Submissions
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically hides and removes blocked submissions from your view on Inkbunny.
// @author       PoofiPamps
// @license      MIT
// @match        https://inkbunny.net/*
// @match        https://*.inkbunny.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562761/Inkbunny%20Remove%20Blocked%20Submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/562761/Inkbunny%20Remove%20Blocked%20Submissions.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SUBMISSION_SELECTOR = [
    'div[class*="widget_thumbnailHugeCompleteFromSubmission"]',
    'div[class*="widget_thumbnailLargeCompleteFromSubmission"]',
    'div[class*="widget_thumbnailCompleteFromSubmission"]',
  ].join(", ");

  function removeBlockedSubmissions() {
    const blockedIndicators = document.querySelectorAll(
      'div.content div[title="Blocked"]'
    );

    blockedIndicators.forEach((blocked) => {
      const submission = blocked.closest(SUBMISSION_SELECTOR);
      if (submission && submission.parentNode) {
        submission.parentNode.removeChild(submission);
      }
    });
  }

  removeBlockedSubmissions();

  const observer = new MutationObserver(removeBlockedSubmissions);
  observer.observe(document.body, { childList: true, subtree: true });
})();
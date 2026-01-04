// ==UserScript==
// @name         HelloInterview – Expand All Collapsed Sections
// @namespace    https://greasyfork.org/users/1548493-aleksa-jankovic
// @version      1.0.0
// @description  Automatically expands all collapsed sections on HelloInterview system design pages, including Material UI accordions and "Show More" buttons, so the full content is visible for reading or printing to PDF.
// @author       AleksaJankovic
// @license      MIT
// @match        https://www.hellointerview.com/learn/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559024/HelloInterview%20%E2%80%93%20Expand%20All%20Collapsed%20Sections.user.js
// @updateURL https://update.greasyfork.org/scripts/559024/HelloInterview%20%E2%80%93%20Expand%20All%20Collapsed%20Sections.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Expands all Material UI accordion sections that are currently collapsed.
   */
  function expandAccordions() {
    const accordionSummaries = document.querySelectorAll(
      '[class*="MuiAccordionSummary-root"]'
    );

    accordionSummaries.forEach(summary => {
      if (summary.getAttribute('aria-expanded') === 'false') {
        summary.click();
      }
    });
  }

  /**
   * Clicks all visible "Show More" buttons or links.
   */
  function expandShowMoreButtons() {
    const possibleButtons = Array.from(
      document.querySelectorAll('button, a, div')
    );

    possibleButtons
      .filter(element =>
        /show more/i.test(element.textContent.trim())
      )
      .forEach(button => {
        button.click();
      });
  }

  /**
   * Runs all expansion logic.
   * Executed multiple times to account for dynamically loaded content.
   */
  function expandAllContent() {
    expandAccordions();
    expandShowMoreButtons();
  }

  // Initial run after page load
  setTimeout(expandAllContent, 500);

  // Second run to catch dynamically rendered sections
  setTimeout(expandAllContent, 1500);
})();

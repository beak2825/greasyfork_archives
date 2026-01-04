// ==UserScript==
// @name         Kommo Auto-Expand Service Messages
// @namespace    https://greasyfork.org/en/users/1551447-halvedradargrid
// @version      1.1
// @description  Automatically expands collapsed service message blocks (field changes, bot actions, status updates) in Kommo CRM lead detail pages so you can see full activity history without manual clicking
// @author       HalvedRadarGrid with Claude Code
// @license      MIT
// @match        https://*.kommo.com/leads/detail/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559924/Kommo%20Auto-Expand%20Service%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/559924/Kommo%20Auto-Expand%20Service%20Messages.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to expand all collapsed service messages
  function expandAllServiceMessages() {
    const expandLinks = document.querySelectorAll('.js-grouped-expand');
    let expandedCount = 0;

    expandLinks.forEach(link => {
      link.click();
      expandedCount++;
    });

    if (expandedCount > 0) {
      console.log(`[Kommo Auto-Expand] Expanded ${expandedCount} service message(s)`);
    }

    return expandedCount;
  }

  // Wait for initial page load, then expand
  setTimeout(expandAllServiceMessages, 1500);

  // Monitor for dynamically loaded conversation entries
  const observerOptions = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  };

  const observer = new MutationObserver((mutations) => {
    clearTimeout(window.kommoExpandTimeout);
    window.kommoExpandTimeout = setTimeout(() => {
      expandAllServiceMessages();
    }, 300);
  });

  // Start observing the chat feed area
  const feedContainer = document.querySelector('.js-card-feed') ||
                       document.querySelector('[class*="feed"]') ||
                       document.body;

  observer.observe(feedContainer, observerOptions);
})();
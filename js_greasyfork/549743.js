// ==UserScript==
// @name         AO3 Vanity
// @namespace    https://github.com/serpentineegg/ao3-vanity
// @version      0.1.2
// @description  Add Twitter search links to AO3 works
// @author       serpentineegg
// @match        *://archiveofourown.org/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549743/AO3%20Vanity.user.js
// @updateURL https://update.greasyfork.org/scripts/549743/AO3%20Vanity.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create Twitter search URL using twiiit.com
  function createTwitterSearchUrl(workUrl) {
    const cleanUrl = workUrl.replace('https://', '');
    const encodedUrl = encodeURIComponent(cleanUrl);
    return `https://twiiit.com/search?f=tweets&q=${encodedUrl}`;
  }

  // Create a Twitter search link element
  function createTwitterLink(twitterUrl, linkText = 'Twitter') {
    const searchLink = document.createElement('a');
    searchLink.href = twitterUrl;
    searchLink.target = '_blank';
    searchLink.rel = 'noopener noreferrer';
    searchLink.className = 'twitter-links';
    searchLink.textContent = linkText;
    searchLink.title = 'Search Twitter for mentions of this work';
    return searchLink;
  }

  // Add Twitter search info to any work stats section
  function addTwitterSearchToStats(workElement, workUrl) {
    // Check if already exists
    if (workElement.querySelector('.twitter-links')) {
      return;
    }

    const twitterUrl = createTwitterSearchUrl(workUrl);

    // Check if this is a work.meta.group first
    if (workElement.matches('dl.work.meta.group')) {
      // For work.meta.group, insert after the stats section
      const statsSection = workElement.querySelector('dd.stats');
      if (statsSection) {
        const dt = document.createElement('dt');
        dt.className = 'twitter-links';
        dt.textContent = 'External Links:';

        const dd = document.createElement('dd');
        dd.className = 'twitter-links';
        dd.appendChild(createTwitterLink(twitterUrl));

        // Insert after the stats section
        const nextSibling = statsSection.nextSibling;
        if (nextSibling) {
          workElement.insertBefore(dt, nextSibling);
          workElement.insertBefore(dd, nextSibling);
        } else {
          workElement.appendChild(dt);
          workElement.appendChild(dd);
        }
      }
      return;
    }

    // Try different stats container locations for other elements
    let statsContainer = workElement.querySelector('dl.stats');

    // If no dl.stats, try the nested stats in work meta
    if (!statsContainer) {
      statsContainer = workElement.querySelector('dd.stats dl.stats');
    }

    if (!statsContainer) {
      return;
    }

    // Create the dd wrapper element
    const dd = document.createElement('dd');
    dd.className = 'twitter-links';
    dd.appendChild(createTwitterLink(twitterUrl, 'Twitter Links'));

    // For regular stats containers, append the wrapped link
    statsContainer.appendChild(dd);
  }

  // Process all work elements on any page
  function processAllWorks() {
    // Find all work elements with different selectors
    const workSelectors = [
      'li.work.blurb',              // Standard work listings
      'li.reading.work.blurb',      // Reading history
      'li.bookmark.blurb',          // Bookmarks
      'div.work.meta',              // Individual work pages
      'dl.work.meta.group',         // Work metadata sections
      'li.work'                     // Generic work items
    ];

    workSelectors.forEach(selector => {
      const workElements = document.querySelectorAll(selector);

      workElements.forEach(workElement => {
        let workUrl = null;

        // Try to find the work URL in different ways
        const titleLink = workElement.querySelector('h4.heading a[href*="/works/"]');
        if (titleLink) {
          workUrl = titleLink.href;
        } else if (selector === 'div.work.meta' || selector === 'dl.work.meta.group') {
          // For individual work pages
          workUrl = window.location.href;
        } else {
          // Try to find work ID in element attributes
          const workId = workElement.id?.match(/work[_-](\d+)/)?.[1] ||
            workElement.className?.match(/work-(\d+)/)?.[1];
          if (workId) {
            workUrl = `https://archiveofourown.org/works/${workId}`;
          }
        }

        if (workUrl) {
          addTwitterSearchToStats(workElement, workUrl);
        }
      });
    });
  }

  // Main initialization function
  function init() {
    // Process all works on any AO3 page
    processAllWorks();

    // Set up observer for dynamically loaded content
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
          // Debounce the processing to avoid excessive calls
          clearTimeout(window.twitterSearchTimeout);
          window.twitterSearchTimeout = setTimeout(processAllWorks, 500);
        }
      });
    });

    // Observe the main content area
    const mainContent = document.querySelector('#main') || document.body;
    if (mainContent) {
      observer.observe(mainContent, {
        childList: true,
        subtree: true
      });
    }
  }

  // Wait for page to load and initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})()

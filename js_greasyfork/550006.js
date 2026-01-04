// ==UserScript==
// @name         Google Search: Remove Sponsored Results
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Hide Google Search ads/sponsored results
// @author       GooglyBlox
// @license      MIT
// @run-at       document-start
// @grant        none
//
// @match       https://www.google.com/search*
// @match       https://encrypted.google.com/search*
// @match       https://www.google.com/webhp*
// @match       https://www.google.com/*?q=*
//
// @exclude     https://*.google.*/*tbm=isch*
// @exclude     https://*.google.*/*tbm=nws*
// @exclude     https://*.google.*/*tbm=lcl*
// @downloadURL https://update.greasyfork.org/scripts/550006/Google%20Search%3A%20Remove%20Sponsored%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/550006/Google%20Search%3A%20Remove%20Sponsored%20Results.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const AD_SELECTORS = [
    '#tads',
    '#tvcap',
    '[data-text-ad="1"]',
    'span.U3A9Ac.qV8iec',
    '.vbIt3d',
    '[role="region"][aria-label="Ads"]',
    '.GUyUUb[data-vcap="1"]'
  ];

  const CONTAINER_SELECTORS = [
    '.uEierd',
    '.v7W49e',
    '.mnr-c',
    '.xpd',
    '.g',
    '.kp-blk',
    '.Yu2Dnd',
    '.PLy5Wb'
  ].join(',');

  function removeAdElement(element) {
    const container = element.closest(CONTAINER_SELECTORS);
    const targetElement = container || element;
    if (targetElement && targetElement.parentElement) {
      targetElement.remove();
    }
  }

  function removeAdsFromNode(node = document) {
    const adElements = node.querySelectorAll(AD_SELECTORS.join(','));
    adElements.forEach(element => {
      if (element.parentElement) {
        element.remove();
      }
    });

    const adContainers = node.querySelectorAll('.uEierd, .Yu2Dnd, .PLy5Wb');
    adContainers.forEach(container => {
      if (container.querySelector(AD_SELECTORS.join(','))) {
        container.remove();
      }
    });

    const sponsoredElements = node.querySelectorAll('span, div');
    sponsoredElements.forEach(element => {
      const text = element.textContent?.trim().toLowerCase();
      if (text && text.length <= 20 && (text === 'sponsored' || text === 'ad' || text === 'sponsored results')) {
        removeAdElement(element);
      }
    });
  }

  removeAdsFromNode();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          removeAdsFromNode(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
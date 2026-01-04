// ==UserScript==
// @name         unblur recipies on babi.sh
// @namespace    https://babi.sh/
// @version      1.0
// @description  Changes some styles to show recipes on babi.sh, big recipes will not show up completely.
// @match        https://www.babi.sh/*
// @run-at       document-idle
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/561203/unblur%20recipies%20on%20babish.user.js
// @updateURL https://update.greasyfork.org/scripts/561203/unblur%20recipies%20on%20babish.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const targets = {
    hide: [
      '/html/body/div[1]/div/div/div/div[2]/div[2]/div[2]/div[2]/div/div/div',
      '/html/body/div[1]/div/div/div/div[2]/div[2]/div[2]/div[1]/div/div[2]'
    ],
    autoHeight: [
      '/html/body/div[1]/div/div/div/div[2]/div[2]/div[2]/div[1]/div'
    ]
  };

  function applyStyles() {
    // Hide elements
    targets.hide.forEach(xpath => {
      const node = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (node) {
        node.style.setProperty('display', 'none', 'important');
      }
    });

    // Set height auto
    targets.autoHeight.forEach(xpath => {
      const node = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (node) {
        node.style.setProperty('height', 'auto', 'important');
      }
    });
  }

  // Run once DOM exists
  document.addEventListener('DOMContentLoaded', applyStyles);

  // Observe future React/Chakra re-renders
  const observer = new MutationObserver(applyStyles);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

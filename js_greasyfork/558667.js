// ==UserScript==
// @name         LinkedIn Easy Apply Auto-Unfollow
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically unchecks the 'Follow company' checkbox on LinkedIn Easy Apply
// @match        https://www.linkedin.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558667/LinkedIn%20Easy%20Apply%20Auto-Unfollow.user.js
// @updateURL https://update.greasyfork.org/scripts/558667/LinkedIn%20Easy%20Apply%20Auto-Unfollow.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function uncheckFollowBox() {
    const checkbox = document.getElementById('follow-company-checkbox');
    if (checkbox && checkbox.checked) {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  uncheckFollowBox();
  const observer = new MutationObserver(uncheckFollowBox);
  observer.observe(document.body, { childList: true, subtree: true });
})();
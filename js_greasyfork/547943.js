// ==UserScript==
// @name        F1 TV for Brave
// @description Enables viewing Formula 1 TV streams using Brave browser by identifying as a regular Chrome browser.
// @author      bassz
// @namespace   bassz
// @version     1.0
// @license     GNU GPLv3
// @match       https://f1tv.formula1.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/547943/F1%20TV%20for%20Brave.user.js
// @updateURL https://update.greasyfork.org/scripts/547943/F1%20TV%20for%20Brave.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const nav = window.navigator;
  if (nav.brave) {
    if (nav.brave.constructor && nav.brave.constructor.prototype && nav.brave.constructor.prototype.isBrave) {
      nav.brave.constructor.prototype.isBrave = undefined;
    }
    if (typeof nav.brave.isBrave === 'function') {
      nav.brave.isBrave = undefined;
    }
    if (nav.constructor && nav.constructor.prototype && 'brave' in nav.constructor.prototype) {
      delete nav.constructor.prototype['brave'];
    }
  }
})();

// ==UserScript==
// @name          DeviantArt.com: sort gallery by newest by default
// @description   Automatically sets gallery sort order to newest on DeviantArt
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @version       1.0.0
// @match         https://www.deviantart.com/*
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @run-at        document-start
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561826/DeviantArtcom%3A%20sort%20gallery%20by%20newest%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/561826/DeviantArtcom%3A%20sort%20gallery%20by%20newest%20by%20default.meta.js
// ==/UserScript==

/**
 * IMPORTANT: Editing anything here in Tampermonkey will turn off
 * the script updates. Behavior with other script managers is unknown.
 * This can be restored in settings, but it might be hard to find,
 * so it's better to reinstall the script if you're not sure.
*/

/* jshint esversion: 11 */

(function() {
  'use strict';

  const TARGET_ORDER = 'newest';

  const enforceGalleryOrder = () => {
    const url = new URL(location.href);

    if (
      (!url.pathname.match(/^\/[^/]+\/gallery(\/all)?$/)) ||
      (url.searchParams.has('order'))
    ) return;

    url.pathname = url.pathname.replace(/\/gallery$/, '/gallery/all');
    url.searchParams.set('order', TARGET_ORDER);

    location.href = url.toString();
  };

  const watchHistoryMethod = (type) => {
    const originalFn = history[type];

    history[type] = function() {
      const result = originalFn.apply(this, arguments);
      enforceGalleryOrder();
      return result;
    };
  };

  watchHistoryMethod('pushState');
  watchHistoryMethod('replaceState');
  enforceGalleryOrder();
}());

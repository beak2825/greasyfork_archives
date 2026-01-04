// ==UserScript==
// @name         Change Deviantart "sort by" option back to newest
// @namespace    https://www.deviantart.com
// @version      2025-11-16
// @description  This replaces the default "/gallery" URL with "/gallery/all?order=newest" in order to make newest sort default for a user's gallery page. You must click on the "all" gallery, or manually refresh the page to activate. This just a quick patch because I don't know JS.
// @author       Michael Washboard
// @match        https://www.deviantart.com/*gallery
// @match        https://www.deviantart.com/*gallery/all
// @icon         https://st.deviantart.net/eclipse/icons/favicon-v2-16x16.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556022/Change%20Deviantart%20%22sort%20by%22%20option%20back%20to%20newest.user.js
// @updateURL https://update.greasyfork.org/scripts/556022/Change%20Deviantart%20%22sort%20by%22%20option%20back%20to%20newest.meta.js
// ==/UserScript==
const { href } = window.location;
if (href.slice(-1) == 'l') {
  window.location.replace(href + '?order=newest')
} else if (href.slice(-1) !== '/all?order=newest') {
  window.location.replace(href + '/all?order=newest');
}
// ==UserScript==
// @name        SMBC title text fix
// @namespace   https://www.smbc-comics.com/
// @version     2
// @description Removes HREF from title text in SMBC comics to allow for reading on long press.
// @author      Tehhund
// @match       https://www.smbc-comics.com/*
// @match       https://smbc-comics.com/*
// @icon        https://www.smbc-comics.com/favicon.ico
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557594/SMBC%20title%20text%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/557594/SMBC%20title%20text%20fix.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

// cc-comic is always wrapped in a href which is wrapped in cc-comicbody, so we just move the cc-comic element out of the href and into the cc-comicbody element.
(function () { document.getElementById('cc-comicbody').appendChild(document.getElementById('cc-comic')); })();
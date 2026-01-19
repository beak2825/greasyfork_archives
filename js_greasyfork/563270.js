// ==UserScript==
// @name         DriveThruRPG Legacy Redirect
// @namespace    https://greasyfork.org/users/accidental-expert
// @version      1.0.0
// @license MIT
// @description  Redirect legacy.drivethrurpg.com to drivethrurpg.com (preserve path/query/hash)
// @author       you
// @match        *://legacy.drivethrurpg.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563270/DriveThruRPG%20Legacy%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/563270/DriveThruRPG%20Legacy%20Redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Preserve path/query/hash
  const targetHost = 'www.drivethrurpg.com';
  const targetUrl =
    'https://' + targetHost + location.pathname + location.search + location.hash;

  // Avoid loops
  if (location.hostname === 'legacy.drivethrurpg.com' && location.href !== targetUrl) {
    location.replace(targetUrl);
  }
})();
// ==UserScript==
// @name         Spotify Login – ensure password login
// @description  Automatically redirects the Spotify login page to the username/password based form, instead of the form asking for a login code being sent by email.
// @license      MIT
// @match        *://accounts.spotify.com/*/login*
// @grant        none
// @run-at       document-start
// @version 0.0.1.20251208203416
// @namespace https://greasyfork.org/users/7734
// @downloadURL https://update.greasyfork.org/scripts/558355/Spotify%20Login%20%E2%80%93%20ensure%20password%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/558355/Spotify%20Login%20%E2%80%93%20ensure%20password%20login.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const url = new URL(location.href);
  if (!url.searchParams.has('allow_password')) {
    url.searchParams.set('allow_password', '1');
    location.replace(url.href);
  }
})();
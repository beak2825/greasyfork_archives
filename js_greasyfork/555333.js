// ==UserScript==
// @name         Apple Music - Open Apple Music links in desktop app
// @author       notmayo
// @description  Redirect Apple Music URLs to the desktop app (Music://) and close the tab
// @version      1.1
// @license      MIT
// @match        *://music.apple.com/*
// @match        *://itunes.apple.com/*
// @run-at       document-start
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.apple.com
// @namespace    https://greasyfork.org/en/users/1536062-notmayo
// @downloadURL https://update.greasyfork.org/scripts/555333/Apple%20Music%20-%20Open%20Apple%20Music%20links%20in%20desktop%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/555333/Apple%20Music%20-%20Open%20Apple%20Music%20links%20in%20desktop%20app.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const url = new URL(location.href);
  const path = url.pathname.replace(/^\/+/, '');
  const full = `${path}${url.search}`;
  const trackRe   = /^([^/]+)\/album\/([^?]+)\?i=\d+/i;
  const releaseRe = /^([^/]+)\/(album|single)\/([^?]+)/i;

  let minimalPath = full;
  let m;
  if ((m = full.match(trackRe))) {
    minimalPath = `${m[1]}/album/${m[2]}${url.search}`;
  } else if ((m = full.match(releaseRe))) {
    minimalPath = `${m[1]}/${m[2]}/${m[3]}`;
  }

  // Use itmss:// to trigger the native “Open in Music” prompt
  const uri = `itmss://music.apple.com/${minimalPath}`;
  console.log(`Redirecting to ${uri}`);
  location.replace(uri);
  setTimeout(() => window.close(), 800);
})();
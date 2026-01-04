// ==UserScript==
// @name Old Reddit Redirect
// @namespace old-reddit-redirect
// @version      0.1.2
// @description  Redirects from *.reddit.com to old.reddit.com
// @author       github.com/localhorst (forked from github.com/richkmls)
// @license MIT
// @match *://*.reddit.com/*
// @exclude /^https?://[a-z]{2}\.reddit\.com/*
// @exclude *out.reddit.com/*
// @exclude *://*.reddit.com/gallery/*
// @exclude *://*.reddit.com/media*
// @exclude *://*.reddit.com/notifications*
// @exclude *://*.reddit.com/message/compose*
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552250/Old%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/552250/Old%20Reddit%20Redirect.meta.js
// ==/UserScript==

// Enforce strict mode for better code quality
'use strict';

// Declare constant for current URL
const currentUrl = window.location.href;

// Declare constant for old reddit URL
const oldRedditUrl = 'https://old.reddit.com/';

// Check if the current URL does not include old.reddit.com
if (!currentUrl.includes("old.reddit.com") && currentUrl.includes("reddit.com")) {
  // Use regex literal and constant for new URL
  const newUrl = currentUrl.replace(/^https?:\/\/(www\.)?reddit.com\//, oldRedditUrl);
  // Redirect to new URL without history entry
  window.location.replace(newUrl);
}

// ==UserScript==
// @name 			Redirect X & Twitter to xcancel.com in address bar
// @namespace		x.com-xcancel.com-redirect
// @version			2.0.1
// @description	Redirect x.com and twitter.com URLs to xcancel.com in address bar.
// @author			github.com/localhorst
// @license MIT
// @match 			*://*.x.com/*
// @match 			*://*.twitter.com/*
// @exclude 		*://*.x.com/i/*
// @exclude 		*://*.twitter.com/i/*
// @run-at 			document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/549805/Redirect%20X%20%20Twitter%20to%20xcancelcom%20in%20address%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/549805/Redirect%20X%20%20Twitter%20to%20xcancelcom%20in%20address%20bar.meta.js
// ==/UserScript==

// Enforce strict mode for better code quality
'use strict';

// Declare constant for current URL
const currentUrl = window.location.href;

// Declare constant for old reddit URL
const xCancelUrl = 'https://xcancel.com/';

// Check if the current URL does not include old.x.com
if ((currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) && !currentUrl.includes("twitter.com/i/") && !currentUrl.includes("x.com/i/")) {
  // Use regex literal and constant for new URL
	const newUrl = currentUrl.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, xCancelUrl);
  // Redirect to new URL without history entry
  window.location.replace(newUrl);
}

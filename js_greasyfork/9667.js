// Twitter Link Enabler
// Copyright 2015 Marc Sluiter
// Licensed under the Apache License, Version 2.0
// https://github.com/slintes/userscripts/blob/master/LICENSE
//
// --------------------------------------------------------------------
//
// this is a userscript
// for Firefox please install the Greasemonkey addon: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
// for Chrome I recommend Tampermonkey (but it's not needed): https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name       Twitter Link Enabler
// @namespace  http://www.slintes.net
// @version    0.1.3
// @description  enable links in retweets
// @include    https://twitter.com*
// @downloadURL https://update.greasyfork.org/scripts/9667/Twitter%20Link%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/9667/Twitter%20Link%20Enabler.meta.js
// ==/UserScript==

function enableLinks(e) {

  var elements, thisElement, i;
  
  elements = document.evaluate(
  	"//a[(@class='twitter-timeline-link') and (string-length(@data-expanded-url) > 0)]",
  	document,
  	null,
  	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
  	null
  );
  
  for (i = 0; i < elements.snapshotLength; i++) {
  	thisElement = elements.snapshotItem(i);
  	GM_log("setting new href!");
  	thisElement.href = thisElement.data-expanded-url;
  }

}

document.addEventListener("DOMNodeInserted", enableLinks(e), true);
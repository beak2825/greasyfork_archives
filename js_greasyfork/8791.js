// ==UserScript==
// @name          biglistofwebsites direct urls
// @description   Makes urls open directly
// @include       http://biglistofwebsites.com/*
// @include       http://biglistofwebsites.com/list-top*
// @version       1.0.2
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @grant         none
// @run-at        document-start
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/8791/biglistofwebsites%20direct%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/8791/biglistofwebsites%20direct%20urls.meta.js
// ==/UserScript==

setMutationHandler(document, 'a[href*="go/"]', function(nodes) {
  nodes.forEach(function(n) {
    n.href = n.href.replace(/^(|.+?\/)go/, 'http://');
  });
  return true;
});

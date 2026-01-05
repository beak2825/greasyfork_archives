// ==UserScript==
// @name        Reddit: Remove 'np'
// @namespace   greasyfork.org/en/users/9965
// @description Changes np links to regular links
// @version     1.0
// @match       http://www.reddit.com/*
// @match       https://www.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8775/Reddit%3A%20Remove%20%27np%27.user.js
// @updateURL https://update.greasyfork.org/scripts/8775/Reddit%3A%20Remove%20%27np%27.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", fixLinks, false);

if( document.readyState === "complete" ) {
  fixLinks();
}

function fixLinks() {
  Array.forEach( document.links, function(a) {
    a.href = a.href.replace(/np\.reddit/i, "www.reddit");
  });
}



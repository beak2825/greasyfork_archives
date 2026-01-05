// ==UserScript==
// @name           Fix Wikilook URLs
// @version        1.00
// @namespace      https://greasyfork.org/en/users/9939
// @description    Replaces Wikipedia links on the specified sites, to make their hrefs point only to https//:en.wikipedia.org/…
// @include        http://www.reddit.com/*
// @include        https://www.reddit.com/*
// @include        http://www.google.co.uk/*
// @include        https://www.google.co.uk/*
// @downloadURL https://update.greasyfork.org/scripts/8759/Fix%20Wikilook%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/8759/Fix%20Wikilook%20URLs.meta.js
// ==/UserScript==

var links,thisLink;
links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);
    thisLink.href = thisLink.href.replace('http://en.m.wikipedia', 
                                          'https://en.wikipedia');
    thisLink.href = thisLink.href.replace('http://en.wikipedia', 
                                          'https://en.wikipedia');
}

// ==UserScript==
// @name        Fix forum navigation when using the web archive
// @author      pizzahut
// @description When using the web archive, some forums can't be navigated because the forum link use session IDs, leading to a "not found" error even if the page is actually archived. To work around this issue, this script removes session IDs.
// @license     MIT
// @match       https://web.archive.org/web/*/http*://forums.bots-united.com/*
// @namespace   https://greasyfork.org/users/1117297-pizzahut
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/556816/Fix%20forum%20navigation%20when%20using%20the%20web%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/556816/Fix%20forum%20navigation%20when%20using%20the%20web%20archive.meta.js
// ==/UserScript==
var links, thisLink, i;
links = document.evaluate("//a[ contains(@href, 's=') ]",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < links.snapshotLength; i++)
{
  thisLink = links.snapshotItem(i);
  thisLink.href = thisLink.href.replace(/\?s=[0-9a-z]+$/,'');
  thisLink.href = thisLink.href.replace(/s=[0-9a-z]+&/,'');
  thisLink.href = thisLink.href.replace(/&s=[0-9a-z]+/,'');
}

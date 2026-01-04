// ==UserScript==
// @name             reddit mobile to pullpush link
// @description      replace nonfunctioning searchbar with link to pullpush
// @match            https://www.reddit.com/*
// @version          1.0
// @license          WTFPL
// @namespace https://greasyfork.org/users/1538977
// @downloadURL https://update.greasyfork.org/scripts/556170/reddit%20mobile%20to%20pullpush%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/556170/reddit%20mobile%20to%20pullpush%20link.meta.js
// ==/UserScript==

const a = document.createElement("a");
a.href = window.location.href.replace("www.reddit.com", "undelete.pullpush.io");
a.innerHTML = "open in pullpush";
document.querySelector("search-dynamic-id-cache-controller").replaceWith(a);
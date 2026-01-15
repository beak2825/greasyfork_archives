// ==UserScript==
// @name         Stick To Old Reddit
// @description  Always redirects to old-Reddit, avoiding Reddit's redesign.
// @match        *://www.reddit.com/*
// @match        *://reddit.com/*
// @match        *://old.reddit.com/*
// @match        *://sh.reddit.com/*
// @exclude      *://www.reddit.com/poll/*
// @exclude      *://www.reddit.com/media/*
// @exclude      *://www.reddit.com/gallery/*
// @exclude      *://www.reddit.com/compose/*
// @exclude      *://www.reddit.com/message/compose/*
// @version      1.0.1
// @run-at       document-start
// @grant        none
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @namespace https://greasyfork.org/users/1559746
// @downloadURL https://update.greasyfork.org/scripts/562495/Stick%20To%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/562495/Stick%20To%20Old%20Reddit.meta.js
// ==/UserScript==

if (window.location.hostname !== "old.reddit.com") {
    window.location.replace("https://old.reddit.com" + window.location.pathname + window.location.search + window.location.hash);
}
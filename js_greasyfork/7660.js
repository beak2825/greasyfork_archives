// ==UserScript==
// @name           Demo Seen
// @namespace      DS
// @homepage       http://userscripts.org/users/89794
// @description    Adds a "visited" colour to pouet.net, so you can see which pages you have already visited.
// @include        http://pouet.net/*
// @include        http://www.pouet.net/*
// @version        1.0.0
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7660/Demo%20Seen.user.js
// @updateURL https://update.greasyfork.org/scripts/7660/Demo%20Seen.meta.js
// ==/UserScript==

GM_addStyle("a:visited { color: #7799cc; }");
